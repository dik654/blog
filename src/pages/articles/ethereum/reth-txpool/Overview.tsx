import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import TxPoolViz from "./viz/TxPoolViz";
import { DESIGN_CHOICES } from "./OverviewData";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [selected, setSelected] = useState(DESIGN_CHOICES[0].id);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Txpool: 아직 실행되지 않은 의존성 그래프
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Transaction pool은 block 포함 전의 signed transactions를 보관합니다. 같은 sender의 transaction은 nonce 순서에 묶이고 fee
          eligibility는 다음 block의 base fee에 따라 바뀝니다. Consensus state가 아니라 각 노드의 임시 대기실이므로 두 정직한 노드의 pool 내용이나
          replacement 설정이 완전히 같을 필요는 없습니다.
        </p>
        <h3>문제</h3>
        <p>
          현재 실행 가능한 transaction만 남기면 nonce gap이나 일시적인 fee
          부족을 복구할 수 없습니다. 반대로 모든 입력을 보관하면 invalid signature,
          잔액 부족, replacement spam과 blob sidecar resource가 pool을 고갈시킬
          수 있습니다.
        </p>
        <h3>아이디어</h3>
        <p>
          validation 결과와 sender state로 transaction의 조건을 표현하고 실행 가능성에 따라 logical subpool로 분류합니다. Canonical
          head가 바뀌면 nonce, balance, base fee와 mined/reorged transactions를 반영해 다시 분류합니다.
        </p>
        <h3>구현 경계</h3>
        <ul>
          <li>
            Validator는 transaction type·fork·state를 기준으로 reject와 accepted
            classification inputs를 만듭니다.
          </li>
          <li>
            Pool은 sender/nonce dependency, replacement와 configurable resource
            limits를 유지합니다.
          </li>
          <li>
            Ordering은 <em>eligible candidates</em> 사이의 우선순위를 정하며
            nonce dependency를 무시하지 못합니다.
          </li>
          <li>
            Payload builder는 iterator 결과를 실행하며 gas, blob gas와 block
            validity에 맞지 않는 후보를 건너뜁니다.
          </li>
        </ul>
        <p>
          고정 예시는 Alice의 canonical nonce가 7인 시점에서 시작합니다.
          <code>T7(maxFee=40, tip=3 gwei)</code>와 <code>T8</code>이 들어오면 T7은
          sender head, T8은 그 뒤에 매달린 descendant입니다. T7이 block에
          포함되면 T8이 새 head가 되고, 그 block이 reorg로 빠지면 T7은 현재
          state에서 다시 검증된 뒤 재주입될 수 있습니다. 같은 nonce의 T7′은
          노드가 설정한 price-bump 정책을 통과해야 합니다.
        </p>
      </div>
      <ContentBoundary article="reth-txpool" />
      <ExplainedFormula
        question="같은 sender·nonce의 새 transaction이 기존 T7을 교체하려면 fee를 얼마나 올려야 할까?"
        idea="Replacement는 Ethereum consensus가 아니라 local anti-spam policy입니다. 비교 대상 fee field마다 configured bump를 적용하고 정수 단위로 올림합니다."
        formula={String.raw`F^{\mathrm{new}}_i\ge\left\lceil F^{\mathrm{old}}_i\frac{100+b}{100}\right\rceil`}
        annotatedFormula={String.raw`F^{\mathrm{new}}_i\ge\left\lceil \underbrace{F^{\mathrm{old}}_i}_{\text{기존 fee cap 계산}}\frac{100+b}{100}\right\rceil`}
        operations={[
          { expression: String.raw`F^{\mathrm{old}}_i`, annotation: ["기존 fee cap이(가) 식의 결과에 기여하는 방식을","계산합니다.","Replacement는 Ethereum consensus가","아니라 local anti-spam policy입니다."] },
        ]}
        terms={[
          { symbol: "i", name: "Fee dimension", description: "Transaction type에 따라 max fee, priority fee 또는 blob fee cap처럼 정책이 비교하는 축입니다." },
          { symbol: "F^{\\mathrm{old}}_i", name: "기존 fee cap", description: "Pool에 이미 있는 같은 sender·nonce transaction의 해당 fee 값입니다." },
          { symbol: "F^{\\mathrm{new}}_i", name: "새 fee cap", description: "Replacement 후보가 제시한 해당 fee 값입니다." },
          { symbol: "b", name: "Configured price bump", description: "노드 정책의 인상률(%)입니다. 예시의 10은 consensus 상수가 아닙니다." },
          { symbol: "\\lceil\\cdot\\rceil", name: "정수 올림", description: "Wei 단위 비교에서 필요한 최소 증가량을 보존합니다." },
        ]}
        assumptions={[
          "두 transaction의 sender와 nonce가 같고 envelope가 먼저 기본 검증을 통과했습니다.",
          "예시는 모든 required fee dimension에 10% bump를 요구하는 정책을 가정합니다.",
          "정확한 default·blob 별도 bump·overflow 처리는 실행한 Reth release와 config에 귀속합니다.",
        ]}
        interpretation="T7의 max fee 40 gwei와 tip 3 gwei에 10%를 적용하면 후보는 적어도 44 gwei와 3.3 gwei 상당의 정수 wei 조건을 모두 만족해야 합니다. 하나만 올린 후보를 거부해 cheap replacement spam을 막습니다."
      />
      <div className="not-prose mb-8">
        <TxPoolViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">변화에 강한 설계 포인트</h3>
      <div className="not-prose mb-6 space-y-2">
        {DESIGN_CHOICES.map((item) => {
          const open = selected === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              animate={{ opacity: open ? 1 : 0.6 }}
              className="block w-full cursor-pointer rounded-xl border p-4 text-left"
            >
              <p
                className="text-sm font-semibold"
                style={{ color: item.color }}
              >
                {item.title}
              </p>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 space-y-1 text-sm leading-6 text-foreground/70"
                  >
                    <p>
                      <strong>문제:</strong> {item.problem}
                    </p>
                    <p>
                      <strong>처리:</strong> {item.solution}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서브풀 이름, 기본 개수·메모리 한도와 replacement bump는 설정과
          transaction type에 따라 달라질 수 있습니다. 글은 숫자를 복제하지 않고{" "}
          <strong>
            validation → dependency classification → repricing/reorg → builder
            consumption
          </strong>{" "}
          흐름을 기준으로 확장합니다.
        </p>
      </div>
      <div id="paper-ethereum-transaction-rules" className="mt-8 scroll-mt-24">
        <CitationBlock citeKey={1} source="EIP-1559 — typed transaction fee validity" href="https://eips.ethereum.org/EIPS/eip-1559">
          <p>Dynamic-fee transaction의 fee fields와 block base fee에 대한 protocol 유효성은 EIP-1559에 귀속합니다. Pool의 보관 한도·replacement·eviction 정책까지 consensus 규칙으로 확대하지 않습니다.</p>
        </CitationBlock>
      </div>
      <div id="paper-reth-txpool-source" className="scroll-mt-24">
        <CitationBlock citeKey={2} type="code" source="Reth transaction-pool source snapshot @ 4cf0face" href="https://github.com/paradigmxyz/reth/tree/4cf0facecda7b4d474c739acef1c0fc2c69a122c/crates/transaction-pool">
          <p>Validator, subpool, ordering과 maintenance 구현 설명은 이 SHA에 고정합니다. Candidate release는 reorg·restart·resource pressure fixture에서 pool state와 builder-visible sequence parity를 통과한 뒤에만 성능을 비교합니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}
