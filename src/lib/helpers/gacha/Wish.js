import { BANNERS, ITEMS } from '$lib/data/birthday-config';
import roll from './roll';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Birthday version: prizes come only from src/lib/data/birthday-config.js
const WISH = {
	async init() {
		return this;
	},

	getItem(rarity, banner) {
		const date = new Date();
		const time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
		const cfg = BANNERS.find(({ type }) => type === banner) || {};

		let pool = ITEMS.filter((item) => item.rarity === rarity);
		if (cfg.itemPool) pool = pool.filter(({ name }) => cfg.itemPool.includes(name));
		if (pool.length === 0) pool = ITEMS; // safety net if a rarity has no items

		const featured = pool.filter(({ name }) => (cfg.featuredIds || []).includes(name));
		const useFeatured = featured.length > 0 && Math.random() * 100 < (cfg.featuredChance ?? 50);
		const chosen = pick(useFeatured ? featured : pool);

		return {
			time,
			banner,
			type: 'weapon',
			name: chosen.name,
			itemID: chosen.itemID,
			rarity: chosen.rarity,
			weaponType: chosen.weaponType,
			bannerName: cfg.bannerName
		};
	}
};

export { roll };
export default WISH;
