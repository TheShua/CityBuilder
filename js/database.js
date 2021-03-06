import { settings } from "./main.js";

// prettier-ignore
export const allBuildings = [
	{
		name: "Woodcutter camp",
		level: 1,
		maxLevel: 10,
		image: "",
        job: "Woodcutter",
        type: "recolt",
        description: "Your villagers pick some axes and go chop chop some trees, bringing you back <strong>wood</strong> for your next projects. ",
        maxVillagers: [0, 2, 4, 6, 8, 10, 13, 16, 19, 22, 25, 28, 31, 34,
            37, 40, 45, 50, 55, 60, 70, 80, 90, 100, 110, 150],
        prodPerPerson: [0, 2, 3, 4, 5, 6, 7, 9, 11, 13, 15, 18, 21, 24,
            27, 30, 34, 38, 42, 46, 50, 55, 60, 65, 70, 80],
        toShow: ["maxVillagers", "prodPerPerson"],
        resourceGain: ["wood"],
        price: [{ resource: "wood", base: 60, ratio: 1.5, fromLv: 0 },
                { resource: "stone", base: 50, ratio: 1.3, fromLv: 3 },]
        //     [[], [], [{ resource: "wood", nb: 100 }], [{ resource: "wood", nb: 150 }], [{ resource: "wood", nb: 200 }, { resource: "stone", nb: 50 }],
        // [{ resource: "wood", nb: 275}, {resource: "stone", nb: 100}], [{resource: "wood", nb: 350}, {resource: "stone", nb: 150}]]
	},
	{
		name: "Hunter camp",
		level: 1,
		maxLevel: 10,
		image: "",
        job: "Hunter",
        type: "recolt",
        description: "Let your villagers hunt in the forest nearby to bring back <strong>raw meat</strong> and <strong>hide</strong> from the local wildlife.",
        maxVillagers: [0, 2, 4, 6, 8, 10, 13, 16, 19, 22, 25, 28, 31, 34,
            37, 40, 45, 50, 55, 60, 70, 80, 90, 100, 110, 150],
        prodPerPerson: [0, 2, 3, 4, 5, 6, 7, 9, 11, 13, 15, 18, 21, 24,
            27, 30, 34, 38, 42, 46, 50, 55, 60, 65, 70, 80],
        toShow: ["maxVillagers", "prodPerPerson"],
        resourceGain: ["meat", "hide"],
        price: [{ resource: "wood", base: 60, ratio: 1.5, fromLv: 0 },
        { resource: "stone", base: 50, ratio: 1.3, fromLv: 3 },]
    },
    {
        name: "Farm",
        level: 0,
        maxLevel: 10,
        image: "",
        job: "Farmer",
        type: "recolt",
        description: "Plant some seed to let your villagers cultivate long field around the town. <strong>Wheat</strong> is good for some bread !",
        maxVillagers: [0, 2, 4, 6, 8, 10, 13, 16, 19, 22, 25, 28, 31, 34,
            37, 40, 45, 50, 55, 60, 70, 80, 90, 100, 110, 150],
        prodPerPerson: [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24,
            27, 30, 34, 38, 42, 46, 50, 55, 60, 65, 70, 80],
        toShow: ["maxVillagers", "prodPerPerson"],
        resourceGain: ["wheat"],
        price: [{ resource: "wood", base: 80, ratio: 1.75, fromLv: 0 },
        { resource: "stone", base: 40, ratio: 1.3, fromLv: 5 },]
    },
    {
        name: "Sheep farm",
        level: 0,
        maxLevel: 10,
        image: "",
        job: "Sheep Farmer",
        type: "recolt",
        description: "Shepherds watches over his flock of sheeps. Good to acquire some <strong>wool</strong> and sometime... well, some <strong>meat</strong>",
        maxVillagers: [0, 1, 2, 3, 5, 6, 7, 10, 12, 14, 16, 18, 20, 22,
            25, 28, 31, 34, 38, 42, 46, 50, 55, 60, 65, 70],
        prodPerPerson: [0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5,
            5, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10],
        toShow: ["maxVillagers", "prodPerPerson"],
        resourceGain: ["wool"],
        price: [{ resource: "wood", base: 80, ratio: 1.75, fromLv: 0 },
        { resource: "stone", base: 40, ratio: 1.3, fromLv: 5 },]
    },
    {
        name: "Stone quarry",
        level: 0,
        maxLevel: 10,
        image: "",
        job: "Stone miner",
        type: "recolt",
        description: "Wood is good yeah, but what about some <strong>stones</strong> ? It's needed if you want to build some fancy builds !",
        maxVillagers: [0, 2, 4, 6, 8, 10, 13, 16, 19, 22, 25, 28, 31, 34,
            37, 40, 45, 50, 55, 60, 70, 80, 90, 100, 110, 150],
        prodPerPerson: [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24,
            27, 30, 34, 38, 42, 46, 50, 55, 60, 65, 70, 80],
        toShow: ["maxVillagers", "prodPerPerson"],
        resourceGain: ["stone"],
        price: [{ resource: "wood", base: 50, ratio: 1.3, fromLv: 0 },
        { resource: "stone", base: 20, ratio: 1.5, fromLv: 2 },]
    },
    {
        name: "Mine",
        level: 0,
        maxLevel: 10,
        image: "",
        job: "Ore miner",
        type: "recolt",
        description: "It ain't no trick to get rich quick if you dig dig dig with a shovel or a pick ! In a mine! In a mine! Where a million <strong>ores</strong> shine !",
        maxVillagers: [0, 2, 4, 6, 8, 10, 13, 16, 19, 22, 25, 28, 31, 34,
            37, 40, 45, 50, 55, 60, 70, 80, 90, 100, 110, 150],
        prodPerPerson: [0, 1, 2, 3, 4, 5, 7, 9, 11, 13, 15, 18, 21, 24,
            27, 30, 34, 38, 42, 46, 50, 55, 60, 65, 70, 80],
        toShow: ["maxVillagers", "prodPerPerson"],
        resourceGain: ["ore"],
        price: [{ resource: "wood", base: 50, ratio: 1.3, fromLv: 0 },
        { resource: "stone", base: 20, ratio: 1.5, fromLv: 2 },]
    }, {
        name: "Inn",
        level: 0,
        maxLevel: 10,
        image: "",
        type: "misc",
        description: "You all meet in a tavern. After paying some drinks, the innkeeper told you about some old loot far away ! And maybe a princess in another castle, why not ?",
        toShow: [],
        price: [{ resource: "wood", base: 50, ratio: 1.3, fromLv: 0 },
        { resource: "stone", base: 20, ratio: 1.5, fromLv: 2 },]
    }
];

