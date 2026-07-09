// src/hooks.server.js
import { createServerClient } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Routes that require login
const PROTECTED_ROUTES = ['/dashboard', '/history', '/statistics', '/settings'];

export async function handle({ event, resolve }) {
    //create server-side supabase client  that reads/writes cookies
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY,{
        cookies: {
            getAll(){
                return event.cookies.getAll();
            },
            setAll(cookiesToSet){
                cookiesToSet.forEach(({ name, value, options}) => 
                event.cookies.set(name, value, {...options, path: '/'}))
            }
        }
    })
	
    //safely get the session (validate the token server side)
    event.locals.safeGetSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession();
        if(!session) return {session: null, user: null};

        //verify that token is valid  and not just present
        const { data: { user }, error } = await event.locals.supabase.auth.getUser();
        if(error) return {session: null, user: null};

        return { session, user };
    };

    const { session } = await event.locals.safeGetSession();

    const isProtected = PROTECTED_ROUTES.some( route => 
        event.url.pathname.startsWith(route)
    );

    if(isProtected && !session){
        throw redirect(303, '/login');
    }

    if(session && event.url.pathname === '/login'){
        throw redirect(303, '/dashboard')
    };

    return  resolve(event, {
        filterSerializedResponseHeaders(name){
            return name === 'content-range' || name === 'x-supabase-api-version';
        }
    })
}