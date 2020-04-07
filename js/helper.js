import { settings, city, closeFocus } from "./main.js";
import { allBuildings } from "./database.js";

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
		// <img src="${building.image}" alt="${building.name} Infos" />
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

	focusFrame() {
		let black = document.createElement("div");
		black.className = "black-screen";
		black.innerHTML = `<div class="form content"></div>`;
		return black;
	}

	createNewBuildingBlock(building) {
		let bloc = document.createElement("article");
		bloc.innerHTML = `<h3>${building.name}</h3>`;
		// <img src="${building.image}" alt="${building.name} Infos" />
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
}
