import { useState } from 'react';
import { motion } from 'framer-motion';

const methods = [
  {
    name: 'engine_newPayloadV3/V4',
    direction: 'CL → EL',
    desc: '실행 페이로드를 EL에 전달 → 트랜잭션 실행 + 상태 루트 검증 요청',
    response: 'PayloadStatus: VALID | INVALID | SYNCING',
  },
  {
    name: 'engine_forkchoiceUpdatedV2/V3',
    direction: 'CL → EL',
    desc: '포크 초이스 상태 업데이트 + 블록 빌딩 시작 요청',
    response: 'ForkchoiceState + PayloadAttributes (optional)',
  },
  {
    name: 'engine_getPayloadV3/V4/V5',
    direction: 'CL ← EL',
    desc: 'EL이 구성한 실행 페이로드를 CL이 수신 → 블록에 포함',
    response: 'ExecutionPayload + BlobsBundle + BlockValue',
  },
];

export default function EngineApi() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="engine-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API 통신</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          EL/CL — <strong>Engine API</strong>(JSON-RPC + JWT 인증)로 통신.
          CL이 주도적으로 호출, EL은 요청에 응답하는 구조.
          각 메서드 클릭 시 상세 설명 표시
        </p>
      </div>

      <div className="not-prose space-y-2">
        {methods.map((m, i) => (
          <motion.button
            key={m.name}
            onClick={() => setActive(active === i ? null : i)}
            whileHover={{ x: 4 }}
            className={`w-full text-left rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${
              active === i
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 shadow-md'
                : 'border-border bg-background hover:border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <code className="text-sm font-bold">{m.name}</code>
              <span className="text-xs font-mono text-foreground/75">{m.direction}</span>
            </div>
            {active === i && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 space-y-1"
              >
                <p className="text-xs text-foreground/75">{m.desc}</p>
                <p className="text-xs">
                  <span className="font-semibold">Response:</span>{' '}
                  <code className="bg-accent px-1.5 py-0.5 rounded">{m.response}</code>
                </p>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
