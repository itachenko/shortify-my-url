/**
 * Defines IStat interface.
 */
interface IStat {
  url: string;
  clicksCount: number;
}

/**
 * Defines IStatistics interface.
 */
interface IStatistics {
  stats: IStat;
  reset(): void;
}

/**
 * Statistics class.
 */
class Statistics implements IStatistics {
  stats: IStat = {
    url: "",
    clicksCount: 0,
  }

  reset() {
    this.stats.url = "",
    this.stats.clicksCount = 0;
  }
}

export const statistics = new Statistics();
