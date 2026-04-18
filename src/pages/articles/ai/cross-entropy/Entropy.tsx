import EntropyViz from './viz/EntropyViz';
import EntropyDetailViz from './viz/EntropyDetailViz';

export default function Entropy({ title }: { title?: string }) {
  return (
    <section id="entropy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '엔트로피: 불확실성의 척도'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        H(P) = -Σ P(x)·log P(x) — 놀라움의 기대값.<br />
        편향된 분포 → 낮은 엔트로피, 균등 분포 → 높은 엔트로피.
      </p>
      <EntropyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">엔트로피 상세</h3>
        <EntropyDetailViz />

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Entropy와 "놀람"의 관계</p>
          <p>
            <strong>Shannon의 원래 동기</strong> (1948):<br />
            - 통신 채널의 정보 전송 한계 연구<br />
            - "압축 불가능한 정보의 최소량"<br />
            - 노이즈 있는 채널의 최대 전송 속도
          </p>
          <p className="mt-2">
            <strong>ML에서의 번역</strong>:<br />
            - Data의 "압축 어려움" = entropy<br />
            - 좋은 모델 = 실제 data entropy에 근사<br />
            - Cross-entropy loss의 의미: "model Q로 data P 인코딩 시 overhead"
          </p>
          <p className="mt-2">
            <strong>직관적 예</strong>:<br />
            - 영어 텍스트: ~1-1.5 bits/character (예측 가능)<br />
            - 랜덤 문자열: 4.7 bits/character (log2(26))<br />
            - Perfect LLM = 인간 수준 entropy에 근사<br />
            - Scaling laws = entropy 하한에 수렴 과정
          </p>
        </div>

      </div>
    </section>
  );
}
