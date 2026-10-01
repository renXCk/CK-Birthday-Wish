import { ITEMS } from './birthday-config';

// All prizes live in birthday-config.js. This file only adapts them to the format the app expects.
export const data = ITEMS.map(({ itemID, name, rarity, weaponType }) => ({
	itemID,
	name,
	rarity,
	weaponType
}));
export default { data };
