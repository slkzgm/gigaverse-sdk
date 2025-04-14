// path: src/client/types/game.ts

/**
 * Type definitions for players, runs, equipment, items, etc.
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
  id: string;
  rock: PlayerStats;
  paper: PlayerStats;
  scissor: PlayerStats;
  health: Health;
  shield: Shield;
  equipment: Equipment[];
  lastMove: string;
  thisPlayerWin: boolean;
  otherPlayerWin: boolean;
  _id: string;
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

export interface DungeonData {
  run: RunData | null;
  entity: Entity | null;
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
  GAME_ITEM_ID_CID_array: any[];
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
  ID_CID?: string;
  ADDRESS_CID?: string;
  CONTRACT_URI_CID?: string;
  BASE_URI_CID?: string;
}

export interface EnemyEntity {
  docId: string;
  ID_CID: string;
  EQUIPMENT_HEAD_CID: number;
  EQUIPMENT_BODY_CID: number;
  NAME_CID: string;
  LOOT_ID_CID: number;
  MOVE_STATS_CID_array: number[];
}
