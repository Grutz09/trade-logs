<!-- Inside StatCard.svelte -->
<script>
	let { title, value, subtext, icon, valueClass = '' } = $props();
</script>

<div class="stat-card">
	<div class="card-header">
		<h4>{title}</h4>
		{#if icon}
			{@render icon()}
		{/if}
	</div>

	<div class="stat-value {valueClass}">
		{value}
	</div>

	<span class="stat-subtext">{subtext}</span>
</div>

<style>
	/* Shared styles for all cards */
	.stat-card {
		background-color: #18181b;
		border: 1px solid #27272a;
		border-radius: 8px;
		padding: 1.5rem;
		min-height: 100px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-header h4 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: #a1a1aa;
	}

	.card-icon {
		color: #71717a;
	}

	.stat-value {
		font-size: 1.85rem;
		font-weight: 700;
		color: #f4f4f5; /* Default crisp white */
		margin: 0.5rem 0 0.25rem 0;
	}

	.stat-subtext {
		font-size: 0.75rem;
		color: #71717a;
	}

	/* Dynamic Color Classes */
	.stat-value.positive {
		color: #22c55e; /* Green for profits */
	}

	.stat-value.negative {
		color: #ef4444; /* Red for losses */
	}

	.stat-value.cyan {
		color: #38bdf8; /* Cyan for Win Rate */
	}
</style>