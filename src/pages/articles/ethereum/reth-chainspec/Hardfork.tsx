import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import HardforkDetailViz from "./viz/HardforkDetailViz";
import { codeRefs } from "./codeRefs";

export default function Hardfork({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="hardfork" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        바뀌는 시점은 해당 좌표로 판정합니다
      </h2>
      <HardforkDetailViz onOpenCode={open} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          규칙 변경에는 “어느 이름의 업그레이드인가”와 “언제부터 적용하는가”가 함께 필요합니다. Reth v2.8.1은 이름과 조건을
          순서가 있는 목록에 보관하고, 빠른 이름 조회용 맵도 함께 둡니다. 예전 글의 “BTreeMap이 순서를 만든다”는 설명은 현재
          구현과 다릅니다. 표준 빌드에서는 순서를 <code>Vec</code>이 보존하고 조회는 <code>FxHashMap</code>이 맡습니다.
          <CodeViewButton onClick={() => open("chain-hardforks")} />
        </p>
        <p>
          조건은 <strong>활성화 조건(ForkCondition)</strong>이라는 구분된 형식으로 표현합니다. 블록 번호 조건은 후보 블록 번호를,
          시각 조건은 후보 헤더 시각을 봅니다. 누적 난이도 조건은 현재 블록의 난이도를 뺀 직전 누적 난이도를 문턱값과 비교하며,
          비활성 조건은 언제나 거짓입니다.
          <CodeViewButton onClick={() => open("fork-condition")} />
        </p>
      </div>

      <ExplainedFormula
        question="현재 후보 블록에서 조건 f가 활성인가?"
        idea="조건이 지정한 좌표만 비교합니다. 블록 번호를 시각으로 환산하거나 평균 블록 시간을 이용해 다른 좌표를 추정하지 않습니다."
        formula={String.raw`\begin{aligned}
          a_B(n)&=[n\ge N_f]\\
          a_T(t)&=[t\ge T_f]\\
          a_D(D,d)&=[\max(D-d,0)\ge D_f]\\
          a_N&=0
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          a_B(n)&=\underbrace{[n\ge N_f]}_{\text{후보 블록 번호}}\\
          a_T(t)&=\underbrace{[t\ge T_f]}_{\text{후보 헤더 시각}}\\
          a_D(D,d)&=\underbrace{[\max(D-d,0)\ge D_f]}_{\text{직전 누적 난이도}}\\
          a_N&=\underbrace{0}_{\text{항상 비활성}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`[n\ge N_f]`, annotation: ["블록 번호 조건은 후보 번호만 비교합니다.", "Block(100)이면 n=99는 거짓이고 n=100은 참입니다."] },
          { expression: String.raw`[t\ge T_f]`, annotation: ["시각 조건은 후보 헤더의 Unix 시각을 비교합니다.", "Timestamp(1,000)이면 t=999는 거짓이고 t=1,000은 참입니다."] },
          { expression: String.raw`[\max(D-d,0)\ge D_f]`, annotation: ["현재 누적 난이도 D에서 현재 블록 난이도 d를 빼 직전 값을 얻습니다.", "포화 뺄셈으로 0보다 작아지지 않게 한 뒤 문턱값과 비교합니다."] },
          { expression: String.raw`0`, annotation: ["Never 조건은 어떤 후보 문맥에서도 활성화되지 않습니다."] },
        ]}
        terms={[
          { symbol: "n", name: "후보 블록 번호", description: "지금 검사하는 블록의 번호입니다." },
          { symbol: "t", name: "후보 헤더 시각", description: "지금 검사하는 헤더의 Unix 시각입니다." },
          { symbol: "N_f", name: "활성화 블록", description: "블록 번호 조건이 처음 참이 되는 번호입니다." },
          { symbol: "T_f", name: "활성화 시각", description: "시각 조건이 처음 참이 되는 값입니다." },
          { symbol: "D,d,D_f", name: "난이도 값", description: "현재 누적 난이도, 현재 블록 난이도, 전환 문턱값입니다." },
          { symbol: "a_B,a_T,a_D,a_N", name: "조건별 결과", description: "각 조건을 선택했을 때 얻는 참·거짓입니다." },
        ]}
        assumptions={[
          "모든 판단 경로가 같은 ChainSpec과 같은 후보 블록 문맥을 사용합니다.",
          "TTD 판정식은 Reth v2.8.1이 고정한 alloy-hardforks 0.4.11의 active_at_ttd 구현을 따릅니다.",
        ]}
        interpretation="설명용 시각 조건 1,000에서는 999가 이전 규칙을, 1,000이 새 규칙을 고릅니다. 이 판정은 어느 규칙을 쓸지만 정하며, 그 규칙으로 계산한 블록이 유효한지는 이후 검증이 따로 확인합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>경계의 바로 앞과 정확한 시점을 따로 검사합니다</h3>
        <p>
          같은 설명용 입력에서 시각 999, 1,000, 1,001을 넣으면 결과는 이전·새·새 규칙이어야 합니다. 검증기와 EVM, 페이로드
          빌더가 이 세 입력에서 같은 결과를 내는지 비교하면 “조건은 맞지만 한 소비자가 다른 문맥을 읽는” 오류를 찾을 수 있습니다.
        </p>
        <p>
          같은 시각에 여러 하드포크가 예약될 수도 있습니다. Reth의 목록은 활성화 순서를 보존하며, Fork ID 계산에서는 같은 블록 번호나
          시각에 적용된 값을 한 번만 더합니다. 구현 순서를 이름 정렬이나 맵 순서로 추측하지 말고 고정한 태그의 목록과 테스트를 확인해야
          합니다.
          <CodeViewButton onClick={() => open("fork-id")} />
        </p>

        <h3>Fork ID는 빠른 호환성 검사입니다</h3>
        <p>
          Fork ID는 제네시스 해시에서 시작해 이미 지난 블록 번호와 시각을 CRC32에 차례로 넣고, 다음 변경 시점을 함께 보냅니다.
          상대 피어의 일정이 명백히 다르면 블록 본문을 받기 전에 연결을 끊을 수 있습니다.
        </p>
        <p>
          이 값이 같아도 피어가 정직하거나 받은 블록이 유효하다는 뜻은 아닙니다. Fork ID는 규칙 일정의 호환성을 빠르게 거르는 장치이고,
          실제 블록은 다시 전체 검증을 거칩니다.
        </p>
      </div>

      <div
        id="paper-eip-6122-forkid"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">[O] Final 표준 · 2026-10-27 확인</p>
        <p className="mt-2 text-sm font-semibold">EIP-6122 — 시각 기반 Fork ID</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          EIP-6122는 블록 번호 기반 변경을 먼저, 시각 기반 변경을 나중에 처리하고 같은 경계값은 한 번만 체크섬에 넣도록 정합니다.
          이 표준은 피어의 설정 호환성을 판정하지만 피어의 정직성이나 개별 블록의 유효성을 증명하지는 않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://eips.ethereum.org/EIPS/eip-6122"
          target="_blank"
          rel="noreferrer"
        >
          EIP-6122 원문 보기
        </a>
      </div>
    </section>
  );
}
