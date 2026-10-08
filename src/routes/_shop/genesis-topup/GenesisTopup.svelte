<script>
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';

	import { assets, pricelist } from '$lib/store/app-stores';
	import { playSfx } from '$lib/helpers/audio/audio';
	import {
		PACKAGE_PULLS,
		getPackageCrystals,
		MAX_SHOP_PULLS,
		boughtShopPulls
	} from '$lib/helpers/shop-pulls';

	import Icon from '$lib/components/Icon.svelte';
	import ShopGroup from '../_shop-group.svelte';
	import ShopGroupItem from '../_shop-group-item.svelte';
	import ModalTopup from './_modal-topup.svelte';

	const genesisList = [];
	const genesis = $pricelist.genesis;
	Object.keys(genesis).forEach((key) => {
		const qty = parseInt(key);
		const pulls = PACKAGE_PULLS[qty] || 1;
		const item = { qty, pulls, price: genesis[key] };
		genesisList.push(item);
	});

	$: remainingPulls = Math.max(0, MAX_SHOP_PULLS - $boughtShopPulls);

	let data = {};
	let showPaymentModal = false;
	const selectGenesis = ({ qty, pulls, price }) => {
		if (pulls > remainingPulls) {
			playSfx('close');
			return;
		}
		playSfx('exchange');
		showPaymentModal = true;
		data = { qty, pulls, ...getPackageCrystals(pulls), price };
	};

	const closePaymentModal = () => {
		playSfx('close');
		showPaymentModal = false;
	};
	setContext('closeModal', closePaymentModal);

	const confirmBuy = () => {
		showPaymentModal = false;
		playSfx();
	};
	setContext('confirmBuy', confirmBuy);
</script>

