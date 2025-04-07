// path: src/simulator/ExtendedRpsSimulator.ts

import { logger } from "../utils/logger";
import {
  Player,
  LootOption,
  EnemyEntity,
  PlayerStats,
} from "../client/types/game";

/**
 * Enum for RPS moves.
 */
export enum RpsMove {
  ROCK = "rock",
  PAPER = "paper",
  SCISSOR = "scissor",
}

/**
 * Example consumable item shape.
 */
export interface ConsumableItem {
  name: string; // e.g. "heal", "damage"
  level: number; // 1,2,3
  quantity: number;
}

/**
 * Config for one simulation run.
 */
export interface SimulationRunConfig {
  player: Player;
  enemies: EnemyEntity[];
  availableConsumables: ConsumableItem[];
  lootPool: LootOption[];
  lootProbaFn?: (loot: LootOption) => number;
  randomSeed?: number;
  maxEnemiesToFight?: number;
}

/**
 * A single-run result
 */
export interface SimulationResult {
  enemiesDefeated: number;
  survived: boolean;
  finalPlayerStats: Player;
  usedConsumables: string[];
  lootPickedLog: LootOption[];
}

/**
 * The main simulator class with:
 *  - `simulateRun` (detailed logs)
 *  - `simulateRunNoLogs` (no logs)
 *  - `simulateMultipleRuns(config, runsCount, detailed)`
 * And all helpers: pickRandomMove, getHealAmount, updateCharges, etc.
 */
export class ExtendedRpsSimulator {
  constructor() {
    // Optionally inject a seeded RNG or other dependencies.
  }

  /**
   * Single-run with detailed logs of each step.
   */
  public simulateRun(config: SimulationRunConfig): SimulationResult {
    const enemiesAsPlayers = config.enemies.map((enemy) =>
      this.convertEnemyToPlayer(enemy)
    );
    const playerClone = this.clonePlayer(config.player);

    const usedConsumables: string[] = [];
    const lootPickedLog: LootOption[] = [];
    const randomFn = () => Math.random();

    const limit = config.maxEnemiesToFight
      ? Math.min(config.maxEnemiesToFight, enemiesAsPlayers.length)
      : enemiesAsPlayers.length;

    let enemiesDefeated = 0;

    for (let i = 0; i < limit; i++) {
      const enemy = enemiesAsPlayers[i];
      logger.separator();
      logger.info(`BATTLE #${i + 1} vs ${enemy.id}`);

      this.logPlayerOverview("Player", playerClone);
      this.logPlayerOverview(`Enemy #${i + 1}`, enemy);

      const playerWon = this.simulateBattle(
        playerClone,
        enemy,
        config.availableConsumables,
        usedConsumables,
        randomFn
      );
      if (!playerWon) {
        logger.warn(`Player was defeated by enemy #${i + 1}.`);
        return {
          enemiesDefeated,
          survived: false,
          finalPlayerStats: playerClone,
          usedConsumables,
          lootPickedLog,
        };
      }
      enemiesDefeated++;

      // Loot only if there's another enemy upcoming
      if (i < limit - 1) {
        logger.info(`Victory in BATTLE #${i + 1}, picking loot...`);
        const chosenLoot = this.simulateLootPhase(
          playerClone,
          config.lootPool,
          randomFn,
          config.lootProbaFn
        );
        if (chosenLoot) lootPickedLog.push(chosenLoot);
      }
    }

    logger.newline();
    logger.success(
      `Run complete: Player survived all ${enemiesDefeated}/${limit} battles.`
    );

    return {
      enemiesDefeated,
      survived: true,
      finalPlayerStats: playerClone,
      usedConsumables,
      lootPickedLog,
    };
  }

