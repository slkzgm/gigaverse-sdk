// path: src/client/types/requests.ts

/**
 * Request payload definitions for core SDK methods.
 */

export interface ClaimEnergyPayload {
  romId: string;
  claimId: string;
}

export interface StartRunPayload {
  actionToken: string | number;
  dungeonId: number;
  data: {
    isJuiced: boolean;
    consumables: any[];
    itemId: number;
    index: number;
  };
}

export interface ActionPayload {
  action: string;
  actionToken: string | number;
  dungeonId: number;
  data: any;
}