{#if showPaymentModal}
	<ModalTopup {data} />
{/if}

<div class="wish-cap-banner" in:fade={{ duration: 300 }}>
	{#if remainingPulls === 0}
		<div class="cap-title">Happy Birthday!</div>
	{:else}
		<div class="cap-info">
			<span class="cap-title">
				<Icon type="intertwined" width="20px" style="vertical-align: middle; margin-right: 6px; display: inline-block;" />
				Birthday Wishes Claimed: <strong>{$boughtShopPulls} / {MAX_SHOP_PULLS}</strong>
			</span>
			<span class="cap-status">
				{remainingPulls} wish{remainingPulls === 1 ? '' : 'es'} remaining to claim
			</span>
		</div>
		<div class="cap-track">
			<div class="cap-fill" style="width: {Math.min(100, ($boughtShopPulls / MAX_SHOP_PULLS) * 100)}%" />
		</div>
	{/if}
</div>

<ShopGroup>
	{#each genesisList as { qty, price, pulls }, i}
		{@const isOverCap = pulls > remainingPulls}
		{@const crystals = getPackageCrystals(pulls)}
		<ShopGroupItem>
			<button
				class:over-cap={isOverCap}
				disabled={isOverCap}
				on:click={() => selectGenesis({ qty, pulls, price })}
				in:fade={{ duration: 300, delay: Math.sqrt(i * 5000) }}
			>
				{#if isOverCap}
					<div class="cap-badge">
						<span>Cap Exceeded</span>
					</div>
				{/if}

				<div class="topup-bonus bonus pull-tag">
					<div class="wrap">
						<Icon type="genesis" width="15px" style="vertical-align: middle; margin-right: 4px;" />
						<span>Bonus {crystals.bonus}</span>
					</div>
				</div>

				<div class="content" style="background-image: url({$assets['genesis-bg.webp']})">
					<div class="picture">
						<picture>
							<img src={$assets[`genesis-${qty}.webp`]} alt="Genesis Crystal {qty}" />
						</picture>
					</div>
					<div class="caption">
						<div class="name">
							<Icon type="genesis" width="16px" />
							{crystals.base} Genesis Crystals
						</div>
						<div class="price">{price}</div>
					</div>
				</div>
			</button>
		</ShopGroupItem>
	{/each}
</ShopGroup>

<style>
	.wish-cap-banner {
		margin: 0.5rem 1.5rem 1rem;
		padding: 0.8rem 1.25rem;
		background: rgba(30, 24, 40, 0.7);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 214, 231, 0.3);
		border-radius: 1rem;
		color: #f7e7f0;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
	}

	.cap-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.95rem;
	}

	.cap-title strong {
		color: #ffb8d1;
		font-size: 1.1em;
	}

	.cap-status {
		font-size: 0.85rem;
		color: #ebd3e0;
		opacity: 0.9;
	}

	.cap-track {
		margin-top: 0.6rem;
		height: 8px;
		background: rgba(255, 255, 255, 0.12);
		border-radius: 999px;
		overflow: hidden;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.cap-fill {
		height: 100%;
		background: linear-gradient(90deg, #b46d92, #f5a3bf, #ffd180);
		border-radius: 999px;
		transition: width 0.4s ease;
	}

	button {
		transition: all 0.2s;
		transform: scale(1);
		width: 100%;
		height: 100%;
		display: block;
		position: relative;
	}
	button:not(.nav-link-item):active:not(.over-cap) {
		transform: scale(0.95);
	}

	button.over-cap {
		cursor: not-allowed;
		filter: grayscale(0.85) opacity(0.5);
		transform: none !important;
	}

	button.over-cap:hover {
		filter: grayscale(0.85) opacity(0.5);
	}

	button.over-cap .content:hover {
		filter: none !important;
	}

	.cap-badge {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(-10deg);
		background: rgba(45, 15, 28, 0.94);
		color: #ff859d;
		border: 1.5px solid #ff859d;
		padding: 0.35rem 0.9rem;
		border-radius: 999px;
		font-weight: 800;
		font-size: 0.82rem;
		white-space: nowrap;
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
		z-index: 5;
		letter-spacing: 0.04em;
		pointer-events: none;
	}

	.pull-tag {
		background: linear-gradient(135deg, #d44d7d, #9c4176) !important;
	}

	.bonus {
		color: #fff6d2;
		text-shadow: 0.05em 0.05em 0.2em rgba(0, 0, 0, 0.5);
		font-size: 80%;
		filter: drop-shadow(0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.5));
		position: absolute;
		z-index: +1;
	}

	.wrap {
		width: 100%;
		position: relative;
		display: flex;
	}

	.topup-bonus {
		top: 0;
		left: -3%;
		padding: 0.15rem 1rem 0.15rem 0.7rem;
		border-bottom-left-radius: 1rem;
		border-top-left-radius: 1rem;
		border-bottom-right-radius: 2rem;
	}
	:global(.mobile) .topup-bonus {
		padding: 0 10% 0 8%;
	}
	.topup-bonus .wrap {
		align-items: center;
	}

	.content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		text-align: center;
		background-size: cover;
		background-position: center center;
		transition: all 0.2s;
		position: relative;
	}

	.content:hover {
		filter: drop-shadow(-0.3rem 0.2rem #eac343) drop-shadow(0.3rem 0.2rem #eac343)
			drop-shadow(-0rem -0.3rem #eac343);
	}

	picture {
		display: block;
		margin-top: -10%;
	}
	.picture {
		display: block;
		width: 100%;
		height: 70%;
		overflow-y: hidden;
		margin-top: 5%;
	}

	img {
		width: 90%;
	}

	.caption {
		position: absolute;
		bottom: 5%;
		display: block;
		width: 95%;
	}

	.name {
		width: 100%;
		padding: 15% 4.5% 2%;
		display: block;
		font-size: calc(8 / 100 * var(--column-width));
		background-image: linear-gradient(to top, rgba(241, 239, 222, 1) 55%, rgba(241, 239, 222, 0));
	}

	.price {
		display: block;
		height: calc(16 / 100 * var(--column-width));
		line-height: calc(16 / 100 * var(--column-width));
		font-size: calc(9 / 100 * var(--column-width));
	}
</style>
