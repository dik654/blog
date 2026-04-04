import EvalPipelineViz from './viz/EvalPipelineViz';
import { benchmarkTable } from './evalData';

export default function Evaluation() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">평가 벤치마킹</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Open R1의 평가 시스템 — <strong>LightEval</strong> 프레임워크 기반<br />
          수학, 코딩, 과학 추론 등 다양한 영역에서 모델 성능을 종합 평가<br />
          vLLM 백엔드로 고속 추론 + Slurm으로 클러스터 배치 평가 지원
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">평가 파이프라인</h3>
      </div>

      <EvalPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">지원 벤치마크</h3>
        <div className="overflow-x-auto not-prose mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">벤치마크</th>
                <th className="text-left py-2 px-3">영역</th>
                <th className="text-right py-2 px-3">문제 수</th>
                <th className="text-left py-2 px-3">난이도</th>
                <th className="text-left py-2 px-3">평가 방식</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkTable.map(b => (
                <tr key={b.name} className="border-b border-border/40">
                  <td className="py-2 px-3 font-medium">{b.name}</td>
                  <td className="py-2 px-3">{b.domain}</td>
                  <td className="py-2 px-3 text-right font-mono">{b.count}{b.count === 400 ? '+' : ''}</td>
                  <td className="py-2 px-3 text-muted-foreground">{b.level}</td>
                  <td className="py-2 px-3 text-muted-foreground">{b.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          <strong>Slurm 클러스터 배치</strong> — 30B+ 모델은 자동으로 텐서 병렬화 적용<br />
          결과는 HuggingFace Hub의 open-r1-eval-leaderboard에 자동 업로드
        </p>

        <p className="mt-4">
          <strong>자동 GPU 감지</strong>: 모델 파라미터 수에 따라 GPU 할당 결정<br />
          30B 이상 → 텐서 병렬, 그 이하 → 데이터 병렬(2 GPU)<br />
          평가 시 <code>ACCELERATE_USE_DEEPSPEED=false</code>로 DeepSpeed 충돌 방지
        </p>
      </div>
    </section>
  );
}
