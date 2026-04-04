import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import RLPEncodingViz from './viz/RLPEncodingViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { WHY_ALLOY } from './OverviewData';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">alloy 생태계 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 노드는 Address, Hash, U256 같은 기본 타입을 블록 실행 중 수천 번 생성한다.<br />
          Geth는 Go의 <code>big.Int</code>(임의 정밀도 정수)를 사용하는데,
          내부적으로 힙 슬라이스를 할당하므로 GC(Garbage Collection, 사용하지 않는 메모리를 자동 회수하는 메커니즘) 압박이 누적된다.
        </p>
        <p className="leading-7">
          <strong>alloy-primitives</strong>는 Rust의 const 제네릭(컴파일 타임에 크기가 결정되는 제네릭 파라미터)으로
          고정 크기 타입을 스택에 할당한다.<br />
          <code>{'FixedBytes<20>'}</code>이 Address, <code>{'FixedBytes<32>'}</code>가 B256이 된다.<br />
          하나의 구조체로 모든 고정 크기 바이트 타입을 표현하므로 코드 중복이 사라진다.
        </p>
        <p className="leading-7">
          직렬화도 마찬가지다.<br />
          Geth의 RLP 패키지는 리플렉션(런타임에 타입 정보를 조회하는 기법) 기반이라
          컴파일러가 최적화할 수 없다.<br />
          alloy-rlp의 derive 매크로는 컴파일 타임에 인코더 코드를 생성하므로
          LLVM이 함수를 인라인할 수 있다.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">왜 alloy인가?</h3>
      <div className="space-y-2 mb-8">
        {WHY_ALLOY.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose mt-6">
        <RLPEncodingViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
