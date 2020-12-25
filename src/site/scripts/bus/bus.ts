export default class Bus extends HTMLElement {
    constructor(lineNumber: number, busData: { [id: string]: Array<{ [id: string]: any }> }) {
        super();
        this.className = "Bus";
        this.id = lineNumber.toString();
    }
}