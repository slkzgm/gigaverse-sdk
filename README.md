# Gigaverse SDK

A TypeScript SDK for interacting with the Gigaverse game API.

## Installation

```bash
npm install gigaverse-sdk
# or
yarn add gigaverse-sdk
# or
pnpm add gigaverse-sdk
```

## Usage

```typescript
import { GameClient } from "gigaverse-sdk";

// Initialize the client with your API base URL and auth token
const client = new GameClient("https://api.gigaverse.com", "your-auth-token");

// Example: Start a new run
async function startGameRun() {
  try {
    // Claim energy if needed
    await client.claimEnergy({
      romId: "1465",
      claimId: "energy",
    });

    // Start a run
    const runResponse = await client.startRun({
      actionToken: "initial-token",
      dungeonId: 1,
      data: {
        consumables: [],
        itemId: 123,
        index: 0,
      },
    });

    console.log("Run started successfully:", runResponse.data.run);

    // Make a move
    const moveResponse = await client.playMove({
      action: "rock",
      actionToken: client.getActionToken(),
      dungeonId: 1,
      data: {},
    });

    console.log("Move result:", moveResponse.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

startGameRun();
```

## API Reference

### GameClient

The main client for interacting with the Gigaverse API.

#### Constructor

```typescript
new GameClient(baseUrl: string, authToken: string)
```

#### Methods

- `setAuthToken(newToken: string): void` - Update the authentication token
- `getActionToken(): string | number | null` - Get the current action token
- `setActionToken(token: string | number): void` - Set the current action token
- `claimEnergy(payload: ClaimEnergyPayload): Promise<ClaimEnergyResponse>` - Claim energy
- `startRun(payload: StartRunPayload): Promise<StartRunResponse>` - Start a new run
- `playMove(payload: ActionPayload): Promise<ActionResponse>` - Make a move in the current run

## Types

The SDK includes TypeScript definitions for all request and response types.

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Lint
pnpm lint

# Format code
pnpm format
```

## License

MIT