// !!!!!!!!!!!!! RESOURCES !!!!!!!!!

export const allResources = [
	{ name: "wood", nb: 0, categorie: "raw", type: ["base"] },
	{
		name: "meat",
		nb: 0,
		categorie: "raw",
		type: ["base", "nourishment"],
		nutritValue: 1,
	},
	{ name: "wheat", nb: 0, categorie: "raw", type: [] },
	{ name: "hide", nb: 0, categorie: "raw", type: ["base"] },
	{ name: "wool", nb: 0, categorie: "raw", type: [] },
	{ name: "stone", nb: 0, categorie: "raw", type: [] },
	{ name: "ore", nb: 0, categorie: "raw", type: [] },
	{ name: "gold", nb: 0, categorie: "product", type: ["base"] },
	{ name: "plank", nb: 0, categorie: "product", type: [] },
	{
		name: "food",
		nb: 0,
		categorie: "product",
		type: ["nourishment"],
		nutritValue: 3,
	},
	{ name: "flour", nb: 0, categorie: "product", type: [] },
	{ name: "bread", nb: 0, categorie: "product", type: [] },
	{ name: "stonebrick", nb: 0, categorie: "product", type: [] },
	{ name: "gem", nb: 0, categorie: "product", type: [] },
];

export const allNarratives = [
	{
		title: "The need for Apples", // Gathering apples
		description:
			"A local farmer needs you to bring her back some apples from a tree in a deep field. Beware, they tell it's guarded by the terrible rabbit of Caerbannog, or... maybe it's just regular rabbits. Wait ! A chicken ?!",
		encounter: ["chicken"],
		factor: 1,
		maxAdventurers: 2,
	},
	{
		title: "The Chroma Conclave", // Chroma conclave in tal'dorei
		description:
			"They told that dragons took over Tal'Dorei. You'll need to face Thordak, the mighty lord of the dragon who has gone crazy for power.",
		encounter: ["elder"],
		factor: 3,
		maxAdventurers: 3,
	},
	{
		title: "Random Quest 3",
		description:
			"They told that dragons took over Tal'Dorei. You'll need to face Thordak, the mighty lord of the dragon who has gone crazy for power.",
		encounter: ["orc"],
		factor: 3,
		maxAdventurers: 3,
	},
	{
		title: "Random Quest 4",
		description:
			"They told that dragons took over Tal'Dorei. You'll need to face Thordak, the mighty lord of the dragon who has gone crazy for power.",
		encounter: ["armor"],
		factor: 3,
		maxAdventurers: 3,
	},
	{
		title: "Random Quest 5",
		description:
			"They told that dragons took over Tal'Dorei. You'll need to face Thordak, the mighty lord of the dragon who has gone crazy for power.",
		encounter: ["guard"],
		factor: 3,
		maxAdventurers: 3,
	},
	{
		title: "Random Quest 6",
		description:
			"They told that dragons took over Tal'Dorei. You'll need to face Thordak, the mighty lord of the dragon who has gone crazy for power.",
		encounter: ["fullweed"],
		factor: 3,
		maxAdventurers: 3,
	},
	{
		title: "Random Quest 7",
		description:
			"They told that dragons took over Tal'Dorei. You'll need to face Thordak, the mighty lord of the dragon who has gone crazy for power.",
		encounter: ["ripper"],
		factor: 3,
		maxAdventurers: 3,
	},
	{
		title: "Random Quest 8",
		description:
			"They told that dragons took over Tal'Dorei. You'll need to face Thordak, the mighty lord of the dragon who has gone crazy for power.",
		encounter: ["patrio"],
		factor: 3,
		maxAdventurers: 3,
	},
];

