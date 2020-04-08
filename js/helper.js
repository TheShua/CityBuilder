import { settings, villagers, city, closeFocus, gameManager } from "./main.js";
import { allBuildings, battlemaps } from "./database.js";

export class Helper {
	createRowVillager(job, number) {
		let div = document.createElement("div");
		div.classList.add("element");
		div.innerHTML = `<span class="title-job">${job}</span> 
            <strong>${number}</strong>
            <img src="/assets/img/sections/arrowBrown_left.png" class="minus" alt="<"> <img src="/assets/img/sections/arrowBrown_right.png" class="plus" alt=">">`;
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
			test1.appendChild(this.showPriceInBlock(building));
			test1.appendChild(
				this.createButton("up", "Upgrade", function () {
					city.upgradeBuilding(building.name);
				})
			);
			buttons.appendChild(test1);
			test1 = document.createElement("div");
			test1.className = "testButton";
			test1.appendChild(this.showPriceInBlock(building, "down"));
			test1.appendChild(
				this.createButton("down", "Downgrade", function () {
					city.downgradeBuilding(building.name);
				})
			);
			buttons.appendChild(test1);
		}
		bloc.appendChild(buttons);
		return bloc;
	}

	showPriceInBlock(building, statFor) {
		let stats = null;
		let list = document.createElement("ul");
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
			li.innerHTML = `<span>${x.name}</span><span>${x.nb}</span>`;
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

	focusFrame(bg = true) {
		let black = document.createElement("div");
		if (bg) {
			black.className = "black-screen";
			black.innerHTML = `<div class="form content"></div>`;
		} else {
			black.className = "black-screen map";
			black.innerHTML = `<div class="content"></div>`;
		}
		return black;
	}

	createNewBuildingBlock(building) {
		let bloc = document.createElement("article");
		bloc.innerHTML = `<h3>${building.name}</h3>`;
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
			element.innerHTML = `<img src="./../assets/img/resources/${resource.name}.png"
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
		let difficulty = quest.story.factor;
		let btnPick = this.createButton("up", "Take the quest !", function () {
			gameManager.createFight(quest);
		});
		infoBloc.innerHTML = `${nbVillagers}/${quest.story.maxAdventurers} - 
        ${difficulty} - `;
		infoBloc.appendChild(btnPick);
		article.appendChild(infoBloc);
		return article;
	}

	createBattleMap() {
		let arena = document.createElement("div");
		arena.className = "arena";
		let map = battlemaps.base;
		let classTile = Math.floor(Math.random() * 5) + 1;
		let tileData = { width: 50, height: 25 };
		for (let row in map.pattern) {
			for (let tile in map.pattern[row]) {
				let cell = document.createElement("div");
				cell.className = "tile";
				cell.setAttribute("data-posx", row);
				cell.setAttribute("data-posy", tile);
				let x = tile * tileData.width;
				let y = row * tileData.height;
				let mx = x / 2;
				let my = y * 2;
				cell.style.marginTop = `${mx}px`;
				cell.style.marginLeft = `-${my}px`;
				cell.style.top = `${y}px`;
				cell.style.left = `${x}px`;
				cell.style.zIndex = `1`;
				cell.classList.add(`grass-${classTile}`);
				let rand = Math.floor(Math.random() * 6);
				cell.classList.add(`variant-${rand}`);
				arena.append(cell);
			}
		}
		return arena;
	}
}
