import M from '@/components/ui/math';

const GATES = [
  {
    name: 'Forget Gate',
    latex: 'f_t = \\sigma(\\underbrace{W_f}_{\\text{가중치}} \\cdot [\\underbrace{h_{t-1}}_{\\text{이전 출력}},\\, \\underbrace{x_t}_{\\text{현재 입력}}] + b_f)',
    desc: '이전 셀 상태에서 버릴 정보를 결정 — fₜ가 0에 가까우면 해당 정보 삭제, 1이면 유지',
    color: '#ef4444',
  },
  {
    name: 'Input Gate',
    latex: 'i_t = \\sigma(W_i \\cdot [h_{t-1},\\, x_t] + b_i)',
    desc: '새 정보 중 셀 상태에 저장할 항목을 결정 — σ 출력이 0~1로 통과 비율 제어',
    color: '#10b981',
  },
  {
    name: 'Candidate',
    latex: '\\tilde{C}_t = \\tanh(W_C \\cdot [h_{t-1},\\, x_t] + b_C)',
    desc: '새 후보 셀 상태 생성 — tanh로 -1~1 범위 정규화하여 값 폭발 방지',
    color: '#f59e0b',
  },
  {
    name: 'Cell State',
    latex: 'C_t = \\underbrace{f_t \\odot C_{t-1}}_{\\text{선택적 삭제}} + \\underbrace{i_t \\odot \\tilde{C}_t}_{\\text{새 정보 추가}}',
    desc: 'LSTM의 핵심 연산 — forget gate로 기존 기억을 선택적 삭제 + input gate로 새 정보 추가. 덧셈 구조가 기울기 소실 방지',
    color: '#8b5cf6',
  },
  {
    name: 'Output Gate',
    latex: 'o_t = \\sigma(W_o \\cdot [h_{t-1},\\, x_t] + b_o)',
    desc: '셀 상태 중 외부로 출력할 부분을 결정',
    color: '#ec4899',
  },
  {
    name: 'Hidden State',
    latex: 'h_t = \\underbrace{o_t}_{\\text{출력 비율}} \\odot \\underbrace{\\tanh(C_t)}_{\\text{셀 상태 정규화}}',
    desc: 'Output Gate × tanh(Cₜ)로 최종 출력 생성 — tanh가 셀 상태를 -1~1로 스케일링',
    color: '#0ea5e9',
  },
];

export default function GateEquations() {
  return (
    <div className="not-prose grid gap-2 mt-6">
      {GATES.map((g) => (
        <div key={g.name} className="rounded-lg border px-4 py-3 flex items-start gap-3"
          style={{ borderColor: g.color + '30', background: g.color + '06' }}>
          <span className="text-xs font-bold w-24 flex-shrink-0 pt-1" style={{ color: g.color }}>
            {g.name}
          </span>
          <div className="flex-1 min-w-0">
            <M>{g.latex}</M>
            <p className="text-[11px] text-foreground/50 mt-1">{g.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
