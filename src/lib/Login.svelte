<script>
	import { supabase } from '$lib/services/database';
    import { goto } from '$dashboard/dashboard';

    let email = $state('');
	let password = $state('');

	async function createAccount() {
        if(email === '' || password === ''){ 
            alert("Empty input. Please input a character")
        }

		const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password
        })

        if(!error){
            alert("Successful Login.")
            goto('/dashboard');
        }else{
            console.log(error);
            alert(error);
        }
	}
</script>

<main class="login-wrapper">
	<div class="form-container">
		<h3>Login Account</h3>
		<form action="" class="login-form">
			<div class="login-field">
				<label for="userName">User Name</label>
				<input type="text" id="userName" bind:value={email} placeholder="Enter your username" />
			</div>

			<div class="login-field">
				<label for="pass">Password</label>
				<input type="password" id="pass" bind:value={password} placeholder="••••••••" />
			</div>

			<div class="login-btn-container">
				<button type="button" id="login-btn">Login</button>
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
        margin-top: 100px;
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
