import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function SlashingProtection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="slashing-protection" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Slashing protection은 check와 record를 서명 권한 앞의 원자적 gate로 만든다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Proposer는 같은 slot에 서로 다른 block을 서명하면 안 됩니다. Attester는 같은 target epoch에 서로 다른 vote를 내거나 과거 vote
          interval을 감싸는 vote를 내면 안 됩니다. Database는 과거 signing intent와 root를 근거로 새 request를 허용하거나 거부하는 안전 상태입니다.
          최근 숫자 하나만 저장하는 cache와는 역할이 다릅니다.
        </p>
      </div>

      <ExplainedFormula
        question="두 attestation 가운데 하나가 다른 하나를 surround하는지 어떻게 판정할까요?"
        idea="각 vote를 source epoch에서 target epoch까지의 열린 방향 interval로 보고, 한 interval의 양 끝이 다른 interval 바깥에 엄격히 놓이는지 양방향으로 검사합니다."
        formula={String.raw`(s_1<s_2<t_2<t_1)\;\lor\;(s_2<s_1<t_1<t_2)`}
        annotatedFormula={String.raw`(s_1<\underbrace{s_2<t_2<t_1)\;\lor\;(s_2<s_1<t_1<t_2)}_{\text{판정 조건 결합}}`}
        operations={[
          { expression: String.raw`s_2<t_2<t_1)\;\lor\;(s_2<s_1<t_1<t_2)`, annotation: ["대안 gate 중 하나라도 참이면 조건을 통과시킵니다.","각 vote를 source epoch에서 target","epoch까지의 열린 방향 interval로 보고, 한","interval의 양 끝이 다른 interval 바깥에 엄격히"] },
        ]}
        terms={[
          { symbol: "s_1,t_1", name: "첫 투표 구간", description: "기존 또는 첫 attestation의 source·target epoch" },
          { symbol: "s_2,t_2", name: "두 번째 투표 구간", description: "새 또는 두 번째 attestation의 source·target epoch" },
          { symbol: "<", name: "엄격한 에폭 순서", description: "epoch의 엄격한 순서; 같은 endpoint는 surround 조건이 아님" },
        ]}
        assumptions={[
          "같은 validator key가 서명한 valid attestation data를 비교합니다.",
          "같은 target epoch에서 다른 data/root를 서명하는 double vote는 이 식과 별도로 검사합니다.",
          "DB가 없다는 사실은 과거 vote가 없다는 증거가 아니므로 빈 history로 fail-open하지 않습니다.",
        ]}
        interpretation="기존 vote가 3→10이고 새 vote가 5→8이면 3<5<8<10이므로 surround vote입니다. 기존 3→7과 새 5→9는 interval이 교차하지만 포함하지 않으므로 이 조건만으로는 surround가 아닙니다."
      />

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("validator-loop", codeRefs["validator-loop"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 서명 전 보호 경로 확인</span>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>안전한 transaction 경계</h3>
        <ol>
          <li>Key별 lock 또는 serializable transaction을 잡고 기존 proposal·attestation history를 읽습니다.</li>
          <li>같은 slot의 다른 block, 같은 target의 다른 signing root와 양방향 surround를 검사합니다.</li>
          <li>허용된 signing intent와 request digest를 durable하게 기록합니다.</li>
          <li>Signer에 동일 digest를 보내고 signature receipt를 intent와 연결합니다.</li>
          <li>Timeout이면 기존 intent/root 상태를 조회해 동일 root만 조정하고 새 root로 blind retry하지 않습니다.</li>
        </ol>
        <p>
          Check와 record 사이에 다른 worker가 들어오면 두 request가 모두 “안전” 판정을 받은 뒤 conflicting signature를 만들 수 있습니다.
          Process-local mutex만으로는 다중 replica나 remote signer를 막지 못합니다. Authority boundary를 single-writer
          fencing 또는 signer-side atomic protection까지 이어야 합니다.
        </p>

        <h3>Migration은 key와 history를 함께 옮깁니다</h3>
        <p>
          EIP-3076 interchange는 signed block·attestation history를 다른 client로 옮길 공통 format을 제공합니다. Source
          validator를 중지하고 export snapshot을 고정한 뒤 destination에 import·검증합니다. Key별 highest/lowest epoch와 sample
          root가 맞는지 확인한 다음에만 destination signing을 엽니다. Source와 destination이 겹쳐 실행되는 시간은 만들지 않습니다.
        </p>

        <h3>Adversarial release gate</h3>
        <p>
          동일 slot의 다른 block, 같은 target의 다른 vote, 양방향 surround, duplicate same-root를 base/candidate에 주입합니다.
          Concurrent workers, signer timeout-after-success, DB crash, stale replica, EIP-3076 migration도 함께
          넣습니다. Allow/deny와 persisted intent, signature count, restart decision이 같아야 합니다. Missed-duty 개선 비교는 이
          안전성 gate 뒤입니다.
        </p>
      </div>
    </section>
  );
}
