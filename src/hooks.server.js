import { createClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// All routes that require the user to be logged in
const PROTECTED_ROUTES = ['/dashboard', '/history', '/statistics', '/settings'];

export async function handle({ event, resolve }) {
	// Create a server-side supabase client that reads the auth cookie
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			headers: {
				cookie: event.request.headers.get('cookie') ?? ''
			}
		}
	});

	// Get the current session from the cookie
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const isProtected = PROTECTED_ROUTES.some((route) => event.url.pathname.startsWith(route));

	// If the route is protected and there is no active session, redirect to login
	if (isProtected && !session) {
		throw redirect(303, '/login');
	}

	// If the user is already logged in and tries to visit the login page, redirect to dashboard
	if (session && event.url.pathname === '/login') {
		throw redirect(303, '/dashboard');
	}

	return resolve(event);
}
