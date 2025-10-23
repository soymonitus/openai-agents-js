"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaDevices = exports.MediaStreamTrack = exports.MediaStream = exports.RTCSessionDescription = exports.RTCIceCandidate = exports.RTCPeerConnection = exports.useWebSocketProtocols = exports.WebSocket = void 0;
exports.isBrowserEnvironment = isBrowserEnvironment;
var ws_1 = require("ws");
Object.defineProperty(exports, "WebSocket", { enumerable: true, get: function () { return ws_1.WebSocket; } });
function isBrowserEnvironment() {
    return false;
}
exports.useWebSocketProtocols = false;
exports.RTCPeerConnection = undefined;
exports.RTCIceCandidate = undefined;
exports.RTCSessionDescription = undefined;
exports.MediaStream = undefined;
exports.MediaStreamTrack = undefined;
exports.mediaDevices = undefined;
//# sourceMappingURL=shims-node.js.map