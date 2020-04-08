import { allCharacters, allEnemies } from "./database.js";

export class Battle {
	constructor(encounter, chars, reward) {
		this.encounter = encounter;
		this.nbChars = chars;
		this.characters = [];
		this.reward = reward;

		this.pickCharacters();
		this.placeCharacters();
		this.placeEnemies();
		this.showUI();
	}

	pickCharacters() {
		while (this.characters.length < this.nbChars) {
			let rand = Math.floor(Math.random() * allCharacters.length);
			if (!this.characters.some((x) => x.name === allCharacters[rand].name))
				this.characters.push(allCharacters[rand]);
		}
	}

	placeCharacters() {
		switch (this.nbChars) {
			case 1:
				this.placeThisEntity({ x: 4, y: 7 }, this.characters[0]);
				break;

			case 2:
				this.placeThisEntity({ x: 3, y: 7 }, this.characters[0]);
				this.placeThisEntity({ x: 5, y: 7 }, this.characters[1]);
				break;

			case 3:
				this.placeThisEntity({ x: 3, y: 8 }, this.characters[0]);
				this.placeThisEntity({ x: 4, y: 6 }, this.characters[1]);
				this.placeThisEntity({ x: 5, y: 8 }, this.characters[2]);
				break;

			case 4:
				console.log("Four o One");
				break;
		}
	}

	placeEnemies() {
		let char = allEnemies.find(
			(x) => x.name.toLocaleLowerCase() === this.encounter[0]
		);
		switch (this.encounter.length) {
			case 1:
				this.placeThisEntity({ x: 4, y: 3 }, char);
				break;
		}
	}

	placeThisEntity(pos, char) {
		let arena = document.querySelector(".arena");
		let tile = arena.querySelector(
			`.tile[data-posx="${pos.x}"][data-posy="${pos.y}"]`
		);
		let charDiv = document.createElement("div");

		charDiv.classList.add("character");
		charDiv.classList.add(char.name.toLocaleLowerCase());

		let body = document.querySelector("body").getBoundingClientRect();
		let position = tile.getBoundingClientRect();
		tile.appendChild(charDiv);
	}

	showUI() {
		this.nbChars;
	}
}
