import PositionalEncodingChart from '../components/PositionalEncodingChart';

export default function PositionalEncoding() {
  return (
    <section id="positional-encoding">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Positional Encoding</h2>
      <p className="leading-7 mb-4">
        Transformer — 자체적으로 순서 정보가 없음<br />
        Positional Encoding으로 토큰의 위치 정보를 주입<br />
        사인/코사인 함수를 사용하는 방식이 원래 논문의 방법
      </p>
      <div className="rounded-lg border p-4 font-mono text-sm space-y-1 mb-6">
        <div>PE(pos, 2i) = sin(pos / 10000<sup>2i/d</sup>)</div>
        <div>PE(pos, 2i+1) = cos(pos / 10000<sup>2i/d</sup>)</div>
      </div>
      <PositionalEncodingChart />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Positional Encoding 대안들</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Positional Encoding 변형들 (2017~2024)
//
// 1. Sinusoidal (원 Transformer, 2017)
//    PE(pos, 2i) = sin(pos / 10000^(2i/d))
//    PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
//    - 학습 불필요
//    - 임의 길이 가능
//    - 상대 위치 암시적
//
// 2. Learned PE (BERT, GPT-2)
//    - 각 위치에 학습 가능한 임베딩
//    - max_seq_len 고정 (예: 512, 1024)
//    - 초과 시 작동 불가
//
// 3. Relative PE (T5, 2019)
//    - attention bias로 상대 거리 표현
//    - b_{i-j} 파라미터를 attention에 더함
//    - 절대 위치 대신 상대
//
// 4. RoPE (RoFormer, LLaMA)
//    - 복소수 회전으로 위치 인코딩
//    - Q, K에 직접 적용
//    - 상대 위치 자연스럽게 표현
//    - 현재 LLM 표준
//
// 5. ALiBi (BLOOM, 2022)
//    - attention score에 선형 bias
//    - PE 없이 extrapolation 가능
//    - 긴 문맥 처리 유리
//
// 6. YaRN / NTK-aware scaling (LLaMA-2 long)
//    - RoPE의 주파수 보간
//    - 사전학습 길이 초과 적응

// 2024년 표준:
//   LLaMA-3: RoPE + high-frequency adjustment
//   GPT-4: 공개되지 않음 (추정: Rotary + optimizations)
//   Claude: 공개 안 됨
//   Gemma: RoPE
//
// 왜 RoPE가 대세?
//   - 상대 위치 자동 포착
//   - 기본 attention에 단순히 회전만 추가
//   - 긴 문맥 extrapolation 비교적 유리
//   - 수학적으로 깔끔`}
        </pre>
        <p className="leading-7">
          요약 1: PE는 <strong>sinusoidal → learned → relative → RoPE → ALiBi</strong>로 진화.<br />
          요약 2: 현대 LLM은 <strong>RoPE</strong> 주류 — 상대 위치 자연스럽게 표현.<br />
          요약 3: 긴 문맥 처리를 위한 <strong>YaRN, NTK scaling</strong> 등 active research 영역.
        </p>
      </div>
    </section>
  );
}
