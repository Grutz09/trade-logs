<script>
	// Write your Svelte JavaScript logic, bindings, and submit handlers here!
</script>

<main class="form-page">
	<div class="form-container">
		<header class="form-header">
			<h1>Log New <span>Trade</span></h1>
			<p>Fill out the data details to update your trading journal.</p>
		</header>

		<form>
			<fieldset class="form-section">
				<legend>Trade Setup & Logistics</legend>
				<div class="grid-3">
					<div class="input-group">
						<label for="trade_date">Trade Date</label>
						<input id="trade_date" type="date" />
					</div>

					<div class="input-group">
						<label for="pair">Ticker / Pair</label>
						<input id="pair" />
					</div>

					<div class="input-group">
						<label for="position">Position Side</label>
						<select id="position">
							<option>LONG (Buy)</option>
							<option>SHORT (Sell)</option>
						</select>
					</div>
				</div>
			</fieldset>

			<fieldset class="form-section">
				<legend>Prices & Risk Management</legend>
				<div class="grid-4">
					<div class="input-group">
						<label for="entry_price">Entry Price</label>
						<input id="entry_price" />
					</div>

					<div class="input-group">
						<label for="exit_price">Exit Price</label>
						<input id="exit_price" />
					</div>

					<div class="input-group">
						<label for="stop_loss">Stop Loss (SL)</label>
						<input id="stop_loss" />
					</div>

					<div class="input-group">
						<label for="take_profit">Take Profit (TP)</label>
						<input id="take_profit" />
					</div>
				</div>

				<div class="grid-3 mt-4">
					<div class="input-group">
						<label for="leverage">Leverage / Lot Size</label>
						<input id="leverage" />
					</div>

					<div class="input-group">
						<label for="risk_amount">Risk Amount ($)</label>
						<input id="risk_amount" />
					</div>
				</div>
			</fieldset>

			<fieldset class="form-section highlight-section">
				<legend>Trade Performance & Outcome</legend>
				<div class="grid-4">
					<div class="input-group">
						<label for="result">Result</label>
						<select id="result">
							<option>WIN</option>
							<option>LOSS</option>
							<option>Breakeven</option>
						</select>
					</div>

					<div class="input-group">
						<label for="profit">Gross Profit</label>
						<input id="profit" />
					</div>

					<div class="input-group">
						<label for="loss">Gross Loss</label>
						<input id="loss" />
					</div>

					<div class="input-group">
						<label for="net_pnl">Net PnL ($)</label>
						<input id="net_pnl" />
					</div>
				</div>
			</fieldset>

			<fieldset class="form-section">
				<legend>Strategy & Market Context</legend>
				<div class="grid-3">
					<div class="input-group">
						<label for="strategy">Strategy / Playbook Setup</label>
						<input id="strategy" />
					</div>

					<div class="input-group">
						<label for="market_condition">Market Condition</label>
						<select id="market_condition">
							<option>Trending Up / Down</option>
							<option>Ranging / Sideways</option>
							<option>High Volatility Chopping</option>
						</select>
					</div>

					<div class="input-group">
						<label for="chart_image_url">Chart Setup URL</label>
						<input id="chart_image_url" />
					</div>
				</div>
			</fieldset>

			<fieldset class="form-section">
				<legend>Psychology & Post-Trade Analysis</legend>
				<div class="grid-2">
					<div class="input-group">
						<label for="emotion_before">Emotion Before Trade</label>
						<select id="emotion_before">
							<option>Confident / Disciplined</option>
							<option>Calm / Neutral</option>
							<option>FOMO / Impatient</option>
							<option>Anxious / Fearful</option>
						</select>
					</div>

					<div class="input-group">
						<label for="emotion_after">Emotion After Trade</label>
						<select id="emotion_after">
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
						<textarea id="mistake_notes"></textarea>
					</div>

					<div class="input-group">
						<label for="lesson_learned">Key Lesson Learned</label>
						<textarea id="lesson_learned"></textarea>
					</div>
				</div>
			</fieldset>

			<div class="form-actions">
				<button class="btn-secondary">Clear Fields</button>
				<button class="btn-primary">Commit Trade to Journal</button>
			</div>
		</form>
	</div>
