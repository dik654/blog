import PrecisionLadderViz from './viz/PrecisionLadderViz';

const FORMATS = [
  { format: 'FP32', bits: 32, mem: '28 GB', speed: '1×', use: '학습 기본', color: '#ef4444' },
  { format: 'FP16 / BF16', bits: 16, mem: '14 GB', speed: '~2×', use: '학습·추론 표준', color: '#f59e0b' },
  { format: 'INT8', bits: 8, mem: '7 GB', speed: '~3×', use: 'PTQ/QAT 서빙', color: '#3b82f6' },
  { format: 'INT4', bits: 4, mem: '3.5 GB', speed: '~4×', use: 'GPTQ/AWQ 서빙', color: '#10b981' },
  { format: 'FP4/NF4', bits: 4, mem: '3.5 GB', speed: '~3×', use: 'QLoRA 학습', color: '#8b5cf6' },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">양자화가 왜 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>핵심 질문</strong> — 모델 정밀도를 낮추면 메모리·속도가 얼마나 개선되고, 정확도는 얼마나 잃는가?<br />
          양자화(Quantization): 신경망 가중치·활성값을 높은 정밀도(FP32)에서 낮은 정밀도(INT8, INT4)로 변환하는 기법.
          비트 수가 절반이 될 때마다 메모리와 연산 대역폭이 절반으로 감소
        </p>
        <p>
          7B 모델 기준 FP32 = 28GB, INT4 = 3.5GB — <strong>8배 차이</strong>.
          VRAM 22.4GB 제약이 있는 대회 환경에서 양자화는 선택이 아닌 필수.
          1.2B 모델도 FP16(2.4GB)에서 INT4(0.6GB)로 줄이면 같은 VRAM에서 batch size를 4배 키울 수 있음
        </p>
      </div>

      <div className="not-prose overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3">포맷</th>
              <th className="text-left py-2 px-3">비트</th>
              <th className="text-left py-2 px-3">메모리 (7B)</th>
              <th className="text-left py-2 px-3">속도 향상</th>
              <th className="text-left py-2 px-3">주 용도</th>
            </tr>
          </thead>
          <tbody>
            {FORMATS.map(f => (
              <tr key={f.format} className="border-b border-border/40">
                <td className="py-2 px-3 font-semibold" style={{ color: f.color }}>{f.format}</td>
                <td className="py-2 px-3 font-mono text-xs">{f.bits}bit</td>
                <td className="py-2 px-3">{f.mem}</td>
                <td className="py-2 px-3">{f.speed}</td>
                <td className="py-2 px-3 text-muted-foreground">{f.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PrecisionLadderViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: 양자화의 핵심은 <strong>실수 → 정수 매핑</strong> — scale과 zero_point로 범위를 압축<br />
          요약 2: 신경망 가중치가 0 근처 정규분포를 따르기 때문에 <strong>적은 비트로도 충분히 근사</strong> 가능<br />
          요약 3: 이후 섹션에서 PTQ → QAT → GPTQ/AWQ → 실전 순으로 깊이 있게 다룸
        </p>
      </div>
    </section>
  );
}
