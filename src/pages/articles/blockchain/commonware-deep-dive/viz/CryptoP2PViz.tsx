import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'BLS12-381: DKG → 임계 서명', body: '분산 키 생성(DKG) → 각 참여자가 부분 서명 → t개 조합 시 96 bytes 임계 서명 완성. 크로스체인 검증, VRF 리더 선출에 활용.' },
  { label: '서명 스킴 비교', body: 'ed25519: 빠른 범용. bls12381: 집계·임계(O(1) 크기, 합의 핵심). secp256r1: HSM 호환(엔터프라이즈).' },
  { label: 'p2p::authenticated 구조', body: 'ECIES 암호화 → 서명 기반 피어 인증 → 멀티플렉싱. Blocker로 악의적 피어 차단, 동적 피어 관리, 파티션 복구.' },
];

export default function CryptoP2PViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'DKG', sub: '분산 키 생성', x: 60 },
                { label: 'Resharing', sub: '키 리셰어링', x: 190 },
                { label: 'Threshold Sig', sub: '임계 서명 (96B)', x: 340 },
              ].map((n, i) => (
                <g key={i}>
                  <rect x={n.x - 55} y={20} width={110} height={40} rx={5} fill="var(--card)" />
                  <rect x={n.x - 55} y={20} width={110} height={40} rx={5}
                    fill={`${[C1, C3, C2][i]}10`} stroke={[C1, C3, C2][i]} strokeWidth={0.8} />
                  <text x={n.x} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill={[C1, C3, C2][i]}>{n.label}</text>
                  <text x={n.x} y={52} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{n.sub}</text>
                  {i < 2 && <line x1={n.x + 55} y1={40} x2={n.x + 80} y2={40} stroke="var(--border)" strokeWidth={0.6} />}
                </g>
              ))}
              <text x={220} y={90} textAnchor="middle" fontSize={10} fill="var(--foreground)">활용 사례:</text>
              {[
                { label: 'Seeds: 랜덤성', c: C1 },
                { label: 'Links: 크로스체인', c: C2 },
                { label: 'Views: 라이트 클라이언트', c: C3 },
              ].map((u, i) => (
                <g key={i}>
                  <rect x={40 + i * 140} y={100} width={120} height={26} rx={4}
                    fill={`${u.c}08`} stroke={u.c} strokeWidth={0.5} />
                  <text x={100 + i * 140} y={117} textAnchor="middle" fontSize={10} fill={u.c}>{u.label}</text>
                </g>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['스킴', '곡선', '특징', '인증서', '사용 사례'].map((h, i) => (
                <text key={i} x={[50, 140, 240, 330, 400][i]} y={22} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill="var(--foreground)">{h}</text>
              ))}
              <line x1={10} y1={28} x2={430} y2={28} stroke="var(--border)" strokeWidth={0.5} />
              {[
                { name: 'ed25519', curve: 'Curve25519', feat: '빠른 서명/검증', cert: 'O(n)', use: '일반', c: C1 },
                { name: 'bls12381', curve: 'BLS12-381', feat: '집계·임계 서명', cert: 'O(1)', use: '합의', c: C2 },
                { name: 'secp256r1', curve: 'NIST P-256', feat: 'HSM 호환', cert: 'O(n)', use: '엔터프라이즈', c: C3 },
              ].map((s, i) => (
                <g key={i}>
                  <rect x={14} y={36 + i * 34} width={70} height={24} rx={4}
                    fill={`${s.c}10`} stroke={s.c} strokeWidth={0.7} />
                  <text x={49} y={52 + i * 34} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill={s.c} fontFamily="monospace">{s.name}</text>
                  <text x={140} y={52 + i * 34} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{s.curve}</text>
                  <text x={240} y={52 + i * 34} textAnchor="middle" fontSize={10} fill="var(--foreground)">{s.feat}</text>
                  <text x={330} y={52 + i * 34} textAnchor="middle" fontSize={10}
                    fontWeight={s.cert === 'O(1)' ? 600 : 400}
                    fill={s.cert === 'O(1)' ? C2 : 'var(--foreground)'}>{s.cert}</text>
                  <text x={400} y={52 + i * 34} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{s.use}</text>
                </g>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'ECIES 암호화', sub: '연결 설정', c: C1, y: 20 },
                { label: '피어 인증', sub: '서명 검증', c: C2, y: 60 },
                { label: '멀티플렉싱', sub: '다중 채널', c: C3, y: 100 },
              ].map((n, i) => (
                <g key={i}>
                  <rect x={30} y={n.y} width={160} height={30} rx={5} fill="var(--card)" />
                  <rect x={30} y={n.y} width={160} height={30} rx={5}
                    fill={`${n.c}10`} stroke={n.c} strokeWidth={0.8} />
                  <text x={70} y={n.y + 18} fontSize={10} fontWeight={500} fill={n.c}>{n.label}</text>
                  <text x={160} y={n.y + 18} fontSize={10} fill="var(--muted-foreground)">({n.sub})</text>
                  {i < 2 && <line x1={110} y1={n.y + 30} x2={110} y2={n.y + 40} stroke="var(--border)" strokeWidth={0.5} />}
                </g>
              ))}
              {[
                { label: 'Blocker', sub: '악의적 피어 차단' },
                { label: '동적 피어', sub: '자동 관리' },
                { label: '파티션 복구', sub: '네트워크 분할 대응' },
              ].map((f, i) => (
                <g key={i}>
                  <rect x={240} y={20 + i * 40} width={170} height={28} rx={4}
                    fill={`${[C1, C2, C3][i]}08`} stroke={[C1, C2, C3][i]} strokeWidth={0.5} />
                  <text x={276} y={38 + i * 40} fontSize={10} fontWeight={500} fill={[C1, C2, C3][i]}>{f.label}</text>
                  <text x={370} y={38 + i * 40} fontSize={10} fill="var(--muted-foreground)">{f.sub}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
