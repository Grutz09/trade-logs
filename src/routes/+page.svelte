<script>
	import Login from '$lib/Login.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	onMount(() => goto('/dashboard'));
</script>

<Login />
