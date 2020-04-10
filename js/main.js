// Variable assignation of global objects
export const settings = {
	ratioRefound: 0.7, // rate of selling for buildings
	globalRatio: 1, // Global Ratio for... everything I don't want to specify particularly
	resourcesRate: 10,
	growRate: 2,
	growLuck: 25,
	actualPage: "villagers",
	nbDailyQuest: 3, // Number of daily quest available to show
	titleSuffix: " :: School game project",
};

// Import other classes
import { Helper } from "./helper.js";
import { GameManager } from "./gameManager.js";
import { GameRender } from "./gameRender.js";
import { Villagers } from "./villagers.js";
import { City } from "./city.js";

// DEBUG VARIABLES
let debug = {
	debugging: false,
	status: "play", // Start the game in Pause mode "pause", "play"
};
// END DEBUG
export const helper = new Helper();
export const villagers = new Villagers();
export const city = new City();
export const render = new GameRender();
export const gameManager = new GameManager(debug.status, 1500);

const pages = document.querySelectorAll("section");

window.onload = function () {
	// if (!debug.debugging) render.chooseTitleVillage();
	render.page();
	if (debug.debugging) {
		city.createBuilding("Inn");
		render.page("inn");
	}

	// document.querySelector(`#debug [data-action="pause"]`).onclick = (e) => {
	// 	e.target.textContent = gameManager.toggleGame();
	// };
	render.addMainMenuLink("Villagers", "villagers");
	render.addMainMenuLink("Constructions", "buildings");
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

export function animateCSS(element, animationName, callback) {
	const node = document.querySelector(element);
	node.classList.add("animated", animationName);

	function handleAnimationEnd() {
		node.classList.remove("animated", animationName);
		node.removeEventListener("animationend", handleAnimationEnd);

		if (typeof callback === "function") callback();
	}

	node.addEventListener("animationend", handleAnimationEnd);
}
