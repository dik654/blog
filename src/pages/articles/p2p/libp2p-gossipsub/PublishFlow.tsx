import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { PUBLISH_STEPS } from './PublishFlowData';

export default function PublishFlow({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  const step = PUBLISH_STEPS[active];

  return (
    <section id="publish-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">publish() 코드 추적</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <code>publish()</code>는 GossipSub의 메시지 발행 진입점이다.<br />
          메시지 구성부터 RPC 전송까지 5단계를 거친다.<br />
          특히 <strong>IDONTWANT 선전송</strong>이 v1.2의 핵심 최적화다.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        {/* 스텝 진행 바 */}
        <div className="flex gap-1 mb-4">
          {PUBLISH_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setActive(i)}
              className="flex-1 h-2 rounded-full transition-colors"
              style={{
                background: i <= active ? step.color : 'var(--border)',
                opacity: i <= active ? 1 : 0.3,
              }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}>
            <p className="text-sm font-mono font-bold mb-2" style={{ color: step.color }}>
              {step.label}
            </p>
            <p className="text-xs text-foreground/70 mb-2">{step.desc}</p>
            <div className="rounded-lg border border-dashed px-3 py-2"
              style={{ borderColor: step.color + '40', background: step.color + '06' }}>
              <p className="text-[11px] text-foreground/60">{step.detail}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-4">
          <button onClick={() => setActive(i => Math.max(0, i - 1))}
            disabled={active === 0}
            className="text-xs font-mono text-foreground/50 hover:text-foreground disabled:opacity-30">
            &larr; 이전
          </button>
          <span className="text-[10px] text-foreground/40">{active + 1} / {PUBLISH_STEPS.length}</span>
          <button onClick={() => setActive(i => Math.min(PUBLISH_STEPS.length - 1, i + 1))}
            disabled={active === PUBLISH_STEPS.length - 1}
            className="text-xs font-mono text-foreground/50 hover:text-foreground disabled:opacity-30">
            다음 &rarr;
          </button>
        </div>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('gossipsub-publish', codeRefs['gossipsub-publish'])} />
          <span className="text-[10px] text-muted-foreground self-center">publish() 구현</span>
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Publish 흐름 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossipSub publish() 실행 흐름
//
// Step 1: Message Construction
//
//   struct RawMessage {
//       source: PeerId,
//       data: Bytes,
//       sequence_number: u64,
//       topic: TopicHash,
//       signature: Option<Vec<u8>>,
//       key: Option<Vec<u8>>,
//       validated: bool,
//   }
//
//   message_id = hash(from || seqno || data)
//
// Step 2: Validation
//
//   - Message size check (max)
//   - Duplicate check (mcache)
//   - Signature validation (if signed)
//   - Topic subscription check
//
//   duplicate → drop silently
//
// Step 3: Delivery Target Selection
//
//   recipients = set()
//
//   // Mesh peers (subscribed)
//   if topic in self.mesh:
//       recipients += mesh[topic]
//
//   // Fanout peers (not subscribed, but publishing)
//   elif topic in self.fanout:
//       recipients += fanout[topic]
//   else:
//       // Create new fanout
//       candidates = peers_topic[topic].shuffle()
//       fanout[topic] = candidates[:D]
//       recipients += fanout[topic]
//
//   // Flood publishing (optional)
//   if config.flood_publish:
//       recipients += all_subscribed_peers
//
// Step 4: IDONTWANT Broadcast (v1.2)
//
//   // Preemptive dedup signal
//   other_peers = non_mesh_subscribed[topic]
//   for peer in other_peers:
//       send IDONTWANT(message_id) to peer
//
//   → Peer가 같은 msg 보내지 않음
//
// Step 5: Send to Recipients
//
//   publish_msg = create_publish_message(topic, data)
//
//   for peer in recipients:
//       send_rpc(peer, publish_msg)
//
//   // Update mcache
//   mcache.put(message_id, raw_message)
//
//   // Return
//   return message_id

// IDONTWANT 효과:
//   크기: ~50 bytes (tiny)
//   주 메시지: 수 KB ~ MB
//   중복 메시지 감소 효과 큼
//   Ethereum 블록 전파 최적화

// Flood vs Fanout:
//   flood_publish=true: 모든 subscribed
//                     높은 신뢰성, 높은 bandwidth
//   flood_publish=false: fanout만 (D=6)
//                     기본값, 효율적

// Fanout TTL:
//   fanout_ttl: 60 seconds
//   미구독 topic의 fanout 유지 시간
//   expire 시 해당 topic 정리`}
        </pre>
      </div>
    </section>
  );
}
