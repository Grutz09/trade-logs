<script>
	import { getContext } from 'svelte';
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

		let win = tradeList.filter((trades) => trades.result === 'win');
		win_rate = ((win.length / tradeList.length) * 100).toFixed(1);
	}

	$effect(async() => {
		await fetchTrades();
		totalTrades();
		netPnl();
		winRate();
	});
</script>

<main class="dashboard">
	<h3>Trade Statistics</h3>

	<!-- TOP: Summary stat cards -->
	<section class="stats-row">
		<div class="stat-card total-trades">
			<div class="card-header">
				<h4>Total Trades</h4>
				<svg
					class="card-icon"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					width="18"
					height="18"
				>
					<path d="M3 3v18h18" />
					<path d="M18 17V9" />
					<path d="M13 17V5" />
					<path d="M8 17v-3" />
				</svg>
			</div>
			<div class="stat-value">{total_trades}</div>
			<span class="stat-subtext">All time executions</span>
		</div>
		<div class="stat-card net-pnl">
			<div class="card-header">
				<h4>Net PnL</h4>
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
			</div>

			<!-- Dynamically formats currency and adds red/green color classes -->
			<div class="stat-value" class:positive={net_Pnl >= 0} class:negative={net_Pnl < 0}>
				{net_Pnl >= 0 ? '+' : ''}${net_Pnl.toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}
			</div>

			<span class="stat-subtext">Realized PnL</span>
		</div>
		<div class="stat-card win-rate">
			<div class="card-header">
				<h4>Win Rate</h4>
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
			</div>
			<div class="stat-value">{win_rate}%</div>
			<span class="stat-subtext">Profitable trades ratio</span>
		</div>
		<div class="stat-card profit-factor"></div>
		<div class="stat-card current-streak"></div>
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

	/* Shared card base */
	.stat-card,
	.equity-curve-card,
	.recent-trades-card,
	.strategy-breakdown-card,
	.lessons-card {
		background-color: #18181b;
		border: 1px solid #27272a;
		border-radius: 8px;
		padding: 1.5rem;
	}

	.stat-card h4,
	.equity-curve-card h4,
	.recent-trades-card h4,
	.strategy-breakdown-card h4,
	.lessons-card h4 {
		margin: 0 0 1rem 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: #a1a1aa;
	}

	/* Net PnL Stat Card Specifics */
	.net-pnl .stat-value.positive {
		color: #22c55e; /* Trading Green */
	}

	.net-pnl .stat-value.negative {
		color: #ef4444; /* Trading Red */
	}

	/* Optional badge indicator for quick visual pop */
	.net-pnl .stat-value {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	/* Win Rate Stat Card Specifics */
	.win-rate .stat-value {
		color: #38bdf8; /* Clean trading blue/cyan accent */
	}

	/* Optional: Make it turn green if win rate is 50% or higher */
	.win-rate .stat-value.high-win {
		color: #22c55e;
	}

	/* TOP: 5 stat cards in a row, equal width */
	.stats-row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1.25rem;
	}

	.stat-card {
		min-height: 100px;
	}

	/* MIDDLE: chart gets more space than trade list */
	.middle-row {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 1.25rem;
	}

	.equity-curve-card {
		min-height: 360px;
	}

	.recent-trades-card {
		min-height: 360px;
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

	/* Stat Card Layout Improvements */
	.stat-card {
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

	/* Overrides default margin for card headers inside stat cards */
	.stat-card h4 {
		margin: 0;
	}

	.card-icon {
		color: #71717a;
	}

	/* Big numerical value display */
	.stat-value {
		font-size: 1.85rem;
		font-weight: 700;
		color: #f4f4f5;
		margin: 0.5rem 0 0.25rem 0;
		letter-spacing: -0.02em;
	}

	/* Secondary subtext label */
	.stat-subtext {
		font-size: 0.75rem;
		color: #71717a;
		font-weight: 400;
	}
</style>
