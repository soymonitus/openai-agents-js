"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiSdkModel = void 0;
exports.itemsToLanguageV2Messages = itemsToLanguageV2Messages;
exports.toolToLanguageV2Tool = toolToLanguageV2Tool;
exports.getResponseFormat = getResponseFormat;
exports.aisdk = aisdk;
exports.parseArguments = parseArguments;
exports.toolChoiceToLanguageV2Format = toolChoiceToLanguageV2Format;
const agents_1 = require("@openai/agents");
const utils_1 = require("@openai/agents/utils");
/**
 * @internal
 * Converts a list of model items to a list of language model V2 messages.
 *
 * @param model - The model to use.
 * @param items - The items to convert.
 * @returns The list of language model V2 messages.
 */
function itemsToLanguageV2Messages(model, items) {
    const messages = [];
    let currentAssistantMessage;
    for (const item of items) {
        if (item.type === 'message' || typeof item.type === 'undefined') {
            const { role, content, providerData } = item;
            if (role === 'system') {
                messages.push({
                    role: 'system',
                    content: content,
                    providerOptions: {
                        ...(providerData ?? {}),
                    },
                });
                continue;
            }
            if (role === 'user') {
                messages.push({
                    role,
                    content: typeof content === 'string'
                        ? [{ type: 'text', text: content }]
                        : content.map((c) => {
                            const { providerData: contentProviderData } = c;
                            if (c.type === 'input_text') {
                                return {
                                    type: 'text',
                                    text: c.text,
                                    providerOptions: {
                                        ...(contentProviderData ?? {}),
                                    },
                                };
                            }
                            if (c.type === 'input_image') {
                                const url = new URL(c.image);
                                return {
                                    type: 'file',
                                    data: url,
                                    mediaType: 'image/*',
                                    providerOptions: {
                                        ...(contentProviderData ?? {}),
                                    },
                                };
                            }
                            if (c.type === 'input_file') {
                                if (typeof c.file !== 'string') {
                                    throw new agents_1.UserError('File ID is not supported');
                                }
                                return {
                                    type: 'file',
                                    file: c.file,
                                    mediaType: 'application/octet-stream',
                                    data: c.file,
                                    providerOptions: {
                                        ...(contentProviderData ?? {}),
                                    },
                                };
                            }
                            throw new agents_1.UserError(`Unknown content type: ${c.type}`);
                        }),
                    providerOptions: {
                        ...(providerData ?? {}),
                    },
                });
                continue;
            }
            if (role === 'assistant') {
                if (currentAssistantMessage) {
                    messages.push(currentAssistantMessage);
                    currentAssistantMessage = undefined;
                }
                messages.push({
                    role,
                    content: content
                        .filter((c) => c.type === 'output_text')
                        .map((c) => {
                        const { providerData: contentProviderData } = c;
                        return {
                            type: 'text',
                            text: c.text,
                            providerOptions: {
                                ...(contentProviderData ?? {}),
                            },
                        };
                    }),
                    providerOptions: {
                        ...(providerData ?? {}),
                    },
                });
                continue;
            }
            const exhaustiveMessageTypeCheck = item;
            throw new Error(`Unknown message type: ${exhaustiveMessageTypeCheck}`);
        }
        else if (item.type === 'function_call') {
            if (!currentAssistantMessage) {
                currentAssistantMessage = {
                    role: 'assistant',
                    content: [],
                    providerOptions: {
                        ...(item.providerData ?? {}),
                    },
                };
            }
            if (Array.isArray(currentAssistantMessage.content) &&
                currentAssistantMessage.role === 'assistant') {
                const content = {
                    type: 'tool-call',
                    toolCallId: item.callId,
                    toolName: item.name,
                    input: parseArguments(item.arguments),
                    providerOptions: {
                        ...(item.providerData ?? {}),
                    },
                };
                currentAssistantMessage.content.push(content);
            }
            continue;
        }
        else if (item.type === 'function_call_result') {
            if (currentAssistantMessage) {
                messages.push(currentAssistantMessage);
                currentAssistantMessage = undefined;
            }
            const toolResult = {
                type: 'tool-result',
                toolCallId: item.callId,
                toolName: item.name,
                output: convertToAiSdkOutput(item.output),
                providerOptions: {
                    ...(item.providerData ?? {}),
                },
            };
            messages.push({
                role: 'tool',
                content: [toolResult],
                providerOptions: {
                    ...(item.providerData ?? {}),
                },
            });
            continue;
        }
        if (item.type === 'hosted_tool_call') {
            throw new agents_1.UserError('Hosted tool calls are not supported');
        }
        if (item.type === 'computer_call') {
            throw new agents_1.UserError('Computer calls are not supported');
        }
        if (item.type === 'computer_call_result') {
            throw new agents_1.UserError('Computer call results are not supported');
        }
        if (item.type === 'reasoning' &&
            item.content.length > 0 &&
            typeof item.content[0].text === 'string') {
            messages.push({
                role: 'assistant',
                content: [
                    {
                        type: 'reasoning',
                        text: item.content[0].text,
                        providerOptions: { ...(item.providerData ?? {}) },
                    },
                ],
                providerOptions: {
                    ...(item.providerData ?? {}),
                },
            });
            continue;
        }
        if (item.type === 'unknown') {
            messages.push({ ...(item.providerData ?? {}) });
            continue;
        }
        if (item) {
            throw new agents_1.UserError(`Unknown item type: ${item.type}`);
        }
        const itemType = item;
        throw new agents_1.UserError(`Unknown item type: ${itemType}`);
    }
    if (currentAssistantMessage) {
        messages.push(currentAssistantMessage);
    }
    return messages;
}
/**
 * @internal
 * Converts a handoff to a language model V2 tool.
 *
 * @param model - The model to use.
 * @param handoff - The handoff to convert.
 */
