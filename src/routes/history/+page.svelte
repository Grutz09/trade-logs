<script>
	import AddTrade from '$lib/addTrade.svelte';
</script>

<main class="history-page">
	<div class="header">
		<div class="hero-section">
			<div class="header-elmtns">
				<h3>Trade History</h3>
				<p>View your trades and transactions.</p>
			</div>

			<button class="add-trade-btn" onclick={AddTrade}> + Add Trade </button>
		</div>

		<div class="trade-category">
			<p>All Trades</p>
			<p>Buy Side</p>
			<p>Sell Side</p>
		</div>
	</div>

	<div class="toolbar">
		<div class="search-box">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				width="16"
				height="16"
			>
				<circle cx="11" cy="11" r="7" />
				<path d="M21 21l-4.3-4.3" />
			</svg>
			<input type="text" id="searchInput" placeholder="Search for trades" />
		</div>

		<div class="toolbar-right">
			<div class="picker-wrap">
				<button class="date-pill" id="pillBtn" type="button">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						width="16"
						height="16"
					>
						<rect x="3" y="5" width="18" height="16" rx="2" />
						<path d="M3 10h18M8 3v4M16 3v4" />
					</svg>
					<span id="pillLabel">Jan 6, 2022 - Jan 13, 2022</span>
				</button>

				<div class="picker" id="picker">
					<div class="picker-header">
						<button id="prevMonth" type="button">&#8249;</button>
						<span id="monthLabel">January 2022</span>
						<button id="nextMonth" type="button">&#8250;</button>
					</div>

					<div class="cal-grid" id="calGrid">
						<div class="dow">Su</div>
						<div class="dow">Mo</div>
						<div class="dow">Tu</div>
						<div class="dow">We</div>
						<div class="dow">Th</div>
						<div class="dow">Fr</div>
						<div class="dow">Sa</div>
					</div>

					<div class="picker-actions">
						<button type="button" id="clearBtn">Clear</button>
						<button type="button" class="apply" id="applyBtn">Apply</button>
					</div>
				</div>
			</div>

			<button class="filters-btn" id="filtersBtn" type="button">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					width="16"
					height="16"
				>
					<path d="M4 6h16M7 12h10M10 18h4" />
				</svg>
				Filters
			</button>
		</div>
	</div>

	<div class="table-wrap">
		<table id="tradeJournalTable">
			<thead>
				<tr>
					<th>Trade Date</th>
					<th>Ticker / Pair</th>
					<th>Position Side</th>
					<th>Entry Price</th>
					<th>Exit Price</th>
					<th>Stop Loss</th>
					<th>Take Profit</th>
					<th>Leverage / Lot Size</th>
					<th>Risk Amount ($)</th>
					<th>Result</th>
					<th>Gross Profit</th>
					<th>Gross Loss</th>
					<th>Net PnL ($)</th>
					<th>Strategy / Setup</th>
					<th>Market Condition</th>
					<th>Chart URL</th>
					<th>Emotion Before</th>
					<th>Emotion After</th>
					<th>Mistakes / Notes</th>
					<th>Lesson Learned</th>
				</tr>
			</thead>
			<tbody id="tradeJournalBody"> </tbody>
		</table>
	</div>

	<div class="pagination">
		<button type="button" id="prevPage">&#8249; Prev</button>
		<span id="pageCounter">Page 1 of 1</span>
		<button type="button" id="nextPage">Next &#8250;</button>
	</div>
</main>

