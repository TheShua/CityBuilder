import { helper, city, closeFocus, render, animateCSS } from "./main.js";
import { allBuildings } from "./database.js";
import { Battle } from "./battle.js";

export class GameManager {
	constructor(status = "play", dayDuration) {
		this.dayDuration = dayDuration;
		this.intervalId = 0;
		this.currentDay = 0;
		this.dayCountdown = 0;
		this.status = status;
		this.dailyQuest = 0;
		render.resources();

		if (status === "play") this.startGame(this.dayDuration);
		this.dayCycle();
	}

	startGame() {
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
		render.dayTime();
		if (this.dayCountdown % 10 === 0) render.resources();

		if (this.dayCountdown === this.dayDuration) {
			this.dayCountdown = 0;
			this.dayCycle();
		}
	}

	dayCycle() {
		this.currentDay++;
		render.newDay(this.currentDay);
		city.itsANewDay();
		// console.log("Nouveau jour ! Nous sommes le " + this.currentDay);
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

	createFight(quest, chars, reward) {
		let body = document.querySelector("#wrapper");
		let focus = helper.focusFrame(false, 1);
		let editFocus = focus.querySelector(".content");

		editFocus.appendChild(helper.createBattleMap());
		body.prepend(focus);
		animateCSS(".black-screen", "fadeIn");
		this.toggleGame();
		this.fight = new Battle(quest.story.encounter, chars, reward);
	}
}
