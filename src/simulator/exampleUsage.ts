// path: src/simulator/exampleUsage.ts

import { ExtendedRpsSimulator } from "./ExtendedRpsSimulator";
import { ENEMIES_DATA } from "../data/enemiesData"; // or wherever you store the 22 enemies
import { Player, LootOption } from "../client/types/game";
import { logger } from "../utils/logger";

/**
 * Minimal demonstration of how to simulate a run:
 *  1) Build a "Player" object for the user
 *  2) Create or load a list of EnemyEntity[] for the run
 *  3) Prepare any consumables the user is carrying (2 max typically)
 *  4) Create a lootPool: an array of 45 "LootOption" or fewer for testing
 *  5) Call simulator.simulateRun(...)
 *  6) See how many enemies were defeated, whether the player survived, etc.
 */

// Example user stats as a "Player"
const userPlayer: Player = {
  id: "0xUserPlayer",
  rock: {
    startingATK: 10,
    startingDEF: 2,
    currentATK: 10,
    currentDEF: 2,
    currentCharges: 3,
    maxCharges: 3,
  },
  paper: {
    startingATK: 0,
    startingDEF: 8,
    currentATK: 0,
    currentDEF: 8,
    currentCharges: 3,
    maxCharges: 3,
  },
  scissor: {
    startingATK: 2,
    startingDEF: 2,
    currentATK: 2,
    currentDEF: 2,
    currentCharges: 3,
    maxCharges: 3,
  },
  health: {
    current: 14,
    starting: 12,
    currentMax: 14,
    startingMax: 12,
  },
  shield: {
    current: 4,
    starting: 2,
    currentMax: 6,
    startingMax: 2,
  },
  equipment: [],
  lastMove: "",
  thisPlayerWin: false,
  otherPlayerWin: false,
  _id: "user_player_1",
};

/**
 * Example items (consumables) the user might bring:
 * - one "heal" item (level 2 -> heals for +8)
 * - one "damage" item (level 1 -> presumably deals 4 dmg if you code it that way)
 */
const userConsumables = [
  { name: "heal", level: 2, quantity: 1 },
  { name: "damage", level: 1, quantity: 1 },
];

/**
 * Example "lootPool" array with a few sample LootOption.
 * In your real usage, you might have a complete set of 45 options
 * each with a boonTypeString like "UpgradeRock", "AddMaxArmor", etc.
 */
const lootPool: LootOption[] = [
  {
    docId: "loot_upRock",
    RARITY_CID: 1,
    UINT256_CID: 100,
    UINT256_CID_array: [1, 1, null, null],
    selectedVal1: 1, // e.g. +1 ATK
    selectedVal2: 0, // e.g. +0 DEF
    boonTypeString: "UpgradeRock",
  },
  {
    docId: "loot_upPaper",
    RARITY_CID: 0,
    UINT256_CID: 101,
    UINT256_CID_array: [2, 2, 0, 0],
    selectedVal1: 2,
    selectedVal2: 0,
    boonTypeString: "UpgradePaper",
  },
  {
    docId: "loot_heal",
    RARITY_CID: 0,
    UINT256_CID: 102,
    UINT256_CID_array: [6, 6, null, null],
    selectedVal1: 6, // heal 6 HP
    selectedVal2: 0,
    boonTypeString: "Heal",
  },
  {
    docId: "loot_addMaxArmor",
    RARITY_CID: 1,
    UINT256_CID: 103,
    UINT256_CID_array: [3, 3, null, null],
    selectedVal1: 3, // +3 to max shield
    selectedVal2: 0,
    boonTypeString: "AddMaxArmor",
  },
  // ... add more as needed
];

/**
 * Optional weighting function that uses RARITY_CID to determine how likely
 * each loot is among the random picks. Higher rarity -> lower probability, etc.
 */
function lootProbability(loot: LootOption): number {
  switch (loot.RARITY_CID) {
    case 0: // Common
      return 40;
    case 1: // Uncommon
      return 20;
    case 2: // Rare
      return 10;
    case 3: // Epic
      return 5;
    case 4: // Legendary
      return 2;
    default:
      return 1;
  }
}

