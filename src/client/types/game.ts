// path: src/client/types/game.ts

/**
 * Shared game-related types (entities, players, items, etc.).
 */

export interface PlayerStats {
  startingATK: number;
  startingDEF: number;
  currentATK: number;
  currentDEF: number;
  currentCharges: number;
  maxCharges: number;
}

export interface Health {
  current: number;
  starting: number;
  currentMax: number;
  startingMax: number;
}

export interface Shield {
  current: number;
  starting: number;
  currentMax: number;
  startingMax: number;
}

export interface Equipment {
  docId: string;
  RARITY_CID: number;
  UINT256_CID: number;
  UINT256_CID_array: (number | null)[];
  selectedVal1: number;
  selectedVal2: number;
  boonTypeString: string;
}

export interface Player {
  id: string; // "0x...." for user, or "Enemy Room #", etc.
  rock: PlayerStats;
  paper: PlayerStats;
  scissor: PlayerStats;
  health: Health;
  shield: Shield;
  equipment: Equipment[];
  lastMove: string;
  thisPlayerWin: boolean;
  otherPlayerWin: boolean;
  _id: string; // DB or doc ID
}

export interface LootOption {
  docId: string;
  RARITY_CID: number;
  UINT256_CID: number;
  UINT256_CID_array: (number | null)[];
  selectedVal1: number;
  selectedVal2: number;
  boonTypeString: string;
}

export interface RunData {
  _id: string;
  DUNGEON_ID_CID: number;
  userId: string;
  players: Player[];
  lootPhase: boolean;
  version: number;
  lootOptions: LootOption[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Entity {
  _id: string;
  docId: string;
  COMPLETE_CID: boolean;
  LEVEL_CID: number;
  GAME_ITEM_ID_CID_array: any[]; // e.g. [156, 157] to track item IDs
  ID_CID: string;
  PLAYER_CID: string;
  ROOM_NUM_CID: number;
  NOOB_TOKEN_CID: number;
  DUNGEON_ID_CID: number;
  ENEMY_CID: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GameItemBalanceChange {
  id: number;
  amount: number;
}

/**
 * Represents a single game item from /api/indexer/gameitems
 */
export interface GameItemEntity {
  docId: string;
  tableName: string;
  NAME_CID: string;
  createdAt: string;
  updatedAt: string;
  MAX_SUPPLY_CID?: number;
  MINT_COUNT_CID?: number;
  BURN_COUNT_CID?: number;
  IS_SOULBOUND_CID?: boolean;
  OWNER_CID?: string;
  ID_CID?: string; // for docId=0 or docId=1, etc.
  ADDRESS_CID?: string; // contract address if relevant
  CONTRACT_URI_CID?: string;
  BASE_URI_CID?: string;
}

/**
 * Represents a single enemy entity from /api/indexer/enemies
 */
export interface EnemyEntity {
  docId: string; // e.g. "Enemy#1"
  ID_CID: string; // e.g. "1"
  EQUIPMENT_HEAD_CID: number;
  EQUIPMENT_BODY_CID: number;
  NAME_CID: string; // e.g. "Red Robe"
  LOOT_ID_CID: number;
  MOVE_STATS_CID_array: number[]; // e.g. [4,0,0,4,2,2,4,2]
}
