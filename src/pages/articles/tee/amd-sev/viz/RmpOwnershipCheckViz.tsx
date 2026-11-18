import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-lifecycle — HYPERVISOR는 nested page table을 관리하지만 RMP가 허용하지 않는
 * owner·GPA mapping을 성립시킬 수 없다. CPU + RMP는 system physical page의 owner·GPA·validation state를
 * nested translation과 함께 검사한다. VALIDATE: guest가 PVALIDATE로 현재 mapping을 수락한다.
 * 실패 표: "Wrong-owner RMP mapping → access 또는 validation 실패, guest commit 0회".
 * page A, GPA g1·g2·gX, VM-B는 설명용 가정이다.
 */
type Mark = "ok" | "bad" | "none";

type Check = { recorded: string; requested: string; mark: Mark };

type Scene = {
  label: string;
  summary: string;
  who: string;
  npt: string;
  owner: Check;
  gpa: Check;
  validated: Check;
  verdict: string;
  verdictTone: Mark;
  note: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "Hypervisor가 page를 배치",
    summary: "NPT: g1 → page A",
    who: "아직 guest 접근 없음",
    npt: "Payroll VM · g1 → page A",
    owner: { recorded: "Payroll VM", requested: "", mark: "none" },
    gpa: { recorded: "g1", requested: "", mark: "none" },
    validated: { recorded: "아니오", requested: "", mark: "none" },
    verdict: "Guest가 이 mapping을 아직 수락하지 않음",
    verdictTone: "none",
    note: "Hypervisor는 NPT에 g1 → page A를 적어 자원을 배치합니다. RMP의 page A 칸에는 owner Payroll VM, GPA g1이 기록돼 있다고 둡니다(가정). 배치했다는 사실과 guest가 그 mapping을 받아들였다는 사실은 아직 별개입니다.",
  },
  {
    label: "Guest가 PVALIDATE로 수락",
    summary: "세 칸 모두 일치 → 접근 허용",
    who: "Payroll VM이 g1을 읽음",
    npt: "Payroll VM · g1 → page A",
    owner: { recorded: "Payroll VM", requested: "Payroll VM", mark: "ok" },
    gpa: { recorded: "g1", requested: "g1", mark: "ok" },
    validated: { recorded: "예", requested: "필요", mark: "ok" },
    verdict: "접근 허용",
    verdictTone: "ok",
    note: "Guest가 PVALIDATE로 지금 mapping을 수락하면 page A의 validation state가 '예'가 됩니다. 이후 접근마다 CPU는 NPT가 가리킨 page A의 RMP 칸을 함께 보고, owner·GPA·validation이 모두 맞을 때만 통과시킵니다.",
  },
  {
    label: "같은 page를 다른 GPA에 다시 매핑",
    summary: "GPA 불일치 → 실패",
    who: "Payroll VM이 g2를 읽음",
    npt: "Payroll VM · g2 → page A (hypervisor가 바꿈)",
    owner: { recorded: "Payroll VM", requested: "Payroll VM", mark: "ok" },
    gpa: { recorded: "g1", requested: "g2", mark: "bad" },
    validated: { recorded: "예", requested: "필요", mark: "ok" },
    verdict: "Access 또는 validation 실패 · guest commit 0회",
    verdictTone: "bad",
    note: "Hypervisor가 NPT만 고쳐 page A를 g2 자리에 끼워 넣어도, RMP에는 이 page가 g1에 속한다고 남아 있습니다. 요청 GPA g2와 기록 g1이 달라 접근이 실패하고 guest는 아무것도 commit하지 않습니다.",
  },
  {
    label: "다른 VM에 매핑",
    summary: "owner 불일치 → 실패",
    who: "VM-B가 gX를 읽음",
    npt: "VM-B · gX → page A (hypervisor가 바꿈)",
    owner: { recorded: "Payroll VM", requested: "VM-B", mark: "bad" },
    gpa: { recorded: "g1", requested: "gX", mark: "none" },
    validated: { recorded: "예", requested: "필요", mark: "none" },
    verdict: "Access 또는 validation 실패 · guest commit 0회",
    verdictTone: "bad",
    note: "Page A를 다른 VM의 NPT에 넣어도 RMP owner는 Payroll VM입니다. RMP 기록(g1·validated 예)은 그대로이고, owner가 다른 것만으로 접근이 성립하지 않으므로 나머지 칸의 판정은 '−'로 둡니다. Hypervisor는 자원을 배치할 뿐, RMP가 허용하지 않는 owner·GPA 연결을 만들 수 없습니다.",
  },
];

