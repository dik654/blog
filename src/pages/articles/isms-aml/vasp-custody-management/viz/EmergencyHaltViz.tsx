import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
};

const STEPS = [
  {
    label: '긴급 전송 중지 6단계 프로토콜',
    body: 'Kill Switch 발동 → 침해 범위 파악 → 감독기관 신고 → 이용자 공지 → 미침해 자산 이전 → 원인 분석 후 재개.',
  },
  {
    label: '취약점 분석 평가 — 연 1회 의무',
    body: '네트워크·애플리케이션·키관리·물리보안·인적보안 5대 영역. 평가 후 30일 이내 결과보고서+보완계획서 금감원 제출.',
  },
  {
    label: '수탁기관 SLA — 응답 시간 15분',
    body: '외부 수탁 시 긴급 전송 중지 요청권 + 응답 시간 SLA 계약 필수. 통상 15분 이내. 지연 시 피해 확대.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 4, ay = y2 - uy * 4;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`} fill={color} />
    </g>
  );
}

export default function EmergencyHaltViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.red}>긴급 전송 중지 프로토콜</text>

              {/* 트리거 */}
              <AlertBox x={170} y={24} w={140} h={28} label="해킹 감지 / 키 유출 의심" sub="" color={C.red} />
              <Arrow x1={240} y1={52} x2={240} y2={62} color={C.red} />

              {/* 6단계 — 2행 3열 */}
              <ActionBox x={10} y={65} w={140} h={36} label="1. Kill Switch" sub="전 지갑 API 비활성화" color={C.red} />
              <Arrow x1={150} y1={83} x2={170} y2={83} color={C.red} />
              <ActionBox x={170} y={65} w={140} h={36} label="2. 침해 범위 파악" sub="보안팀 + CISO" color={C.amber} />
              <Arrow x1={310} y1={83} x2={330} y2={83} color={C.amber} />
              <ActionBox x={330} y={65} w={140} h={36} label="3. 감독기관 신고" sub="금감원 + 수사기관" color={C.blue} />

              <Arrow x1={400} y1={101} x2={400} y2={115} color={C.blue} />

              <ActionBox x={330} y={118} w={140} h={36} label="4. 이용자 공지" sub="중단 사유 + 복구 시점" color={C.blue} />
              <Arrow x1={330} y1={136} x2={310} y2={136} color={C.green} />
              <ActionBox x={170} y={118} w={140} h={36} label="5. 자산 긴급 이전" sub="미침해분 → 새 콜드월렛" color={C.green} />
              <Arrow x1={170} y1={136} x2={150} y2={136} color={C.green} />
              <StatusBox x={10} y={118} w={140} h={36} label="6. 서비스 재개" sub="원인 분석 완료 후" color={C.green} progress={1} />

              {/* 하단 */}
              <rect x={60} y={175} width={360} height={36} rx={6} fill="var(--card)" stroke={C.slate} strokeWidth={0.5} />
              <text x={240} y={191} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.slate}>핵심: 먼저 멈추고(Kill Switch) → 나중에 분석</text>
              <text x={240} y={204} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">경영진 + CISO + CCO 합의 전까지 서비스 재개 불가</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>취약점 분석 평가 5대 영역</text>

              {/* 5대 영역 — 부채꼴 배치 */}
              <ActionBox x={10} y={35} w={85} h={44} label="네트워크" sub="방화벽·DMZ" color={C.blue} />
              <ActionBox x={105} y={35} w={85} h={44} label="애플리케이션" sub="거래·API 보안" color={C.green} />
              <ActionBox x={200} y={35} w={85} h={44} label="키 관리" sub="HSM·멀티시그" color={C.amber} />
              <ActionBox x={295} y={35} w={85} h={44} label="물리 보안" sub="서버실·CCTV" color={C.red} />
              <ActionBox x={390} y={35} w={80} h={44} label="인적 보안" sub="권한·교육" color={C.slate} />

              {/* 수렴 */}
              <Arrow x1={52} y1={79} x2={200} y2={105} color={C.blue} />
              <Arrow x1={147} y1={79} x2={210} y2={105} color={C.green} />
              <Arrow x1={242} y1={79} x2={240} y2={105} color={C.amber} />
              <Arrow x1={337} y1={79} x2={270} y2={105} color={C.red} />
              <Arrow x1={430} y1={79} x2={280} y2={105} color={C.slate} />

              {/* 평가 결과 */}
              <ModuleBox x={160} y={110} w={160} h={40} label="평가 결과 보고서" sub="취약점 위험등급(상/중/하)" color={C.blue} />

              {/* 제출 */}
              <Arrow x1={240} y1={150} x2={240} y2={165} color={C.amber} />
              <rect x={100} y={168} width={280} height={40} rx={8} fill="var(--card)" stroke={C.amber} strokeWidth={1} />
              <text x={240} y={186} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.amber}>30일 이내 금감원 제출</text>
              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">결과보고서 + 보완계획서(담당자, 완료 예정일 명시)</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>수탁기관 SLA 요건</text>

              {/* VASP */}
              <ModuleBox x={20} y={40} w={100} h={44} label="VASP" sub="긴급 중지 요청" color={C.blue} />

              {/* 요청 전송 */}
              <Arrow x1={120} y1={62} x2={170} y2={62} color={C.red} />

              {/* SLA 게이트 */}
              <rect x={175} y={32} width={120} height={60} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={1.5} />
              <text x={235} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>SLA</text>
              <text x={235} y={66} textAnchor="middle" fontSize={9} fill="var(--foreground)">응답 15분 이내</text>
              <text x={235} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">긴급 전송 중지</text>

              {/* 수탁기관 */}
              <Arrow x1={295} y1={62} x2={340} y2={62} color={C.red} />
              <ModuleBox x={345} y={40} w={120} h={44} label="수탁기관" sub="즉시 대응" color={C.green} />

              {/* 지연 시 위험 */}
              <Arrow x1={235} y1={92} x2={235} y2={115} color={C.amber} />
              <AlertBox x={100} y={120} w={280} h={34} label="15분 초과 시" sub="침해 확산 → 이용자 추가 피해 → VASP 배상 책임 증가" color={C.red} />

              {/* 계약 필수 조항 */}
              <rect x={60} y={170} width={360} height={40} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={0.5} />
              <text x={240} y={188} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>계약 필수 조항</text>
              <text x={240} y={202} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">긴급 전송 중지 요청권 + 응답 시간 SLA + 미이행 시 위약 조항</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
