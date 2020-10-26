/**
 * Utils class.
 * Contains various useful functions.
 */
class Utils {
  /**
   * Checks wheter all required environment variables are loaded and not empty.
   * @param toChek array for environment variables names
   */
  checkEnvironmentVariables(toChek: string[]): void {
    const missing: string[] = toChek.filter((value: string) => {
      if (!process.env[value]) return value;
    });

    const count = missing.length;
    if (count > 0)
      throw new Error(
        `Required ENV ${count > 1 ? "variables" : "variable"} ${missing} ${
          count > 1 ? "are" : "is"
        } not set.`
      );
  }

  /**
   * Sleeps for specified period.
   * @param ms time in milliseconds to sleep.
   */
  sleep(ms: number): void {
    /* tslint:disable-next-line */
    new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const utils = new Utils();
