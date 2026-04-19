import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  ext: '#6366f1',
  exp: '#10b981',
  label: '#f59e0b',
  key: '#8b5cf6',
  warn: '#ef4444',
  axis: '#94a3b8',
  ok: '#10b981',
};

const STEPS = [
  {
    label: 'HKDF — Extract / Expand 2단계',
    body: 'Extract: 임의 엔트로피 → 균일 PRK (HMAC-salt-IKM).\nExpand: PRK → 원하는 길이의 OKM (HMAC 반복).\nRFC 5869 — TLS·QUIC·Signal 모두 채택.',
  },
  {
    label: 'HKDF-Expand-Label — TLS 1.3 컨벤션',
    body: '구조화된 label 로 키 분리:\n"tls13 derived" / "tls13 c hs traffic" / "tls13 s ap traffic" / "tls13 res master" 등.\ntranscript hash 를 context 에 포함 — 핸드셰이크에 바인딩.',
  },
  {
    label: '방향별 트래픽 키 3종',
    body: 'secret 하나에서 key / iv / finished 3개 파생.\nkey = AEAD 암호화 키, iv = nonce 베이스, finished = MAC 키.\n방향별 (client/server) × 단계별 (early/handshake/app) 조합.',
  },
  {
    label: 'Per-record nonce — 절대 재사용 금지',
    body: 'nonce_i = iv XOR counter_i (12 bytes).\n각 record 마다 counter +1.\nnonce 재사용 = AEAD 보안 완전 붕괴 → 평문 추출 가능.',
  },
  {
    label: 'KeyUpdate — 장기 연결 보호',
    body: 'new_secret = HKDF-Expand-Label(old_secret, "traffic upd", "", H).\n메시지 한 통으로 즉시 갱신, 새 key/iv 파생.\n이전 키 폐기 → 노출돼도 이후 트래픽은 안전.',
  },
];

const LABELS = [
  '"tls13 derived"',
  '"tls13 c hs traffic"',
  '"tls13 s hs traffic"',
  '"tls13 c ap traffic"',
  '"tls13 s ap traffic"',
  '"tls13 res master"',
];

