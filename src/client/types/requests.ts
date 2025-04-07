// path: src/client/types/requests.ts

/**
 * Request payload definitions for the "SDK" methods.
 */

export interface ClaimEnergyPayload {
  romId: string; // e.g. "1465"
  claimId: string; // e.g. "energy", "shard", "dust"
}

/**
 * For the start_run request,
 * the action is always "start_run", so
 * you only need to pass actionToken, dungeonId, data, etc.
 */
export interface StartRunPayload {
  actionToken: string | number;
  dungeonId: number;
  data: {
    consumables: any[];
    itemId: number;
    index: number;
  };
}

/**
 * For RPS moves, loot picks, item usage, etc.
 * action can be "rock", "paper", "scissor", "loot_one", "loot_two", "use_item", etc.
 */
export interface ActionPayload {
  action: string; // "rock", "paper", "scissor", "loot_x", "use_item", etc.
  actionToken: string | number;
  dungeonId: number;
  data: any; // shape can vary based on the specific action
}
