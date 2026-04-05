import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { MESH_VS_FLOOD, CORE_FIELDS, GOSSIP_MSGS } from './OverviewData';

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [showMsgs, setShowMsgs] = useState(false);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GossipSub 프로토콜 개요</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>GossipSub</strong>는 메시(mesh) 기반 pub/sub 프로토콜이다.<br />
          토픽마다 <strong>D=6개 메시 피어</strong>를 유지하고,
          나머지에게는 gossip(IHAVE/IWANT)으로 전파한다.<br />
          왜 flood가 아닌 mesh? 모든 피어에게 보내면 대역폭이 O(n)으로 폭발한다.
          mesh는 O(D)로 제한하면서, gossip으로 누락을 복구한다.
        </p>
      </div>

      {/* Flood vs GossipSub */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-3">Flood vs GossipSub</p>
        <div className="flex flex-col gap-2">
          {MESH_VS_FLOOD.map((m, i) => (
            <motion.div key={m.method} initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: m.color + '40', background: m.color + '08' }}>
              <span className="text-xs font-mono font-bold w-24 shrink-0"
                style={{ color: m.color }}>{m.method}</span>
              <span className="text-[11px] text-foreground/60 flex-1">
                대상: {m.peers} / 대역폭: {m.bw}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: m.color + '15', color: m.color }}>{m.cons}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Behaviour 핵심 필드 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-3">Behaviour 핵심 필드</p>
        <div className="flex flex-col gap-1.5">
          {CORE_FIELDS.map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2"
              style={{ borderColor: f.color + '40', background: f.color + '06' }}>
              <span className="text-xs font-mono font-bold w-36 shrink-0"
                style={{ color: f.color }}>{f.name}</span>
              <span className="text-xs text-foreground/60">{f.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 메시지 타입 토글 */}
      <div className="rounded-xl border border-border bg-card p-5">
        <button onClick={() => setShowMsgs(v => !v)}
          className="text-xs font-mono text-foreground/70 hover:text-foreground transition-colors">
          {showMsgs ? '[-]' : '[+]'} GossipSub 메시지 타입 (5종)
        </button>
        <AnimatePresence>
          {showMsgs && (
            <motion.div initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="flex flex-col gap-1.5 mt-3">
                {GOSSIP_MSGS.map((g, i) => (
                  <motion.div key={g.name} initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-2 text-xs rounded border px-3 py-1.5"
                    style={{ borderColor: g.color + '30', background: g.color + '06' }}>
                    <span className="font-mono font-bold w-24" style={{ color: g.color }}>{g.name}</span>
                    <span className="text-foreground/60 flex-1">{g.desc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('gossipsub-struct', codeRefs['gossipsub-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">Behaviour 구조체</span>
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">GossipSub 버전 역사</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossipSub Protocol Versions
//
// v1.0 (2019):
//   - Mesh-based pub/sub
//   - IHAVE/IWANT gossip
//   - 기본 메시지 전파
//
// v1.1 (2020):
//   - Peer Scoring 시스템
//   - Adaptive gossip emission
//   - Sybil/Eclipse 방어
//   - Ethereum 2.0에서 채택
//
// v1.2 (2023):
//   - IDONTWANT 메시지
//   - Bandwidth 최적화
//   - 중복 메시지 감소
//   - Episub 병합 고려

// 메시지 타입 (5종):
//   SUBSCRIBE: "이 topic 구독 시작"
//   UNSUBSCRIBE: "이 topic 해제"
//   PUBLISH: 실제 메시지 전송
//   GRAFT: "Mesh에 나 추가해줘"
//   PRUNE: "Mesh에서 나 제거"
//
//   Control:
//   IHAVE: "이런 메시지 가지고 있어"
//   IWANT: "그 메시지 나한테도"
//   IDONTWANT (v1.2): "그거 이미 있으니 보내지마"

// Configuration Constants:
//
//   D:      6     (target mesh peers)
//   D_lo:   4     (minimum mesh)
//   D_hi:   12    (maximum mesh)
//   D_lazy: 6     (gossip peers)
//   D_score:4     (가장 좋은 peers)
//   D_out:  2     (outbound peers)
//
//   heartbeat: 1 second
//   mcache_len: 5 heartbeats (6s)
//   mcache_gossip: 3 heartbeats
//   seen_ttl: 120 seconds
//   prune_backoff: 1 minute

// Application Examples:
//
//   Ethereum 2.0 Beacon Chain:
//     - beacon_block (블록)
//     - beacon_attestation_* (증명)
//     - beacon_aggregate_and_proof
//     - voluntary_exit
//     - proposer_slashing
//     - attester_slashing
//
//   Filecoin: storage deals
//   Polkadot: consensus messages
//   IPFS PubSub: general purpose`}
        </pre>
      </div>
    </section>
  );
}
