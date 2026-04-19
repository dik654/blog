import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  pat: '#6366f1',
  dh: '#10b981',
  cipher: '#f59e0b',
  hash: '#ec4899',
  user: '#8b5cf6',
  vs: '#ef4444',
};

const STEPS = [
  {
    label: '1. 설계 철학 — Simple, Modular, Analyzable',
    body: 'Trevor Perrin이 설계한 패턴 기반 핸드셰이크 프레임워크.\n인증서 체계 없이 공개키만으로 인증한다.\n패턴은 형식 검증되어 있어 보안 분석이 용이하다.',
  },
  {
    label: '2. Cipher Suite — DH × Cipher × Hash 조합',
    body: 'DH 4종 × Cipher 2종 × Hash 4종으로 조합 가능.\nlibp2p가 사용하는 조합: Noise_XX_25519_ChaChaPoly_SHA256.',
  },
  {
    label: '3. Pattern 종류 — XX, XK, NK, KK',
    body: 'XX: 양쪽 모두 identity 모름 (P2P 적합).\nXK/NK: 한쪽만 알려짐.\nKK: 양쪽 모두 알려짐 (가장 빠름).',
  },
  {
    label: '4. Token 의미 — e, s, ee, es, se, ss',
    body: 'e: 임시 키 / s: 정적 키.\nee/es/se/ss: DH 연산 (e×e, e×s, s×e, s×s).',
  },
  {
    label: '5. 사용 프로젝트 — WireGuard / libp2p / Signal',
    body: 'WireGuard VPN: IK 패턴.\nlibp2p: XX 패턴.\nSignal: X3DH (Noise inspired).',
  },
  {
    label: '6. vs TLS 1.3 — CA-free vs PKI',
    body: 'Noise는 패턴 기반, CA 불필요.\nTLS는 PKI 기반, 표준화.\nP2P 환경은 CA 부재라 Noise가 적합.',
  },
];

