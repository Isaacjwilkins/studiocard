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


    // A. Teacher Code Required
    if (!teacherSlug) {
        return { error: "A teacher code is required to sign up." };
    }

    // B. Validation
    const { data: existing } = await supabase.from("artists").select("id").eq("slug", slug).single();
    if (existing) return { error: "That URL is already taken." };

    // C. Teacher Lookup (Required)
    const { data: teacher } = await supabase.from("teachers").select("id, max_students").eq("username", teacherSlug).single();

    if (!teacher) {
        return { error: "Invalid teacher code. Please check with your teacher." };
    }

    // D. Check teacher's student limit
    const { count: studentCount } = await supabase
        .from("artists")
        .select("*", { count: 'exact', head: true })
        .eq("teacher_id", teacher.id);

    if (studentCount !== null && studentCount >= (teacher.max_students || 3)) {
        return { error: "This teacher's studio is at capacity. Please contact your teacher." };
    }

    const teacherId = teacher.id;

    // C. Generate ID
    // We attempt to define the ID, but we will trust what Auth returns
    const generatedId = crypto.randomUUID();
    const shadowEmail = getShadowEmail(generatedId);

    // D. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        id: generatedId, // Request this ID
        email: shadowEmail,
        password: passcode,
        email_confirm: true,
        user_metadata: { role: "student" }
    });

    if (authError || !authData.user) {
        return { error: "Could not create account. Try a more complex passcode." };
    }

    // CRITICAL FIX: Use the ID Supabase *actually* assigned (just in case it ignored ours)
    const finalUserId = authData.user.id;

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
        // Cleanup: Delete the orphan auth user
        await supabaseAdmin.auth.admin.deleteUser(finalUserId);
        return { error: "Database error: " + dbError.message };
    }


    // F. Auto-Login
    // We use the original shadow email logic because if Supabase respected our ID, it matches.
    // If Supabase changed the ID, we need to make sure we use the right email.
    // Ideally, Supabase respects the ID. If not, the email we sent (shadowEmail) is linked to finalUserId.
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: shadowEmail,
        password: passcode
    });

    if (loginError) {
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

// 4. PASSWORD RESET REQUEST
export async function requestPasswordReset(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;

    if (!email) return { error: "Email is required" };

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/studio/reset-password`,
    });

    if (error) return { error: error.message };

    return { success: true };
}

// 5. TEACHER LOGIN
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

// 5. TEACHER SIGNUP (No license key required - free tier by default)
export async function signupTeacher(formData: FormData) {
    const supabase = await createClient()
    const supabaseAdmin = createAdminClient()

    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    // A. Validate Username
    const { data: existingUser } = await supabaseAdmin
        .from('teachers')
        .select('id')
        .eq('username', username)
        .single()

    if (existingUser) return { error: "That username is already taken." }

    // B. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'teacher', tier: 'free' }
    })

    if (authError || !authData.user) return { error: authError?.message || "Failed to create account." }

    const newUserId = authData.user.id

    // C. Create Teacher DB Record (Free tier: 3 students)
    const { error: dbError } = await supabaseAdmin
        .from('teachers')
        .insert({
            id: newUserId,
            email,
            username,
            slug: username,
            full_name: fullName,
            subscription_tier: 'free',
            subscription_status: 'free',
            max_students: 3,
            is_active: true
        })

    if (dbError) {
        await supabaseAdmin.auth.admin.deleteUser(newUserId)
        return { error: "Database error: " + dbError.message }
    }

    // D. Auto-Login
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (loginError) return { error: "Account created, but auto-login failed. Please sign in." }

    return { success: true, username, isNewUser: true }
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

// 8. GET TEACHER FEED (Inbox)
export async function getTeacherFeed() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in", tracks: [] };

    // Get all student IDs for this teacher
    const { data: students } = await supabase
        .from('artists')
        .select('id, full_name, profile_image_url, slug')
        .eq('teacher_id', user.id);

    if (!students || students.length === 0) {
        return { tracks: [], unreadCount: 0 };
    }

    const studentIds = students.map(s => s.id);

    // Get last 20 tracks from teacher's students
    const { data: tracks, error } = await supabase
        .from('tracks')
        .select('id, title, audio_url, created_at, is_read, artist_id')
        .in('artist_id', studentIds)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) return { error: error.message, tracks: [] };

    // Join artist info to tracks
    const tracksWithArtist = (tracks || []).map(track => {
        const artist = students.find(s => s.id === track.artist_id);
        return {
            ...track,
            artist_name: artist?.full_name || 'Unknown',
            artist_image: artist?.profile_image_url || null,
            artist_slug: artist?.slug || null
        };
    });

    const unreadCount = tracksWithArtist.filter(t => !t.is_read).length;

    return { tracks: tracksWithArtist, unreadCount };
}

// 9. MARK TRACK AS READ
export async function markTrackAsRead(trackId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    // Verify teacher owns this student's track
    const { data: track } = await supabase
        .from('tracks')
        .select('artist_id')
        .eq('id', trackId)
        .single();

    if (!track) return { error: "Track not found" };

    const { data: artist } = await supabase
        .from('artists')
        .select('teacher_id')
        .eq('id', track.artist_id)
        .single();

    if (!artist || artist.teacher_id !== user.id) {
        return { error: "Not authorized" };
    }

    const { error } = await supabase
        .from('tracks')
        .update({ is_read: true })
        .eq('id', trackId);

    if (error) return { error: error.message };

    revalidatePath('/studio/dashboard');
    return { success: true };
}

// 10. SEND FEEDBACK
export async function sendFeedback(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const artistId = formData.get('artistId') as string;
    const feedbackType = formData.get('type') as string; // 'note' or 'assignment'
    const content = formData.get('content') as string;

    // Verify teacher owns this student
    const { data: artist } = await supabase
        .from('artists')
        .select('teacher_id')
        .eq('id', artistId)
        .single();

    if (!artist || artist.teacher_id !== user.id) {
        return { error: "Not authorized" };
    }

    const updateField = feedbackType === 'assignment' ? 'current_assignments' : 'current_note';

    const { error } = await supabase
        .from('artists')
        .update({ [updateField]: content })
        .eq('id', artistId);

    if (error) return { error: error.message };

    revalidatePath('/studio/dashboard');
    return { success: true };
}

// 11. CHECK STUDENT LIMIT
export async function checkStudentLimit() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const { data: teacher } = await supabase
        .from('teachers')
        .select('max_students, subscription_status')
        .eq('id', user.id)
        .single();

    if (!teacher) return { error: "Teacher not found" };

    const { count } = await supabase
        .from('artists')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', user.id);

    const currentCount = count || 0;
    const maxStudents = teacher.max_students || 3;
    const isFree = teacher.subscription_status === 'free' || !teacher.subscription_status;

    return {
        currentCount,
        maxStudents,
        canAddMore: currentCount < maxStudents,
        shouldShowUpgrade: isFree && currentCount >= maxStudents
    };
}

// 12. SEND AUDIO FEEDBACK
export async function sendAudioFeedback(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const artistId = formData.get('artistId') as string;
    const audioBlob = formData.get('audio') as File;

    if (!audioBlob) return { error: "No audio provided" };

    // Verify teacher owns this student
    const { data: artist } = await supabase
        .from('artists')
        .select('teacher_id')
        .eq('id', artistId)
        .single();

    if (!artist || artist.teacher_id !== user.id) {
        return { error: "Not authorized" };
    }

    // Upload audio to storage
    const fileName = `feedback/${artistId}/${Date.now()}.webm`;
    const { error: uploadError } = await supabase.storage
        .from('audio-tracks')
        .upload(fileName, audioBlob, { upsert: true });

    if (uploadError) return { error: "Upload failed: " + uploadError.message };

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('audio-tracks')
        .getPublicUrl(fileName);

    // Update artist with audio feedback URL
    const { error: dbError } = await supabase
        .from('artists')
        .update({ audio_feedback_url: urlData.publicUrl })
        .eq('id', artistId);

    if (dbError) return { error: dbError.message };

    revalidatePath('/studio/dashboard');
    return { success: true, url: urlData.publicUrl };
}

// ============================================
// RECITAL ACTIONS
// ============================================

// 13. GET TEACHER RECITALS
export async function getTeacherRecitals() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in", recitals: [] };

    const { data: recitals, error } = await supabase
        .from('recitals')
        .select(`
            id,
            title,
            slug,
            event_date,
            venue,
            is_active,
            created_at,
            recital_performers(id)
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

    if (error) return { error: error.message, recitals: [] };

    // Add performer count to each recital
    const recitalsWithCount = (recitals || []).map(recital => ({
        ...recital,
        performer_count: recital.recital_performers?.length || 0
    }));

    return { recitals: recitalsWithCount };
}

// 14. GET SINGLE RECITAL WITH PERFORMERS
export async function getRecital(recitalId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const { data: recital, error } = await supabase
        .from('recitals')
        .select(`
            *,
            recital_performers(*)
        `)
        .eq('id', recitalId)
        .eq('teacher_id', user.id)
        .single();

    if (error) return { error: error.message };
    if (!recital) return { error: "Recital not found" };

    // Sort performers by sort_order
    if (recital.recital_performers) {
        recital.recital_performers.sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order);
    }

    return { recital };
}

