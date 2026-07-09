export async function load({ locals: { safeGetSession } }) {
	const { session, user } = await safeGetSession();
	// pass session down to the layout  and all child pages
	return { session, user };
}