export default function TLSHKDFPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ext}>
                HKDF 2단계 파이프라인
              </text>
              {/* inputs */}
              <DataBox x={30} y={50} w={90} h={30} label="salt" color={C.axis} outlined />
              <DataBox x={30} y={90} w={90} h={30} label="IKM" sub="entropy" color={C.axis} outlined />

              {/* Extract */}
              <ModuleBox x={150} y={60} w={130} h={56} label="HKDF-Extract" sub="HMAC(salt, IKM)" color={C.ext} />
              <motion.line x1={120} y1={65} x2={150} y2={75} stroke={C.axis} strokeWidth={1} markerEnd="url(#ar)" />
              <motion.line x1={120} y1={105} x2={150} y2={100} stroke={C.axis} strokeWidth={1} markerEnd="url(#ar)" />
              <defs>
                <marker id="ar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={C.axis} />
                </marker>
              </defs>

              {/* PRK */}
              <DataBox x={310} y={75} w={80} h={30} label="PRK" sub="32B" color={C.ext} outlined />
              <motion.line x1={280} y1={88} x2={310} y2={88} stroke={C.ext} strokeWidth={1.2} markerEnd="url(#ar)" />

              {/* Expand */}
              <ModuleBox x={150} y={150} w={130} h={56} label="HKDF-Expand" sub="HMAC chain × N" color={C.exp} />
              <motion.line x1={350} y1={106} x2={350} y2={140} stroke={C.exp} strokeWidth={1} />
              <motion.line x1={350} y1={140} x2={245} y2={140} stroke={C.exp} strokeWidth={1} />
              <motion.line x1={245} y1={140} x2={245} y2={150} stroke={C.exp} strokeWidth={1} markerEnd="url(#ar)" />

              <DataBox x={30} y={160} w={90} h={36} label="info / label" sub="용도 분리" color={C.label} outlined />
              <motion.line x1={120} y1={178} x2={150} y2={178} stroke={C.label} strokeWidth={1.2} markerEnd="url(#ar)" />

              <DataBox x={310} y={165} w={80} h={30} label="OKM" sub="L bytes" color={C.exp} outlined />
              <motion.line x1={280} y1={178} x2={310} y2={178} stroke={C.exp} strokeWidth={1.2} markerEnd="url(#ar)" />

              <text x={260} y={235} textAnchor="middle" fontSize={9.5} fill={C.ext} fontWeight={600}>
                Extract → 균일 PRK / Expand → 원하는 길이로 펼침
              </text>
              <text x={260} y={253} textAnchor="middle" fontSize={9} fill={C.axis}>
                RFC 5869 — TLS, QUIC, Signal 모두 채택
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.label}>
                HKDF-Expand-Label
              </text>
              {/* HKDFLabel struct */}
              <rect x={30} y={40} width={220} height={120} rx={6} fill={`${C.label}08`} stroke={C.label} strokeWidth={0.8} />
              <text x={140} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.label}>
                HKDFLabel
              </text>
              <DataBox x={45} y={68} w={190} h={26} label="length: u16" color={C.label} outlined />
              <DataBox x={45} y={98} w={190} h={26} label='label: "tls13 ⋯"' color={C.label} outlined />
              <DataBox x={45} y={128} w={190} h={26} label="context: transcript_hash" color={C.label} outlined />

              {/* labels list */}
              <text x={395} y={56} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.exp}>
                정의된 라벨들
              </text>
              {LABELS.map((l, i) => (
                <g key={l}>
                  <rect x={285} y={66 + i * 22} width={220} height={18} rx={3} fill={`${C.exp}10`} stroke={C.exp} strokeWidth={0.6} />
                  <text x={395} y={79 + i * 22} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={C.exp}>
                    {l}
                  </text>
                </g>
              ))}
              <text x={260} y={220} textAnchor="middle" fontSize={9.5} fill={C.label} fontWeight={600}>
                label 로 용도 분리 → 동일 secret에서도 키 충돌 없음
              </text>
              <text x={260} y={240} textAnchor="middle" fontSize={9} fill={C.axis}>
                transcript hash 바인딩 → 다른 핸드셰이크와 키 분리
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.exp}>
                secret 하나 → 3개 키
              </text>
              <ModuleBox x={195} y={40} w={130} h={50} label="traffic_secret" sub="per-direction" color={C.exp} />
              {/* fan-out arrows */}
              {[80, 260, 440].map((tx, i) => (
                <motion.line
                  key={i}
                  x1={260}
                  y1={90}
                  x2={tx}
                  y2={140}
                  stroke={C.exp}
                  strokeWidth={1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                />
              ))}

              <DataBox x={30} y={140} w={120} h={36} label="key" sub='"key" / 16B' color={C.key} outlined />
              <DataBox x={205} y={140} w={120} h={36} label="iv" sub='"iv" / 12B' color={C.key} outlined />
              <DataBox x={380} y={140} w={120} h={36} label="finished" sub='"finished" / 32B' color={C.key} outlined />

              {/* uses */}
              <ActionBox x={30} y={195} w={120} h={36} label="AEAD encrypt" sub="record body" color={C.exp} />
              <ActionBox x={205} y={195} w={120} h={36} label="nonce base" sub="XOR counter" color={C.exp} />
              <ActionBox x={380} y={195} w={120} h={36} label="HMAC verify" sub="Finished msg" color={C.exp} />

              <text x={260} y={258} textAnchor="middle" fontSize={9} fill={C.axis}>
                client / server × early / handshake / app = 6가지 secret 조합
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.key}>
                Per-record nonce
              </text>
              <DataBox x={30} y={50} w={140} h={36} label="iv (fixed)" sub="12 bytes" color={C.key} outlined />
              <text x={195} y={73} textAnchor="middle" fontSize={14} fill={C.warn} fontWeight={700}>
                ⊕
              </text>
              <DataBox x={210} y={50} w={140} h={36} label="counter_i" sub="record seq" color={C.label} outlined />
              <text x={375} y={73} textAnchor="middle" fontSize={14} fill={C.axis} fontWeight={700}>
                =
              </text>
              <DataBox x={390} y={50} w={110} h={36} label="nonce_i" sub="12 bytes" color={C.exp} outlined />

              {/* counter sequence visualization */}
              <text x={50} y={120} fontSize={9} fontWeight={600} fill={C.axis}>
                Records:
              </text>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={i}>
                  <rect x={110 + i * 60} y={108} width={50} height={26} rx={3} fill={`${C.exp}15`} stroke={C.exp} strokeWidth={0.6} />
                  <text x={135 + i * 60} y={125} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.exp}>
                    n{i}
                  </text>
                </g>
              ))}

              {/* warn */}
              <AlertBox x={60} y={170} w={400} h={50} label="nonce 재사용 = AEAD 붕괴" sub="평문 추출 가능 — 절대 금지" color={C.warn} />
              <text x={260} y={245} textAnchor="middle" fontSize={9} fill={C.axis}>
                counter 는 record 마다 +1, 64-bit → 사실상 무한
              </text>
              <text x={260} y={262} textAnchor="middle" fontSize={9} fill={C.axis}>
                seq 와 iv 가 모두 secret → 외부 관찰 불가
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.key}>
                KeyUpdate — 즉시 갱신
              </text>
              <DataBox x={30} y={50} w={130} h={36} label="old_secret" color={C.axis} outlined />
              <ActionBox
                x={180}
                y={45}
                w={170}
                h={46}
                label="HKDF-Expand-Label"
                sub='"traffic upd"'
                color={C.exp}
              />
              <DataBox x={370} y={50} w={130} h={36} label="new_secret" color={C.exp} outlined />

              <motion.line x1={160} y1={68} x2={180} y2={68} stroke={C.axis} strokeWidth={1.2} markerEnd="url(#ark)" />
              <motion.line x1={350} y1={68} x2={370} y2={68} stroke={C.exp} strokeWidth={1.2} markerEnd="url(#ark)" />
              <defs>
                <marker id="ark" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={C.axis} />
                </marker>
              </defs>

              {/* derive new key/iv */}
              <ActionBox x={120} y={120} w={120} h={36} label="new key" sub='"key"' color={C.key} />
              <ActionBox x={260} y={120} w={120} h={36} label="new iv" sub='"iv"' color={C.key} />
              <motion.line x1={435} y1={86} x2={435} y2={138} stroke={C.exp} strokeWidth={1} />
              <motion.line x1={180} y1={138} x2={435} y2={138} stroke={C.exp} strokeWidth={1} />
              <motion.line x1={180} y1={138} x2={180} y2={120} stroke={C.exp} strokeWidth={1} markerEnd="url(#ark)" />
              <motion.line x1={320} y1={138} x2={320} y2={120} stroke={C.exp} strokeWidth={1} markerEnd="url(#ark)" />

              {/* timeline */}
              <line x1={40} y1={210} x2={480} y2={210} stroke={C.axis} strokeWidth={0.8} />
              <DataBox x={40} y={195} w={170} h={28} label="old key 영역" color={C.axis} outlined />
              <DataBox x={250} y={195} w={230} h={28} label="new key 영역 (FS 회복)" color={C.ok} outlined />
              <text x={260} y={250} textAnchor="middle" fontSize={9.5} fill={C.ok} fontWeight={600}>
                이전 키 폐기 → 노출 시 이후 트래픽은 안전
              </text>
              <text x={260} y={266} textAnchor="middle" fontSize={9} fill={C.axis}>
                메시지 1통 (KeyUpdate) 만으로 양방향 전환
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
