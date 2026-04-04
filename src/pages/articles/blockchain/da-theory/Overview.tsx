import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DAOverviewViz from './viz/DAOverviewViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { BLOB_LIFECYCLE } from './OverviewData';

export default function Overview({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const open = onCodeRef ? (key: string) => onCodeRef(key, codeRefs[key]) : undefined;
  const [step, setStep] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: DA 문제와 Blob 트랜잭션</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          데이터 가용성(Data Availability)은 "블록 데이터가 네트워크 참여자에게 실제로 접근 가능한가?"를 보장하는 문제다.<br />
          블록 생산자가 헤더만 공개하고 데이터를 숨기면(data withholding attack),
          검증자가 상태 전이를 재현할 수 없다.
        </p>
        <p className="leading-7">
          <strong>왜 DA가 중요한가?</strong> 롤업은 L1에 데이터를 게시해야 사기 증명/유효성 증명이 동작한다.<br />
          데이터가 가용하지 않으면 롤업의 보안 모델이 무너진다.<br />
          이더리움은 EIP-4844로 롤업 데이터 전용 공간(Blob)을 도입해 이 문제를 해결한다.
        </p>
      </div>

      {/* Blob lifecycle interactive cards */}
      <h3 className="text-lg font-semibold mb-3">Blob 라이프사이클</h3>
      <div className="space-y-2 mb-8">
        {BLOB_LIFECYCLE.map((s, i) => (
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

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          go-ethereum에서 Blob은 <code>BlobTx</code> 타입과 분리된 <code>BlobTxSidecar</code>로 구현된다.<br />
          Sidecar(블록 외부로 전파되는 보조 데이터 구조체)에 blob 데이터 + KZG 커밋먼트 + 증명이 포함된다.<br />
          블록 자체에는 versioned hash만 기록되고, 원본 blob은 약 18일 후 자동 삭제된다.{' '}
          {open && <CodeViewButton onClick={() => open('blob-tx-struct')} />}
        </p>
        <p className="leading-7">
          실행 레이어에서는 <code>BLOBHASH</code> 옵코드(blob의 versioned hash를 EVM 스택에 올리는 명령어, 0x49)로 blob을 참조한다.{' '}
          {open && <CodeViewButton onClick={() => open('opcode-blobhash')} />}
        </p>
      </div>
      <div className="not-prose"><DAOverviewViz /></div>
    </section>
  );
}
