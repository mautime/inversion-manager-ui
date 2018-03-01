export class Message {
    text: string;
    type: string;

    constructor(aText: string, aType: string){
        this.text = aText;
        this.type = aType;
    }
}