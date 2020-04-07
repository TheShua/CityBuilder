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
export const settings = {
	ratioRefound: 0.7, // rate of selling for buildings
};
export const helper = new Helper();
export const villagers = new Villagers();
export const city = new City();
export const gameManager = new GameManager(debug.status, 500, city, villagers);

const pages = document.querySelectorAll("section");

window.onload = function () {
	// document
	// 	.querySelector("#namingCity + button")
	// 	.addEventListener("click", function() {
	// 		let inputCityName = document.getElementById("namingCity");
	// 		city.setName(inputCityName.value);
	// 		inputCityName.parentNode.parentNode.remove();
	// 	});
	gameManager.renderPage();

	document.querySelector(`#debug [data-action="pause"]`).onclick = (e) => {
		e.target.textContent = gameManager.toggleGame();
	};

	document.querySelectorAll(`[data-type="link"]`).forEach((e) => {
		e.onclick = (l) => {
			switchPage(l.target.getAttribute("data-page"));
		};
	});
};

export function switchPage(page) {
	let section = "";
	pages.forEach((e) => {
		if (e.getAttribute("id") === `page-${page}`) section = e;
		e.style.display = "none";
	});

	if (page === "villagers") gameManager.renderPage("villagers");
	else if (page === "buildings") gameManager.renderPage("buildings");
	else if (page === "inn") gameManager.renderPage("inn");
	section.style.display = "block";
}

export function closeFocus() {
	document.querySelector(".black-screen").remove();
}
