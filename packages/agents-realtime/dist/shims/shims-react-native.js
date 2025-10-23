"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaDevices = exports.MediaStreamTrack = exports.MediaStream = exports.RTCSessionDescription = exports.RTCIceCandidate = exports.RTCPeerConnection = exports.useWebSocketProtocols = exports.isBrowserEnvironment = exports.WebSocket = void 0;
const react_native_webrtc_1 = require("react-native-webrtc");
Object.defineProperty(exports, "RTCPeerConnection", { enumerable: true, get: function () { return react_native_webrtc_1.RTCPeerConnection; } });
Object.defineProperty(exports, "RTCIceCandidate", { enumerable: true, get: function () { return react_native_webrtc_1.RTCIceCandidate; } });
Object.defineProperty(exports, "RTCSessionDescription", { enumerable: true, get: function () { return react_native_webrtc_1.RTCSessionDescription; } });
Object.defineProperty(exports, "MediaStream", { enumerable: true, get: function () { return react_native_webrtc_1.MediaStream; } });
Object.defineProperty(exports, "MediaStreamTrack", { enumerable: true, get: function () { return react_native_webrtc_1.MediaStreamTrack; } });
Object.defineProperty(exports, "mediaDevices", { enumerable: true, get: function () { return react_native_webrtc_1.mediaDevices; } });
(0, react_native_webrtc_1.registerGlobals)();
exports.WebSocket = global.WebSocket;
const isBrowserEnvironment = () => false;
exports.isBrowserEnvironment = isBrowserEnvironment;
exports.useWebSocketProtocols = true;
//# sourceMappingURL=shims-react-native.js.map