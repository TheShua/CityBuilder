import {
	settings,
	villagers,
	city,
	closeFocus,
	gameManager,
	animateCSS,
} from "./main.js";
import { allBuildings, battlemaps } from "./database.js";

export class Helper {
	createRowVillager(job, number) {
		let div = document.createElement("div");
		div.classList.add("element");
		div.innerHTML = `<span class="title-job">${job}</span> 
            <strong>${number}</strong>
            <img src="./assets/img/sections/arrowBrown_left.png" class="minus" alt="<"> <img src="./assets/img/sections/arrowBrown_right.png" class="plus" alt=">">`;
		return div;
	}

	createBuildingBlock(building) {
		let bloc = document.createElement("article");
		bloc.innerHTML = `<h3>${building.name}</h3>
        <span class="level">${building.level}</span>`;
		if (building.image != "") {
			bloc.innerHTML += `<img src="${building.image}" alt="${building.name} Infos" />`;
		}
		bloc.innerHTML += `<p>${building.description}</p>
        <table>
        <thead><tr>
        <th></th><th>Actual</th><th>Level up</th>
        </tr>
        </thead></table>`;
		building.toShow.forEach((e) => {
			let tr = document.createElement("tr");
			if (e === "maxVillagers") {
				tr.innerHTML += `<td>Max villagers</td>
                <td>${building[e][building.level]}</td>`;
				if (building.level === building.levelMax) {
					tr.innerHTML += `<td>//</td>`;
				} else {
					tr.innerHTML += `<td>${building[e][building.level + 1]}</td>`;
				}
			}
			if (e === "prodPerPerson") {
				tr.innerHTML += `<td>Prod per person</td>
                <td>${building[e][building.level]}</td>`;
				if (building.level === building.levelMax) {
					tr.innerHTML += `<td>//</td>`;
				} else {
					tr.innerHTML += `<td>${building[e][building.level + 1]}</td>`;
				}
			}
			bloc.querySelector("table").appendChild(tr);
		});
		let buttons = document.createElement("div");
		buttons.className = "buttons";
		if (building.level === building.levelMax) {
			buttons.appendChild(
				this.createButton("down", "Downgrade", function () {
					city.downgradeBuilding(building.name);
				})
			);
		} else {
			let test1 = document.createElement("div");
			test1.className = "testButton";
			test1.appendChild(
				this.createButton("up", "Upgrade", function () {
					city.upgradeBuilding(building.name);
				})
			);
			test1.appendChild(this.showPriceInBlock(building));
			buttons.appendChild(test1);
			test1 = document.createElement("div");
			test1.className = "testButton";
			test1.appendChild(
				this.createButton("down", "Downgrade", function () {
					city.downgradeBuilding(building.name);
				})
			);
			test1.appendChild(this.showPriceInBlock(building, "down"));
			buttons.appendChild(test1);
		}
		bloc.appendChild(buttons);
		return bloc;
	}

	showPriceInBlock(building, statFor) {
		let stats = null;
		let list = document.createElement("ul");
		list.className = "costList";
		if (building.level > 0) {
			if (statFor === "down") {
				stats = city.calculatePrice(building, settings.ratioRefound);
			} else {
				stats = city.calculatePrice(building);
			}
		} else {
			stats = city.calculatePrice(
				allBuildings.find((x) => building.name === x.name)
			);
		}
		stats.forEach((x) => {
			let li = document.createElement("li");
			li.innerHTML = `<span><img src="./assets/img/resources/${x.name}.png" alt="${x.name}" /></span><span>${x.nb}</span>`;
			list.appendChild(li);
		});
		return list;
	}

	createButton(className, text, onclick) {
		let button = document.createElement("button");
		button.className = className;
		button.textContent = text;
		button.onclick = (e) => onclick();
		return button;
	}

	focusFrame(bg = true, opacity = 0) {
		let black = document.createElement("div");
		if (bg) {
			black.className = "black-screen";
			black.innerHTML = `<div class="form content"></div>`;
		} else {
			black.className = "black-screen map";
			black.innerHTML = `<div class="content"></div>`;
		}
		if (opacity != 0) black.style.background = `rgba(0,0,0,${opacity})`;
		return black;
	}

	createNewBuildingBlock(building) {
		let bloc = document.createElement("article");
		bloc.innerHTML = `<h3>${building.name}</h3>`;
		if (building.image != "") {
			bloc.innerHTML += `<img src="${building.image}" alt="${building.name} Infos" />`;
		}
		bloc.innerHTML += `<p>${building.description}</p>`;
		// <table>
		// <thead><tr>
		// <th></th><th>Actual</th><th>Level up</th>
		// </tr>
		// </thead></table>`;
		// building.toShow.forEach((e) => {
		// 	let tr = document.createElement("tr");
		// 	if (e === "maxVillagers") {
		// 		tr.innerHTML += `<td>Max villagers</td>
		//         <td>${building[e][building.level]}</td>`;
		// 		if (building.level === building.levelMax) {
		// 			tr.innerHTML += `<td>//</td>`;
		// 		} else {
		// 			tr.innerHTML += `<td>${building[e][building.level + 1]}</td>`;
		// 		}
		// 	}
		// 	if (e === "prodPerPerson") {
		// 		tr.innerHTML += `<td>Prod per person</td>
		//         <td>${building[e][building.level]}</td>`;
		// 		if (building.level === building.levelMax) {
		// 			tr.innerHTML += `<td>//</td>`;
		// 		} else {
		// 			tr.innerHTML += `<td>${building[e][building.level + 1]}</td>`;
		// 		}
		// 	}
		// 	bloc.querySelector("table").appendChild(tr);
		// });
		let buttons = document.createElement("div");
		buttons.className = "buttons";
		let test1 = document.createElement("div");
		test1.className = "testButton";
		test1.appendChild(this.showPriceInBlock(building));
		test1.appendChild(
			this.createButton("up", "Build", function () {
				if (city.createBuilding(building.name)) {
					closeFocus();
				}
			})
		);
		buttons.appendChild(test1);
		bloc.appendChild(buttons);
		return bloc;
	}

