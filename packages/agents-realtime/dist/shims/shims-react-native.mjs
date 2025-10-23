import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, MediaStream, MediaStreamTrack, mediaDevices, registerGlobals, } from 'react-native-webrtc';
registerGlobals();
export const WebSocket = global.WebSocket;
export const isBrowserEnvironment = () => false;
export const useWebSocketProtocols = true;
export { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, MediaStream, MediaStreamTrack, mediaDevices, };
//# sourceMappingURL=shims-react-native.mjs.map