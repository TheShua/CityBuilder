// Import other classes
import { Helper } from "./helper.js";
import { GameManager } from "./gameManager.js";
import { GameRender } from "./gameRender.js";
import { Villagers } from "./villagers.js";
import { City } from "./city.js";

// DEBUG VARIABLES
let debug = {
	status: "pause", // Start the game in Pause mode "pause", "play"
};
// END DEBUG

// Variable assignation of global objects
export const settings = {
	ratioRefound: 0.7, // rate of selling for buildings
	globalRatio: 1, // Global Ratio for... everything I don't want to specify particularly
	growRate: 2,
	growLuck: 15,
	actualPage: "villagers",
	nbDailyQuest: 3, // Number of daily quest available to show
};
export const helper = new Helper();
export const villagers = new Villagers();
export const city = new City();
export const render = new GameRender();
export const gameManager = new GameManager(debug.status, 500);

const pages = document.querySelectorAll("section");

window.onload = function () {
	// document
	// 	.querySelector("#namingCity + button")
	// 	.addEventListener("click", function() {
	// 		let inputCityName = document.getElementById("namingCity");
	// 		city.setName(inputCityName.value);
	// 		inputCityName.parentNode.parentNode.remove();
	// 	});
	render.page();

	document.querySelector(`#debug [data-action="pause"]`).onclick = (e) => {
		e.target.textContent = gameManager.toggleGame();
	};

	document.querySelectorAll(`[data-type="link"]`).forEach((e) => {
		e.onclick = (l) => {
			let p = l.target.getAttribute("data-page");
			switchPage(p);
			settings.actualPage = p;
		};
	});
};

export function switchPage(page) {
	let section = "";
	pages.forEach((e) => {
		if (e.getAttribute("id") === `page-${page}`) section = e;
		e.style.display = "none";
	});

	if (page === "villagers") render.page("villagers");
	else if (page === "buildings") render.page("buildings");
	else if (page === "inn") render.page("inn");
	section.style.display = "block";
}

export function closeFocus() {
	document.querySelector(".black-screen").remove();
}
