import { Message } from "./message.model";

export class ErrorMessage extends Message {
    constructor(text: string){
        super(text, 'ERROR');
    }
}