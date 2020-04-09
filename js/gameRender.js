import { helper, city, villagers, gameManager, switchPage } from "./main.js";

export class GameRender {
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
				content.querySelector(
					".number span.nb"
				).innerHTML = villagers.getAllVillagers("unaffected").length;
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
				}
				break;
		}
	}

	aside() {
		let aside = document.querySelector("aside");
		aside.innerHTML = "";
		let title = document.createElement("h2");
		title.textContent = "Projection";
		aside.appendChild(title);
		if (city.structures.some((x) => x.name === "Inn")) {
			aside.appendChild(
				helper.createButton("up", "Open bar", function () {
					switchPage("inn");
				})
			);
		}
	}
}
