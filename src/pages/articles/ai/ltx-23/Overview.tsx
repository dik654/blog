import { CitationBlock } from '@/components/ui/citation';
import LtxPipelineViz from './viz/LtxPipelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LTX-2.3에서 공개된 부분과 비공개로 남은 부분</h2>
      <div className="not-prose mb-8"><LtxPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LTX-2.3은 Lightricks의 공개 audio-video 생성 모델 계열이다. 구조를 볼 때 가장 중요한 점은
          <strong> 공개된 구조</strong>와 <strong>공개되지 않은 학습 절차</strong>를 섞지 않는 것이다.
          GitHub와 Hugging Face에는 2.3 checkpoint, inference package, trainer, ComfyUI 연동이 공개되어 있지만,
          전체 pretraining 데이터셋과 정확한 대규모 학습 스케줄은 완전 재현 가능한 형태로 공개된 것은 아니다.
        </p>
        <p>
          따라서 이 글의 목표는 “LTX-2.3을 똑같이 처음부터 학습하는 법”이 아니다. 공개 논문, 모델 저장소,
          파이프라인 코드에서 확인 가능한 구조를 바탕으로 입력이 어떻게 잠재 토큰이 되고, dual-stream DiT가
          어떻게 video/audio를 함께 denoise하며, 마지막에 어떤 후처리 단계로 결과가 만들어지는지 따라가는 것이다.
        </p>
        <CitationBlock source="Lightricks/LTX-2 GitHub" citeKey={1} type="code" href="https://github.com/Lightricks/LTX-2">
          <p>
            공개 저장소는 LTX-2 계열의 Python inference package와 LoRA/full fine-tuning 도구,
            LTX-2.3 checkpoint 다운로드 지침, spatial upscaler 요구 사항을 제공한다.
          </p>
        </CitationBlock>
        <CitationBlock source="LTX-2 Technical Report / arXiv 2601.03233" citeKey={2} href="https://arxiv.org/abs/2601.03233">
          <p>
            LTX-2 논문은 modality-specific VAE, 비대칭 dual-stream DiT, video/audio cross-attention,
            temporal conditioning, modality guidance를 핵심 구조로 설명한다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
