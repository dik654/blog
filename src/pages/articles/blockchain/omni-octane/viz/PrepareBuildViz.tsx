import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #proposal-build — optimistic payload height가 101이면 ID 재사용, 다르면 FCU(H100, attributes)로 새 build.
 * Build delay 뒤 getPayloadV3(id101) → P101 + blob commitments + 이전 height vote messages → unsigned tx 하나 → C101.
 * 시간: 0.15 + 0.40 + 0.20 + 0.05 = 0.80초(설명용 가정) < 10초(고정 abci.go context 한도).
 */
const SEGMENTS = [
  { name: "FCU", sec: 0.15, color: "#2563eb" },
  { name: "build delay", sec: 0.4, color: "#64748b" },
  { name: "getPayload", sec: 0.2, color: "#059669" },
  { name: "encode", sec: 0.05, color: "#d97706" },
] as const;
const TOTAL = SEGMENTS.reduce<number>((sum, seg) => sum + seg.sec, 0);
const LIMIT = 10;

type Step = "check" | "reuse" | "fcu" | "delay" | "get" | "encode";

const SCENES = [
  {
    label: "Height 101인가?",
    summary: "기준점 H100 · A100",
    lit: ["check"] as readonly Step[],
    note: "Proposer는 keeper의 execution head H100과 현재 block header의 AppHash A100을 읽습니다. 다음 proposer라고 미리 판단해 시작해 둔 optimistic payload가 있으면, 그 height가 101인지 먼저 봅니다.",
  },
  {
    label: "같으면 ID 재사용",
    summary: "optimistic hit → FCU 생략",
    lit: ["check", "reuse", "get"] as readonly Step[],
    note: "Height가 101이면 미리 받아 둔 payload ID를 그대로 씁니다. 이 경로에서 얼마나 기다리는지는 글이 따로 말하지 않으므로 시간 막대에 넣지 않았습니다.",
  },
  {
    label: "다르면 새 build",
    summary: "FCU(H100, attributes) → id101",
    lit: ["check", "fcu", "delay", "get"] as readonly Step[],
    note: "Height가 다르면 forkchoiceUpdatedV3에 H100과 payload attributes를 보내 새 build를 시작하고 id101을 받습니다. 설정된 build delay를 기다린 뒤 getPayloadV3(id101)로 P101을 받습니다.",
  },
  {
    label: "Transaction 하나로 포장",
    summary: "P101 + blob commitments + votes → C101",
    lit: ["get", "encode"] as readonly Step[],
    note: "P101과 blob commitments, 이전 height의 vote messages를 한 unsigned Cosmos transaction으로 encode해 proposal C101에 넣습니다. id101은 execution client의 local cache에 속한 표식이라 restart·expiry를 넘어 남는 영수증이 아닙니다.",
  },
  {
    label: "새 build 한 번의 시간",
    summary: "0.15+0.40+0.20+0.05 = 0.80초 < 10초",
    lit: ["fcu", "delay", "get", "encode"] as readonly Step[],
    note: "네 시간은 설명용 가정이며 측정값이 아닙니다. 10초 막대 위에서 0.80초는 8%입니다. 그러나 평균 한 번만 보고 충분하다고 판단할 수 없고, retry가 context를 다 쓰면 빈 proposal 경로가 가능하므로 cold build·optimistic hit·unknown payload·timeout을 따로 봐야 합니다.",
  },
] as const;

function Box({ on, title, body, dashed = false }: { on: boolean; title: string; body: string; dashed?: boolean }) {
  return (
    <div
      className={`min-w-0 rounded-lg border px-2 py-1.5 text-[10px] leading-4 transition-colors sm:px-2.5 sm:py-2 sm:leading-5 duration-300 motion-reduce:transition-none sm:text-xs ${
        on ? "border-[#2563eb] bg-background text-foreground" : "border-border text-muted-foreground/60"
      } ${dashed ? "border-dashed" : ""}`}
    >
      <p className="break-all font-mono font-semibold">{title}</p>
      <p className="break-keep">{body}</p>
    </div>
  );
}

