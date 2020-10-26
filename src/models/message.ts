/**
 * Defines IMessage interface.
 */
interface IMessage {
  resultMessage: string;
  errorMessage: string;
  reset(): void;
}

/**
 * Messages class.
 */
class Messages implements IMessage {
  resultMessage = "";
  errorMessage = "";

  reset() {
    this.resultMessage = "";
    this.errorMessage = "";
  }
}

export const messages = new Messages();