export default function NoiseFrameworkViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pat}>
                Noise Protocol Framework
              </text>
              <ModuleBox x={30} y={50} w={120} h={50} label="Simple" sub="패턴 기반" color={C.pat} />
              <ModuleBox x={180} y={50} w={120} h={50} label="Modular" sub="조합 가능" color={C.dh} />
              <ModuleBox x={330} y={50} w={120} h={50} label="Analyzable" sub="형식 검증" color={C.cipher} />
              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Trevor Perrin / noiseprotocol.org
              </text>
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                — 인증서 없이 공개키 직접 인증 —
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pat}>
                Cipher Suite Components
              </text>
              <text x={70} y={45} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.dh}>DH</text>
              <DataBox x={20} y={55} w={100} h={20} label="25519" color={C.dh} />
              <DataBox x={20} y={80} w={100} h={20} label="448" color={C.dh} />
              <text x={205} y={45} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.cipher}>Cipher</text>
              <DataBox x={155} y={55} w={100} h={20} label="ChaChaPoly" color={C.cipher} />
              <DataBox x={155} y={80} w={100} h={20} label="AESGCM" color={C.cipher} />
              <text x={355} y={45} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.hash}>Hash</text>
              <DataBox x={290} y={55} w={130} h={20} label="SHA256 / SHA512" color={C.hash} />
              <DataBox x={290} y={80} w={130} h={20} label="BLAKE2s / BLAKE2b" color={C.hash} />
              <rect x={30} y={130} width={420} height={40} rx={6}
                fill={C.pat + '08'} stroke={C.pat + '40'} strokeWidth={0.8} />
              <text x={240} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                libp2p 선택:
              </text>
              <text x={240} y={162} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.pat}>
                Noise_XX_25519_ChaChaPoly_SHA256
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pat}>
                Patterns by Identity Knowledge
              </text>
              {[
                { p: 'XX', desc: '양쪽 모두 모름 (P2P)', y: 35, c: C.pat, hl: true },
                { p: 'XK', desc: 'Responder만 알려짐', y: 70, c: C.dh },
                { p: 'NK', desc: 'Initiator 익명', y: 105, c: C.cipher },
                { p: 'KK', desc: '양쪽 모두 알려짐 (최속)', y: 140, c: C.hash },
              ].map((row) => (
                <g key={row.p}>
                  <rect x={30} y={row.y} width={420} height={28} rx={6}
                    fill={row.c + (row.hl ? '15' : '06')}
                    stroke={row.c + (row.hl ? '70' : '30')}
                    strokeWidth={row.hl ? 1.2 : 0.6} />
                  <text x={50} y={row.y + 18} fontSize={11} fontWeight={700} fill={row.c}>
                    {row.p}
                  </text>
                  <text x={100} y={row.y + 18} fontSize={9} fill="var(--muted-foreground)">
                    {row.desc}
                  </text>
                  {row.hl && (
                    <text x={420} y={row.y + 18} textAnchor="end" fontSize={8} fontWeight={700} fill={row.c}>
                      libp2p
                    </text>
                  )}
                </g>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pat}>
                Tokens — e, s 와 DH 조합
              </text>
              <text x={120} y={45} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.dh}>
                Key Tokens
              </text>
              <DataBox x={50} y={55} w={140} h={24} label="e — ephemeral" color={C.dh} />
              <DataBox x={50} y={85} w={140} h={24} label="s — static" color={C.dh} />
              <text x={360} y={45} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.cipher}>
                DH Tokens
              </text>
              <DataBox x={250} y={55} w={100} h={20} label="ee = DH(e,e)" color={C.cipher} />
              <DataBox x={360} y={55} w={100} h={20} label="es = DH(e,s)" color={C.cipher} />
              <DataBox x={250} y={80} w={100} h={20} label="se = DH(s,e)" color={C.cipher} />
              <DataBox x={360} y={80} w={100} h={20} label="ss = DH(s,s)" color={C.cipher} />
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                XX 토큰 시퀀스: → e | ← e, ee, s, es | → s, se
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.user}>
                Noise 채택 프로젝트
              </text>
              {[
                { name: 'WireGuard', pat: 'IK', desc: 'VPN — 양쪽 정적키 사전 교환' },
                { name: 'libp2p', pat: 'XX', desc: 'P2P — 동적 식별 교환' },
                { name: 'Signal', pat: 'X3DH', desc: '메시징 — Noise inspired' },
                { name: 'Nebula (Slack)', pat: 'IK', desc: 'Mesh VPN' },
              ].map((row, i) => (
                <motion.g key={row.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}>
                  <rect x={30} y={35 + i * 32} width={420} height={26} rx={6}
                    fill={C.user + '08'} stroke={C.user + '30'} strokeWidth={0.6} />
                  <text x={50} y={52 + i * 32} fontSize={10} fontWeight={700} fill={C.user}>
                    {row.name}
                  </text>
                  <text x={170} y={52 + i * 32} fontSize={9} fontWeight={700} fill={C.cipher}>
                    {row.pat}
                  </text>
                  <text x={210} y={52 + i * 32} fontSize={9} fill="var(--muted-foreground)">
                    {row.desc}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.vs}>
                Noise vs TLS 1.3
              </text>
              <ActionBox x={30} y={45} w={195} h={50} label="Noise" sub="패턴 기반 / CA 없음" color={C.pat} />
              <ActionBox x={255} y={45} w={195} h={50} label="TLS 1.3" sub="PKI / 표준화" color={C.vs} />
              {[
                { l: '인증', n: '공개키 직접', t: 'X.509 체인' },
                { l: '복잡도', n: '단순 (패턴)', t: '복잡 (cert)' },
                { l: 'P2P 적합도', n: '높음', t: '낮음' },
              ].map((r, i) => (
                <g key={r.l}>
                  <text x={20} y={120 + i * 18} fontSize={8} fontWeight={700} fill="var(--muted-foreground)">
                    {r.l}
                  </text>
                  <text x={130} y={120 + i * 18} textAnchor="middle" fontSize={9} fill={C.pat}>
                    {r.n}
                  </text>
                  <text x={350} y={120 + i * 18} textAnchor="middle" fontSize={9} fill={C.vs}>
                    {r.t}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
