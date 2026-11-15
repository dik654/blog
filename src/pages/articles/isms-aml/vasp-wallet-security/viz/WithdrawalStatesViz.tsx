import SceneShell from "./SceneShell";

/**
 * 본문 대응: #withdrawal-operations 첫째·둘째 문단.
 * Signer success 뒤에 broadcast accepted → mempool → chain confirmation → finality policy → 고객 채무 감소가 별도 상태로 이어진다.
 * RPC timeout으로 결과가 unknown이면 새 transaction을 만들지 않고 hash·nonce·intent digest로 reconcile한다.
 */
const STATES = [
  ["signer success", "valid signature bytes 생성"],
  ["broadcast accepted", "노드가 거래를 받음"],
  ["mempool", "블록 포함 전 대기"],
  ["chain confirmation", "블록에 포함됨"],
  ["finality policy", "정한 확정 기준 충족"],
  ["고객 채무 감소", "원장에 출금 반영"],
] as const;

type Mark = "done" | "todo" | "unknown";

const SCENES = [
  {
    label: "서명 성공은 첫 칸",
    summary: "1/6 상태만 확인됨",
    marks: ["done", "todo", "todo", "todo", "todo", "todo"] as readonly Mark[],
    note: "Signer success는 유효한 서명 byte를 만들었다는 뜻일 뿐입니다. 거래가 네트워크에 퍼졌는지, 블록에 들어갔는지, 고객 원장이 바뀌었는지는 아직 아무것도 확인되지 않았습니다.",
  },
  {
    label: "단계마다 receipt",
    summary: "6/6 · receipt + idempotency key",
    marks: ["done", "done", "done", "done", "done", "done"] as readonly Mark[],
    note: "각 상태에 종류가 정해진 receipt(typed receipt)와 idempotency key(다시 보내도 효과가 한 번만 생기게 하는 키)를 붙여 retry가 중복 출금을 만들지 않게 합니다. 고객 채무 감소는 마지막 상태입니다.",
  },
  {
    label: "RPC timeout",
    summary: "broadcast 결과 unknown",
    marks: ["done", "unknown", "unknown", "unknown", "todo", "todo"] as readonly Mark[],
    note: "Broadcast 요청 뒤 응답이 오지 않으면 거래가 네트워크에 들어갔는지, 이미 블록에 포함됐는지도 알 수 없습니다. 실패로도 성공으로도 기록하지 않고 unknown external effect로 둡니다.",
  },
  {
    label: "새 거래 대신 reconcile",
    summary: "hash · nonce · intent digest로 조회",
    marks: ["done", "unknown", "unknown", "unknown", "todo", "todo"] as readonly Mark[],
    note: "곧바로 새 transaction을 만들면 앞의 거래가 이미 퍼진 경우 출금이 두 번 나갈 수 있습니다. 그래서 기존 transaction hash·nonce·intent digest로 실제 상태를 먼저 맞춘 뒤에만 다음 행동을 정합니다.",
  },
] as const;

const MARK_STYLE: Record<Mark, string> = {
  done: "border-green-600 text-green-700 dark:text-green-400",
  todo: "border-dashed border-border text-muted-foreground",
  unknown: "border-amber-600 text-amber-700 dark:text-amber-400",
};
const MARK_TEXT: Record<Mark, string> = { done: "확인", todo: "아직", unknown: "unknown" };

export default function WithdrawalStatesViz() {
  return (
    <SceneShell
      eyebrow="출금 상태 · 서명 뒤"
      title="서명 성공부터 고객 채무 감소까지는 여섯 개의 다른 상태입니다"
      description="민지의 0.3 BTC 출금이 signer를 통과한 뒤의 상태를 차례로 놓았습니다. mempool은 broadcast된 거래가 블록에 들어가기 전 기다리는 곳이고, finality policy는 몇 번 확인되면 되돌려지지 않은 것으로 볼지 사업자가 정한 기준입니다."
      ariaLabel="서명 성공 뒤 broadcast, mempool, confirmation, finality, 원장 반영 상태와 timeout 시 reconcile"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const reconcile = active === 3;
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {STATES.map(([name, meaning], i) => {
                const mark = scene.marks[i];
                return (
                  <li key={name} className={`min-w-0 rounded-md border bg-background px-2 py-2 text-center ${MARK_STYLE[mark]}`}>
                    <span className="block font-mono text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                    <strong className="block break-words text-xs leading-4">{name}</strong>
                    <span className="mt-1 block break-keep text-[11px] leading-4 text-muted-foreground">{meaning}</span>
                    <span className="mt-1 block text-[11px] font-bold">{MARK_TEXT[mark]}</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className={`rounded-md border px-3 py-2 text-xs leading-5 ${reconcile ? "border-red-600 text-red-700 line-through dark:text-red-400" : active === 2 ? "border-dashed border-border text-muted-foreground" : "invisible border-border"}`}>
                blind retry: 새 transaction 즉시 생성
              </div>
              <div className={`rounded-md border px-3 py-2 text-xs leading-5 ${reconcile ? "border-green-600 text-green-700 dark:text-green-400" : active === 2 ? "border-dashed border-border text-muted-foreground" : "invisible border-border"}`}>
                reconcile: 기존 hash · nonce · intent digest로 상태 조회
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
