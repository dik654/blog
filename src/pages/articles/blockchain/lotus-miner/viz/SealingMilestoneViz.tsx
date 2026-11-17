import LotusSceneShell from "./LotusSceneShell";

/**
 * 본문 대응: #sealing-jobs 두 번째 문단.
 * PC1 → PC2 → PreCommit 포함·seed 대기 → commit proof 생성·검증 → ProveCommit 반영.
 * 왼쪽 칸은 worker가 만든 산출물, 오른쪽 칸은 체인 상태다. 마지막 장면에서만 sector 42가 proving set으로 간다.
 */
const STEPS = [
  { lane: "worker", name: "PC1", detail: "replica-specific labels" },
  { lane: "worker", name: "PC2", detail: "encoded replica · CommD·CommR tree" },
  { lane: "chain", name: "PreCommit 포함", detail: "challenge seed를 기다림" },
  { lane: "worker", name: "Commit proof", detail: "생성하고 검증함" },
  { lane: "chain", name: "ProveCommit 반영", detail: "canonical actor state" },
] as const;

const SCENES = [
  { label: "PC1", summary: "worker 산출물 1개 · 체인 0", note: "Sector 42에 배치한 pieces로 PC1이 replica-specific labels를 만듭니다. 아직 worker 쪽 디스크에만 있는 결과입니다." },
  { label: "PC2", summary: "산출물 완성 · 아직 비활성", note: "PC2가 encoded replica와 CommD·CommR tree artifacts를 완성합니다. 계산 산출물은 다 생겼지만 체인 상태에는 이 sector가 활성으로 올라가지 않았습니다." },
  { label: "PreCommit", summary: "체인에 첫 기록 · seed 대기", note: "PreCommit message가 포함된 뒤 challenge seed를 기다립니다." },
  { label: "Commit proof", summary: "proof 생성·검증 · 아직 비활성", note: "Commit proof를 생성하고 검증합니다. proof bytes가 생긴 이 순간도 완료가 아닙니다." },
  { label: "ProveCommit", summary: "actor state 반영 → proving set", note: "ProveCommit이 canonical actor state에 반영돼야 sector 42가 proving set으로 이동합니다. 오른쪽 칸 두 개가 모두 채워진 뒤에야 활성입니다." },
] as const;

function Row({ index, active }: { index: number; active: number }) {
  const step = STEPS[index];
  const done = index < active;
  const current = index === active;
  const state = current ? "border-primary bg-primary/10" : done ? "border-foreground/30 bg-background" : "border-dashed border-border bg-background text-muted-foreground/60";
  const box = (
    <div className={`min-w-0 rounded-lg border px-3 py-1.5 ${state}`}>
      <p className="text-xs font-bold leading-5">
        <span className="font-mono">{index + 1}.</span> {step.name}
      </p>
      <p className="break-keep text-[11px] leading-5 text-muted-foreground">{step.detail}</p>
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-3">
      {step.lane === "worker" ? box : <div aria-hidden className="border-l border-dashed border-border/60" />}
      {step.lane === "chain" ? box : <div aria-hidden className="border-l border-dashed border-border/60" />}
    </div>
  );
}

export default function SealingMilestoneViz() {
  return (
    <LotusSceneShell
      eyebrow="Sector 42의 순서"
      title="산출물이 다 생겨도 체인 칸이 채워지기 전에는 활성이 아닙니다"
      description="왼쪽은 worker가 만든 산출물, 오른쪽은 체인에 기록된 상태입니다. CommD는 data commitment, CommR은 replica commitment이고, challenge seed는 체인이 정해 주는 무작위 값입니다."
      ariaLabel="Sector 42가 PC1부터 ProveCommit 반영까지 worker 산출물과 체인 상태를 오가는 순서"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className={`mb-3 rounded-lg border px-3 py-2 text-sm font-bold ${active === STEPS.length - 1 ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" : "border-border text-muted-foreground"}`}>
            sector 42 상태: {active === STEPS.length - 1 ? "proving set (활성)" : "아직 비활성"}
          </div>
          <div className="mb-2 grid grid-cols-2 gap-3 text-[11px] font-bold text-muted-foreground">
            <span>worker 산출물</span>
            <span>체인 상태</span>
          </div>
          <div className="space-y-1.5">
            {STEPS.map((step, index) => <Row key={step.name} index={index} active={active} />)}
          </div>
        </div>
      )}
    />
  );
}