/**
 * Main demonstration function
 */
export async function simulateUserRun() {
  // Create a config. We'll face all 22 enemies from ENEMIES_DATA.
  const simulatorConfig = {
    player: userPlayer,
    enemies: ENEMIES_DATA,
    availableConsumables: userConsumables,
    lootPool: lootPool,
    lootProbaFn: lootProbability,
    // maxEnemiesToFight: 10, // if you want to limit to first 10 for testing
  };

  // Instantiate the simulator
  const simulator = new ExtendedRpsSimulator();

  // Run the simulation
  const result = simulator.simulateRun(simulatorConfig);

  // Log results:
  console.log("==== SIMULATION COMPLETE ====");
  console.log(`Enemies defeated: ${result.enemiesDefeated}`);
  console.log(`Player survived all fights? ${result.survived}`);
  console.log("Used consumables:", result.usedConsumables);
  console.log(
    "Chosen loot:",
    result.lootPickedLog.map((loot) => loot.boonTypeString)
  );
}

export async function multiRunDemo() {
  // A sample player
  const userPlayer: Player = {
    id: "0xUser",
    rock: {
      startingATK: 10,
      startingDEF: 2,
      currentATK: 10,
      currentDEF: 2,
      currentCharges: 3,
      maxCharges: 3,
    },
    paper: {
      startingATK: 0,
      startingDEF: 8,
      currentATK: 0,
      currentDEF: 8,
      currentCharges: 3,
      maxCharges: 3,
    },
    scissor: {
      startingATK: 2,
      startingDEF: 2,
      currentATK: 2,
      currentDEF: 2,
      currentCharges: 3,
      maxCharges: 3,
    },
    health: { current: 14, currentMax: 14, starting: 12, startingMax: 12 },
    shield: { current: 4, currentMax: 6, starting: 2, startingMax: 2 },
    equipment: [],
    lastMove: "",
    thisPlayerWin: false,
    otherPlayerWin: false,
    _id: "player1",
  };

  const userConsumables = [
    { name: "heal", level: 2, quantity: 1 },
    { name: "damage", level: 1, quantity: 1 },
  ];

  const lootPool: LootOption[] = [
    {
      docId: "loot_upRock",
      RARITY_CID: 1,
      UINT256_CID: 100,
      UINT256_CID_array: [1, 1, null, null],
      selectedVal1: 1,
      selectedVal2: 0,
      boonTypeString: "UpgradeRock",
    },
    {
      docId: "loot_upPaper",
      RARITY_CID: 2,
      UINT256_CID: 101,
      UINT256_CID_array: [3, 2, null, null],
      selectedVal1: 3,
      selectedVal2: 0,
      boonTypeString: "UpgradePaper",
    },
    {
      docId: "loot_heal",
      RARITY_CID: 0,
      UINT256_CID: 102,
      UINT256_CID_array: [6, 6, null, null],
      selectedVal1: 6,
      selectedVal2: 0,
      boonTypeString: "Heal",
    },
  ];

  function lootProbability(loot: LootOption): number {
    // Example weighting
    switch (loot.RARITY_CID) {
      case 0:
        return 40; // common
      case 1:
        return 20; // uncommon
      case 2:
        return 10; // rare
      default:
        return 1;
    }
  }

  const simulator = new ExtendedRpsSimulator();
  const config = {
    player: userPlayer,
    enemies: ENEMIES_DATA,
    availableConsumables: userConsumables,
    lootPool,
    lootProbaFn: lootProbability,
    maxEnemiesToFight: 5, // limit to 5 for a quicker test
  };

  logger.info("=== Starting MULTI-RUN Demo ===");
  // We'll run 3 times for demonstration
  simulator.simulateMultipleRuns(config, 1, true);
}

// If needed to run directly:
multiRunDemo().catch(console.error);

// If you're running this as a standalone Node script, uncomment:
// simulateUserRun().catch(console.error);
