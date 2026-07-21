<script>
	import { getContext } from 'svelte';
	import StatCard from '$lib/component/StatsCard.svelte';
	const supabase = getContext('supabase');

	// array to store values
	let tradeList = $state([]);
	let total_trades = $state(0);
	let net_Pnl = $state(0);
	let win_rate = $state(0);

	async function fetchTrades() {
		const { data, error } = await supabase.from('trades').select('*');

		tradeList = data;

		if (!tradeList || tradeList.length === 0) {
			alert('No trades found.');
			return;
		}
	}

	async function totalTrades() {
		const { count, error } = await supabase
			.from('trades')
			.select('*', { count: 'exact', head: true });

		if (error) throw error;
		total_trades = count;
	}

	async function netPnl() {
		const { data, error } = await supabase.from('trades').select('net_pnl');

		if (error) throw error;
		net_Pnl = data.reduce((sum, data) => sum + Number(data.net_pnl), 0);
	}

	async function winRate() {
		if (!tradeList || tradeList.length === 0) {
			win_rate = 0;
			return;
		}

		let win = tradeList.filter((trades) => String(trades.result).toLowerCase() === 'win');
		win_rate = Number(((win.length / tradeList.length) * 100).toFixed(1));
	}

	$effect(async () => {
		await fetchTrades();
		await totalTrades();
		await netPnl();
		await winRate();
	});
</script>

<main class="dashboard">
	<h3>Trade Statistics</h3>

	<!-- TOP: Summary stat cards -->
	<section class="stats-row">
		<StatCard
			title="Total Trades"
			value={total_trades}
			subtext="All time executions"
			iconPath="M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3"
		/>

		<StatCard
			title="Net PnL"
			value={`${net_Pnl >= 0 ? '+' : ''}$${net_Pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
			subtext="Realized PnL"
			valueClass={net_Pnl >= 0 ? 'positive' : 'negative'}
			>
			{#snippet icon()}
				<svg
					class="card-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					width="18"
					height="18"
				>
					<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
					<polyline points="16 7 22 7 22 13" />
				</svg>
			{/snippet}
		</StatCard>

		<StatCard 
			title="Win Rate"
			value={`${win_rate.toFixed(1)}%`}
			subtext="Profitable trades ratio"

			valueClass='cyan'

		>
			{#snippet icon()}
				<svg
					class="card-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					width="18"
					height="18"
				>
					<circle cx="12" cy="12" r="10" />
					<path d="M12 6v6l4 2" />
				</svg>
			{/snippet}
		</StatCard>
	</section>

	<!-- MIDDLE: Equity curve + recent trades -->
	<section class="middle-row">
		<div class="equity-curve-card">
			<h4>Equity Curve</h4>
		</div>
		<div class="recent-trades-card">
			<h4>Recent Trades</h4>
		</div>
	</section>

	<!-- BOTTOM: Strategy breakdown + mistakes/lessons -->
	<section class="bottom-row">
		<div class="strategy-breakdown-card">
			<h4>Strategy Breakdown</h4>
		</div>
		<div class="lessons-card">
			<h4>Mistakes & Lessons</h4>
		</div>
	</section>
</main>

<style>
    .dashboard {
        padding: 2rem;
        max-width: 1400px;
        width: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .dashboard h3 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
    }

    /* Shared card base for dashboard sections */
    .equity-curve-card,
    .recent-trades-card,
    .strategy-breakdown-card,
    .lessons-card {
        background-color: #18181b;
        border: 1px solid #27272a;
        border-radius: 8px;
        padding: 1.5rem;
    }

    .equity-curve-card h4,
    .recent-trades-card h4,
    .strategy-breakdown-card h4,
    .lessons-card h4 {
        margin: 0 0 1rem 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: #a1a1aa;
    }

    /* TOP: 5 stat cards in a row */
    .stats-row {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 1.25rem;
    }

    /* MIDDLE: chart gets 2x space of trade list */
    .middle-row {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.25rem;
    }

    .equity-curve-card,
    .recent-trades-card {
        min-height: 360px;
    }

    .recent-trades-card {
        overflow-y: auto;
    }

    /* BOTTOM: two equal columns */
    .bottom-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
    }

    .strategy-breakdown-card,
    .lessons-card {
        min-height: 240px;
    }

    /* Target SVG icons passed through snippets */
    :global(.card-icon) {
        color: #71717a;
    }
</style>