</main>

<style>
	/* Content Layout Container */
	.form-page {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding: 4rem 1.5rem;
		background-color: #09090b; /* Pitch Black */
	}

	.form-container {
		width: 100%;
		max-width: 900px;
		background-color: #18181b; /* Charcoal Surface */
		border: 1px solid #27272a; /* Gunmetal Border */
		border-radius: 12px;
		padding: 2.5rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
	}

	.form-header {
		margin-bottom: 2.5rem;
		border-bottom: 1px solid #27272a;
		padding-bottom: 1.5rem;
	}

	.form-header h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	.form-header h1 span {
		color: #dc2626; /* Crimson Red Accent */
		text-shadow: 0 0 10px rgba(220, 38, 38, 0.2);
	}

	.form-header p {
		margin: 0;
		color: #a1a1aa; /* Slate Gray */
		font-size: 0.95rem;
	}

	/* Section Fieldsets styling */
	.form-section {
		border: none;
		padding: 0;
		margin: 0 0 2.5rem 0;
	}

	.form-section legend {
		color: #f4f4f5;
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 1rem;
		position: relative;
		padding-left: 0.75rem;
	}

	/* Decorative Crimson dash next to headers */
	.form-section legend::before {
		content: '';
		position: absolute;
		left: 0;
		top: 25%;
		height: 50%;
		width: 3px;
		background-color: #dc2626;
		border-radius: 2px;
	}

	.highlight-section {
		background-color: rgba(39, 39, 42, 0.3); /* Soft translucent inlay block */
		padding: 1.25rem;
		border-radius: 8px;
		border: 1px dashed #27272a;
	}

	/* Grids for inputs */
	.grid-2 {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.25rem;
	}
	.grid-3 {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
	}
	.grid-4 {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1.25rem;
	}

	.mt-4 {
		margin-top: 1.25rem;
	}

	/* Individual Inputs styling */
	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.input-group label {
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #a1a1aa;
	}

	.input-group input,
	.input-group select,
	.input-group textarea {
		background-color: #09090b; /* Inverted background layout */
		border: 1px solid #27272a;
		color: #f4f4f5;
		padding: 0.75rem 1rem;
		font-size: 0.95rem;
		border-radius: 6px;
		font-family: inherit;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.input-group input:focus,
	.input-group select:focus,
	.input-group textarea:focus {
		outline: none;
		border-color: #dc2626; /* Accent glow focus */
		box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.15);
	}

	/* Input Specifics overrides */
	.input-group textarea {
		resize: vertical;
	}

	/* Action buttons block */
	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		border-top: 1px solid #27272a;
		padding-top: 2rem;
		margin-top: 1rem;
	}

	.btn-primary,
	.btn-secondary {
		font-size: 0.95rem;
		font-weight: 500;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	.btn-primary {
		background-color: #dc2626;
		border: 1px solid #dc2626;
		color: #f4f4f5;
		box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
	}

	.btn-primary:hover {
		background-color: #b91c1c;
		border-color: #b91c1c;
		transform: translateY(-1px);
		box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3);
	}

	.btn-secondary {
		background-color: transparent;
		border: 1px solid #27272a;
		color: #a1a1aa;
	}

	.btn-secondary:hover {
		border-color: #a1a1aa;
		color: #f4f4f5;
	}

	/* Responsive scaling down for smaller browser screens */
	@media (max-width: 768px) {
		.grid-2,
		.grid-3,
		.grid-4 {
			grid-template-columns: 1fr;
		}
		.form-container {
			padding: 1.5rem;
		}
	}
</style>
