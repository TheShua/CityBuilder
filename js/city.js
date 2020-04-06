import { villagers } from "./main.js";
import { allBuildings } from "./database.js";

export class City {
	constructor() {
		console.log("City loaded");
		this.name = "My City";

		// Raw Materials
		this.rawMaterial = [
			{ name: "wood", nb: 0 },
			{ name: "meat", nb: 0 },
			{ name: "wheat", nb: 0 },
			{ name: "hide", nb: 0 },
			{ name: "wool", nb: 0 },
			{ name: "stone", nb: 0 },
			{ name: "ore", nb: 0 },
		];
		// Final Products
		this.product = [
			{ name: "gold", nb: 0 },
			{ name: "plank", nb: 0 },
			{ name: "food", nb: 0 },
			{ name: "flour", nb: 0 },
			{ name: "bread", nb: 0 },
			{ name: "stonebrick", nb: 0 },
			{ name: "gem", nb: 0 },
		];

		this.production = [];

		this.getStarterPack();
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = name;
		console.log(`The name of the city just changed for : ${this.name}`);
	}

	getStarterPack() {
		this.addResource([
			{ name: "wood", nb: 100, raw: 1 },
			{ name: "meat", nb: 50, raw: 1 },
		]);
		this.addVillager(5);
		allBuildings.forEach((e) => {
			if (e.level > 0) this.production.push(e);
		});
	}

	addResource(array) {
		array.forEach((e) => {
			if (e.raw === 1)
				this.rawMaterial.find((m) => m.name === e.name).nb += e.nb;
		});
	}

	addVillager(nb) {
		for (let i = 0; i < nb; i++) {
			villagers.createVillager();
		}
	}

	itsANewDay() {
		this.production.forEach((e) => {
			e.resourceGain.forEach((r) => {
				let amount =
					e.prodPerPerson[e.level] * villagers.getAllVillagers(e.job).length;
				this.addResource([{ name: r, nb: amount, raw: 1 }]);
			});
		});
	}
}