// 15. CREATE RECITAL
export async function createRecital(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const eventDate = formData.get('eventDate') as string;
    const venue = formData.get('venue') as string;
    const customNote = formData.get('customNote') as string;
    const backgroundType = formData.get('backgroundType') as string || 'plain';
    const colorTheme = formData.get('colorTheme') as string || '#6366f1';

    if (!title || !slug) {
        return { error: "Title and URL slug are required" };
    }

    // Validate slug format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(slug)) {
        return { error: "URL slug can only contain lowercase letters, numbers, and hyphens" };
    }

    const { data: recital, error } = await supabase
        .from('recitals')
        .insert({
            teacher_id: user.id,
            title,
            slug,
            event_date: eventDate || null,
            venue: venue || null,
            custom_note: customNote || null,
            background_type: backgroundType,
            color_theme: colorTheme
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            return { error: "A recital with this URL slug already exists" };
        }
        return { error: error.message };
    }

    revalidatePath('/studio/recitals');
    return { success: true, recital };
}

// 16. UPDATE RECITAL
export async function updateRecital(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const recitalId = formData.get('recitalId') as string;
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const eventDate = formData.get('eventDate') as string;
    const venue = formData.get('venue') as string;
    const customNote = formData.get('customNote') as string;
    const backgroundType = formData.get('backgroundType') as string;
    const colorTheme = formData.get('colorTheme') as string;

    if (!recitalId || !title || !slug) {
        return { error: "Recital ID, title, and URL slug are required" };
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
        return { error: "URL slug can only contain lowercase letters, numbers, and hyphens" };
    }

    const { error } = await supabase
        .from('recitals')
        .update({
            title,
            slug,
            event_date: eventDate || null,
            venue: venue || null,
            custom_note: customNote || null,
            background_type: backgroundType,
            color_theme: colorTheme,
            updated_at: new Date().toISOString()
        })
        .eq('id', recitalId)
        .eq('teacher_id', user.id);

    if (error) {
        if (error.code === '23505') {
            return { error: "A recital with this URL slug already exists" };
        }
        return { error: error.message };
    }

    revalidatePath('/studio/recitals');
    return { success: true };
}

