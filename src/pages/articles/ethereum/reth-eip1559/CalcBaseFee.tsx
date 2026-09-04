import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CodeViewButton } from "@/components/code";
import CalcBaseFeeDetailViz from "./viz/CalcBaseFeeDetailViz";
import { ARITHMETIC_RULES, CALC_STEPS } from "./CalcBaseFeeData";
import { codeRefs } from "./codeRefs";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

export default function CalcBaseFee({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <section id="calc-base-fee" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        calc_next_block_base_fee의 consensus rounding
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          계산은 parent gas limit을 elasticity로 나눈 target에서 시작합니다. 사용량이 target과 같으면 유지하고 초과·미달 편차에 parent base
          fee를 곱한 뒤 target과 change denominator로 순서대로 나눕니다. increase branch만 integer truncation으로 변화가 사라지지 않도록
          최소 1 wei를 보장합니다.
        </p>
        <p className="leading-7">
          구현 언어나 heap allocation을 비교하는 것은 consensus 설명이 아닙니다. Reth에서 중요한 점은 중간 곱을 충분히 넓은 타입으로 수행하고
          overflow·narrowing과 subtraction semantics를 명시하며 EIP에 정의된 연산 순서를 payload building과 validation에서 공유하는
          것입니다.
        </p>
      </div>

      <div className="not-prose mb-8">
        <CalcBaseFeeDetailViz />
      </div>

      <ExplainedFormula
        question="Parent block이 target보다 3,000,000 gas 더 썼다면 다음 base fee는 얼마일까?"
        idea="초과 비율만큼 parent base fee를 조정하되, mainnet denominator 8로 한 번 더 완화합니다. Consensus 구현은 실수 반올림이 아니라 정해진 순서의 정수 나눗셈을 사용합니다."
        formula={String.raw`\begin{aligned}T&=L_p/E\\&=15{,}000{,}000\ \mathrm{gas}\\[2pt]r&=\frac{U_p-T}{T\,D}=0.025\\[2pt]\Delta&=\max(\lfloor B_p r\rfloor,1\ \mathrm{wei})\\&=0.5\ \mathrm{gwei}\\[2pt]B_n&=B_p+\Delta\\&=20.5\ \mathrm{gwei}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}T&=\underbrace{L_p/E}_{\text{기준량당 비율}}\\&=\underbrace{15{,}000{,}000\ \mathrm{gas}}_{\text{오른쪽 항으로 결과 계산}}\\[2pt]r&=\underbrace{\frac{U_p-T}{T\,D}=0.025}_{\text{기준량당 비율}}\\[2pt]\Delta&=\max(\lfloor B_p r\rfloor,1\ \mathrm{wei})\\&=0.5\ \mathrm{gwei}\\[2pt]B_n&=B_p+\Delta\\&=20.5\ \mathrm{gwei}\end{aligned}`}
        operations={[
          { expression: String.raw`L_p/E`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","초과 비율만큼 parent base fee를 조정하되,","mainnet denominator 8로 한 번 더","완화합니다."] },
          { expression: String.raw`15{,}000{,}000\ \mathrm{gas}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","초과 비율만큼 parent base fee를 조정하되,","mainnet denominator 8로 한 번 더","완화합니다."] },
          { expression: String.raw`\frac{U_p-T}{T\,D}=0.025`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","초과 비율만큼 parent base fee를 조정하되,","mainnet denominator 8로 한 번 더","완화합니다."] },
        ]}
        terms={[
          { symbol: "L_p", name: "Parent gas limit", description: "Parent header가 허용한 최대 execution gas입니다. 예시는 30,000,000 gas입니다." },
          { symbol: "E", name: "Elasticity multiplier", description: "Gas limit에서 target을 만드는 활성 ChainSpec 계수이며 예시는 2입니다." },
          { symbol: "T", name: "Target gas", description: "Base fee가 그대로 유지되는 목표 사용량입니다. 단위는 gas입니다." },
          { symbol: "U_p", name: "Parent gas used", description: "Parent가 실제로 사용한 gas이며 예시는 18,000,000입니다." },
          { symbol: "B_p", name: "Parent base fee", description: "Parent header의 base fee per gas이며 예시는 20 gwei/gas입니다." },
          { symbol: "D", name: "Change denominator", description: "변화 속도를 제한하는 fork parameter이며 예시는 8입니다." },
          { symbol: "r", name: "완화된 편차 비율", description: "Target 대비 사용량 편차를 denominator로 나눈 무차원 비율이며 예시는 0.025입니다." },
          { symbol: "\\Delta", name: "Base fee 변화량", description: "정수 버림 뒤 increase branch에서는 최소 1 wei를 보장하는 변화량입니다." },
          { symbol: "B_n", name: "Next base fee", description: "다음 block header가 가져야 하는 base fee per gas입니다." },
        ]}
        assumptions={[
          "Mainnet London 계수 E=2, D=8을 예시로 사용하며 custom chain은 ChainSpec 값을 따릅니다.",
          "모든 연산은 EIP-1559 순서의 non-negative integer arithmetic이고 increase branch는 최소 1 wei입니다.",
          "U_p가 target보다 작으면 같은 초과식을 쓰지 않고 감소 branch에서 최소 1 wei를 적용하지 않습니다.",
        ]}
        interpretation="18M gas는 15M target보다 20% 많으므로 base fee는 20%/8=2.5% 상승합니다. 최대 사용량 30M에서는 한 block 상승폭이 약 12.5%로 제한되지만, 정수 최소값 때문에 아주 작은 base fee에서는 비율만으로 설명할 수 없습니다."
      />

      <h3 className="text-lg font-semibold mb-3">세 계산 분기</h3>
      <div className="not-prose space-y-2 mb-8">
        {CALC_STEPS.map((item, index) => (
          <div
            key={item.condition}
            className="overflow-hidden rounded-xl border border-border/60"
          >
            <button
              type="button"
              onClick={() => setActive(index)}
              className="w-full cursor-pointer px-4 py-3 text-left"
            >
              <code
                className="text-sm font-semibold"
                style={{ color: item.color }}
              >
                {item.condition}
              </code>
              <p className="mt-1 text-xs text-foreground/50">{item.formula}</p>
            </button>
            <AnimatePresence initial={false}>
              {active === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-border/40 px-4 py-3 text-sm leading-6 text-foreground/70"
                >
                  {item.detail}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">구현 확인점</h3>
      <div className="not-prose space-y-2 mb-8">
        {ARITHMETIC_RULES.map((item, index) => (
          <div
            key={item.question}
            className="overflow-hidden rounded-xl border border-border/60"
          >
            <button
              type="button"
              onClick={() => setFaq(faq === index ? null : index)}
              className="w-full cursor-pointer px-4 py-3 text-left text-sm font-semibold"
            >
              {item.question}
            </button>
            <AnimatePresence initial={false}>
              {faq === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-border/40 px-4 py-3 text-sm leading-6 text-foreground/70"
                >
                  {item.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("calc-base-fee", codeRefs["calc-base-fee"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled calculation snapshot
        </span>
      </div>
    </section>
  );
}
