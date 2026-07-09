import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// All routes that require the user to be logged in
const PROTECTED_ROUTES = ['/dashboard', '/history', '/statistics', '/settings'];

export async function handle({ event, resolve }) {
	// Create a server-side Supabase client that properly reads/writes cookies
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				);
			}
		}
	});

	// Safely validate the session server-side
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) return { session: null, user: null };

		// Verify the token is actually valid (not expired or tampered)
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) return { session: null, user: null };

		return { session, user };
	};

	const { session } = await event.locals.safeGetSession();

	const isProtected = PROTECTED_ROUTES.some((route) => event.url.pathname.startsWith(route));

	// Not logged in → redirect to login
	if (isProtected && !session) {
		throw redirect(303, '/login');
	}

	// Already logged in → skip login page
	if (session && event.url.pathname === '/login') {
		throw redirect(303, '/dashboard');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
}
