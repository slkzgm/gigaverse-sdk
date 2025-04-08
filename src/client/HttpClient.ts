// path: src/client/HttpClient.ts

import { logger } from "../utils/logger";

/**
 * Minimal HTTP client that wraps fetch calls with logging.
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
   * Sends a POST request with the current auth token.
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

    return (await response.json()) as T;
  }

  /**
   * Sends a GET request with the current auth token.
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

    return (await response.json()) as T;
  }
}
