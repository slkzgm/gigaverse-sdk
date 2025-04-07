// path: src/utils/logger.ts

import chalk from "chalk";
import Table from "cli-table3";

/**
 * Logger utility with minimal color usage.
 * White logs by default, and color only for important cases.
 */
export const logger = {
  info: (msg: string) => {
    console.log(chalk.white(`[INFO] ${msg}`));
  },
  error: (msg: string) => {
    console.log(chalk.redBright(`[ERROR] ${msg}`));
  },
  warn: (msg: string) => {
    console.log(chalk.yellowBright(`[WARN] ${msg}`));
  },
  success: (msg: string) => {
    console.log(chalk.greenBright(`[SUCCESS] ${msg}`));
  },
  separator: () => {
    console.log(
      chalk.grey("------------------------------------------------------------")
    );
  },
  newline: () => {
    console.log("");
  },

  /**
   * Utility to display a table using cli-table3.
   */
  table: (headers: string[], rows: any[][]) => {
    const table = new Table({
      head: headers,
      style: { head: ["green"] },
    });
    rows.forEach((row) => table.push(row));
    console.log(table.toString());
  },
};