function TimeBar({ max, label }: { max: number; label: string }) {
  const starts = SEGMENTS.map((_, i) => SEGMENTS.slice(0, i).reduce<number>((sum, seg) => sum + seg.sec, 0));
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-muted-foreground sm:text-xs">{label}</p>
      <div className="relative mt-1 h-4 rounded-sm bg-muted/50">
        {SEGMENTS.map((seg, i) => (
          <div
            key={seg.name}
            className="absolute top-0 h-full"
            style={{ left: `${(starts[i] / max) * 100}%`, width: `${(seg.sec / max) * 100}%`, backgroundColor: seg.color }}
          />
        ))}
      </div>
      <div className="mt-0.5 flex justify-between font-mono text-[10px] text-muted-foreground sm:text-[11px]">
        <span>0</span>
        <span>{max}초</span>
      </div>
    </div>
  );
}

export default function PrepareBuildViz() {
  return (
    <SceneShell
      eyebrow="PrepareProposal · height 101"
      title="P101은 ID를 재사용하거나 새로 build한 뒤 transaction 하나로 포장됩니다"
      description="파란 테두리가 그 장면에서 지나는 단계입니다. Optimistic payload는 다음 proposer라고 미리 판단해 일찍 시작해 둔 build이고, payload ID는 execution client가 그 build를 다시 찾는 local 표식입니다."
      ariaLabel="PrepareProposal의 payload ID 재사용과 새 build 분기, 포장, 시간 합계"
      scenes={SCENES}
      render={(active) => {
        const lit = new Set<Step>(SCENES[active].lit);
        return (
          <div className="min-w-0">
            <Box on={lit.has("check")} title="optimistic payload height = 101?" body="keeper head H100 · header AppHash A100 기준" />
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="grid min-w-0 content-start gap-2">
                <p className="text-[11px] font-semibold text-muted-foreground sm:text-xs">예 · optimistic hit</p>
                <Box on={lit.has("reuse")} title="기존 ID 재사용" body="FCU를 다시 보내지 않음" />
              </div>
              <div className="grid min-w-0 content-start gap-2">
                <p className="text-[11px] font-semibold text-muted-foreground sm:text-xs">아니오 · 새 build</p>
                <Box on={lit.has("fcu")} title="forkchoiceUpdatedV3" body="H100 + payload attributes → id101" />
                <Box on={lit.has("delay")} title="build delay" body="설정된 시간만큼 대기" />
              </div>
              <div className="hidden min-w-0 content-start gap-2 sm:grid">
                <p className="text-xs font-semibold text-muted-foreground">두 경로가 만나는 곳</p>
                <Box on={lit.has("get")} title="getPayloadV3(id101)" body="P101 envelope · blob commitments 수신" />
                <Box on={lit.has("encode")} title="unsigned tx 1개 → C101" body="P101 + blob commitments + 이전 height votes" />
              </div>
            </div>
            <div className="mt-2 grid gap-2 sm:hidden">
              <Box on={lit.has("get")} title="getPayloadV3(id101)" body="P101 envelope · blob commitments 수신" />
              <Box on={lit.has("encode")} title="unsigned tx 1개 → C101" body="P101 + blob commitments + 이전 height votes" />
            </div>
            <StableSceneStack
              active={active === 4 ? 1 : 0}
              className="mt-3"
              scenes={[
                <p key="wait" className="rounded-lg border border-dashed border-border px-3 py-2 text-[11px] leading-5 text-muted-foreground sm:text-xs">
                  마지막 장면에서 새 build 한 번의 시간을 10초 한도와 비교합니다. 네 시간은 설명용 가정입니다.
                </p>,
                <div key="time" className="grid gap-2 sm:grid-cols-2 sm:gap-x-6">
                  <TimeBar max={LIMIT} label={`10초 context 한도 안의 ${TOTAL.toFixed(2)}초 (가정)`} />
                  <TimeBar max={1} label="같은 0.80초를 0–1초 축으로 확대" />
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground sm:col-span-2 sm:text-[11px]">
                    {SEGMENTS.map((seg) => (
                      <span key={seg.name} className="inline-flex items-center gap-1">
                        <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: seg.color }} />
                        {seg.name} {seg.sec.toFixed(2)}
                      </span>
                    ))}
                  </div>
                </div>,
              ]}
            />
          </div>
        );
      }}
    />
  );
}
