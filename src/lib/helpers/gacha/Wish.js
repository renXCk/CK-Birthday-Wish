import roll from './roll';
import { drawNextBoxItem } from './birthday-box';

// Birthday version: prizes come from the paced 24-item box deck
const WISH = {
	async init() {
		return this;
	},

	drawNextItem(banner) {
		return drawNextBoxItem(banner);
	},

	getItem(rarity, banner) {
		return drawNextBoxItem(banner);
	}
};

export { roll };
export default WISH;