  /**
   * Multiple runs with optional detail. If `detailed=false`, no logs per run.
   */
  public simulateMultipleRuns(
    config: SimulationRunConfig,
    runsCount: number,
    detailed = true
  ): void {
    let totalEnemiesDefeated = 0;
    let survivedCount = 0;

    for (let i = 0; i < runsCount; i++) {
      if (detailed) {
        logger.separator();
        logger.info(`SIM RUN #${i + 1}`);
      }
      const result = detailed
        ? this.simulateRun(config)
        : this.simulateRunNoLogs(config);

      totalEnemiesDefeated += result.enemiesDefeated;
      if (result.survived) {
        survivedCount++;
      }
    }

    logger.separator();
    const avg = totalEnemiesDefeated / runsCount;
    const survivalRate = ((survivedCount / runsCount) * 100).toFixed(2);

    // Summarize in a table
    logger.table(
      ["Runs", "Avg Enemies Defeated", "Survival %"],
      [[runsCount, avg.toFixed(2), survivalRate]]
    );
  }

  /**
   * Silent version of a single run => calls sub methods with zero logs.
   */
  private simulateRunNoLogs(config: SimulationRunConfig): SimulationResult {
    const enemiesAsPlayers = config.enemies.map((enemy) =>
      this.convertEnemyToPlayer(enemy)
    );
    const playerClone = this.clonePlayer(config.player);

    const usedConsumables: string[] = [];
    const lootPickedLog: LootOption[] = [];
    const randomFn = () => Math.random();

    const limit = config.maxEnemiesToFight
      ? Math.min(config.maxEnemiesToFight, enemiesAsPlayers.length)
      : enemiesAsPlayers.length;

    let enemiesDefeated = 0;

    for (let i = 0; i < limit; i++) {
      const enemy = enemiesAsPlayers[i];
      const playerWon = this.simulateBattleNoLogs(
        playerClone,
        enemy,
        config.availableConsumables,
        usedConsumables,
        randomFn
      );
      if (!playerWon) {
        return {
          enemiesDefeated,
          survived: false,
          finalPlayerStats: playerClone,
          usedConsumables,
          lootPickedLog,
        };
      }
      enemiesDefeated++;

      if (i < limit - 1) {
        const chosenLoot = this.simulateLootPhaseNoLogs(
          playerClone,
          config.lootPool,
          randomFn,
          config.lootProbaFn
        );
        if (chosenLoot) lootPickedLog.push(chosenLoot);
      }
    }

    return {
      enemiesDefeated,
      survived: true,
      finalPlayerStats: playerClone,
      usedConsumables,
      lootPickedLog,
    };
  }

  /**
   * A single battle with logs, printing HP/Shield each round and the chosen moves.
   */
  private simulateBattle(
    player: Player,
    enemy: Player,
    consumables: ConsumableItem[],
    usedConsumablesLog: string[],
    randomFn: () => number
  ): boolean {
    let roundCount = 0;

    while (player.health.current > 0 && enemy.health.current > 0) {
      roundCount++;
      logger.newline();
      logger.info(
        `[Round #${roundCount}] Player HP=${player.health.current}, Shield=${player.shield.current} | ` +
          `Enemy HP=${enemy.health.current}, Shield=${enemy.shield.current}`
      );

      const playerMove = this.pickRandomMove(player, randomFn);
      const enemyMove = this.pickRandomMove(enemy, randomFn);

      // gather stats for logs
      const pStats = this.getMoveStats(player, playerMove);
      const eStats = this.getMoveStats(enemy, enemyMove);

      const moveLog = `${this.moveLabel(playerMove, pStats)} vs. ${this.moveLabel(
        enemyMove,
        eStats
      )}`;
      logger.info(`Moves => ${moveLog}`);

      // Possibly use a consumable item
      this.maybeUseConsumable(player, consumables, usedConsumablesLog);

      // Compute outcome with real (ATK,DEF) from each side
      const outcome = this.computeRoundOutcome(
        player,
        enemy,
        playerMove,
        enemyMove
      );

      // Player => Enemy
      this.applyDamageAndShield(
        outcome.dmgToEnemy,
        outcome.shieldGainPlayer,
        player,
        enemy
      );
      // Enemy => Player
      this.applyDamageAndShield(
        outcome.dmgToPlayer,
        outcome.shieldGainEnemy,
        enemy,
        player
      );

      // Update charges / spam penalty
      this.updateCharges(player, playerMove);
      this.updateCharges(enemy, enemyMove);

      // Check HP
      if (player.health.current <= 0) {
        logger.warn(`Player HP dropped to 0 => death.`);
        return false;
      }
      if (enemy.health.current <= 0) {
        logger.info(`Enemy HP 0 => victory this battle!`);
        return true;
      }
    }

    return player.health.current > 0;
  }

