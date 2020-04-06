export class Helper {
	createRowVillager(job, number) {
		let div = document.createElement("div");
		div.classList.add("element");
		div.innerHTML = `<span class="title-job">${job}</span> 
            <strong>${number}</strong>
            <img src="/assets/img/sections/arrowBrown_left.png" class="minus" alt="<"> <img src="/assets/img/sections/arrowBrown_right.png" class="plus" alt=">">`;
		return div;
	}

	createBuilding(building) {
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
		if (building.level < 1) {
			buttons.innerHTML += `<button class="up">Build</button>`;
		} else if (building.level === building.levelMax) {
			buttons.innerHTML += `<button class="down">Downgrade</button>`;
		} else {
			buttons.innerHTML += `<button class="up">Upgrade</button><button class="down">Downgrade</button>`;
		}
		bloc.appendChild(buttons);
		return bloc;
	}
}
