/**
 *
 * @param {PretrainedConfig} config
 * @returns {Record<string, number[]>}
 */
export function getKeyValueShapes(config: PretrainedConfig, { prefix, }?: {
    prefix?: string;
}): Record<string, number[]>;
/**
 * Base class for all configuration classes. For more information, see the corresponding
 * [Python documentation](https://huggingface.co/docs/transformers/main/en/main_classes/configuration#transformers.PretrainedConfig).
 */
export class PretrainedConfig {
    /**
     * Loads a pre-trained config from the given `pretrained_model_name_or_path`.
     *
     * @param {string} pretrained_model_name_or_path The path to the pre-trained config.
     * @param {PretrainedOptions} options Additional options for loading the config.
     * @throws {Error} Throws an error if the config.json is not found in the `pretrained_model_name_or_path`.
     *
     * @returns {Promise<PretrainedConfig>} A new instance of the `PretrainedConfig` class.
     */
    static from_pretrained(pretrained_model_name_or_path: string, { progress_callback, config, cache_dir, local_files_only, revision, }?: PretrainedOptions): Promise<PretrainedConfig>;
    /**
     * Create a new PreTrainedTokenizer instance.
     * @param {Object} configJSON The JSON of the config.
     */
    constructor(configJSON: any);
    max_position_embeddings: any;
    model_type: any;
    is_encoder_decoder: boolean;
    normalized_config: any;
}
/**
 * Helper class which is used to instantiate pretrained configs with the `from_pretrained` function.
 *
 * @example
 * const config = await AutoConfig.from_pretrained('Xenova/bert-base-uncased');
 */
export class AutoConfig {
    /**
     * Loads a pre-trained config from the given `pretrained_model_name_or_path`.
     *
     * @param {string} pretrained_model_name_or_path The path to the pre-trained config.
     * @param {PretrainedOptions} options Additional options for loading the config.
     * @throws {Error} Throws an error if the config.json is not found in the `pretrained_model_name_or_path`.
     *
     * @returns {Promise<PretrainedConfig>} A new instance of the `PretrainedConfig` class.
     */
    static from_pretrained(pretrained_model_name_or_path: string, { progress_callback, config, cache_dir, local_files_only, revision, }?: import("./utils/hub.js").PretrainedOptions): Promise<PretrainedConfig>;
}
export type PretrainedOptions = import('./utils/hub.js').PretrainedOptions;
/**
 * Transformers.js-specific configuration, possibly present in config.json under the key `transformers.js_config`.
 */
export type TransformersJSConfig = {
    kv_cache_dtype?: import('./transformers.js').DataType;
};
//# sourceMappingURL=configs.d.ts.map