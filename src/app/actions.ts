'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

const getShadowEmail = (id: string) => `${id}@student.studiocard.local`;

// 1. STANDARD LOGIN (Teachers/Admins)
export async function login(formData: FormData) {
    const supabase = await createClient()
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) redirect('/error')
    revalidatePath('/', 'layout')
    redirect('/studio/dashboard') // Redirect to Dashboard
}

// 2. STUDENT SIGNUP (Creates Shadow Account)
export async function signupStudent(formData: FormData) {
    const supabase = await createClient(); // For read-only checks
    const supabaseAdmin = createAdminClient(); // For Admin writes

    const fullName = formData.get("fullName") as string;
    const passcode = formData.get("passcode") as string; 
    const accessCode = formData.get("accessCode") as string; 
    const slug = formData.get("slug") as string;
    const teacherSlug = formData.get("teacherSlug") as string;
    const color = formData.get("color") as string;

    console.log(`🚀 Starting Signup for: ${fullName} (${slug})`);

    // A. Validation
    const { data: existing } = await supabase.from("artists").select("id").eq("slug", slug).single();
    if (existing) return { error: "That URL is already taken." };

    // B. Teacher Lookup (with Logging)
    let teacherId = null;
    if (teacherSlug) {
        console.log(`🔎 Looking up teacher: ${teacherSlug}`);
        const { data: teacher } = await supabase.from("teachers").select("id").eq("username", teacherSlug).single();
        if (teacher) {
            teacherId = teacher.id;
            console.log(`✅ Teacher Found: ${teacherId}`);
        } else {
            console.log(`⚠️ Teacher '${teacherSlug}' not found.`);
        }
    }

    // C. Generate ID
    // We attempt to define the ID, but we will trust what Auth returns
    const generatedId = crypto.randomUUID();
    const shadowEmail = getShadowEmail(generatedId);

    // D. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        userId: generatedId, // Request this ID
        email: shadowEmail,
        password: passcode,
        email_confirm: true,
        user_metadata: { role: "student" }
    });

    if (authError || !authData.user) {
        console.error("❌ Auth Creation Failed:", authError);
        return { error: "Could not create account. Try a more complex passcode." };
    }

    // CRITICAL FIX: Use the ID Supabase *actually* assigned (just in case it ignored ours)
    const finalUserId = authData.user.id;
    console.log(`✅ Auth User Created. ID: ${finalUserId}`);

    // E. Create DB Record (Using finalUserId)
    const { error: dbError } = await supabaseAdmin.from("artists").insert({
        id: finalUserId, // LINKING TO AUTH ID
        full_name: fullName,
        slug: slug,
        access_code: accessCode || '1234',
        teacher_id: teacherId,
        card_color: color,
        is_private: false
    });

    if (dbError) {
        console.error("❌ DB Insert Failed:", dbError);
        // Cleanup: Delete the orphan auth user
        await supabaseAdmin.auth.admin.deleteUser(finalUserId);
        return { error: "Database error: " + dbError.message };
    }

    console.log("✅ DB Record Inserted. Attempting Auto-Login...");

    // F. Auto-Login
    // We use the original shadow email logic because if Supabase respected our ID, it matches.
    // If Supabase changed the ID, we need to make sure we use the right email.
    // Ideally, Supabase respects the ID. If not, the email we sent (shadowEmail) is linked to finalUserId.
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: shadowEmail,
        password: passcode
    });

    if (loginError) {
        console.error("❌ Auto-Login Failed:", loginError);
        return { error: "Created, but login failed." };
    }

    return { success: true, slug, userId: finalUserId };
}

// 3. STUDENT LOGIN
export async function loginStudent(formData: FormData) {
    const supabase = await createClient();
    const slug = formData.get("slug") as string;
    const passcode = formData.get("passcode") as string;

    // 1. Find User to get ID
    const { data: artist } = await supabase.from("artists").select("id").eq("slug", slug).single();

    if (!artist) {
        return { error: "Card not found." };
    }

    // 2. Log In using constructed email
    const { error } = await supabase.auth.signInWithPassword({
        email: `${artist.id}@student.studiocard.local`, 
        password: passcode
    });

    if (error) {
        return { error: "Incorrect passcode." };
    }

    // 3. SUCCESS
    return { success: true };
}

// 4. TEACHER LOGIN
export async function loginTeacher(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) return { error: error.message }

    if (authData.user) {
        const { data: teacher } = await supabase
            .from('teachers')
            .select('username')
            .eq('id', authData.user.id)
            .single()

        if (teacher) {
            return { success: true, username: teacher.username }
        }
    }

    return { error: "Login successful, but profile not found." }
}

// 5. TEACHER SIGNUP
export async function signupTeacher(formData: FormData) {
    const supabase = await createClient()       
    const supabaseAdmin = createAdminClient()   

    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const licenseKey = formData.get('licenseKey') as string

    // A. Validate License Key
    const { data: keyData, error: keyError } = await supabaseAdmin
        .from('subscription_codes')
        .select('*')
        .eq('code', licenseKey)
        .single()

    if (keyError || !keyData) return { error: "Invalid License Key." }
    if (keyData.is_used) return { error: "This License Key has already been used." }

    // B. Validate Username
    const { data: existingUser } = await supabaseAdmin
        .from('teachers')
        .select('id')
        .eq('username', username)
        .single()

    if (existingUser) return { error: "That username is already taken." }

    // C. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'teacher', tier: keyData.tier }
    })

    if (authError || !authData.user) return { error: authError?.message || "Failed to create account." }

    const newUserId = authData.user.id

    // D. Create Teacher DB Record
    const { error: dbError } = await supabaseAdmin
        .from('teachers')
        .insert({
            id: newUserId,
            email,
            username,
            slug: username, // Explicitly saving slug
            full_name: fullName,
            subscription_tier: keyData.tier,
            is_active: true
        })

    if (dbError) {
        await supabaseAdmin.auth.admin.deleteUser(newUserId)
        return { error: "Database error: " + dbError.message }
    }

    // E. Burn License Key
    await supabaseAdmin
        .from('subscription_codes')
        .update({ is_used: true, used_by: newUserId })
        .eq('code', licenseKey)

    // F. Auto-Login
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (loginError) return { error: "Account created, but auto-login failed. Please sign in." }

    return { success: true, username }
}

// 6. GET STUDIO SETTINGS
export async function getStudioSettings() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const { data: teacher, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !teacher) return { error: "Teacher profile not found" };

    const { count } = await supabase
        .from('artists')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', teacher.id);

    return {
        teacher,
        studentCount: count || 0,
        email: user.email 
    };
}

// 7. UPDATE STUDIO SETTINGS
export async function updateStudioSettings(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not logged in" };

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (password && password.trim() !== '') {
        const { error: passError } = await supabase.auth.updateUser({ password });
        if (passError) return { error: `Password Error: ${passError.message}` };
    }

    if (email && email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) return { error: `Email Error: ${emailError.message}` };
    }

    const { error: dbError } = await supabase
        .from('teachers')
        .update({ full_name: fullName })
        .eq('id', user.id);

    if (dbError) return { error: dbError.message };

    revalidatePath('/studio/account');
    return { success: true };
}