// prettier-ignore
export const battlemaps = {
    base: {
        pattern: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],]
    }
};

export const allCharacters = [
	{
		name: "Rei",
		nameToShow: "Rogue",
		className: "rei",
		defense: false,
		baseHp: 90,
		actualHp: 100,
		speed: 80.9,
		actualAp: 0,
		str: 6,
	},
	{
		name: "Ryu",
		nameToShow: "Warrior",
		className: "ryu",
		defense: false,
		baseHp: 100,
		actualHp: 100,
		speed: 50.4,
		actualAp: 0,
		str: 7,
	},
	{
		name: "Momo",
		nameToShow: "Artificer",
		className: "momo",
		defense: false,
		baseHp: 120,
		actualHp: 100,
		speed: 35.3,
		actualAp: 0,
		str: 8,
	},
	{
		name: "Teepo",
		nameToShow: "Thief",
		className: "teepo",
		defense: false,
		baseHp: 70,
		actualHp: 100,
		speed: 100.7,
		actualAp: 0,
		str: 6,
	},
	{
		name: "Garr",
		nameToShow: "Barbarian",
		className: "garr",
		defense: false,
		baseHp: 200,
		actualHp: 100,
		speed: 30.6,
		actualAp: 0,
		str: 12,
	},
];

export const allEnemies = [
	{
		name: "Chicken",
		nameShown: "Pollito",
		className: "chicken",
		baseHp: 100,
		actualHp: 100,
		actualAp: 0,
		speed: 76,
		str: 50,
	},
	{
		name: "Orc",
		nameShown: "Ko NaN",
		className: "orc",
		baseHp: 100,
		actualHp: 100,
		actualAp: 0,
		speed: 76,
		str: 50,
	},
	{
		name: "Patrio",
		nameShown: "Patrio",
		className: "patrio",
		baseHp: 100,
		actualHp: 100,
		actualAp: 0,
		speed: 76,
		str: 50,
	},
	{
		name: "Ripper",
		nameShown: "Ripper",
		className: "ripper",
		baseHp: 100,
		actualHp: 100,
		actualAp: 0,
		speed: 76,
		str: 50,
	},
	{
		name: "FullWeed",
		nameShown: "Full Weed",
		className: "fullweed",
		baseHp: 100,
		actualHp: 100,
		actualAp: 0,
		speed: 76,
		str: 50,
	},
	{
		name: "Guard",
		nameShown: "Guard",
		className: "guard",
		baseHp: 100,
		actualHp: 100,
		actualAp: 0,
		speed: 76,
		str: 50,
	},
	{
		name: "Armor",
		nameShown: "Enchanted armor",
		className: "armor",
		baseHp: 100,
		actualHp: 100,
		actualAp: 0,
		speed: 76,
		str: 50,
	},
	{
		name: "Elder",
		nameShown: "Thordak",
		className: "elder",
		baseHp: 100,
		actualHp: 100,
		actualAp: 0,
		speed: 76,
		str: 50,
	},
];
