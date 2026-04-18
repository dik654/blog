import FewShotViz from './viz/FewShotViz';
import { DesignViz, ICLViz } from './viz/FewShotDetailViz';

export default function FewShot() {
  return (
    <section id="few-shot" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Few-shot 예시 설계</h2>
      <div className="not-prose mb-8"><FewShotViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Few-shot</strong>(소수 예시 학습) — 입출력 쌍을 프롬프트에 포함해 LLM이 패턴을 학습하도록 유도<br />
          0-shot → 1-shot에서 가장 큰 점프, 3-shot 이후 수확 체감
        </p>
        <p>
          예시 품질이 핵심 — 다양한 카테고리 + 엣지케이스 포함이 필수<br />
          LLM은 마지막 예시에 더 큰 영향을 받는 Recency Bias(최신성 편향) 존재<br />
          대표적 예시를 마지막에 배치하거나 순서를 셔플해 편향 완화
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Few-shot 예시 설계 원칙</h3>
        <div className="not-prose mb-6"><DesignViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">In-Context Learning 메커니즘</h3>
        <div className="not-prose mb-6"><ICLViz /></div>
        <p className="leading-7">
          요약 1: <strong>3~5 shot</strong>이 실무 표준 — 그 이상은 수확 체감.<br />
          요약 2: <strong>다양성·형식 일관성·순서</strong>가 성능에 결정적.<br />
          요약 3: ICL의 본질은 <strong>패턴 학습</strong> — 라벨 정확도보다 형식 중요.
        </p>
      </div>
    </section>
  );
}