  /**
   * A single battle with no logs. Returns true if player wins.
   */
  private simulateBattleNoLogs(
    player: Player,
    enemy: Player,
    consumables: ConsumableItem[],
    usedLog: string[],
    randomFn: () => number
  ): boolean {
    while (player.health.current > 0 && enemy.health.current > 0) {
      const playerMove = this.pickRandomMove(player, randomFn);
      const enemyMove = this.pickRandomMove(enemy, randomFn);

      this.maybeUseConsumableNoLogs(player, consumables, usedLog);

      // We compute the real outcome
      const outcome = this.computeRoundOutcome(
        player,
        enemy,
        playerMove,
        enemyMove
      );

      this.applyDamageAndShield(
        outcome.dmgToEnemy,
        outcome.shieldGainPlayer,
        player,
        enemy
      );
      this.applyDamageAndShield(
        outcome.dmgToPlayer,
        outcome.shieldGainEnemy,
        enemy,
        player
      );

      this.updateCharges(player, playerMove);
      this.updateCharges(enemy, enemyMove);

      if (player.health.current <= 0) return false;
      if (enemy.health.current <= 0) return true;
    }
    return player.health.current > 0;
  }

  /**
   * Loot phase with logs. Picks 3 items from the loot pool (weighted), chooses one, applies it.
   */
  private simulateLootPhase(
    player: Player,
    lootPool: LootOption[],
    randomFn: () => number,
    lootProbaFn?: (loot: LootOption) => number
  ): LootOption | null {
    if (!lootPool.length) return null;
    const proposed = this.pickRandomLoots(lootPool, 3, randomFn, lootProbaFn);
    if (!proposed.length) return null;

    const idx = Math.floor(randomFn() * proposed.length);
    const chosen = proposed[idx];

    logger.info(
      `Chosen loot => ${chosen.boonTypeString} +${chosen.selectedVal1}|${chosen.selectedVal2}`
    );
    this.applyLootEffect(player, chosen);
    return chosen;
  }

  /**
   * Loot phase with no logs.
   */
  private simulateLootPhaseNoLogs(
    player: Player,
    lootPool: LootOption[],
    randomFn: () => number,
    lootProbaFn?: (loot: LootOption) => number
  ): LootOption | null {
    if (!lootPool.length) return null;
    const proposed = this.pickRandomLoots(lootPool, 3, randomFn, lootProbaFn);
    if (!proposed.length) return null;

    const idx = Math.floor(randomFn() * proposed.length);
    const chosen = proposed[idx];

    this.applyLootEffectNoLogs(player, chosen);
    return chosen;
  }

  /**
   * Weighted pick of loot among the pool, returning up to `count` results.
   */
  private pickRandomLoots(
    lootPool: LootOption[],
    count: number,
    randomFn: () => number,
    lootProbaFn?: (loot: LootOption) => number
  ): LootOption[] {
    if (!lootPool.length) return [];

    const weighted = lootPool.map((l) => ({
      loot: l,
      weight: lootProbaFn ? lootProbaFn(l) : 1,
    }));

    const results: LootOption[] = [];
    const poolCopy = [...weighted];

    for (let i = 0; i < count && poolCopy.length > 0; i++) {
      const total = poolCopy.reduce((acc, x) => acc + x.weight, 0);
      const r = randomFn() * total;

      let pickIndex = 0;
      let running = 0;
      for (let j = 0; j < poolCopy.length; j++) {
        running += poolCopy[j].weight;
        if (r <= running) {
          pickIndex = j;
          break;
        }
      }
      results.push(poolCopy[pickIndex].loot);
      poolCopy.splice(pickIndex, 1);
    }
    return results;
  }

