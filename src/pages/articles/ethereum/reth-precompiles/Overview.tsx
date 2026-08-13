import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ContextViz from "./viz/ContextViz";
import PrecompileMapViz from "./viz/PrecompileMapViz";
import { DESIGN_CHOICES, PRECOMPILE_TABLE } from "./OverviewData";
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
      </div>

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
    </section>
  );
}
