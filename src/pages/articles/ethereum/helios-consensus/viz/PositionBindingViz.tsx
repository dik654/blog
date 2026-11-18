import type { ReactNode } from "react";
import HeliosSceneShell from "./HeliosSceneShell";

/**
 * 본문 대응: #overview "참여 bit는 사람 수가 아니라 512칸인 sync committee 목록의 position을 셉니다".
 * 512칸 중 8칸만 떼어 낸 가정 예시입니다. v3은 position 0·2, v9는 position 1·5에 들어 있습니다.
 * set bit = position 0,1,3,4,5,7 → p = 6, 참여 validator는 v3·v9·v5·v1·v2 다섯 명.
 */
const VALIDATORS: readonly string[] = ["v3", "v9", "v3", "v5", "v1", "v9", "v6", "v2"];
const BITS: readonly number[] = [1, 1, 0, 1, 1, 1, 0, 1];
/** 중복을 지운 목록(첫 등장만 남김): v3, v9, v5, v1, v6, v2 */
const DEDUPED: readonly string[] = ["v3", "v9", "v5", "v1", "v6", "v2"];
const DUPLICATED = new Set(["v3", "v9"]);

const SCENES = [
  {
    label: "칸은 position입니다",
    summary: "8칸 · validator 6명",
    note: "512칸 중 8칸만 확대한 가정 예시입니다. Committee 목록을 만들 때 같은 validator가 여러 position에 뽑힐 수 있어, v3은 0·2번, v9는 1·5번 칸에 들어 있습니다.",
  },
  {
    label: "bit는 칸을 셉니다",
    summary: "p = 6 (사람은 5명)",
    note: "참여 bit는 position마다 하나씩 있습니다. 1인 칸은 0·1·3·4·5·7번 여섯 개이므로 p는 6입니다. v9는 1번과 5번 칸에서 각각 한 번씩 세어집니다.",
  },
  {
    label: "공개키도 같은 칸에서 고릅니다",
    summary: "PK_A = 6개 항의 합",
    note: "Bit가 1인 칸마다 그 칸의 public key를 더합니다. v9의 key는 두 칸 몫으로 두 번 들어갑니다. Bit i와 key i를 같은 position으로 묶는 것이 결속입니다.",
  },
  {
    label: "중복을 지우면 칸이 밀립니다",
    summary: "bit 8개 ↔ key 6개",
    note: "가정으로 key 목록에서 중복을 지우면 목록이 6칸으로 줄고 2번 칸부터 key가 밀립니다. 1인 3번 bit가 v5가 아닌 v1과 짝지어지고, 6·7번 칸에는 key가 없습니다. 구현은 이렇게 하지 않고 bit와 key를 position별로 결속하며 임의로 중복 제거하지 않습니다.",
  },
] as const;

function Cell({ top, bottom, tone }: { top: string; bottom: string; tone: "on" | "off" | "warn" | "plain" | "empty" }) {
  const cls =
    tone === "on"
      ? "border-primary bg-primary/[0.08]"
      : tone === "warn"
        ? "border-red-600 bg-red-600/[0.06]"
        : tone === "empty"
          ? "border-dashed border-border/60"
          : tone === "off"
            ? "border-border bg-muted/30 text-muted-foreground"
            : "border-border bg-background";
  return (
    <div className={`min-w-0 rounded-md border px-0.5 py-1.5 text-center ${cls}`}>
      <span className="block whitespace-nowrap font-mono text-[10px] font-bold leading-4 tracking-tighter sm:text-xs sm:tracking-normal">{top}</span>
      <span className="block font-mono text-[10px] leading-4 text-muted-foreground">{bottom}</span>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-1.5 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
      <span className="break-keep text-[11px] font-semibold leading-4 text-muted-foreground sm:text-xs">{label}</span>
      <div className="grid grid-cols-8 gap-1">{children}</div>
    </div>
  );
}

export default function PositionBindingViz() {
  return (
    <HeliosSceneShell
      eyebrow="Position과 validator"
      title="참여 bit는 사람이 아니라 committee 목록의 칸을 셉니다"
      description="512칸 sync committee 목록에서 8칸만 떼어 낸 가정 예시입니다. v3·v9처럼 같은 validator가 두 칸에 들어갈 수 있습니다. 칸마다 참여 bit 하나와 public key 하나가 짝이며, PK9는 v9의 public key, PK_A는 더한 결과(집계 public key)입니다."
      note="Validator 이름·칸 배치·bit 값은 설명용 가정입니다. 실제 committee는 512칸이고 342칸 이상이 참여해야 2/3 경계를 넘습니다."
      ariaLabel="8칸 가정 예시에서 참여 bit와 public key를 position별로 결속하는 네 장면"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-2">
          <Row label="position">
            {VALIDATORS.map((v, i) => (
              <Cell key={i} top={String(i)} bottom={v} tone={active === 0 && DUPLICATED.has(v) ? "warn" : "plain"} />
            ))}
          </Row>
          <Row label="참여 bit">
            {BITS.map((b, i) => (
              <Cell
                key={i}
                top={active >= 1 ? String(b) : "·"}
                bottom={active >= 1 ? (b ? "셈" : "") : ""}
                tone={active >= 1 ? (b ? "on" : "off") : "empty"}
              />
            ))}
          </Row>
          <Row label={active === 3 ? "중복 제거 key" : "public key"}>
            {VALIDATORS.map((v, i) => {
              if (active < 2) return <Cell key={i} top="·" bottom="" tone="empty" />;
              if (active === 2) {
                return <Cell key={i} top={`PK${v.slice(1)}`} bottom={BITS[i] ? "더함" : "뺌"} tone={BITS[i] ? "on" : "off"} />;
              }
              const key = i < DEDUPED.length ? DEDUPED[i] : undefined;
              if (key === undefined) return <Cell key={i} top="—" bottom="없음" tone="warn" />;
              const wrong = key !== v;
              return <Cell key={i} top={`PK${key.slice(1)}`} bottom={wrong ? "밀림" : "같음"} tone={wrong ? "warn" : "plain"} />;
            })}
          </Row>
          <div className="mt-3 grid min-h-[3.25rem] grid-cols-1 gap-1 border-t border-border pt-2 font-mono text-xs leading-5 sm:text-sm">
            <span>p = {active >= 1 ? "1+1+1+1+1+1 = 6 position" : "?"}</span>
            <span className="text-muted-foreground">
              {active === 2
                ? "PK_A = PK3 + PK9 + PK5 + PK1 + PK9 + PK2"
                : active === 3
                  ? "bit 8개 vs key 6개 → 2번 칸부터 짝이 어긋남"
                  : active === 1
                    ? "참여 validator: v3·v9·v5·v1·v2 = 5명"
                    : "v3: 0·2번 칸, v9: 1·5번 칸"}
            </span>
          </div>
        </div>
      )}
    />
  );
}
