import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  q: '#10b981',
  qc: '#f59e0b',
  s2n: '#8b5cf6',
  ok: '#22c55e',
  rt: '#06b6d4',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '1. Rust QUIC 3대 라이브러리',
    body: 'quinn — Pure Rust, libp2p 채택.\nquiche — Cloudflare C library + Rust binding.\ns2n-quic — AWS pure Rust, audited.',
  },
  {
    label: '2. quinn — libp2p 선택 이유',
    body: 'Pure Rust (FFI 없음).\nRFC 9000/9001/9002 준수.\ntokio + smol async runtime 지원.',
  },
  {
    label: '3. quiche — 강점과 단점',
    body: 'Cloudflare 프로덕션 검증.\ncurl --http3, nginx 등 실사용.\nFFI overhead — Rust binding 한 단계 더.',
  },
  {
    label: '4. s2n-quic — AWS 출신',
    body: 'Fuzz tested, security audited.\n2022년 출시로 상대적 신생.\nlibp2p 통합 복잡도 높음.',
  },
  {
    label: '5. quinn API 구조 — Endpoint/Connection/Stream',
    body: 'Endpoint = UDP socket + config.\nConnection = QUIC connection.\nSendStream / RecvStream / BiStream.',
  },
  {
    label: '6. libp2p-quic 통합 — Provider 추상화',
    body: 'Provider trait으로 runtime 추상화.\nTokioProvider 1차 지원.\nrustls + quinn = TLS 1.3 over QUIC.',
  },
];

export default function RustQuicEcosystemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.q}>
                Rust QUIC Libraries
              </text>
              <ModuleBox x={20} y={45} w={140} h={70}
                label="quinn" sub="libp2p 선택" color={C.q} />
              <ModuleBox x={170} y={45} w={140} h={70}
                label="quiche" sub="Cloudflare" color={C.qc} />
              <ModuleBox x={320} y={45} w={140} h={70}
                label="s2n-quic" sub="AWS" color={C.s2n} />
              <text x={90} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                Pure Rust, tokio
              </text>
              <text x={240} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                C lib + Rust FFI
              </text>
              <text x={390} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                Pure Rust, audited
              </text>
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill={C.ok}>
                libp2p 채택: quinn
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.q}>
                quinn — 선택 근거
              </text>
              {[
                { l: 'Pure Rust', d: 'FFI 오버헤드 없음, memory safe' },
                { l: 'RFC 9000 준수', d: 'QUIC core spec 완전 구현' },
                { l: 'RFC 9001 / 9002', d: 'TLS over QUIC + recovery' },
                { l: 'tokio + smol', d: 'async runtime 양쪽 지원' },
              ].map((row, i) => (
                <motion.g key={row.l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}>
                  <rect x={30} y={40 + i * 36} width={420} height={30} rx={6}
                    fill={C.q + '08'} stroke={C.q + '40'} strokeWidth={0.6} />
                  <text x={50} y={60 + i * 36} fontSize={10} fontWeight={700} fill={C.q}>
                    {row.l}
                  </text>
                  <text x={210} y={60 + i * 36} fontSize={9} fill="var(--muted-foreground)">
                    {row.d}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.qc}>
                quiche (Cloudflare)
              </text>
              <ModuleBox x={30} y={40} w={195} h={50}
                label="강점" sub="production-grade" color={C.ok} />
              <ModuleBox x={255} y={40} w={195} h={50}
                label="약점" sub="FFI overhead" color={C.warn} />
              <ActionBox x={30} y={105} w={195} h={36}
                label="Cloudflare edge 채택" color={C.qc} />
              <ActionBox x={255} y={105} w={195} h={36}
                label="C library + Rust binding" color={C.warn} />
              <AlertBox x={80} y={150} w={320} h={36}
                label="curl --http3, nginx에서도 사용 중"
                color={C.qc} />
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.s2n}>
                s2n-quic (AWS)
              </text>
              <DataBox x={30} y={45} w={420} h={28}
                label="AWS production-grade Rust QUIC" color={C.s2n} />
              <ActionBox x={30} y={80} w={195} h={36}
                label="Fuzz tested" sub="security audited" color={C.ok} />
              <ActionBox x={255} y={80} w={195} h={36}
                label="2022년 출시" sub="상대적 신생" color={C.warn} />
              <AlertBox x={30} y={130} w={420} h={50}
                label="libp2p 통합 복잡도 높음"
                sub="API 구조가 quinn과 다름 — 마이그레이션 비용"
                color={C.warn} />
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.q}>
                quinn API 계층
              </text>
              <ModuleBox x={150} y={32} w={180} h={42}
                label="Endpoint" sub="UDP socket + config" color={C.q} />
              <ModuleBox x={150} y={86} w={180} h={42}
                label="Connection" sub="QUIC connection" color={C.qc} />
              <line x1={240} y1={74} x2={240} y2={86} stroke={C.q} strokeWidth={1.5} />
              <ModuleBox x={30} y={140} w={130} h={36}
                label="SendStream" color={C.s2n} />
              <ModuleBox x={175} y={140} w={130} h={36}
                label="RecvStream" color={C.s2n} />
              <ModuleBox x={320} y={140} w={130} h={36}
                label="BiStream" color={C.ok} />
              <line x1={240} y1={128} x2={95} y2={140} stroke={C.qc} strokeWidth={0.8} />
              <line x1={240} y1={128} x2={240} y2={140} stroke={C.qc} strokeWidth={0.8} />
              <line x1={240} y1={128} x2={385} y2={140} stroke={C.qc} strokeWidth={0.8} />
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.rt}>
                libp2p-quic 통합
              </text>
              <ModuleBox x={140} y={32} w={200} h={42}
                label="Provider trait" sub="runtime 추상화" color={C.rt} />
              <ModuleBox x={30} y={84} w={195} h={42}
                label="TokioProvider" sub="1차 지원" color={C.ok} />
              <ModuleBox x={255} y={84} w={195} h={42}
                label="(future: smol/async-std)" color={C.warn} />
              <StatusBox x={30} y={135} w={420} h={45}
                label="rustls + quinn → TLS 1.3 over QUIC"
                sub="libp2p-TLS extension으로 PeerId 인증"
                color={C.q} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
