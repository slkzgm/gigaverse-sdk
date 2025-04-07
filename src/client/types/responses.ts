// path: src/client/types/responses.ts

import {
  Entity,
  RunData,
  GameItemBalanceChange,
  GameItemEntity,
  EnemyEntity,
} from "./game";

/**
 * Common base for response objects.
 * Some fields (like `data`) vary depending on the operation.
 */
export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  actionToken?: string | number;
  gameItemBalanceChanges?: GameItemBalanceChange[];
}

/**
 * Claim Energy
 */
export interface ClaimEnergyResponse {
  success: boolean;
}

/**
 * Start Run
 */
export interface StartRunResponseData {
  run: RunData;
  entity: Entity;
}
export type StartRunResponse = BaseResponse<StartRunResponseData>;

/**
 * Any typical "action" in the run, e.g. RPS, loot, end-of-room, or item usage.
 */
export interface ActionResponseData {
  run: RunData;
  entity: Entity;
}
export type ActionResponse = BaseResponse<ActionResponseData>;

/**
 * /api/roms/player/:address
 */
export interface GetUserRomsResponse {
  entities: RomEntity[];
}

/**
 * A single ROM from "entities"
 */
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

/**
 * /api/game/dungeon/state
 */
export interface GetDungeonStateResponse {
  success: boolean;
  message: string;
  data: {
    run: RunData | null;
    entity: Entity | null;
  };
}

/**
 * All game items from /api/indexer/gameitems
 */
export interface GetAllGameItemsResponse {
  entities: GameItemEntity[];
}

/**
 * All enemies from /api/indexer/enemies
 */
export interface GetAllEnemiesResponse {
  entities: EnemyEntity[];
}
