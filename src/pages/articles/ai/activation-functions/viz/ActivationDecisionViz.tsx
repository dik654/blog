export default function ActivationDecisionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 440" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">활성화 함수 선택 Decision Tree</text>

        <defs>
          <marker id="ad-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Root */}
        <rect x={250} y={46} width={140} height={40} rx={8}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={2} />
        <text x={320} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
          Q: 어떤 위치?
        </text>
        <text x={320} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          (layer type / task)
        </text>

        {/* Branch 1: Hidden vs Output */}
        <line x1={290} y1={86} x2={180} y2={120} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#ad-arr)" />
        <line x1={350} y1={86} x2={460} y2={120} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#ad-arr)" />

        <text x={220} y={108} fontSize={10} fontWeight={700} fill="#3b82f6">Hidden Layer</text>
        <text x={410} y={108} fontSize={10} fontWeight={700} fill="#ef4444">Output Layer</text>

        {/* Hidden branch */}
        <rect x={30} y={125} width={310} height={200} rx={10}
          fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={185} y={148} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          Hidden Layer — 어떤 아키텍처?
        </text>

        {[
          { arch: 'CNN (일반)', fn: 'ReLU', why: '빠름·검증됨', y: 170 },
          { arch: 'CNN (mobile)', fn: 'Hard Swish', why: 'ReLU>·빠름', y: 194 },
          { arch: 'Transformer (NLP)', fn: 'GELU', why: 'BERT/GPT', y: 218 },
          { arch: 'LLM (decoder)', fn: 'SwiGLU', why: 'LLaMA 이후', y: 242 },
          { arch: 'RNN/LSTM', fn: 'Tanh+Sigmoid', why: 'Gating', y: 266 },
          { arch: 'GAN', fn: 'LeakyReLU', why: '안정 학습', y: 290 },
          { arch: 'MLP (일반)', fn: 'ReLU', why: '기본', y: 314 },
        ].map((r, i) => (
          <g key={i}>
            <text x={45} y={r.y} fontSize={10} fill="var(--foreground)">{r.arch}</text>
            <text x={170} y={r.y} fontSize={10} fontFamily="monospace" fontWeight={700} fill="#3b82f6">
              → {r.fn}
            </text>
            <text x={260} y={r.y} fontSize={9} fill="var(--muted-foreground)">
              ({r.why})
            </text>
          </g>
        ))}

        {/* Output branch */}
        <rect x={350} y={125} width={260} height={200} rx={10}
          fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={1.8} />
        <text x={480} y={148} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
          Output Layer — 어떤 task?
        </text>

        {[
          { task: 'Binary 분류', fn: 'Sigmoid', y: 172 },
          { task: 'Multi-class', fn: 'Softmax', y: 196 },
          { task: 'Multi-label', fn: 'Sigmoid × N', y: 220 },
          { task: 'Regression (bounded)', fn: 'Tanh/Sigmoid', y: 244 },
          { task: 'Regression (unbounded)', fn: 'Identity', y: 268 },
        ].map((r, i) => (
          <g key={i}>
            <text x={365} y={r.y} fontSize={10} fill="var(--foreground)">{r.task}</text>
            <text x={590} y={r.y} fontSize={10} fontFamily="monospace" fontWeight={700} fill="#ef4444" textAnchor="end">
              → {r.fn}
            </text>
          </g>
        ))}

        <text x={365} y={302} fontSize={10} fontWeight={700} fill="var(--foreground)">디버깅:</text>
        <text x={365} y={316} fontSize={9} fill="var(--muted-foreground)">
          Dying ReLU → LeakyReLU + He init
        </text>

        {/* 초기화 매칭 */}
        <rect x={30} y={338} width={580} height={90} rx={10}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.8} />
        <text x={320} y={358} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          초기화 × 활성화 매칭
        </text>

        {[
          { init: 'Xavier/Glorot', formula: 'W~N(0, 2/(fanₐ+fanb))', fns: 'Sigmoid, Tanh', x: 45 },
          { init: 'He/Kaiming', formula: 'W~N(0, 2/fan_in)', fns: 'ReLU 계열', x: 230 },
          { init: 'Orthogonal', formula: '직교 행렬', fns: 'RNN/LSTM', x: 445 },
        ].map((m, i) => (
          <g key={i}>
            <text x={m.x} y={378} fontSize={11} fontWeight={700} fill="#10b981">{m.init}</text>
            <text x={m.x} y={394} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">{m.formula}</text>
            <text x={m.x} y={410} fontSize={10} fontWeight={600} fill="var(--foreground)">→ {m.fns}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
