import PeftCompareViz from './viz/PeftCompareViz';

const MEMORY_TABLE = [
  { model: 'LLaMA-2 7B', params: '7B', fp16: '14GB', train: '~112GB', gpus: 'A100 x2' },
  { model: 'LLaMA-2 13B', params: '13B', fp16: '26GB', train: '~210GB', gpus: 'A100 x3' },
  { model: 'LLaMA-2 70B', params: '70B', fp16: '140GB', train: '~1.1TB', gpus: 'A100 x16' },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Full Fine-tuning의 한계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>핵심 질문</strong> — 사전학습된 LLM을 내 도메인에 맞추려면, 모든 파라미터를 갱신해야 할까?<br />
          Full fine-tuning은 모델 전체 가중치를 갱신하므로 기울기, 옵티마이저 상태(Adam의 m, v)까지 GPU 메모리에 올려야 한다.
          7B 모델조차 FP16 학습에 100GB 이상의 VRAM이 필요하며, 이는 A100 80GB 단일 GPU로도 부족하다.
        </p>
        <p>
          <strong>PEFT(Parameter-Efficient Fine-Tuning)</strong>는 이 문제의 해법 — 전체 파라미터 중 극소수(0.1~3%)만 학습하여 메모리와 비용을 1/10 이하로 줄인다.
          2021년 이후 Adapter, Prefix-tuning, LoRA 등 다양한 기법이 제안되었고, 그 중 <strong>LoRA</strong>가 추론 오버헤드 없음 + 간결한 구현으로 사실상 표준이 되었다.
        </p>
      </div>

      <div className="not-prose overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">모델</th>
              <th className="text-left py-2 px-3">파라미터</th>
              <th className="text-left py-2 px-3">가중치(FP16)</th>
              <th className="text-left py-2 px-3">Full FT 메모리</th>
              <th className="text-left py-2 px-3">필요 GPU</th>
            </tr>
          </thead>
          <tbody>
            {MEMORY_TABLE.map(row => (
              <tr key={row.model} className="border-b border-border/40">
                <td className="py-2 px-3 font-semibold">{row.model}</td>
                <td className="py-2 px-3 font-mono text-xs">{row.params}</td>
                <td className="py-2 px-3">{row.fp16}</td>
                <td className="py-2 px-3 text-red-500 font-semibold">{row.train}</td>
                <td className="py-2 px-3 text-muted-foreground">{row.gpus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">PEFT 기법 비교: Adapter vs Prefix vs LoRA</h3>
        <p>
          세 기법 모두 사전학습 가중치를 고정(frozen)하고 소규모 학습 가능한 파라미터만 추가한다는 공통점이 있다.
          차이는 파라미터를 어디에 어떻게 추가하는지에 있다.
        </p>
      </div>

      <div className="not-prose"><PeftCompareViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          핵심 1: <strong>Adapter</strong>는 레이어 사이에 소형 MLP를 삽입 — 직렬 추가이므로 추론 시 지연 발생.<br />
          핵심 2: <strong>Prefix-tuning</strong>은 어텐션 키/값에 학습 벡터 추가 — 유효 컨텍스트 길이 감소.<br />
          핵심 3: <strong>LoRA</strong>는 가중치 변화를 저랭크 행렬로 분해 — 배포 시 원본에 병합하면 추론 오버헤드 제로.
        </p>
      </div>
    </section>
  );
}
