import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #workload-contract — b=8, w=2이면 scalar마다 J=⌈8/2⌉=4 digits.
 * 예시 scalar 179(가정) = 10110011₂ → window j=3..0 digit 2,3,0,3.
 * 3·1 + 0·4 + 3·16 + 2·64 = 179. window 0에서 digit 1~3만 bucket을 쓴다.
 */
const BITS = [1, 0, 1, 1, 0, 0, 1, 1] as const;
/** 왼쪽(큰 자리)부터 window j=3,2,1,0 */
const WINDOWS = [
  { j: 3, digit: 2, place: 64 },
  { j: 2, digit: 3, place: 16 },
  { j: 1, digit: 0, place: 4 },
  { j: 0, digit: 3, place: 1 },
] as const;
const RECON = WINDOWS.reduce<number>((sum, w) => sum + w.digit * w.place, 0);

/** window 0에서 읽은 digit. P0이 위의 179이고 나머지는 가정. */
const POINTS = [
  { name: "P0", digit: 3 },
  { name: "P1", digit: 1 },
  { name: "P2", digit: 0 },
  { name: "P3", digit: 3 },
] as const;
const BUCKETS = [1, 2, 3] as const;

const SCENES = [
  {
    label: "scalar 하나는 8 bit",
    summary: "s₀ = 179 = 10110011₂",
    note: "b=8이면 scalar는 0과 1이 여덟 칸입니다. 179는 이 그림을 위해 고른 값(가정)이고, 실제 scalar는 훨씬 깁니다.",
  },
  {
    label: "w=2 bit씩 자르기",
    summary: "J = ⌈8/2⌉ = 4 windows",
    note: "두 칸씩 묶으면 window가 네 개 생기고, 각 window의 두 bit가 digit 하나(0~3)가 됩니다. 179는 왼쪽부터 2, 3, 0, 3입니다.",
  },
  {
    label: "자리값을 곱해 되돌리기",
    summary: `3·1 + 0·4 + 3·16 + 2·64 = ${RECON}`,
    note: "window j의 자리값은 2^(jw)이므로 w=2에서 1, 4, 16, 64입니다. digit에 자리값을 곱해 더하면 원래 scalar가 그대로 돌아옵니다.",
  },
  {
    label: "같은 digit은 같은 bucket",
    summary: "window 0 · B3 = P0 + P3",
    note: "한 window 안에서 digit이 같은 point끼리 한 bucket에 더합니다. digit 0은 더할 것이 없으므로 w=2에서 필요한 nonzero bucket은 1, 2, 3 세 개입니다. P1~P3의 digit은 가정입니다.",
  },
] as const;

function BitRow({ grouped, focusJ }: { grouped: boolean; focusJ?: number }) {
  return (
    <div className={`grid grid-cols-4 ${grouped ? "gap-3" : "gap-1"}`}>
      {WINDOWS.map((w, wi) => (
        <div
          key={w.j}
          className={`grid grid-cols-2 gap-1 rounded-lg p-1 ${grouped ? "border border-[#2563eb]/60" : "border border-transparent"} ${focusJ !== undefined && focusJ !== w.j ? "opacity-30" : ""}`}
        >
          {[0, 1].map((k) => (
            <span
              key={k}
              className="grid h-9 place-items-center rounded-md border border-border bg-background font-mono text-sm font-bold"
            >
              {BITS[wi * 2 + k]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function DigitRow({ withPlace }: { withPlace: boolean }) {
  return (
    <div className="grid grid-cols-4 gap-3 text-center">
      {WINDOWS.map((w) => (
        <div key={w.j} className="min-w-0">
          <p className="text-[11px] text-muted-foreground">window {w.j}</p>
          <p className="font-mono text-base font-bold text-[#2563eb]">
            d = {w.digit}
          </p>
          {withPlace ? (
            <p className="mt-1 break-words font-mono text-xs">
              {w.digit}×{w.place} = <strong>{w.digit * w.place}</strong>
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function BucketPanel() {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground">
          window 0에서 읽은 digit (P0 = 위 179)
        </p>
        <div className="grid grid-cols-2 gap-1">
          {POINTS.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-1 font-mono text-xs"
            >
              <span>{p.name}</span>
              <span
                className={
                  p.digit === 0
                    ? "text-muted-foreground"
                    : "font-bold text-[#2563eb]"
                }
              >
                d = {p.digit}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground">bucket (digit 1~3)</p>
        {BUCKETS.map((b) => {
          const members = POINTS.filter((p) => p.digit === b).map(
            (p) => p.name,
          );
          return (
            <div
              key={b}
              className="flex items-center justify-between gap-2 rounded-md border border-[#2563eb]/50 px-3 py-1 font-mono text-xs"
            >
              <span className="font-bold">B{b}</span>
              <span className="min-w-0 break-words text-right">
                {members.length > 0 ? members.join(" + ") : "비어 있음"}
              </span>
            </div>
          );
        })}
        <p className="pt-1 text-[11px] text-muted-foreground">
          P2는 digit 0 → 어느 bucket에도 넣지 않음
        </p>
      </div>
    </div>
  );
}

export default function MsmWindowDigitsViz() {
  return (
    <SceneShell
      eyebrow="window 분해"
      title="scalar 하나를 2-bit window 네 칸으로 자릅니다"
      description="b=8, w=2인 본문 예시를 한 scalar로 따라갑니다. 칸 하나가 bit 하나이고, 파란 테두리 하나가 window 하나입니다."
      ariaLabel="8비트 scalar 179를 2비트 window 네 개로 나누고 digit별 bucket에 모으는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, index) => (
            <div key={scene.label} className="space-y-4">
              <BitRow
                grouped={index >= 1}
                focusJ={index === 3 ? 0 : undefined}
              />
              {index >= 1 && index <= 2 ? (
                <DigitRow withPlace={index === 2} />
              ) : null}
              {index === 3 ? <BucketPanel /> : null}
            </div>
          ))}
        />
      )}
    />
  );
}
