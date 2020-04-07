import { allNarratives } from "./database.js";

export class Quest {
	constructor() {
		story = getNarrative();
	}

	getNarrative() {
		return allNarratives[getRandom(allNarratives.length)];
	}

	getRandom(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}
}
