import { useState } from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    phase: '1. 슬롯 시작',
    actor: 'CL',
    detail: '12초 주기로 슬롯이 시작되면 CL이 블록 제안자를 결정합니다.',
  },
  {
    phase: '2. 페이로드 요청',
    actor: 'CL → EL',
    detail: 'engine_forkchoiceUpdated + PayloadAttributes로 EL에 블록 빌딩을 요청합니다.',
  },
  {
    phase: '3. 트랜잭션 실행',
    actor: 'EL',
    detail: 'PayloadBuilder가 풀에서 트랜잭션을 선별, EVM으로 실행, 상태 루트를 병렬 계산합니다.',
  },
  {
    phase: '4. 페이로드 수신',
    actor: 'CL ← EL',
    detail: 'engine_getPayload로 실행 페이로드 + BlobsBundle을 수신합니다.',
  },
  {
    phase: '5. 블록 조립 & 서명',
    actor: 'CL + VC',
    detail: '비콘 블록에 실행 페이로드를 포함하고, 검증자가 BLS 서명합니다.',
  },
  {
    phase: '6. P2P 전파',
    actor: 'Network',
    detail: 'gossipsub으로 블록과 블롭을 네트워크에 전파합니다.',
  },
  {
    phase: '7. 검증 & Import',
    actor: 'CL → EL',
    detail: 'engine_newPayload로 다른 노드들이 블록을 검증합니다. EL이 VALID를 반환하면 import.',
  },
  {
    phase: '8. 어테스테이션',
    actor: 'CL',
    detail: '검증자 위원회가 블록에 투표하고, 포크 초이스 가중치가 업데이트됩니다.',
  },
  {
    phase: '9. 확정 (Finality)',
    actor: 'CL',
    detail: '2 에폭(~12.8분) 후 Casper FFG에 의해 블록이 확정됩니다.',
  },
];

export default function BlockLifecycle({ title }: { title?: string }) {
  const [active, setActive] = useState(0);

  return (
    <section id="block-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '블록 생명주기'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          하나의 블록이 제안되어 확정되기까지의 전체 흐름입니다.
          각 단계를 클릭하면 상세 설명을 볼 수 있습니다.
        </p>
      </div>

      <div className="not-prose flex flex-col gap-1">
        {steps.map((step, i) => (
          <motion.button
            key={step.phase}
            onClick={() => setActive(i)}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            viewport={{ once: true }}
            className={`w-full text-left rounded-lg px-4 py-3 cursor-pointer transition-all border-l-4 ${
              active === i
                ? 'border-l-primary bg-accent/60 shadow-sm'
                : 'border-l-transparent hover:bg-accent/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                step.actor.includes('CL') && step.actor.includes('EL')
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  : step.actor.includes('EL')
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
              }`}>
                {step.actor}
              </span>
              <span className="text-sm font-semibold">{step.phase}</span>
            </div>
            {active === i && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted-foreground mt-2 ml-[72px]"
              >
                {step.detail}
              </motion.p>
            )}
          </motion.button>
        ))}
      </div>
    </section>
  );
}
