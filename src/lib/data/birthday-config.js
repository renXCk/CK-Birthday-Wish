/* ==========================================================================
 * BIRTHDAY CONFIG
 * ========================================================================== */

export const HER_NAME = 'Ericka';

export const SITE_TITLE = `Happy Birthday, ${HER_NAME}!`;

export const WELCOME = {
	heading: 'A Special Wish Awaits You',
	message:
		'Happy Birthday! Every wish here was prepared with love, just for you. May this little journey through Teyvat lead you to a few surprises.'
};

export const GUARANTEE_5_STAR_ON_TEN_PULL = true;

/* --------------------------------------------------------------------------
 * BANNERS
 * -------------------------------------------------------------------------- */

export const BANNERS = [
	{
		type: 'character-event',
		character: 'birthday-event',
		bannerName: 'birthday-event',

		tag: 'Birthday Event Wish',
		title: `A Wish Written Just for ${HER_NAME}`,
		subtitle: 'May every little wish lead to something wonderful.',

		description: [
			'Limited-time birthday wishes containing flowers, letters, adventures, and love.',
			'★ Featured 5★: Bloom of Everlasting Devotion'
		],

		image: '/banners/birthday-event.jpg',
		buttonImage: '/banners/birthday-event-button.png',

		// 1 gold mystery slot + 3 blue mystery slots
		featuredIds: [
			'birthday-5star-01',
			'birthday-4star-glaze-lily',
			'birthday-4star-qingxin',
			'birthday-4star-silk-flower'
		],

		featuredChance: 100,
		itemPool: null,

		mysteryArt: {
			fiveStar: '/items/mystery-gold-orb.png',
			fourStar: '/items/mystery-blue-orb.png'
		}
	},

	{
		type: 'standard',
		character: 'birthday-standard',
		bannerName: 'birthday-standard',

		tag: 'Birthday Standard Wish',
		title: 'Treasures Along the Journey',
		subtitle: 'A few more surprises hidden among the flowers.',

		description: [
			'More birthday treasures, keepsakes, and Teyvat blooms.',
			'Every pull is another little memory waiting to be found.'
		],

		image: '/banners/birthday-standard.jpg',
		buttonImage: '/banners/birthday-standard-button.png',

		featuredIds: [
			'birthday-5star-05',
			'birthday-4star-cecilia',
			'birthday-4star-sumeru-rose',
			'birthday-4star-lumidouce-bell'
		],

		featuredChance: 100,
		itemPool: null,

		mysteryArt: {
			fiveStar: '/items/mystery-gold-orb.png',
			fourStar: '/items/mystery-blue-orb.png'
		}
	}
];

/* --------------------------------------------------------------------------
 * ITEMS
 * -------------------------------------------------------------------------- */

