import SceneShell from "./SceneShell";

/**
 * 본문 대응: #erc4337 · #prefund · #source — 7번 요청이 서명 → 접수 → 제출 → 검증 → 실행 → 정산을 지나며 장부가 바뀌는 순서.
 * 3절 가정값: Alice 200·Bob 0·누적사용 0·nonce 7·예치금 0.01 ETH.
 * 검증에서 nonce 7 → 8, 예치금 0.003 확보(0.007), 실행에서 160/40·누적 40, 정산에서 0.001 청구·0.002 환급(0.009).
 */
const STAGES = ["서명", "접수", "제출", "검증", "실행", "정산"] as const;

type Ledger = readonly string[];
const LEDGER_LABELS = ["Alice USDC", "Bob USDC", "열쇠 누적 사용", "다음 nonce", "대납 예치금 ETH"] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  ledger: Ledger;
  changed: readonly number[];
}[] = [
  {
    label: "Alice가 요청에 서명",
    summary: "아직 아무 장부도 안 바뀜",
    ledger: ["200", "0", "0", "7", "0.01"],
    changed: [],
    note: "요청에는 계정 주소, nonce 7, USDC 프로그램의 Bob에게 40 보내기 호출, 비용 조건이 들어갑니다. 서명은 체인 ID와 EntryPoint 주소에도 묶여 다른 체인이나 다른 처리 계약에서 재사용되지 않습니다.",
  },
  {
    label: "Bundler가 모의 후 접수",
    summary: "접수됨 ≠ 송금됨",
    ledger: ["200", "0", "0", "7", "0.01"],
    changed: [],
    note: "Bundler(요청을 모아 제출하는 전달자)는 실행을 모의해 서명·예치금·허용된 검증 규칙을 확인하고 대기 목록에 넣습니다. 이때 '받았다'는 응답이 와도 장부는 그대로입니다.",
  },
  {
    label: "재검사 후 handleOps 제출",
    summary: "바깥 거래 ≠ UserOperation",
    ledger: ["200", "0", "0", "7", "0.01"],
    changed: [],
    note: "제출 직전에 다시 검사한 뒤, 요청들을 담은 바깥 거래 handleOps를 네트워크에 냅니다. 이 바깥 거래의 비용은 bundler가 먼저 내고 처리 결과에서 보상받습니다.",
  },
  {
    label: "EntryPoint가 검증",
    summary: "nonce 7 → 8 · 0.003 확보",
    ledger: ["200", "0", "0", "8", "0.007"],
    changed: [3, 4],
    note: "EntryPoint(공통 처리 계약)가 계정에 검증을 요청하고 nonce 7을 확인해 다음 값 8로 올립니다. 대납자의 예치금 0.01에서 최대 비용 0.003을 확보해 일시적으로 0.007이 남습니다.",
  },
  {
    label: "계정이 USDC 전송 실행",
    summary: "200/0 → 160/40 · 누적 40",
    ledger: ["160", "40", "40", "8", "0.007"],
    changed: [0, 1, 2],
    note: "EntryPoint가 계정의 실행 함수를 부르고, 계정이 USDC에 Bob 40 전송을 요청합니다. 이 글의 절차에서는 열쇠의 누적 사용량도 이 실행 안에서 40으로 갱신한다고 둡니다(가정).",
  },
  {
    label: "실제 비용 정산",
    summary: "0.001 청구 · 0.002 환급 → 0.009",
    ledger: ["160", "40", "40", "8", "0.009"],
    changed: [4],
    note: "실제 청구액 0.001을 빼고 확보했던 나머지 0.002를 돌려줘 예치금은 0.009가 됩니다. 정산 결과에서 성공 여부와 실제 비용을 확인해야 전체 경로가 끝납니다.",
  },
];

export default function UserOpPathViz() {
  return (
    <SceneShell
      eyebrow="7번 요청의 경로"
      title="접수, 송금, 비용 확정은 서로 다른 단계에서 일어납니다"
      description="위 띠는 지금 단계, 아래 칸은 그 단계가 끝난 뒤의 장부입니다. 색 칸이 이번 단계에서 바뀐 값입니다. 금액과 비용은 3절의 가정입니다."
      ariaLabel="ERC-4337 요청 하나가 서명부터 정산까지 지나며 잔액·nonce·예치금이 바뀌는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
              {STAGES.map((stage, index) => (
                <li
                  key={stage}
                  className={`rounded-md border px-1 py-1.5 text-center text-xs font-semibold ${
                    index === active ? "border-primary bg-primary/10 text-primary" : index < active ? "border-border text-foreground" : "border-dashed border-border/60 text-muted-foreground"
                  }`}
                >
                  {index + 1}. {stage}
                </li>
              ))}
            </ol>
            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:grid-cols-5 sm:gap-2">
              {LEDGER_LABELS.map((label, index) => {
                const changed = scene.changed.includes(index);
                return (
                  <div
                    key={label}
                    className={`rounded-md border px-2 py-2 ${changed ? "border-emerald-600 bg-emerald-600/10" : "border-border"}`}
                  >
                    <span className="block text-[11px] leading-4 text-muted-foreground">{label}</span>
                    <span className={`block font-mono text-sm font-bold sm:text-base ${changed ? "text-emerald-700 dark:text-emerald-400" : ""}`}>{scene.ledger[index]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
