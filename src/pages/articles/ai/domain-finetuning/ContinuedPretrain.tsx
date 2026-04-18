import ContinuedPretrainViz from './viz/ContinuedPretrainViz';

const HYPERPARAMS = [
  { param: 'Learning Rate', base: '1e-4 ~ 3e-4', adapted: '1e-6 ~ 5e-6', note: '원래의 1/10~1/50' },
  { param: 'Epochs', base: '40 ~ 100+', adapted: '1 ~ 5', note: '과적합 방지 (조기 종료)' },
  { param: 'Batch Size', base: '256 ~ 4096', adapted: '16 ~ 64', note: '도메인 데이터 크기에 비례' },
  { param: 'Warmup', base: '1~2%', adapted: '5~10%', note: '안정적 적응 유도' },
  { param: 'Weight Decay', base: '0.01', adapted: '0.01 ~ 0.1', note: '과적합 억제 강화' },
];

export default function ContinuedPretrain() {
  return (
    <section id="continued-pretrain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Continued Pretraining 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>핵심 아이디어</strong> — 범용 사전학습 모델의 가중치를 초기값으로 사용하고, 도메인 코퍼스로 MLM(Masked Language Modeling) 또는 CLM(Causal Language Modeling)을 추가 수행.<br />
          이 과정에서 모델이 도메인 어휘의 문맥 관계, 전문 용어 간 의미 연결, 도메인 특유의 구문 패턴을 내재화한다.
        </p>
        <p>
          <strong>MLM</strong>은 입력 토큰의 15%를 [MASK]로 치환하고 예측하는 양방향 학습 — BERT 계열에 사용.<br />
          <strong>CLM</strong>은 이전 토큰으로부터 다음 토큰을 예측하는 자기회귀 학습 — GPT 계열에 사용.<br />
          도메인 적응에서는 MLM이 분류·추출 태스크에 유리하고, CLM은 생성 태스크에 유리하다.
        </p>
        <p>
          <strong>핵심 주의점</strong>: 학습률(Learning Rate)이 너무 높으면 사전학습 지식이 파괴(catastrophic forgetting)되고,
          너무 낮으면 도메인 적응이 불충분하다. 원래 사전학습 LR의 1/10 수준이 경험적 최적.
        </p>
      </div>

      <div className="not-prose overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">하이퍼파라미터</th>
              <th className="text-left py-2 px-3">원래 사전학습</th>
              <th className="text-left py-2 px-3">Continued Pretrain</th>
              <th className="text-left py-2 px-3">비고</th>
            </tr>
          </thead>
          <tbody>
            {HYPERPARAMS.map(h => (
              <tr key={h.param} className="border-b border-border/40">
                <td className="py-2 px-3 font-semibold">{h.param}</td>
                <td className="py-2 px-3 font-mono text-xs">{h.base}</td>
                <td className="py-2 px-3 font-mono text-xs text-emerald-600 dark:text-emerald-400">{h.adapted}</td>
                <td className="py-2 px-3 text-muted-foreground">{h.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">MLM/CLM 학습 & 망각 방지 & 데이터량 효과</h3>
        <div className="not-prose"><ContinuedPretrainViz /></div>
        <p className="leading-7">
          요약 1: Continued Pretrain은 <strong>기존 가중치 위에 도메인 지식을 점진적으로 쌓는</strong> 과정.<br />
          요약 2: 학습률은 원래의 <strong>1/10 수준</strong>이 최적 — 너무 높으면 사전학습 지식 파괴, 너무 낮으면 적응 부족.<br />
          요약 3: 카타스트로픽 망각 방지의 가장 실용적 방법은 <strong>일반 데이터 5~10% 혼합</strong>.<br />
          요약 4: 도메인 데이터 <strong>1M~10M 토큰</strong> 구간에서 비용 대비 효과가 가장 높음 — 그 이상은 수확 체감.
        </p>
      </div>
    </section>
  );
}
