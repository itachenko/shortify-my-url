import IUrlStatistics from "./IUrlStatistics";

export default interface IRenderOptions {
  result: string;
  error: string;
  statistics: IUrlStatistics;
  shortUrlLifetimeDays: string;
  requestLimitTimeHours: string;
  requestLimitCount: string;
}
