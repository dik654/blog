import SceneShell from "./SceneShell";

/**
 * 본문 대응: #publish-heartbeat — message cache 기본 5 heartbeat bucket 보관, 최근 3 bucket의 ID만 gossip.
 * Duplicate cache 기본 60초. Heartbeat 기본 간격 1초.
 * heartbeat k번 뒤 M은 bucket k+1 → k=0..2 IHAVE 대상, k=3..4 원문만 남음, k=5 원문 삭제.
 */
const BUCKETS = 5;
const GOSSIP = 3;

const SCENES = Array.from({ length: BUCKETS + 1 }, (_, k) => {
  const bucket = k + 1;
  const gossiped = bucket <= GOSSIP;
  const kept = bucket <= BUCKETS;
  const note = gossiped
    ? `M이 bucket ${bucket}에 있습니다. 최근 ${GOSSIP} bucket 안이라 heartbeat의 IHAVE에 M의 ID가 실리고, IWANT가 오면 cache의 full message로 답할 수 있습니다.`
    : kept
      ? `M이 bucket ${bucket}로 밀렸습니다. 최근 ${GOSSIP} bucket 밖이라 IHAVE로는 더 알리지 않지만, 원문은 아직 ${BUCKETS} bucket 안에 남아 있습니다.`
      : `다섯 번째 bucket까지 밀린 뒤 한 번 더 shift돼 원문이 사라졌습니다. IHAVE를 기억하는 peer가 IWANT를 보내도 full message를 되살릴 수 없습니다. 기본 1초 간격이면 약 5초 뒤라 60초짜리 duplicate cache는 여전히 이 ID를 기억합니다.`;
  return {
    label: k === 0 ? "publish 직후" : `heartbeat ${k}번 뒤`,
    summary: gossiped ? `bucket ${bucket} · IHAVE 대상` : kept ? `bucket ${bucket} · 원문만 보관` : "원문 삭제 · ID는 duplicate cache에",
    note,
    bucket,
    gossiped,
    kept,
  };
});

function Status({ label, on, onText, offText }: { label: string; on: boolean; onText: string; offText: string }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`rounded-md border px-2 py-1 font-semibold ${on ? "border-[#16a34a] text-[#15803d] dark:text-[#4ade80]" : "border-dashed border-[#dc2626] text-[#b91c1c] dark:text-[#fca5a5]"}`}>
        {on ? onText : offText}
      </span>
    </div>
  );
}

export default function McacheViz() {
  return (
    <SceneShell
      eyebrow="cache 두 개의 수명"
      title="message ID는 세 bucket 동안 알리고, 원문은 다섯 bucket 동안만 남습니다"
      description="칸 하나가 heartbeat 한 번 동안의 message cache bucket입니다. heartbeat마다 칸이 한 칸씩 밀려 Alice가 publish한 message M도 오른쪽으로 이동합니다. 파란 테두리 범위가 IHAVE로 ID를 알리는 최근 3 bucket입니다."
      ariaLabel="heartbeat마다 message cache bucket이 밀리며 IHAVE 대상과 원문 보관이 끝나는 시점"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="relative grid grid-cols-6 gap-1.5 pt-6">
              <div className="pointer-events-none absolute left-0 top-1 h-4 rounded-t-md border-x border-t border-[#2563eb] text-center" style={{ width: "calc(50% - 0.1875rem)" }}>
                <span className="relative -top-2.5 bg-background px-1 text-[11px] font-semibold text-[#2563eb] dark:text-[#93c5fd]">IHAVE 범위</span>
              </div>
              {Array.from({ length: BUCKETS + 1 }, (_, i) => {
                const here = scene.bucket === i + 1;
                const outside = i === BUCKETS;
                return (
                  <div
                    key={i}
                    className={`relative flex h-20 flex-col items-center justify-between rounded-md border px-1 py-1.5 text-center ${outside ? "border-dashed border-border/60" : "border-border bg-background"}`}
                  >
                    <span className="text-[11px] leading-4 text-muted-foreground">{outside ? "밀려남" : i === 0 ? "1 최신" : `${i + 1}`}</span>
                    {here && (
                      <span className={`rounded px-1.5 py-0.5 font-mono text-xs font-bold ${outside ? "border border-dashed border-[#dc2626] text-[#b91c1c] dark:text-[#fca5a5]" : "bg-[#2563eb] text-white"}`}>
                        {outside ? "원문 없음" : "M"}
                      </span>
                    )}
                    <span className="h-4" />
                  </div>
                );
              })}
            </div>
            <div className="space-y-1.5">
              <Status label="IHAVE에 ID 실림" on={scene.gossiped} onText="예" offText="아니오" />
              <Status label="IWANT에 원문 응답" on={scene.kept} onText="가능 (cache에 있음)" offText="불가 (원문 없음)" />
              <Status label="duplicate cache" on onText="ID 기억 (기본 60초)" offText="" />
            </div>
          </div>
        );
      }}
    />
  );
}
