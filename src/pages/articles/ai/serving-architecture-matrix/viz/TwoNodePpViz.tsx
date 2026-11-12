import SceneShell from "./SceneShell";

/**
 * 본문 대응: node-case 절 끝 — 두 번째 노드를 PP 경계로 붙이면 가중치는 한 벌, 늘어난 691.2GB는 모두 기록 자리.
 * K2.5: 691.2 − 595.2 = 96GB → 96 + 691.2 = 787.2GB. 노드마다 가중치 절반(297.6GB)으로 나눠 둔다고 그렸다.
 * 요청 하나의 token 시간: 노드마다 읽는 가중치가 절반이 되는 대신 두 노드를 차례로 거치고 경계 왕복 하나가 더해진다.
 */
const NODE_GB = 691.2;
const WEIGHT_GB = 595.2;

const SCENES = [
  {
    label: "노드 1대",
    summary: "기록 자리 96 GB",
    nodes: 1,
    note: `K2.5 가중치 ${WEIGHT_GB}GB를 올리면 노드의 ${NODE_GB}GB 가운데 ${(NODE_GB - WEIGHT_GB).toFixed(1)}GB가 기록 자리입니다. token 하나를 만들 때 이 노드가 61층의 가중치를 혼자 읽습니다.`,
  },
  {
    label: "노드 2대, 경계 하나",
    summary: `기록 자리 ${(2 * NODE_GB - WEIGHT_GB).toFixed(1)} GB · 요청 하나의 속도는 오르지 않음`,
    nodes: 2,
    note: `가중치는 여전히 한 벌이라 늘어난 ${NODE_GB}GB가 모두 기록 자리가 되어 ${(2 * NODE_GB - WEIGHT_GB).toFixed(1)}GB입니다. 그런데 한 token의 층들을 앞 노드와 뒤 노드가 차례로 처리하므로, 노드마다 읽는 가중치가 절반이 되는 대신 두 번 기다리고 경계 왕복 하나가 더해집니다. 그래서 요청 하나의 속도는 오르지 않습니다.`,
  },
] as const;

const WEIGHT = "#64748b";
const KV = "#059669";
const READ = "#2563eb";
const HOP = "#d97706";

function NodeBar({ label, weight, present }: { label: string; weight: number; present: boolean }) {
  const weightShare = (weight / NODE_GB) * 100;
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-xs sm:text-sm">
      <span className={present ? "font-semibold" : "text-muted-foreground/60"}>{label}</span>
      {present ? (
        <div className="flex h-6 min-w-0 overflow-hidden rounded-sm">
          <div className="flex h-full items-center justify-center text-[11px] font-semibold text-white" style={{ width: `${weightShare}%`, backgroundColor: WEIGHT }}>
            가중치 {weight.toFixed(1)}
          </div>
          <div className="flex h-full items-center justify-center text-[11px] font-semibold text-white" style={{ width: `${100 - weightShare}%`, backgroundColor: KV }}>
            {weightShare < 70 ? "기록 자리 " : ""}
            {(NODE_GB - weight).toFixed(1)}
          </div>
        </div>
      ) : (
        <div className="flex h-6 items-center rounded-sm border border-dashed border-border/60 px-2 text-[11px] text-muted-foreground/60">노드 없음</div>
      )}
    </div>
  );
}

export default function TwoNodePpViz() {
  return (
    <SceneShell
      eyebrow="Pipeline boundary between nodes"
      title="노드를 붙이면 기록 자리는 늘고 요청 하나의 속도는 그대로입니다"
      description="위 막대는 노드 하나의 691.2GB(GB 단위)를 가중치와 기록 자리(초록)로 나눈 것이고, 아래 띠는 요청 하나가 token 하나를 만드는 동안의 순서입니다. Kimi K2.5 기준입니다."
      note="PP 경계에서 층을 두 노드가 절반씩 맡는다고 두고 그렸습니다(가정). 아래 띠의 길이는 읽는 가중치 양에 비례한 상대값이고, 경계 왕복의 길이는 재지 않아 눈금 밖 표시로만 둡니다."
      ariaLabel="노드 1대와 노드 2대 PP에서 Kimi K2.5의 기록 자리와 token 하나의 처리 순서"
      scenes={SCENES}
      render={(active) => {
        const two = SCENES[active].nodes === 2;
        const weightA = two ? WEIGHT_GB / 2 : WEIGHT_GB;
        return (
          <div className="min-w-0 space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">메모리 (GB)</p>
              <NodeBar label="노드 A" weight={weightA} present />
              <NodeBar label="노드 B" weight={WEIGHT_GB / 2} present={two} />
              <p className="text-xs text-muted-foreground sm:text-sm">
                기록 자리 합계 <span className="font-mono font-bold" style={{ color: KV }}>{two ? (2 * NODE_GB - WEIGHT_GB).toFixed(1) : (NODE_GB - WEIGHT_GB).toFixed(1)} GB</span>
                {two ? " · 1대일 때의 약 8.2배" : ""}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">요청 하나, token 하나 (상대 길이)</p>
              <div className="flex h-8 min-w-0 items-stretch gap-0 text-[11px] font-semibold text-white">
                {two ? (
                  <>
                    <div className="flex items-center justify-center rounded-l-sm px-1" style={{ width: "47%", backgroundColor: READ }}>
                      노드 A · 앞쪽 층
                    </div>
                    <div className="flex items-center justify-center border-x border-dashed px-1 text-[10px]" style={{ width: "6%", color: HOP, borderColor: HOP }}>
                      ⇄
                    </div>
                    <div className="flex items-center justify-center rounded-r-sm px-1" style={{ width: "47%", backgroundColor: READ, opacity: 0.75 }}>
                      노드 B · 뒤쪽 층
                    </div>
                  </>
                ) : (
                  <div className="flex w-[94%] items-center justify-center rounded-sm px-1" style={{ backgroundColor: READ }}>
                    노드 A · 61층 전부
                  </div>
                )}
              </div>
              <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
                {two ? (
                  <>
                    절반씩 읽는 두 구간을 <strong>차례로</strong> 지나고, 가운데 <span style={{ color: HOP }} className="font-semibold">⇄ 경계 왕복</span>이 하나 더해집니다. 경계를 넘는 것은 token당 hidden 벡터 14,336 byte입니다.
                  </>
                ) : (
                  <>한 노드가 61층의 가중치를 모두 읽고 나서 token 하나가 나옵니다.</>
                )}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
