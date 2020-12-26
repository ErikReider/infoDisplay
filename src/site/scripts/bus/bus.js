"use strict";
exports.__esModule = true;
var Bus = /** @class */ (function () {
    function Bus(lineNum, busD) {
        this.lineNumber = lineNum.split("_")[0];
        this.lineName = lineNum.split("_")[1];
        this.busData = Object.entries(busD).sort(function (a, b) { return a[0] > b[0] ? 1 : -1; });
        this.element = document.createElement("div");
        this.element.className = "bus";
        var cityBus = 100 > Number(this.lineNumber);
        var lineColor = cityBus ? "#30921C" : "#DBBD2C";
        var lineTextColor = cityBus ? "white" : "black";
        this.element.innerHTML = "\n            <div class=\"bus_line\" style=\"background-color:" + lineColor + "\">\n                <span class=\"bus_line_number\" style=\"color:" + lineTextColor + "\">" + this.lineNumber + "</span>\n                <span class=\"bus_line_name\" style=\"color:" + lineTextColor + "\">" + this.lineName + "</span>\n            </div>\n        ";
        var textContainer = document.createElement("div");
        textContainer.className = "bus_text_container";
        this.element.appendChild(textContainer);
        this.busData.forEach(function (value) {
            var busses = value[1];
            function getTime(index) {
                var time = "";
                if (busses.length >= index + 1) {
                    var next = Number(busses[index]["nextDepartureIn"]);
                    time = next + " min";
                    if (next > 30) {
                        time = busses[index]["nextDepartureTime"];
                    }
                    else if (next === 0) {
                        time = "Now <i class=\"fas fa-running\"></i>";
                    }
                }
                return time;
            }
            var time = getTime(0);
            var nextTime = getTime(1);
            textContainer.innerHTML += "\n                <div class=\"bus_direction_container\">\n                    <div class=\"bus_direction_edge bus_direction_start\">\n                        <span class=\"bus_direction_towards\">Towards</span>\n                        <span class=\"bus_direction_line\">" + busses[0]["line"]["towards"] + "</span>\n                    </div>\n                    <div class=\"bus_direction_edge bus_direction_end\">\n                        <span class=\"bus_direction_time\">" + time + "</span>\n                        <span class=\"bus_direction_next_time\">\n                            " + (nextTime !== "" ? "Next: " + nextTime : "") + "\n                        </span>\n                    </div>\n                </div>\n            ";
        });
    }
    Bus.prototype.returnElement = function () { return this.element; };
    return Bus;
}());
exports["default"] = Bus;
