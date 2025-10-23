/// <reference lib="dom" />
export const WebSocket = globalThis.WebSocket;
export function isBrowserEnvironment() {
    return true;
}
export const useWebSocketProtocols = true;
export const RTCPeerConnection = globalThis.RTCPeerConnection;
export const RTCIceCandidate = globalThis.RTCIceCandidate;
export const RTCSessionDescription = globalThis.RTCSessionDescription;
export const MediaStream = globalThis.MediaStream;
export const MediaStreamTrack = globalThis.MediaStreamTrack;
export const mediaDevices = navigator.mediaDevices;
//# sourceMappingURL=shims-browser.mjs.map