	showResourcesLists() {
		let clearAll = document.querySelectorAll(
			`li[data-type=resources]:not([data-info="villagers"]) ul`
		);
		clearAll.forEach((e) => (e.innerHTML = ""));

		city.resources.forEach((resource) => {
			let selector = `li[data-type=resources][data-info="${resource.categorie}"] ul`;
			let list = document.querySelector(selector);
			let element = document.createElement("li");
			element.setAttribute("data-resource", resource.name);
			element.innerHTML = `<img src="./assets/img/resources/${resource.name}.png"
            alt="${resource.name} Icon"> ${resource.name} : <span>${resource.nb}</span>`;
			list.appendChild(element);
		});
	}

	createQuestBoard(quest) {
		let article = document.createElement("article");
		article.innerHTML = `<h3>${quest.story.title}</h3>
        <p>${quest.story.description}</p>`;
		let infoBloc = document.createElement("div");
		infoBloc.className = "info-bloc";
		let nbVillagers =
			villagers.getAllVillagers("unaffected").length >
			quest.story.maxAdventurers
				? quest.story.maxAdventurers
				: villagers.getAllVillagers("unaffected").length;
		let rand = Math.ceil(Math.random() * 20);
		let difficulty = quest.story.factor * 10 * rand;
		let btnPick = this.createButton("up", "Take the quest !", function () {
			gameManager.createFight(quest, nbVillagers, difficulty);
		});
		infoBloc.innerHTML = `<img src="./assets/img/resources/villagers.png" alt="adventurers icon"> ${nbVillagers}/${quest.story.maxAdventurers} - 
        ${difficulty} <img src="./assets/img/resources/gold.png" alt="gold icon"> - `;
		infoBloc.appendChild(btnPick);
		article.appendChild(infoBloc);
		return article;
	}

	createBattleMap() {
		let arena = document.createElement("div");
		arena.className = "arena";
		let map = battlemaps.base;
		let tileData = { width: 135, height: 121 };
		let classTile = Math.floor(Math.random() * 5) + 1;
		for (let row in map.pattern) {
			for (let tile in map.pattern[row]) {
				let cell = document.createElement("div");
				cell.className = "tile";
				cell.setAttribute("data-posx", row);
				cell.setAttribute("data-posy", tile);
				cell.style.width = `${tileData.width}`;
				cell.style.height = `${tileData.height}`;
				let x = tile * 55;
				let y = row * 29;
				let mx = x / 2;
				let my = y * 2;
				cell.style.marginTop = `${mx}px`;
				cell.style.marginLeft = `-${my}px`;
				cell.style.top = `${y}px`;
				cell.style.left = `${x}px`;
				cell.classList.add(`grass-${classTile}`);
				let rand = Math.floor(Math.random() * 50) + 1;
				if (rand <= 25) rand = 1;
				else if (rand <= 30) rand = 2;
				else if (rand <= 35) rand = 3;
				else if (rand <= 40) rand = 4;
				else if (rand <= 45) rand = 5;
				else if (rand <= 50) rand = 6;
				// let rand = Math.floor(Math.random() * 6);
				cell.classList.add(`variant-${rand}`);
				arena.append(cell);
			}
		}
		return arena;
	}

	createCharacterBattleBloc(char) {
		let bloc = document.createElement("div");
		bloc.className = `bloc ${char.name.toLowerCase()}`;
		bloc.innerHTML = `<div class="row-top">
				<strong><span>H</span>P.</strong>
				<div>
					<div class="nb-hp">${char.actualHp}</div>
					<div class="lifeBarContainer">
						<div class="life"></div>
					</div>
				</div>
			</div>
			<div class="portrait ${char.name.toLowerCase()}"></div>
			<div class="name">${char.nameToShow}</div>
			<div class="row-bot">
				<strong><span>A</span>P.</strong>
				<div class="apBarContainer">
					<div class="ap"></div>
				</div>
			</div>`;
		return bloc;
	}

	createCliquable(tag, className, text, onclick) {
		let button = document.createElement(tag);
		button.className = className;
		button.textContent = text;
		button.onclick = (e) => onclick();
		return button;
	}

	showActionUI(char) {
		let actionsUI = document.createElement("div");
		actionsUI.setAttribute("id", "action-ui");
		let characterName = document.createElement("div");
		characterName.className = "character-name";
		characterName.textContent = char.nameToShow;
		actionsUI.appendChild(characterName);
		actionsUI.appendChild(
			this.createCliquable("div", "act attack", "", () =>
				gameManager.fight.characterDo(char, "attack")
			)
		);
		actionsUI.appendChild(
			this.createCliquable("div", "act defense", "", () =>
				gameManager.fight.characterDo(char, "defend")
			)
		);
		actionsUI.appendChild(
			this.createCliquable("div", "act magick", "", () =>
				gameManager.fight.characterDo(char, "magick")
			)
		);
		actionsUI.appendChild(
			this.createCliquable("div", "act item", "", () =>
				gameManager.fight.characterDo(char, "items")
			)
		);
		actionsUI.appendChild(
			this.createCliquable("div", "act flee", "", () =>
				gameManager.fight.characterDo(char, "flee")
			)
		);
		return actionsUI;
	}

	showMainMessage(title, htmlString, className = "") {
		let article = document.createElement("article");
		article.className = className;
		article.innerHTML = `<h3>${title}</h3>
		${htmlString}`;
		return article;
	}
}
