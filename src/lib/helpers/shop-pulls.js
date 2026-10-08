import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const MAX_SHOP_PULLS = 24;
export const SHOP_PULLS_KEY = 'BirthdayWish.ShopBoughtPulls.v1';

/**
 * Maps package quantity (crystal pack id) to number of wishes it awards:
 * 60   (2 Kisses)  -> 1 pull
 * 300  (3 Kisses)  -> 2 pulls
 * 980  (4 Kisses)  -> 3 pulls
 * 1980 (5 Kisses)  -> 4 pulls
 * 3280 (7 Kisses)  -> 6 pulls
 * 6480 (10 Kisses) -> 10 pulls (affords exactly 1 10-pull!)
 */
export const PACKAGE_PULLS = {
	60: 1,
	300: 2,
	980: 3,
	1980: 4,
	3280: 6,
	6480: 10
};

export const getPackageCrystals = (pulls) => ({
	base: pulls * 134,
	bonus: pulls * 26
});

export const getBoughtShopPulls = () => {
	if (!browser) return 0;
	const val = localStorage.getItem(SHOP_PULLS_KEY);
	return val ? parseInt(val, 10) : 0;
};

export const setBoughtShopPulls = (n) => {
	if (!browser) return;
	localStorage.setItem(SHOP_PULLS_KEY, n.toString());
};

export const boughtShopPulls = writable(getBoughtShopPulls());

export const addBoughtShopPulls = (amount) => {
	let updated = 0;
	boughtShopPulls.update((curr) => {
		updated = curr + amount;
		setBoughtShopPulls(updated);
		return updated;
	});
	return updated;
};

export const resetBoughtShopPulls = () => {
	if (!browser) return;
	localStorage.removeItem(SHOP_PULLS_KEY);
	boughtShopPulls.set(0);
};
