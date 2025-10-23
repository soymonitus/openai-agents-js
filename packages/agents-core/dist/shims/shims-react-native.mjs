import { EventEmitter as NodeEventEmitter } from 'events';
import structuredClone from '@ungap/structured-clone';
import uuid from 'react-native-uuid';
if (!('structuredClone' in globalThis)) {
    // @ts-expect-error - This is the recommended approach from ungap/structured-clone
    globalThis.structuredClone = structuredClone;
}
export const randomUUID = () => uuid.v4();
export function loadEnv() {
    return {};
}
export class ReactNativeEventEmitter extends NodeEventEmitter {
    on(type, listener) {
        // Node's typings accept string | symbol; cast is safe.
        return super.on(type, listener);
    }
    off(type, listener) {
        return super.off(type, listener);
    }
    emit(type, ...args) {
        return super.emit(type, ...args);
    }
    once(type, listener) {
        return super.once(type, listener);
    }
}
export { ReactNativeEventEmitter as RuntimeEventEmitter };
// Streams – placeholders (unused by the SDK on RN)
export const Readable = class {
};
export const ReadableStream = globalThis.ReadableStream;
export const ReadableStreamController = globalThis.ReadableStreamDefaultController;
export const TransformStream = globalThis.TransformStream;
export class AsyncLocalStorage {
    #ctx = null;
    run(store, fn) {
        this.#ctx = store;
        return fn();
    }
    getStore() {
        return this.#ctx;
    }
    enterWith(store) {
        this.#ctx = store;
    }
}
export function isBrowserEnvironment() {
    return true;
}
export function isTracingLoopRunningByDefault() {
    return false;
}
export { MCPServerStdio, MCPServerStreamableHttp } from "./mcp-server/browser.mjs";
class RNTimer {
    setTimeout(cb, ms) {
        const id = setTimeout(cb, ms);
        // RN timers don’t expose ref/unref; shim them
        id.ref ??= () => id;
        id.unref ??= () => id;
        id.hasRef ??= () => true;
        id.refresh ??= () => id;
        return id;
    }
    clearTimeout(id) {
        clearTimeout(id);
    }
}
const timer = new RNTimer();
export { timer };
//# sourceMappingURL=shims-react-native.mjs.map