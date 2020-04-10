import {
	settings,
	helper,
	city,
	villagers,
	gameManager,
	switchPage,
	render,
	closeFocus,
	animateCSS,
} from "./main.js";

export class GameRender {
	chooseTitleVillage() {
		let div = helper.focusFrame();
		let content = div.querySelector(".content");
		content.innerHTML = `<p>What is the name of your city ?</p>
		<input type="text" name="cityname" id="namingCity" />`;
		content.appendChild(
			helper.createCliquable("button", "up", "OK", () => {
				render.enterVillageName();
				gameManager.toggleGame();
			})
		);
		document.querySelector("body").prepend(div);
	}

	enterVillageName() {
		let inputCityName = document.getElementById("namingCity").value;
		city.setName(inputCityName);
		document.querySelector("h1").textContent = inputCityName;
		document.querySelector("title").textContent =
			inputCityName + settings.titleSuffix;
		closeFocus();
	}

	dayTime() {
		let bar = document.getElementById("progression-day");
		let value = (gameManager.dayCountdown / gameManager.dayDuration) * 100;
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

	resources() {
		helper.showResourcesLists();
		let list = document.querySelector(`li[data-info="villagers"] ul`);
		list.innerHTML = "";
		let li = document.createElement("li");
		li.innerHTML = `Unaffected <span>${
			villagers.getAllVillagers("unaffected").length
		}</span>`;
		list.appendChild(li);
		city.structures.forEach((e) => {
			if (e.type === "misc") return;
			li = document.createElement("li");
			li.setAttribute("data-resource", e.job);
			li.innerHTML = `${e.job} <span>${
				villagers.getAllVillagers(e.job).length
			}</span>`;
			list.appendChild(li);
		});
	}

	page(page = "villagers") {
		this.aside();
		let content;
		switch (page) {
			case "villagers":
				content = document.getElementById("page-villagers");
				let list = content.querySelector(".list");
				list.innerHTML = "";
				let nbUV = villagers.getAllVillagers("unaffected").length;
				content.querySelector(".number span.nb").innerHTML = nbUV;
				content.querySelector(".number .desc").innerHTML =
					nbUV <= 1 ? "unaffected villager" : "unaffected villagers";
				city.structures.forEach((e) => {
					if (e.type === "misc") return;
					let div = helper.createRowVillager(
						e.job,
						villagers.getAllVillagers(e.job).length
					);
					div.querySelector(".plus").onclick = (event) => {
						villagers.affectJob(e.job);
						this.page();
						this.resources();
					};
					div.querySelector(".minus").onclick = (event) => {
						villagers.unAffectJob(e.job);
						this.page();
						this.resources();
					};
					list.appendChild(div);
				});
				break;

			case "buildings":
				content = document.querySelector("#page-buildings .content");
				content.innerHTML = "";
				city.structures.forEach((e) => {
					if (e.type === "recolt")
						content.appendChild(helper.createBuildingBlock(e));
				});
				city.structures.forEach((e) => {
					if (e.type === "misc")
						content.appendChild(helper.createBuildingBlock(e));
				});
				content.appendChild(
					helper.createButton("up", "Build", gameManager.showBuildingMenu)
				);
				break;

			case "inn":
				content = document.querySelector("#page-inn .content");
				content.innerHTML = "";
				if (gameManager.dailyQuest === 0) {
					city.dailyQuest.forEach((q) => {
						content.appendChild(helper.createQuestBoard(q));
					});
				} else {
					let alerte = `<p>You already picked your quest for today. Now maybe it's the time to watch over your hamlet.</p>`;
					content.appendChild(
						helper.showMainMessage("No more for today !", alerte)
					);
				}
				break;
		}
	}

	aside() {
		let aside = document.querySelector("aside");
		aside.innerHTML = "";
		let title = document.createElement("h2");
		title.textContent = "Projection";
		let ul = document.createElement("ul");

		aside.appendChild(title);
		city.structures.forEach((e) => {
			if (!e.hasOwnProperty("resourceGain")) return;
			e.resourceGain.forEach((r) => {
				let amount =
					e.prodPerPerson[e.level] * villagers.getAllVillagers(e.job).length;
				let li = document.createElement("li");
				li.innerHTML = `<img src="./assets/img/resources/${r}.png" alt="${r} icon"> ${r} : ${amount}`;
				ul.appendChild(li);
			});
		});
		aside.appendChild(ul);
	}

	newDay(currentDay) {
		let dayDiv = document.querySelector("nav > div");
		dayDiv.textContent = `Day ${currentDay}`;
		animateCSS("nav > div", "wobble", () => {
			//
		});
	}

	addMainMenuLink(name, page) {
		let list = document.querySelector("nav ul:nth-child(3)");
		let li = document.createElement("li");
		li.setAttribute("data-type", "link");
		li.setAttribute("data-page", page);
		li.textContent = name;
		li.onclick = () => {
			switchPage(page);
			settings.actualPage = page;
		};
		list.appendChild(li);
	}

	showDamages(target, damages) {
		let div = document.createElement("div");
		div.className = "show-damages";
		div.textContent = damages;
		let targetDiv = document.querySelector(`.${target.className}`);
		animateCSS(`.${target.className}`, "shake", function () {
			targetDiv.classList.remove("shake");
		});
		targetDiv.appendChild(div);
		let targetSelector = `.${target.className} .show-damages`;
		animateCSS(targetSelector, "jackInTheBox", function () {
			animateCSS(targetSelector, "bounceOut", function () {
				div.remove();
			});
		});
	}

	messageBox(message, timer) {
		let div = document.createElement("div");
		div.className = "message-box";
		div.innerHTML = message;
		document.querySelector("body").prepend(div);
		animateCSS(".message-box", "zoomInDown", () => {
			document.querySelector(".message-box").classList.remove("bounceInUp");
		});
		setTimeout(() => {
			animateCSS(".message-box", "zoomOutUp", () => {
				div.remove();
			});
		}, timer);
	}
}