// 17. DELETE RECITAL
export async function deleteRecital(recitalId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const { error } = await supabase
        .from('recitals')
        .delete()
        .eq('id', recitalId)
        .eq('teacher_id', user.id);

    if (error) return { error: error.message };

    revalidatePath('/studio/recitals');
    return { success: true };
}

// 18. TOGGLE RECITAL ACTIVE STATUS
export async function toggleRecitalActive(recitalId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    // Get current status
    const { data: recital } = await supabase
        .from('recitals')
        .select('is_active')
        .eq('id', recitalId)
        .eq('teacher_id', user.id)
        .single();

    if (!recital) return { error: "Recital not found" };

    const { error } = await supabase
        .from('recitals')
        .update({ is_active: !recital.is_active })
        .eq('id', recitalId)
        .eq('teacher_id', user.id);

    if (error) return { error: error.message };

    revalidatePath('/studio/recitals');
    return { success: true, is_active: !recital.is_active };
}

// 19. ADD PERFORMER TO RECITAL
export async function addPerformer(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const recitalId = formData.get('recitalId') as string;
    const artistId = formData.get('artistId') as string | null;
    const performerName = formData.get('performerName') as string;
    const performerImageUrl = formData.get('performerImageUrl') as string;
    const performerBio = formData.get('performerBio') as string;
    const performerCardSlug = formData.get('performerCardSlug') as string;
    const pieceTitle = formData.get('pieceTitle') as string;
    const composer = formData.get('composer') as string;
    const instrument = formData.get('instrument') as string;
    const durationStr = formData.get('estimatedDurationMinutes') as string;
    const isIntermission = formData.get('isIntermission') === 'true';

    if (!recitalId || !performerName || !pieceTitle) {
        return { error: "Recital ID, performer name, and piece title are required" };
    }

    // Verify teacher owns this recital
    const { data: recital } = await supabase
        .from('recitals')
        .select('id')
        .eq('id', recitalId)
        .eq('teacher_id', user.id)
        .single();

    if (!recital) return { error: "Recital not found or not authorized" };

    // Get current max sort_order
    const { data: maxOrder } = await supabase
        .from('recital_performers')
        .select('sort_order')
        .eq('recital_id', recitalId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

    const nextOrder = (maxOrder?.sort_order ?? -1) + 1;

    const { data: performer, error } = await supabase
        .from('recital_performers')
        .insert({
            recital_id: recitalId,
            artist_id: artistId || null,
            sort_order: nextOrder,
            performer_name: performerName,
            performer_image_url: performerImageUrl || null,
            performer_bio: performerBio || null,
            performer_card_slug: performerCardSlug || null,
            piece_title: pieceTitle,
            composer: composer || null,
            instrument: instrument || null,
            estimated_duration_minutes: durationStr ? parseInt(durationStr) : null,
            is_intermission: isIntermission
        })
        .select()
        .single();

    if (error) return { error: error.message };

    revalidatePath('/studio/recitals');
    return { success: true, performer };
}

// 20. UPDATE PERFORMER
export async function updatePerformer(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    const performerId = formData.get('performerId') as string;
    const performerName = formData.get('performerName') as string;
    const performerImageUrl = formData.get('performerImageUrl') as string;
    const performerBio = formData.get('performerBio') as string;
    const performerCardSlug = formData.get('performerCardSlug') as string;
    const pieceTitle = formData.get('pieceTitle') as string;
    const composer = formData.get('composer') as string;
    const instrument = formData.get('instrument') as string;
    const durationStr = formData.get('estimatedDurationMinutes') as string;

    if (!performerId) return { error: "Performer ID is required" };

    // Verify teacher owns this performer's recital
    const { data: performer } = await supabase
        .from('recital_performers')
        .select('recital_id')
        .eq('id', performerId)
        .single();

    if (!performer) return { error: "Performer not found" };

    const { data: recital } = await supabase
        .from('recitals')
        .select('id')
        .eq('id', performer.recital_id)
        .eq('teacher_id', user.id)
        .single();

    if (!recital) return { error: "Not authorized" };

    const { error } = await supabase
        .from('recital_performers')
        .update({
            performer_name: performerName,
            performer_image_url: performerImageUrl || null,
            performer_bio: performerBio || null,
            performer_card_slug: performerCardSlug || null,
            piece_title: pieceTitle,
            composer: composer || null,
            instrument: instrument || null,
            estimated_duration_minutes: durationStr ? parseInt(durationStr) : null
        })
        .eq('id', performerId);

    if (error) return { error: error.message };

    revalidatePath('/studio/recitals');
    return { success: true };
}

// 21. REMOVE PERFORMER
export async function removePerformer(performerId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    // Verify teacher owns this performer's recital
    const { data: performer } = await supabase
        .from('recital_performers')
        .select('recital_id')
        .eq('id', performerId)
        .single();

    if (!performer) return { error: "Performer not found" };

    const { data: recital } = await supabase
        .from('recitals')
        .select('id')
        .eq('id', performer.recital_id)
        .eq('teacher_id', user.id)
        .single();

    if (!recital) return { error: "Not authorized" };

    const { error } = await supabase
        .from('recital_performers')
        .delete()
        .eq('id', performerId);

    if (error) return { error: error.message };

    revalidatePath('/studio/recitals');
    return { success: true };
}

// 22. REORDER PERFORMERS
export async function reorderPerformers(recitalId: string, orderedIds: string[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Not logged in" };

    // Verify teacher owns this recital
    const { data: recital } = await supabase
        .from('recitals')
        .select('id')
        .eq('id', recitalId)
        .eq('teacher_id', user.id)
        .single();

    if (!recital) return { error: "Recital not found or not authorized" };

    // Update each performer's sort_order
    const updates = orderedIds.map((id, index) =>
        supabase
            .from('recital_performers')
            .update({ sort_order: index })
            .eq('id', id)
            .eq('recital_id', recitalId)
    );

    const results = await Promise.all(updates);
    const failed = results.find(r => r.error);

    if (failed?.error) return { error: failed.error.message };

    revalidatePath('/studio/recitals');
    return { success: true };
}

// INTERNSHIP APPLICATION
export async function submitInternshipApplication(formData: FormData) {
    const supabaseAdmin = createAdminClient();

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const message = formData.get("message") as string;
    const resumeFile = formData.get("resume") as File | null;

    if (!fullName || !email) {
        return { error: "Name and email are required." };
    }

    let resumeUrl: string | null = null;

    // Upload resume if provided
    if (resumeFile && resumeFile.size > 0) {
        const fileName = `resumes/${Date.now()}-${resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const arrayBuffer = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabaseAdmin.storage
            .from('audio-tracks')
            .upload(fileName, buffer, {
                contentType: resumeFile.type,
                upsert: false
            });

        if (uploadError) {
            return { error: "Failed to upload resume: " + uploadError.message };
        }

        const { data: urlData } = supabaseAdmin.storage
            .from('audio-tracks')
            .getPublicUrl(fileName);

        resumeUrl = urlData.publicUrl;
    }

    // Insert application
    const { error: dbError } = await supabaseAdmin
        .from('internship_applications')
        .insert({
            full_name: fullName,
            email: email,
            linkedin_url: linkedinUrl || null,
            resume_url: resumeUrl,
            message: message || null
        });

    if (dbError) {
        return { error: "Failed to submit application: " + dbError.message };
    }

    return { success: true };
}