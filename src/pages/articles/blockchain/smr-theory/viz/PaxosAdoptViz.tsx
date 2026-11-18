import SceneShell from "./SceneShell";

/**
 * 본문 대응: #paxos "왜 가장 높은 accepted value를 이어받나".
 * 가정 사례: acceptor 5개(quorum 3). proposal #1의 value v가 A1–A3에 accept되어 chosen.
 * proposal #2가 A3–A5에 Prepare → A3이 (#1, v) 보고 → 늦게 온 Accept(#1)은 A4가 거절 → #2는 v로 Accept.
 */
interface Acceptor {
  promised: number | null;
  accepted: string | null;
}

const a = (promised: number | null, accepted: string | null): Acceptor => ({ promised, accepted });

const SCENES = [
  {
    label: "#1의 v가 chosen됨",
    summary: "A1·A2·A3 accept (#1, v)",
    note: "Proposal #1이 value v로 Accept quorum 3개(A1–A3)에 기록되어 v가 chosen됐습니다. A4·A5는 아직 아무것도 accept하지 않았습니다.",
    acceptors: [a(1, "#1·v"), a(1, "#1·v"), a(1, "#1·v"), a(null, null), a(null, null)],
    quorum: [0, 1, 2],
    reply: [null, null, null, null, null],
  },
  {
    label: "#2가 다른 quorum에 Prepare",
    summary: "A3·A4·A5 promise #2",
    note: "새 proposer가 #2로 A3–A5에 묻습니다. 셋은 #2보다 낮은 proposal을 더는 accept하지 않겠다고 약속하고 자기 기록을 보고합니다. 두 quorum은 A3을 공유합니다.",
    acceptors: [a(1, "#1·v"), a(1, "#1·v"), a(2, "#1·v"), a(2, null), a(2, null)],
    quorum: [2, 3, 4],
    reply: [null, null, "보고: #1·v", "보고: 없음", "보고: 없음"],
  },
  {
    label: "늦게 온 낮은 번호는 거절",
    summary: "Accept(#1) → A4 거절",
    note: "#1의 Accept가 뒤늦게 A4에 도착해도 A4는 이미 #2에 promise했으므로 거절합니다. Promise가 낮은 proposal의 뒤늦은 accept를 막는 장면입니다.",
    acceptors: [a(1, "#1·v"), a(1, "#1·v"), a(2, "#1·v"), a(2, null), a(2, null)],
    quorum: [],
    reply: [null, null, null, "거절: #1", null],
  },
  {
    label: "가장 높은 accepted value를 이어받음",
    summary: "#2는 v로 Accept → 여전히 v",
    note: "보고 중 가장 높은 accepted proposal은 #1이고 value는 v입니다. #2는 자기가 원래 내려던 값 대신 v를 제안하므로, 같은 slot에서 v 아닌 value가 chosen되지 않습니다.",
    acceptors: [a(1, "#1·v"), a(1, "#1·v"), a(2, "#2·v"), a(2, "#2·v"), a(2, "#2·v")],
    quorum: [2, 3, 4],
    reply: [null, null, null, null, null],
  },
] as const;

export default function PaxosAdoptViz() {
  return (
    <SceneShell
      eyebrow="Quorum 교집합"
      title="새 Prepare quorum이 이전 accept quorum과 겹치는 acceptor에게서 v를 넘겨받습니다"
      description="칸 하나가 acceptor입니다. Promise는 그 번호보다 낮은 proposal을 accept하지 않겠다는 약속이고, accept 칸은 이미 accept해 기록한 (proposal 번호·value)입니다. 5개·번호 #1·#2는 가정입니다."
      note="이 사례는 교집합 acceptor가 v를 직접 보고하는 가장 단순한 경우입니다. 본문 말대로 더 높은 proposal의 연쇄를 거쳐 이어받는 경우도 있습니다."
      ariaLabel="Paxos acceptor 다섯 개에서 promise와 accepted value가 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        // 이전 #1 accept quorum(A1–A3)과 #2 quorum(A3–A5)을 같은 열 위에 막대로 그려 겹치는 A3을 보이게 합니다.
        const bars = [
          { show: true, cols: "col-start-1 col-span-3", color: "#2563eb", text: "#1 accept quorum" },
          { show: active !== 0, cols: "col-start-3 col-span-3", color: "#d97706", text: active === 3 ? "#2 Accept quorum" : "#2 Prepare quorum" },
        ];
        return (
          <div className="space-y-2">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {scene.acceptors.map((acc, i) => {
              const inQuorum = (scene.quorum as readonly number[]).includes(i);
              const reply = scene.reply[i];
              // 테두리 색은 아래 막대와 같게: #1 accept quorum은 파랑, #2 quorum은 주황.
              const quorumBorder = active === 0 ? "border-[#2563eb]" : "border-[#d97706]";
              return (
                <div key={i} className={`flex min-w-0 flex-col rounded-lg border px-1 py-2 text-center text-[11px] leading-4 sm:px-2 sm:text-xs sm:leading-5 ${inQuorum ? quorumBorder : "border-border"} bg-background`}>
                  <span className="font-bold">A{i + 1}</span>
                  <span className="mt-1 text-muted-foreground">promise</span>
                  <span className="font-mono font-semibold">{acc.promised === null ? "−" : `#${acc.promised}`}</span>
                  <span className="mt-1 text-muted-foreground">accept</span>
                  <span className={`font-mono font-semibold ${acc.accepted ? "text-[#2563eb]" : ""}`}>{acc.accepted ?? "−"}</span>
                  <span className={`mt-1 min-h-8 break-keep sm:min-h-10 ${reply?.includes("거절") ? "font-semibold text-[#dc2626]" : "text-[#d97706]"}`}>{reply ?? ""}</span>
                </div>
              );
            })}
          </div>
          {bars.map((bar) => (
            <div key={bar.color} className="grid grid-cols-5 gap-1.5 sm:gap-2" aria-hidden={!bar.show}>
              <span
                className={`${bar.cols} truncate border-t px-1 pt-1 text-center text-[11px] font-semibold sm:text-xs ${bar.show ? "" : "invisible"}`}
                style={{ borderColor: bar.color, color: bar.color, borderTopWidth: 1.25 }}
              >
                {bar.text}
              </span>
            </div>
          ))}
          </div>
        );
      }}
    />
  );
}
