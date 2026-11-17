import BranchSceneShell from "./BranchSceneShell";

/**
 * 본문 대응: #baseapp — 성공한 ante 변경은 node-local check state에 누적되어 다음 CheckTx가
 * sequence 충돌을 판단할 때 읽고, committed query에는 보이지 않으며 Commit 뒤 최신 root에서 다시 만들어진다.
 * 수치: 높이 40 · Alice 100 · Bob 20 · seq 7, fee 1 · 송금 10 → v41 · Alice 89 · Bob 30 · seq 8 (본문 첫 Viz와 같음).
 * 두 번째 CheckTx(seq 8 새 tx, seq 7 재전송)는 둘 중 하나가 온다는 별개의 가정이며, 둘 다 seq 8과 비교합니다.
 */
const SCENES = [
  {
    label: "높이 40의 출발점",
    summary: "root seq 7 = check seq 7",
    note: "Sequence는 계정이 보낸 transaction의 순번입니다. 출발점에서는 durable root와 이 node의 check state가 같은 값(Alice 100 · seq 7)을 가리킵니다.",
    root: ["Alice 100 · Bob 20", "seq 7"],
    check: ["Alice 100", "seq 7"],
    request: ["요청 없음", ""],
    verdict: "",
    checkChanged: false,
  },
  {
    label: "첫 CheckTx 통과",
    summary: "check state만 seq 8",
    note: "Alice의 fee 1 · seq 7 transaction이 ante를 통과합니다. fee 차감과 sequence 증가는 check state에 남지만 query가 읽는 root는 여전히 seq 7입니다. MsgSend 송금 10은 CheckTx에서 실행하지 않습니다.",
    root: ["Alice 100 · Bob 20", "seq 7 · query는 여기만 읽음"],
    check: ["Alice 99 (fee 1)", "seq 8"],
    request: ["tx 1 · seq 7 · fee 1", "ante 통과"],
    verdict: "CheckTx OK · node-local",
    checkChanged: true,
  },
  {
    label: "다음 CheckTx가 읽는 값",
    summary: "seq 8 기준으로 충돌 판단",
    note: "다음 요청은 root의 seq 7이 아니라 check state의 seq 8과 비교됩니다. 그래서 seq 8인 새 요청은 순번이 맞고, seq 7을 다시 쓴 요청은 충돌로 판단할 수 있습니다. 두 경우는 누적을 보이려는 가정이며, 일치한 요청이 통과하면 check state는 다시 seq 9로 올라갑니다.",
    root: ["Alice 100 · Bob 20", "seq 7"],
    check: ["Alice 99", "seq 8 ← 비교 기준"],
    request: ["경우 ① tx 2 · seq 8 → 일치 (가정)", "경우 ② tx 1 재전송 · seq 7 → 충돌 (가정)"],
    verdict: "비교 기준은 root가 아니라 check state",
    checkChanged: true,
  },
  {
    label: "Commit 뒤 다시 만들기",
    summary: "v41에서 check state 재생성",
    note: "Block이 실행되고 Commit이 version 41을 저장하면 check state는 최신 root에서 다시 만들어집니다. 이제 query와 check state가 함께 Alice 89 · Bob 30 · seq 8을 가리킵니다.",
    root: ["v41 · Alice 89 · Bob 30", "seq 8"],
    check: ["v41에서 재생성", "seq 8"],
    request: ["요청 없음", ""],
    verdict: "durable version 41",
    checkChanged: false,
  },
] as const;

function Box({ title, sub, lines, highlight }: { title: string; sub: string; lines: readonly string[]; highlight: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border p-3 ${highlight ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className="block font-mono text-[10px] font-bold text-primary">{title}</span>
      <span className="block break-keep text-[11px] leading-5 text-muted-foreground">{sub}</span>
      <div className="mt-2 space-y-1">
        {lines.map((line, index) => (
          <strong key={index} className="block min-h-5 break-keep font-mono text-xs leading-5">
            {line}
          </strong>
        ))}
      </div>
    </div>
  );
}

export default function CheckStateCarryViz() {
  return (
    <BranchSceneShell
      eyebrow="CheckTx state의 수명"
      title="CheckTx가 남긴 sequence는 다음 CheckTx가 읽고, Commit 뒤 새 root에서 다시 시작합니다"
      description="왼쪽은 query가 읽는 durable root, 가운데는 이 node만 가진 check state, 오른쪽은 지금 들어온 CheckTx 요청입니다. 수치는 본문 첫 그림의 고정 예시이고 두 번째 요청은 가정입니다."
      ariaLabel="CheckTx가 node-local check state에 sequence를 누적하고 Commit 뒤 재생성되는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid gap-3 sm:grid-cols-3">
              <Box title="DURABLE ROOT" sub="committed query 정본" lines={scene.root} highlight={active === 3} />
              <Box title="CHECK STATE" sub="이 node의 mempool 판단용" lines={scene.check} highlight={scene.checkChanged} />
              <Box title="CHECKTX 요청" sub="ante만 실행" lines={scene.request} highlight={active === 1 || active === 2} />
            </div>
            <div className="mt-3 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2 rounded-lg border border-border bg-background p-3 text-xs leading-5">
              <span className="text-muted-foreground">이 장면의 결과</span>
              <strong className="min-h-5 break-keep font-mono text-primary">{scene.verdict || "—"}</strong>
            </div>
          </div>
        );
      }}
    />
  );
}
