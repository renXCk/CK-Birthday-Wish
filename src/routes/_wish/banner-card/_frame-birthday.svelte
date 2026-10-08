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
		{ x: 18, y: 5, w: 26 },
		{ x: 62, y: 4, w: 27 },
		{ x: 38, y: 34, w: 29 },
		{ x: 10, y: 62, w: 26 },
		{ x: 58, y: 65, w: 27 }
	];

	const bluePositions = [
		{ x: -2, y: 2, w: 21 },
		{ x: 0, y: 36, w: 21 },
		{ x: 82, y: 35, w: 22 },
		{ x: 35, y: 74, w: 20 }
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

	{#if data.tag}
		<div class="event-tag">{data.tag}</div>
	{/if}


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
			<span class="title-main">{data.title}</span>

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
				Probability increased!
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
						style={`
							${positionStyle(
								bluePositions[i % bluePositions.length]
							)}
							animation-delay: ${(i * 0.75).toFixed(2)}s;
						`}
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
							animation-delay: ${(i * 0.75).toFixed(2)}s;
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
						style={`
							${positionStyle(
								goldPositions[i % goldPositions.length]
							)}
							animation-delay: ${(i * 0.65).toFixed(2)}s;
						`}
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
							animation-delay: ${(i * 0.65).toFixed(2)}s;
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

		<div class="sub">
			Something Cool
		</div>

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

	.event-tag {

		position: absolute;

		top: 0;
		left: 0;

		z-index: 20;

		padding: 0.55cqw 2.2cqw 0.55cqw 1.2cqw;

		border-radius: 0 0.6cqw 0.6cqw 0;
		clip-path: polygon(0 0, 100% 0, calc(100% - 1.1cqw) 100%, 0 100%);

		background: linear-gradient(100deg, #7653b8, #9a73d4);

		color: #fff;

		font-size: 1.7cqw;

		font-family: 'HYWenHei', 'GenshinDefaultJP', 'Segoe UI', Arial, sans-serif;

		line-height: 1.2;

		text-shadow: 0 0.1cqw 0.3cqw rgba(0, 0, 0, 0.35);
	}

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

		font-size: 3.5cqw;

		line-height: 1.12;

		font-weight: 400;

		font-family: 'HYWenHei', 'GenshinDefaultJP', 'Segoe UI', Arial, sans-serif;


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

	.title-main {

		display: block;

		white-space: nowrap;
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

		margin: 0.4cqw 0 0 1cqw;

		padding: 0.35cqw 1cqw;

		width: max-content;

		min-width: 14cqw;

		background: linear-gradient(90deg, var(--plate-dark), rgba(42, 31, 79, 0.85));

		border-bottom: 0.12cqw solid #d9b86a;

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
	   TFT LOOT ORB STYLES (GOLD & PURPLE)
	   ========================================================== */

	.slot.mystery {
		border-radius: 50%;
		isolation: isolate;
	}

	/* TFT Outer Ethereal Energy Halo / Aura Ring */
	.slot.mystery::after {
		content: '';
		position: absolute;
		inset: -14%;
		border-radius: 50%;
		pointer-events: none;
		z-index: 1;
		animation: tftOrbHalo 3.6s ease-in-out infinite;
	}

	.slot.gold.mystery::after {
		border: 0.16cqw solid rgba(255, 230, 110, 0.7);
		box-shadow:
			0 0 1.2cqw rgba(255, 205, 50, 0.75),
			0 0 2.8cqw rgba(245, 158, 11, 0.4),
			inset 0 0 0.8cqw rgba(255, 240, 150, 0.4);
	}

	.slot.blue.mystery::after {
		border: 0.16cqw solid rgba(232, 140, 255, 0.7);
		box-shadow:
			0 0 1.2cqw rgba(216, 100, 255, 0.75),
			0 0 2.8cqw rgba(168, 85, 247, 0.4),
			inset 0 0 0.8cqw rgba(245, 180, 255, 0.4);
	}

	/* TFT Purple Loot Orb (4-Star) */
	.slot.blue.mystery {
		background:
			radial-gradient(circle at 26% 20%, rgba(255, 255, 255, 1) 0%, rgba(250, 232, 255, 0.95) 10%, transparent 18%),
			radial-gradient(circle at 74% 80%, rgba(240, 171, 252, 0.65) 0%, transparent 26%),
			radial-gradient(circle at 68% 72%, rgba(46, 16, 101, 0.88) 0%, transparent 46%),
			radial-gradient(circle at 44% 40%, #fdf4ff 0%, #f0abfc 22%, #c084fc 46%, #7e22ce 74%, #2e1065 100%);
		border: 0.20cqw solid rgba(245, 220, 255, 0.95);
		box-shadow:
			0 0 1.5cqw rgba(216, 120, 255, 0.85),
			0 0 3.5cqw rgba(147, 51, 234, 0.45),
			inset 0 0 1.3cqw rgba(255, 235, 255, 0.5),
			inset 0 -1cqw 1.8cqw rgba(59, 7, 100, 0.65);
		animation: orbFloatBlue 3.6s ease-in-out infinite;
	}

	/* TFT Gold Loot Orb (5-Star) */
	.slot.gold.mystery {
		background:
			radial-gradient(circle at 26% 20%, rgba(255, 255, 255, 1) 0%, rgba(255, 250, 200, 0.95) 10%, transparent 18%),
			radial-gradient(circle at 74% 80%, rgba(254, 240, 138, 0.65) 0%, transparent 26%),
			radial-gradient(circle at 68% 72%, rgba(69, 26, 3, 0.88) 0%, transparent 46%),
			radial-gradient(circle at 44% 40%, #fff7c2 0%, #fde047 22%, #f59e0b 50%, #b45309 76%, #451a03 100%);
		border: 0.22cqw solid rgba(255, 248, 200, 0.95);
		box-shadow:
			0 0 1.6cqw rgba(255, 215, 60, 0.85),
			0 0 3.6cqw rgba(245, 158, 11, 0.45),
			inset 0 0 1.4cqw rgba(255, 255, 220, 0.5),
			inset 0 -1cqw 1.8cqw rgba(92, 45, 0, 0.65);
		animation: orbFloatGold 3.8s ease-in-out infinite;
	}

	/* TFT Crystalline Prismatic Core Texture */
	.slot.mystery .orb-texture {
		position: absolute;
		inset: 2%;
		border-radius: 50%;
		background:
			radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.28) 0%, transparent 55%),
			conic-gradient(from 30deg at 50% 50%,
				rgba(255, 255, 255, 0.24) 0deg,
				transparent 45deg,
				rgba(255, 255, 255, 0.18) 90deg,
				transparent 150deg,
				rgba(255, 255, 255, 0.25) 210deg,
				transparent 270deg,
				rgba(255, 255, 255, 0.18) 330deg,
				rgba(255, 255, 255, 0.24) 360deg
			);
		mix-blend-mode: overlay;
		z-index: 4;
		pointer-events: none;
		animation: tftCoreSpin 16s linear infinite;
	}

	/* TFT Curved Glass Specular Highlight */
	.slot.mystery::before {
		content: '';
		position: absolute;
		top: 6%;
		left: 10%;
		width: 44%;
		height: 28%;
		border-radius: 50%;
		background: radial-gradient(ellipse at 50% 30%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.35) 45%, transparent 75%);
		transform: rotate(-30deg);
		filter: blur(0.08cqw);
		z-index: 5;
		pointer-events: none;
	}

	/* ==========================================================
	   TFT QUESTION MARK GLYPH
	   ========================================================== */

	.orb-question {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		font-family: 'Trebuchet MS', 'Outfit', 'Segoe UI', system-ui, sans-serif;
		font-size: 5.2cqw;
		line-height: 1;
		font-weight: 900;
		color: #ffffff;
		pointer-events: none;
	}

	.slot.gold .orb-question {
		font-size: 6.5cqw;
		text-shadow:
			0 0 0.35cqw #ffffff,
			0 0 1.2cqw #fde047,
			0 0 2.4cqw #f59e0b,
			0 0.18cqw 0.5cqw rgba(45, 18, 0, 0.95);
	}

	.slot.blue .orb-question {
		font-size: 5.2cqw;
		text-shadow:
			0 0 0.35cqw #ffffff,
			0 0 1.2cqw #f0abfc,
			0 0 2.4cqw #c084fc,
			0 0.18cqw 0.5cqw rgba(35, 8, 65, 0.95);
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

	@keyframes tftOrbHalo {
		0% {
			transform: scale(0.95) rotate(0deg);
			opacity: 0.65;
		}
		50% {
			transform: scale(1.08) rotate(180deg);
			opacity: 1;
		}
		100% {
			transform: scale(0.95) rotate(360deg);
			opacity: 0.65;
		}
	}

	@keyframes tftCoreSpin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
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