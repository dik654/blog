import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import CryptoDetailViz from "./viz/CryptoDetailViz";
import { CRYPTO_ITEMS } from "./CryptoData";
import type { CodeRef } from "@/components/code/types";

export default function Crypto({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(CRYPTO_ITEMS[0].name);

  return (
    <section id="crypto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        서명·해시·BN254 연산의 공통 실행 경계
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          초기 precompile은 서로 다른 암호 문제를 풀지만 실행 순서는 같습니다.
          활성 registry에서 주소를 찾고, 입력 길이로 gas를 계산한 뒤, encoding을
          검증하고 native implementation을 실행합니다. gas 숫자는 라이브러리의
          실제 실행 시간을 뜻하는 benchmark가 아니라 block을 검증하는 consensus
          schedule입니다.
        </p>
        <p className="leading-7">
          <code>ecRecover</code>는 컨트랙트 호출 안에서 서명자를 복구하는
          연산입니다. 노드가 transaction envelope의 sender를 복구하는 내부
          로직과 목적은 비슷하지만 같은 precompile 호출은 아닙니다. BN254
          add·mul·pairing도 “빠른 Rust 함수”라는 설명보다 EIP의 byte encoding,
          curve checks와 fork별 gas를 지키는 것이 핵심입니다.
        </p>
      </div>

      <div className="not-prose mb-6">
        <CryptoDetailViz />
      </div>

      <h3 className="text-lg font-semibold mb-3">연산별 ABI와 가스</h3>
      <div className="not-prose space-y-2 mb-6">
        {CRYPTO_ITEMS.map((item) => {
          const open = expanded === item.name;
          return (
            <div
              key={item.name}
              className="overflow-hidden rounded-xl border border-border/60"
            >
              <button
                type="button"
                onClick={() => setExpanded(open ? null : item.name)}
                className="flex w-full cursor-pointer items-center justify-between px-5 py-3 text-left hover:bg-muted/30"
              >
                <div>
                  <p
                    className="font-mono text-sm font-semibold"
                    style={{ color: item.color }}
                  >
                    {item.name} ({item.addr})
                  </p>
                  <p className="mt-0.5 text-xs text-foreground/60">
                    가스: {item.gasFormula}
                  </p>
                </div>
                <span className="text-foreground/40" aria-hidden="true">
                  {open ? "−" : "+"}
                </span>
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 border-t border-border/40 px-5 py-4">
                      <p className="text-xs text-foreground/55">
                        <strong>입력:</strong> {item.inputFormat}
                      </p>
                      <p className="text-xs text-foreground/55">
                        <strong>출력:</strong> {item.outputFormat}
                      </p>
                      <p className="pt-2 text-sm leading-6 text-foreground/80">
                        {item.detail}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() =>
            onCodeRef("precompile-dispatch", codeRefs["precompile-dispatch"])
          }
        />
        <span className="self-center text-xs text-muted-foreground">
          call dispatch snapshot
        </span>
        <CodeViewButton
          onClick={() => onCodeRef("bn128-add", codeRefs["bn128-add"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          BN254 add snapshot
        </span>
        <CodeViewButton
          onClick={() => onCodeRef("bn128-pairing", codeRefs["bn128-pairing"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          BN254 pairing snapshot
        </span>
      </div>
    </section>
  );
}
