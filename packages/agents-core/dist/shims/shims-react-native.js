"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timer = exports.MCPServerStreamableHttp = exports.MCPServerStdio = exports.AsyncLocalStorage = exports.TransformStream = exports.ReadableStreamController = exports.ReadableStream = exports.Readable = exports.RuntimeEventEmitter = exports.ReactNativeEventEmitter = exports.randomUUID = void 0;
exports.loadEnv = loadEnv;
exports.isBrowserEnvironment = isBrowserEnvironment;
exports.isTracingLoopRunningByDefault = isTracingLoopRunningByDefault;
const events_1 = require("events");
const structured_clone_1 = __importDefault(require("@ungap/structured-clone"));
const react_native_uuid_1 = __importDefault(require("react-native-uuid"));
if (!('structuredClone' in globalThis)) {
    // @ts-expect-error - This is the recommended approach from ungap/structured-clone
    globalThis.structuredClone = structured_clone_1.default;
}
const randomUUID = () => react_native_uuid_1.default.v4();
exports.randomUUID = randomUUID;
function loadEnv() {
    return {};
}
class ReactNativeEventEmitter extends events_1.EventEmitter {
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
exports.ReactNativeEventEmitter = ReactNativeEventEmitter;
exports.RuntimeEventEmitter = ReactNativeEventEmitter;
// Streams – placeholders (unused by the SDK on RN)
const Readable = class {
};
exports.Readable = Readable;
exports.ReadableStream = globalThis.ReadableStream;
exports.ReadableStreamController = globalThis.ReadableStreamDefaultController;
exports.TransformStream = globalThis.TransformStream;
class AsyncLocalStorage {
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
exports.AsyncLocalStorage = AsyncLocalStorage;
function isBrowserEnvironment() {
    return true;
}
function isTracingLoopRunningByDefault() {
    return false;
}
/* MCP not supported on mobile; export browser stubs */
var browser_1 = require("./mcp-server/browser.js");
Object.defineProperty(exports, "MCPServerStdio", { enumerable: true, get: function () { return browser_1.MCPServerStdio; } });
Object.defineProperty(exports, "MCPServerStreamableHttp", { enumerable: true, get: function () { return browser_1.MCPServerStreamableHttp; } });
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
exports.timer = timer;
//# sourceMappingURL=shims-react-native.js.map