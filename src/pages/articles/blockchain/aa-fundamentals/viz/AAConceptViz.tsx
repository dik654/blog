import VizFrame from "@/components/viz/VizFrame";

type Mode = "model" | "erc4337" | "delegation" | "policy";

const FLOWS = {
  model: {
    eyebrow: "Fixed rules → programmable policy",
    title: "Account Abstraction은 계정 검증·수수료·실행 규칙의 소유자를 바꿉니다",
    description: "같은 ‘스마트 계정’이라도 요청을 만들고 검증하고 실행하며 비용을 내는 주체를 분리해야 합니다.",
    steps: [
      ["요청", "사용자가 의도와 authorization을 만듭니다.", "signed request"],
      ["검증", "계정 코드가 signer·nonce·policy를 판정합니다.", "validation result"],
      ["수수료", "계정 또는 paymaster가 최대 비용을 예치합니다.", "payer · budget"],
      ["실행", "통과한 call만 원자적으로 실행합니다.", "receipt · effects"],
    ],
    note: "프로그래밍 가능하다는 말은 검증을 생략한다는 뜻이 아닙니다. 오히려 nonce·권한·가스·replay domain을 계정 코드가 명시적으로 책임집니다.",
  },
  erc4337: {
    eyebrow: "ERC-4337 observable path",
    title: "UserOperation은 Bundler의 두 차례 simulation을 거쳐 EntryPoint에서 실행됩니다",
    description: "Off-chain admission과 on-chain execution을 나누면 어느 단계가 DoS와 side effect를 막는지 보입니다.",
    steps: [
      ["UserOperation", "sender·nonce·callData·gas·signature", "userOpHash"],
      ["Bundler", "validation simulation·mempool policy·bundle", "admission reason"],
      ["EntryPoint", "account/paymaster validation·prefund", "validation receipt"],
      ["Account", "call execution·gas settlement·event", "UserOperationEvent"],
    ],
    note: "Simulation 성공은 inclusion 보장이 아닙니다. Bundle 직전 상태가 달라질 수 있으므로 bundler는 다시 검증하며, 실행 revert와 validation reject를 별도 outcome으로 남깁니다.",
  },
  delegation: {
    eyebrow: "ERC-4337 · EIP-7702 · native AA",
    title: "세 경로는 계정 코드를 얻는 위치와 protocol 변경 범위가 다릅니다",
    description: "기능 목록보다 authorization, execution code, fee payer와 mempool owner를 같은 축에서 비교합니다.",
    steps: [
      ["ERC-4337", "별도 UserOperation mempool + EntryPoint", "contract layer"],
      ["EIP-7702", "EOA가 audited delegate code를 persistent 지정", "type-4 authorization"],
      ["Native AA", "Protocol transaction이 validation/execution phase 제공", "proposal status 확인"],
      ["선택", "현재 chain 지원·wallet migration·risk로 결정", "versioned profile"],
    ],
    note: "EIP-7702는 Final이지만 EIP-7701은 Withdrawn입니다. ‘Native AA가 곧 4337을 대체한다’고 단정하지 않고, 배포 체인의 실제 지원과 표준 상태를 확인합니다.",
  },
  policy: {
    eyebrow: "Capability is a policy, not a feature badge",
    title: "Passkey·세션 키·배치·가스 대납은 각각 다른 실패 경계를 가집니다",
    description: "좋은 UX를 말하기 전에 누가 무엇을 언제까지 얼마나 할 수 있는지 실행 가능한 policy로 적습니다.",
    steps: [
      ["Signer", "Passkey·multisig·guardian의 신원과 domain", "signature context"],
      ["Capability", "target·selector·value·expiry·nonce", "least privilege"],
      ["Sponsor", "paymaster allowlist·quota·price·deposit", "budget receipt"],
      ["Recover", "delay·threshold·cancel·rotation", "recovery audit"],
    ],
    note: "배치가 원자적이어도 authorization이 안전해지는 것은 아닙니다. 세션 키와 paymaster는 각각 권한 확대와 예산 고갈을 별도로 시험해야 합니다.",
  },
} as const;

export default function AAConceptViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  return (
    <VizFrame eyebrow={flow.eyebrow} title={flow.title} description={flow.description} note={flow.note}>
      <ol className="grid min-w-0 gap-4 lg:grid-cols-4">
        {flow.steps.map(([label, detail, receipt], index) => (
          <li key={label} className="min-w-0 border-t border-border pt-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-primary">{String(index + 1).padStart(2, "0")}</span>
              <p className="min-w-0 break-words text-sm font-bold leading-5 text-foreground">{label}</p>
            </div>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{detail}</p>
            <p className="mt-3 break-words border-l border-primary/50 pl-3 text-xs leading-5 text-foreground/75">receipt · {receipt}</p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
