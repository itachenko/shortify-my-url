/**
 * Defines IMessage interface.
 */
interface IMessage {
  resultMessage: string;
  errorMessage: string;
  resetMessages(): void;
}

/**
 * Messages class.
 */
class Messages implements IMessage {
  resultMessage = "";
  errorMessage = "";

  resetMessages() {
    this.resultMessage = "";
    this.errorMessage = "";
  }
}

export const messages = new Messages();
