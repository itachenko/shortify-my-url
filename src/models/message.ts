interface IMessage {
    resultMessage: string;
    errorMessage: string;
    resetMessages(): void;
}

class Messages implements IMessage {
    resultMessage = "";
    errorMessage = "";

    resetMessages() {
        this.resultMessage = "";
        this.errorMessage = "";
    }
}

export const messages = new Messages();
