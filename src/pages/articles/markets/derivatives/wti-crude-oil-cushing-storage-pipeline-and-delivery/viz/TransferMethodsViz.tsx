import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 원유를 다른 탱크로 실제로 밀어 옮기거나, 같은 시스템 안에서 장부상 소유권만 바꾼다.
 * 어느 방법이든 송유관 표·수량 증서·대금 기록이 함께 움직여야 한다. 수량은 계약 단위 1천 배럴.
 */
const SCENES = [
  {
    label: "출발 상태",
    summary: "매도자 탱크에 1,000배럴",
    mode: "start",
    note: "매도자는 쿠싱에서 인도할 원유와 연결점을 준비하고, 매수자는 받을 시설 정보를 냅니다. 아직 원유도 소유권도 움직이지 않았습니다.",
  },
  {
    label: "실제로 옮기기",
    summary: "원유가 송유관으로 이동",
    mode: "move",
    note: "연결된 시설 사이로 원유 1천 배럴을 밀어 옮깁니다. 원유는 매수자가 지정한 탱크로 가고 소유도 매수자에게 넘어갑니다.",
  },
  {
    label: "장부만 바꾸기",
    summary: "원유는 그대로, 소유자 이름만",
    mode: "book",
    note: "같은 시스템 안에서는 원유를 움직이지 않고 장부상 소유자만 매도자에서 매수자로 바꿀 수 있습니다. 탱크 안 원유의 양은 그대로입니다.",
  },
  {
    label: "어느 방법이든",
    summary: "세 기록이 함께 움직여야 끝",
    mode: "records",
    note: "옮기든 장부만 바꾸든 송유관 표, 수량 증서, 대금 기록이 함께 움직여야 인도가 끝납니다. 하나라도 어긋나면 화면 가격이 실제 원유가 되지 않습니다.",
  },
] as const;

const RECORDS = ["송유관 표", "수량 증서", "대금 기록"] as const;

function Tank({ x, label, fill, owner, dim }: { x: number; label: string; fill: number; owner: string; dim: boolean }) {
  const top = 40;
  const height = 80;
  const level = height * fill;
  return (
    <g opacity={dim ? 0.4 : 1}>
      <text x={x + 45} y={28} textAnchor="middle" fontSize={11} fill="#64748b">{label}</text>
      <rect x={x} y={top} width={90} height={height} rx={6} fill="none" stroke="#64748b" strokeWidth={1} />
      {level > 0 ? <rect x={x + 1} y={top + height - level} width={88} height={level - 1} rx={5} fill="#334155" opacity={0.75} /> : null}
      {level > 0 ? <text x={x + 45} y={top + height - level / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">1,000 bbl</text> : null}
      <text x={x + 45} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill={owner === "매수자" ? "#2563eb" : "#475569"}>소유: {owner}</text>
    </g>
  );
}

export default function TransferMethodsViz() {
  return (
    <SceneShell
      eyebrow="인도 방법"
      title="원유를 옮기거나, 소유자 이름만 바꿉니다"
      description="왼쪽은 매도자가 준비한 쿠싱 시설, 오른쪽은 매수자가 지정한 시설입니다. 탱크 모양과 크기는 구분을 위한 그림입니다."
      ariaLabel="시설 간 실제 이전과 장부상 소유권 이전 비교"
      scenes={SCENES}
      render={(index) => {
        const mode = SCENES[index].mode;
        const leftFill = mode === "move" ? 0 : 1;
        const rightFill = mode === "move" ? 1 : 0;
        const leftOwner = mode === "book" ? "매수자" : mode === "move" ? "−" : "매도자";
        const rightOwner = mode === "move" ? "매수자" : "−";
        const recordsOn = mode !== "start";
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 156" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
              <Tank x={30} label="매도자 쪽 시설" fill={leftFill} owner={mode === "records" ? "매도자 → 매수자" : leftOwner} dim={false} />
              <Tank x={240} label="매수자 지정 시설" fill={rightFill} owner={mode === "records" ? "(옮기면 여기)" : rightOwner} dim={mode === "book"} />
              <line x1={120} x2={240} y1={108} y2={108} stroke="#94a3b8" strokeWidth={1} />
              <line x1={120} x2={240} y1={116} y2={116} stroke="#94a3b8" strokeWidth={1} />
              <text x={180} y={100} textAnchor="middle" fontSize={11} fill="#64748b">송유관 연결</text>
              {mode === "move" ? (
                <>
                  <line x1={130} x2={226} y1={112} y2={112} stroke="#2563eb" strokeWidth={1.25} />
                  <polygon points="226,107 236,112 226,117" fill="#2563eb" />
                </>
              ) : null}
              {mode === "book" ? <text x={180} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">장부상 이름만 변경</text> : null}
            </svg>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {RECORDS.map((record) => (
                <div
                  key={record}
                  className={`rounded-lg border px-2 py-2 text-center text-xs leading-5 ${recordsOn ? "border-[#2563eb] font-semibold" : "border-dashed border-border text-muted-foreground"} ${mode === "records" ? "bg-[#2563eb]/10" : ""}`}
                >
                  <span className="block">{record}</span>
                  <span className="block font-normal text-muted-foreground">{recordsOn ? "함께 갱신" : "아직"}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
