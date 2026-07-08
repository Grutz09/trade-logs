<script>
</script>

<main class="dashboard">
	<h3>Trade Statistics</h3>

	<!-- TOP: Summary stat cards -->
	<section class="stats-row">
		<div class="stat-card total-trades"></div>
		<div class="stat-card net-pnl"></div>
		<div class="stat-card win-rate"></div>
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
		margin: 0 auto;
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
</style>
