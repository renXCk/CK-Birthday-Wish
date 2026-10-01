import { beginner } from '$lib/data/banners/beginner.json';
import { standard } from '$lib/data/banners/standard.json';
import { version, wishPhase } from '$lib/data/wish-setup.json';
import { BANNERS } from '$lib/data/birthday-config';

import { imageCDN } from './assets';
import { BannerManager } from './dataAPI/api-indexeddb';
import { localConfig, rollCounter } from './dataAPI/api-localstore';
import {
	activeBanner,
	activeVersion,
	bannerList,
	customData,
	editorMode,
	isCustomBanner,
	isFatepointSystem,
	preloadVersion,
	showBeginner
} from '$lib/store/app-stores';

const idb = BannerManager;

const useCustomBanner = async (bannerID) => {
	try {
		const data = await idb.get(bannerID);
		if (!data) return preloadVersion.set({ patch: version, phase: wishPhase });

		const {
			bannerName = '',
			character = '',
			rateup = [],
			images = {},
			hostedImages = {},
			vision = 'pyro',
			charTitle = '',
			artPosition = {},
			watermark = '',
			status = null
		} = data;

		const dataIMG = status === 'owned' ? images : imageCDN(hostedImages);
		customData.set({ ...data, name: character, images: dataIMG });
		bannerList.set([
			{
				type: 'character-event',
				bannerName,
				character,
				rateup,
				images: dataIMG,
				vision,
				charTitle,
				artPosition,
				watermark
			}
		]);

		activeVersion.set({ patch: 'Custom', phase: bannerID });
		activeBanner.set(0);
		editorMode.set(false);
		isCustomBanner.set(true);
		localConfig.set('version', `Custom-${bannerID}`);
		return { status: 'ok' };
	} catch (e) {
		console.error(e);
		return { status: 'error' };
	}
};

const checkBeginnerBanner = () => {
	const starterRollCount = rollCounter.get('beginner');
	const isShowBeginner = starterRollCount < 20;
	showBeginner.set(isShowBeginner);
	return isShowBeginner;
};

export const initializeBanner = async () => {
	// Birthday version: the 2 banners come from src/lib/data/birthday-config.js
	try {
		const list = BANNERS.map((banner) => ({ ...banner, birthday: true }));
		bannerList.set(list);
		isFatepointSystem.set(false);

		activeVersion.set({ patch: version, phase: wishPhase });
		activeBanner.set(0);
		localConfig.set('version', `${version}-${wishPhase}`);

		customData.set({});
		isCustomBanner.set(false);
		return { status: 'ok' };
	} catch (e) {
		console.error(e);
		return { status: 'error', e };
	}
};

// No beginner banner in the birthday version
export const handleShowStarter = () => {};
