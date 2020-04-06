// Import other classes
import { Helper } from "./helper.js";
import { GameManager } from "./gameManager.js";
import { Villager } from "./villager.js";
import { Villagers } from "./villagers.js";
import { City } from "./city.js";

// DEBUG VARIABLES
let debug = {
	status: "pause", // Start the game in Pause mode "pause", "play"
};
// END DEBUG

// Variable assignation of global objects
const helper = new Helper();
export const villagers = new Villagers();
const city = new City();
const gameManager = new GameManager(debug.status, 500, city, villagers);

const pages = document.querySelectorAll("section");

window.onload = function () {
	// document
	// 	.querySelector("#namingCity + button")
	// 	.addEventListener("click", function() {
	// 		let inputCityName = document.getElementById("namingCity");
	// 		city.setName(inputCityName.value);
	// 		inputCityName.parentNode.parentNode.remove();
	// 	});
	renderPage();

	document.querySelector(`#debug [data-action="pause"]`).onclick = (e) => {
		e.target.textContent = gameManager.toggleGame();
	};

	document.querySelectorAll(`[data-type="link"]`).forEach((e) => {
		e.onclick = (l) => {
			switchPage(l.target.getAttribute("data-page"));
		};
	});
};

function switchPage(page) {
	let section = "";
	pages.forEach((e) => {
		if (e.getAttribute("id") === `page-${page}`) section = e;
		e.style.display = "none";
	});

	if (page === "villagers") showPageVillagers();
	else if (page === "buildings") showPageBuildings();
	section.style.display = "block";
}

function showPageVillagers() {
	renderPage("villagers");
}

function showPageBuildings() {
	renderPage("buildings");
}

function renderPage(page = "villagers") {
	let content;
	switch (page) {
		case "villagers":
			content = document.getElementById("page-villagers");
			let list = content.querySelector(".list");
			list.innerHTML = "";
			content.querySelector(
				".number span.nb"
			).innerHTML = villagers.getAllVillagers("unaffected").length;
			city.production.forEach((e) => {
				let div = helper.createRowVillager(
					e.job,
					villagers.getAllVillagers(e.job).length
				);
				div.querySelector(".plus").onclick = (event) => {
					villagers.affectJob(e.job);
					renderPage();
					gameManager.renderRessources();
				};
				div.querySelector(".minus").onclick = (event) => {
					villagers.unAffectJob(e.job);
					renderPage();
					gameManager.renderRessources();
				};
				list.appendChild(div);
			});
			break;

		case "buildings":
			content = document.querySelector("#page-buildings .content");
			content.innerHTML = "";
			city.production.forEach((e) => {
				content.appendChild(helper.createBuilding(e));
			});
			break;
	}
}