function handoffToLanguageV2Tool(model, handoff) {
    return {
        type: 'function',
        name: handoff.toolName,
        description: handoff.toolDescription,
        inputSchema: handoff.inputJsonSchema,
    };
}
function convertToAiSdkOutput(output) {
    const anyOutput = output;
    if (anyOutput?.type === 'text' && typeof anyOutput.text === 'string') {
        return { type: 'text', value: anyOutput.text };
    }
    if (anyOutput?.type === 'image' &&
        typeof anyOutput.data === 'string' &&
        typeof anyOutput.mediaType === 'string') {
        return {
            type: 'content',
            value: [
                {
                    type: 'media',
                    data: anyOutput.data,
                    mediaType: anyOutput.mediaType,
                },
            ],
        };
    }
    throw new agents_1.UserError(`Unsupported tool output type: ${String(anyOutput?.type)}`);
}
/**
 * @internal
 * Converts a tool to a language model V2 tool.
 *
 * @param model - The model to use.
 * @param tool - The tool to convert.
 */
function toolToLanguageV2Tool(model, tool) {
    if (tool.type === 'function') {
        return {
            type: 'function',
            name: tool.name,
            description: tool.description,
            inputSchema: tool.parameters,
        };
    }
    if (tool.type === 'hosted_tool') {
        return {
            type: 'provider-defined',
            id: `${model.provider}.${tool.name}`,
            name: tool.name,
            args: tool.providerData?.args ?? {},
        };
    }
    if (tool.type === 'computer') {
        return {
            type: 'provider-defined',
            id: `${model.provider}.${tool.name}`,
            name: tool.name,
            args: {
                environment: tool.environment,
                display_width: tool.dimensions[0],
                display_height: tool.dimensions[1],
            },
        };
    }
    const exhaustiveCheck = tool;
    throw new Error(`Unsupported tool type: ${exhaustiveCheck}`);
}
/**
 * @internal
 * Converts an output type to a language model V2 response format.
 *
 * @param outputType - The output type to convert.
 * @returns The language model V2 response format.
 */
