import { allCharacters, allEnemies } from "./database.js";
import {
	helper,
	city,
	gameManager,
	closeFocus,
	render,
	animateCSS,
} from "./main.js";

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
		charDiv.classList.add(char.className);
		tile.appendChild(charDiv);

		animateCSS(`.character.${char.className}`, "bounceInDown", () => {
			charDiv.classList.remove("bounceInDown");
		});
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
			let targetSelector = `.character.${this.enemies.className}`;
			animateCSS(targetSelector, "rubberBand", function () {
				animateCSS(targetSelector, "rubberBand", function () {
					div.remove();
				});
			});
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
		character.defense = false;
		let actionUI = document.createElement("div");
		actionUI.setAttribute("id", "action-ui");
		actionUI.appendChild(helper.showActionUI(character));
		document.querySelector(".black-screen.map").appendChild(actionUI);
	}

	clearActionsUI() {
		document.getElementById("action-ui").remove();
	}

	characterDo(char, action) {
		// console.log(`${char.nameToShow} do ${action}`);
		switch (action) {
			case "attack":
				this.clearActionsUI();
				this.attackTarget(char, this.enemies, true);
				animateCSS(`.character.${char.className}`, "rubberBand", () => {
					document
						.querySelector(`.character.${char.className}`)
						.classList.remove("rubberBand");
				});
				break;

			case "flee":
				let rand = Math.ceil(Math.random() * 5);
				if (rand === 1) {
					this.endFight("flee");
				} else {
					render.messageBox(
						`<p>You try to flee... <br>but the terrible <span class="red">${this.enemies.nameShown}</span> catch up with your squad !</p>`,
						3500
					);
					char.actualAp = 0;
					this.clearActionsUI();
					this.startBattle();
				}
				break;

			case "defend":
				char.defense = true;
				char.actualAp = 0;
				this.clearActionsUI();
				this.startBattle();
				break;

			case "magick":
				render.messageBox(
					`<p>Sorry, this isn't done yet ! We only had <span class="blue">1 week</span> you know ?!</p>`,
					3500
				);
				break;

			case "items":
				render.messageBox(
					`<p>Sorry, this isn't done yet ! We only had <span class="blue">1 week</span> you know ?!</p>`,
					3500
				);
				break;
		}
	}

	attackTarget(attacker, defender, playerAction = false) {
		let rand = Math.floor(Math.random() * 26);
		rand *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
		let dmg = attacker.str + rand;
		dmg = dmg < 0 ? 0 : dmg;
		if (defender.hasOwnProperty("defense") && defender.defense)
			dmg = Math.floor(dmg / 2);
		defender.actualHp -= dmg;
		render.showDamages(defender, dmg);

		if (playerAction) {
			// console.log(`${defender.nameShown} has ${defender.actualHp}hp left`);
			attacker.actualAp = 0;
			if (defender.actualHp <= 0) {
				this.endFight(1);
				return;
			} else {
				this.startBattle();
			}
		} else {
			// console.log(`${defender.nameToShow} has ${defender.actualHp}hp left`);
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
		gameManager.dailyQuest = 1;
		render.page("inn");
		animateCSS(".black-screen", "fadeOut", () => {
			closeFocus();
		});
		gameManager.toggleGame();
	}

	endFight(result) {
		if (result === 1) {
			// VIC-TOUERE !
			render.messageBox(
				`<p>Congratulations ! <br>
				You won ! As promised, you won those <span class="red">${this.reward} gold pieces</span>. Too bad they're useless don't you think ?</p>`,
				5000
			);
			this.stopBattle();
			city.addResource([{ name: "gold", nb: this.reward }]);
		} else if (result === "flee") {
			render.messageBox(
				`<p>You try to flee... <br>
				with success ! Too bad for the gold but at least, you're safe !</p>`,
				5000
			);
			this.stopBattle();
		} else {
			render.messageBox(
				`<p>You loose the fight... <br>
				Your brave adventurers definitely were'nt brave enough !</p>`,
				5000
			);
			this.stopBattle();
		}
	}
}
