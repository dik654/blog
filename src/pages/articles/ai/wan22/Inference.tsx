import WanRuntimeViz from './viz/WanRuntimeViz';

export default function Inference() {
  return (
    <section id="inference" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">5단계: 추론 경로와 운영 포인트</h2>
      <div className="not-prose mb-8"><WanRuntimeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Wan2.2 inference는 조건 준비에서 시작한다. prompt extension을 켜면 짧은 prompt가 장면 묘사로 확장되고,
          image-to-video라면 입력 이미지가 추가 조건이 된다. 그 다음 latent noise를 만들고, sampler가 timestep을 따라
          Wan DiT denoiser를 반복 호출한다.
        </p>
        <p>
          A14B 모델은 GPU 메모리 요구량이 크다. 공식 실행 예시는 단일 GPU에서 80GB VRAM을 언급하고,
          FSDP와 DeepSpeed Ulysses를 이용한 multi-GPU inference도 제공한다. 반면 TI2V-5B는 offload, dtype conversion,
          T5 CPU 옵션과 함께 4090급 GPU에서도 시도할 수 있는 경로로 안내된다.
        </p>
        <p>
          운영 관점에서 Wan2.2는 “하나의 모델을 그냥 호출한다”보다 “task별 checkpoint + prompt extension +
          memory/offload policy + VAE decode”의 조합으로 이해하는 편이 맞다. 특히 MoE A14B와 TI2V-5B는 목적이 다르므로,
          품질 우선인지 접근성/속도 우선인지에 따라 선택이 달라진다.
        </p>
        <p>
          A14B는 품질과 capacity를 우선하는 경로라서 80GB 단일 GPU 또는 FSDP+Ulysses multi-GPU 실행이 자연스럽다.
          TI2V-5B는 <code>--offload_model</code>, <code>--convert_model_dtype</code>, <code>--t5_cpu</code> 같은 옵션으로
          24GB급 환경을 겨냥한다. 따라서 두 모델은 같은 Wan2.2 이름 아래 있지만 운영 기준은 완전히 다르다.
        </p>
      </div>
    </section>
  );
}
