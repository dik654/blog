export default function Alignment() {
  return (
    <section id="alignment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RLHF 이후: 대안적 정렬 기법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RLHF의 한계 — 4개 모델 동시 운용, 보상 해킹, PPO 불안정성<br />
          이를 개선하는 다양한 대안이 등장
        </p>
        <p>
          <strong>DPO</strong> — 보상 모델 제거, 단일 분류 손실로 직접 정책 학습<br />
          <strong>Constitutional AI</strong> — AI 자기 평가로 인간 레이블 제거<br />
          <strong>ORPO</strong> — SFT + 정렬 1단계 통합, Reference 모델 불필요<br />
          <strong>KTO</strong> — 쌍별 비교 대신 이진 피드백, 전망이론 반영
        </p>
        <p>
          → 각 기법의 수식 전개와 상세 비교는{' '}
          <strong>LLM 정렬 기법: DPO · CAI · ORPO · KTO</strong> 아티클에서 다룸
        </p>
      </div>
    </section>
  );
}
