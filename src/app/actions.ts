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
    redirect('/account')
}

// 2. STUDENT SIGNUP (Creates Shadow Account)
export async function signupStudent(formData: FormData) {
    const supabase = await createClient();
    const supabaseAdmin = createAdminClient();

    const fullName = formData.get("fullName") as string;
    const passcode = formData.get("passcode") as string; // Auth Password
    const accessCode = formData.get("accessCode") as string; // Grandma Code
    const slug = formData.get("slug") as string;
    const teacherSlug = formData.get("teacherSlug") as string;
    const color = formData.get("color") as string;

    // Validation
    const { data: existing } = await supabase.from("artists").select("id").eq("slug", slug).single();
    if (existing) return { error: "That URL is already taken." };

    // Teacher Lookup
    let teacherId = null;
    if (teacherSlug) {
        const { data: teacher } = await supabase.from("teachers").select("id").eq("slug", teacherSlug).single();
        if (teacher) teacherId = teacher.id;
    }

    // Generate ID & Email
    const newUserId = crypto.randomUUID();
    const shadowEmail = getShadowEmail(newUserId);

    // A. Create Auth User (The "Passcode" goes here, Hashed)
    const { error: authError } = await supabaseAdmin.auth.admin.createUser({
        userId: newUserId,
        email: shadowEmail,
        password: passcode,
        email_confirm: true,
        user_metadata: { role: "student" }
    });

    if (authError) {
        return { error: "Could not create account. Try a more complex passcode." };
    }

    // B. Create DB Record (NO PASSCODE stored here!)
    const { error: dbError } = await supabaseAdmin.from("artists").insert({
        id: newUserId,
        full_name: fullName,
        slug: slug,
        access_code: accessCode || '1234', // Default Grandma code
        teacher_id: teacherId,
        card_color: color,
        is_private: false
    });

    if (dbError) {
        await supabaseAdmin.auth.admin.deleteUser(newUserId);
        return { error: dbError.message };
    }

    // C. Auto-Login
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: shadowEmail,
        password: passcode
    });

    if (loginError) return { error: "Created, but login failed." };

    return { success: true, slug, userId: newUserId };
}

// 3. STUDENT LOGIN
export async function loginStudent(formData: FormData) {
    const supabase = await createClient();
    const slug = formData.get("slug") as string;
    const passcode = formData.get("passcode") as string;

    // 1. Find User
    const { data: artist } = await supabase.from("artists").select("id").eq("slug", slug).single();

    if (!artist) {
        return { error: "Card not found." };
    }

    // 2. Log In
    const { error } = await supabase.auth.signInWithPassword({
        email: `${artist.id}@student.studiocard.local`, // Reconstruct shadow email
        password: passcode
    });

    if (error) {
        return { error: "Incorrect passcode." };
    }

    // 3. SUCCESS (Do NOT redirect here)
    return { success: true };
}

// ... existing imports (createClient, createAdminClient, etc.)

// 4. TEACHER LOGIN (Updated for Redirect)
export async function loginTeacher(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 1. Attempt Login
    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // 2. Fetch the Username (Slug) for the redirect
    // We use the 'id' from the auth response to ensure we get the right teacher
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

// --- 5. TEACHER SIGNUP (License Key Model) ---
export async function signupTeacher(formData: FormData) {
    const supabase = await createClient()       // For logging in at the end
    const supabaseAdmin = createAdminClient()   // For creating the user & checking codes

    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const username = formData.get('username') as string // This is the "slug"
    const password = formData.get('password') as string
    const licenseKey = formData.get('licenseKey') as string

    // A. Validate License Key
    const { data: keyData, error: keyError } = await supabaseAdmin
        .from('subscription_codes')
        .select('*')
        .eq('code', licenseKey)
        .single()

    if (keyError || !keyData) {
        return { error: "Invalid License Key." }
    }
    if (keyData.is_used) {
        return { error: "This License Key has already been used." }
    }

    // B. Validate Username Uniqueness
    const { data: existingUser } = await supabaseAdmin
        .from('teachers')
        .select('id')
        .eq('username', username)
        .single()

    if (existingUser) {
        return { error: "That username is already taken." }
    }

    // C. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm for smoother UX
        user_metadata: { role: 'teacher', tier: keyData.tier }
    })

    if (authError || !authData.user) {
        return { error: authError?.message || "Failed to create account." }
    }

    const newUserId = authData.user.id

    // D. Create Teacher DB Record
    const { error: dbError } = await supabaseAdmin
        .from('teachers')
        .insert({
            id: newUserId,
            email,
            username,
            slug: username, // <--- ADD THIS LINE (Syncs slug with username)
            full_name: fullName,
            subscription_tier: keyData.tier,
            is_active: true
        })

    if (dbError) {
        // Cleanup: Delete auth user if DB fails to prevent "ghost" accounts
        await supabaseAdmin.auth.admin.deleteUser(newUserId)
        return { error: "Database error: " + dbError.message }
    }

    // E. Burn the License Key (Mark as used)
    await supabaseAdmin
        .from('subscription_codes')
        .update({ is_used: true, used_by: newUserId })
        .eq('code', licenseKey)

    // F. Auto-Login
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (loginError) {
        return { error: "Account created, but auto-login failed. Please sign in." }
    }

    return { success: true, username }
}

// ... existing imports

// --- 6. GET STUDIO SETTINGS (Account Page) ---
export async function getStudioSettings() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    // A. Fetch Teacher Profile
    const { data: teacher, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !teacher) return { error: "Teacher profile not found" };

    // B. Count Current Students
    const { count } = await supabase
        .from('artists')
        .select('*', { count: 'exact', head: true }) // 'head' means don't fetch data, just count
        .eq('teacher_id', teacher.id);

    return {
        teacher,
        studentCount: count || 0,
        email: user.email // Auth email might differ from DB email if not synced, usually safer to use Auth
    };
}

// --- 7. UPDATE STUDIO SETTINGS ---
export async function updateStudioSettings(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not logged in" };

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // A. Update Password (if provided)
    if (password && password.trim() !== '') {
        const { error: passError } = await supabase.auth.updateUser({ password });
        if (passError) return { error: `Password Error: ${passError.message}` };
    }

    // B. Update Email (if changed)
    // Note: This triggers a "Confirm Email" link from Supabase to the new address.
    if (email && email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) return { error: `Email Error: ${emailError.message}` };
    }

    // C. Update DB Profile
    const { error: dbError } = await supabase
        .from('teachers')
        .update({ full_name: fullName })
        .eq('id', user.id);

    if (dbError) return { error: dbError.message };

    revalidatePath('/studio/account');
    return { success: true };
}