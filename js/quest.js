import { allNarratives } from "./database.js";

export class Quest {
	constructor() {
		this.story = this.getNarrative();
	}

	getNarrative() {
		return allNarratives[this.getRandom(allNarratives.length)];
	}

	getRandom(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}
}
