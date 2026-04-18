import { CitationBlock } from '@/components/ui/citation';
import KTOViz from './viz/KTOViz';
import KTOProspectDetailViz from './viz/KTOProspectDetailViz';
import KTOPracticalDetailViz from './viz/KTOPracticalDetailViz';

export default function KTO() {
  return (
    <section id="kto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KTO: Kahneman-Tversky Optimization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>핵심 아이디어</strong> — 쌍별 비교(y_w vs y_l) 대신 단일 응답의 좋음/나쁨 이진 피드백<br />
          Kahneman-Tversky 전망이론: 손실 회피(loss aversion) 비대칭을 손실 함수에 반영
        </p>
      </div>

      <KTOViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="Ethayarajh et al., 2024 — KTO" citeKey={5} type="paper"
          href="https://arxiv.org/abs/2402.01306">
          <p className="italic text-sm">
            "KTO does not need paired preference data. It can learn from binary 'good'/'bad'
            signals, making it applicable to existing thumbs-up/down feedback."
          </p>
          <p className="mt-2 text-xs">
            전망이론의 핵심: v(loss) {'>'} v(gain) — 같은 크기의 손실이 이득보다 심리적 영향이 큼<br />
            KTO는 이를 반영하여 나쁜 응답 억제에 더 큰 가중치를 부여
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">DPO vs KTO 비교</h3>
        <p>
          <strong>데이터</strong> — DPO: (y_w, y_l) 쌍 필수 / KTO: 단일 응답 + 이진 피드백<br />
          <strong>성능</strong> — Llama-7B 기준 동등 (MT-Bench, AlpacaEval)<br />
          <strong>효율</strong> — KTO가 데이터 효율 ~25% 더 높음 (동일 데이터 양 대비)<br />
          <strong>활용</strong> — 기존 평점/좋아요 데이터 직접 사용 가능
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">전망이론 (Prospect Theory) 배경</h3>
        <div className="not-prose"><KTOProspectDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">KTO 실무 장점</h3>
        <div className="not-prose"><KTOPracticalDetailViz /></div>
        <p className="leading-7">
          요약 1: KTO는 <strong>Kahneman-Tversky 전망이론</strong> 영감 — 손실 회피 내재화.<br />
          요약 2: <strong>Binary feedback</strong>만으로 학습 — 기존 프로덕션 데이터 활용.<br />
          요약 3: 데이터 효율 <strong>25% 향상</strong> — 불균형·노이즈에 강함.
        </p>
      </div>
    </section>
  );
}
