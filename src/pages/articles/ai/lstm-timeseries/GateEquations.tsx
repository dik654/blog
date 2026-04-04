const GATES = [
  {
    name: 'Forget Gate',
    eq: 'f_t = σ(W_f · [h_{t-1}, x_t] + b_f)',
    desc: '이전 셀 상태에서 버릴 정보를 결정 — f_t가 0에 가까우면 해당 정보 삭제',
    color: '#ef4444',
  },
  {
    name: 'Input Gate',
    eq: 'i_t = σ(W_i · [h_{t-1}, x_t] + b_i)',
    desc: '새 정보 중 셀 상태에 저장할 항목을 결정',
    color: '#10b981',
  },
  {
    name: 'Candidate',
    eq: 'C̃_t = tanh(W_C · [h_{t-1}, x_t] + b_C)',
    desc: '새 후보 셀 상태 생성 — tanh로 -1~1 범위 정규화',
    color: '#f59e0b',
  },
  {
    name: 'Cell State',
    eq: 'C_t = f_t × C_{t-1} + i_t × C̃_t',
    desc: '이전 기억을 선택적으로 삭제(forget) + 새 정보 추가(input) — LSTM의 핵심 연산',
    color: '#8b5cf6',
  },
  {
    name: 'Output Gate',
    eq: 'o_t = σ(W_o · [h_{t-1}, x_t] + b_o)',
    desc: '셀 상태 중 출력할 부분을 결정',
    color: '#ec4899',
  },
  {
    name: 'Hidden State',
    eq: 'h_t = o_t × tanh(C_t)',
    desc: 'Output Gate * tanh(C_t)로 최종 출력 h_t 생성',
    color: '#0ea5e9',
  },
];

export default function GateEquations() {
  return (
    <div className="not-prose grid gap-2 mt-6">
      {GATES.map((g) => (
        <div key={g.name} className="rounded-lg border px-4 py-2.5 flex items-start gap-3"
          style={{ borderColor: g.color + '30', background: g.color + '06' }}>
          <span className="text-xs font-bold w-24 flex-shrink-0 pt-0.5" style={{ color: g.color }}>
            {g.name}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs text-foreground/70">{g.eq}</p>
            <p className="text-[11px] text-foreground/50 mt-0.5">{g.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
