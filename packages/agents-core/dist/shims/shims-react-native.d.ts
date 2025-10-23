export { EventEmitter, EventEmitterEvents } from './interface';
import type { EventEmitterEvents, Timeout, Timer } from './interface';
import { EventEmitter as NodeEventEmitter } from 'events';
export declare const randomUUID: () => string;
export declare function loadEnv(): Record<string, string | undefined>;
export declare class ReactNativeEventEmitter<Events extends EventEmitterEvents = Record<string, any[]>> extends NodeEventEmitter {
    on<K extends keyof Events & (string | symbol)>(type: K, listener: (...args: Events[K]) => void): this;
    off<K extends keyof Events & (string | symbol)>(type: K, listener: (...args: Events[K]) => void): this;
    emit<K extends keyof Events & (string | symbol)>(type: K, ...args: Events[K]): boolean;
    once<K extends keyof Events & (string | symbol)>(type: K, listener: (...args: Events[K]) => void): this;
}
export { ReactNativeEventEmitter as RuntimeEventEmitter };
export declare const Readable: {
    new (): {};
};
export declare const ReadableStream: {
    new (underlyingSource: UnderlyingByteSource, strategy?: {
        highWaterMark?: number;
    }): ReadableStream<Uint8Array>;
    new <R = any>(underlyingSource: UnderlyingDefaultSource<R>, strategy?: QueuingStrategy<R>): ReadableStream<R>;
    new <R = any>(underlyingSource?: UnderlyingSource<R>, strategy?: QueuingStrategy<R>): ReadableStream<R>;
    prototype: ReadableStream;
};
export declare const ReadableStreamController: {
    new (): ReadableStreamDefaultController;
    prototype: ReadableStreamDefaultController;
};
export declare const TransformStream: {
    new <I = any, O = any>(transformer?: Transformer<I, O>, writableStrategy?: QueuingStrategy<I>, readableStrategy?: QueuingStrategy<O>): TransformStream<I, O>;
    prototype: TransformStream;
};
export declare class AsyncLocalStorage {
    #private;
    run<T>(store: T, fn: () => unknown): unknown;
    getStore<T>(): T;
    enterWith<T>(store: T): void;
}
export declare function isBrowserEnvironment(): boolean;
export declare function isTracingLoopRunningByDefault(): boolean;
export { MCPServerStdio, MCPServerStreamableHttp } from './mcp-server/browser';
declare class RNTimer implements Timer {
    setTimeout(cb: () => void, ms: number): Timeout;
    clearTimeout(id: Timeout | string | number | undefined): void;
}
declare const timer: RNTimer;
export { timer };
