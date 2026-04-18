import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, StatusBox, AlertBox, ModuleBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '근절: 악성코드 제거 + 백도어 확인',
    body: '안티바이러스 + 수동 분석 병행. 레지스트리·크론탭·서비스 목록 점검. 파일 무결성을 기준 해시값(baseline)과 비교하여 변조 확인.',
  },
  {
    label: '복구: 클린 복원 → 단계별 검증 → 강화 모니터링',
    body: '검증된 백업에서 복원(감염 시스템 위 패치만 적용은 위험). DB 무결성·기능 테스트·API 연동 순차 확인. 복구 후 최소 2주 강화 모니터링.',
  },
  {
    label: '사후 보고서: 타임라인 + 원인 + 대응 평가',
    body: '분 단위 타임라인, 표면/근본 원인 분석, 피해 규모, 잘한 점과 개선점을 기록. 재발방지의 기준선이 된다.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ir-er-arrow)" />;
}

export default function EradicationRecoveryInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ir-er-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertBox x={170} y={5} w={140} h={26} label="근절 (Eradication)" sub="흔적 완전 제거" color={C.red} />
              <Arrow x1={200} y1={33} x2={80} y2={55} color={C.red} />
              <Arrow x1={280} y1={33} x2={400} y2={55} color={C.amber} />
              <ActionBox x={15} y={56} w={130} h={34} label="악성코드 제거" sub="AV + 수동 분석" color={C.red} />
              <ActionBox x={335} y={56} w={130} h={34} label="백도어 확인" sub="웹셸·SSH·계정" color={C.amber} />
              <Arrow x1={80} y1={92} x2={170} y2={112} color={C.red} />
              <Arrow x1={400} y1={92} x2={310} y2={112} color={C.amber} />
              <DataBox x={140} y={112} w={200} h={32} label="파일 무결성 비교" sub="baseline hash vs 현재 hash" color={C.blue} />
              <Arrow x1={240} y1={146} x2={240} y2={160} color={C.blue} />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">제로데이는 WAF 규칙 추가 + 기능 비활성화로 임시 방어</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={10} y={15} w={100} h={30} label="클린 복원" sub="백업 이미지" color={C.green} />
              <Arrow x1={112} y1={30} x2={128} y2={30} color={C.green} />
              <ActionBox x={130} y={15} w={100} h={30} label="DB 검증" sub="테이블·레코드" color={C.amber} />
              <Arrow x1={232} y1={30} x2={248} y2={30} color={C.amber} />
              <ActionBox x={250} y={15} w={100} h={30} label="기능 테스트" sub="앱·API 연동" color={C.blue} />
              <Arrow x1={352} y1={30} x2={368} y2={30} color={C.blue} />
              <ActionBox x={370} y={15} w={100} h={30} label="서비스 재개" sub="모니터링 강화" color={C.green} />

              <StatusBox x={140} y={65} w={200} h={36} label="강화 모니터링 기간" sub="최소 2주 — 재공격 감시" color={C.red} progress={0.15} />
              <AlertBox x={100} y={115} w={280} h={30} label="감염 시스템 위 패치만 적용은 위험" sub="잔여 악성코드 가능성" color={C.red} />
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">클린 복원이 가장 안전한 방법</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={150} y={5} w={180} h={28} label="사후 보고서 (Post-Incident)" sub="" color={C.blue} />
              <Arrow x1={200} y1={35} x2={70} y2={55} color={C.blue} />
              <Arrow x1={240} y1={35} x2={240} y2={55} color={C.blue} />
              <Arrow x1={280} y1={35} x2={410} y2={55} color={C.blue} />

              <DataBox x={10} y={56} w={120} h={34} label="타임라인" sub="분 단위 기록" color={C.amber} />
              <DataBox x={180} y={56} w={120} h={34} label="원인 분석" sub="표면 + 근본 원인" color={C.red} />
              <DataBox x={350} y={56} w={120} h={34} label="피해 규모" sub="건수·시스템·손실" color={C.blue} />

              <Arrow x1={240} y1={92} x2={240} y2={112} color={C.red} />
              <rect x={100} y={114} width={280} height={36} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={240} y={131} textAnchor="middle" fontSize={9} fill="var(--foreground)">대응 평가: 잘한 점 + 개선점</text>
              <text x={240} y={143} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">다음 사고 대응의 기준선(baseline)</text>

              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">솔직한 기록이 재발방지의 출발점</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
