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

export interface GetEnergyResponse {
  entities: EnergyEntity[];
}
export interface EnergyEntity {
  docId: string;
  createdAt: string;
  updatedAt: string;
  ENERGY_CID: number;
  TIMESTAMP_CID: number;
  parsedData: EnergyParsedData;
}
export interface EnergyParsedData {
  energy: number;
  energyValue: number;
  maxEnergy: number;
  regenPerSecond: number;
  regenPerHour: number;
  secondsSinceLastUpdate: number;
  isPlayerJuiced: boolean;
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

export interface GetJuiceStateResponse {
  juiceData: JuiceDataEntity;
  purchases: JuicePurchaseEntity[];
  referrals: any[];
  listings: JuiceListingEntity[];
}
export interface JuiceDataEntity {
  _id: string;
  docId: string;
  tableName: string;
  TIMESTAMP_CID: number;
  createdAt: string;
  updatedAt: string;
  isJuiced: boolean;
  juicedSeconds: number;
}
export interface JuicePurchaseEntity {
  _id: string;
  docId: string;
  tableName: string;
  TIMESTAMP_CID: number;
  createdAt: string;
  updatedAt: string;
  ID_CID: string;
  PLAYER_CID: string;
  ETH_MINT_PRICE_CID: number;
  UINT256_CID: number;
  analyticsProcessed: boolean;
  importProcessed: boolean;
  importProcessedAt: string;
  NAME_CID: string;
  LOOT_ID_CID_array: number[];
  LOOT_AMOUNT_CID_array: number[];
}
export interface JuiceListingEntity {
  _id: string;
  docId: string;
  tableName: string;
  ETH_MINT_PRICE_CID: number;
  createdAt: string;
  updatedAt: string;
  TIME_BETWEEN_CID: number;
  NAME_CID: string;
  LOOT_ID_CID_array: number[];
  LOOT_AMOUNT_CID_array: number[];
  START_TIMESTAMP_CID: number;
  END_TIMESTAMP_CID: number;
  OFFERING_NAME: string;
}

export interface GetOffchainStaticResponse {
  constants: OffchainConstants;
  enemies: EnemyEntity[]; // We reuse existing EnemyEntity
  recipes: RecipeEntity[];
  gameItems: OffchainGameItemEntity[];
  checkpoints: CheckpointEntity[];
}

export interface OffchainConstants {
  minTimeBetweenImports: number;
  minTimeBetweenExports: number;
  maxEnergy: number;
  energyRegenRate: number;
  maxEnergyJuiced: number;
  regenRateJuiced: number;
  dungeonEnergyCost: number;
}

export interface RecipeEntity {
  docId: string;
  ID_CID: string;
  NAME_CID: string;
  FACTION_CID_array?: number[];
  GEAR_TYPE_CID: number;
  DURABILITY_CID: number;
  TIER_CID: number;
  UINT256_CID: number;
  INPUT_NAMES_CID_array: string[];
  INPUT_ID_CID_array: number[];
  INPUT_AMOUNT_CID_array: number[];
  LOOT_ID_CID_array: number[];
  LOOT_AMOUNT_CID_array: number[];
  LOOT_FULFILLER_ID_CID_array: string[];
  TIME_BETWEEN_CID: number;
  TAG_CID_array?: string[];
  SUCCESS_RATE_CID: number;
  COOLDOWN_CID: number;
  MAX_COMPLETIONS_CID: number;
  ENERGY_CID: number;
}

export interface OffchainGameItemEntity {
  ID_CID: number;
  docId: string;
  NAME_CID: string;
  DESCRIPTION_CID?: string;
  RARITY_CID?: number;
  RARITY_NAME?: string;
  IMG_URL_CID?: string;
  ICON_URL_CID?: string;
  TYPE_CID?: string;
  SPRITE_SHEET_URL_CID?: string;
}

export interface CheckpointEntity {
  docId: string;
  ID_CID: string;
  NAME_CID: string;
  DESCRIPTION_CID: string;
  INPUT_ID_CID_array: number[];
  INPUT_AMOUNT_CID_array: number[];
  UINT256_CID_array: number[];
  MAX_COMPLETIONS_CID: number;
}

export interface GetDungeonTodayResponse {
  dayProgressEntities: DayProgressEntity[];
  dungeonDataEntities: TodayDungeonDataEntity[];
}
export interface DayProgressEntity {
  _id: string;
  docId: string;
  UINT256_CID: number;
  ID_CID: string; // e.g. "1", "3"
  TIMESTAMP_CID: number; // e.g. 20214
  PLAYER_CID: string;
  DOC_TYPE_CID: string; // e.g. "DayCount"
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface TodayDungeonDataEntity {
  ID_CID: number; // e.g. 1, 2, 3
  NAME_CID: string; // e.g. "Dungetron 5000"
  ENERGY_CID: number; // e.g. 40
  UINT256_CID: number; // e.g. 10
  CHECKPOINT_CID: number; // e.g. -1
  juicedMaxRunsPerDay: number; // e.g. 12
}

export interface LevelUpSkillResponse {
  success: boolean;
  message: string;
  data: SkillsProgressEntity;
}

export interface GetAccountResponse {
  accountEntity: AccountEntity;
  usernames: UsernameEntity[];
  noob: NoobEntity | null;
  checkpointProgress: CheckpointProgressEntity[];
}
export interface AccountEntity {
  _id: string;
  docId: string;
  tableName: string; // e.g. "AccountSystem"
  NOOB_TOKEN_CID?: number;
  createdAt: string;
  updatedAt: string;
  GIGA_NAME_TOKENDID_CID?: string; // e.g. "3101953415271485..."
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
export interface CheckpointProgressEntity {
  _id: string;
  docId: string; // e.g. "CHECKPOINT_PROGRESS#..."
  COMPLETE_CID: boolean;
  COMPLETIONS_CID: number;
  ID_CID: string; // ID of the checkpoint
  PLAYER_CID: string; // e.g. "0x700d7b774f5af65d..."
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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
