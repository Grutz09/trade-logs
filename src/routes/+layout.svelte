<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-layout">
	<nav class="main-nav">
		<div class="nav-container">
			<div class="text-logo">
				<h2>Pip <span>Diary</span></h2>
			</div>

			<div class="list-wrapper">
				<ul>
					<li><a href="/">Dashboard</a></li>
					<li><a href="/">History</a></li>
					<li><a href="/">Statistics</a></li>
					<li><a href="/">Settings</a></li>
				</ul>
			</div>
		</div>
	</nav>
</div>

<main>
	{@render children()}
</main>

<footer class="main-footer">
	<div class="footer-links">
		<a href="/privacy">Privacy Policy</a>
		<a href="/terms">Terms of Service</a>
		<a href="/contact">Contact</a>
	</div>
	<p>© 2026 Pip <span>Diary</span>. All rights reserved.</p>
</footer>

<style>
	/* Global layout configuration to push footer to the bottom */
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		background-color: #09090b; /* Pitch Black background */
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
		color: #f4f4f5; /* Crisp White text */
	}

	/* The ultimate flex layout anchor */
	.app-layout {
		display: flex;
		flex-direction: column;
	}

	/* Navigation Styling */
	.main-nav {
		background-color: #18181b; /* Dark Charcoal Surface */
		border-bottom: 1px solid #27272a; /* Gunmetal Border */
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
		height: 4rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.text-logo h2 {
		margin: 0;
		font-size: 2.25rem;
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	.text-logo span {
		color: #dc2626; /* Crimson Red Accent */
		text-shadow: 0 0 10px rgba(220, 38, 38, 0.3); /* Subtle neon glow */
	}

	.list-wrapper ul {
		list-style: none;
		display: flex;
		gap: 1.5rem;
		margin: 0;
		padding: 0;
	}

	.list-wrapper a {
		color: #a1a1aa; /* Slate Gray text */
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 400;
		transition:
			color 0.2s ease,
			text-shadow 0.2s ease;
	}

	.list-wrapper a:hover {
		color: #dc2626; /* Glow Crimson on hover */
		text-shadow: 0 0 8px rgba(220, 38, 38, 0.4);
	}

	/* Main Content Area */

	main {
		min-height: 75vh;
	}

	/* Footer Styling */
	.main-footer {
		background-color: #18181b; /* Dark Charcoal Surface */
		border-top: 1px solid #27272a; /* Gunmetal Border */
		padding: 2rem 1.5rem;
		text-align: center;
	}

	.footer-links {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin-bottom: 1rem;
	}

	.footer-links a {
		color: #a1a1aa; /* Slate Gray */
		text-decoration: none;
		font-size: 0.85rem;
		transition: color 0.2s ease;
	}

	.footer-links a:hover {
		color: #f4f4f5; /* Transitions into primary white text */
	}

	.main-footer p {
		margin: 0;
		color: #71717a; /* Even softer muted text for disclaimer */
		font-size: 0.8rem;
	}

	.main-footer p span {
		color: #dc2626;
		font-weight: 500;
	}
</style>
