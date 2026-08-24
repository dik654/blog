import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContextViz from "./viz/ContextViz";
import PrecompileMapViz from "./viz/PrecompileMapViz";
import { DESIGN_CHOICES, PRECOMPILE_TABLE } from "./OverviewData";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [selected, setSelected] = useState<string | null>(DESIGN_CHOICES[0].id);
  const choice = DESIGN_CHOICES.find((item) => item.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        포크가 선택하는 네이티브 연산 레지스트리
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Precompile은 단순한 성능 shortcut이 아닙니다. 특정 주소의{" "}
          <code>CALL</code>에 대해 bytecode 대신 protocol이 정한 native
          function을 실행하는 <strong>consensus interface</strong>입니다. 입력
          길이, gas, 오류와 출력이 EIP에 정의되므로 실행 클라이언트마다 암호
          backend가 달라도 결과는 같아야 합니다.
        </p>
        <p className="leading-7">
          따라서 주소 범위를 고정해 검사하는 것으로는 부족합니다. Reth가
          사용하는 EVM은 block의 spec id에 맞는 registry를 선택해야 합니다.
          Prague가 활성인 체인에서는 Pectra로 도입된 EIP-2537 주소까지 보이지만,
          같은 binary로 Prague 이전 block을 재실행할 때는 아직 존재하지 않는
          주소처럼 처리해야 합니다.
        </p>
        <p className="leading-7">
          이 글에서는 하나의 호출을 끝까지 따라갑니다. Alice의 nonce 7
          transaction이 <code>0x01</code>에 128-byte 입력과 5,000 gas를
          전달한다고 해봅시다. 실행기는 먼저 이 block에서 주소가 활성인지
          확인하고, <code>ecRecover</code>의 고정 비용 3,000 gas를 예약한 뒤에야
          native 함수를 실행합니다. 같은 bytes라도 포크가 다르거나 gas가
          2,999라면 결과가 달라집니다. 그래서 “Rust 함수가 빠르다”보다 주소,
          포크, gas와 입출력 계약을 함께 읽는 것이 먼저입니다.
        </p>
      </div>

      <ContentBoundary article="reth-precompiles" />

      <ExplainedFormula
        question="프리컴파일을 실제로 실행하기 전에 어떤 조건을 확인해야 할까?"
        idea="활성 포크가 정한 주소별 gas 함수로 비용을 먼저 계산합니다. 호출에 실린 gas가 부족하면 native backend에 들어가지 않고 out-of-gas로 끝나야 합니다."
        formula={String.raw`G_f(x) \le g_{\mathrm{call}},\qquad g_{\mathrm{left}}=g_{\mathrm{call}}-G_f(x)`}
        annotatedFormula={String.raw`G_f(x) \le g_{\mathrm{call}},\qquad g_{\mathrm{left}}=\underbrace{g_{\mathrm{call}}-G_f(x)}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`g_{\mathrm{call}}-G_f(x)`, annotation: ["호출 gas이(가) 식의 결과에 기여하는 방식을 계산합니다.","활성 포크가 정한 주소별 gas 함수로 비용을 먼저","계산합니다."] },
        ]}
        terms={[
          { symbol: "x", name: "입력 bytes", description: "프리컴파일에 전달된 byte string입니다. 길이·필드 encoding이 gas와 유효성에 영향을 줄 수 있습니다." },
          { symbol: "f", name: "활성 연산", description: "현재 block의 fork registry가 해당 주소에 연결한 네이티브 연산입니다." },
          { symbol: "G_f(x)", name: "프로토콜 gas", description: "EIP가 정한 비용입니다. 단위는 gas이며 wall-clock 실행 시간과 같지 않습니다." },
          { symbol: "g_{\\mathrm{call}}", name: "호출 gas", description: "CALL frame이 이 연산에 사용할 수 있도록 전달한 gas입니다." },
          { symbol: "g_{\\mathrm{left}}", name: "남은 gas", description: "비용을 먼저 지불한 뒤 caller frame에 남는 gas입니다." },
        ]}
        assumptions={[
          "주소가 현재 block의 spec id에서 활성 registry entry로 선택되어 있습니다.",
          "입력 해석·실패·출력 규칙은 해당 EIP와 같은 fork version에 고정합니다.",
          "Gas schedule은 consensus 비용이며 backend benchmark 수치가 아닙니다.",
        ]}
        interpretation="예시의 0x01 호출은 5,000−3,000=2,000 gas를 남기고 연산 단계로 갑니다. 2,999 gas만 전달하면 구현을 호출하기 전에 실패해야 하며, backend가 빨라도 이 경계는 바뀌지 않습니다."
      />

      <h3 className="text-lg font-semibold mb-3">설계 판단</h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-3 mb-4">
        {DESIGN_CHOICES.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setSelected(selected === item.id ? null : item.id)}
            className="cursor-pointer rounded-xl border p-4 text-left transition-colors"
            style={{
              borderColor:
                selected === item.id ? item.color : "var(--color-border)",
            }}
          >
            <p className="text-sm font-bold" style={{ color: item.color }}>
              {item.title}
            </p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {choice && (
          <motion.div
            key={choice.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="not-prose mb-8 overflow-hidden rounded-xl border border-border/60 p-4"
          >
            <p className="mb-2 text-sm text-foreground/65">
              <strong>문제:</strong> {choice.problem}
            </p>
            <p className="text-sm text-foreground/85">
              <strong>구현:</strong> {choice.solution}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-lg font-semibold mb-3">주소와 활성 포크</h3>
      <p className="mb-4 text-sm leading-6 text-foreground/65">
        아래 목록은 mainnet protocol history를 한 곳에서 관리합니다. Prague
        execution rules는 2025년 5월 Pectra와 함께 활성화됐으며, EIP-2537의 일곱
        BLS12-381 precompile도 현재 규칙의 일부입니다. gas 열은 구현 benchmark가
        아니라 consensus schedule입니다.
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full min-w-[720px] text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">주소</th>
              <th className="text-left p-3 font-semibold">연산</th>
              <th className="text-left p-3 font-semibold">도입 포크</th>
              <th className="text-left p-3 font-semibold">가스 규칙</th>
              <th className="text-left p-3 font-semibold">비고</th>
            </tr>
          </thead>
          <tbody>
            {PRECOMPILE_TABLE.map((row) => (
              <tr key={row.addr} className="border-t border-border">
                <td className="p-3 font-mono text-indigo-400">{row.addr}</td>
                <td className="p-3 font-semibold">{row.name}</td>
                <td className="p-3 text-foreground/60">{row.fork}</td>
                <td className="p-3 text-amber-500">{row.gas}</td>
                <td className="p-3 text-foreground/65">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6">
        <PrecompileMapViz />
      </div>

      <div id="paper-ethereum-precompile-specs" className="mt-8 scroll-mt-24">
        <CitationBlock
          citeKey={1}
          source="Ethereum EIPs — precompile address·gas·fork contracts"
          href="https://eips.ethereum.org/EIPS/eip-2537"
        >
          <p>
            EIP-2537을 포함한 각 EIP가 주소, 입력 encoding, gas와 실패 semantics를
            정의합니다. 표의 값은 실행 시간 측정치가 아니라 활성 fork의 합의
            규칙으로 읽습니다.
          </p>
        </CitationBlock>
      </div>
      <div id="paper-reth-precompile-source" className="scroll-mt-24">
        <CitationBlock
          citeKey={2}
          type="code"
          source="Reth source snapshot — revm/precompile integration @ 4cf0face"
          href="https://github.com/paradigmxyz/reth/tree/4cf0facecda7b4d474c739acef1c0fc2c69a122c"
        >
          <p>
            Registry 선택과 backend 연결에 관한 구현 설명은 이 SHA에 고정합니다.
            Moving main의 crate path나 API를 다른 release의 사실로 확대하지
            않습니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
