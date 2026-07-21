<script>
	import { getContext } from 'svelte';
	const supabase = getContext('supabase');

	//validate inputs to check for empty fields
	function validateInputs(trade) {
		const requiredFields = [
			{ name: 'Trade Date', value: trade.trade_date },
			{ name: 'Pair', value: trade.pair },
			{ name: 'Position', value: trade.position },
			{ name: 'Entry Price', value: trade.entry_price },
			{ name: 'Stop Loss', value: trade.stop_loss },
			{ name: 'Take Profit', value: trade.take_profit },
			{ name: 'Leverage', value: trade.leverage },
			{ name: 'Risk Amount', value: trade.risk_amount },
			{ name: 'Result', value: trade.result },
			{ name: 'Strategy', value: trade.strategy },
			{ name: 'Market Condition', value: trade.market_condition },
			{ name: 'Emotion Before', value: trade.emotion_before },
			{ name: 'Emotion After', value: trade.emotion_after },
			{ name: 'Mistakes', value: trade.mistake_notes },
			{ name: 'Lesson Learned', value: trade.lesson_learned }
		];

		const missingField = requiredFields.find((field) => field.value === '' || field.value === null);

		if (missingField) {
			throw new Error(`${missingField.name} is required.`);
		}

		if (!trade.chart_image_url.startsWith('https://')) {
			throw new Error('Chart Setup URL must start with https://');
		}

	}

	// array to store values
	let tradeList = $state([]);

	// Filters trade history based on categories (Buy / Sell)
	let selectCategory = $state('All');
	let filteredTrades = $derived(
		selectCategory === 'All'
			? tradeList
			: tradeList.filter((t) => t.position === selectCategory.toLowerCase())
	);

	// Filters trade history based on search input
	let searchInput = $state('');
	let filteredQuery = $derived(
		filteredTrades.filter((t) => t.pair.toLowerCase().includes(searchInput.toLowerCase()))
	);

	// filter trades using calendar history
	let filteredDate = $derived(
		filteredQuery.filter((t) => {
			if (!startDate && !endDate) {
				return true;
			}

			if (startDate && !endDate) {
				return t.trade_date === startDate;
			}

			return t.trade_date >= startDate && t.trade_date <= endDate;
		})
	);

	async function selectDate(daysNum) {
		if (!daysNum) return;

		const clickDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(daysNum).padStart(2, '0')}`;

		if (startDate === false) {
			startDate = clickDate;
		} else if (endDate === false && clickDate >= startDate) {
			endDate = clickDate;
		} else {
			startDate = clickDate;
			endDate = false;
		}
	}

	function formatDateLabel(dateStr) {
		if (!dateStr) return '';
		const [year, month, day] = dateStr.split('-');
		const dateObj = new Date(year, month - 1, day);
		return dateObj.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	let isPickerOpen = $state(false);
	let startDate = $state(false);
	let endDate = $state(false);
	let currentMonth = $state(new Date().getMonth());
	let currentYear = $state(new Date().getFullYear());
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	let calendarDays = $derived.by(() => {
		const firstDay = new Date(currentYear, currentMonth, 1).getDay();
		const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
		let days = [];
		for (let i = 0; i < firstDay; i++) days.push({ day: '', isFiller: true });
		for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, isFiller: false });
		return days;
	});

	function prevMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
	}

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
	}

	async function fetchTrades() {
		const { data, error } = await supabase.from('trades').select('*');

		tradeList = data;

		if (!tradeList || tradeList.length === 0) {
			alert('No trades found.');
			return;
		}
	}

	//============================ POP UP MODAL ================================
	let selectedTrade = $state(null);
	let editedTrade = $state({});
	let isChoiceOpen = $state(false);
	let isEditOpen = $state(false);

	function openChoicePopup(trades) {
		selectedTrade = trades;
		isChoiceOpen = true;
	}

	function editTrade() {
		isChoiceOpen = false;
		isEditOpen = true;
		editedTrade = { ...selectedTrade };
	}

	async function deleteTrade() {
		if (!confirm('Are you sure you want to delete this trade?')) {
			return;
		} else {
			await supabase.from('trades').delete().eq('id', selectedTrade.id);
		}

		fetchTrades();
		isChoiceOpen = false;
	}

	async function saveChanges() {
		validateInputs(editedTrade);

		const fields = ['emotion_before', 'emotion_after'];

		fields.forEach((key) => {
			if (typeof editedTrade[key] === 'string') {
				editedTrade[key] = editedTrade[key].toLowerCase().trim();
			}
		});

		await supabase.from('trades').update(editedTrade).eq('id', selectedTrade.id);
		fetchTrades();
		isEditOpen = false;
	}

	// it reloads fetchTrade again and again when there's a change on fetchTrades function.
	$effect(() => {
		fetchTrades();
	});
</script>

<main class="history-page">
	<div class="header">
		<div class="hero-section">
			<div class="header-elmtns">
				<h3>Trade History</h3>
				<p>View your trades and transactions.</p>
			</div>

			<a href="/addTrade" class="add-trade-btn">+</a>
		</div>

		<div class="trade-category">
			<button
				type="button"
				class:active={selectCategory === 'All'}
				onclick={() => (selectCategory = 'All')}>All Trades</button
			>
			<button
				type="button"
				class:active={selectCategory === 'Long'}
				onclick={() => (selectCategory = 'Long')}>Buy Side</button
			>
			<button
				type="button"
				class:active={selectCategory === 'Short'}
				onclick={() => (selectCategory = 'Short')}>Sell Side</button
			>
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
			<input
				type="text"
				id="searchInput"
				placeholder="Search for trades"
				bind:value={searchInput}
			/>
		</div>

		<div class="toolbar-right">
			<div class="picker-wrap">
				<button
					class="date-pill"
					id="pillBtn"
					type="button"
					onclick={() => (isPickerOpen = !isPickerOpen)}
				>
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
					<span id="pillLabel">
						{#if startDate && endDate}
							{formatDateLabel(startDate)} - {formatDateLabel(endDate)}
						{:else if startDate}
							{formatDateLabel(startDate)} - Select End Date
						{:else}
							Select Date Range
						{/if}
					</span>
				</button>

				{#if isPickerOpen}
					<div class="picker" id="picker">
						<div class="picker-header">
							<button id="prevMonth" type="button" onclick={prevMonth}>&#8249;</button>
							<span id="monthLabel">{months[currentMonth]} {currentYear}</span>
							<button id="nextMonth" type="button" onclick={nextMonth}>&#8250;</button>
						</div>

						<div class="cal-grid" id="calGrid">
							<div class="dow">Su</div>
							<div class="dow">Mo</div>
							<div class="dow">Tu</div>
							<div class="dow">We</div>
							<div class="dow">Th</div>
							<div class="dow">Fr</div>
							<div class="dow">Sa</div>

							{#each calendarDays as dayObj}
								{@const thisDate = dayObj.isFiller
									? ''
									: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`}
								<button
									type="button"
									class="day-btn"
									class:filler={dayObj.isFiller}
									class:selected={!dayObj.isFiller &&
										(thisDate === startDate || thisDate === endDate)}
									class:in-range={!dayObj.isFiller &&
										startDate &&
										endDate &&
										thisDate > startDate &&
										thisDate < endDate}
									onclick={() => selectDate(dayObj.day)}
								>
									{dayObj.day}
								</button>
							{/each}
						</div>

						<div class="picker-actions">
							<button
								type="button"
								id="clearBtn"
								onclick={() => {
									startDate = false;
									endDate = false;
								}}>Clear</button
							>
							<button
								type="button"
								class="apply"
								id="applyBtn"
								onclick={() => (isPickerOpen = false)}>Apply</button
							>
						</div>
					</div>
				{/if}
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

			<tbody id="tradeJournalBody">
				{#each filteredDate as trades}
					<tr onclick={() => openChoicePopup(trades)}>
						<td>{trades.trade_date}</td>
						<td><strong>{trades.pair}</strong></td>

						<td>
							<span class="badge-position {trades.position?.toLowerCase()}">
								{trades.position}
							</span>
						</td>

						<td>${trades.entry_price}</td>
						<td>${trades.exit_price}</td>
						<td>${trades.stop_loss}</td>
						<td>${trades.take_profit}</td>
						<td>{trades.leverage}x</td>
						<td>${trades.risk_amount}</td>

						<td>
							<span class="badge-result {trades.result?.toLowerCase()}">
								{trades.result}
							</span>
						</td>

						<td class="text-profit">+${trades.profit}</td>
						<td class="text-loss">-${trades.loss}</td>
						<td class={trades.net_pnl >= 0 ? 'text-profit' : 'text-loss'}>
							${trades.net_pnl}
						</td>

						<td>{trades.strategy}</td>
						<td>{trades.market_condition}</td>

						<td>
							{#if trades.chart_image_url}
								<a
									href={trades.chart_image_url}
									target="_blank"
									rel="noopener noreferrer"
									onclick={(e) => e.stopPropagation()}
									class="chart-link">View Chart ↗</a
								>
							{:else}
								<span class="text-muted-pnl">N/A</span>
							{/if}
						</td>

						<td>{trades.emotion_before}</td>
						<td>{trades.emotion_after}</td>

						<td class="note-cell" title={trades.mistake_notes}>{trades.mistake_notes}</td>
						<td class="note-cell" title={trades.lesson_learned}>{trades.lesson_learned}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- ========================== POP UP MODAL ======================== -->
	{#if isChoiceOpen}
		<div class="modal-overlay">
			<div class="modal-content">
				<h3>Modify Trade</h3>
				<p>What action would you like to do with this trade?</p>

				<div class="modal-actions">
					<button type="button" id="edit-btn" onclick={editTrade}>Edit</button>
					<button type="button" id="delete-btn" onclick={deleteTrade}>Delete</button>
					<button type="button" id="cancel-btn" onclick={() => (isChoiceOpen = false)}
						>Cancel</button
					>
				</div>
			</div>
		</div>
	{/if}

	<!-- ================================== EDIT MODAL ===============================  -->
	{#if isEditOpen}
		<form>
			<fieldset class="form-section">
				<legend>Trade Setup & Logistics</legend>
				<div class="grid-3">
					<div class="input-group">
						<label for="trade_date">Trade Date</label>
						<input bind:value={editedTrade.trade_date} id="trade_date" type="date" />
					</div>

					<div class="input-group">
						<label for="pair">Ticker / Pair</label>
						<input bind:value={editedTrade.pair} id="pair" />
					</div>

					<div class="input-group">
						<label for="position">Position Side</label>
						<select bind:value={editedTrade.position} id="position">
							<option value="long">LONG</option>
							<option value="short">SHORT</option>
						</select>
					</div>
				</div>
			</fieldset>

			<fieldset class="form-section">
				<legend>Prices & Risk Management</legend>
				<div class="grid-4">
					<div class="input-group">
						<label for="entry_price">Entry Price</label>
						<input bind:value={editedTrade.entry_price} id="entry_price" type="number" />
					</div>

					<div class="input-group">
						<label for="exit_price">Exit Price</label>
						<input bind:value={editedTrade.exit_price} id="exit_price" type="number" />
					</div>

					<div class="input-group">
						<label for="stop_loss">Stop Loss (SL)</label>
						<input bind:value={editedTrade.stop_loss} id="stop_loss" type="number" />
					</div>

					<div class="input-group">
						<label for="take_profit">Take Profit (TP)</label>
						<input bind:value={editedTrade.take_profit} id="take_profit" type="number" />
					</div>
				</div>

				<div class="grid-3 mt-4">
					<div class="input-group">
						<label for="leverage">Leverage / Lot Size</label>
						<input bind:value={editedTrade.leverage} id="leverage" type="number" />
					</div>

					<div class="input-group">
						<label for="risk_amount">Risk Amount ($)</label>
						<input bind:value={editedTrade.risk_amount} id="risk_amount" type="number" />
					</div>
				</div>
			</fieldset>

			<fieldset class="form-section highlight-section">
				<legend>Trade Performance & Outcome</legend>
				<div class="grid-4">
					<div class="input-group">
						<label for="result">Result</label>
						<select bind:value={editedTrade.result} id="result">
							<option value="win">WIN</option>
							<option value="loss">LOSS</option>
							<option value="breakeven">Breakeven</option>
						</select>
					</div>

					<div class="input-group">
						<label for="profit">Gross Profit</label>
						<input bind:value={editedTrade.profit} id="profit" type="number" />
					</div>

					<div class="input-group">
						<label for="loss">Gross Loss</label>
						<input bind:value={editedTrade.loss} id="loss" type="number" />
					</div>

					<div class="input-group">
						<label for="net_pnl">Net PnL ($)</label>
						<input bind:value={editedTrade.net_pnl} id="net_pnl" type="Number()" />
					</div>
				</div>
			</fieldset>

			<fieldset class="form-section">
				<legend>Strategy & Market Context</legend>
				<div class="grid-3">
					<div class="input-group">
						<label for="strategy">Strategy / Playbook Setup</label>
						<input bind:value={editedTrade.strategy} id="strategy" />
					</div>
					
					<div class="input-group">
						<label for="market_condition">Market Condition</label>
						<select bind:value={editedTrade.market_condition} id="market_condition">
							<option value="trending">Trending</option>
							<option value="ranging">Ranging</option>
							<option value="volatile">Volatile</option>
							<option value="choppy">Choppy</option>
						</select>
					</div>

					<div class="input-group">
						<label for="chart_image_url">Chart Setup URL</label>
						<input bind:value={editedTrade.chart_image_url} id="chart_image_url" />
					</div>
				</div>
			</fieldset>

			<fieldset class="form-section">
				<legend>Psychology & Post-Trade Analysis</legend>
				<div class="grid-2">
					<div class="input-group">
						<label for="emotion_before">Emotion Before Trade</label>
						<select bind:value={editedTrade.emotion_before} id="emotion_before">
							<option>Confident / Disciplined</option>
							<option>Calm / Neutral</option>
							<option>FOMO / Impatient</option>
							<option>Anxious / Fearful</option>
						</select>
					</div>

					<div class="input-group">
						<label for="emotion_after">Emotion After Trade</label>
						<select bind:value={editedTrade.emotion_after} id="emotion_after">
							<option>Satisfied / Followed Rules</option>
							<option>Neutral</option>
							<option>Angry / Revengeful</option>
							<option>Regretful (Overleveraged/Early Exit)</option>
						</select>
					</div>
				</div>

				<div class="grid-2 mt-4">
					<div class="input-group">
						<label for="mistake_notes">Mistakes / Review Notes</label>
						<textarea bind:value={editedTrade.mistake_notes} id="mistake_notes"></textarea>
					</div>

					<div class="input-group">
						<label for="lesson_learned">Key Lesson Learned</label>
						<textarea bind:value={editedTrade.lesson_learned} id="lesson_learned"></textarea>
					</div>
				</div>
			</fieldset>

			<div class="form-actions">
				<button class="btn-primary" type="button" onclick={saveChanges}
					>Commit Trade to Journal</button
				>
				<button type="button" onclick={() => (isEditOpen = false)} class="btn-primary"
					>Cancel</button
				>
			</div>
		</form>
	{/if}

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

	.hero-section {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.add-trade-btn {
		width: 40px;
		height: 40px;
		color: #f8f8ff;
		border: none;
		text-decoration: none;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.5rem;
		line-height: 1;
		padding: 0;
		font-weight: bolder;
		border-radius: 10px;
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

	.trade-category button {
		background: transparent;
		border: none;
		border-bottom: 2px solid transparent;
		padding: 0.5rem 1rem;
		margin: 0;
		margin-bottom: -0.5rem; /* Anchor to parent line */
		font-size: 0.9rem;
		font-weight: 500;
		color: #71717a;
		font-family: inherit;
		cursor: pointer;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
	}

	/* Dynamically applied when the state changes */
	.trade-category button.active {
		color: #dc2626; /* Crimson Accent */
		border-color: #dc2626;
	}

	.trade-category button:hover {
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

	.day-btn {
		background: transparent;
		border: none;
		color: #e4e4e7;
		height: 32px;
		width: 32px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		cursor: pointer;
		font-family: inherit;
		font-size: 0.8rem;
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.day-btn:hover:not(.filler) {
		background-color: #27272a;
		color: #f4f4f5;
	}

	.day-btn.filler {
		cursor: default;
		visibility: hidden;
	}

	.day-btn.selected {
		background-color: #dc2626; /* Crimson Accent */
		color: #f4f4f5;
	}

	.day-btn.in-range {
		background-color: rgba(220, 38, 38, 0.15);
		color: #fca5a5;
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

	/* ====================================================
       7. DYNAMIC TRADE LIST DATA CELL STYLING
       ==================================================== */

	/* Generic Cell Alignment & Text Truncation */
	td {
		font-family:
			ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; /* Monospace for numbers */
		font-size: 0.85rem;
	}

	/* Long Notes & Lessons Text Clamp */
	td.note-cell {
		max-width: 200px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #a1a1aa;
		font-family: inherit;
	}

	/* Chart URL Link Styling */
	td a.chart-link {
		color: #38bdf8; /* Soft cyan accent for links */
		text-decoration: none;
		font-family: inherit;
		font-size: 0.8rem;
		transition: color 0.2s ease;
	}

	td a.chart-link:hover {
		color: #7dd3fc;
		text-decoration: underline;
	}

	/* ----------------------------------------------------
       BADGES: Position Side (Long vs Short)
       ---------------------------------------------------- */
	.badge-position {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		font-family: inherit;
	}

	.badge-position.long {
		background-color: rgba(34, 197, 94, 0.15); /* Soft Green Tint */
		color: #4ade80;
		border: 1px solid rgba(34, 197, 94, 0.3);
	}

	.badge-position.short {
		background-color: rgba(220, 38, 38, 0.15); /* Soft Crimson Tint */
		color: #f87171;
		border: 1px solid rgba(220, 38, 38, 0.3);
	}

	/* ----------------------------------------------------
       BADGES: Result Outcomes (Win, Loss, Breakeven)
       ---------------------------------------------------- */
	.badge-result {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.25rem 0.6rem;
		border-radius: 9999px; /* Pill Shape */
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		font-family: inherit;
	}

	.badge-result.win {
		background-color: #14532d; /* Emerald Glow */
		color: #86efac;
		border: 1px solid #22c55e;
	}

	.badge-result.loss {
		background-color: #7f1d1d; /* Deep Crimson */
		color: #fca5a5;
		border: 1px solid #dc2626;
	}

	.badge-result.be {
		background-color: #27272a; /* Neutral Slate */
		color: #a1a1aa;
		border: 1px solid #3f3f46;
	}

	/* ----------------------------------------------------
       PnL & FINANCIAL TEXT HIGHLIGHTS
       ---------------------------------------------------- */
	.text-profit {
		color: #4ade80 !important;
		font-weight: 600;
	}

	.text-loss {
		color: #f87171 !important;
		font-weight: 600;
	}

	.text-muted-pnl {
		color: #71717a !important;
	}

	/* ====================================================
   8. MODAL OVERLAY & POPUP WINDOWS
   ==================================================== */

	/* Full-screen backdrop */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	/* The centered modal card (choice popup) */
	.modal-content {
		background-color: #18181b;
		border: 1px solid #27272a;
		border-radius: 12px;
		padding: 2rem;
		width: 100%;
		max-width: 360px;
		box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
		animation: modalFadeIn 0.2s ease;
	}

	.modal-content h3 {
		font-size: 1.15rem;
		font-weight: 700;
		margin: 0 0 0.4rem 0;
		color: #f4f4f5;
	}

	.modal-content p {
		font-size: 0.875rem;
		color: #a1a1aa;
		margin: 0 0 1.5rem 0;
	}

	/* Choice Popup Buttons Row */
	.modal-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.modal-actions button {
		padding: 0.5rem 1.1rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		border: 1px solid transparent;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	#edit-btn {
		background-color: #dc2626;
		color: #f4f4f5;
		border-color: #dc2626;
	}

	#edit-btn:hover {
		background-color: #b91c1c;
		border-color: #b91c1c;
	}

	#delete-btn {
		background-color: transparent;
		color: #f87171;
		border-color: #7f1d1d;
	}

	#delete-btn:hover {
		background-color: rgba(220, 38, 38, 0.15);
		border-color: #dc2626;
	}

	#cancel-btn {
		background-color: transparent;
		color: #a1a1aa;
		border-color: #27272a;
	}

	#cancel-btn:hover {
		background-color: #27272a;
		color: #f4f4f5;
	}

	/* ====================================================
   9. EDIT TRADE FORM MODAL
   ==================================================== */

	/* Edit form renders as a full-screen overlay modal */
	form {
		position: fixed;
		display: flex;
		flex-direction: column;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.75);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		padding: 1.5rem;
		box-sizing: border-box;
		overflow-y: auto;
		animation: modalFadeIn 0.2s ease;
	}

	/* Wrap the form body in a scrollable card */
	form {
		align-items: flex-start; /* Allow vertical scroll on small screens */
	}

	.form-section {
		background-color: #18181b;
		border: 1px solid #27272a;
		border-radius: 10px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		width: 100%;
		max-width: 780px;
		margin-inline: auto;
	}

	.form-section legend {
		font-size: 0.8rem;
		font-weight: 700;
		color: #71717a;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0 0.5rem;
	}

	/* Highlight section (Trade Performance) */
	.highlight-section {
		border-color: rgba(220, 38, 38, 0.3);
		background-color: rgba(220, 38, 38, 0.04);
	}

	/* Grid Layouts */
	.grid-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.grid-3 {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
	}

	.grid-4 {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 1rem;
	}

	.mt-4 {
		margin-top: 1rem;
	}

	/* Input Groups */
	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.input-group label {
		font-size: 0.75rem;
		font-weight: 600;
		color: #71717a;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.input-group input,
	.input-group select,
	.input-group textarea {
		background-color: #09090b;
		border: 1px solid #27272a;
		color: #f4f4f5;
		padding: 0.55rem 0.75rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-family: inherit;
		transition: border-color 0.2s;
		width: 100%;
		box-sizing: border-box;
	}

	.input-group input:focus,
	.input-group select:focus,
	.input-group textarea:focus {
		outline: none;
		border-color: #dc2626;
	}

	.input-group textarea {
		min-height: 90px;
		resize: vertical;
	}

	/* Form Save Button */
	.form-actions {
		display: flex;
		justify-content: flex-end;
		max-width: 780px;
		margin-inline: auto;
		gap: 10px;
		padding-bottom: 2rem;
	}

	.btn-primary {
		background-color: #dc2626;
		color: #f4f4f5;
		border: none;
		padding: 0.65rem 1.5rem;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 700;
		font-family: inherit;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-primary:hover {
		background-color: #b91c1c;
	}

	/* ====================================================
   10. MODAL ENTRANCE ANIMATION
   ==================================================== */
	@keyframes modalFadeIn {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
