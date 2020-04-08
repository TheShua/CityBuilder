import { city } from "./main.js";
import { Villager } from "./villager.js";
import { allBuildings } from "./database.js";

export class Villagers {
	constructor() {
		this.allVillagers = [];
	}

	createVillager() {
		const villager = new Villager();
		this.allVillagers.push(villager);
		console.log("A new villager join the town");
	}

	leaveTown() {
		this.allVillagers.pop();
	}

	getAllVillagers(job = null) {
		switch (job) {
			case null:
				return this.allVillagers;

			case "unaffected":
				return this.allVillagers.filter((x) => x.job === "");

			default:
				return this.allVillagers.filter((x) => x.job === job);
		}
	}

	affectJob(job) {
		if (job === undefined)
			throw Error("You must add a job for affectation here !");

		if (!this.getAllVillagers("unaffected").length) return;

		let actualBuild = city.structures.find((x) => x.job === job);
		if (
			this.getAllVillagers(job).length ===
			actualBuild.maxVillagers[actualBuild.level]
		)
			return;
		// throw Error(
		// 	"Can not affect someone to a job if there's no-one unaffected"
		// );

		this.allVillagers.filter((x) => x.job === "")[0].job = job;
	}

	unAffectJob(job) {
		if (job === undefined)
			throw Error("You must add a job for unaffectation here !");

		if (!this.getAllVillagers(job).length) return;
		// throw Error(
		// 	"Can not unaffect someone from a job if there's no-one affected"
		// );

		this.allVillagers.filter((x) => x.job === job)[0].job = "";
	}
}
