import { CitationBlock } from '@/components/ui/citation';
import WanMoeViz from './viz/WanMoeViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Wan2.2의 핵심: 노이즈 구간을 나누는 MoE 디퓨전</h2>
      <div className="not-prose mb-8"><WanMoeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Wan2.2는 Alibaba/Wan 계열의 공개 비디오 생성 모델이다. GitHub 저장소는 추론 코드,
          모델 가중치, Diffusers/ComfyUI 연동, 여러 작업별 체크포인트를 공개한다. 핵심 업데이트는
          <strong> 디퓨전의 노이즈 제거 과정을 전문가별로 나누는 MoE 구조</strong>다.
        </p>
        <p>
          여기서 MoE는 LLM처럼 토큰마다 여러 전문가를 라우팅하는 그림과 조금 다르게 이해하는 편이 좋다.
          Wan2.2의 설명은 노이즈 제거 시간 축을 나누는 쪽에 가깝다. 초반 고노이즈 구간은 전역 구도와 움직임을,
          후반 저노이즈 구간은 질감과 세부 묘사를 담당하도록 전문가를 분리해 전체 표현력을 키운다.
        </p>
        <CitationBlock source="Wan-Video/Wan2.2 GitHub" citeKey={1} type="code" href="https://github.com/Wan-Video/Wan2.2">
          <p>
            공식 저장소는 Wan2.2가 video diffusion에 MoE를 도입했고, T2V-A14B, I2V-A14B, TI2V-5B,
            S2V-14B, Animate-14B 모델과 inference 실행법을 공개한다고 설명한다.
          </p>
        </CitationBlock>
        <CitationBlock source="Wan: Open and Advanced Large-Scale Video Generative Models" citeKey={2} href="https://arxiv.org/abs/2503.20314">
          <p>
            Wan 논문은 대규모 비디오 생성 모델 계열의 VAE, DiT 기반 생성 구조, 데이터와 평가 체계를 설명하는
            1차 문헌이다. Wan2.2 세부 구현은 저장소와 모델 카드의 업데이트를 함께 봐야 한다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
