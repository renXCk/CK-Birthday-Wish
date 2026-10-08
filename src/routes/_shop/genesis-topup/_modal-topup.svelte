<script>
	import { getContext } from 'svelte';
	import { cookie } from '$lib/helpers/dataAPI/api-cookie';

	import { genesis, primogem, kisses } from '$lib/store/app-stores';
	import { localBalance } from '$lib/helpers/dataAPI/api-localstore';
	import { playSfx } from '$lib/helpers/audio/audio';

	import Modal from '$lib/components/ModalTpl.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ModalBalance from '../_modal-balance.svelte';

	export let data = {
		qty: 0,
		bonus: 0,
	};

	const closeModal = getContext('closeModal');
	const confirmBuy = getContext('confirmBuy');
	const openObtained = getContext('openObtained');

	// Keep the existing auto-convert option.
	let autoConvert = cookie.get('autoconvert-genesis');

	$: cookie.set('autoconvert-genesis', autoConvert);

	/*
	 * IMPORTANT:
	 *
	 * data.price comes directly from:
	 *
	 * src/lib/data/pricelist.json
	 *
	 * Your current birthday pricing is:
	 *
	 * 60    Genesis  = 2 Kisses
	 * 300   Genesis  = 3 Kisses
	 * 980   Genesis  = 4 Kisses
	 * 1980  Genesis  = 5 Kisses
	 * 3280  Genesis  = 7 Kisses
	 * 6480  Genesis  = 10 Kisses
	 *
	 * Therefore we do NOT hardcode the prices here.
	 */

	 const KISS_PRICES = {
	60: 2,
	300: 3,
	980: 4,
	1980: 5,
	3280: 7,
	6480: 10
};

$: kissCost = KISS_PRICES[data.qty] ?? 0;

$: canPay = $kisses >= kissCost;

	const convertBuy = () => {
		primogem.update((value) => {
			const afterUpdate = value + data.qty + data.bonus;

			localBalance.set('primogem', afterUpdate);

			return afterUpdate;
		});
	};

	const handleBuy = () => {
		// Don't allow the purchase if she doesn't
		// have enough Kisses.
		if (!canPay) {
			playSfx('close');
			return;
		}

		/*
		 * Spend the Kisses first.
		 */
		kisses.update((value) => {
			const afterUpdate = value - kissCost;

			localBalance.set('kisses', afterUpdate);

			return afterUpdate;
		});

		const item = autoConvert ? 'primogem' : 'genesis';

		/*
		 * Tell the shop that the purchase succeeded.
		 */
		confirmBuy({
			qty: data.qty,
			bonus: data.bonus
		});

		/*
		 * Show the obtained currency popup.
		 */
		openObtained([
			{
				qty: data.qty + data.bonus,
				item
			}
		]);

		/*
		 * Automatically convert Genesis Crystals
		 * into Primogems when the checkbox is enabled.
		 */
		if (autoConvert) {
			convertBuy();
			return;
		}

		/*
		 * Otherwise add Genesis Crystals normally.
		 */
		genesis.update((value) => {
			const afterUpdate = value + data.qty + data.bonus;

			localBalance.set('genesis', afterUpdate);

			return afterUpdate;
		});
	};

	const close = () => {
		playSfx('close');
		closeModal();
	};
</script>

<ModalBalance itemToBuy="genesis" />

