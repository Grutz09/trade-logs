// src/hooks.server.js
import { createClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Routes that require login
const PROTECTED_ROUTES = ['/dashboard', '/history', '/statistics', '/settings'];

export async function handle({ event, resolve }) {
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			headers: {
				cookie: event.request.headers.get('cookie') ?? ''
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	const isProtected = PROTECTED_ROUTES.some((route) => event.url.pathname.startsWith(route));

	if (isProtected && !session) {
		// Not logged in → send to login
		throw redirect(303, '/login');
	}

	if (session && event.url.pathname === '/login') {
		// Already logged in → skip login page
		throw redirect(303, '/dashboard');
	}

	return resolve(event);
}
