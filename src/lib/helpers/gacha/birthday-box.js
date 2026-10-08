import { browser } from '$app/environment';
import { ITEMS } from '$lib/data/birthday-config';
import { revealBirthdayItem } from '../birthday-banner-state';

export const BOX_POOL_STORAGE_KEY = 'BirthdayWish.BoxPool.v3';

export const BOX_ITEM_COUNTS = {
	// 5-Star (5 items, 1 each = 5)
	'birthday-5star-01': 1,
	'birthday-5star-02': 1,
	'birthday-5star-03': 1,
	'birthday-5star-04': 1,
	'birthday-5star-05': 1,

	// 4-Star (9 items total)
	'birthday-4star-glaze-lily': 2,
	'birthday-4star-cecilia': 2,
	'birthday-4star-windwheel-aster': 2,
	'birthday-4star-qingxin': 1,
	'birthday-4star-sweet-flower': 1,
	'birthday-4star-windrest-flower': 1,

	// 3-Star (10 items total)
	'birthday-3star-purple-flower': 5,
	'birthday-3star-pink-flower': 5
};

// Fisher-Yates shuffle
function shuffle(array) {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

/**
 * Generate the 24-pull deck:
 * - Block 1 & 2 (Pulls 1-20, two 10-pulls): 3x 5★ shared (one gets 2x 5★, one gets 1x 5★) + 8x 4★ + 9x 3★
 * - Block 3 (Pulls 21-24, last 4 single pulls): 2x 5★ (with Roadtrip Ticket: Tagaytay strictly as the 24th/last pull) + 1x 4★ + 1x 3★
 */
export function generateBoxDeck() {
	// Roadtrip Ticket: Tagaytay is reserved specifically for the final pull (#24)
	const tagaytay = 'birthday-5star-03';

	// The other 4 5-stars shuffled
	const otherFiveStars = shuffle([
		'birthday-5star-01',
		'birthday-5star-02',
		'birthday-5star-04',
		'birthday-5star-05'
	]);

	// 4-Stars: 9 items expanded by count
	const fourStarList = [];
	Object.entries(BOX_ITEM_COUNTS).forEach(([name, count]) => {
		const it = ITEMS.find((i) => i.name === name);
		if (it && it.rarity === 4) {
			for (let c = 0; c < count; c++) fourStarList.push(name);
		}
	});
	const fourStars = shuffle(fourStarList);

	// 3-Stars: 10 items expanded by count
	const threeStarList = [];
	Object.entries(BOX_ITEM_COUNTS).forEach(([name, count]) => {
		const it = ITEMS.find((i) => i.name === name);
		if (it && it.rarity === 3) {
			for (let c = 0; c < count; c++) threeStarList.push(name);
		}
	});
	const threeStars = shuffle(threeStarList);

	// Block 1 & Block 2 share 3 5-stars (one gets 2, one gets 1, both guaranteed 5-star)
	const b1HasTwo = Math.random() < 0.5;
	const b1Fives = b1HasTwo ? [otherFiveStars[0], otherFiveStars[1]] : [otherFiveStars[0]];
	const b2Fives = b1HasTwo ? [otherFiveStars[2]] : [otherFiveStars[1], otherFiveStars[2]];

	const b1Threes = b1HasTwo ? threeStars.slice(0, 4) : threeStars.slice(0, 5);
	const b2Threes = b1HasTwo ? threeStars.slice(4, 9) : threeStars.slice(5, 9);

	// Block 1 (10 pulls): either (2 5★, 4 4★, 4 3★) or (1 5★, 4 4★, 5 3★)
	const block1 = shuffle([...b1Fives, ...fourStars.slice(0, 4), ...b1Threes]);

	// Block 2 (10 pulls): either (1 5★, 4 4★, 5 3★) or (2 5★, 4 4★, 4 3★)
	const block2 = shuffle([...b2Fives, ...fourStars.slice(4, 8), ...b2Threes]);

	// Block 3 (4 single pulls): exactly two 5-stars, with Tagaytay as the 24th pull!
	// Slots 0, 1, 2: 1 5★, 1 4★, 1 3★ shuffled
	const block3FirstThree = shuffle([
		otherFiveStars[3],
		fourStars[8],
		threeStars[9]
	]);
	const block3 = [...block3FirstThree, tagaytay];

	return [...block1, ...block2, ...block3];
}

export function getBoxState() {
	if (!browser) {
		return { deck: generateBoxDeck(), currentIndex: 0 };
	}
	try {
		const raw = localStorage.getItem(BOX_POOL_STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed.deck) && typeof parsed.currentIndex === 'number') {
				return parsed;
			}
		}
	} catch (e) {
		console.warn('Failed to parse box pool state:', e);
	}
	const state = { deck: generateBoxDeck(), currentIndex: 0 };
	saveBoxState(state);
	return state;
}

export function saveBoxState(state) {
	if (!browser) return;
	try {
		localStorage.setItem(BOX_POOL_STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.warn('Failed to save box pool state:', e);
	}
}

export function resetBoxState() {
	if (!browser) return;
	localStorage.removeItem(BOX_POOL_STORAGE_KEY);
}

/**
 * Draws the next item from the box deck.
 * Advances currentIndex in localStorage.
 * Returns the full item object.
 */
export function drawNextBoxItem(banner = 'birthday-event') {
	const state = getBoxState();
	let chosenName;

	if (state.currentIndex < state.deck.length) {
		chosenName = state.deck[state.currentIndex];
		state.currentIndex++;
		saveBoxState(state);
	} else {
		// Fallback if pulls exceed 24 (e.g. testing)
		const fallbackPool = ITEMS;
		chosenName = fallbackPool[Math.floor(Math.random() * fallbackPool.length)].name;
	}

	const chosen = ITEMS.find((it) => it.name === chosenName) || ITEMS[0];

	// Reveal on banner card
	revealBirthdayItem(banner, chosen.name);

	const date = new Date();
	const time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

	return {
		time,
		banner,
		type: 'weapon',
		name: chosen.name,
		label: chosen.label,
		description: chosen.description,
		image: chosen.image,
		itemID: chosen.itemID,
		rarity: chosen.rarity,
		weaponType: chosen.weaponType,
		bannerName: 'birthday-event'
	};
}
