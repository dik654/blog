import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { RLP_RULES } from './RlpData';

export default function Rlp({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  const [step, setStep] = useState(0);

  return (
    <section id="rlp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">alloy-rlp 인코딩/디코딩</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          RLP(Recursive Length Prefix)는 이더리움의 유일한 직렬화 포맷이다.<br />
          트랜잭션, 블록 헤더, 상태 트라이 노드 모두 RLP로 인코딩된다.<br />
          <strong>결정적(deterministic)</strong> 직렬화가 핵심이다.<br />
          같은 데이터를 다르게 인코딩하면 해시가 달라지고, 블록 검증이 실패한다.
        </p>
        <p className="leading-7">
          RLP의 규칙은 단순하다.<br />
          첫 바이트가 데이터의 타입(문자열/리스트)과 길이를 결정한다.<br />
          재귀적 구조를 지원하므로 중첩된 리스트도 표현할 수 있다.
        </p>
        <p className="leading-7">
          Geth의 <code>rlp</code> 패키지는 <code>reflect</code>를 사용해 런타임에 필드를 순회한다.<br />
          alloy-rlp는 <code>#[derive(RlpEncodable)]</code> 매크로가 컴파일 타임에
          각 필드의 <code>encode()</code> 호출 코드를 직접 생성한다.<br />
          런타임 분기가 없으므로 LLVM이 전체를 인라인할 수 있다.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">RLP 인코딩 규칙</h3>
      <div className="space-y-2 mb-8">
        {RLP_RULES.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-violet-500/50 bg-violet-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-violet-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                  {s.codeKey && (
                    <div className="ml-10 mt-2">
                      <CodeViewButton onClick={() => open(s.codeKey)} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>성능 차이의 핵심</strong> — Geth의 리플렉션 기반 인코더는 매 호출마다
          타입 메타데이터를 조회하고 분기한다.<br />
          alloy-rlp의 매크로 생성 코드는 필드 순서가 컴파일 타임에 고정되므로
          분기 예측 실패가 없고, 함수 호출 오버헤드도 인라인으로 제거된다.
        </p>
      </div>
    </section>
  );
}
