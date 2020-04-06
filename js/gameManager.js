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

		if (status === "play") this.initGame(this.dayDuration);
	}

	initGame() {
		this.dayCycle();
		this.startGame();
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
		this.city.rawMaterial.forEach((e) => {
			document.querySelector(`li[data-resource="${e.name}"] span`).textContent =
				e.nb;
		});
		this.city.product.forEach((e) => {
			document.querySelector(`li[data-resource="${e.name}"] span`).textContent =
				e.nb;
		});
		let list = document.querySelector(`li[data-info="villagers"] ul`);
		list.innerHTML = "";
		let li = document.createElement("li");
		li.innerHTML = `Unaffected <span>${
			this.villagers.getAllVillagers("unaffected").length
		}</span>`;
		list.appendChild(li);
		this.city.production.forEach((e) => {
			li = document.createElement("li");
			li.setAttribute("data-resource", e.job);
			li.innerHTML = `${e.job} <span>${
				this.villagers.getAllVillagers(e.job).length
			}</span>`;
			list.appendChild(li);
		});
	}
}
