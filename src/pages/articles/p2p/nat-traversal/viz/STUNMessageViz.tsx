import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  {
    label: '메시지 헤더 — 20 byte 고정',
    body: '상위 2비트는 0 — 이로써 STUN을 다른 UDP 트래픽과 구분.\n14비트 Message Type / 16비트 Length / 32비트 Magic Cookie / 96비트 Transaction ID.\n매직 쿠키 0x2112A442는 STUN 시그니처 — RFC 5389가 도입한 식별자.',
  },
  {
    label: '메시지 종류와 핵심 속성',
    body: 'Request 0x0001 — Binding Request.\nResponse 0x0101 — Binding Success.\nError 0x0111 — Binding Error.\n주요 속성: XOR-MAPPED-ADDRESS / USERNAME / MESSAGE-INTEGRITY / SOFTWARE.',
  },
  {
    label: 'XOR-MAPPED-ADDRESS — 왜 XOR인가',
    body: '일부 NAT의 ALG(Application Layer Gateway)가 패킷 페이로드 안의 IP 문자열을 자동으로 변환.\nXOR로 암호화된 것처럼 보이게 하면 ALG가 인식 못함 → 원본 그대로 전달.\nPort는 매직 쿠키의 상위 16비트와, IP는 매직 쿠키 전체와 XOR.',
  },
  {
    label: '매핑 발견 vs Symmetric 판별',
    body: '같은 source 포트로 두 STUN 서버에 요청.\n응답된 외부 포트가 같으면 → Cone NAT (홀 펀칭 가능).\n다르면 → Symmetric NAT (TURN 필요).\nKeep-alive: NAT 매핑 timeout 30~60s 전 주기 재요청.',
  },
];

