import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '시나리오 1: 암호화폐 지갑 — enclave 키 생성, 재부팅 후 sealing으로 복원' },
  { label: '시나리오 2: 감사 로그 — 변조 불가 로그, 시간 순서 증명' },
  { label: '시나리오 3: 세션 상태 — TLS 키 캐시, expire 정책' },
  { label: '시나리오 4: 분산 DB 암호화 — 노드별 고유 키, 이탈 시 자동 무효' },
  { label: '시나리오 5: 라이선스 관리 — 칩 도용 시 자동 무효, DRM' },
];

const SCENARIO_DATA: { color: string; title: string; pts: string[] }[] = [
  {
    color: '#6366f1',
    title: '암호화폐 지갑',
    pts: [
      '개인 키를 enclave 안에서 생성',
      '서명 작업만 enclave 안에서 수행',
      '재부팅 후에도 같은 키 사용',
      '→ sealing으로 디스크 저장',
    ],
  },
  {
    color: '#10b981',
    title: '감사 로그',
    pts: [
      '변조 불가능한 로그 축적',
      '시간 순서 증명',
      '각 로그 엔트리를 seal',
      '→ attested logging',
    ],
  },
  {
    color: '#f59e0b',
    title: '세션 상태 저장',
    pts: [
      'TLS 세션 키 / 토큰 캐시',
      '수명 제한 (expire)',
      '같은 enclave에서만 읽기',
      '재시작 후 즉시 복원 가능',
    ],
  },
  {
    color: '#0ea5e9',
    title: '분산 DB 암호화',
    pts: [
      'Database 파일 전체 seal',
      '각 노드마다 고유 키',
      '노드 이탈 시 키 자동 무효',
      '백업은 별도 multi-party 프로토콜',
    ],
  },
  {
    color: '#a855f7',
    title: '라이선스 관리',
    pts: [
      '하드웨어 바운드 라이선스',
      '칩 도용 시 자동 무효',
      'DRM, 게임 anti-cheat',
      'HW 신원 증명 동시 수행',
    ],
  },
];

export default function SealScenariosViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const s = SCENARIO_DATA[step];
        return (
          <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={s.color}>
              {s.title}
            </text>
            {s.pts.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={40} y={42 + i * 42} width={440} height={34} rx={5}
                  fill={`${s.color}10`} stroke={`${s.color}40`} strokeWidth={0.8} />
                <rect x={40} y={42 + i * 42} width={4} height={34} fill={s.color} />
                <text x={60} y={64 + i * 42} fontSize={11}
                  fill="var(--foreground)">{p}</text>
              </motion.g>
            ))}
          </svg>
        );
      }}
    </StepViz>
  );
}
