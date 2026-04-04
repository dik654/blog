import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const teCode = `# nvidia-transformer-engine 사용 예시 (PyTorch)
import transformer_engine.pytorch as te

# 기존 nn.Linear 대신 te.Linear 사용
model = te.TransformerLayer(
    hidden_size=4096,
    ffn_hidden_size=16384,
    num_attention_heads=32,
    # FP8 자동 활성화 (per-tensor 스케일링)
)

# FP8 컨텍스트 매니저로 학습
with te.fp8_autocast(enabled=True):
    output = model(input_tensor)
    loss = criterion(output, target)
    loss.backward()  # 그래디언트도 FP8(E5M2) 자동 적용`;

const teAnnotations = [
  { lines: [4, 9] as [number, number], color: 'sky' as const, note: 'te.TransformerLayer: drop-in 교체' },
  { lines: [12, 15] as [number, number], color: 'emerald' as const, note: 'fp8_autocast: 자동 혼합 정밀도' },
];

const scalingCode = `Per-tensor 동적 스케일링 과정:

1. Forward pass 실행 (FP8 E4M3)
   ├─ 각 텐서의 amax(절대 최대값) 기록
   └─ amax history window (최근 N step) 유지

2. Scale factor 계산
   ├─ scale = FP8_MAX / amax_history.max()
   └─ 오버플로 방지 + 정밀도 최대화

3. Backward pass 실행 (FP8 E5M2)
   ├─ 그래디언트는 동적 범위가 넓은 E5M2 사용
   └─ 별도 scale factor로 그래디언트 스케일링

4. 정밀도 판단: amax가 FP8 범위 초과 시 FP16 fallback`;

export default function TransformerEngine() {
  return (
    <section id="transformer-engine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Transformer Engine & FP8 학습</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Transformer Engine은 H100의 4세대 Tensor Core와 소프트웨어가 협력하는 혼합 정밀도 시스템입니다.<br />
          GEMM 연산을 FP8로 수행하되, 누적(accumulation)은 FP32로 유지합니다.<br />
          FP16 대비 <strong>연산 처리량 2배</strong>, 메모리 사용량 절반을 달성하면서 학습 정확도 손실은 거의 없습니다.
        </p>

        <CitationBlock source="NVIDIA Transformer Engine Documentation" citeKey={5} type="paper"
          href="https://docs.nvidia.com/deeplearning/transformer-engine/">
          <p className="italic">"Transformer Engine automatically manages mixed FP8/FP16 precision on a per-tensor
          basis, using delayed scaling to maximize FP8 utilization while preserving convergence."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Per-tensor 동적 스케일링</h3>
        <p className="leading-7">
          FP8의 좁은 표현 범위를 보상하기 위해, 각 텐서마다 독립적인 scale factor를 유지합니다.<br />
          매 스텝마다 텐서의 <strong>amax(절대 최대값)</strong>를 기록하고, 이력 윈도우를 기반으로 최적 스케일을 계산합니다.<br />
          이를 <strong>delayed scaling</strong>이라 부릅니다. 현재 스텝이 아닌 이전 스텝 통계를 사용하므로 오버헤드가 최소화됩니다.
        </p>

        <CodePanel title="Per-tensor 동적 스케일링 과정" code={scalingCode} />

        <h3 className="text-xl font-semibold mt-6 mb-3">PyTorch 통합</h3>
        <p className="leading-7">
          <code>nvidia-transformer-engine</code>은 PyTorch/JAX를 지원합니다.
          <code>nn.Linear</code>를 <code>te.Linear</code>로 교체하고 <code>fp8_autocast</code>로 감싸면 FP8이 자동 적용됩니다.
        </p>
        <CodePanel title="Transformer Engine 사용 예시" code={teCode} lang="python" annotations={teAnnotations} />

        <h3 className="text-xl font-semibold mt-6 mb-3">성능 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead><tr className="bg-muted">
              {['항목', 'FP16 (Ampere)', 'FP8 (Hopper TE)'].map(h => (
                <th key={h} className="border border-border px-4 py-2 text-left">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {([['GEMM 처리량', '312 TFLOPS', '~989 TFLOPS (3.2x)'], ['메모리 사용', '기준 (1x)', '~0.5x'],
                ['GPT-3 175B 학습', '기준', '~1.6x 처리량'], ['정확도 차이', '기준', '<0.1% degradation'],
              ] as const).map(([item, fp16, fp8]) => (
                <tr key={item}>
                  <td className="border border-border px-4 py-2 font-medium">{item}</td>
                  <td className="border border-border px-4 py-2">{fp16}</td>
                  <td className="border border-border px-4 py-2 font-semibold">{fp8}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
