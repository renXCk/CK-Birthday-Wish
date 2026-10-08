    import { browser } from '$app/environment';
import { initialAmount } from '$lib/data/wish-setup.json';

import {
	genesis,
	primogem,
	acquaint,
	intertwined,
	stardust,
	starglitter,
	kisses,
	activeBanner,
	wishAmount,
	multipull,
	autoskip
} from '$lib/store/app-stores';

import { clearAllIndexedDB } from './api-indexeddb';

const BANNER_REVEAL_KEY = 'BirthdayWish.BannerReveal.v1';

export async function resetAllBirthdayData() {
	if (!browser) return;

	// Local storage: currencies, pity, roll counters, owned items,
	// configuration, etc.
	localStorage.removeItem('WishSimulator.App');

	// Separate birthday-only reveal state.
	localStorage.removeItem(BANNER_REVEAL_KEY);

	// IndexedDB: history + cached assets + custom banner records.
	await clearAllIndexedDB();

	// Restore in-memory stores immediately.
	genesis.set(initialAmount.genesis ?? 0);
	primogem.set(initialAmount.primogem ?? 0);

	acquaint.set(initialAmount.fates ?? 0);
	intertwined.set(initialAmount.fates ?? 0);

	stardust.set(0);
	starglitter.set(0);
	kisses.set(0);

	activeBanner.set(0);
	wishAmount.set('default');
	multipull.set(10);
	autoskip.set(false);

	document.dispatchEvent(new Event('storageUpdate'));
}