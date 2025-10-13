export class Phi3VProcessor extends Processor {
    static image_processor_class: typeof AutoImageProcessor;
    static tokenizer_class: typeof AutoTokenizer;
    /**
     *
     * @param {string|string[]} text
     * @param {RawImage|RawImage[]} images
     * @param  {...any} args
     * @returns {Promise<any>}
     */
    _call(text: string | string[], images?: RawImage | RawImage[], { padding, truncation, num_crops, }?: any[]): Promise<any>;
}
import { Processor } from "../../base/processing_utils.js";
import { RawImage } from "../../utils/image.js";
import { AutoImageProcessor } from "../auto/image_processing_auto.js";
import { AutoTokenizer } from "../../tokenizers.js";
//# sourceMappingURL=processing_phi3_v.d.ts.map