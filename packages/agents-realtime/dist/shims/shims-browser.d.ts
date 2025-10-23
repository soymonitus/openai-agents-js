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
export declare const RTCPeerConnection: {
    new (configuration?: RTCConfiguration): RTCPeerConnection;
    prototype: RTCPeerConnection;
    generateCertificate(keygenAlgorithm: AlgorithmIdentifier): Promise<RTCCertificate>;
};
export declare const RTCIceCandidate: {
    new (candidateInitDict?: RTCIceCandidateInit): RTCIceCandidate;
    prototype: RTCIceCandidate;
};
export declare const RTCSessionDescription: {
    new (descriptionInitDict: RTCSessionDescriptionInit): RTCSessionDescription;
    prototype: RTCSessionDescription;
};
export declare const MediaStream: {
    new (): MediaStream;
    new (stream: MediaStream): MediaStream;
    new (tracks: MediaStreamTrack[]): MediaStream;
    prototype: MediaStream;
};
export declare const MediaStreamTrack: {
    new (): MediaStreamTrack;
    prototype: MediaStreamTrack;
};
export declare const mediaDevices: MediaDevices;
