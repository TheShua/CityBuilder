import { settings, gameManager, villagers } from "./main.js";
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
		this.attractionRate = 0;
		this.dailyResourcesNeeded = ["food"];

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
			this.rawMaterial.find((m) => m.name === e.name).nb += e.nb;
		});
	}

	loseResource(array) {
		array.forEach((x) => {
			let rsc = this.rawMaterial.find((y) => x.name === y.name);
			rsc.nb -= x.nb;
		});
	}

	addVillager(nb) {
		for (let i = 0; i < nb; i++) {
			villagers.createVillager();
		}
	}

	itsANewDay() {
		this.profitForTheDay();
		this.costForTheDay();
	}

	profitForTheDay() {
		this.production.forEach((e) => {
			e.resourceGain.forEach((r) => {
				let amount =
					e.prodPerPerson[e.level] * villagers.getAllVillagers(e.job).length;
				this.addResource([{ name: r, nb: amount, raw: 1 }]);
			});
		});
	}

	costForTheDay() {
		this.dailyResourcesNeeded.forEach((e) => {
			if (
				e === "food" &&
				this.product.find((x) => x.name === "food") <
					villagers.getAllVillagers()
			) {
				console.log("ouah les pauvres");
			} else {
				console.log("bon ap'!");
			}
		});
	}

	gotEnoughFood() {
		let allVillagers = villagers.getAllVillagers();
	}

	upgradeBuilding(building) {
		let build = this.production.find((x) => x.name === building);
		if (build.level >= build.maxLevel) return;

		if (!this.canBuy(building)) {
			return;
		} else {
			this.loseResource(this.calculatePrice(build));
			build.level++;
			gameManager.renderPage("buildings");
			gameManager.renderRessources();
		}
	}

	downgradeBuilding(building) {
		let build = this.production.find((b) => b.name === building);
		let index = this.production.indexOf(build);

		if (build.level === 0) return;
		if (build.level > 0) {
			let rsc = this.calculatePrice(build, settings.ratioRefound);
			this.addResource(rsc);
			build.level--;
			if (build.level === 0) {
				this.production.splice([index], 1);
			}
		}
		gameManager.renderPage("buildings");
		gameManager.renderRessources();
	}

	calculatePrice(building, factor = 1) {
		let price = [];
		building.price.forEach((x) => {
			let buildingLevel = 0;
			let trueRatio = 1;
			if (this.production.includes(building)) {
				buildingLevel = this.production.find((b) => b.name === building.name)
					.level;
				trueRatio = x.ratio;
			} else {
				buildingLevel = 1;
			}

			if (buildingLevel > 1 && x.fromLv <= buildingLevel) {
				let number = 0;
				if (factor === 1)
					number = Math.floor(trueRatio * buildingLevel * x.base);
				else {
					number = Math.floor(
						trueRatio * (buildingLevel - 1) * x.base * factor
					);
				}
				price.push({ name: x.resource, nb: number });
			} else if (x.fromLv > building.level) {
				return;
			} else if (buildingLevel === 1) {
				let number = 0;
				if (factor === 1) number = Math.floor(x.base * trueRatio);
				else number = Math.floor(x.base * factor);
				price.push({ name: x.resource, nb: number });
			} else {
				console.log("meh");
				price.push({ name: x.resource, nb: x.base * factor });
			}
		});
		return price;
	}

	canBuy(building, isNewBuilding) {
		let build = "";
		if (isNewBuilding) build = building;
		else build = this.production.find((b) => b.name === building);

		let totalPrice = this.calculatePrice(build);
		let r = [];
		totalPrice.forEach((x) => {
			let rsc = this.rawMaterial.find((y) => x.name === y.name);
			r.push(rsc.nb > x.nb);
		});
		return r.includes(false) ? false : true;
	}

	createBuilding(building) {
		let build = allBuildings.find((b) => b.name === building);
		if (this.production.includes(build)) return;
		if (this.canBuy(build, true)) {
			this.loseResource(this.calculatePrice(build));
			this.production.push(build);
			this.production.find((x) => x.name === building).level = 1;
			gameManager.renderPage("buildings");
			gameManager.renderRessources();
			return true;
		} else {
			return false;
		}
	}
}
