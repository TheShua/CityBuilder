import { helper, city, closeFocus, gameManager, switchPage } from "./main.js";
import { allBuildings } from "./database.js";

export class GameManager {
	constructor(status = "play", dayDuration, city, villagers) {
		this.dayDuration = dayDuration;
		this.intervalId = 0;
		this.currentDay = 0;
		this.dayCountdown = 0;
		this.status = status;
		this.city = city;
		this.villagers = villagers;
		this.villagers.city = this.city;
		this.renderRessources();

		if (status === "play") this.startGame(this.dayDuration);
	}

	startGame() {
		this.dayCycle();
		this.intervalId = setInterval(() => this.checkForDayCycle(), 10);
	}

	toggleGame() {
		if (this.status === "play") {
			clearInterval(this.intervalId);
			this.status = "pause";
			return "Play";
		} else if (this.status === "pause") {
			this.startGame();
			this.status = "play";
			return "Pause";
		} else {
			throw Error("The game status has an error ! : " + this.status);
		}
	}

	checkForDayCycle() {
		this.dayCountdown++;
		this.renderDayTime();
		if (this.dayCountdown % 10 === 0) this.renderRessources();

		if (this.dayCountdown === this.dayDuration) {
			this.dayCountdown = 0;
			this.dayCycle();
		}
	}

	dayCycle() {
		this.currentDay++;
		this.city.itsANewDay();
		console.log("Nouveau jour ! Nous sommes le " + this.currentDay);
	}

	renderDayTime() {
		let bar = document.getElementById("progression-day");
		let value = (this.dayCountdown / this.dayDuration) * 100;
		let color = "red";
		if (value < 10) color = "#503b68";
		else if (value > 10 && value < 20) color = "#a52d27";
		else if (value > 20 && value < 30) color = "#c96d45";
		else if (value > 30 && value < 40) color = "#d1ca80";
		else if (value > 40 && value < 50) color = "#acdcf1";
		else if (value > 50 && value < 60) color = "#acdcf1";
		else if (value > 60 && value < 70) color = "#d1ca80";
		else if (value > 70 && value < 80) color = "#c96d45";
		else if (value > 80 && value < 90) color = "#a52d27";
		else color = "#503b68";
		bar.style.width = `${value}%`;
		bar.style.background = color;
	}

	renderRessources() {
		helper.showResourcesLists();
		let list = document.querySelector(`li[data-info="villagers"] ul`);
		list.innerHTML = "";
		let li = document.createElement("li");
		li.innerHTML = `Unaffected <span>${
			this.villagers.getAllVillagers("unaffected").length
		}</span>`;
		list.appendChild(li);
		this.city.structures.forEach((e) => {
			li = document.createElement("li");
			li.setAttribute("data-resource", e.job);
			li.innerHTML = `${e.job} <span>${
				this.villagers.getAllVillagers(e.job).length
			}</span>`;
			list.appendChild(li);
		});
	}

	renderPage(page = "villagers") {
		this.renderAside();
		let content;
		switch (page) {
			case "villagers":
				content = document.getElementById("page-villagers");
				let list = content.querySelector(".list");
				list.innerHTML = "";
				content.querySelector(
					".number span.nb"
				).innerHTML = this.villagers.getAllVillagers("unaffected").length;
				this.city.structures.forEach((e) => {
					let div = helper.createRowVillager(
						e.job,
						this.villagers.getAllVillagers(e.job).length
					);
					div.querySelector(".plus").onclick = (event) => {
						this.villagers.affectJob(e.job);
						this.renderPage();
						this.renderRessources();
					};
					div.querySelector(".minus").onclick = (event) => {
						this.villagers.unAffectJob(e.job);
						this.renderPage();
						this.renderRessources();
					};
					list.appendChild(div);
				});
				break;

			case "buildings":
				content = document.querySelector("#page-buildings .content");
				content.innerHTML = "";
				this.city.structures.forEach((e) => {
					if (e.type === "recolt")
						content.appendChild(helper.createBuildingBlock(e));
				});
				this.city.structures.forEach((e) => {
					if (e.type === "misc")
						content.appendChild(helper.createBuildingBlock(e));
				});
				content.appendChild(
					helper.createButton("up", "Build", this.showBuildingMenu)
				);
				break;

			case "inn":
				console.log("HAHAHA");
				break;
		}
	}

	renderAside() {
		let aside = document.querySelector("aside");
		aside.innerHTML = "";
		let title = document.createElement("h2");
		title.textContent = "Projection";
		aside.appendChild(title);
		if (this.city.structures.some((x) => x.name === "Inn")) {
			aside.appendChild(
				helper.createButton("up", "Open bar", function () {
					switchPage("inn");
				})
			);
		}
	}

	showBuildingMenu() {
		let body = document.querySelector("body");
		let focus = helper.focusFrame();
		let editFocus = focus.querySelector(".content");

		editFocus.appendChild(
			helper.createButton("down mini-close", "X", function () {
				closeFocus();
			})
		);
		let buildingsToBuild = allBuildings.filter(
			(e) => !city.structures.find((x) => x.name === e.name)
		);
		buildingsToBuild.forEach((e) => {
			editFocus.appendChild(helper.createNewBuildingBlock(e));
		});
		body.prepend(focus);
	}
}