export const ITEMS = [
	/* ============================== 5 STAR ============================== */

	{
		itemID: 990001,
		name: 'birthday-5star-01',
		label: 'Scroll of the Heart\'s Oath',
		description:
			'A sealed scroll containing a love letter written especially for you. Open it when you want a little reminder of how deeply you are loved.',
		rarity: 5,
		weaponType: 'catalyst',
		image: '/items/scroll.png'
		// Add later:
		// image: '/items/scroll-of-the-hearts-oath.png'
	},

	{
		itemID: 990002,
		name: 'birthday-5star-02',
		label: 'Jar of Tiny Certainties',
		description:
			'A tiny jar filled with handwritten confirmations, reminders, and little reasons why you are wonderful. One tiny certainty at a time.',
		rarity: 5,
		weaponType: 'catalyst',
		image: '/items/lovejar.png'
		// image: '/items/jar-of-tiny-certainties.png'
	},

	{
		itemID: 990003,
		name: 'birthday-5star-03',
		label: 'Invitation: Roadtrip to Tagaytay',
		description:
			'An invitation for a real-life road trip to Tagaytay — complete with food, scenery, music, and passenger-princess privileges.',
		rarity: 5,
		weaponType: 'catalyst',
		image: '/items/ticket.png'
		// image: '/items/tagaytay-excursion.png'
	},

	{
		itemID: 990004,
		name: 'birthday-5star-04',
		label: 'Bloom of Everlasting Devotion',
		description:
			'A real bouquet prepared for you in the spirit of a Teyvat flower garden — with cool Glaze Lily tones, elegant white blooms, crimson Silk Flowers, and sunny little fillers.',
		rarity: 5,
		weaponType: 'catalyst',
		image: '/items/bouquet.png'
		// image: '/items/everlasting-bouquet.png'
	},

	{
		itemID: 990005,
		name: 'birthday-5star-05',
		label: 'Celestial Commission: A Day of Your Choosing',
		description:
			'A special commission redeemable for one day, date, or adventure of your choosing. You decide what quest we take on next.',
		rarity: 5,
		weaponType: 'catalyst',
		image: '/items/coupon.png'
		// image: '/items/day-of-your-choosing.png'
	},

	/* ============================== 4 STAR ============================== */

	{
		itemID: 990006,
		name: 'birthday-4star-glaze-lily',
		label: 'Glaze Lily',
		description:
			'An extremely ancient flower, said to have once been a common sight in Liyue. It transforms the memories of the land into its fragrance during fluorescence.',
		rarity: 4,
		weaponType: 'catalyst',
		image: '/items/glaze-lily.webp'
		// image: '/items/glaze-lily.png'
	},

	{
		itemID: 990007,
		name: 'birthday-4star-qingxin',
		label: 'Qingxin',
		description:
			'A mountain flower of pure white petals and a golden center — delicate, elegant, and quietly radiant.',
		rarity: 4,
		weaponType: 'catalyst',
		image: '/items/qingxin.webp'
		// image: '/items/qingxin.png'
	},

	{
		itemID: 990008,
		name: 'birthday-4star-silk-flower',
		label: 'Silk Flower',
		description:
			'A rich crimson-red bloom with a warm golden center, adding a dramatic splash of color to the arrangement.',
		rarity: 4,
		weaponType: 'catalyst',
		image: ''
		// image: '/items/silk-flower.png'
	},

	{
		itemID: 990009,
		name: 'birthday-4star-cecilia',
		label: 'Cecilia',
		description:
			'A delicate Mondstadt flower with pointed white petals, like a tiny constellation blooming in the wind.',
		rarity: 4,
		weaponType: 'catalyst',
		image: '/items/cecilia.webp'
		// image: '/items/cecilia.png'
	},

	{
		itemID: 990010,
		name: 'birthday-4star-windwheel-aster',
		label: 'Windwheel Aster',
		description:
			'Windwheel Asters are a Local Specialty found in the wild in various areas of Mondstadt.',
		rarity: 4,
		weaponType: 'catalyst',
		image: '/items/windwheel-aster.webp'
		// image: '/items/sumeru-rose.png'
	},

	{
		itemID: 990011,
		name: 'birthday-4star-windrest-flower',
		label: 'Windrest Flower',
		description:
			'An exquisite flower that remains delicate and fresh, found primarily in the northern part of Mondstadt. Its fragrance is clear and enduring, making it one of the primary ingredients used in perfumery.',
		rarity: 4,
		weaponType: 'catalyst',
		image: '/items/windrest-flower.webp'
		// image: '/items/lumidouce-bell.png'
	},

	{
		itemID: 990012,
		name: 'birthday-4star-padisarah',
		label: 'Padisarah',
		description:
			'A graceful bloom from Sumeru, chosen as an extra touch of soft color for the birthday bouquet.',
		rarity: 4,
		weaponType: 'catalyst',
		image: ''
		// image: '/items/padisarah.png'
	},

	
	{
		itemID: 990013,
		name: 'birthday-4star-sweet-flower',
		label: 'Sweet Flower',
		description:
			'Particularly fragrant flowers. They can be easily located, even in the dark, thanks to their sweet scent. Commonly used in Teyvat to make sugar.',
		rarity: 4,
		weaponType: 'catalyst',
		image: '/items/sweet-flower.webp'
		// image: '/items/sweet-flower.png'
	},

	/* ============================== 3 STAR ============================== */


	{
		itemID: 990014,
		name: 'birthday-3star-purple-flower',
		label: 'Purple Flower',
		description:
			'Normal Ass Purple Flower',
		rarity: 3,
		weaponType: 'catalyst',
		image: 'items/purple-flower.png'
	},

	{
		itemID: 990015,
		name: 'birthday-3star-pink-flower',
		label: 'Pink Flower',
		description:
			'Normal Ass Pink Flower',
		rarity: 3,
		weaponType: 'catalyst',
		image: 'items/pink-flower.png'
	},


];