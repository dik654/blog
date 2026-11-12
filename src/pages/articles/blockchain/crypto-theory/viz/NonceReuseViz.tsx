import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-parts 둘째 문단 — 한 키 아래 구분 값(nonce)을 재사용하면 일부 방식에서
 * 서로 다른 두 내용이 같은 가림 값으로 덮여 두 내용의 관계가 드러나고, 한쪽 원문을 알면 다른 쪽도 알 수 있습니다.
 * 칸 무늬는 "같다/다르다"만 보이려는 설명용 모양이며 실제 바이트가 아닙니다.
 */
const MASK_7 = [1, 0, 1, 1, 0, 0, 1, 0] as const;
const MASK_8 = [0, 1, 1, 0, 1, 0, 0, 1] as const;

const SCENES = [
  {
    label: "구분 값이 다를 때",
    summary: "구분 값 7, 8 → 가림 값이 다름",
    note: "가림 값은 둘만 아는 값(키)과 구분 값에서 계산해 내용을 덮는 값입니다. 두 번째 지시에 새 구분 값 8을 쓰면 두 지시는 서로 다른 무늬로 덮입니다.",
  },
  {
    label: "구분 값을 재사용",
    summary: "두 지시 모두 구분 값 7 → 같은 무늬",
    note: "같은 키 아래 구분 값 7을 한 번 더 쓰면 pay=30과 pay=90이 똑같은 가림 값으로 덮입니다. 묶음 두 개는 겉보기에 달라도 밑에 깔린 무늬가 같습니다.",
  },
  {
    label: "두 묶음을 나란히",
    summary: "가림 값은 빠지고 두 원문의 관계가 남음",
    note: "일부 널리 쓰이는 방식에서는 공격자가 두 묶음을 비교하면 공통 가림 값의 영향이 사라지고 두 원문 사이의 관계만 남습니다.",
  },
  {
    label: "한쪽 원문을 알면",
    summary: "pay=30을 알면 pay=90도 드러남",
    note: "남은 관계에 이미 아는 한쪽 원문을 대입하면 다른 원문이 나옵니다. 구체적인 피해는 선택한 방식에 달려 있습니다.",
  },
] as const;

const ON = "#6366f1";
const OFF = "#e2e8f0";
const DIM = "#94a3b8";

function Mask({ bits, faded = false }: { bits: readonly number[]; faded?: boolean }) {
  return (
    <svg viewBox="0 0 88 14" className="h-3.5 w-[88px] shrink-0" aria-hidden="true">
      {bits.map((bit, i) => (
        <rect key={i} x={i * 11} y={0} width={10} height={14} rx={1.5} fill={faded ? OFF : bit ? ON : OFF} stroke={faded ? DIM : bit ? ON : DIM} strokeWidth={1} strokeDasharray={faded ? "2 2" : undefined} />
      ))}
    </svg>
  );
}

function Row({ name, nonce, plain, bits, state }: { name: string; nonce: string; plain: string; bits: readonly number[]; state: "hidden" | "relation" | "known" | "revealed" }) {
  const faded = state !== "hidden";
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-1 rounded-lg border border-border px-3 py-2 sm:grid-cols-[3.5rem_5rem_minmax(0,1fr)_minmax(0,1fr)]">
      <span className="text-xs font-bold">{name}</span>
      <span className="text-xs text-muted-foreground">구분 값 <span className="font-mono">{nonce}</span></span>
      <span className="col-span-2 flex min-w-0 items-center gap-2 sm:col-span-1">
        <span className="text-[11px] text-muted-foreground">가림 값</span>
        <Mask bits={bits} faded={faded} />
      </span>
      <span className="col-span-2 min-w-0 text-xs sm:col-span-1">
        <span className="text-muted-foreground">원문 </span>
        <span
          className={`font-mono font-semibold ${
            state === "known" ? "text-emerald-700 dark:text-emerald-400" : state === "revealed" ? "text-red-700 dark:text-red-400" : state === "relation" ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"
          }`}
        >
          {state === "hidden" ? "가려짐" : state === "relation" ? "관계만 보임" : plain}
        </span>
        {state === "known" && <span className="text-muted-foreground"> (공격자가 앎)</span>}
        {state === "revealed" && <span className="text-muted-foreground"> (따라서 드러남)</span>}
      </span>
    </div>
  );
}

export default function NonceReuseViz() {
  return (
    <SceneShell
      eyebrow="구분 값 재사용"
      title="같은 구분 값을 두 번 쓰면 같은 무늬로 덮입니다"
      description="두 줄은 같은 키(둘만 아는 값)로 보호한 서로 다른 두 지시입니다. 두 번째 지시 pay=90과 구분 값 8은 비교용 가정이고, 칸 무늬는 같고 다름만 보이는 설명용 모양입니다."
      ariaLabel="구분 값 재사용 시 같은 가림 값으로 덮인 두 지시의 관계가 드러나는 과정"
      scenes={SCENES}
      render={(active) => {
        const reuse = active >= 1;
        const top = active <= 1 ? "hidden" : active === 2 ? "relation" : "known";
        const bottom = active <= 1 ? "hidden" : active === 2 ? "relation" : "revealed";
        return (
          <div className="min-w-0 space-y-2">
            <Row name="지시 1" nonce="7" plain="pay=30" bits={MASK_7} state={top} />
            <Row name="지시 2" nonce={reuse ? "7" : "8"} plain="pay=90" bits={reuse ? MASK_7 : MASK_8} state={bottom} />
            <div className="flex min-h-[2.75rem] items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs">
              <span className="font-bold">공격자가 보는 것</span>
              <span className="text-muted-foreground">
                {active === 0
                  ? "묶음 1, 2 — 무늬가 달라 비교해도 가림 값이 빠지지 않음"
                  : active === 1
                    ? "묶음 1, 2 — 겉은 다르지만 같은 무늬 위에 있음"
                    : active === 2
                      ? "묶음 1과 2 비교 → 공통 무늬 빠짐 → 원문 1과 2의 관계"
                      : "관계 + 아는 원문 1(pay=30) → 원문 2(pay=90)"}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
