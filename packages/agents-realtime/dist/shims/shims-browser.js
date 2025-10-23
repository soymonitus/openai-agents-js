"use strict";
/// <reference lib="dom" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaDevices = exports.MediaStreamTrack = exports.MediaStream = exports.RTCSessionDescription = exports.RTCIceCandidate = exports.RTCPeerConnection = exports.useWebSocketProtocols = exports.WebSocket = void 0;
exports.isBrowserEnvironment = isBrowserEnvironment;
exports.WebSocket = globalThis.WebSocket;
function isBrowserEnvironment() {
    return true;
}
exports.useWebSocketProtocols = true;
exports.RTCPeerConnection = globalThis.RTCPeerConnection;
exports.RTCIceCandidate = globalThis.RTCIceCandidate;
exports.RTCSessionDescription = globalThis.RTCSessionDescription;
exports.MediaStream = globalThis.MediaStream;
exports.MediaStreamTrack = globalThis.MediaStreamTrack;
exports.mediaDevices = navigator.mediaDevices;
//# sourceMappingURL=shims-browser.js.map