<Modal blank on:cancel={close}>
	<div class="birthday-payment-modal">

		<!-- HEADER -->
		<div class="hero">

			<div class="sparkle">
				✦
			</div>

			<div class="hero-copy">

				<span class="eyebrow">
					SPECIAL BIRTHDAY EXCHANGE
				</span>

				<h1>
					Send Some Birthday Love
				</h1>

				<p>
					Exchange a few kisses for Genesis Crystals
					and make another wish. ♡
				</p>

			</div>

			<button
				class="close-button"
				on:click={close}
				aria-label="Close"
			>
				<i class="gi-close" />
			</button>

		</div>


		<!-- PRODUCT -->
		<div class="product-card">

			<div class="product-art">

				<div class="glow-ring"></div>

				<Icon
					type="genesis"
					width="48%"
				/>

			</div>

			<div class="product-info">

				<span class="mini-label">
					YOU'RE RECEIVING
				</span>

				<strong>
					Genesis Crystals ×{data.qty + data.bonus}
				</strong>

				<span class="product-subtitle">
					Ready to become wishes ✦
				</span>

			</div>

		</div>


		<!-- PAYMENT -->
		<div class="payment-box">

			<div class="payment-heading">

				<span class="mini-label">
					PAYMENT
				</span>

				<h2>
					Pay with Kisses 💋
				</h2>

				<p>
					A special birthday currency that can only
					be earned through affection.
				</p>

			</div>


			<!-- PRICE -->
			<div class="kiss-price">

				<div class="kiss-symbol">
					💋
				</div>

				<div class="price-copy">

					<span class="price-label">
						THIS PACK COSTS
					</span>

					<strong>
						{kissCost} Kisses
					</strong>

				</div>

			</div>


			<!-- CURRENT BALANCE -->
			<div
				class:insufficient={!canPay}
				class="balance-row"
			>

				<span>
					Your Kisses
				</span>

				<strong>
					💋 {$kisses}
				</strong>

			</div>


			<!-- STATUS -->
			{#if !canPay}

				<div class="not-enough">

					<span>💔</span>

					You need
					<strong>
						{kissCost - $kisses}
					</strong>

					more kiss{kissCost - $kisses === 1 ? '' : 'es'}
					before you can buy this pack. ♡

				</div>

			{:else}

				<div class="enough">

					<span>♡</span>

					You have enough kisses for this wish!

					<span>✦</span>

				</div>

			{/if}

		</div>


		<!-- AUTO CONVERT -->
		<div class="auto-convert">

			<input
				id="convert"
				type="checkbox"
				bind:checked={autoConvert}
				on:change={() => playSfx('click2')}
			/>

			<label for="convert">
				Convert the Genesis Crystals into Primogems automatically
			</label>

		</div>


		<!-- PAYMENT BUTTON -->
		<button
			class="proceed"
			class:disabled={!canPay}
			disabled={!canPay}
			on:click={handleBuy}
		>

			{#if canPay}

				<span>
					Send {kissCost}
					Kiss{kissCost === 1 ? '' : 'es'} 💋
				</span>

				<i class="gi-angle-right" />

			{:else}

				<span>
					Not Enough Kisses 💔
				</span>

			{/if}

		</button>

	</div>
</Modal>


<style>
	.birthday-payment-modal {
		width: min(100%, 42rem);
		padding: 1.35rem;

		color: #302638;

		background:
			radial-gradient(
				circle at 10% 0%,
				rgba(255, 214, 231, 0.65),
				transparent 35%
			),
			radial-gradient(
				circle at 90% 15%,
				rgba(207, 229, 255, 0.6),
				transparent 35%
			),
			rgba(255, 255, 255, 0.78);

		backdrop-filter: blur(24px);

		border: 1px solid rgba(255, 255, 255, 0.8);

		border-radius: 1.5rem;

		box-shadow:
			0 2rem 5rem rgba(38, 21, 54, 0.18),
			inset 0 1px 0 rgba(255, 255, 255, 0.95);
	}


	/* -------------------------------------------------- */
	/* HEADER */
	/* -------------------------------------------------- */

	.hero {
		display: flex;
		align-items: flex-start;

		gap: 0.75rem;
	}

	.sparkle {
		padding-top: 0.1rem;

		font-size: 1.8rem;

		animation:
			float 2.4s ease-in-out infinite;
	}

	.hero-copy {
		flex: 1;
	}

	.eyebrow,
	.mini-label,
	.price-label {
		display: block;

		font-size: 0.66rem;

		font-weight: 800;

		letter-spacing: 0.12em;

		opacity: 0.55;
	}

	h1 {
		margin: 0.25rem 0 0;

		font-size:
			clamp(1.4rem, 3vw, 2rem);

		line-height: 1.05;
	}

	.hero p {
		margin: 0.55rem 0 0;

		line-height: 1.45;

		opacity: 0.7;
	}

	.close-button {
		margin-left: auto;

		padding: 0.35rem;

		background: transparent;

		border: none;

		opacity: 0.55;

		cursor: pointer;

		transition:
			transform 0.15s ease,
			opacity 0.15s ease;
	}

	.close-button:hover {
		opacity: 1;

		transform: rotate(5deg);
	}


	/* -------------------------------------------------- */
	/* PRODUCT */
	/* -------------------------------------------------- */

	.product-card {
		display: flex;

		align-items: center;

		gap: 1rem;

		margin-top: 1.1rem;

		padding: 0.9rem;

		border-radius: 1.15rem;

		border: 1px solid
			rgba(255, 255, 255, 0.8);

		background:
			rgba(255, 255, 255, 0.45);

		box-shadow:
			0 0.8rem 2rem
				rgba(49, 28, 72, 0.07),

			inset 0 1px 0
				rgba(255, 255, 255, 0.8);
	}

	.product-art {
		position: relative;

		width: 5.5rem;

		aspect-ratio: 1;

		display: flex;

		align-items: center;

		justify-content: center;

		flex-shrink: 0;
	}

	.glow-ring {
		position: absolute;

		inset: 5%;

		border-radius: 50%;

		background:
			radial-gradient(
				circle,
				rgba(245, 214, 133, 0.55),
				transparent 68%
			);

		animation:
			pulseGlow 2.3s
			ease-in-out infinite;
	}

	.product-info {
		display: flex;

		flex-direction: column;

		gap: 0.22rem;
	}

	.product-info strong {
		font-size: 1.15rem;
	}

	.product-subtitle {
		font-size: 0.78rem;

		opacity: 0.6;
	}


	/* -------------------------------------------------- */
	/* PAYMENT */
	/* -------------------------------------------------- */

	.payment-box {
		margin-top: 1rem;

		padding: 1rem;

		border-radius: 1.15rem;

		background:
			rgba(255, 255, 255, 0.5);

		border: 1px solid
			rgba(255, 255, 255, 0.75);
	}

	.payment-heading h2 {
		margin: 0.25rem 0 0;

		font-size: 1.05rem;
	}

	.payment-heading p {
		margin: 0.3rem 0 0;

		font-size: 0.8rem;

		line-height: 1.4;

		opacity: 0.62;
	}


	/* -------------------------------------------------- */
	/* KISS PRICE */
	/* -------------------------------------------------- */

	.kiss-price {
		display: flex;

		align-items: center;

		gap: 0.8rem;

		margin-top: 1rem;

		padding: 0.8rem;

		border-radius: 1rem;

		background:
			rgba(255, 236, 245, 0.8);

		border: 1px solid
			rgba(255, 255, 255, 0.65);
	}

	.kiss-symbol {
		width: 2.7rem;

		height: 2.7rem;

		display: flex;

		align-items: center;

		justify-content: center;

		border-radius: 50%;

		background:
			rgba(255, 255, 255, 0.8);

		font-size: 1.35rem;

		box-shadow:
			0 0.4rem 1rem
				rgba(163, 91, 125, 0.12);

		animation:
			kissPulse 2s
			ease-in-out infinite;
	}

	.price-copy {
		display: flex;

		flex-direction: column;

		gap: 0.1rem;
	}

	.price-copy strong {
		font-size: 1.25rem;
	}


	/* -------------------------------------------------- */
	/* BALANCE */
	/* -------------------------------------------------- */

	.balance-row {
		display: flex;

		align-items: center;

		justify-content: space-between;

		margin-top: 0.8rem;

		padding-top: 0.75rem;

		border-top: 1px solid
			rgba(86, 60, 94, 0.08);

		font-size: 0.82rem;

		transition: color 0.2s ease;
	}

	.balance-row strong {
		font-size: 0.9rem;
	}

	.balance-row.insufficient {
		color: #ae4961;
	}


	/* -------------------------------------------------- */
	/* STATUS */
	/* -------------------------------------------------- */

	.not-enough,
	.enough {
		display: flex;

		align-items: center;

		gap: 0.35rem;

		margin-top: 0.7rem;

		padding: 0.65rem 0.75rem;

		border-radius: 0.75rem;

		font-size: 0.76rem;

		line-height: 1.35;
	}

	.not-enough {
		background:
			rgba(255, 231, 236, 0.9);

		color: #ae4961;
	}

	.enough {
		justify-content: center;

		background:
			rgba(232, 247, 237, 0.9);

		color: #4f785e;
	}

	.not-enough strong {
		margin: 0 0.15rem;
	}


	/* -------------------------------------------------- */
	/* AUTO CONVERT */
	/* -------------------------------------------------- */

	.auto-convert {
		display: flex;

		align-items: flex-start;

		gap: 0.5rem;

		margin-top: 0.8rem;

		font-size: 0.75rem;

		line-height: 1.4;

		opacity: 0.72;
	}

	.auto-convert input {
		width: 1rem;

		height: 1rem;

		flex-shrink: 0;

		margin-top: 0.1rem;

		accent-color: #9a6a91;
	}

	.auto-convert label {
		cursor: pointer;
	}


	/* -------------------------------------------------- */
	/* BUY BUTTON */
	/* -------------------------------------------------- */

	.proceed {
		width: 100%;

		margin-top: 1rem;

		padding: 0.9rem 1rem;

		display: flex;

		align-items: center;

		justify-content: center;

		gap: 0.5rem;

		border: 0;

		border-radius: 999px;

		background:
			linear-gradient(
				90deg,
				#6d587f,
				#b46d92
			);

		color: white;

		font-size: 0.92rem;

		font-weight: 800;

		box-shadow:
			0 0.8rem 1.5rem
				rgba(99, 64, 101, 0.2);

		cursor: pointer;

		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease,
			opacity 0.18s ease;
	}

	.proceed:hover:not(.disabled) {
		transform: translateY(-2px);

		box-shadow:
			0 1rem 1.8rem
				rgba(99, 64, 101, 0.28);
	}

	.proceed:active:not(.disabled) {
		transform: scale(0.98);
	}

	.proceed.disabled {
		opacity: 0.42;

		cursor: not-allowed;
	}


	/* -------------------------------------------------- */
	/* ANIMATIONS */
	/* -------------------------------------------------- */

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-4px);
		}
	}

	@keyframes pulseGlow {
		0%,
		100% {
			transform: scale(0.92);

			opacity: 0.7;
		}

		50% {
			transform: scale(1.05);

			opacity: 1;
		}
	}

	@keyframes kissPulse {
		0%,
		100% {
			transform: scale(1);
		}

		50% {
			transform: scale(1.06);
		}
	}


	/* -------------------------------------------------- */
	/* MOBILE */
	/* -------------------------------------------------- */

	@media (max-width: 700px) {
		.birthday-payment-modal {
			padding: 1rem;
		}

		.product-card {
			padding: 0.75rem;
		}

		.product-art {
			width: 4.75rem;
		}

		.auto-convert {
			align-items: flex-start;
		}
	}
</style>