  /**
   * Actually apply the chosen loot effect, with logs.
   */
  private applyLootEffect(player: Player, loot: LootOption) {
    const boon = loot.boonTypeString;
    const v1 = loot.selectedVal1;
    const v2 = loot.selectedVal2;

    logger.info(`Applying boon: ${boon} +${v1}|${v2}`);

    switch (boon) {
      case "UpgradeRock":
        player.rock.currentATK += v1;
        player.rock.currentDEF += v2;
        break;
      case "UpgradePaper":
        player.paper.currentATK += v1;
        player.paper.currentDEF += v2;
        break;
      case "UpgradeScissor":
        player.scissor.currentATK += v1;
        player.scissor.currentDEF += v2;
        break;
      case "Heal":
        player.health.current = Math.min(
          player.health.currentMax,
          player.health.current + v1
        );
        break;
      case "AddMaxArmor":
        player.shield.currentMax += v1;
        break;
      default:
        // no effect
        break;
    }
  }

  /**
   * Apply the chosen loot effect with no logs.
   */
  private applyLootEffectNoLogs(player: Player, loot: LootOption) {
    const boon = loot.boonTypeString;
    const v1 = loot.selectedVal1;
    const v2 = loot.selectedVal2;

    switch (boon) {
      case "UpgradeRock":
        player.rock.currentATK += v1;
        player.rock.currentDEF += v2;
        break;
      case "UpgradePaper":
        player.paper.currentATK += v1;
        player.paper.currentDEF += v2;
        break;
      case "UpgradeScissor":
        player.scissor.currentATK += v1;
        player.scissor.currentDEF += v2;
        break;
      case "Heal":
        player.health.current = Math.min(
          player.health.currentMax,
          player.health.current + v1
        );
        break;
      case "AddMaxArmor":
        player.shield.currentMax += v1;
        break;
    }
  }

  /**
   * Possibly use a consumable if HP < 30% - with logs
   */
  private maybeUseConsumable(
    player: Player,
    consumables: ConsumableItem[],
    usedLog: string[]
  ) {
    const ratio = player.health.current / player.health.currentMax;
    if (ratio < 0.3) {
      const healItem = consumables.find(
        (c) => c.name === "heal" && c.quantity > 0
      );
      if (healItem) {
        healItem.quantity--;
        const amt = this.getHealAmount(healItem.level);
        const oldHP = player.health.current;
        player.health.current = Math.min(
          player.health.currentMax,
          player.health.current + amt
        );
        usedLog.push(`Used heal(lv${healItem.level}) +${amt}HP`);
        logger.info(
          `Consumable used -> heal(lv${healItem.level}), HP ${oldHP} -> ${player.health.current}`
        );
      }
    }
  }

  /**
   * Possibly use a consumable if HP < 30% - no logs
   */
  private maybeUseConsumableNoLogs(
    player: Player,
    consumables: ConsumableItem[],
    usedLog: string[]
  ) {
    const ratio = player.health.current / player.health.currentMax;
    if (ratio < 0.3) {
      const healItem = consumables.find(
        (c) => c.name === "heal" && c.quantity > 0
      );
      if (healItem) {
        healItem.quantity--;
        const amt = this.getHealAmount(healItem.level);
        player.health.current = Math.min(
          player.health.currentMax,
          player.health.current + amt
        );
        usedLog.push(`Used heal(lv${healItem.level}) +${amt}HP`);
      }
    }
  }

