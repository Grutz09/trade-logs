<script>
    let { title, value, subtext, icon = '' } = $props();
</script>

<div class="equity-trend-card">
    <div class="card-header">
        <h3>{Title}</h3>
        {#if icon}
            {@render icon()}
        {/if}
    </div>

    <div class="equity-value">
        {value}
    </div>

    <div class="subtext">
        {subtext}
    </div>
</div>

<style>
    .equity-trend-card {
		background-color: #18181b;
		border: 1px solid #27272a;
		border-radius: 8px;
		padding: 1.5rem;
		min-height: 360px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-header h3 {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: #a1a1aa;
	}

	.card-icon {
		color: #71717a;
	}

	.equity-value {
		font-size: 1.85rem;
		font-weight: 700;
		color: #f4f4f5; /* Default crisp white */
		margin: 0.5rem 0 0.25rem 0;
	}

	.subtext {
		font-size: 0.75rem;
		color: #71717a;
	}

</style>