import LtxTwoStageViz from './viz/LtxTwoStageViz';

export default function Inference() {
  return (
    <section id="inference" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">4단계: 실제 생성은 2단계 파이프라인으로 완성된다</h2>
      <div className="not-prose mb-8"><LtxTwoStageViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          공개 2단계 파이프라인 코드를 따라가면 실제 추론은 더 구체적이다. PromptEncoder가 positive/negative prompt를 받아
          영상 context와 오디오 context를 만든다. Stage 1은 목표 해상도의 절반 크기 잠재 표현을 만들고, full model guidance를 적용한다.
          이때 이미지 조건이 있으면 image VAE latent가 특정 frame 또는 conditioning slot에 들어간다.
        </p>
        <p>
          Stage 1이 끝나면 영상 잠재 표현만 spatial upsampler로 커진다. Stage 2는 확대된 영상 잠재 표현과 stage 1 오디오 잠재 표현을
          초기값으로 받아 distilled LoRA가 붙은 노이즈 제거 단계를 수행한다. 즉 LTX-2.3 실사용 파이프라인은
          “한 번 생성하고 끝”이 아니라 <strong>저해상도 구조 생성 → latent upsample → 고해상도 refinement</strong>다.
        </p>
        <p>
          이 구조를 한 문장으로 줄이면, LTX-2.3은 <strong>오디오와 영상을 같은 디퓨전 시간표 위에서 함께 노이즈 제거하는
          latent-space dual-stream transformer</strong>다. 빠른 생성은 VAE 압축에서, 동기화는 cross-attention에서,
          실사용 품질은 decoder/upscaler 후처리에서 나온다.
        </p>
        <p>
          실제 <code>TI2VidTwoStagesPipeline</code> 코드 기준으로는 Stage 1이 half-resolution latent를 만들고, spatial upsampler가
          영상 잠재 표현을 키운 뒤, Stage 2가 distilled LoRA와 짧은 sigma schedule로 refinement를 수행한다.
          따라서 “LTX-2.3 모델 하나”라고 말하더라도 실사용 결과는 체크포인트, distilled LoRA, spatial upscaler,
          Gemma text encoder, guider, scheduler가 결합된 pipeline 산출물이다.
        </p>
      </div>
    </section>
  );
}