export default function STUNMessageViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                STUN Header — 20 bytes
              </text>
              {[
                { w: 12, label: '00', sub: '2b', color: '#64748b', desc: '상위 2비트 0' },
                { w: 78, label: 'Type', sub: '14b', color: '#10b981', desc: 'Binding 등' },
                { w: 90, label: 'Length', sub: '16b', color: '#f59e0b', desc: '속성 길이' },
              ].map((f, i) => {
                const xs = [40, 52, 130];
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.06 }}>
                    <rect x={xs[i]} y={40} width={f.w} height={36} rx={3}
                      fill={f.color + '14'} stroke={f.color} strokeWidth={0.8} />
                    <text x={xs[i] + f.w / 2} y={56} textAnchor="middle"
                      fontSize={9} fontWeight={600} fill={f.color}>{f.label}</text>
                    <text x={xs[i] + f.w / 2} y={68} textAnchor="middle"
                      fontSize={7.5} fill={f.color} opacity={0.7}>{f.sub}</text>
                  </motion.g>
                );
              })}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.18 }}>
                <rect x={220} y={40} width={120} height={36} rx={3}
                  fill="#6366f114" stroke="#6366f1" strokeWidth={0.8} />
                <text x={280} y={56} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#6366f1">Magic Cookie</text>
                <text x={280} y={68} textAnchor="middle" fontSize={7.5}
                  fontFamily="monospace" fill="#6366f1">0x2112A442</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.24 }}>
                <rect x={344} y={40} width={96} height={36} rx={3}
                  fill="#ec489914" stroke="#ec4899" strokeWidth={0.8} />
                <text x={392} y={56} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill="#ec4899">Transaction ID</text>
                <text x={392} y={68} textAnchor="middle" fontSize={7.5}
                  fill="#ec4899" opacity={0.7}>96 bits random</text>
              </motion.g>
              {/* Attributes section */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.32 }}>
                <rect x={40} y={100} width={400} height={50} rx={5}
                  fill="#8b5cf614" stroke="#8b5cf6" strokeWidth={0.8}
                  strokeDasharray="4 3" />
                <text x={240} y={120} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill="#8b5cf6">Attributes (TLV format)</text>
                <text x={240} y={134} textAnchor="middle" fontSize={8}
                  fill="#8b5cf6" opacity={0.7}>
                  Type(16b) / Length(16b) / Value(... padded to 4-byte)
                </text>
              </motion.g>
              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="#64748b">
                상위 2비트가 0 → STUN 시그니처. 다른 UDP 프로토콜과 구분.
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                Message Types & Common Attributes
              </text>
              <text x={20} y={40} fontSize={9} fontWeight={700} fill="#64748b">Message Types</text>
              {[
                { code: '0x0001', name: 'Binding Request', color: '#10b981' },
                { code: '0x0101', name: 'Binding Success', color: '#3b82f6' },
                { code: '0x0111', name: 'Binding Error', color: '#ef4444' },
              ].map((t, i) => (
                <motion.g key={t.code}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <DataBox x={20} y={50 + i * 36} w={70} h={28} label={t.code}
                    color={t.color} outlined />
                  <text x={100} y={68 + i * 36} fontSize={10}
                    fontWeight={600} fill={t.color}>{t.name}</text>
                </motion.g>
              ))}
              <text x={250} y={40} fontSize={9} fontWeight={700} fill="#64748b">Attributes</text>
              {[
                { code: '0x0020', name: 'XOR-MAPPED-ADDRESS', color: '#10b981' },
                { code: '0x0006', name: 'USERNAME', color: '#f59e0b' },
                { code: '0x0008', name: 'MESSAGE-INTEGRITY', color: '#ec4899' },
                { code: '0x8022', name: 'SOFTWARE', color: '#64748b' },
              ].map((a, i) => (
                <motion.g key={a.code}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.06 + 0.1 }}>
                  <DataBox x={250} y={50 + i * 26} w={62} h={22} label={a.code}
                    color={a.color} outlined />
                  <text x={320} y={66 + i * 26} fontSize={9}
                    fontFamily="monospace" fill={a.color}>{a.name}</text>
                </motion.g>
              ))}
              <text x={20} y={195} fontSize={7.5} fill="#64748b">
                MESSAGE-INTEGRITY: HMAC-SHA1 — long-term/short-term credential 인증.
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                XOR-MAPPED-ADDRESS — ALG 회피
              </text>
              {/* Original */}
              <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.05 }}>
                <text x={20} y={40} fontSize={9} fontWeight={700} fill="#64748b">원본</text>
                <DataBox x={20} y={48} w={150} h={26} label="203.0.113.5"
                  sub="external IP" color="#3b82f6" outlined />
                <DataBox x={180} y={48} w={80} h={26} label=":40000"
                  sub="port" color="#3b82f6" outlined />
              </motion.g>

              {/* XOR op */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.18 }}>
                <text x={290} y={64} fontSize={14} fontWeight={700}
                  fontFamily="monospace" fill="#ec4899">XOR</text>
                <DataBox x={335} y={48} w={120} h={26} label="0x2112A442"
                  sub="magic cookie" color="#ec4899" outlined />
              </motion.g>

              {/* Result */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.32 }}>
                <line x1={140} y1={86} x2={140} y2={108}
                  stroke="#10b981" strokeWidth={1.2} markerEnd="url(#arrh)" />
                <text x={20} y={120} fontSize={9} fontWeight={700} fill="#64748b">결과 (전송)</text>
                <DataBox x={20} y={130} w={150} h={26} label="XOR'd IP"
                  sub="ALG가 못 알아봄" color="#10b981" outlined />
                <DataBox x={180} y={130} w={80} h={26} label="XOR'd Port"
                  color="#10b981" outlined />
              </motion.g>

              <AlertBox x={20} y={170} w={440} h={36}
                label="ALG: NAT가 페이로드 IP 문자열을 자동 치환"
                sub="XOR로 위장 — 클라이언트만 디코딩 가능 → 원본 보존"
                color="#f59e0b" />

              <defs>
                <marker id="arrh" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
                  <polygon points="0 0, 5 2.5, 0 5" fill="#10b981" />
                </marker>
              </defs>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">
                NAT 유형 판별 — 두 STUN 서버 비교
              </text>

              {/* Client */}
              <ModuleBox x={20} y={75} w={70} h={42} label="Client"
                sub="src :3000" color="#6366f1" />

              {/* STUN servers */}
              <ModuleBox x={350} y={30} w={110} h={36} label="STUN #1"
                sub="stun.l.google" color="#10b981" />
              <ModuleBox x={350} y={130} w={110} h={36} label="STUN #2"
                sub="stun.ekiga" color="#10b981" />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}>
                <line x1={90} y1={88} x2={350} y2={48}
                  stroke="#10b981" strokeWidth={0.9} />
                <line x1={90} y1={104} x2={350} y2={148}
                  stroke="#10b981" strokeWidth={0.9} />
              </motion.g>

              {/* Response variants */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}>
                <DataBox x={170} y={70} w={120} h={22} label=":40000 (same)"
                  color="#10b981" outlined />
                <text x={230} y={106} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill="#10b981">→ Cone NAT</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                <DataBox x={170} y={130} w={120} h={22} label=":50123 (다름)"
                  color="#ef4444" outlined />
                <text x={230} y={166} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill="#ef4444">→ Symmetric NAT</text>
              </motion.g>

              <text x={20} y={195} fontSize={7.5} fill="#64748b">
                Cone → STUN만으로 홀 펀칭 가능. Symmetric → TURN 필요.
              </text>
              <text x={20} y={208} fontSize={7.5} fill="#64748b">
                NAT 매핑 timeout 30~60s — keep-alive 주기 재요청.
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
