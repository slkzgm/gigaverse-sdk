// path: src/client/GameClient.ts

import { HttpClient } from "./HttpClient";
import { logger } from "../utils/logger";

import {
  ActionPayload,
  ClaimEnergyPayload,
  StartRunPayload,
} from "./types/requests";

import {
  ClaimEnergyResponse,
  GetAllEnemiesResponse,
  GetAllGameItemsResponse,
  GetEnergyResponse,
  GetUserRomsResponse,
  GetUserMeResponse,
  GetNoobsResponse,
  GetUsernamesResponse,
  GetFactionResponse,
  GetBalancesResponse,
  GetSkillsProgressResponse,
  GetConsumablesResponse,
  GetAllSkillsResponse,
  BaseResponse,
  GetJuiceStateResponse,
} from "./types/responses";

export class GameClient {
  private httpClient: HttpClient;

  constructor(baseUrl: string, authToken: string) {
    this.httpClient = new HttpClient(baseUrl, authToken);
  }

  public setAuthToken(newToken: string) {
    this.httpClient.setAuthToken(newToken);
  }

  /**
   * Claims a resource like "energy", "shard", or "dust".
   */
  public async claimEnergy(
    payload: ClaimEnergyPayload
  ): Promise<ClaimEnergyResponse> {
    logger.info("Claiming resource...");
    const endpoint = "/api/roms/factory/claim";
    const response = await this.httpClient.post<ClaimEnergyResponse>(
      endpoint,
      payload
    );
    logger.info(`Claim result => success: ${response.success}`);
    return response;
  }

  /**
   * Starts a dungeon run.
   */
  public async startRun(payload: StartRunPayload): Promise<BaseResponse> {
    logger.info("Starting dungeon run...");
    const endpoint = "/api/game/dungeon/action";

    const body = {
      action: "start_run",
      actionToken: Date.now().toString(),
      dungeonId: payload.dungeonId,
      data: payload.data,
    };

    return this.httpClient.post<BaseResponse>(endpoint, body);
  }

  /**
   * Performs a move or loot action (e.g. "rock", "paper", "scissor", "loot_one").
   */
  public async playMove(payload: ActionPayload): Promise<BaseResponse> {
    logger.info(`Performing action: ${payload.action}`);
    const endpoint = "/api/game/dungeon/action";

    const body = {
      action: payload.action,
      actionToken: Date.now().toString(),
      dungeonId: payload.dungeonId,
      data: payload.data,
    };

    const response = await this.httpClient.post<BaseResponse>(endpoint, body);

    if (response.gameItemBalanceChanges?.length) {
      logger.info(
        `gameItemBalanceChanges: ${JSON.stringify(response.gameItemBalanceChanges)}`
      );
    }
    return response;
  }

  /**
   * Uses an item (e.g. "use_item" action with itemId, index).
   */
  public async useItem(payload: ActionPayload): Promise<BaseResponse> {
    logger.info(`Using item. ID: ${payload.data?.itemId}`);
    const endpoint = "/api/game/dungeon/action";

    const body = {
      action: "use_item",
      actionToken: Date.now().toString(),
      dungeonId: payload.dungeonId,
      data: payload.data,
    };

    const response = await this.httpClient.post<BaseResponse>(endpoint, body);

    if (response.gameItemBalanceChanges?.length) {
      logger.info(
        `gameItemBalanceChanges: ${JSON.stringify(response.gameItemBalanceChanges)}`
      );
    }
    return response;
  }

  /**
   * Retrieves all ROMs associated with the given address.
   */
  public async getUserRoms(address: string): Promise<GetUserRomsResponse> {
    logger.info(`Fetching user ROMs for address: ${address}`);
    const endpoint = `/api/roms/player/${address}`;
    return this.httpClient.get<GetUserRomsResponse>(endpoint);
  }

  /**
   * Fetches the current dungeon state. If run=null, not in a run.
   */
  public async fetchDungeonState(): Promise<BaseResponse> {
    logger.info("Fetching dungeon state...");
    const endpoint = "/api/game/dungeon/state";
    return this.httpClient.get<BaseResponse>(endpoint);
  }

