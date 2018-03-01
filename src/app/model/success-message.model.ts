import { Message } from "./message.model";

export class SuccessMessage extends Message {
    constructor(text: string){
        super(text, 'SUCCESS');
    }
}