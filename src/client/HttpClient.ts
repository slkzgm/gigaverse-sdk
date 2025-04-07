// path: src/client/HttpClient.ts

import { logger } from "../utils/logger";

/**
 * Simple abstraction over fetch-based requests.
 * We store baseUrl and authToken so you can re-use this client easily.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  public setAuthToken(newToken: string) {
    this.authToken = newToken;
  }

  /**
   * POST request wrapper:
   * - logs request
   * - handles JSON parse & error
   * - returns typed response data
   */
  public async post<T>(
    endpoint: string,
    body: Record<string, any>
  ): Promise<T> {
    logger.info(`POST -> ${endpoint}`);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        Accept: "*/*",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(`HTTP error ${response.status}: ${errorBody}`);
      throw new Error(`POST ${endpoint} failed -> ${response.status}`);
    }

    const data = (await response.json()) as T;
    return data;
  }

  /**
   * GET request wrapper:
   * - logs request
   * - handles JSON parse & error
   * - returns typed response data
   */
  public async get<T>(endpoint: string): Promise<T> {
    logger.info(`GET -> ${endpoint}`);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(`HTTP error ${response.status}: ${errorBody}`);
      throw new Error(`GET ${endpoint} failed -> ${response.status}`);
    }

    const data = (await response.json()) as T;
    return data;
  }
}
