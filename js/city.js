import { settings, render, gameManager, villagers } from "./main.js";
import { allBuildings, allResources } from "./database.js";
import { Quest } from "./quest.js";

export class City {
	constructor() {
		this.name = "My City";

		this.resources = []; // Materials
		this.structures = []; // Buildings

		this.initResources();
		this.attractiveRate = 0;
		this.productivity = 0;
		this.dailyResourcesNeeded = ["nourishment"];

		this.getStarterPack();
	}

	itsANewDay() {
		this.gainProfitForTheDay();
		this.payCostForTheDay();
		this.cityGrowth();
		if (this.structures.some((x) => x.name === "Inn")) this.newDailyQuest();
		render.page(settings.actualPage);
	}

	initResources() {
		let baseResources = allResources.filter((e) => e.type.includes("base"));
		baseResources.forEach((e) => this.resources.push(e));
	}

	createResource(building) {
		let resources = building.resourceGain;
		resources.forEach((e) => {
			if (!this.resources.find((x) => x.name === e)) {
				let resource = allResources.find((x) => x.name === e);
				this.resources.push(resource);
			}
		});
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = name;
	}

	getStarterPack() {
		this.addResource([
			{ name: "wood", nb: 100 },
			{ name: "meat", nb: 50 },
		]);
		this.addVillager(5);
		allBuildings.forEach((e) => {
			if (e.level > 0) this.structures.push(e);
		});
	}

	newDailyQuest() {
		this.dailyQuest = [];
		gameManager.dailyQuest = 0;
		for (let i = 0; i < settings.nbDailyQuest; i++) {
			let quest = new Quest();
			// How to check until... (while do ?)
			this.dailyQuest.push(quest);
		}
	}

	addResource(array) {
		array.forEach((e) => {
			this.resources.find((m) => m.name === e.name).nb += e.nb;
		});
	}

	loseResource(array) {
		array.forEach((x) => {
			let rsc = this.resources.find((y) => x.name === y.name);
			rsc.nb -= x.nb;
		});
	}

	addVillager(nb) {
		for (let i = 0; i < nb; i++) {
			villagers.createVillager();
		}
	}

	deleteVillager(nb) {
		for (let i = 0; i < nb; i++) {
			villagers.leaveTown();
		}
	}

	cityGrowth() {
		this.calculateAttractiveRate();
		if (this.attractiveRate >= 1) {
			for (let i = 0; i < Math.floor(this.attractiveRate); i++) {
				let rand = Math.floor(Math.random() * 100);
				if (rand < settings.growLuck) this.addVillager();
			}
		} else if (
			this.attractiveRate <= 1 &&
			villagers.getAllVillagers().length + this.attractiveRate > 5
		) {
			this.deleteVillager(this.attractiveRate);
		}
	}

	calculateAttractiveRate() {
		let total =
			(this.productivity - villagers.getAllVillagers().length) *
			settings.globalRatio;
		if (total > 0)
			this.attractiveRate = settings.globalRatio * settings.growRate;
		else this.attractiveRate = -(settings.globalRatio * settings.growRate);
	}

	gainProfitForTheDay() {
		let productivity = 0;
		this.structures.forEach((e) => {
			if (!e.hasOwnProperty("resourceGain")) return;
			e.resourceGain.forEach((r) => {
				let amount =
					e.prodPerPerson[e.level] * villagers.getAllVillagers(e.job).length;
				this.addResource([{ name: r, nb: amount }]);
				let dbRsc = allResources.find((x) => x.name === r);
				if (dbRsc.hasOwnProperty("nutritValue")) {
					productivity += amount * dbRsc.nutritValue;
				}
			});
		});
		this.productivity = productivity;
	}

	payCostForTheDay() {
		// if (gameManager.currentDay === 1) return;
		let allVillagers = villagers.getAllVillagers().length;
		let total = this.foodForTheDay();
		let toSustain = allVillagers;
		if (total > allVillagers) {
			let listResources = this.resources.filter((x) =>
				x.hasOwnProperty("nutritValue")
			);
			listResources.sort((a, b) => {
				return b.nutritValue - a.nutritValue;
			});

			listResources.forEach((r) => {
				let nbIteration = Math.floor(toSustain / r.nutritValue);
				if (nbIteration <= r.nb) {
					for (let i = 0; i < nbIteration; i++) {
						toSustain -= r.nutritValue;
						r.nb--;
						if (toSustain === 0) break;
					}
				}
			});
		}
	}

	foodForTheDay() {
		let listResources = this.resources.filter((x) => {
			return x.type.some((y) => this.dailyResourcesNeeded.indexOf(y) >= 0);
		});
		let total = listResources.reduce((acc, val) => {
			return acc + val.nb * val.nutritValue;
		}, 0);
		return total;
	}

	upgradeBuilding(building) {
		let build = this.structures.find((x) => x.name === building);
		if (build.level >= build.maxLevel) return;

		if (!this.canBuy(building)) {
			return;
		} else {
			this.loseResource(this.calculatePrice(build));
			build.level++;
			render.page("buildings");
			render.resources();
		}
	}

	downgradeBuilding(building) {
		let build = this.structures.find((b) => b.name === building);
		let index = this.structures.indexOf(build);

		if (build.level === 0) return;
		if (build.level > 0) {
			let rsc = this.calculatePrice(build, settings.ratioRefound);
			this.addResource(rsc);
			build.level--;
			if (build.level === 0) {
				this.structures.splice([index], 1);
			}
		}
		render.page("buildings");
		render.resources();
	}

	calculatePrice(building, factor = 1) {
		let price = [];
		building.price.forEach((x) => {
			let buildingLevel = 0;
			let trueRatio = 1;
			if (this.structures.includes(building)) {
				buildingLevel = this.structures.find((b) => b.name === building.name)
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
				price.push({ name: x.resource, nb: x.base * factor });
			}
		});
		return price;
	}

	canBuy(building, isNewBuilding) {
		let build = "";
		if (isNewBuilding) build = building;
		else build = this.structures.find((b) => b.name === building);

		let totalPrice = this.calculatePrice(build);
		let r = [];
		totalPrice.forEach((x) => {
			let rsc = this.resources.find((y) => x.name === y.name);
			r.push(rsc.nb > x.nb);
		});
		return r.includes(false) ? false : true;
	}

	createBuilding(building) {
		let build = allBuildings.find((b) => b.name === building);

		if (this.structures.includes(build)) return;
		if (this.canBuy(build, true)) {
			this.loseResource(this.calculatePrice(build));
			this.structures.push(build);
			this.structures.find((x) => x.name === building).level = 1;
			if (building.hasOwnProperty("resourceGain")) this.createResource(build);
			if (build.name === "Inn") this.newDailyQuest();
			render.page("buildings");
			render.resources();
			return true;
		} else {
			return false;
		}
	}
}