function getResponseFormat(outputType) {
    if (outputType === 'text') {
        return {
            type: 'text',
        };
    }
    return {
        type: 'json',
        name: outputType.name,
        schema: outputType.schema,
    };
}
/**
 * Wraps a model from the AI SDK that adheres to the LanguageModelV2 spec to be used used as a model
 * in the OpenAI Agents SDK to use other models.
 *
 * While you can use this with the OpenAI models, it is recommended to use the default OpenAI model
 * provider instead.
 *
 * If tracing is enabled, the model will send generation spans to your traces processor.
 *
 * ```ts
 * import { aisdk } from '@openai/agents-extensions';
 * import { openai } from '@ai-sdk/openai';
 *
 * const model = aisdk(openai('gpt-4o'));
 *
 * const agent = new Agent({
 *   name: 'My Agent',
 *   model
 * });
 * ```
 *
 * @param model - The Vercel AI SDK model to wrap.
 * @returns The wrapped model.
 */
class AiSdkModel {
    #model;
    #logger = (0, agents_1.getLogger)('openai-agents:extensions:ai-sdk');
    constructor(model) {
        this.#model = model;
    }
    async getResponse(request) {
        return (0, agents_1.withGenerationSpan)(async (span) => {
            try {
                span.spanData.model = this.#model.provider + ':' + this.#model.modelId;
                span.spanData.model_config = {
                    provider: this.#model.provider,
                    model_impl: 'ai-sdk',
                };
                let input = typeof request.input === 'string'
                    ? [
                        {
                            role: 'user',
                            content: [{ type: 'text', text: request.input }],
                        },
                    ]
                    : itemsToLanguageV2Messages(this.#model, request.input);
                if (request.systemInstructions) {
                    input = [
                        {
                            role: 'system',
                            content: request.systemInstructions,
                        },
                        ...input,
                    ];
                }
                const tools = request.tools.map((tool) => toolToLanguageV2Tool(this.#model, tool));
                request.handoffs.forEach((handoff) => {
                    tools.push(handoffToLanguageV2Tool(this.#model, handoff));
                });
                if (span && request.tracing === true) {
                    span.spanData.input = input;
                }
                if ((0, utils_1.isZodObject)(request.outputType)) {
                    throw new agents_1.UserError('Zod output type is not yet supported');
                }
                const responseFormat = getResponseFormat(request.outputType);
                const aiSdkRequest = {
                    tools,
                    toolChoice: toolChoiceToLanguageV2Format(request.modelSettings.toolChoice),
                    prompt: input,
                    temperature: request.modelSettings.temperature,
                    topP: request.modelSettings.topP,
                    frequencyPenalty: request.modelSettings.frequencyPenalty,
                    presencePenalty: request.modelSettings.presencePenalty,
                    maxOutputTokens: request.modelSettings.maxTokens,
                    responseFormat,
                    abortSignal: request.signal,
                    ...(request.modelSettings.providerData ?? {}),
                };
                if (this.#logger.dontLogModelData) {
                    this.#logger.debug('Request sent');
                }
                else {
                    this.#logger.debug('Request:', JSON.stringify(aiSdkRequest, null, 2));
                }
                const result = await this.#model.doGenerate(aiSdkRequest);
                const output = [];
                const resultContent = result.content ?? [];
                const toolCalls = resultContent.filter((c) => c && c.type === 'tool-call');
                const hasToolCalls = toolCalls.length > 0;
                for (const toolCall of toolCalls) {
                    output.push({
                        type: 'function_call',
                        callId: toolCall.toolCallId,
                        name: toolCall.toolName,
                        arguments: typeof toolCall.input === 'string'
                            ? toolCall.input
                            : JSON.stringify(toolCall.input ?? {}),
                        status: 'completed',
                        providerData: hasToolCalls ? result.providerMetadata : undefined,
                    });
                }
                // Some of other platforms may return both tool calls and text.
                // Putting a text message here will let the agent loop to complete,
                // so adding this item only when the tool calls are empty.
                // Note that the same support is not available for streaming mode.
                if (!hasToolCalls) {
                    const textItem = resultContent.find((c) => c && c.type === 'text' && typeof c.text === 'string');
                    if (textItem) {
                        output.push({
                            type: 'message',
                            content: [{ type: 'output_text', text: textItem.text }],
                            role: 'assistant',
                            status: 'completed',
                            providerData: result.providerMetadata,
                        });
                    }
                }
                if (span && request.tracing === true) {
                    span.spanData.output = output;
                }
                const response = {
                    responseId: result.response?.id ?? 'FAKE_ID',
                    usage: new agents_1.Usage({
                        inputTokens: Number.isNaN(result.usage?.inputTokens)
                            ? 0
                            : (result.usage?.inputTokens ?? 0),
                        outputTokens: Number.isNaN(result.usage?.outputTokens)
                            ? 0
                            : (result.usage?.outputTokens ?? 0),
                        totalTokens: (Number.isNaN(result.usage?.inputTokens)
                            ? 0
                            : (result.usage?.inputTokens ?? 0)) +
                            (Number.isNaN(result.usage?.outputTokens)
                                ? 0
                                : (result.usage?.outputTokens ?? 0)) || 0,
                    }),
                    output,
                    providerData: result,
                };
                if (span && request.tracing === true) {
                    span.spanData.usage = {
                        // Note that tracing supports only input and output tokens for Chat Completions.
                        // So, we don't include other properties here.
                        input_tokens: response.usage.inputTokens,
                        output_tokens: response.usage.outputTokens,
                    };
                }
                if (this.#logger.dontLogModelData) {
                    this.#logger.debug('Response ready');
                }
                else {
                    this.#logger.debug('Response:', JSON.stringify(response, null, 2));
                }
                return response;
            }
            catch (error) {
                if (error instanceof Error) {
                    span.setError({
                        message: request.tracing === true ? error.message : 'Unknown error',
                        data: {
                            error: request.tracing === true
                                ? String(error)
                                : error instanceof Error
                                    ? error.name
                                    : undefined,
                        },
                    });
                }
                else {
                    span.setError({
                        message: 'Unknown error',
                        data: {
                            error: request.tracing === true
                                ? String(error)
                                : error instanceof Error
                                    ? error.name
                                    : undefined,
                        },
                    });
                }
                throw error;
            }
        });
    }
    async *getStreamedResponse(request) {
        const span = request.tracing ? (0, agents_1.createGenerationSpan)() : undefined;
        try {
            if (span) {
                span.start();
                (0, agents_1.setCurrentSpan)(span);
            }
            if (span?.spanData) {
                span.spanData.model = this.#model.provider + ':' + this.#model.modelId;
                span.spanData.model_config = {
                    provider: this.#model.provider,
                    model_impl: 'ai-sdk',
                };
            }
            let input = typeof request.input === 'string'
                ? [
                    {
                        role: 'user',
                        content: [{ type: 'text', text: request.input }],
                    },
                ]
                : itemsToLanguageV2Messages(this.#model, request.input);
            if (request.systemInstructions) {
                input = [
                    {
                        role: 'system',
                        content: request.systemInstructions,
                    },
                    ...input,
                ];
            }
            const tools = request.tools.map((tool) => toolToLanguageV2Tool(this.#model, tool));
            request.handoffs.forEach((handoff) => {
                tools.push(handoffToLanguageV2Tool(this.#model, handoff));
            });
            if (span && request.tracing === true) {
                span.spanData.input = input;
            }
            const responseFormat = getResponseFormat(request.outputType);
            const aiSdkRequest = {
                tools,
                prompt: input,
                temperature: request.modelSettings.temperature,
                topP: request.modelSettings.topP,
                frequencyPenalty: request.modelSettings.frequencyPenalty,
                presencePenalty: request.modelSettings.presencePenalty,
                maxOutputTokens: request.modelSettings.maxTokens,
                responseFormat,
                abortSignal: request.signal,
                ...(request.modelSettings.providerData ?? {}),
            };
            if (this.#logger.dontLogModelData) {
                this.#logger.debug('Request received (streamed)');
            }
            else {
                this.#logger.debug('Request (streamed):', JSON.stringify(aiSdkRequest, null, 2));
            }
            const { stream } = await this.#model.doStream(aiSdkRequest);
            let started = false;
            let responseId;
            let usagePromptTokens = 0;
            let usageCompletionTokens = 0;
            const functionCalls = {};
            let textOutput;
            for await (const part of stream) {
                if (!started) {
                    started = true;
                    yield { type: 'response_started' };
                }
                yield { type: 'model', event: part };
                switch (part.type) {
                    case 'text-delta': {
                        if (!textOutput) {
                            textOutput = { type: 'output_text', text: '' };
                        }
                        textOutput.text += part.delta;
                        yield { type: 'output_text_delta', delta: part.delta };
                        break;
                    }
                    case 'tool-call': {
                        const toolCallId = part.toolCallId;
                        if (toolCallId) {
                            functionCalls[toolCallId] = {
                                type: 'function_call',
                                callId: toolCallId,
                                name: part.toolName,
                                arguments: part.input ?? '',
                                status: 'completed',
                            };
                        }
                        break;
                    }
                    case 'response-metadata': {
                        if (part.id) {
                            responseId = part.id;
                        }
                        break;
                    }
                    case 'finish': {
                        usagePromptTokens = Number.isNaN(part.usage?.inputTokens)
                            ? 0
                            : (part.usage?.inputTokens ?? 0);
                        usageCompletionTokens = Number.isNaN(part.usage?.outputTokens)
                            ? 0
                            : (part.usage?.outputTokens ?? 0);
                        break;
                    }
                    case 'error': {
                        throw part.error;
                    }
                    default:
                        break;
                }
            }
            const outputs = [];
            if (textOutput) {
                outputs.push({
                    type: 'message',
                    role: 'assistant',
                    content: [textOutput],
                    status: 'completed',
                });
            }
            for (const fc of Object.values(functionCalls)) {
                outputs.push(fc);
            }
            const finalEvent = {
                type: 'response_done',
                response: {
                    id: responseId ?? 'FAKE_ID',
                    usage: {
                        inputTokens: usagePromptTokens,
                        outputTokens: usageCompletionTokens,
                        totalTokens: usagePromptTokens + usageCompletionTokens,
                    },
                    output: outputs,
                },
            };
            if (span && request.tracing === true) {
                span.spanData.output = outputs;
                span.spanData.usage = {
                    // Note that tracing supports only input and output tokens for Chat Completions.
                    // So, we don't include other properties here.
                    input_tokens: finalEvent.response.usage.inputTokens,
                    output_tokens: finalEvent.response.usage.outputTokens,
                };
            }
            if (this.#logger.dontLogModelData) {
                this.#logger.debug('Response ready (streamed)');
            }
            else {
                this.#logger.debug('Response (streamed):', JSON.stringify(finalEvent.response, null, 2));
            }
            yield finalEvent;
        }
        catch (error) {
            if (span) {
                span.setError({
                    message: 'Error streaming response',
                    data: {
                        error: request.tracing === true
                            ? String(error)
                            : error instanceof Error
                                ? error.name
                                : undefined,
                    },
                });
            }
            throw error;
        }
        finally {
            if (span) {
                span.end();
                (0, agents_1.resetCurrentSpan)();
            }
        }
    }
}
exports.AiSdkModel = AiSdkModel;
/**
 * Wraps a model from the AI SDK that adheres to the LanguageModelV2 spec to be used used as a model
 * in the OpenAI Agents SDK to use other models.
 *
 * While you can use this with the OpenAI models, it is recommended to use the default OpenAI model
 * provider instead.
 *
 * If tracing is enabled, the model will send generation spans to your traces processor.
 *
 * ```ts
 * import { aisdk } from '@openai/agents-extensions';
 * import { openai } from '@ai-sdk/openai';
 *
 * const model = aisdk(openai('gpt-4o'));
 *
 * const agent = new Agent({
 *   name: 'My Agent',
 *   model
 * });
 * ```
 *
 * @param model - The Vercel AI SDK model to wrap.
 * @returns The wrapped model.
 */
function aisdk(model) {
    return new AiSdkModel(model);
}
function parseArguments(args) {
    if (!args) {
        return {};
    }
    try {
        return JSON.parse(args);
    }
    catch (_) {
        return {};
    }
}
function toolChoiceToLanguageV2Format(toolChoice) {
    if (!toolChoice) {
        return undefined;
    }
    switch (toolChoice) {
        case 'auto':
            return { type: 'auto' };
        case 'required':
            return { type: 'required' };
        case 'none':
            return { type: 'none' };
        default:
            return { type: 'tool', toolName: toolChoice };
    }
}
//# sourceMappingURL=aiSdk.js.map