/* ==========================================================================
 * BIRTHDAY CONFIG: almost everything you need to edit lives in this file.
 * Search for "TODO(birthday)" to find every spot.
 * ========================================================================== */

// TODO(birthday): her name
export const HER_NAME = 'Ericka';

// TODO(birthday): text shown in the browser tab (also set VITE_APP_TITLE in .env)
export const SITE_TITLE = 'Happy Birthday Ericka!';

// ---- Opening popup ---------------------------------------------------------
export const WELCOME = {
	// TODO(birthday): the BIG text on the opening popup
	heading: 'Surprise!',
	// TODO(birthday): the message under the big text
	message: 'Happy Birthday my bb girl'
};

// ---- Wishing rules ---------------------------------------------------------
// true  = every x10 pull always contains at least one 5-star (so the golden 5-star animation always plays)
// false = normal random rates
export const GUARANTEE_5_STAR_ON_TEN_PULL = true;

// ---- The 2 banners ----------------------------------------------------------
// Banner 1 uses INTERTWINED fates, banner 2 uses ACQUAINT fates.
// Do not change `type`. Everything else is yours to edit.
export const BANNERS = [
	{
		type: 'character-event', // uses Intertwined Fate. Do not change.
		character: 'birthday-event', // internal id, do not change
		bannerName: 'birthday-event', // internal id, do not change
		// TODO(birthday): small label on top of the banner
		tag: 'Event Wish',
		// TODO(birthday): banner title
		title: 'Special Birthday Gift',
		// TODO(birthday): subtitle
		subtitle: 'TODO: banner subtitle',
		// TODO(birthday): description lines (add or remove lines freely)
		description: ['TODO: description line 1', 'TODO: description line 2'],
		// TODO(birthday): big banner picture, e.g. '/banners/event.jpg' (file goes in the /static/banners folder). Best size ~1080x533. Leave '' for a plain gradient.
		image: '',
		// TODO(birthday): small square picture for the banner switch button at the top, e.g. '/banners/event-button.png'
		buttonImage: '',
		// TODO(birthday): item names (from ITEMS below) shown as "featured" and boosted on this banner
		featuredIds: ['birthday-item-01', 'birthday-item-02'],
		// TODO(birthday): % chance that a 5-star / 4-star pull becomes one of the featured items (0 - 100)
		featuredChance: 50,
		// TODO(birthday): optional. List of item names this banner can drop, or null for ALL items
		itemPool: null
	},
	{
		type: 'standard', // uses Acquaint Fate. Do not change.
		character: 'birthday-standard', // internal id, do not change
		bannerName: 'birthday-standard', // internal id, do not change
		// TODO(birthday): small label on top of the banner
		tag: 'Standard Wish',
		// TODO(birthday): banner title
		title: 'Standard Banner',
		// TODO(birthday): subtitle
		subtitle: 'TODO: banner subtitle',
		// TODO(birthday): description lines
		description: ['TODO: description line 1', 'TODO: description line 2'],
		// TODO(birthday): e.g. '/banners/standard.jpg'
		image: '',
		// TODO(birthday): e.g. '/banners/standard-button.png'
		buttonImage: '',
		// TODO(birthday): featured item names
		featuredIds: ['birthday-item-03', 'birthday-item-04', 'birthday-item-05'],
		featuredChance: 50,
		itemPool: null
	}
];

