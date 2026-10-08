import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
import { owneditem } from '$lib/helpers/dataAPI/api-localstore';
import { ITEMS } from '$lib/data/birthday-config';
import { pushToast } from '$lib/helpers/toast';

/**
 * Checks whether all unique birthday items from ITEMS are owned (unlocked).
 */
export const isAllItemsUnlocked = () => {
	if (!browser) return false;
	const allOwned = owneditem.getAll() || {};
	return ITEMS.every(({ itemID }) => {
		const entry = allOwned[itemID];
		return entry && (entry.manual + entry.wish > 0);
	});
};

export const isInventoryUnlocked = writable(false);

export const checkInventoryUnlock = (notify = false) => {
	const wasUnlocked = get(isInventoryUnlocked);
	const unlocked = isAllItemsUnlocked();
	isInventoryUnlocked.set(unlocked);
	if (notify && !wasUnlocked && unlocked) {
		pushToast({
			message: '🎉 All birthday gifts collected! Inventory is now unlocked! 🎁',
			type: 'success',
			timeout: 5000
		});
	}
	return unlocked;
};
