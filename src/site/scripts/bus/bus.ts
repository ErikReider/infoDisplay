export default class Bus {
    private element: HTMLDivElement;
    private lineNumber: string;
    private lineName: string;
    private busData: [string, any][];

    constructor(lineNum: string, busD: JSON) {
        this.lineNumber = lineNum.split("_")[0];
        this.lineName = lineNum.split("_")[1];
        this.busData = Object.entries(busD).sort((a, b) =>
            a[0] > b[0] ? 1 : -1
        );

        this.element = <HTMLDivElement>document.createElement("div");
        this.element.className = "bus";

        const cityBus = 100 > Number(this.lineNumber);
        const lineColor = cityBus ? "#30921C" : "#DBBD2C";
        const lineTextColor = cityBus ? "white" : "black";
        this.element.innerHTML = `
            <div class="bus_line" style="background-color:${lineColor}">
                <span class="bus_line_number" style="color:${lineTextColor}">${this.lineNumber}</span>
                <span class="bus_line_name" style="color:${lineTextColor}">${this.lineName}</span>
            </div>
        `;

        const textContainer = document.createElement("div");
        textContainer.className = "bus_text_container";
        this.element.appendChild(textContainer);

        this.busData.forEach((value) => {
            const busses = value[1];
            function getTime(index: number): string {
                let time = "";
                if (busses.length >= index + 1) {
                    const next = Number(busses[index]["nextDepartureIn"]);
                    time = `${next} min`;
                    if (next > 30) {
                        time = busses[index]["nextDepartureTime"];
                    } else if (next === 0) {
                        time = 'Now <i class="fas fa-running"></i>';
                    }
                }
                return time;
            }
            const time = getTime(0);
            const nextTime = getTime(1);
            textContainer.innerHTML += `
                <div class="bus_direction_container">
                    <div class="bus_direction_edge bus_direction_start">
                        <span class="bus_direction_towards">Towards</span>
                        <span class="bus_direction_line">${
                            busses[0]["line"]["towards"]
                        }</span>
                    </div>
                    <div class="bus_direction_edge bus_direction_end">
                        <span class="bus_direction_time">${time}</span>
                        <span class="bus_direction_next_time">
                            ${nextTime !== "" ? `Next: ${nextTime}` : ""}
                        </span>
                    </div>
                </div>
            `;
        });
    }

    returnElement(): HTMLDivElement {
        return this.element;
    }
}

