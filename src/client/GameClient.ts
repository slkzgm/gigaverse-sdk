// path: src/client/GameClient.ts

import { HttpClient } from "./HttpClient";
import { logger } from "../utils/logger";

// Request payloads
import {
  ActionPayload,
  ClaimEnergyPayload,
  StartRunPayload,
} from "./types/requests";

// Response payloads
import {
  ActionResponse,
  ActionResponseData,
  ClaimEnergyResponse,
  GetAllEnemiesResponse,
  GetAllGameItemsResponse,
  GetDungeonStateResponse,
  GetUserRomsResponse,
  StartRunResponse,
} from "./types/responses";

/**
 * The GameClient class is our main "SDK" interface.
 * It exposes methods for each game action, ensuring consistent usage.
 */
export class GameClient {
  private httpClient: HttpClient;
  private currentActionToken: string | number | null = null;

  constructor(baseUrl: string, authToken: string) {
    this.httpClient = new HttpClient(baseUrl, authToken);
  }

  // --- Utilities / State Management ---

  public setAuthToken(newToken: string) {
    this.httpClient.setAuthToken(newToken);
  }

  public getActionToken(): string | number | null {
    return this.currentActionToken;
  }

  public setActionToken(token: string | number) {
    this.currentActionToken = token;
  }

  // ---------------------------------------------------------
  //                 Existing Methods
  // ---------------------------------------------------------

  /**
   * Claim energy/shard/dust if necessary to start a new run or gather resources.
   * E.g., payload.claimId = "energy" / "shard" / "dust"
   */
  public async claimEnergy(
    payload: ClaimEnergyPayload
  ): Promise<ClaimEnergyResponse> {
    logger.info("Attempting to claim resource...");
    const endpoint = "/api/roms/factory/claim";

    const response = await this.httpClient.post<ClaimEnergyResponse>(
      endpoint,
      payload
    );
    logger.info(`Claim response => success: ${response.success}`);
    return response;
  }

  /**
   * Start a run. We'll automatically store the returned actionToken.
   */
  public async startRun(payload: StartRunPayload): Promise<StartRunResponse> {
    logger.info("Starting dungeon run...");
    const endpoint = "/api/game/dungeon/action";

    // The backend expects "action":"start_run"
    const body = {
      action: "start_run",
      actionToken: payload.actionToken,
      dungeonId: payload.dungeonId,
      data: payload.data,
    };

    const response = await this.httpClient.post<StartRunResponse>(
      endpoint,
      body
    );

    if (response.actionToken) {
      this.setActionToken(response.actionToken);
      logger.info(`Updated action token -> ${response.actionToken}`);
    }
    return response;
  }

  /**
   * Perform an action (rock/paper/scissor/loot_x/etc.) in the run loop.
   * Also can contain gameItemBalanceChanges in the response for drops.
   */
  public async playMove(payload: ActionPayload): Promise<ActionResponse> {
    logger.info(`Performing action -> ${payload.action}`);
    const endpoint = "/api/game/dungeon/action";

    const finalActionToken = payload.actionToken ?? this.getActionToken() ?? "";
    const body = {
      action: payload.action,
      actionToken: finalActionToken,
      dungeonId: payload.dungeonId,
      data: payload.data,
    };

    const response = await this.httpClient.post<ActionResponse>(endpoint, body);

    if (response.actionToken) {
      this.setActionToken(response.actionToken);
      logger.info(`New action token -> ${response.actionToken}`);
    }
    if (
      response.gameItemBalanceChanges &&
      response.gameItemBalanceChanges.length > 0
    ) {
      logger.info(
        `gameItemBalanceChanges => ${JSON.stringify(response.gameItemBalanceChanges)}`
      );
    }

    return response;
  }

  /**
   * Shortcut for using an item (e.g., "use_item" action),
   * which typically includes data.itemId and data.index.
   *
   * For example:
   *   useItem({
   *     actionToken: 1744022175757,
   *     dungeonId: 0,
   *     data: { itemId: 157, index: 1 }
   *   });
   */
  public async useItem(payload: ActionPayload): Promise<ActionResponse> {
    logger.info(`Using item -> itemId: ${payload.data?.itemId}`);
    const endpoint = "/api/game/dungeon/action";

    const finalActionToken = payload.actionToken ?? this.getActionToken() ?? "";
    const body = {
      action: "use_item",
      actionToken: finalActionToken,
      dungeonId: payload.dungeonId,
      data: payload.data, // { itemId, index, consumables? etc. }
    };

    const response = await this.httpClient.post<ActionResponse>(endpoint, body);

    if (response.actionToken) {
      this.setActionToken(response.actionToken);
      logger.info(`Updated action token -> ${response.actionToken}`);
    }
    if (
      response.gameItemBalanceChanges &&
      response.gameItemBalanceChanges.length > 0
    ) {
      logger.info(
        `gameItemBalanceChanges => ${JSON.stringify(response.gameItemBalanceChanges)}`
      );
    }

    return response;
  }

  /**
   * Get the user's ROMs, which can show energy/dust/shard stats.
   */
  public async getUserRoms(address: string): Promise<GetUserRomsResponse> {
    logger.info(`Fetching ROMs for address: ${address}`);
    const endpoint = `/api/roms/player/${address}`;
    return await this.httpClient.get<GetUserRomsResponse>(endpoint);
  }

  /**
   * Fetch the current dungeon state. If "run" is null, user is not in a run.
   */
  public async fetchDungeonState(): Promise<GetDungeonStateResponse> {
    logger.info("Fetching current dungeon state...");
    const endpoint = "/api/game/dungeon/state";
    return await this.httpClient.get<GetDungeonStateResponse>(endpoint);
  }

  /**
   * Fetch all game items from /api/indexer/gameitems.
   * This helps to display the docId -> itemName mapping,
   * e.g. docId=157 => "Mid Armor Juice".
   */
  public async getAllGameItems(): Promise<GetAllGameItemsResponse> {
    logger.info("Fetching all game items...");
    const endpoint = "/api/indexer/gameitems";
    return await this.httpClient.get<GetAllGameItemsResponse>(endpoint);
  }

  /**
   * Fetch all enemies from /api/indexer/enemies.
   * For potential reference or display. E.g. "Enemy#5 => Paladin"
   */
  public async getAllEnemies(): Promise<GetAllEnemiesResponse> {
    logger.info("Fetching all enemies...");
    const endpoint = "/api/indexer/enemies";
    return await this.httpClient.get<GetAllEnemiesResponse>(endpoint);
  }
}
