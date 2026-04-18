import DPOAlternativeDetailViz from './viz/DPOAlternativeDetailViz';
import CAIDetailViz from './viz/CAIDetailViz';
import M from '@/components/ui/math';

export default function Alignment() {
  return (
    <section id="alignment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RLHF 이후: 대안적 정렬 기법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RLHF의 한계 — 4개 모델 동시 운용, 보상 해킹, PPO 불안정성<br />
          이를 개선하는 다양한 대안이 등장
        </p>
        <h4>DPO 손실 함수</h4>
        <M display>{'\\mathcal{L}_{\\text{DPO}} = -\\mathbb{E}\\Big[\\log \\sigma\\Big(\\underbrace{\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)}}_{\\text{선호 응답 로그 비율}} - \\underbrace{\\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}}_{\\text{비선호 응답 로그 비율}}\\Big)\\Big]'}</M>
        <p className="text-sm text-muted-foreground mt-2">
          DPO — RM 없이 선호 데이터만으로 직접 정책 학습. β가 클수록 Reference에 가깝게 유지
        </p>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 mb-4 text-sm">
          {[
            { name: 'DPO', desc: 'RM 제거, 분류 손실로 직접 학습. 2 모델로 충분' },
            { name: 'Constitutional AI', desc: 'AI가 AI를 평가 → 인간 레이블 비용 제거' },
            { name: 'ORPO', desc: 'SFT + 정렬을 1단계로 통합, Reference 불필요' },
            { name: 'KTO', desc: '쌍별 비교 대신 이진 피드백, 전망이론 반영' },
          ].map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{p.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">DPO: RLHF의 직접 대안</h3>
        <div className="not-prose"><DPOAlternativeDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Constitutional AI</h3>
        <div className="not-prose"><CAIDetailViz /></div>
        <p className="leading-7">
          요약 1: <strong>DPO</strong>가 RLHF의 실질적 대안 — 2 모델로 충분, 안정적.<br />
          요약 2: <strong>Constitutional AI</strong>는 AI가 AI 평가 — 라벨링 비용 감소.<br />
          요약 3: 2024년 현재 <strong>DPO·CAI·RLAIF</strong>가 정렬의 주요 방향.
        </p>
      </div>
    </section>
  );
}
