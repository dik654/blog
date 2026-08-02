import type { ReactNode } from 'react';

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="font-medium text-primary underline underline-offset-4">{children}</a>
);

export default function Terminology() {
  return (
    <section id="terms" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Wan2.2를 읽기 위한 용어 지도</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>기존 글로 연결되는 개념</h3>
        <ul>
          <li><strong>Diffusion</strong>: timestep을 따라 노이즈를 제거하는 생성 방식. 기본 흐름은 <A href="/lab/ai/diffusion-models">Diffusion Models 글</A> 참고.</li>
          <li><strong>VAE / latent</strong>: 비디오를 작게 압축해 DiT가 처리할 수 있게 만드는 표현. 기본 원리는 <A href="/lab/ai/vae">VAE 글</A> 참고.</li>
          <li><strong>Transformer / attention</strong>: DiT가 token 간 관계를 계산하는 기본 구조. <A href="/lab/ai/transformer-architecture">Transformer 아키텍처 글</A> 참고.</li>
          <li><strong>LoRA</strong>: Wan 계열 커뮤니티 fine-tuning에서 자주 쓰이는 저비용 적응 방식. <A href="/lab/ai/lora-finetuning">LoRA & QLoRA 글</A> 참고.</li>
        </ul>
        <h3>이 글에서 따로 설명하는 개념</h3>
        <ul>
          <li><strong>MoE</strong>: Mixture of Experts. Wan2.2 A14B에서는 timestep 구간별로 high-noise expert와 low-noise expert를 나눠 쓴다.</li>
          <li><strong>SNR</strong>: signal-to-noise ratio. 현재 latent에서 “신호가 노이즈보다 얼마나 강한가”를 나타내며 expert 전환 기준으로 쓰인다.</li>
          <li><strong>t_moe</strong>: high-noise expert에서 low-noise expert로 넘어가는 threshold timestep이다.</li>
          <li><strong>Ulysses</strong>: 긴 sequence를 여러 GPU에 나누는 sequence parallel inference 방식이다. Wan2.2 README는 FSDP와 함께 사용한다.</li>
          <li><strong>prompt extension</strong>: 짧은 prompt를 Qwen/Dashscope로 더 구체적인 장면 설명으로 확장하는 전처리다. 모델 구조는 아니지만 결과 품질에 크게 관여한다.</li>
        </ul>
      </div>
    </section>
  );
}
