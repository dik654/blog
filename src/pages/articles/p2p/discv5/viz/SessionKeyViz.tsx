import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  ecdh: '#6366f1',
  hkdf: '#10b981',
  aes: '#f59e0b',
  shared: '#0ea5e9',
  key: '#a78bfa',
  tag: '#ec4899',
};

const STEPS = [
  {
    label: 'ECDH — 임시 키 + 공유 비밀',
    body: 'eph_priv ← random(32B) → eph_pub = secp256k1·eph_priv.\nshared = ECDH(eph_priv, remote_pub) = ScalarMult → 33B compressed point.',
  },
  {
    label: 'HKDF — write/read 키 분리',
    body: 'salt = challenge_data (WHOAREYOU 에서 받음).\ninfo = "discv5 key agreement" ∥ idA ∥ idB.\nExtract → PRK, Expand → 32B → write[0:16], read[16:32].',
  },
  {
    label: 'AES-128-GCM — 암호화 + 인증',
    body: 'nonce = counter(12B), aad = masking_iv ∥ static_header.\nciphertext ∥ tag = Seal(write_key, nonce, plain, aad). tag = 16B MAC.',
  },
];

export default function SessionKeyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sk-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.shared} />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ecdh}>
                ECDH 키 교환
              </text>

              <DataBox x={20} y={50} w={140} h={42} label="eph_priv" sub="random 32B" color={C.ecdh} outlined />
              <DataBox x={20} y={110} w={140} h={42} label="remote_pub" sub="ENR 에서 추출" color={C.ecdh} outlined />

              <ActionBox x={200} y={80} w={140} h={50} label="ECDH" sub="ScalarMult(priv, pub)" color={C.ecdh} />

              <DataBox x={360} y={80} w={130} h={50} label="shared" sub="33B point" color={C.shared} outlined />

              <motion.line x1={160} y1={71} x2={200} y2={100} stroke={C.ecdh} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.4 }} />
              <motion.line x1={160} y1={131} x2={200} y2={110} stroke={C.ecdh} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.4 }} />
              <motion.line x1={340} y1={105} x2={360} y2={105} stroke={C.shared} strokeWidth={1.5}
                markerEnd="url(#sk-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />

              <text x={250} y={185} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                eph_pub 도 페어로 생성 → handshake 패킷에 포함되어 상대에게 전달
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.hkdf}>
                HKDF 파생 — write/read 키 16B씩
              </text>

              <DataBox x={20} y={50} w={130} h={36} label="salt" sub="challenge_data" color={C.hkdf} outlined />
              <DataBox x={20} y={92} w={130} h={36} label="ikm" sub="shared (33B)" color={C.shared} outlined />
              <DataBox x={20} y={134} w={130} h={36} label="info" sub="label ∥ idA ∥ idB" color={C.hkdf} outlined />

              <ActionBox x={180} y={75} w={120} h={70} label="HKDF" sub="Extract → Expand" color={C.hkdf} />
              <DataBox x={320} y={95} w={70} h={32} label="prk" color={C.hkdf} outlined />
              <DataBox x={400} y={95} w={80} h={32} label="32B out" color={C.hkdf} outlined />

              <motion.line x1={150} y1={68} x2={180} y2={95} stroke={C.hkdf} strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={150} y1={110} x2={180} y2={110} stroke={C.shared} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <motion.line x1={150} y1={152} x2={180} y2={130} stroke={C.hkdf} strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />

              <DataBox x={130} y={170} w={150} h={36} label="write_key" sub="out[0..16]" color={C.key} outlined />
              <DataBox x={300} y={170} w={150} h={36} label="read_key" sub="out[16..32]" color={C.key} outlined />
              <motion.line x1={440} y1={127} x2={350} y2={170} stroke={C.key} strokeWidth={1.2} strokeDasharray="3 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
              <motion.line x1={440} y1={127} x2={205} y2={170} stroke={C.key} strokeWidth={1.2} strokeDasharray="3 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.aes}>
                AES-128-GCM Seal
              </text>

              <DataBox x={10} y={45} w={110} h={36} label="write_key" sub="16B" color={C.key} outlined />
              <DataBox x={130} y={45} w={110} h={36} label="nonce" sub="counter 12B" color={C.aes} outlined />
              <DataBox x={250} y={45} w={110} h={36} label="aad" sub="masking + header" color={C.aes} outlined />
              <DataBox x={370} y={45} w={120} h={36} label="plaintext" sub="message body" color={C.aes} outlined />

              <ActionBox x={140} y={100} w={220} h={45} label="AES-GCM Seal" sub="encrypt + authenticate" color={C.aes} />

              {[10, 130, 250, 370].map((x, i) => (
                <motion.line key={i} x1={x + 55} y1={81} x2={250} y2={100} stroke={C.aes} strokeWidth={1}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }} />
              ))}

              <DataBox x={70} y={160} w={170} h={42} label="ciphertext" sub="동일 길이" color={C.aes} outlined />
              <DataBox x={260} y={160} w={170} h={42} label="tag (16B)" sub="MAC — 변조 감지" color={C.tag} outlined />

              <motion.line x1={250} y1={145} x2={155} y2={160} stroke={C.aes} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
              <motion.line x1={250} y1={145} x2={345} y2={160} stroke={C.tag} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />

              <AlertBox x={50} y={208} w={400} h={8} label=" " sub=" " color={C.aes} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
