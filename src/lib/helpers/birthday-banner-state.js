import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'BirthdayWish.BannerReveal.v1';

const loadState = () => {
	if (!browser) return {};

	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
	} catch {
		return {};
	}
};

export const birthdayReveals = writable(loadState());

export const revealBirthdayItem = (bannerType, itemName) => {
	if (!browser || !bannerType || !itemName) return;

	birthdayReveals.update((state) => {
		const current = state[bannerType] || [];

		if (current.includes(itemName)) {
			return state;
		}

		const next = {
			...state,
			[bannerType]: [...current, itemName]
		};

		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

		return next;
	});
};

export const resetBirthdayReveals = () => {
	if (!browser) return;

	localStorage.removeItem(STORAGE_KEY);
	birthdayReveals.set({});
};