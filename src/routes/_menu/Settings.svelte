<script>
	import { browser } from '$app/environment';
	import { getContext, onMount, setContext } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { locale, t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';

	import { autoskip, isCustomBanner, multipull, wishAmount } from '$lib/store/app-stores';
	import { localConfig } from '$lib/helpers/dataAPI/api-localstore';
	import { calculateByteSize } from '$lib/helpers/dataAPI/api-filesystem';
	import { pauseSfx, playSfx } from '$lib/helpers/audio/audio';
	import { check as meteorCheck } from '$lib/helpers/meteor-loader';
	import { factoryReset } from '$lib/helpers/dataAPI/storage-reset';
	import { pushToast } from '$lib/helpers/toast';

	import Modal from '$lib/components/ModalTpl.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import CheckBox from '$lib/components/CheckBox.svelte';
	import OptionMenu from './_options.svelte';
	import { resetAllBirthdayData } from '$lib/helpers/dataAPI/birthday-reset';


	let showBirthdayReset = false;

const openBirthdayReset = () => {
	showBirthdayReset = true;
	playSfx('modal');
};

const cancelBirthdayReset = () => {
	showBirthdayReset = false;
	playSfx('close');
};

const confirmBirthdayReset = async () => {
	playSfx();
	showBirthdayReset = false;

	await resetAllBirthdayData();

	playSfx('wishBacksound');

	// Reload so every derived component starts from a truly fresh state.
	location.reload();
};

	let optionToShow = '';
	const handleOption = (selected) => (optionToShow = selected);
	setContext('handleOption', handleOption);
	let isMuted = localConfig.get('muted');

	// Handle Muted
	const handleMuted = ({ detail }) => {
		const { selected } = detail;
		isMuted = selected === 'yes';
		if (isMuted) pauseSfx('wishBacksound'); //stop sfx Before set config
		localConfig.set('muted', isMuted);
		if (!isMuted) playSfx('wishBacksound'); // Play SFX after set config
	};

	// AutoSkip
	const readyToPull = getContext('readyToPull');
	const handleAutoSkip = async ({ detail }) => {
		const { selected } = detail;
		const isAutoSkip = selected === 'yes';
		autoskip.set(isAutoSkip);
		localConfig.set('autoskip', isAutoSkip);
		if (isAutoSkip) return readyToPull.set(true);
		const cekExpress = await meteorCheck();
		readyToPull.set(cekExpress);
	};

	// Animated BG
	const handleAnimatedBG = getContext('animateBG');
	let animatedbg = browser ? !!localConfig.get('animatedBG') : false;
	const showAnimatedBG = (e) => {
		const { selected } = e.detail;
		localConfig.set('animatedBG', selected === 'yes');
		animatedbg = selected === 'yes';
		handleAnimatedBG();
	};

	// WishAmount
	let selectedAmount = localConfig.get('wishAmount') || 'default';
	const handleSelectAmount = ({ detail }) => {
		selectedAmount = detail;
		localConfig.set('wishAmount', detail);
		wishAmount.set(detail);
	};

	// Multipull Amount
	const setMultiPull = (value) => {
		localConfig.set('multipull', value);
		multipull.set(value || 1);
	};
	setContext('setMultiPull', setMultiPull);

	// Reset
	let showResetModal = false;
	let keepSetting = false;
	let clearCache = false;

	const getStorageSize = async () => {
		const storageApi = navigator?.storage || {};
		const { usageDetails = {} } = 'estimate' in storageApi ? await storageApi.estimate() : 0;
		const { caches = 0 } = usageDetails;
		const size = calculateByteSize(caches);
		return size;
	};

	const reset = () => {
		showResetModal = true;
		playSfx('modal');
	};
	setContext('factoryReset', reset);

	const confirmReset = async () => {
		playSfx();
		showResetModal = false;
		await factoryReset({ clearCache, keepSetting, isCustom: $isCustomBanner });
		pushToast({ message: $t('menu.resetSuccess'), type: 'success' });
		if (keepSetting) return;

		playSfx('wishBacksound');
		handleAnimatedBG();
		selectedAmount = 'default';
		setMultiPull(10);
	};

	const cancelReset = () => {
		showResetModal = false;
		playSfx('close');
	};

	let optionsContainer;
	onMount(() => {
		OverlayScrollbars(optionsContainer, { sizeAutoCapable: false, className: 'os-theme-light' });
	});
</script>
{#if showBirthdayReset}
	<Modal
		title="Reset Birthday Progress?"
		on:confirm={confirmBirthdayReset}
		on:cancel={cancelBirthdayReset}
	>
		<div class="birthday-reset-modal">
			<div class="reset-heart">♡</div>

			<h3>Start the adventure over?</h3>

			<p>
				This will reset all birthday wishes, currencies, pity, owned items,
				wish history, and mystery-banner reveals.
			</p>

			<p class="warning">
				Nothing can be recovered after this.
			</p>
		</div>
	</Modal>
{/if}

<div in:fade={{ duration: 200 }} class="content-container" bind:this={optionsContainer}>
	<OptionMenu name="locale" activeIndicator={$locale} showOption={optionToShow === 'locale'}>
		{$t('menu.language')}
	</OptionMenu>

	<OptionMenu name="currency" showOption={optionToShow === 'currency'}>
		{$t('menu.currency')}
	</OptionMenu>


	<OptionMenu name="multi" inputValue={$multipull} useInput>{$t('menu.multiRoll')}</OptionMenu>

	<OptionMenu
		showOption={optionToShow === 'audio'}
		name="audio"
		activeIndicator={isMuted}
		on:select={handleMuted}
	>
		{$t('menu.mute')}
	</OptionMenu>

	<OptionMenu
		showOption={optionToShow === 'autoskip'}
		name="autoskip"
		activeIndicator={$autoskip}
		on:select={handleAutoSkip}
	>
		{$t('menu.autoskip')}
	</OptionMenu>

	<OptionMenu
		showOption={optionToShow === 'animatedbg'}
		name="animatedbg"
		activeIndicator={animatedbg}
		on:select={showAnimatedBG}
	>
		{$t('menu.animatedbg')}
	</OptionMenu>

	<OptionMenu name="switchBanner">{$t('menu.switchBanner')}</OptionMenu>

	<button class="reset-all" on:click={openBirthdayReset}>
	<i class="gi-refresh" />
	<span>
		<strong>Reset All Birthday Progress</strong>
		<small>Clear wishes, currencies & history</small>
	</span>
</button>

	<h2>Notes :</h2>
	<div class="notes">
		<ol>
			<li>
				Happy Birthday, bb!
			</li>
			<li>
				Why are you here
			</li>
			<li>
				Dont stay here please i did not have time to fix this
			</li>
		</ol>
	</div>
</div>

<style>
	.confirmation {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.delete-option {
		font-size: 80%;
		margin: 2% 0;
		width: 80%;
	}

	.delete-option :global(.checkbox) {
		margin-top: 3% !important;
	}

	.delete-option :global(label) {
		text-align: left;
		display: flex;
		align-items: center;
	}
	.delete-option :global(small) {
		display: block;
	}

	.delete-option :global(label i) {
		margin-right: 2%;
	}

	.notes {
		font-weight: 100;
		background-color: #fff;
		padding: 1rem 2.5rem 0.5rem;
		font-size: 0.87rem;
		border-radius: 0.3rem;
	}

	ol li {
		margin-bottom: 1rem;
	}

	.reset-all {
	width: 100%;
	margin: 0.75rem 0;
	padding: 0.9rem 1rem;

	display: flex;
	align-items: center;
	gap: 0.8rem;

	border: 1px solid rgba(180, 110, 130, 0.35);
	border-radius: 1rem;

	background:
		linear-gradient(
			135deg,
			rgba(255, 244, 248, 0.92),
			rgba(235, 244, 255, 0.92)
		);

	box-shadow:
		0 8px 24px rgba(0, 0, 0, 0.08),
		inset 0 1px 0 rgba(255, 255, 255, 0.8);

	text-align: left;
	cursor: pointer;

	transition:
		transform 0.18s ease,
		box-shadow 0.18s ease;
}

.reset-all:hover {
	transform: translateY(-2px);

	box-shadow:
		0 12px 28px rgba(0, 0, 0, 0.12),
		inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.reset-all:active {
	transform: scale(0.98);
}

.reset-all i {
	font-size: 1.2rem;
}

.reset-all span {
	display: flex;
	flex-direction: column;
}

.reset-all strong {
	font-size: 0.9rem;
}

.reset-all small {
	margin-top: 0.15rem;
	opacity: 0.65;
	font-size: 0.75rem;
}
</style>
