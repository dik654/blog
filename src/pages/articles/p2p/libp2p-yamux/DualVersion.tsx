import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { EITHER_FLOW, MODE_DIFF } from './DualVersionData';

export default function DualVersion({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [showMode, setShowMode] = useState(false);

  return (
    <section id="dual-version" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">이중 버전 지원</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          libp2p-yamux는 <strong>yamux 0.12와 0.13을 동시에 지원</strong>한다.
          <code>Either</code> 열거형으로 두 버전을 감싸고,
          런타임에 상대 피어가 어떤 버전을 쓰든 호환된다.
        </p>
        <p>
          왜 이중 지원? 네트워크 전체가 한 번에 업그레이드되지 않는다.<br />
          점진적 마이그레이션 동안 구버전 피어와도 통신해야 한다.
        </p>
      </div>

      {/* Either 패턴 흐름 */}
      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        <p className="text-xs font-mono text-foreground/50 mb-4">Either 패턴 — 버전 무관 디스패치</p>
        <div className="flex flex-col gap-1.5">
          {EITHER_FLOW.map((f, i) => (
            <motion.div key={f.step}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{ borderColor: f.color + '40', background: f.color + '08' }}>
              <span className="text-xs font-mono font-bold w-36 shrink-0"
                style={{ color: f.color }}>{f.step}</span>
              <span className="text-xs text-foreground/60">{f.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Server/Client 모드 토글 */}
      <div className="rounded-xl border border-border bg-card p-5">
        <button onClick={() => setShowMode(v => !v)}
          className="text-xs font-mono text-foreground/70 hover:text-foreground transition-colors mb-3">
          {showMode ? '[-]' : '[+]'} Server / Client 모드 차이
        </button>
        <AnimatePresence>
          {showMode && (
            <motion.div initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="flex flex-col gap-2 mt-2">
                {MODE_DIFF.map((m, i) => (
                  <motion.div key={m.mode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-lg border p-3"
                    style={{ borderColor: m.color + '40', background: m.color + '06' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold" style={{ color: m.color }}>
                        {m.mode}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{ background: m.color + '15', color: m.color }}>{m.action}</span>
                    </div>
                    <p className="text-xs text-foreground/60">{m.when}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-[11px] text-foreground/50 mt-3">
                inbound에서는 Server 모드로, outbound에서는 Client 모드로 초기화한다.<br />
                이 구분은 yamux의 스트림 ID 할당 규칙(짝수/홀수)에 사용된다.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('yamux-muxer', codeRefs['yamux-muxer'])} />
          <span className="text-[10px] text-muted-foreground self-center">Either 분기 구현</span>
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Protocol Versioning 전략</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Protocol Version Negotiation
//
// libp2p multistream-select:
//   각 protocol version별 ID
//   /yamux/1.0.0
//   /yamux/0.12.0
//   /yamux/0.13.0
//
// Negotiation:
//   A → B: "/multistream/1.0.0"
//   B → A: "/multistream/1.0.0"
//   A → B: "/yamux/0.13.0"
//   B → A: "na" (not supported)
//   A → B: "/yamux/0.12.0"
//   B → A: "/yamux/0.12.0" (accepted)
//   → use yamux 0.12

// 동시 다버전 지원 이유:
//
// 1. Gradual rollout
//    네트워크 전체 동시 업그레이드 불가
//    일부 peer는 구버전 유지
//
// 2. Backwards compatibility
//    기존 peer와 연결 유지
//    새 기능 활용 (지원 시)
//
// 3. Bug fix rollout
//    Security patch 빠른 배포
//    구버전과 호환 유지

// Rust의 Either Pattern:
//
// pub enum Either<L, R> {
//     Left(L),
//     Right(R),
// }
//
// impl StreamMuxer for Either<A, B>
// where
//     A: StreamMuxer,
//     B: StreamMuxer,
// {
//     fn poll_inbound(...) {
//         match self {
//             Either::Left(m) => m.poll_inbound(...),
//             Either::Right(m) => m.poll_inbound(...),
//         }
//     }
// }
//
// → Runtime dispatch
// → Zero-cost abstraction (compile-time monomorphization)

// Alternative patterns:
//
// 1. Trait Object (dyn):
//    Box<dyn StreamMuxer>
//    - Runtime cost (vtable)
//    - Type erasure
//
// 2. Generic parameter:
//    Swarm<TMuxer>
//    - Compile-time, fast
//    - Separate binaries per version
//
// 3. Either enum (chosen):
//    Enum dispatch
//    - 한 binary에 여러 versions
//    - Slight runtime cost
//    - 가독성 좋음

// Yamux versioning history:
//   0.10: initial libp2p support
//   0.11: API improvements
//   0.12: buffer fixes, current stable
//   0.13: async改善, new API
//
// libp2p는 0.12와 0.13 동시 지원
// → Deprecation 시 Either 제거`}
        </pre>
      </div>
    </section>
  );
}