const MARK_TEXT: Record<Mark, string> = { ok: "일치", bad: "불일치", none: "−" };
const MARK_CLASS: Record<Mark, string> = {
  ok: "text-green-700 dark:text-green-400",
  bad: "text-red-700 dark:text-red-400",
  none: "text-muted-foreground",
};

function Row({ name, check }: { name: string; check: Check }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_3.5rem] items-center gap-2 border-t border-border px-3 py-2">
      <div className="min-w-0">
        <p className="text-xs font-semibold sm:text-sm">{name}</p>
        <p className="break-keep font-mono text-xs leading-5 text-muted-foreground sm:text-sm">
          기록 <span className="font-semibold text-foreground">{check.recorded || "−"}</span> · 이번 접근 <span className="font-semibold text-foreground">{check.requested || "−"}</span>
        </p>
      </div>
      <span className={`text-right text-xs font-bold sm:text-sm ${MARK_CLASS[check.mark]}`}>{MARK_TEXT[check.mark]}</span>
    </div>
  );
}

export default function RmpOwnershipCheckViz() {
  return (
    <SceneShell
      eyebrow="RMP 검사"
      title="Hypervisor가 NPT를 바꿔도 RMP 기록과 맞지 않으면 접근이 성립하지 않습니다"
      description="GPA는 guest가 보는 물리 주소, NPT(nested page table)는 hypervisor가 관리하는 GPA → 실제 물리 page 변환, RMP(Reverse Map Table)는 실제 물리 page마다 owner·GPA·validation state를 적은 표입니다. page A, g1·g2·gX, VM-B는 가정한 이름입니다."
      ariaLabel="Hypervisor가 nested page table을 바꿀 때 RMP의 owner, GPA, validation 검사 결과"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              <div className="min-w-0 rounded-md border border-border px-3 py-2">
                <p className="text-[11px] font-bold tracking-wide text-primary">접근하는 쪽</p>
                <p className="mt-1 break-keep text-sm font-semibold">{scene.who}</p>
              </div>
              <div className="min-w-0 rounded-md border border-border px-3 py-2">
                <p className="text-[11px] font-bold tracking-wide text-primary">NPT 변환 (hypervisor 관리)</p>
                <p className="mt-1 break-keep font-mono text-sm">{scene.npt}</p>
              </div>
            </div>
            <div className="min-w-0 overflow-hidden rounded-md border border-border">
              <div className="grid grid-cols-[minmax(0,1fr)_3.5rem] gap-2 bg-muted/40 px-3 py-2 text-[11px] font-semibold text-muted-foreground">
                <span>page A의 RMP 칸</span>
                <span className="text-right">검사</span>
              </div>
              <Row name="owner" check={scene.owner} />
              <Row name="GPA" check={scene.gpa} />
              <Row name="validated" check={scene.validated} />
            </div>
            <p className={`rounded-md border px-3 py-2 text-sm font-bold ${scene.verdictTone === "bad" ? "border-red-600/60" : scene.verdictTone === "ok" ? "border-green-600/60" : "border-border"} ${MARK_CLASS[scene.verdictTone]}`}>
              {scene.verdict}
            </p>
          </div>
        );
      }}
    />
  );
}
