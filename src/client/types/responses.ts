// path: src/client/types/responses.ts

/**
 * Response objects for each endpoint: run data, items, enemies, etc.
 */

import {
  GameItemBalanceChange,
  GameItemEntity,
  EnemyEntity,
  DungeonData,
} from "./game";

export interface BaseResponse {
  success: boolean;
  message: string;
  data: DungeonData;
  actionToken?: string | number;
  gameItemBalanceChanges?: GameItemBalanceChange[];
}

export interface ClaimEnergyResponse {
  success: boolean;
}

export interface GetUserRomsResponse {
  entities: RomEntity[];
}
export interface RomEntity {
  _id: string;
  docId: string;
  tableName: string;
  tableId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  OWNER_CID: string;
  LAST_TRANSFER_TIME_CID?: number;
  INITIALIZED_CID: boolean;
  factoryStats: {
    tier: string;
    memory: string;
    faction: string;
    serialNumber: string;
    shardProductionPerWeek: number;
    dustProductionPerWeek: number;
    maxEnergy: number;
    maxShard: number;
    maxDust: number;
    dustItemId: number;
    shardItemId: number;
    timeSinceLastTransfer: number;
    secondsSinceEpoch: number;
    secondsSinceLastEnergyClaim: number;
    secondsSinceLastShardClaim: number;
    secondsSinceLastDustClaim: number;
    timeSinceLastCollectEnergy: number;
    timeSinceLastCollectShard: number;
    timeSinceLastCollectDust: number;
    percentageOfAWeekSinceLastEnergyClaim: number;
    percentageOfAWeekSinceLastShardClaim: number;
    percentageOfAWeekSinceLastDustClaim: number;
    energyCollectable: number;
    shardCollectable: number;
    dustCollectable: number;
  };
}

export interface GetAllGameItemsResponse {
  entities: GameItemEntity[];
}

export interface GetAllEnemiesResponse {
  entities: EnemyEntity[];
}

export interface GetUserMeResponse {
  address: string;
  canEnterGame: boolean;
}

export interface GetNoobsResponse {
  entities: NoobEntity[];
}
export interface NoobEntity {
  docId: string;
  tableName: string;
  LEVEL_CID: number;
  createdAt: string;
  updatedAt: string;
  IS_NOOB_CID: boolean;
  LAST_TRANSFER_TIME_CID?: number;
  INITIALIZED_CID?: boolean;
  OWNER_CID: string;
}

export interface GetUsernamesResponse {
  entities: UsernameEntity[];
}
export interface UsernameEntity {
  docId: string;
  tableName: string;
  LAST_TRANSFER_TIME_CID?: number;
  createdAt: string;
  updatedAt: string;
  NAME_CID: string;
  OWNER_CID: string;
  INITIALIZED_CID?: boolean;
  IS_GIGA_NAME_CID?: boolean;
}

export interface GetFactionResponse {
  entities: FactionEntity[];
}
export interface FactionEntity {
  _id: string;
  docId: string;
  FACTION_CID: number;
  NOOB_TOKEN_CID: number;
  PLAYER_CID: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetBalancesResponse {
  entities: BalanceEntity[];
}
export interface BalanceEntity {
  _id: string;
  docId: string;
  PLAYER_CID: string;
  ID_CID: string;
  BALANCE_CID: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetSkillsProgressResponse {
  entities: SkillsProgressEntity[];
}
export interface SkillsProgressEntity {
  _id: string;
  docId: string;
  LEVEL_CID: number;
  NOOB_TOKEN_CID: number;
  SKILL_CID: number;
  LEVEL_CID_array?: (number | null)[];
  createdAt: string;
  updatedAt: string;
}

export interface GetConsumablesResponse {
  entities: ConsumableEntity[];
}
export interface ConsumableEntity {
  docId: string;
  tableName: string;
  PLAYER_CID: string;
  ID_CID: string;
  BALANCE_CID: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the skill definitions fetched from /api/offchain/skills
 */
export interface GetAllSkillsResponse {
  entities: SkillDefinition[];
}

export interface SkillDefinition {
  _id: string;
  docId: string; // e.g. "1"
  NAME_CID: string; // e.g. "SKILL#Dungeoneering"
  LEVEL_CID: number; // e.g. 60
  GAME_ITEM_ID_CID: number;
  UINT256_CID: number;
  createdAt: string;
  updatedAt: string;
  stats: SkillStatDefinition[];
}

export interface SkillStatDefinition {
  id: number;
  name: string;
  desc: string;
  levelsPerIncrease: number;
  increaseKey: string; // e.g. "rock", "paper", "scissors", "maxHealth", "maxShield"
  increaseIndex: number; // -1 if not tied to a substat index
  increaseValue: number; // how much each increment adds
}
