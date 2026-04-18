import TaskFinetuneViz from './viz/TaskFinetuneViz';

const TASK_COMPARISON = [
  { task: '텍스트 분류', head: 'Linear + Softmax', loss: 'Cross-Entropy', data: '500~5K', example: '감성 분석, 독성 탐지' },
  { task: '회귀', head: 'Linear', loss: 'MSE / Huber', data: '1K~10K', example: '약물 활성도(IC50), 점수 예측' },
  { task: '시퀀스 라벨링', head: 'Linear + CRF', loss: 'CRF Loss', data: '1K~5K', example: 'NER (유전자명, 질병명 추출)' },
  { task: '문장 쌍 분류', head: 'Siamese + Linear', loss: 'CE / Contrastive', data: '5K~50K', example: '중복 탐지, 유사도 판정' },
];

export default function TaskFinetune() {
  return (
    <section id="task-finetune" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Task-specific Fine-tuning</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>핵심 아이디어</strong> — 도메인 적응이 완료된 인코더 위에 목적별 헤드(Head)를 추가하여 최종 태스크를 학습.<br />
          인코더는 이미 도메인 지식을 보유하므로, 소량 라벨 데이터(100~1000개)로도 높은 성능 달성이 가능하다.
        </p>
        <p>
          <strong>이중 학습률(Discriminative LR)</strong> 전략이 핵심: 인코더 하위 레이어 → 극히 낮은 LR(1e-6), 상위 레이어 → 중간 LR(1e-5), 헤드 → 높은 LR(1e-4).<br />
          사전학습 지식을 보존하면서 태스크에 특화된 표현만 미세 조정한다.
        </p>
        <p>
          라벨 데이터가 극소량(8~50개)인 경우, <strong>Prompt-tuning</strong>(MLM 재활용), <strong>In-context Learning</strong>(예시 기반 추론),
          <strong>SetFit</strong>(Contrastive + 소형 분류헤드)로 Few-shot 학습이 가능.<br />
          특히 SetFit은 라벨 8개만으로 전통적 fine-tuning의 90% 이상 성능을 달성하여 대회·실무에서 널리 사용된다.
        </p>
      </div>

      <div className="not-prose overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">태스크</th>
              <th className="text-left py-2 px-3">Head 구조</th>
              <th className="text-left py-2 px-3">Loss</th>
              <th className="text-left py-2 px-3">권장 데이터</th>
              <th className="text-left py-2 px-3">예시</th>
            </tr>
          </thead>
          <tbody>
            {TASK_COMPARISON.map(t => (
              <tr key={t.task} className="border-b border-border/40">
                <td className="py-2 px-3 font-semibold">{t.task}</td>
                <td className="py-2 px-3 font-mono text-xs">{t.head}</td>
                <td className="py-2 px-3 font-mono text-xs">{t.loss}</td>
                <td className="py-2 px-3">{t.data}</td>
                <td className="py-2 px-3 text-muted-foreground">{t.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">태스크 헤드 & 소량 학습 & Few-shot</h3>
        <div className="not-prose"><TaskFinetuneViz /></div>
        <p className="leading-7">
          요약 1: 도메인 적응 모델 + <strong>이중 학습률</strong>로 소량 라벨 데이터 효율 극대화.<br />
          요약 2: 라벨 500개로 미적응 모델 5000개 수준 달성 → <strong>라벨링 비용 10배 절감</strong>.<br />
          요약 3: 라벨이 극소량이면 <strong>SetFit</strong>(8개)이나 <strong>Prompt-tuning</strong>(0개)으로 대응.
        </p>
      </div>
    </section>
  );
}
