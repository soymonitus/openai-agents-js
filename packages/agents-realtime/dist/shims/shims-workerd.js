"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaDevices = exports.MediaStreamTrack = exports.MediaStream = exports.RTCSessionDescription = exports.RTCIceCandidate = exports.RTCPeerConnection = exports.useWebSocketProtocols = exports.WebSocket = void 0;
exports.isBrowserEnvironment = isBrowserEnvironment;
exports.WebSocket = globalThis.WebSocket;
function isBrowserEnvironment() {
    return false;
}
exports.useWebSocketProtocols = true;
exports.RTCPeerConnection = undefined;
exports.RTCIceCandidate = undefined;
exports.RTCSessionDescription = undefined;
exports.MediaStream = undefined;
exports.MediaStreamTrack = undefined;
exports.mediaDevices = undefined;
//# sourceMappingURL=shims-workerd.js.map