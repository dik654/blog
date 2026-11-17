import SceneShell from "./SceneShell";

/**
 * 본문 대응: #proof-withdrawal-boundary 둘째 문단.
 * 민지의 0.3 BTC 출금: request→risk/policy→분리 승인→signing→broadcast→confirmation→고객 채무 감소.
 * Broadcast hash는 confirmation이나 내부 원장 반영이 아니며, 실패·replacement·reorg는 같은 intent ID로 reconcile한다.
 * 채무 2 BTC → 1.7 BTC는 수수료가 없다고 둔 가정의 산수이다.
 */
const STEPS = ["request", "risk/policy", "분리 승인", "signing", "broadcast", "confirmation", "고객 채무 감소"] as const;

type Mark = "done" | "wait" | "recheck";

const SCENES = [
  {
    label: "요청에 intent ID",
    summary: "민지 채무 2 BTC 그대로",
    marks: ["done", "wait", "wait", "wait", "wait", "wait", "wait"] as readonly Mark[],
    debt: "2 BTC",
    note: "민지가 0.3 BTC 출금을 요청하면 이 요청에 intent ID 하나를 붙입니다. 뒤의 여섯 단계는 모두 이 ID로 같은 출금임을 확인합니다.",
  },
  {
    label: "broadcast hash가 생겨도",
    summary: "confirmation·원장 반영 전",
    marks: ["done", "done", "done", "done", "done", "wait", "wait"] as readonly Mark[],
    debt: "2 BTC",
    note: "Broadcast hash는 거래를 네트워크에 보냈다는 표시일 뿐 chain confirmation이나 내부 원장 반영이 아닙니다. 그래서 민지의 채무는 아직 2 BTC로 남아 있습니다.",
  },
  {
    label: "reorg·replacement",
    summary: "같은 intent ID로 reconcile",
    marks: ["done", "done", "done", "done", "recheck", "recheck", "wait"] as readonly Mark[],
    debt: "2 BTC",
    note: "Reorg(블록이 다른 블록으로 바뀌어 포함 기록이 사라지는 일)나 replacement(같은 출금을 수수료 등을 바꿔 다시 보낸 거래)가 생기면 새 출금 요청을 만들지 않습니다. 같은 intent ID로 broadcast와 confirmation 상태를 다시 맞춰 이중 출금을 막습니다.",
  },
  {
    label: "confirmation 뒤 채무 감소",
    summary: "2 − 0.3 = 1.7 BTC",
    marks: ["done", "done", "done", "done", "done", "done", "done"] as readonly Mark[],
    debt: "1.7 BTC",
    note: "Chain confirmation까지 확인한 뒤에야 마지막 단계에서 고객 원장의 채무를 줄입니다. 수수료가 없다고 두면(가정) 민지의 채무는 2 BTC에서 1.7 BTC가 됩니다.",
  },
] as const;

const MARK_STYLE: Record<Mark, string> = {
  done: "border-green-600 text-green-700 dark:text-green-400",
  wait: "border-dashed border-border text-muted-foreground",
  recheck: "border-amber-600 text-amber-700 dark:text-amber-400",
};
const MARK_TEXT: Record<Mark, string> = { done: "확인", wait: "아직", recheck: "재조정" };

export default function WithdrawalLifecycleViz() {
  return (
    <SceneShell
      eyebrow="출금 lifecycle"
      title="거래를 보낸 것과 고객 채무가 줄어든 것 사이에는 단계가 더 있습니다"
      description="민지의 0.3 BTC 출금을 일곱 단계로 놓았습니다. 모든 칸은 같은 intent ID를 공유합니다."
      ariaLabel="출금 요청부터 고객 채무 감소까지 일곱 단계와 reorg 시 같은 intent ID로 재조정하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STEPS.map((step, i) => {
                const mark = scene.marks[i];
                return (
                  <li key={step} className={`min-w-0 rounded-md border bg-background px-2 py-2 text-center ${MARK_STYLE[mark]}`}>
                    <span className="block font-mono text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                    <strong className="block break-words text-xs leading-4">{step}</strong>
                    <span className="mt-1 block text-[11px] font-bold">{MARK_TEXT[mark]}</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <p className="rounded-md border border-border px-3 py-2 text-xs leading-5">
                <span className="text-muted-foreground">모든 단계의 키 · </span>
                <span className="font-mono font-bold">intent ID 하나</span>
              </p>
              <p className="rounded-md border border-border px-3 py-2 text-xs leading-5">
                <span className="text-muted-foreground">고객 원장의 민지 채무 · </span>
                <span className="font-mono font-bold">{scene.debt}</span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
