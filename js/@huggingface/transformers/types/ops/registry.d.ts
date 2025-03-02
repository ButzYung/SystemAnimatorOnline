export class TensorOpRegistry {
    static session_options: {};
    static get bilinear_interpolate_4d(): Promise<(arg0: Record<string, Tensor>) => Promise<Tensor>>;
    static get bicubic_interpolate_4d(): Promise<(arg0: Record<string, Tensor>) => Promise<Tensor>>;
    static get matmul(): Promise<(arg0: Record<string, Tensor>) => Promise<Tensor>>;
    static get stft(): Promise<(arg0: Record<string, Tensor>) => Promise<Tensor>>;
    static get rfft(): Promise<(arg0: Record<string, Tensor>) => Promise<Tensor>>;
    static get top_k(): Promise<(arg0: Record<string, Tensor>) => Promise<[Tensor, Tensor]>>;
}
import { Tensor } from "../utils/tensor.js";
//# sourceMappingURL=registry.d.ts.map