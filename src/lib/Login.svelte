<script>
	import { supabase } from '$lib/services/database';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let username = $state('');
	let isSignup = $state(false);
	let showPassword = $state(false);

	async function Signup() {
		isSignup = true;
	}

	async function ShowPassword() {
		showPassword = !showPassword;
	}

	async function createAccount() {
		if (email === '' || password === '' || username === '') {
			alert('Empty input. Please input a character');
			return;
		}

		const { data, error } = await supabase.auth.signUp({
			email: email,
			options: {
				data: {
					username: username
				}
			},
			password: password
		});

		if (!error) {
			alert('Successfully created an account.');
			isSignup = false;
		} else {
			console.log(error);
			alert(error);
		}
	}

	async function login() {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (!error) {
			alert('Success Login.');
			goto('/dashboard');
		} else {
			console.log(error);
			alert(error);
		}
	}
</script>

<main class="login-wrapper">
	<div class="form-container">
		{#if isSignup}
			<h3>Signup First</h3>
		{:else}
			<h3>Login Account</h3>
		{/if}

		<form action="" class="login-form">
			<div class="login-field">
				<label for="email">Email</label>
				<input type="text" id="email" bind:value={email} placeholder="Enter your email" />
			</div>

			{#if isSignup}
				<div class="username-field">
					<label for="userName">Username</label>
					<input
						type="text"
						id="userName"
						bind:value={username}
						placeholder="Enter your username"
					/>
				</div>
			{/if}

			<div class="login-field">
				<label for="pass">Password</label>
				<div class="password-wrapper">
					<input
						type={showPassword ? 'text' : 'password'}
						id="pass"
						bind:value={password}
						placeholder="••••••••"
					/>
					<button
						class="eye-toggle"
						type="button"
						onclick={ShowPassword}
						aria-label={showPassword ? 'Hide Password' : 'Show Password'}
						>{showPassword ? '🙈' : '👁️'}</button
					>
				</div>
			</div>

			<div class="login-btn-container">
				{#if isSignup}
					<button onclick={createAccount} type="button" id="login-btn">Create Account</button>
				{:else}
					<button onclick={login} type="button" id="login-btn">Login</button>
				{/if}
			</div>

			<div class="signup-container">
				<p>Don't have an account yet? <a onclick={Signup}>Sign up</a></p>
			</div>
		</form>
	</div>
</main>

<style>
	/* Centers the entire login box on the page */
	.login-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100%; /* Fills the layout's main container */
	}

	/* The main login card */
	.form-container {
		background-color: #18181b; /* Dark Charcoal card */
		border: 1px solid #27272a; /* Gunmetal border */
		border-radius: 8px;
		padding: 2.5rem;
		width: 100%;
		max-width: 400px; /* Clean mobile-friendly width */
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
		margin-top: 20px;
		margin-bottom: 20px;
	}

	h3 {
		margin: 0 0 2rem 0;
		font-size: 1.5rem;
		font-weight: 600;
		letter-spacing: -0.025em;
		text-align: center;
	}

	.login-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.login-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.username-field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	label {
		font-size: 0.85rem;
		color: #a1a1aa; /* Slate Gray label */
		font-weight: 500;
		text-transform: capitalize;
	}

	input {
		background-color: #09090b; /* Pitch Black input background */
		border: 1px solid #27272a; /* Gunmetal border */
		color: #f4f4f5;
		padding: 0.75rem 1rem;
		border-radius: 6px;
		font-size: 0.95rem;
		outline: none;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	/* Subtle crimson highlight when selecting an input */
	input:focus {
		border-color: #dc2626;
		box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.15);
	}

	.login-btn-container {
		margin-top: 0.75rem;
	}

	.signup-container {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 0.2rem;
		color: #a1a1aa; /* Slate Gray */
		text-decoration: none;
		font-size: 0.85rem;
	}

	.signup-container a {
		color: #dc2626;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.signup-container a:hover {
		color: #f4f4f5; /* Transitions into primary white text */
	}

	.password-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.password-wrapper input {
		width: 100%;
		padding-right: 2.5rem; /* room for the icon */
	}

	.eye-toggle {
		position: absolute;
		right: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.8rem;
		width: auto;
	}

	button {
		width: 100%;
		background-color: #dc2626; /* Crimson Red */
		color: #f4f4f5;
		border: none;
		padding: 0.75rem;
		font-size: 0.95rem;
		font-weight: 600;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	button:hover {
		background-color: #b91c1c; /* Deep Ruby Red on hover */
	}
</style>
