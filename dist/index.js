"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var SD = /** @class */ (function () {
    function SD(connectionID) {
        var _this = this;
        this.validateConnectionID = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("".concat(SD.apiUrl, "/connections/validate"), {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-SD-ConnectionID': this.connectionID,
                                    'X-SD-Host': window.location.host
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        if (!data.hasOwnProperty('success') || !data.success) {
                            this.success = false;
                            return [2 /*return*/];
                        }
                        this.success = true;
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.success = false;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.connectionID = connectionID;
        this.success = undefined;
    }
    SD.prototype.attachDrawingModal = function (cssSelector, shopDrawingID) {
        var elements = window.document.querySelectorAll(cssSelector);
        console.log(elements, 'test');
        var self = this;
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', function () {
                self.openDrawingModal(shopDrawingID);
            });
        }
    };
    SD.prototype.openDrawingModal = function (shopDrawingID) {
        var modalEl = document.createElement('div');
        modalEl.className = 'sde__modal';
        modalEl.innerHTML = "<div style=\"display:flex;flex-direction:row;justify-content:space-between;padding:16px\"><div style=\"font-size:16px;font-weight:700\"></div><div style=\"cursor:pointer;height:16px;width:16px\" onclick=\"this.closest(&quot;.sde__modal&quot;).remove()\"><svg viewBox=\"0 0 298.667 298.667\" style=\"enable-background:new 0 0 298.667 298.667\" xml:space=\"preserve\"><g><g><polygon points=\"298.667,30.187 268.48,0 149.333,119.147 30.187,0 0,30.187 119.147,149.333 0,268.48 30.187,298.667 149.333,179.52 268.48,298.667 298.667,268.48 179.52,149.333\" fill=\"#222222\"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div></div><div style=\"display:flex;flex:1 1 auto;justify-content:center\">".concat(this.buildModalBody(shopDrawingID), "</div>");
        modalEl.setAttribute('style', 'background-color: white; display: flex; flex-flow: column; height: 100vh; left: 0; position: absolute; top: 0; width: 100%; z-index: 2147483647;');
        document.body.appendChild(modalEl);
    };
    SD.prototype.buildModalBody = function (shopDrawingID) {
        if (this.success === undefined) {
            return SD.createInvalidResponse('<svg style="margin:auto;background:#fff;display:block;shape-rendering:auto" width="64px" height="64px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#1d0e0b" stroke-width="8" r="32" stroke-dasharray="150.79644737231007 52.26548245743669"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>');
        }
        if (!this.success) {
            return SD.createInvalidResponse("Oh, no ... You can't enter drawing at this time.<br>Please, try again later");
        }
        if (!shopDrawingID) {
            return SD.createInvalidResponse("Ooops ... Drawing for this product doesn't exist");
        }
        return "<iframe src=\"http://localhost:3000/sd/".concat(shopDrawingID, "\" style=\"border: 1px solid #dadada; width: 100%;\"></iframe>");
    };
    SD.createInvalidResponse = function (txt) {
        return "<div style=\"align-items:center;display:flex;flex-direction:column;justify-content:center\"><svg width=\"48px\" height=\"48px\" viewBox=\"0 0 48 48\"><g id=\"surface1\"><path style=\"stroke:none;fill-rule:nonzero;fill:#000;fill-opacity:1\" d=\"M 43.800781 10.445312 C 43.507812 10.019531 42.925781 9.910156 42.496094 10.203125 C 42.070312 10.496094 41.960938 11.078125 42.253906 11.507812 C 48.273438 20.277344 47.175781 32.109375 39.640625 39.640625 C 31.015625 48.265625 16.980469 48.265625 8.355469 39.640625 C 4.175781 35.464844 1.875 29.910156 1.875 24.003906 C 1.875 18.09375 4.175781 12.539062 8.355469 8.363281 C 15.882812 0.835938 27.710938 -0.269531 36.476562 5.734375 C 36.90625 6.027344 37.488281 5.917969 37.78125 5.492188 C 38.074219 5.066406 37.964844 4.480469 37.535156 4.1875 C 28.023438 -2.324219 15.195312 -1.125 7.027344 7.039062 C 2.496094 11.570312 0 17.59375 0 24.003906 C 0 30.410156 2.496094 36.4375 7.027344 40.96875 C 11.5625 45.5 17.585938 47.996094 23.996094 47.996094 C 30.40625 47.996094 36.433594 45.5 40.964844 40.96875 C 49.136719 32.796875 50.332031 19.960938 43.800781 10.445312 Z M 43.800781 10.445312 \"/><path style=\"stroke:none;fill-rule:nonzero;fill:#000;fill-opacity:1\" d=\"M 39.726562 8.695312 C 40.0625 8.917969 40.511719 8.898438 40.828125 8.648438 C 41.128906 8.414062 41.253906 8.007812 41.144531 7.644531 C 41.03125 7.269531 40.6875 7 40.296875 6.980469 C 39.894531 6.957031 39.511719 7.207031 39.371094 7.585938 C 39.21875 7.988281 39.367188 8.457031 39.726562 8.695312 Z M 39.726562 8.695312 \"/><path style=\"stroke:none;fill-rule:nonzero;fill:#000;fill-opacity:1\" d=\"M 34.953125 21.675781 L 34.953125 19.890625 C 34.953125 18.054688 33.457031 16.558594 31.621094 16.558594 C 29.785156 16.558594 28.289062 18.054688 28.289062 19.890625 L 28.289062 21.675781 C 28.289062 23.511719 29.785156 25.007812 31.621094 25.007812 C 33.457031 25.007812 34.953125 23.511719 34.953125 21.675781 Z M 33.078125 21.675781 C 33.078125 22.476562 32.425781 23.132812 31.621094 23.132812 C 30.816406 23.132812 30.164062 22.476562 30.164062 21.675781 L 30.164062 19.890625 C 30.164062 19.085938 30.816406 18.433594 31.621094 18.433594 C 32.425781 18.433594 33.078125 19.085938 33.078125 19.890625 Z M 33.078125 21.675781 \"/><path style=\"stroke:none;fill-rule:nonzero;fill:#000;fill-opacity:1\" d=\"M 16.371094 25.007812 C 18.210938 25.007812 19.703125 23.511719 19.703125 21.675781 L 19.703125 19.890625 C 19.703125 18.054688 18.210938 16.558594 16.371094 16.558594 C 14.535156 16.558594 13.039062 18.054688 13.039062 19.890625 L 13.039062 21.675781 C 13.039062 23.511719 14.535156 25.007812 16.371094 25.007812 Z M 14.914062 19.890625 C 14.914062 19.085938 15.570312 18.433594 16.371094 18.433594 C 17.175781 18.433594 17.832031 19.085938 17.832031 19.890625 L 17.832031 21.675781 C 17.832031 22.476562 17.175781 23.132812 16.371094 23.132812 C 15.570312 23.132812 14.914062 22.476562 14.914062 21.675781 Z M 14.914062 19.890625 \"/><path style=\"stroke:none;fill-rule:nonzero;fill:#000;fill-opacity:1\" d=\"M 16.003906 35.699219 C 16.242188 35.699219 16.484375 35.605469 16.664062 35.425781 C 20.707031 31.382812 27.285156 31.382812 31.328125 35.425781 C 31.695312 35.789062 32.289062 35.789062 32.652344 35.425781 C 33.019531 35.058594 33.019531 34.464844 32.652344 34.097656 C 27.878906 29.328125 20.113281 29.324219 15.339844 34.097656 C 14.972656 34.464844 14.972656 35.058594 15.339844 35.425781 C 15.523438 35.605469 15.761719 35.699219 16.003906 35.699219 Z M 16.003906 35.699219 \"/><path style=\"stroke:none;fill-rule:nonzero;fill:#000;fill-opacity:1\" d=\"M 17.519531 11.726562 C 17.71875 11.246094 17.488281 10.699219 17.011719 10.5 C 16.53125 10.304688 15.984375 10.53125 15.789062 11.007812 C 15.609375 11.4375 14.902344 12.128906 13.765625 12.644531 C 12.707031 13.121094 11.652344 13.253906 11.015625 12.992188 C 10.539062 12.796875 9.988281 13.023438 9.792969 13.5 C 9.59375 13.980469 9.824219 14.527344 10.300781 14.726562 C 10.753906 14.914062 11.257812 14.996094 11.785156 14.996094 C 14.085938 14.996094 16.828125 13.402344 17.519531 11.726562 Z M 17.519531 11.726562 \"/><path style=\"stroke:none;fill-rule:nonzero;fill:#000;fill-opacity:1\" d=\"M 36.976562 12.992188 C 36.339844 13.257812 35.285156 13.121094 34.226562 12.644531 C 33.089844 12.128906 32.382812 11.4375 32.207031 11.007812 C 32.007812 10.53125 31.460938 10.304688 30.980469 10.5 C 30.503906 10.699219 30.277344 11.246094 30.472656 11.726562 C 31.167969 13.402344 33.90625 14.996094 36.207031 14.996094 C 36.734375 14.996094 37.242188 14.914062 37.691406 14.726562 C 38.171875 14.527344 38.398438 13.980469 38.203125 13.5 C 38.003906 13.023438 37.457031 12.796875 36.976562 12.992188 Z M 36.976562 12.992188 \"/></g></svg><div style=\"font-size:16px;margin-top:16px\">".concat(txt, "</div></div>");
    };
    SD.apiUrl = 'http://0.0.0.0:3001/api/v1/em';
    return SD;
}());
exports.default = SD;
//# sourceMappingURL=index.js.map