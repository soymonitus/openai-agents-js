export declare const WebSocket: {
    new (url: string | URL, protocols?: string | string[]): WebSocket;
    prototype: WebSocket;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSING: 2;
    readonly CLOSED: 3;
};
export declare function isBrowserEnvironment(): boolean;
export declare const useWebSocketProtocols = true;
export declare const RTCPeerConnection: typeof globalThis.RTCPeerConnection;
export declare const RTCIceCandidate: typeof globalThis.RTCIceCandidate;
export declare const RTCSessionDescription: typeof globalThis.RTCSessionDescription;
export declare const MediaStream: typeof globalThis.MediaStream;
export declare const MediaStreamTrack: typeof globalThis.MediaStreamTrack;
export declare const mediaDevices: MediaDevices;
