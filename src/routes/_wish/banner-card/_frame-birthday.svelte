<script>
	import { onMount, onDestroy } from 'svelte';
	import { ITEMS } from '$lib/data/birthday-config';
	import { birthdayItemImages } from '$lib/helpers/placeholder-items';
	import { birthdayReveals } from '$lib/helpers/birthday-banner-state';

	export let data = {};

	const images = birthdayItemImages();

	/* ==========================================================
	   FEATURED ITEMS
	   ========================================================== */

	$: featured = (data.featuredIds || [])
		.map((id) => ITEMS.find(({ name }) => name === id))
		.filter(Boolean);

	$: golds = featured.filter((item) => item.rarity === 5);
	$: blues = featured.filter((item) => item.rarity === 4);

	/*
	 * The Glaze Lily is already part of the birthday banner artwork,
	 * so it should always be shown as revealed.
	 */

	$: revealed = $birthdayReveals[data.type] || [];

	const isRevealed = (item) =>
	revealed.includes(item.name);


	/* ==========================================================
	   ORB POSITIONS
	   ========================================================== */

	/*
	 * These are intentionally NOT dependent on array order.
	 *
	 * Gold always gets the center position.
	 * Blue orbs always get their own positions.
	 *
	 * x / y = top-left position in % of mystery area
	 * w = orb diameter in % of mystery area
	 */

	const goldPositions = [
		{ x: 24, y: 2, w: 59 }
	];

	const bluePositions = [
		{ x: -6, y: 0, w: 41 },   // upper-left
		{ x: 68, y: 2, w: 39 },    // upper-right
		{ x: 69, y: 58, w: 40 }   // lower-right
	];

	const positionStyle = (position) => `
		left: ${position.x}%;
		top: ${position.y}%;
		width: ${position.w}%;
	`;


	/* ==========================================================
	   COUNTDOWN
	   ========================================================== */

	// Banner ends Oct 12, 2026 00:00 (Manila / UTC+8).
	// data.endsAt overrides it if provided.
	const END_DATE = '2026-10-12T00:00:00+08:00';

	let now = Date.now();
	let timer;

	onMount(() => {
		timer = setInterval(() => {
			now = Date.now();
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(timer);
	});

	$: remaining = Math.max(
		0,
		new Date(data.endsAt ?? END_DATE).getTime() - now
	);

	$: d = Math.floor(remaining / 86400000);
	$: h = Math.floor((remaining % 86400000) / 3600000);
	$: m = Math.floor((remaining % 3600000) / 60000);


	/* ==========================================================
	   DECORATIVE SPARKLES
	   ========================================================== */

	const sparkles = [
		{ x: 43, y: 9, s: 1.8, d: 0 },
		{ x: 50, y: 22, s: 1.1, d: 0.8 },
		{ x: 38, y: 47, s: 1.3, d: 1.6 },
		{ x: 66, y: 12, s: 1.5, d: 0.4 },
		{ x: 58, y: 66, s: 1.0, d: 1.2 },
		{ x: 73, y: 78, s: 1.6, d: 2 }
	];


	/* ==========================================================
	   DESCRIPTION
	   ========================================================== */

	$: lines = data.description || [];
	$: highlight = lines[0];
	$: rest = lines.slice(1);
</script>


<div class="bday">

	<!-- ======================================================
	     BACKGROUND ART
	     ====================================================== -->

	<div
		class="art"
		style={data.image ? `background-image: url(${data.image})` : ''}
	></div>

	<div class="fade"></div>
	<div class="streaks"></div>
	<div class="panel"></div>


	<!-- ======================================================
	     SPARKLES
	     ====================================================== -->

	{#each sparkles as sp}
		<span
			class="twinkle"
			style={`
				left:${sp.x}%;
				top:${sp.y}%;
				font-size:${sp.s}cqw;
				animation-delay:${sp.d}s
			`}
		>
			✦
		</span>
	{/each}


	<!-- ======================================================
	     LEFT TEXT
	     ====================================================== -->

	<div class="text">

		<h1 class:has-accent={data.titleAccent}>
			{data.title}

			{#if data.titleAccent}
				<span class="accent">
					{data.titleAccent}
				</span>
			{/if}
		</h1>

		{#if data.kicker}
			<div class="kicker">
				{data.kicker}
			</div>
		{/if}

		{#if data.wishLabel}
			<div class="pill">
				<span>✦</span>
				{data.wishLabel}
			</div>
		{:else}
			<div class="divider"></div>
		{/if}


		<div class="prob">

			<div class="bar"></div>

			<h3>
				Probability increased
			</h3>

			{#if highlight}
				<div class="highlight">
					<span class="spark">✦</span>
					<span>{highlight}</span>
				</div>
			{/if}

			<div class="desc">
				{#each rest as line}
					<p>{line}</p>
				{/each}
			</div>

		</div>

	</div>


	<!-- ======================================================
	     COUNTDOWN
	     ====================================================== -->

	<div class="time">

		<div class="divider"></div>

		<div class="time-label">
			Time Remaining
		</div>

		<div class="time-value">
			{d} day(s) {h} hour(s) {m} minute(s)
		</div>

	</div>


	<!-- ======================================================
	     MYSTERY FEATURED ORBS
	     ====================================================== -->

	<div class="mystery-section">

		<div class="mystery-slots">


			<!-- ==================================================
			     BLUE FEATURED ITEMS
			     ================================================== -->

			{#each blues as item, i (item.name)}

				{#if isRevealed(item)}

					<!-- REVEALED BLUE ITEM -->
					<div
						class="slot blue revealed"
						style={positionStyle(
							bluePositions[i % bluePositions.length]
						)}
					>

						<img
							src={item.image || images[item.name]}
							alt={item.label}
						/>

					</div>

				{:else}

					<!-- MYSTERY BLUE ORB -->
					<div
						class="slot blue mystery"
						style={`
							${positionStyle(
								bluePositions[i % bluePositions.length]
							)}

							--orb-art: url("${data.mysteryArt?.fourStar || ''}");
						`}
					>

						<div class="orb-texture"></div>

						<div
							class="orb-question"
							aria-hidden="true"
						>
							?
						</div>

					</div>

				{/if}

			{/each}


			<!-- ==================================================
			     GOLD FEATURED ITEM
			     ================================================== -->

			{#each golds as item, i (item.name)}

				{#if isRevealed(item)}

					<!-- REVEALED GOLD ITEM -->
					<div
						class="slot gold revealed"
						style={positionStyle(
							goldPositions[i % goldPositions.length]
						)}
					>

						<img
							src={item.image || images[item.name]}
							alt={item.label}
						/>

					</div>

				{:else}

					<!-- MYSTERY GOLD ORB -->
					<div
						class="slot gold mystery"
						style={`
							${positionStyle(
								goldPositions[i % goldPositions.length]
							)}

							--orb-art: url("${data.mysteryArt?.fiveStar || ''}");
						`}
					>

						<div class="orb-texture"></div>

						<div
							class="orb-question"
							aria-hidden="true"
						>
							?
						</div>

					</div>

				{/if}

			{/each}

		</div>

	</div>


	<!-- ======================================================
	     NAME PLATE
	     ====================================================== -->

	<div class="plate">

		<div class="plate-top">

			<div class="emblem">

				<svg
					viewBox="0 0 32 32"
					aria-hidden="true"
				>
					<path
						d="M16 2 C22 8 22 15 16 21 C10 15 10 8 16 2Z"
					/>

					<path
						d="M3 11 C11 10 15.500 13.500 16 21 C8 22 4 18.500 3 11Z"
					/>

					<path
						d="M29 11 C21 10 16.500 13.500 16 21 C24 22 28 18.500 29 11Z"
					/>

					<path
						d="M16 23 L16 30"
						fill="none"
						stroke="currentColor"
						stroke-width="2.200"
						stroke-linecap="round"
					/>

				</svg>

			</div>


			<div class="name">

				Birthday Gifts

				{#if data.tag}
					<span class="up">
						UP!
					</span>
				{/if}

			</div>

		</div>


		<div class="stars">
			★★★★★
		</div>


		{#if data.tag}

			<div class="sub">
				{data.tag}
			</div>

		{/if}

	</div>

</div>


<style>
	/* ==========================================================
	   FONTS
	   ========================================================== */

	@font-face {
		font-family: 'HYWenHei';

		src:
			url('/fonts/HYWenHei.ttf')
			format('truetype');

		font-weight: 100 900;

		font-display: swap;
	}

	@font-face {
		font-family: 'GenshinDefaultJP';

		src:
			url('/fonts/Default_JP.ttf')
			format('truetype');

		font-weight: 100 900;

		font-display: swap;
	}


	/* ==========================================================
	   MAIN BANNER
	   ========================================================== */

	.bday {

		--accent: #8a63d2;
		--accent-deep: #5b4a86;

		--highlight-bg:
			rgba(122, 92, 190, 0.82);

		--panel: #473478;

		--plate-dark: #33265f;
		--plate-sub: #2a1f4f;
		--plate-outline: #3a2a6b;

		--emblem: #c3a6ff;

		--paper: #f6f2f8;
		--ink: #5d5a66;
		--rule: #d9c6bd;


		container-type: inline-size;

		position: relative;

		width: 100%;

		aspect-ratio:
			1080 / 533;

		overflow: hidden;


		background:

			repeating-linear-gradient(
				90deg,
				rgba(0, 0, 0, 0.012) 0 2px,
				transparent 2px 6px
			),

			var(--paper);


		font-family:
			'HYWenHei',
			'GenshinDefaultJP',
			'Segoe UI',
			Arial,
			sans-serif;


		font-weight: 400;

		color: var(--ink);
	}


	/* ==========================================================
	   BACKGROUND
	   ========================================================== */

	.art {

		position: absolute;

		inset: 0;

		background-size: cover;

		background-position: center;

		opacity: 0.95;

		z-index: 0;
	}


	.panel {

		position: absolute;

		top: 0;
		right: 0;

		width: 30%;
		height: 100%;

		border-top-left-radius:
			100% 100%;


		background:

			repeating-conic-gradient(
				rgba(255, 255, 255, 0.07) 0% 25%,
				transparent 0% 50%
			)
			0 0 / 1.1cqw 1.1cqw,

			var(--panel);


		opacity: 0.88;

		z-index: 1;

		pointer-events: none;
	}


	.fade {

		position: absolute;

		inset: 0;


		background:

			linear-gradient(
				90deg,
				rgba(246, 242, 248, 0.94) 0%,
				rgba(246, 242, 248, 0.78) 30%,
				rgba(246, 242, 248, 0) 55%
			);


		z-index: 1;

		pointer-events: none;
	}


	.streaks {

		position: absolute;

		inset: 0;


		background:

			linear-gradient(
				112deg,
				transparent 38%,
				rgba(150, 110, 230, 0.2) 46%,
				transparent 58%
			),

			linear-gradient(
				104deg,
				transparent 52%,
				rgba(255, 255, 255, 0.55) 53.500%,
				transparent 56%
			),

			linear-gradient(
				96deg,
				transparent 60%,
				rgba(190, 160, 255, 0.22) 64%,
				transparent 72%
			);


		z-index: 1;

		pointer-events: none;
	}


	/* ==========================================================
	   SPARKLES
	   ========================================================== */

	.twinkle {

		position: absolute;

		line-height: 1;

		color: #fff;


		text-shadow:

			0 0 0.8cqw
			var(--accent),

			0 0 1.6cqw
			var(--accent);


		animation:
			twinkle 3.2s
			ease-in-out infinite;


		z-index: 4;

		pointer-events: none;
	}


	@keyframes twinkle {

		0%,
		100% {

			opacity: 0.25;

			transform:
				scale(0.75);
		}


		50% {

			opacity: 1;

			transform:
				scale(1.1);
		}

	}


	@media (prefers-reduced-motion: reduce) {

		.twinkle {

			animation: none;

			opacity: 0.7;
		}

	}


	/* ==========================================================
	   LEFT TEXT
	   ========================================================== */

	.text {

		position: absolute;

		left: 4%;

		top: 5.5%;

		width: 34%;


		/*
		 * ALWAYS ABOVE ORBS
		 */
		z-index: 20;
	}


	h1 {

		margin: 0;

		font-size: 4.2cqw;

		line-height: 1.12;

		font-weight: 400;


		color: var(--accent);


		background:

			linear-gradient(
				180deg,
				var(--accent) 0%,
				var(--accent-deep) 100%
			);


		-webkit-background-clip: text;

		background-clip: text;

		-webkit-text-fill-color: transparent;


		filter:

			drop-shadow(
				0 0.1cqw
				rgba(255, 255, 255, 0.8)
			);
	}


	h1.has-accent {

		background: none;

		-webkit-text-fill-color:
			#57535f;

		color: #57535f;
	}


	.accent {

		display: block;


		background:

			linear-gradient(
				180deg,
				var(--accent) 0%,
				var(--accent-deep) 100%
			);


		-webkit-background-clip:
			text;

		background-clip:
			text;

		-webkit-text-fill-color:
			transparent;
	}


	.kicker {

		margin-top: 1cqw;

		font-size: 2cqw;

		line-height: 1.2;

		color: #5f5c68;
	}


	.pill {

		display: flex;

		align-items: center;

		gap: 0.6cqw;

		width: max-content;

		margin:
			1.6cqw
			0
			1.8cqw;

		padding:
			0.5cqw
			1.6cqw
			0.5cqw
			0.8cqw;


		font-size: 1.7cqw;

		line-height: 1.2;

		color: #fff;


		background:

			linear-gradient(
				90deg,
				rgba(42, 31, 79, 0.82),
				rgba(70, 52, 120, 0.6)
			);


		border:

			0.1cqw solid
			rgba(255, 255, 255, 0.55);


		border-left:

			0.35cqw solid
			var(--accent);


		border-radius:
			0
			0.4cqw
			0.4cqw
			0;


		box-shadow:

			0 0.4cqw
			1cqw
			rgba(60, 40, 120, 0.25);
	}


	.pill span {

		color: #e4d6ff;
	}


	.divider {

		margin:
			2.2cqw
			0
			1.8cqw;

		border-top:
			0.15cqw dashed
			var(--rule);
	}


	.prob {

		position: relative;
	}


	.bar {

		position: absolute;

		left: -4%;

		top: -0.2cqw;

		bottom: 0;

		width: 0.55cqw;

		background: #5a5a5a;
	}


	h3 {

		margin:
			0
			0
			0.8cqw;

		font-size: 2.1cqw;

		line-height: 1.2;

		font-weight: 400;

		color: #5f5c68;
	}


	.highlight {

		display: flex;

		align-items: center;

		gap: 0.6cqw;

		padding:
			0.5cqw
			0.8cqw
			0.5cqw
			0.4cqw;


		background:
			var(--highlight-bg);

		color: #fff;

		font-size: 1.9cqw;

		font-weight: 400;

		line-height: 1.2;
	}


	.spark {

		flex: none;

		font-size: 1.8cqw;
	}


	.desc {

		margin-top: 0.8cqw;

		font-size: 1.8cqw;

		line-height: 1.2;

		font-weight: 400;

		color: #5f5c68;


		text-shadow:

			0 0 0.6cqw
			rgba(246, 242, 248, 0.9);
	}


	.desc p {

		margin:
			0
			0
			0.4cqw;
	}


	/* ==========================================================
	   COUNTDOWN
	   ========================================================== */

	.time {

		position: absolute;

		left: 4%;

		bottom: 6%;

		width: 30%;

		font-size: 1.9cqw;

		line-height: 1.2;

		font-weight: 400;

		color: #5f5c68;


		/*
		 * Above orb layer.
		 */
		z-index: 20;
	}


	.time .divider {

		margin:
			0
			0
			1.2cqw;
	}


	.time-label {

		margin-bottom: 0.7cqw;
	}


	.time-value {

		white-space: nowrap;
	}


	/* ==========================================================
	   NAME PLATE
	   ========================================================== */

	.plate {

		position: absolute;

		left: 49%;

		bottom: 12%;

		width: 22%;


		isolation: isolate;


		/*
		 * Above the orb graphics.
		 */
		z-index: 20;
	}


	.plate-top {

		position: relative;

		display: flex;

		align-items: center;
	}


	.emblem {

		position: absolute;

		left: -4.2cqw;

		top: -0.6cqw;

		width: 5cqw;

		height: 5cqw;


		display: grid;

		place-items: center;


		color: var(--emblem);


		background:

			radial-gradient(
				circle,
				var(--plate-dark) 55%,
				transparent 58%
			);


		border-radius: 50%;


		filter:

			drop-shadow(
				0 0 0.4cqw
				rgba(0, 0, 0, 0.35)
			);
	}


	.emblem svg {

		width: 62%;

		height: 62%;

		fill:
			currentColor;
	}


	.plate::before {

		content: '';

		position: absolute;


		inset:
			-4cqw
			-5cqw
			-3cqw
			-6cqw;


		background:

			radial-gradient(
				ellipse at 40% 50%,
				rgba(180, 140, 255, 0.45),
				transparent 65%
			);


		z-index: -1;
	}


	.name {

		position: relative;

		margin-left: 1cqw;

		font-size: 4.6cqw;

		font-weight: 400;

		line-height: 1;

		color: #fff;


		-webkit-text-stroke:
			0.3cqw
			var(--plate-outline);


		paint-order:
			stroke fill;


		text-shadow:
			0 0.2cqw
			0
			var(--plate-outline);


		white-space: nowrap;
	}


	.up {

		position: absolute;

		right: -1.5cqw;

		top: -1.8cqw;

		font-size: 1.5cqw;

		font-weight: 400;

		color: #f6c431;


		-webkit-text-stroke:
			0.15cqw
			#fff;


		paint-order:
			stroke fill;


		transform:
			rotate(5deg);
	}


	.stars {

		margin-top: -0.2cqw;

		padding:
			0.4cqw
			0
			0.5cqw
			1.6cqw;


		background:

			linear-gradient(
				90deg,
				var(--plate-dark),
				rgba(51, 38, 95, 0.88)
			);


		border-top:
			0.12cqw solid
			#d9b86a;


		color: #f5c44a;


		text-shadow:

			0 0 0.6cqw
			rgba(245, 196, 74, 0.6);


		font-size: 1.9cqw;

		letter-spacing: 0.1cqw;

		line-height: 1;
	}


	.sub {

		margin:
			0.4cqw
			0
			0
			1cqw;

		padding:
			0.35cqw
			1cqw;


		width: max-content;

		min-width: 14cqw;


		background:

			linear-gradient(
				90deg,
				var(--plate-sub),
				rgba(42, 31, 79, 0.85)
			);


		border-bottom:
			0.12cqw solid
			#d9b86a;


		color: #f1d9a0;


		font-size: 1.7cqw;

		line-height: 1.2;

		font-weight: 400;
	}


	/* ==========================================================
	   MYSTERY ORB AREA
	   ========================================================== */

	.mystery-section {

		position: absolute;

		right: 0.5%;

		top: 3%;


		width: 47%;


		aspect-ratio:
			47 / 33;


		/*
		 * CRITICAL:
		 * The orb graphics stay BELOW your banner text.
		 */
		z-index: 2;


		pointer-events: none;
	}


	.mystery-slots {

		position: relative;

		width: 100%;

		height: 100%;
	}


	/* ==========================================================
	   ORB BASE
	   ========================================================== */

	.slot {

		position: absolute;

		aspect-ratio: 1;

		border-radius: 50%;


		display: flex;

		align-items: center;

		justify-content: center;


		overflow: visible;


		filter:

			drop-shadow(
				0 0.7cqw
				0.8cqw
				rgba(25, 12, 53, 0.22)
			);
	}


	.slot.blue {

		z-index: 2;
	}


	.slot.gold {

		z-index: 3;
	}


	/* ==========================================================
	   MYSTERY BLUE ORB
	   ========================================================== */

	.slot.blue.mystery {

		background:
	radial-gradient(
		circle at 28% 20%,
		rgba(255, 255, 255, 0.9),
		transparent 10%
	),
	radial-gradient(
		circle at 72% 78%,
		rgba(24, 8, 70, 0.65),
		transparent 40%
	),
	radial-gradient(
		circle at 50% 45%,
		rgba(188, 147, 255, 0.98),
		rgba(119, 76, 208, 0.98) 42%,
		rgba(77, 38, 145, 1) 70%,
		rgba(35, 14, 75, 1) 100%
	);

		background-position:
			center;

		background-size:
			cover;


		border:
			0.25cqw solid
			rgba(207, 235, 255, 0.98);


		box-shadow:

			0 0 1.6cqw
			rgba(75, 174, 255, 0.72),


			0 0 3.5cqw
			rgba(51, 132, 255, 0.28),


			inset 0 0 1.5cqw
			rgba(255, 255, 255, 0.22),


			inset 0 -1.4cqw 2cqw
			rgba(7, 18, 67, 0.4);


		animation:
			orbFloatBlue 3.6s
			ease-in-out infinite;


		isolation: isolate;
	}


	/* ==========================================================
	   BLUE ORB TEXTURE
	   ========================================================== */

	.slot.blue .orb-texture {
	position: absolute;
	inset: 3%;

	border-radius: 50%;

	background:
		radial-gradient(
			ellipse at 27% 20%,
			rgba(255, 255, 255, 0.42),
			transparent 18%
		),

		radial-gradient(
			ellipse at 65% 72%,
			rgba(35, 10, 90, 0.28),
			transparent 38%
		),

		radial-gradient(
			circle at 50% 50%,
			transparent 35%,
			rgba(255, 255, 255, 0.08) 60%,
			transparent 76%
		),

		linear-gradient(
			145deg,
			rgba(255, 255, 255, 0.16),
			transparent 28%,
			transparent 68%,
			rgba(18, 5, 55, 0.18)
		);

	opacity: 0.9;

	mix-blend-mode: screen;

	z-index: 4;

	pointer-events: none;
}


	/* ==========================================================
	   BLUE GLOSS
	   ========================================================== */

	.slot.blue.mystery::before {
	content: '';

	position: absolute;

	left: 12%;
	top: 8%;

	width: 38%;
	height: 24%;

	border-radius: 50%;

	background:
		radial-gradient(
			ellipse at center,
			rgba(255, 255, 255, 0.82),
			rgba(255, 255, 255, 0.24) 38%,
			transparent 72%
		);

	transform: rotate(-25deg);

	filter: blur(0.12cqw);

	opacity: 0.95;

	z-index: 5;

	pointer-events: none;
}

	/* ==========================================================
	   GOLD ORB
	   ========================================================== */

	.slot.gold.mystery {

		background:

			/*
			 * TFT gold orb artwork.
			 */
			var(--orb-art),


			/*
			 * Bright white reflection.
			 */
			radial-gradient(
				circle at 29% 19%,
				rgba(255, 255, 255, 1),
				transparent 8%
			),


			/*
			 * Deep warm shadow.
			 */
			radial-gradient(
				circle at 68% 72%,
				rgba(92, 43, 0, 0.7),
				transparent 43%
			),


			/*
			 * Main golden body.
			 */
			radial-gradient(
				circle at 50% 47%,
				rgba(255, 244, 182, 1),
				rgba(246, 190, 72, 1) 44%,
				rgba(185, 110, 21, 1) 71%,
				rgba(92, 45, 4, 1) 90%
			);


		background-position:
			center;

		background-size:
			cover;


		border:
			0.27cqw solid
			rgba(255, 242, 191, 0.99);


		box-shadow:

			0 0 2.5cqw
			rgba(255, 215, 118, 0.82),


			0 0 5cqw
			rgba(255, 185, 60, 0.3),


			inset 0 0 1.8cqw
			rgba(255, 255, 255, 0.28),


			inset 0 -1.5cqw 2.2cqw
			rgba(92, 45, 0, 0.42);


		animation:
			orbFloatGold 3.8s
			ease-in-out infinite;


		isolation: isolate;
	}


	/* ==========================================================
	   GOLD TEXTURE
	   ========================================================== */

	.slot.gold .orb-texture {
	position: absolute;
	inset: 3%;

	border-radius: 50%;

	background:
		radial-gradient(
			ellipse at 27% 20%,
			rgba(255, 255, 255, 0.42),
			transparent 18%
		),

		radial-gradient(
			ellipse at 65% 72%,
			rgba(35, 10, 90, 0.28),
			transparent 38%
		),

		radial-gradient(
			circle at 50% 50%,
			transparent 35%,
			rgba(255, 255, 255, 0.08) 60%,
			transparent 76%
		),

		linear-gradient(
			145deg,
			rgba(255, 255, 255, 0.16),
			transparent 28%,
			transparent 68%,
			rgba(18, 5, 55, 0.18)
		);

	opacity: 0.9;

	mix-blend-mode: screen;

	z-index: 4;

	pointer-events: none;
}


	/* ==========================================================
	   GOLD GLOSS
	   ========================================================== */

	.slot.gold.mystery::before {

		content: '';

		position: absolute;


		left: 12%;

		top: 8%;


		width: 37%;

		height: 23%;


		border-radius: 50%;


		background:

			radial-gradient(
				ellipse,
				rgba(255, 255, 255, 0.83),
				rgba(255, 255, 255, 0.16) 43%,
				transparent 73%
			);


		transform:
			rotate(-25deg);


		filter:
			blur(0.15cqw);


		opacity: 0.92;

		z-index: 5;

		pointer-events: none;
	}


	/* ==========================================================
	   QUESTION MARK
	   ========================================================== */

	.orb-question {

		position: relative;

		z-index: 10;


		display: flex;

		align-items: center;

		justify-content: center;


		width: 100%;

		height: 100%;


		font-size: 8cqw;

		line-height: 1;

		font-weight: 700;


		color:
			rgba(255, 255, 255, 0.98);


		text-shadow:

			0 0.18cqw
			0.7cqw
			rgba(10, 18, 54, 0.92),


			0 0
			0.5cqw
			rgba(255, 255, 255, 0.85),


			0 0
			1.4cqw
			rgba(255, 255, 255, 0.3);


		pointer-events: none;
	}


	.slot.gold .orb-question {

		font-size: 13cqw;


		text-shadow:

			0 0.22cqw
			0.8cqw
			rgba(92, 45, 0, 0.92),


			0 0
			0.5cqw
			rgba(255, 255, 255, 0.92),


			0 0
			1.5cqw
			rgba(255, 243, 192, 0.48);
	}


	/* ==========================================================
	   REVEALED ITEM
	   ========================================================== */

	.revealed {

		border-radius: 50%;


		background:

			radial-gradient(
				circle,
				rgba(255, 255, 255, 0.48),
				rgba(255, 255, 255, 0.08)
			);


		box-shadow:

			0 1rem 2rem
			rgba(0, 0, 0, 0.25),


			0 0 1.5rem
			rgba(255, 227, 166, 0.3);


		animation:
			revealPop 0.55s
			ease-out;


		backdrop-filter:
			blur(3px);
	}


	.revealed img {

		width: 78%;

		height: 78%;


		object-fit: contain;


		filter:

			drop-shadow(
				0 0.5rem
				1rem
				rgba(0, 0, 0, 0.32)
			);


		z-index: 8;
	}


	/*
	 * NO LABELS HERE.
	 *
	 * This intentionally removes the "Glaze Lily" text and
	 * all other item names from underneath the revealed orbs.
	 */


	/* ==========================================================
	   ANIMATIONS
	   ========================================================== */

	@keyframes orbFloatBlue {

		0%,
		100% {
			transform:
				translateY(0);
		}


		50% {
			transform:
				translateY(-5px);
		}
	}


	@keyframes orbFloatGold {

		0%,
		100% {
			transform:
				translateY(0);
		}


		50% {
			transform:
				translateY(-7px);
		}
	}


	@keyframes revealPop {

		0% {

			transform:
				scale(0.7);

			opacity: 0;
		}


		70% {

			transform:
				scale(1.08);
		}


		100% {

			transform:
				scale(1);

			opacity: 1;
		}

	}


	/* ==========================================================
	   MOBILE
	   ========================================================== */

	:global(.mobile) .mystery-section {

		width: 49%;
	}
</style>