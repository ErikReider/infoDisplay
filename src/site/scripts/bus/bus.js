"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Bus = /** @class */ (function (_super) {
    __extends(Bus, _super);
    function Bus(lineNumber, busData) {
        var _this = _super.call(this) || this;
        _this.className = "Bus";
        _this.id = lineNumber.toString();
        return _this;
    }
    return Bus;
}(HTMLElement));
exports["default"] = Bus;
