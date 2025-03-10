export class BaseStreamer {
    /**
     * Function that is called by `.generate()` to push new tokens
     * @param {bigint[][]} value
     */
    put(value: bigint[][]): void;
    /**
     * Function that is called by `.generate()` to signal the end of generation
     */
    end(): void;
}
/**
 * Simple text streamer that prints the token(s) to stdout as soon as entire words are formed.
 */
export class TextStreamer extends BaseStreamer {
    /**
     *
     * @param {import('../tokenizers.js').PreTrainedTokenizer} tokenizer
     */
    constructor(tokenizer: import('../tokenizers.js').PreTrainedTokenizer, { skip_prompt, callback_function, token_callback_function, decode_kwargs, ...kwargs }?: {
        skip_prompt?: boolean;
        callback_function?: any;
        token_callback_function?: any;
        decode_kwargs?: {};
    });
    tokenizer: import("../tokenizers.js").PreTrainedTokenizer;
    skip_prompt: boolean;
    callback_function: any;
    token_callback_function: any;
    decode_kwargs: {};
    token_cache: any[];
    print_len: number;
    next_tokens_are_prompt: boolean;
    /**
     * Prints the new text to stdout. If the stream is ending, also prints a newline.
     * @param {string} text
     * @param {boolean} stream_end
     */
    on_finalized_text(text: string, stream_end: boolean): void;
}
/**
 * Utility class to handle streaming of tokens generated by whisper speech-to-text models.
 * Callback functions are invoked when each of the following events occur:
 *  - A new chunk starts (on_chunk_start)
 *  - A new token is generated (callback_function)
 *  - A chunk ends (on_chunk_end)
 *  - The stream is finalized (on_finalize)
 */
export class WhisperTextStreamer extends TextStreamer {
    /**
     * @param {import('../tokenizers.js').WhisperTokenizer} tokenizer
     * @param {Object} options
     * @param {boolean} [options.skip_prompt=false] Whether to skip the prompt tokens
     * @param {function(string): void} [options.callback_function=null] Function to call when a piece of text is ready to display
     * @param {function(string): void} [options.token_callback_function=null] Function to call when a new token is generated
     * @param {function(number): void} [options.on_chunk_start=null] Function to call when a new chunk starts
     * @param {function(number): void} [options.on_chunk_end=null] Function to call when a chunk ends
     * @param {function(): void} [options.on_finalize=null] Function to call when the stream is finalized
     * @param {number} [options.time_precision=0.02] Precision of the timestamps
     * @param {boolean} [options.skip_special_tokens=true] Whether to skip special tokens when decoding
     * @param {Object} [options.decode_kwargs={}] Additional keyword arguments to pass to the tokenizer's decode method
     */
    constructor(tokenizer: import('../tokenizers.js').WhisperTokenizer, { skip_prompt, callback_function, token_callback_function, on_chunk_start, on_chunk_end, on_finalize, time_precision, skip_special_tokens, decode_kwargs, }?: {
        skip_prompt?: boolean;
        callback_function?: (arg0: string) => void;
        token_callback_function?: (arg0: string) => void;
        on_chunk_start?: (arg0: number) => void;
        on_chunk_end?: (arg0: number) => void;
        on_finalize?: () => void;
        time_precision?: number;
        skip_special_tokens?: boolean;
        decode_kwargs?: any;
    });
    timestamp_begin: number;
    on_chunk_start: (arg0: number) => void;
    on_chunk_end: (arg0: number) => void;
    on_finalize: () => void;
    time_precision: number;
    waiting_for_timestamp: boolean;
}
//# sourceMappingURL=streamers.d.ts.map