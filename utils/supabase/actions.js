"use server";

import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

export async function createActionClient() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll(){
                    return cookieStore.getAll().map(({name, value}) => ({name, value}));
                },
                setAll(cookies) {
                    cookies.forEach(({name, value, options}) => {
                        cookieStore.set(name, value, options)
                    })
                }
            }
        }
    )
}

export async function signOut() {
    const supabase = await createActionClient();
    await supabase.auth.signOut();
    redirect('/');
}

export async function signIn(formData) {
    const username = formData.get('username');
    const password = formData.get('password');

    const supabase = await createActionClient();

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single();

    if (profileError || !profile) {
        redirect('/login?error=' + encodeURIComponent('Invalid username or password'));
    }

    const { error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
    });

    if (error) {
        redirect('/login?error=' + encodeURIComponent('Invalid username or password'));
    }

    redirect('/dashboard');
}

export async function signUp(formData) {
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    const supabase = await createActionClient();

    // Check if username already exists
    const { data: existingUsername } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

    if (existingUsername) {
        redirect('/signup?error=' + encodeURIComponent('Username already taken'));
    }

    // Check if email already exists
    const { data: existingEmail } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

    if (existingEmail) {
        redirect('/signup?error=' + encodeURIComponent('Email already registered'));
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
            },
        },
    });

    if (error) {
        redirect('/signup?error=' + encodeURIComponent(error.message));
    }

    if (!data.user) {
        redirect('/signup?error=' + encodeURIComponent('Failed to create user'));
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: data.user.id,
            username,
            email,
        });

    if (profileError) {
        redirect('/signup?error=' + encodeURIComponent('Profile error: ' + profileError.message));
    }

    redirect('/dashboard');
}

// Todo CRUD operations
export async function getTodos() {
    const supabase = await createActionClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) return [];
    return data;
}

export async function addTodo(text) {
    const supabase = await createActionClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('todos')
        .insert({
            user_id: user.id,
            text,
            completed: false,
        })
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function updateTodo(id, updates) {
    const supabase = await createActionClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function deleteTodo(id) {
    const supabase = await createActionClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) return { error: error.message };
    return { success: true };
}
