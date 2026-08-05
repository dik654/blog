import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  i: '#6366f1',
  r: '#10b981',
  k: '#f59e0b',
  hash: '#ec4899',
  sec: '#8b5cf6',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '1. Round 1 — Initiator → e (clear)',
    body: '임시 DH 키쌍 생성 후 공개키만 평문 전송.\nh = H(h || e_i.public) 으로 핸드셰이크 해시 갱신.\n아직 어떤 identity도 노출 안 됨.',
  },
  {
    label: '2. Round 2 — Responder → e, ee, s, es',
    body: 'Responder가 임시키 e_r 생성, ee/es DH 수행.\n파생 키로 자신의 정적키 + payload를 암호화 전송.\nInitiator는 처음으로 Responder identity를 받음.',
  },
  {
    label: '3. Round 3 — Initiator → s, se',
    body: 'Initiator가 Responder 정적키 복호화 후 검증.\nDH(s_i, e_r) = se 수행, 자신의 정적키 + payload 암호화.\n이 시점에 양측 상호 인증 완료.',
  },
  {
    label: '4. Key Derivation — HKDF chaining',
    body: 'ck (chaining key) = H("Noise_XX_25519_ChaChaPoly_SHA256").\n각 DH 후 HKDF(ck, DH_output) → 새 ck.\n최종 ck에서 k1 (I→R), k2 (R→I) 파생.',
  },
  {
    label: '5. Payload — protobuf NoiseHandshakePayload',
    body: 'identity_key: Ed25519 공개키.\nidentity_sig: Ed25519(X25519_static_pub) 서명.\ndata: 빈 값 (확장용).',
  },
  {
    label: '6. 보안 속성 — 4가지 보장',
    body: 'Mutual Auth: 양쪽 identity 검증.\nForward Secrecy: 임시키로 세션키 파생.\nKCI Resistance: 장기키 누출 시도 차단.\nKnown-key resistance: 세션키 누출 격리.',
  },
];

export default function XXPatternDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={70} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.i}>
                Initiator
              </text>
              <text x={410} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.r}>
                Responder
              </text>
              <ModuleBox x={20} y={35} w={100} h={40} label="e_i 생성" sub="x25519_keypair()" color={C.i} />
              <DataBox x={150} y={75} w={180} h={26} label="→ e_i.public (32B, plaintext)" color={C.i} />
              <ModuleBox x={360} y={35} w={100} h={40} label="대기" sub="recv_empty()" color={C.r} />
              <ActionBox x={120} y={130} w={240} h={42} label="h = H(h || e_i.public)" sub="핸드셰이크 해시 갱신" color={C.hash} />
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={70} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.i}>
                Initiator
              </text>
              <text x={410} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.r}>
                Responder
              </text>
              <ModuleBox x={350} y={28} w={120} h={36} label="e_r 생성" color={C.r} />
              <ActionBox x={350} y={70} w={120} h={28} label="ee = DH(e_r, e_i)" color={C.k} />
              <ActionBox x={350} y={102} w={120} h={28} label="es = DH(s_r, e_i)" color={C.k} />
              <DataBox x={70} y={150} w={340} h={30}
                label="← e_r || enc(s_r.public + payload)" color={C.r} />
              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                Responder identity 노출 (암호화됨)
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={70} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.i}>
                Initiator
              </text>
              <text x={410} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.r}>
                Responder
              </text>
              <ActionBox x={10} y={28} w={140} h={28} label="dec(s_r.public)" color={C.sec} />
              <ActionBox x={10} y={62} w={140} h={28} label="verify(sig)" color={C.sec} />
              <ActionBox x={10} y={96} w={140} h={28} label="se = DH(s_i, e_r)" color={C.k} />
              <DataBox x={155} y={150} w={300} h={30}
                label="→ enc(s_i.public + payload)" color={C.i} />
              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                Initiator identity 노출 → 상호 인증 완료
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.hash}>
                Key Derivation Chain
              </text>
              <DataBox x={30} y={40} w={420} h={26}
                label='ck₀ = H("Noise_XX_25519_ChaChaPoly_SHA256")' color={C.hash} />
              {[
                { l: 'ee', op: 'HKDF(ck₀, ee)', y: 76 },
                { l: 'es', op: 'HKDF(ck₁, es)', y: 104 },
                { l: 'se', op: 'HKDF(ck₂, se)', y: 132 },
              ].map((r, i) => (
                <motion.g key={r.l}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <ActionBox x={30} y={r.y} w={420} h={22}
                    label={`${r.op} → ck${i + 1}, k${i + 1}`} color={C.k} />
                </motion.g>
              ))}
              <DataBox x={30} y={166} w={200} h={26} label="k_I→R = HKDF(ck₃, '')" color={C.i} />
              <DataBox x={250} y={166} w={200} h={26} label="k_R→I = HKDF(ck₃, '')" color={C.r} />
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sec}>
                NoiseHandshakePayload (libp2p-specific)
              </text>
              <rect x={30} y={35} width={420} height={140} rx={8}
                fill={C.sec + '06'} stroke={C.sec + '40'} strokeWidth={0.8} />
              {[
                { f: 'identity_key', t: 'bytes (Ed25519 pub)', n: '1', desc: 'Peer 식별자' },
                { f: 'identity_sig', t: 'bytes (Ed25519 sig)', n: '2', desc: 'X25519 pub 서명' },
                { f: 'data', t: 'bytes (empty)', n: '3', desc: '확장 슬롯' },
              ].map((row, i) => (
                <motion.g key={row.f}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <text x={50} y={68 + i * 36} fontSize={9} fontWeight={700} fill={C.sec}>
                    {row.f}
                  </text>
                  <text x={50} y={82 + i * 36} fontSize={8} fill="var(--muted-foreground)">
                    = {row.t}
                  </text>
                  <text x={300} y={68 + i * 36} fontSize={8} fill={C.k}>
                    field {row.n}
                  </text>
                  <text x={300} y={82 + i * 36} fontSize={8} fill="var(--muted-foreground)">
                    {row.desc}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sec}>
                4가지 보안 속성
              </text>
              <StatusBox x={30} y={35} w={195} h={50}
                label="Mutual Auth" sub="양쪽 identity 검증"
                color={C.sec} progress={1} />
              <StatusBox x={255} y={35} w={195} h={50}
                label="Forward Secrecy" sub="임시키로 세션키 파생"
                color={C.r} progress={1} />
              <StatusBox x={30} y={100} w={195} h={50}
                label="KCI Resistance" sub="장기키 누출 → impersonation 차단"
                color={C.k} progress={1} />
              <StatusBox x={255} y={100} w={195} h={50}
                label="Known-key Res." sub="세션키 누출 → future 안전"
                color={C.warn} progress={1} />
              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                4가지 모두 패턴 단위로 형식 검증됨
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