// ---- All prizes (the ONLY items that can drop) -------------------------------
// 30 slots: 5 five-star, 10 four-star, 15 three-star.
// Add more slots by copying a block (use a new unique itemID and name), delete slots you don't need.
// Keep at least 1 item of each rarity (3, 4 and 5 stars) or pulls will fall back to other items.
// `name` is internal, do not rename. Change `label` to rename the prize.
// `weaponType` only controls the layout of the picture on the result screen (try 'sword', 'bow', 'claymore', 'polearm' or 'catalyst').
export const ITEMS = [
	// ---- SLOT 01 · 5-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): e.g. Handmade Glaze Lily Bouquet
	{
		itemID: 990001,
		name: 'birthday-item-01',
		label: 'TODO ★★★★★ Item 01',
		rarity: 5,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 02 · 5-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): e.g. 100 Wishes Jar
	{
		itemID: 990002,
		name: 'birthday-item-02',
		label: 'TODO ★★★★★ Item 02',
		rarity: 5,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 03 · 5-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): e.g. a flower from the Flower Codex (Mondstadt Cecilia)
	{
		itemID: 990003,
		name: 'birthday-item-03',
		label: 'TODO ★★★★★ Item 03',
		rarity: 5,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 04 · 5-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): e.g. a real gift she will get
	{
		itemID: 990004,
		name: 'birthday-item-04',
		label: 'TODO ★★★★★ Item 04',
		rarity: 5,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 05 · 5-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): e.g. a coupon / date / surprise
	{
		itemID: 990005,
		name: 'birthday-item-05',
		label: 'TODO ★★★★★ Item 05',
		rarity: 5,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 06 · 4-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 4-star prize (smaller gift, a flower, a treat...)
	{
		itemID: 990006,
		name: 'birthday-item-06',
		label: 'TODO ★★★★ Item 06',
		rarity: 4,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 07 · 4-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 4-star prize (smaller gift, a flower, a treat...)
	{
		itemID: 990007,
		name: 'birthday-item-07',
		label: 'TODO ★★★★ Item 07',
		rarity: 4,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 08 · 4-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 4-star prize (smaller gift, a flower, a treat...)
	{
		itemID: 990008,
		name: 'birthday-item-08',
		label: 'TODO ★★★★ Item 08',
		rarity: 4,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 09 · 4-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 4-star prize (smaller gift, a flower, a treat...)
	{
		itemID: 990009,
		name: 'birthday-item-09',
		label: 'TODO ★★★★ Item 09',
		rarity: 4,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 10 · 4-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 4-star prize (smaller gift, a flower, a treat...)
	{
		itemID: 990010,
		name: 'birthday-item-10',
		label: 'TODO ★★★★ Item 10',
		rarity: 4,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 11 · 4-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 4-star prize (smaller gift, a flower, a treat...)
	{
		itemID: 990011,
		name: 'birthday-item-11',
		label: 'TODO ★★★★ Item 11',
		rarity: 4,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 12 · 4-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 4-star prize (smaller gift, a flower, a treat...)
	{
		itemID: 990012,
		name: 'birthday-item-12',
		label: 'TODO ★★★★ Item 12',
		rarity: 4,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 13 · 4-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 4-star prize (smaller gift, a flower, a treat...)
	{
		itemID: 990013,
		name: 'birthday-item-13',
		label: 'TODO ★★★★ Item 13',
		rarity: 4,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 14 · 4-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 4-star prize (smaller gift, a flower, a treat...)
	{
		itemID: 990014,
		name: 'birthday-item-14',
		label: 'TODO ★★★★ Item 14',
		rarity: 4,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 15 · 4-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 4-star prize (smaller gift, a flower, a treat...)
	{
		itemID: 990015,
		name: 'birthday-item-15',
		label: 'TODO ★★★★ Item 15',
		rarity: 4,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 16 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990016,
		name: 'birthday-item-16',
		label: 'TODO ★★★ Item 16',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 17 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990017,
		name: 'birthday-item-17',
		label: 'TODO ★★★ Item 17',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 18 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990018,
		name: 'birthday-item-18',
		label: 'TODO ★★★ Item 18',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 19 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990019,
		name: 'birthday-item-19',
		label: 'TODO ★★★ Item 19',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 20 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990020,
		name: 'birthday-item-20',
		label: 'TODO ★★★ Item 20',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 21 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990021,
		name: 'birthday-item-21',
		label: 'TODO ★★★ Item 21',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 22 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990022,
		name: 'birthday-item-22',
		label: 'TODO ★★★ Item 22',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 23 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990023,
		name: 'birthday-item-23',
		label: 'TODO ★★★ Item 23',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 24 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990024,
		name: 'birthday-item-24',
		label: 'TODO ★★★ Item 24',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 25 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990025,
		name: 'birthday-item-25',
		label: 'TODO ★★★ Item 25',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 26 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990026,
		name: 'birthday-item-26',
		label: 'TODO ★★★ Item 26',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 27 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990027,
		name: 'birthday-item-27',
		label: 'TODO ★★★ Item 27',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 28 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990028,
		name: 'birthday-item-28',
		label: 'TODO ★★★ Item 28',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 29 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990029,
		name: 'birthday-item-29',
		label: 'TODO ★★★ Item 29',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	},
	// ---- SLOT 30 · 3-STAR ----
	// TODO(birthday): change `label` (name shown in the wish result) and `image`.
	// TODO(birthday): a 3-star prize (small stuff: sticker, snack, hug coupon...)
	{
		itemID: 990030,
		name: 'birthday-item-30',
		label: 'TODO ★★★ Item 30',
		rarity: 3,
		weaponType: 'catalyst',
		image: '' // TODO(birthday): e.g. '/items/lily.png' (file goes in the /static/items folder)
	}
];