  /**
   * Core RPS logic that uses each move's actual ATK/DEF stats
   * to compute the final dmgToEnemy, dmgToPlayer, shieldGain for each side.
   */
  private computeRoundOutcome(
    player: Player,
    enemy: Player,
    playerMove: RpsMove,
    enemyMove: RpsMove
  ): {
    dmgToEnemy: number;
    dmgToPlayer: number;
    shieldGainPlayer: number;
    shieldGainEnemy: number;
  } {
    // 1) Retrieve each side's (ATK,DEF) from the chosen move
    const pStats = this.getMoveStats(player, playerMove);
    const eStats = this.getMoveStats(enemy, enemyMove);

    if (!pStats || !eStats) {
      // fallback if something is null
      return {
        dmgToEnemy: 0,
        dmgToPlayer: 0,
        shieldGainPlayer: 0,
        shieldGainEnemy: 0,
      };
    }

    // 2) Determine who wins
    let playerWins = false;
    let tie = false;

    if (playerMove === enemyMove) {
      tie = true;
    } else if (
      (playerMove === RpsMove.ROCK && enemyMove === RpsMove.SCISSOR) ||
      (playerMove === RpsMove.SCISSOR && enemyMove === RpsMove.PAPER) ||
      (playerMove === RpsMove.PAPER && enemyMove === RpsMove.ROCK)
    ) {
      playerWins = true;
    }

    // 3) Calculate final values
    let dmgToEnemy = 0;
    let dmgToPlayer = 0;
    let shieldGainPlayer = 0;
    let shieldGainEnemy = 0;

    if (tie) {
      // Both sides apply their own (ATK,DEF)
      dmgToEnemy = pStats.currentATK;
      shieldGainPlayer = pStats.currentDEF;

      dmgToPlayer = eStats.currentATK;
      shieldGainEnemy = eStats.currentDEF;
    } else if (playerWins) {
      // Only player’s (ATK,DEF) is applied
      dmgToEnemy = pStats.currentATK;
      shieldGainPlayer = pStats.currentDEF;
    } else {
      // Enemy wins => Only enemy’s (ATK,DEF) is applied
      dmgToPlayer = eStats.currentATK;
      shieldGainEnemy = eStats.currentDEF;
    }

    return {
      dmgToEnemy,
      dmgToPlayer,
      shieldGainPlayer,
      shieldGainEnemy,
    };
  }

  /**
   * Deal damage + shield gain
   */
  private applyDamageAndShield(
    incomingDamage: number,
    shieldGain: number,
    attacker: Player,
    defender: Player
  ) {
    const oldAS = attacker.shield.current;
    attacker.shield.current = Math.min(
      attacker.shield.current + shieldGain,
      attacker.shield.currentMax
    );

    if (shieldGain > 0) {
      logger.info(
        `Attacker shield: ${oldAS} -> ${attacker.shield.current} (+${shieldGain})`
      );
    }

    let remaining = incomingDamage;
    if (defender.shield.current > 0 && remaining > 0) {
      const absorb = Math.min(defender.shield.current, remaining);
      defender.shield.current -= absorb;
      remaining -= absorb;
      logger.info(`Defender shield absorbed ${absorb} dmg.`);
    }

    if (remaining > 0) {
      const oldHP = defender.health.current;
      defender.health.current = Math.max(0, oldHP - remaining);
      logger.info(`Defender HP: ${oldHP} -> ${defender.health.current}`);
    }
  }

  /**
   * Move charges & spam penalty
   */
  private updateCharges(player: Player, moveUsed: RpsMove) {
    const usedStats = this.getMoveStats(player, moveUsed);
    if (!usedStats) return;

    // If we still have >1 charges, just decrement
    if (usedStats.currentCharges > 1) {
      usedStats.currentCharges--;
    } else if (usedStats.currentCharges === 1) {
      usedStats.currentCharges = -1;
      logger.warn(`Move ${moveUsed} => spam penalty => now -1 charges.`);
    }

    const allMoves = [RpsMove.ROCK, RpsMove.PAPER, RpsMove.SCISSOR];
    for (const m of allMoves) {
      if (m === moveUsed) continue;
      const st = this.getMoveStats(player, m);
      if (!st) continue;

      if (st.currentCharges === -1) {
        st.currentCharges = 0;
        logger.info(`Move ${m} from -1 to 0 after using a different move.`);
      } else if (st.currentCharges >= 0 && st.currentCharges < st.maxCharges) {
        st.currentCharges++;
      }
    }
  }

  /**
   * Utility for "Rock(ATK|DEF)" log label
   */
  private moveLabel(move: RpsMove, stats: PlayerStats | null): string {
    if (!stats) return `${move.toUpperCase()}(?|?)`;
    return `${move[0].toUpperCase() + move.slice(1)}(${stats.currentATK}|${
      stats.currentDEF
    })`;
  }