<style>
	/* 1. Main Page Container */
	.history-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem;
		background-color: #09090b; /* Pitch Black */
	}

	/* 2. Header & Tab Categories Layout */
	.header {
		margin-bottom: 2rem;
	}

	.header h3 {
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0 0 0.25rem 0;
	}

	.header p {
		color: #a1a1aa; /* Slate Gray */
		margin: 0 0 1.5rem 0;
		font-size: 0.95rem;
	}

	.hero-section{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.add-trade-btn {
		width: 90px;
		background-color: #dc2626; /* Crimson Red */
		color: #f4f4f5;
		border: none;
		font-size: 0.75rem;
		border-radius: 20px;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.add-trade-btn:hover {
		background-color: #b91c1c; /* Deep Ruby Red on hover */
	}

	.trade-category {
		display: flex;
		gap: 0.5rem;
		border-bottom: 1px solid #27272a; /* Gunmetal Border */
		padding-bottom: 0.5rem;
	}

	.trade-category p {
		padding: 0.5rem 1rem;
		margin: 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: #71717a;
		cursor: pointer;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
		border-bottom: 2px solid transparent;
		margin-bottom: -0.5rem; /* Anchor to parent line */
	}

	/* Mock active state example for CSS mapping */
	.trade-category p:first-child {
		color: #dc2626; /* Crimson Accent */
		border-color: #dc2626;
	}

	.trade-category p:hover {
		color: #f4f4f5;
	}

	/* 3. Toolbar Layout (Search & Pickers) */
	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.search-box {
		position: relative;
		display: flex;
		align-items: center;
		flex: 1;
		max-width: 320px;
	}

	.search-box svg {
		position: absolute;
		left: 0.75rem;
		color: #71717a;
		pointer-events: none;
	}

	.search-box input {
		width: 100%;
		background-color: #18181b; /* Dark Charcoal */
		border: 1px solid #27272a;
		color: #f4f4f5;
		padding: 0.5rem 0.75rem 0.5rem 2.25rem;
		border-radius: 6px;
		font-size: 0.9rem;
		font-family: inherit;
		transition: border-color 0.2s;
	}

	.search-box input:focus {
		outline: none;
		border-color: #dc2626;
	}

	.toolbar-right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	/* Standard Pills / Action Buttons */
	.date-pill,
	.filters-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background-color: #18181b;
		border: 1px solid #27272a;
		color: #a1a1aa;
		padding: 0.5rem 0.85rem;
		border-radius: 6px;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		font-family: inherit;
		transition:
			background-color 0.2s,
			color 0.2s,
			border-color 0.2s;
	}

	.date-pill:hover,
	.filters-btn:hover {
		background-color: #27272a;
		color: #f4f4f5;
	}

	/* 4. Calendar Picker Popup Drawer Block */
	.picker-wrap {
		position: relative;
	}

	.picker {
		display: none; /* Hide by default, trigger layout via logic layer toggles */
		position: absolute;
		top: 110%;
		right: 0;
		z-index: 100;
		width: 280px;
		background-color: #18181b;
		border: 1px solid #27272a;
		border-radius: 8px;
		padding: 1rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
	}

	/* Add utility target for when you connect JS toggling */
	/* .picker-wrap:focus-within .picker { display: block; } */

	.picker-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.picker-header span {
		font-size: 0.9rem;
		font-weight: 600;
	}

	.picker-header button {
		background: transparent;
		border: none;
		color: #a1a1aa;
		font-size: 1.25rem;
		cursor: pointer;
		padding: 0 0.5rem;
	}

	.picker-header button:hover {
		color: #f4f4f5;
	}

	.cal-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.25rem;
		text-align: center;
		font-size: 0.8rem;
	}

	.dow {
		color: #71717a;
		font-weight: 600;
		padding-bottom: 0.25rem;
	}

	.picker-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
		border-top: 1px solid #27272a;
		padding-top: 0.75rem;
	}

	.picker-actions button {
		background: transparent;
		border: 1px solid #27272a;
		color: #a1a1aa;
		padding: 0.35rem 0.75rem;
		border-radius: 4px;
		font-size: 0.8rem;
		cursor: pointer;
		font-family: inherit;
	}

	.picker-actions button:hover {
		border-color: #a1a1aa;
		color: #f4f4f5;
	}

	.picker-actions button.apply {
		background-color: #dc2626;
		border-color: #dc2626;
		color: #f4f4f5;
	}

	.picker-actions button.apply:hover {
		background-color: #b91c1c;
		border-color: #b91c1c;
	}

	/* 5. Datatable Presentation Structure */
	.table-wrap {
		width: 100%;
		overflow-x: auto; /* Clean horizontal scrolling container overflow mechanics */
		border: 1px solid #27272a;
		border-radius: 8px;
		background-color: #18181b;
		margin-bottom: 1.5rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		font-size: 0.875rem;
	}

	th {
		background-color: rgba(39, 39, 42, 0.5); /* Soft gunmetal tint header row */
		color: #a1a1aa;
		font-weight: 600;
		padding: 0.85rem 1rem;
		border-bottom: 1px solid #27272a;
		white-space: nowrap;
	}

	td {
		padding: 0.85rem 1rem;
		border-bottom: 1px solid rgba(39, 39, 42, 0.4);
		color: #e4e4e7;
		white-space: nowrap;
	}

	tr:last-child td {
		border-bottom: none;
	}

	tr:hover td {
		background-color: rgba(255, 255, 255, 0.02); /* Slight responsive inline glow highlight row */
	}

	/* 6. Footer Block Pagination styling */
	.pagination {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 1rem;
		font-size: 0.85rem;
		color: #a1a1aa;
	}

	.pagination button {
		background-color: #18181b;
		border: 1px solid #27272a;
		color: #f4f4f5;
		padding: 0.4rem 0.85rem;
		border-radius: 4px;
		cursor: pointer;
		font-family: inherit;
		transition:
			border-color 0.2s,
			background-color 0.2s;
	}

	.pagination button:hover {
		background-color: #27272a;
		border-color: #a1a1aa;
	}
</style>
