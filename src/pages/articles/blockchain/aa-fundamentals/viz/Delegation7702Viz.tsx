import SceneShell from "./SceneShell";

/**
 * 본문 대응: #native-aa — EIP-7702 승인 항목 [chain_id, address, nonce] + 서명,
 * 연결 표시 0xef0100 || delegate_address, 위임 코드가 Alice의 저장소·잔액 문맥에서 실행,
 * 송금이 실패해도 연결 표시는 되돌려지지 않고 원래 EOA 키의 권한도 남는다.
 */
type Slot = "auth" | "key" | "code" | "state" | "delegate";

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  focus: readonly Slot[];
  linked: boolean;
  code: string;
  state: string;
  delegate: string;
  key: string;
}[] = [
  {
    label: "기존 EOA",
    summary: "키로 거래 시작 · 코드 자리 비어 있음",
    focus: ["key", "code"],
    linked: false,
    code: "비어 있음",
    state: "USDC 200 · 저장소",
    delegate: "아직 연결 안 됨",
    key: "기본 서명 규칙으로 거래 시작",
    note: "EOA(외부 소유 계정)는 키 하나의 서명으로 거래를 시작합니다. 아직 이 주소에는 실행할 코드가 연결돼 있지 않습니다.",
  },
  {
    label: "승인 항목에 서명",
    summary: "체인 ID · 위임 코드 주소 · nonce",
    focus: ["auth"],
    linked: false,
    code: "비어 있음",
    state: "USDC 200 · 저장소",
    delegate: "연결할 후보",
    key: "승인 항목에 서명",
    note: "Alice 키(authority)는 keccak256(0x05 || rlp([chain_id, address, nonce]))에 서명합니다. 이 nonce는 7번 UserOperation의 순서열과 다른 값이고, 항목 안에 Bob이나 USDC 40은 들어 있지 않습니다.",
  },
  {
    label: "type-4 거래로 연결",
    summary: "코드 자리 = 0xef0100 || delegate_address",
    focus: ["code", "delegate"],
    linked: true,
    code: "0xef0100 || delegate_address",
    state: "USDC 200 · 저장소",
    delegate: "연결됨",
    key: "기본 서명 규칙으로 거래 시작",
    note: "type-4 거래가 승인 목록을 처리하면 Alice 주소의 코드 자리에 연결 표시가 적힙니다. 주소는 그대로이고, 표시는 어느 코드를 실행할지 가리킬 뿐입니다.",
  },
  {
    label: "호출하면 Alice 문맥에서 실행",
    summary: "코드는 위임처 · 저장소와 잔액은 Alice",
    focus: ["delegate", "state"],
    linked: true,
    code: "0xef0100 || delegate_address",
    state: "USDC 200 · 저장소 ← 여기서 읽고 씀",
    delegate: "이 코드가 실행됨",
    key: "기본 서명 규칙으로 거래 시작",
    note: "Alice 주소를 호출하면 위임된 코드가 Alice의 저장소·잔액을 대상으로 실행됩니다. 승인 항목에 송금 조건이 없으므로 Bob에게 40을 보낼 권한은 이 계정 코드가 따로 확인해야 합니다.",
  },
  {
    label: "40 송금이 실패해도",
    summary: "연결 표시 유지 · 원래 키도 유지",
    focus: ["code", "key"],
    linked: true,
    code: "0xef0100 || delegate_address (유지)",
    state: "40 송금 실패",
    delegate: "연결됨",
    key: "바깥 거래·새 위임 승인 가능",
    note: "처리된 연결 표시는 뒤의 실행이 실패해도 되돌려지지 않습니다. 원래 EOA 키도 바깥 거래와 새 위임을 승인할 수 있으므로, 임시 열쇠만 제한해서는 지갑 전체 권한이 제한되지 않습니다.",
  },
];

function Row({ title, value, on, mono = false }: { title: string; value: string; on: boolean; mono?: boolean }) {
  return (
    <div className={`rounded-md border px-2 py-1 ${on ? "border-primary bg-primary/10" : "border-border"}`}>
      <span className="block text-[11px] leading-4 text-muted-foreground">{title}</span>
      <span className={`block break-all text-xs font-semibold leading-5 sm:text-sm ${mono ? "font-mono" : ""} ${on ? "text-primary" : ""}`}>{value}</span>
    </div>
  );
}

export default function Delegation7702Viz() {
  return (
    <SceneShell
      eyebrow="EIP-7702 코드 연결"
      title="주소는 그대로 두고 실행할 코드만 가리킵니다"
      description="큰 칸 둘은 Alice의 기존 주소와 그 주소가 가리킬 위임 코드입니다. 테두리가 강조된 칸이 이번 장면의 초점입니다. 금액은 본문 사례의 가정입니다."
      ariaLabel="EIP-7702 승인 항목이 기존 EOA 주소에 코드 연결 표시를 남기고 위임 코드가 Alice 문맥에서 실행되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on = (slot: Slot) => scene.focus.includes(slot);
        return (
          <div className="min-w-0 space-y-2 sm:space-y-3">
            <div className={`rounded-md border px-2 py-1.5 sm:px-3 sm:py-2 ${on("auth") ? "border-primary bg-primary/10" : "border-dashed border-border"}`}>
              <span className="block text-[11px] leading-4 text-muted-foreground">승인 항목 (type-4 거래의 승인 목록 한 줄)</span>
              <span className={`block break-all font-mono text-xs font-semibold leading-5 sm:text-sm ${on("auth") ? "text-primary" : ""}`}>[chain_id, address, nonce] + 서명</span>
            </div>
            <div className="grid gap-2 sm:gap-3 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,0.8fr)] sm:items-center">
              <div className="space-y-2 rounded-lg border border-border p-2">
                <span className="block text-xs font-bold">Alice 주소 (바뀌지 않음)</span>
                <Row title="원래 EOA 키" value={scene.key} on={on("key")} />
                <Row title="코드 자리" value={scene.code} on={on("code")} mono={scene.linked} />
                <Row title="잔액·저장소" value={scene.state} on={on("state")} />
              </div>
              <div className={`hidden text-center font-mono text-sm sm:block ${scene.linked ? "text-primary" : "text-muted-foreground/40"}`} aria-hidden>
                →
              </div>
              <div className={`rounded-lg border p-2 ${on("delegate") ? "border-primary bg-primary/10" : scene.linked ? "border-border" : "border-dashed border-border/60"}`}>
                <span className="block text-xs font-bold">위임할 코드 (delegate_address)</span>
                <span className={`block text-xs leading-5 sm:text-sm ${on("delegate") ? "font-semibold text-primary" : "text-muted-foreground"}`}>{scene.delegate}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