  /**
   * Retrieves all available game items from the indexer.
   */
  public async getAllGameItems(): Promise<GetAllGameItemsResponse> {
    logger.info("Fetching all game items...");
    const endpoint = "/api/indexer/gameitems";
    return this.httpClient.get<GetAllGameItemsResponse>(endpoint);
  }

  /**
   * Retrieves all enemies from the indexer.
   */
  public async getAllEnemies(): Promise<GetAllEnemiesResponse> {
    logger.info("Fetching enemies...");
    const endpoint = "/api/indexer/enemies";
    return this.httpClient.get<GetAllEnemiesResponse>(endpoint);
  }

  /**
   * Retrieves the wallet address and a flag indicating if the user can enter the game.
   */
  public async getUserMe(): Promise<GetUserMeResponse> {
    logger.info("Fetching /api/user/me");
    const endpoint = "/api/user/me";
    return this.httpClient.get<GetUserMeResponse>(endpoint);
  }

  /**
   * Retrieves all 'noob' heroes for the given address.
   */
  public async getNoobs(address: string): Promise<GetNoobsResponse> {
    logger.info(`Fetching noobs for: ${address}`);
    const endpoint = `/api/indexer/player/noobs/${address}`;
    return this.httpClient.get<GetNoobsResponse>(endpoint);
  }

  /**
   * Retrieves all usernames (GigaName NFTs) for the given address.
   */
  public async getUsernames(address: string): Promise<GetUsernamesResponse> {
    logger.info(`Fetching usernames for: ${address}`);
    const endpoint = `/api/indexer/player/usernames/${address}`;
    return this.httpClient.get<GetUsernamesResponse>(endpoint);
  }

  public async getEnergy(address: string): Promise<GetEnergyResponse> {
    logger.info(`Fetching energy for: ${address}`);
    const endpoint = `/api/offchain/player/energy/${address}`;
    return this.httpClient.get<GetEnergyResponse>(endpoint);
  }

  public async getJuiceState(address: string): Promise<GetJuiceStateResponse> {
    logger.info(`Fetching juice state for: ${address}`);
    const endpoint = `/api/gigajuice/player/${address}`;
    return this.httpClient.get<GetJuiceStateResponse>(endpoint);
  }

  /**
   * Retrieves faction info (e.g. faction ID) for the given address.
   */
  public async getFaction(address: string): Promise<GetFactionResponse> {
    logger.info(`Fetching faction for: ${address}`);
    const endpoint = `/api/factions/player/${address}`;
    return this.httpClient.get<GetFactionResponse>(endpoint);
  }

  /**
   * Retrieves balances of various items for the given address.
   */
  public async getUserBalances(address: string): Promise<GetBalancesResponse> {
    logger.info(`Fetching user balances for: ${address}`);
    const endpoint = `/api/importexport/balances/${address}`;
    return this.httpClient.get<GetBalancesResponse>(endpoint);
  }

  /**
   * Retrieves hero's skill progress and level, given a noobId.
   */
  public async getHeroSkillsProgress(
    noobId: string | number
  ): Promise<GetSkillsProgressResponse> {
    logger.info(`Fetching skill progress for noobId: ${noobId}`);
    const endpoint = `/api/offchain/skills/progress/${noobId}`;
    return this.httpClient.get<GetSkillsProgressResponse>(endpoint);
  }

  /**
   * Retrieves consumable items the user holds, from the indexer.
   */
  public async getConsumables(
    address: string
  ): Promise<GetConsumablesResponse> {
    logger.info(`Fetching consumables for: ${address}`);
    const endpoint = `/api/indexer/player/gameitems/${address}`;
    return this.httpClient.get<GetConsumablesResponse>(endpoint);
  }

  /**
   * Retrieves global skill definitions from /api/offchain/skills.
   */
  public async getAllSkills(): Promise<GetAllSkillsResponse> {
    logger.info("Fetching skill definitions...");
    const endpoint = "/api/offchain/skills";
    return this.httpClient.get<GetAllSkillsResponse>(endpoint);
  }
}
