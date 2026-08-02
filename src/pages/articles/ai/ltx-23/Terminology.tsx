import type { ReactNode } from 'react';

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} className="font-medium text-primary underline underline-offset-4">{children}</a>
);

export default function Terminology() {
  return (
    <section id="terms" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">읽기 전에 정리할 핵심 용어</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 글은 LTX-2.3을 구조적으로 따라가므로 약어가 자주 나온다. 기존 블로그에서 이미 다룬 개념은 링크로 연결하고,
          LTX-2.3 문맥에서 새로 필요한 용어는 여기서 먼저 정리한다.
        </p>
        <h3>기존 글과 연결되는 개념</h3>
        <ul>
          <li><strong>Diffusion</strong>: 노이즈에서 시작해 단계적으로 깨끗한 샘플을 만드는 생성 방식. 기본 흐름은 <A href="/lab/ai/diffusion-models">Diffusion Models 글</A> 참고.</li>
          <li><strong>CFG</strong>: 조건부 예측과 비조건부 예측의 차이를 키워 prompt 충실도를 높이는 기법. <A href="/lab/ai/diffusion-models#stable-diffusion">Stable Diffusion/CFG 설명</A>과 연결된다.</li>
          <li><strong>VAE / latent</strong>: 원본 픽셀을 작은 잠재 표현으로 압축했다가 다시 복원하는 구조. 기본 원리는 <A href="/lab/ai/vae">VAE 글</A> 참고.</li>
          <li><strong>Transformer, attention, RoPE</strong>: token들이 서로를 참조하는 구조와 위치 인코딩. 기본 구조는 <A href="/lab/ai/transformer-architecture">Transformer 아키텍처 글</A> 참고.</li>
          <li><strong>LoRA</strong>: 큰 모델의 일부 저랭크 행렬만 학습해 적은 비용으로 조정하는 방식. 실전 파인튜닝은 <A href="/lab/ai/lora-finetuning">LoRA & QLoRA 글</A> 참고.</li>
        </ul>
        <h3>이 글 안에서 새로 설명하는 개념</h3>
        <ul>
          <li><strong>DiT</strong>: Diffusion Transformer. U-Net 대신 Transformer가 latent의 노이즈 제거 방향을 예측한다.</li>
          <li><strong>patchifier</strong>: VAE가 만든 3D latent grid를 Transformer가 읽을 수 있는 토큰 시퀀스로 바꾸는 단계다.</li>
          <li><strong>STG</strong>: Spatio-Temporal Guidance. 특정 transformer block을 교란한 예측에서 멀어지게 해 시간 구조를 안정화하는 guidance다.</li>
          <li><strong>modality CFG</strong>: audio와 video가 서로 맞지 않는 결과에서 멀어지도록 유도하는 LTX-2의 multimodal guidance 축이다.</li>
          <li><strong>cross-modality AdaLN</strong>: 한 modality의 hidden state가 다른 modality stream의 normalization scale/shift에 영향을 주는 동기화 장치다.</li>
        </ul>
      </div>
    </section>
  );
}
