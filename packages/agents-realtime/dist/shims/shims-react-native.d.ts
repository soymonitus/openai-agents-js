import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, MediaStream, MediaStreamTrack, mediaDevices } from 'react-native-webrtc';
export declare const WebSocket: {
    new (url: string | URL, protocols?: string | string[]): WebSocket;
    prototype: WebSocket;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSING: 2;
    readonly CLOSED: 3;
};
export declare const isBrowserEnvironment: () => boolean;
export declare const useWebSocketProtocols = true;
export { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, MediaStream, MediaStreamTrack, mediaDevices, };