  /**
   * Picks a random valid move among those with charges > 0.
   * If none have charges, fallback to RpsMove.ROCK (or any).
   */
  private pickRandomMove(player: Player, randomFn: () => number): RpsMove {
    const candidates: RpsMove[] = [];
    if (player.rock.currentCharges > 0) candidates.push(RpsMove.ROCK);
    if (player.paper.currentCharges > 0) candidates.push(RpsMove.PAPER);
    if (player.scissor.currentCharges > 0) candidates.push(RpsMove.SCISSOR);

    if (!candidates.length) {
      // fallback if everything is 0 or -1
      return RpsMove.ROCK;
    }

    const idx = Math.floor(randomFn() * candidates.length);
    return candidates[idx];
  }

  /**
   * Convert an EnemyEntity to a Player object
   *
   * We assume MOVE_STATS_CID_array is [rockATK, rockDEF, paperATK, paperDEF, scissorATK, scissorDEF, HP, Shield].
   */
  private convertEnemyToPlayer(e: EnemyEntity): Player {
    const arr = e.MOVE_STATS_CID_array;
    const rockAtk = arr[0] || 0;
    const rockDef = arr[1] || 0;
    const paperAtk = arr[2] || 0;
    const paperDef = arr[3] || 0;
    const sciAtk = arr[4] || 0;
    const sciDef = arr[5] || 0;
    const hp = arr[6] || 0;
    const shield = arr[7] || 0;

    return {
      id: `Enemy#${e.ID_CID} (${e.NAME_CID})`,
      health: {
        current: hp,
        currentMax: hp,
        starting: hp,
        startingMax: hp,
      },
      shield: {
        current: shield,
        currentMax: shield,
        starting: shield,
        startingMax: shield,
      },
      rock: {
        startingATK: rockAtk,
        startingDEF: rockDef,
        currentATK: rockAtk,
        currentDEF: rockDef,
        currentCharges: 3,
        maxCharges: 3,
      },
      paper: {
        startingATK: paperAtk,
        startingDEF: paperDef,
        currentATK: paperAtk,
        currentDEF: paperDef,
        currentCharges: 3,
        maxCharges: 3,
      },
      scissor: {
        startingATK: sciAtk,
        startingDEF: sciDef,
        currentATK: sciAtk,
        currentDEF: sciDef,
        currentCharges: 3,
        maxCharges: 3,
      },
      equipment: [],
      lastMove: "",
      thisPlayerWin: false,
      otherPlayerWin: false,
      _id: e.docId,
    };
  }

  private clonePlayer(p: Player): Player {
    return JSON.parse(JSON.stringify(p));
  }

  private getMoveStats(player: Player, move: RpsMove): PlayerStats | null {
    switch (move) {
      case RpsMove.ROCK:
        return player.rock;
      case RpsMove.PAPER:
        return player.paper;
      case RpsMove.SCISSOR:
        return player.scissor;
      default:
        return null;
    }
  }

  /**
   * Log a quick overview: HP, shield, plus each RPS stats
   */
  private logPlayerOverview(title: string, player: Player) {
    logger.newline();
    logger.info(
      `[${title}] HP: ${player.health.current}/${player.health.currentMax}, ` +
        `Shield: ${player.shield.current}/${player.shield.currentMax}`
    );
    logger.info(
      `Rock(ATK=${player.rock.currentATK}, DEF=${player.rock.currentDEF}, c=${player.rock.currentCharges})`
    );
    logger.info(
      `Paper(ATK=${player.paper.currentATK}, DEF=${player.paper.currentDEF}, c=${player.paper.currentCharges})`
    );
    logger.info(
      `Scissor(ATK=${player.scissor.currentATK}, DEF=${player.scissor.currentDEF}, c=${player.scissor.currentCharges})`
    );
  }

  /**
   * Basic helper to get heal amount from item level
   */
  private getHealAmount(level: number): number {
    switch (level) {
      case 3:
        return 20;
      case 2:
        return 8;
      default:
        return 4;
    }
  }
}
