import VizFrame from "@/components/viz/VizFrame";

const rows = [
  ["Cell state Cₜ", "retain fₜ", "write iₜ ⊙ gₜ", "다음 step의 memory path"],
  ["Hidden state hₜ", "read tanh(Cₜ)", "expose oₜ", "output·다음 gate 계산"],
];

export default function LSTMStateContractViz() {
  return (
    <VizFrame
      eyebrow="Two recurrent states"
      title="LSTM은 보존할 state와 외부에 공개할 state를 분리합니다"
      description="Cₜ와 hₜ는 고정된 ‘장기·단기 기억’ 상자가 아니라 서로 다른 계산 경로를 가진 learned vectors입니다."
    >
      <div className="space-y-3">
        {rows.map(([state, read, write, handoff]) => (
          <div key={state} className="grid gap-3 rounded-lg border border-border/70 bg-background p-4 md:grid-cols-[9rem_1fr_1fr_1.2fr] md:items-center">
            <p className="font-mono text-sm font-bold text-foreground">{state}</p>
            <Field label="읽기" value={read} />
            <Field label="갱신" value={write} />
            <Field label="전달" value={handoff} />
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Gate name="forget" role="이전 C를 얼마나 유지할지" />
        <Gate name="input" role="새 candidate를 얼마나 기록할지" />
        <Gate name="output" role="현재 C를 h로 얼마나 공개할지" />
      </div>
    </VizFrame>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 border-t border-border/60 pt-2 md:border-l md:border-t-0 md:pl-3 md:pt-0"><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm leading-5 text-foreground/80">{value}</p></div>;
}

function Gate({ name, role }: { name: string; role: string }) {
  return <div className="rounded-lg border border-primary/25 bg-primary/[0.035] p-3"><p className="font-mono text-xs font-bold text-primary">{name} gate</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{role}</p></div>;
}
