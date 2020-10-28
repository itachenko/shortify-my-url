import IUrlStatistics from "./IUrlStatistics";

export default interface ISessionData {
  errorMessage: string;
  resultMessage: string;
  statsObject: IUrlStatistics;
}
