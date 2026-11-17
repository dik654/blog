import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cdd-monitor-str — 한울무역의 CDD profile이 비교 기준이 되고,
 * profile과 어긋난 해외 분할송금이 alert → case 검토 → 닫기 또는 STR로 갈라진다.
 * 거래 거절·보류·동결은 STR에서 자동으로 이어지지 않는 별도 권한의 결정이다.
 */
type NodeId = "profile" | "transfer" | "alert" | "case" | "close" | "str" | "hold";

const SCENES = [
  {
    label: "비교 기준 기록",
    summary: "국내 급여·매입 · 월 5천만 원 내외",
    on: ["profile"],
    note: "계좌를 열 때 한울무역이 밝힌 목적과 예상 거래를 CDD profile로 남깁니다. 이후 거래는 이 기록과 비교됩니다.",
  },
  {
    label: "어긋난 거래와 alert",
    summary: "profile mismatch → alert",
    on: ["profile", "transfer", "alert"],
    note: "신규 해외 상대방에게 짧은 시간 동안 금액을 나눠 송금하면, 기록한 예상과 다르다는 신호(profile mismatch)를 규칙이 alert로 냅니다. Alert는 검토를 여는 입력이지 STR이 아닙니다.",
  },
  {
    label: "case 검토",
    summary: "분할 여부만 보지 않음",
    on: ["alert", "case"],
    note: "Analyst는 invoice, 상대방, 실제소유자, 자금 원천, 과거 거래, 관련 계정과 제재·부정행위 통제를 함께 검토합니다.",
  },
  {
    label: "설명이 충분하면",
    summary: "case 닫기 + 근거·reviewer 기록",
    on: ["case", "close"],
    note: "설명이 충분하고 증거가 일치하면 case를 닫습니다. 닫더라도 판단 근거와 reviewer를 남깁니다.",
  },
  {
    label: "합리적 의심이 있으면",
    summary: "승인 절차 → STR 지체 없이 제출",
    on: ["case", "str"],
    note: "합리적 의심 근거가 있으면 지정된 승인 절차로 STR을 지체 없이 제출합니다. 고객에게 신고 사실을 알려서는 안 됩니다.",
  },
  {
    label: "보류·동결은 별도 권한",
    summary: "STR 제출 ≠ 자동 동결",
    on: ["str", "hold"],
    note: "거래 거절·보류·동결은 제재, fraud, court order, 상품 약관 같은 별도 권한으로 결정합니다. STR을 제출했다고 자동으로 동결되지 않습니다.",
  },
] as const satisfies readonly { label: string; summary: string; on: readonly NodeId[]; note: string }[];

const NODES: Record<NodeId, { tag: string; title: string; body: string }> = {
  profile: { tag: "1 · CDD PROFILE", title: "예상 거래 기록", body: "국내 급여·매입, 월 5천만 원 내외" },
  transfer: { tag: "2 · 거래", title: "해외 분할송금", body: "신규 해외 상대방, 짧은 시간에 나눠 송금" },
  alert: { tag: "3 · ALERT", title: "profile mismatch 신호", body: "검토를 여는 입력 · STR 아님" },
  case: { tag: "4 · CASE", title: "analyst 검토", body: "invoice·상대방·실제소유자·자금 원천·과거 거래·관련 계정" },
  close: { tag: "닫기", title: "설명 충분·증거 일치", body: "판단 근거와 reviewer를 남김" },
  str: { tag: "STR", title: "합리적 의심 근거", body: "지정 승인 → 지체 없이 제출 · 고객에게 알리지 않음" },
  hold: { tag: "별도 권한 · STR 제출로 자동 개시되지 않음", title: "거래 거절·보류·동결", body: "제재·fraud·court order·상품 약관 근거" },
};

function Node({ id, active }: { id: NodeId; active: boolean }) {
  const node = NODES[id];
  const dashed = id === "hold";
  return (
    <div
      className={`min-w-0 rounded-lg border p-2.5 sm:p-3 transition-opacity duration-300 motion-reduce:transition-none ${
        dashed ? "border-dashed" : ""
      } ${active ? "border-primary bg-primary/5 opacity-100" : "border-border bg-background opacity-45"}`}
    >
      <p className={`text-[11px] font-bold tracking-[.06em] ${active ? "text-primary" : "text-muted-foreground"}`}>{node.tag}</p>
      <p className="mt-1 break-keep text-sm font-semibold leading-5">{node.title}</p>
      <p className="mt-1 hidden break-keep text-xs leading-5 text-muted-foreground sm:block">{node.body}</p>
    </div>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="hidden items-center justify-center text-sm text-muted-foreground sm:flex">
      →
    </span>
  );
}

export default function HanulCaseBranchViz() {
  return (
    <SceneShell
      eyebrow="한울무역 case"
      title="Alert는 case를 열 뿐이고, 닫기·STR·동결은 각각 다른 결정입니다"
      description="CDD profile(계좌 개설 때 기록한 고객의 목적과 예상 거래)을 기준으로 어긋난 거래를 찾고, 사람이 검토한 뒤 두 갈래로 나눕니다. 점선 아래 칸은 STR에서 자동으로 이어지지 않는 별도 권한입니다."
      ariaLabel="한울무역의 CDD profile, 해외 분할송금 alert, case 검토, 닫기와 STR 분기, 별도 권한의 거래 보류 흐름"
      scenes={SCENES}
      render={(active) => {
        const on = new Set<NodeId>(SCENES[active].on);
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)]">
              <Node id="profile" active={on.has("profile")} />
              <Arrow />
              <Node id="transfer" active={on.has("transfer")} />
              <Arrow />
              <Node id="alert" active={on.has("alert")} />
              <Arrow />
              <Node id="case" active={on.has("case")} />
            </div>
            <p className="text-center text-xs font-semibold text-muted-foreground">↓ case 결정은 두 갈래 ↓</p>
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <Node id="close" active={on.has("close")} />
              <Node id="str" active={on.has("str")} />
            </div>
            {/* 보류·동결은 STR 칸 아래에 두면 STR → 동결 순서로 읽히므로, 두 갈래 밑이 아닌
                전폭의 별도 줄로 떼어 case 흐름 밖의 권한임을 위치로도 보여 줍니다. */}
            <div className="border-t border-dashed border-border pt-3">
              <Node id="hold" active={on.has("hold")} />
            </div>
          </div>
        );
      }}
    />
  );
}
