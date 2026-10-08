import { browser } from '$app/environment';
import { initialAmount } from '$lib/data/wish-setup.json';
import { resetBoxState } from '$lib/helpers/gacha/birthday-box';
import { resetBoughtShopPulls } from '$lib/helpers/shop-pulls';
import { checkInventoryUnlock } from '$lib/helpers/inventory-lock';
import { localBalance, localConfig } from './api-localstore';

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

	// Separate birthday-only reveal state and box deck state.
	localStorage.removeItem(BANNER_REVEAL_KEY);
	resetBoxState();
	resetBoughtShopPulls();

	// IndexedDB: history + cached assets + custom banner records.
	await clearAllIndexedDB();

	// Restore in-memory stores immediately.
	genesis.set(initialAmount.genesis ?? 0);
	primogem.set(initialAmount.primogem ?? 0);

	acquaint.set(0);
	intertwined.set(0);

	localBalance.set('intertwined', 0);
	localBalance.set('acquaint', 0);
	localBalance.set('primogem', 0);
	localBalance.set('genesis', 0);
	localConfig.set('birthday_box_v4', true);
	checkInventoryUnlock();

	stardust.set(0);
	starglitter.set(0);
	kisses.set(0);

	activeBanner.set(0);
	wishAmount.set('default');
	multipull.set(10);
	autoskip.set(false);

	document.dispatchEvent(new Event('storageUpdate'));
}