import { ITEMS } from '$lib/data/birthday-config';

const COLORS = { 5: ['#f6d58a', '#b8763a'], 4: ['#d2a8f2', '#6b47a8'], 3: ['#a9c9f0', '#4a72b0'] };

// Simple generated picture used until you set a real `image` for an item
const placeholder = ({ name, rarity }) => {
	const [c1, c2] = COLORS[rarity] || COLORS[3];
	const slot = name.replace('birthday-item-', '#');
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="512" height="512" rx="48" fill="url(#g)"/><text x="256" y="230" font-size="64" text-anchor="middle" fill="#fff" font-family="serif">ITEM ${slot}</text><text x="256" y="300" font-size="44" text-anchor="middle" fill="#fff" font-family="serif">${'★'.repeat(rarity)}</text><text x="256" y="360" font-size="28" text-anchor="middle" fill="#fff" font-family="sans-serif">add image</text></svg>`;
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const birthdayItemImages = () => {
	const list = {};
	ITEMS.forEach((item) => (list[item.name] = item.image || placeholder(item)));
	return list;
};
