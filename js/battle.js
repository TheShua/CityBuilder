import { allCharacters, allEnemies } from "./database.js";
import { helper, city, gameManager, closeFocus, render } from "./main.js";
import { GameRender } from "./gameRender.js";

export class Battle {
	constructor(encounter, chars, reward) {
		this.encounter = encounter;
		this.nbChars = chars;
		this.characters = [];
		this.enemies = [];
		this.reward = reward;
		this.turnCount = [];
		this.battleId = 0;

		this.pickCharacters();
		this.placeCharacters();
		this.placeEnemies();
		this.showUI();
		this.startBattle();
	}

	pickCharacters() {
		while (this.characters.length < this.nbChars) {
			let rand = Math.floor(Math.random() * allCharacters.length);
			if (!this.characters.some((x) => x.name === allCharacters[rand].name)) {
				this.characters.push({ ...allCharacters[rand] });
			}
		}

		for (let i = 0; i < this.characters.length; i++) {
			this.turnCount.push({ name: this.characters[i].name, ap: 0 });
			let innLevel = city.structures.find((x) => x.name === "Inn").level;
			this.characters[i].baseHp *= innLevel * 2;
			this.characters[i].actualHp = this.characters[i].baseHp;
			this.characters[i].str *= innLevel * 2;
			this.characters[i].active = true;
		}
	}

	placeCharacters() {
		switch (this.nbChars) {
			case 1:
				this.placeThisEntity({ x: 4, y: 7 }, this.characters[0]);
				break;

			case 2:
				this.placeThisEntity({ x: 3, y: 7 }, this.characters[0]);
				this.placeThisEntity({ x: 5, y: 7 }, this.characters[1]);
				break;

			case 3:
				this.placeThisEntity({ x: 3, y: 8 }, this.characters[0]);
				this.placeThisEntity({ x: 4, y: 6 }, this.characters[1]);
				this.placeThisEntity({ x: 5, y: 8 }, this.characters[2]);
				break;

			case 4:
				console.log("Four o One");
				break;
		}
	}

	placeEnemies() {
		let char = allEnemies.find(
			(x) => x.name.toLocaleLowerCase() === this.encounter[0]
		);
		this.enemies = { ...char };

		switch (this.encounter.length) {
			case 1:
				this.placeThisEntity({ x: 4, y: 3 }, char);
				break;
		}

		for (let i = 0; i < this.encounter.length; i++) {
			this.turnCount.push({ name: char.name, ap: 0 });
		}
	}

	placeThisEntity(pos, char) {
		let arena = document.querySelector(".arena");
		this.arena = arena;
		let tile = arena.querySelector(
			`.tile[data-posx="${pos.x}"][data-posy="${pos.y}"]`
		);
		let charDiv = document.createElement("div");

		charDiv.classList.add("character");
		charDiv.classList.add(char.name.toLocaleLowerCase());
		tile.appendChild(charDiv);
	}

	showUI() {
		let playerUIContainer = "";
		if (!document.getElementById("characters")) {
			playerUIContainer = document.createElement("div");
			playerUIContainer.setAttribute("id", "characters");
		} else {
			playerUIContainer = document.getElementById("characters");
		}
		this.characters.forEach((x) => {
			playerUIContainer.appendChild(helper.createCharacterBattleBloc(x));
		});
		document.querySelector(".black-screen.map").appendChild(playerUIContainer);
	}

	calculatePercent(a, b) {
		return (a / b) * 100;
	}

	update() {
		let out = false;
		console.log("round");
		this.characters.forEach((x) => {
			let bloc = document.querySelector(`.bloc.${x.name.toLowerCase()}`);
			if (x.active) x.actualAp += x.speed / 4;
			else x.actualAp = 0;
			let apBar = bloc.querySelector(".ap");
			apBar.style.width = this.calculatePercent(x.actualAp, 10000) + "%";
			bloc.querySelector(".nb-hp").textContent = x.actualHp;
			let hpBar = bloc.querySelector(".life");
			hpBar.style.width = this.calculatePercent(x.actualHp, x.baseHp) + "%";
			if (x.actualAp >= 10000) {
				this.pauseRound();
				this.turnToPlay(x);
				out = true;
			}
		});
		if (out) return;
		this.enemies.actualAp += this.enemies.speed / 4;
		if (this.enemies.actualAp >= 10000) {
			let rand = Math.round(Math.random() * this.characters.length);
			this.attackTarget(this.enemies, this.characters[rand]);
			this.enemies.actualAp = 0;

			this.pauseRound();
			setTimeout(() => {
				this.startBattle();
			}, 500);
		}
	}

	pauseRound = function () {
		console.log("Clear Interval");
		clearInterval(this.battleId);
	};

	startBattle() {
		this.battleId = setInterval(() => {
			this.update();
		}, 10);
	}

	turnToPlay(character) {
		let actionUI = document.createElement("div");
		actionUI.setAttribute("id", "action-ui");
		actionUI.appendChild(helper.showActionUI(character));
		document.querySelector(".black-screen.map").appendChild(actionUI);
	}

	clearActionsUI() {
		document.getElementById("action-ui").remove();
	}

	characterDo(char, action) {
		console.log(`${char.nameToShow} do ${action}`);
		switch (action) {
			case "attack":
				this.clearActionsUI();
				this.attackTarget(char);
				break;
		}
	}

	attackTarget(attacker, defender = "enemy") {
		if (defender === "enemy") {
			defender = this.enemies;
			defender.actualHp -= attacker.str;
			console.log(`${defender.nameShown} has ${defender.actualHp}hp left`);
			// Effects of the attack !
			attacker.actualAp = 0;
			if (defender.actualHp <= 0) {
				this.endFight(1);
				return;
			} else {
				this.startBattle();
			}
		} else {
			defender.actualHp -= attacker.str;
			console.log(`${defender.nameToShow} has ${defender.actualHp}hp left`);
			if (defender.actualHp <= 0) {
				defender.actualHp = 0;
				defender.active = false;
				let check = this.characters.some((x) => x.active === true);
				if (!check) {
					this.endFight(0);
					return;
				}
			}
		}
	}

	stopBattle() {
		clearInterval(this.battleId);
		this.battleId = 0;
	}

	endFight(result) {
		if (result === 1) {
			// VIC-TOUERE !
			this.stopBattle();
			gameManager.dailyQuest = 1;
			render.page("inn");
			setTimeout(() => {
				closeFocus();
			}, 500);
			city.addResource([{ name: "gold", nb: this.reward * 10 }]);
			gameManager.toggleGame();
		} else {
			console.log("You loose...");
		}
	}
}
