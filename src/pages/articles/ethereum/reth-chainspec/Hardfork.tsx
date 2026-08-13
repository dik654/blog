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
        Hardfork 이름은 label이고 실제 rule 선택은 activation predicate다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Block-based fork는 current block number를, timestamp-based fork는
          header timestamp를 비교합니다. Merge의 역사적 전환은 TTD context를
          포함하며, custom chain은 어떤 fork를 Never로 둘 수도 있습니다. “평균
          block time을 곱해 activation timestamp를 추정”하는 방식은 missed
          slot과 reorg를 무시하므로 consensus rule이 될 수 없습니다.
        </p>
      </div>

      <HardforkDetailViz onOpenCode={open} />

      <ExplainedFormula
        question="현재 block context에서 fork f의 새 규칙을 사용해야 하는가?"
        idea="ForkCondition variant가 요구하는 좌표만 비교하고, 서로 다른 좌표를 대신 쓰지 않습니다. Never는 어떤 context에서도 false이며 TTD는 release가 정한 historical semantics를 그대로 사용합니다."
        formula={String.raw`\begin{aligned}
          a_B&=[n\ge N_f]\\
          a_T&=[t\ge T_f]\\
          a_D&=\operatorname{TTD}(c,D_f)\\
          a_N&=0
        \end{aligned}`}
        terms={[
          {
            symbol: "f",
            name: "fork",
            description: "활성 여부를 묻는 protocol upgrade입니다.",
          },
          {
            symbol: "c",
            name: "block context",
            description:
              "Block number n, timestamp t와 필요한 difficulty history를 포함합니다.",
          },
          {
            symbol: "N_f",
            name: "activation block",
            description: "Block-based fork가 시작되는 첫 number입니다.",
          },
          {
            symbol: "T_f",
            name: "activation time",
            description:
              "Timestamp-based fork가 시작되는 경계 Unix time입니다.",
          },
          {
            symbol: "D_f",
            name: "TTD threshold",
            description:
              "TTD condition이 참이 되는 total-difficulty 경계입니다.",
          },
          {
            symbol: String.raw`a_B,a_T,a_D,a_N`,
            name: "variant result",
            description:
              "각각 Block·Timestamp·TTD·Never condition을 선택했을 때의 Boolean activation 결과입니다.",
          },
        ]}
        assumptions={[
          "모든 consumer가 같은 ordered ChainSpec과 같은 candidate block context를 사용합니다.",
          "경계의 포함 여부와 TTD 세부 semantics는 pinned Reth·Ethereum specification을 따릅니다.",
        ]}
        interpretation="Block(100)에서는 n=99가 false, n=100이 true이고 Timestamp(1,000)에서는 block 간격과 무관하게 t=999가 false, t=1,000이 true입니다. 이 식은 fork rule의 correctness를 증명하지 않고 어느 rule set을 선택할지만 결정합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>경계 바로 전·당일·직후를 같은 fixture로 검사합니다</h3>
        <p>
          각 fork마다 <code>boundary−1</code>, <code>boundary</code>,{" "}
          <code>boundary+1</code> context를 만들고 header validity, EVM spec,
          conditionally required field와 payload construction이 같은 decision을
          내는지 확인합니다. 같은 timestamp에 여러 fork가 있는 경우 ordered
          schedule과 current official implementation의 처리 순서를 고정하며,
          목록 순서가 중요하지 않다고 가정하지 않습니다.{" "}
          <CodeViewButton onClick={() => open("fork-condition")} />
        </p>
        <h3>
          Fork ID는 execution proof가 아니라 peer compatibility filter입니다
        </h3>
        <p>
          Fork ID는 genesis에서 시작해 활성 fork history와 다음 fork 정보를
          압축해 peer가 명백히 다른 schedule을 빠르게 거르게 합니다. 이것이
          같다고 peer의 block이 유효하거나 honest하다는 뜻은 아니며, 다르다고
          무조건 악성이라는 뜻도 아닙니다. Local head context와 EIP가 정한
          validation rule로 판단하고, 실제 block은 다시 full validation을
          거칩니다.
        </p>
      </div>

      <div
        id="paper-eip-6122-forkid"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 규격 읽기 · fork compatibility
        </p>
        <p className="mt-2 text-sm font-semibold">
          EIP-6122 — Fork identifier update
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 timestamp fork까지 포함한 chain compatibility를 handshake에서
          압축 판정하는 것입니다. 규격은 fork hash와 next field
          계산·validation을 정의하지만, peer honesty·block validity·network
          reachability까지 보장하지 않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://eips.ethereum.org/EIPS/eip-6122"
          target="_blank"
          rel="noreferrer"
        >
          EIP-6122 보기
        </a>
      </div>
    </section>
  );
}
