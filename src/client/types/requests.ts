// path: src/client/types/requests.ts
/**
 * Request payload definitions for core SDK methods.
 */

export interface ClaimEnergyPayload {
  romId: string;
  claimId: string;
}

export interface StartRunPayload {
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
  dungeonId: number;
  data: any;
}
