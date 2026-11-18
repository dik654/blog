import PayloadSceneShell from "../../reth-payload-builder/viz/PayloadSceneShell";

/**
 * 본문 대응: #ownership — Base와 candidate가 같은 txpool·payload registry를 함께 수정하면 비교가 오염되므로
 * 독립 process·독립 data directory를 쓰고 fixture 공급자만 공유한다. 검증기는 기록만 하고 상태를 고치지 않는다.
 * 숫자 없음. 배치만 보여 준다.
 */
const SCENES = [
  {
    label: "함께 쓰면",
    summary: "공유 txpool·registry → 비교 오염",
    note: "Base와 candidate가 같은 txpool이나 payload registry를 함께 수정하면, 한쪽 결과가 다른 쪽이 읽는 상태에 섞입니다. 그러면 두 결과의 차이가 구현 차이인지 공유 상태 때문인지 가를 수 없습니다.",
  },
  {
    label: "Fixture만 공유",
    summary: "독립 process · 독립 data directory",
    note: "각 구현은 자기 process와 data directory 안에 txpool과 payload registry를 따로 가집니다. 둘이 함께 받는 것은 fixture 공급자가 주는 같은 parent, attributes, transaction corpus와 clock schedule뿐입니다.",
  },
  {
    label: "검증기는 기록만",
    summary: "읽기 화살표만 · 되쓰기 없음",
    note: "각 상태에는 권위 있는 writer가 따로 있습니다. 예를 들어 Best candidate는 BasicPayloadJob이 바꾸고, 검증기는 Better·Aborted·Freeze 전이를 기록만 합니다. Collector는 rollback도 직접 실행하지 않습니다.",
  },
] as const;

function Box({ title, body, tone = "plain" }: { title: string; body: string; tone?: "plain" | "accent" | "bad" | "muted" }) {
  const cls =
    tone === "accent"
      ? "border-primary bg-primary/5"
      : tone === "bad"
        ? "border-dashed border-red-600 text-red-700 dark:text-red-400"
        : tone === "muted"
          ? "border-border text-muted-foreground"
          : "border-border";
  return (
    <div className={`min-w-0 rounded-md border px-2 py-2 text-center ${cls}`}>
      <strong className="block break-keep text-xs">{title}</strong>
      <span className="mt-0.5 block break-keep text-[10px] leading-4 text-muted-foreground">{body}</span>
    </div>
  );
}

function Arrow({ label, tone = "#2563eb" }: { label?: string; tone?: string }) {
  return (
    <div className="flex items-center justify-center gap-1 py-1 text-[10px]" style={{ color: tone }}>
      <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden>
        <path d="M5 0 V11 M1 8 L5 12 L9 8" fill="none" stroke={tone} strokeWidth={1.25} />
      </svg>
      {label && <span>{label}</span>}
    </div>
  );
}

function Node({ name, own, highlight }: { name: string; own: boolean; highlight: boolean }) {
  return (
    <div className={`min-w-0 rounded-md border p-2 ${highlight ? "border-primary" : "border-border"}`}>
      <strong className="block text-center text-xs">{name}</strong>
      <span className="block text-center text-[10px] text-muted-foreground">{own ? "독립 process · data dir" : "process"}</span>
      <div className="mt-2 grid gap-1">
        {own ? (
          <>
            <Box title="txpool" body={`${name} 전용`} tone="accent" />
            <Box title="payload registry" body={`${name} 전용`} tone="accent" />
          </>
        ) : (
          <>
            <Box title="txpool" body="아래 공유" tone="muted" />
            <Box title="payload registry" body="아래 공유" tone="muted" />
          </>
        )}
      </div>
    </div>
  );
}

export default function IsolatedPairViz() {
  return (
    <PayloadSceneShell
      eyebrow="실험 배치 · 두 test node"
      title="두 구현이 함께 받는 것은 fixture뿐이고, 상태는 각자 따로 씁니다"
      description="위에서 아래로 입력이 흐릅니다. 「전용」이라 적힌 칸은 그 node만 쓰는 상태, 빨간 점선은 두 구현이 함께 수정하는 상태입니다."
      ariaLabel="Base와 candidate가 상태를 공유할 때와 fixture만 공유할 때의 배치 비교"
      scenes={SCENES}
      render={(active) => {
        const shared = active === 0;
        const observing = active === 2;
        return (
          <div className="min-w-0">
            <Box title="Fixture 공급자" body="parent · attributes · tx corpus · clock schedule" tone={active === 1 ? "accent" : "plain"} />
            <div className="grid grid-cols-2 gap-3">
              <Arrow label="같은 입력" />
              <Arrow label="같은 입력" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Node name="Base" own={!shared} highlight={!shared} />
              <Node name="Candidate" own={!shared} highlight={!shared} />
            </div>
            {shared ? (
              <div className="mt-2">
                <Box title="공유 txpool · payload registry" body="두 구현이 함께 수정 → 비교 오염" tone="bad" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Arrow label={observing ? "결과만 읽음" : undefined} tone={observing ? "#2563eb" : "#94a3b8"} />
                <Arrow label={observing ? "결과만 읽음" : undefined} tone={observing ? "#2563eb" : "#94a3b8"} />
              </div>
            )}
            <div className={shared ? "mt-2" : ""}>
              <Box
                title="검증기 · collector"
                body={observing ? "전이·root·receipt 기록 · 상태 수정과 rollback 실행 없음" : "두 결과를 기록하고 비교"}
                tone={observing ? "accent" : "muted"}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
