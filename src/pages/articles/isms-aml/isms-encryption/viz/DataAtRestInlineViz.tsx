import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  col: '#6366f1',
  fde: '#0ea5e9',
  safe: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: '컬럼 암호화 흐름 — 앱이 필드 단위로 암복호화',
    body: '평문 데이터가 앱 레이어에서 AES-256으로 암호화된 뒤 DB에 저장. 조회 시 앱이 복호화 수행. DBA는 암호문만 볼 수 있어 내부자 위협 차단.',
  },
  {
    label: 'FDE 흐름 — OS가 디스크 I/O를 투명하게 암복호화',
    body: 'OS 블록 디바이스 레이어에서 모든 읽기/쓰기를 암복호화. 앱·DB 변경 불필요. 디스크가 물리적으로 탈취되면 키 없이 읽을 수 없음. 단, OS 부팅 후 마운트 상태에선 평문 접근 가능.',
  },
  {
    label: '실무: 컬럼 + FDE 병행 — 물리적·논리적 모두 방어',
    body: 'FDE로 물리적 탈취를 차단하고 컬럼 암호화로 내부 접근을 통제. AES-256(2¹²⁸ 이상 조합) 무차별 대입 불가. 국내 법령은 주민번호·여권번호·바이오 정보에 AES-128 이상 의무.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#dar-inline-arrow)" />
  );
}

export default function DataAtRestInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dar-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 컬럼 암호화 흐름 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">컬럼 단위 암호화 흐름</text>

              {/* 저장 흐름 */}
              <text x={240} y={36} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.col}>저장 (Write)</text>

              <DataBox x={15} y={44} w={80} h={28} label="평문 데이터" color={C.danger} />
              <Arrow x1={95} y1={58} x2={118} y2={58} color={C.col} />
              <ActionBox x={120} y={42} w={100} h={32} label="앱: AES-256" sub="암호화 수행" color={C.col} />
              <Arrow x1={220} y1={58} x2={243} y2={58} color={C.col} />
              <DataBox x={245} y={44} w={80} h={28} label="암호문" color={C.safe} />
              <Arrow x1={325} y1={58} x2={348} y2={58} color={C.safe} />
              <ModuleBox x={350} y={36} w={110} h={44} label="DB 저장" sub="DBA는 암호문만" color={C.safe} />

              {/* 흐르는 점 - 저장 */}
              <motion.circle r={3} fill={C.col} opacity={0.5}
                initial={{ cx: 55 }} animate={{ cx: 405 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={58} />

              {/* 구분선 */}
              <line x1={15} y1={90} x2={465} y2={90} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 조회 흐름 */}
              <text x={240} y={110} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.col}>조회 (Read)</text>

              <ModuleBox x={15} y={118} w={100} h={44} label="DB" sub="암호문 반환" color={C.safe} />
              <Arrow x1={115} y1={140} x2={138} y2={140} color={C.col} />
              <ActionBox x={140} y={122} w={100} h={36} label="앱: AES-256" sub="복호화 수행" color={C.col} />
              <Arrow x1={240} y1={140} x2={263} y2={140} color={C.col} />
              <DataBox x={265} y={126} w={80} h={28} label="평문 데이터" color={C.danger} />
              <Arrow x1={345} y1={140} x2={368} y2={140} color={C.safe} />
              <StatusBox x={370} y={118} w={95} h={44} label="이용자 응답" sub="정상 조회" color={C.safe} />

              {/* 핵심 포인트 */}
              <rect x={80} y={178} width={320} height={24} rx={6} fill="#6366f112" stroke={C.col} strokeWidth={1} />
              <text x={240} y={194} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.col}>앱 레이어가 복호화 → DBA·백업 모두 암호문 상태</text>
            </motion.g>
          )}

          {/* Step 1: FDE 흐름 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">FDE (Full Disk Encryption) 흐름</text>

              {/* 계층 구조 */}
              <ModuleBox x={15} y={30} w={100} h={44} label="앱 / DB" sub="변경 없음" color={C.fde} />
              <Arrow x1={115} y1={52} x2={138} y2={52} color={C.fde} />

              <ModuleBox x={140} y={30} w={100} h={44} label="파일 시스템" sub="일반 읽기/쓰기" color={C.fde} />
              <Arrow x1={240} y1={52} x2={263} y2={52} color={C.fde} />

              <ActionBox x={265} y={32} w={95} h={40} label="OS 블록 레이어" sub="투명 암복호화" color={C.col} />
              <Arrow x1={360} y1={52} x2={383} y2={52} color={C.safe} />

              <DataBox x={385} y={38} w={80} h={28} label="암호화 디스크" color={C.safe} />

              {/* 흐르는 점 */}
              <motion.circle r={3} fill={C.fde} opacity={0.5}
                initial={{ cx: 65 }} animate={{ cx: 425 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={52} />

              {/* 구분선 */}
              <line x1={15} y1={88} x2={465} y2={88} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 장점/한계 */}
              <text x={135} y={108} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>장점</text>
              <text x={365} y={108} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>한계</text>

              <StatusBox x={30} y={114} w={100} h={44} label="투명 암호화" sub="앱 변경 없음" color={C.safe} />
              <StatusBox x={140} y={114} w={110} h={44} label="물리 탈취 방어" sub="디스크 도난 무력화" color={C.safe} />

              <AlertBox x={290} y={116} w={160} h={40} label="마운트 후 평문 접근" sub="OS 부팅 시 모든 데이터 읽기 가능" color={C.danger} />

              {/* 결론 */}
              <rect x={80} y={175} width={320} height={24} rx={6} fill="#0ea5e912" stroke={C.fde} strokeWidth={1} />
              <text x={240} y={191} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fde}>논리적 접근 통제 없음 → 컬럼 암호화와 반드시 병행</text>
            </motion.g>
          )}

          {/* Step 2: 병행 전략 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">실무: 컬럼 + FDE 이중 방어</text>

              {/* 위협 모델 */}
              <AlertBox x={15} y={28} w={120} h={40} label="물리적 탈취" sub="백업 테이프·디스크" color={C.danger} />
              <Arrow x1={135} y1={48} x2={165} y2={48} color={C.fde} />
              <StatusBox x={167} y={24} w={130} h={48} label="FDE가 방어" sub="디스크 전체 암호화" color={C.fde} />

              <AlertBox x={15} y={84} w={120} h={40} label="논리적 접근" sub="DBA·SQL인젝션" color={C.danger} />
              <Arrow x1={135} y1={104} x2={165} y2={104} color={C.col} />
              <StatusBox x={167} y={80} w={130} h={48} label="컬럼이 방어" sub="필드별 암호화" color={C.col} />

              {/* 화살표 → 결합 */}
              <Arrow x1={297} y1={48} x2={328} y2={72} color={C.safe} />
              <Arrow x1={297} y1={104} x2={328} y2={82} color={C.safe} />

              <ModuleBox x={330} y={56} w={130} h={52} label="이중 방어 완성" sub="물리+논리 모두 차단" color={C.safe} />

              {/* 구분선 */}
              <line x1={15} y1={140} x2={465} y2={140} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* AES 강도 */}
              <DataBox x={30} y={152} w={130} h={28} label="AES-256 (대칭키)" color={C.col} />
              <text x={95} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">키 길이 256비트 = 무차별 대입 불가</text>

              <rect x={200} y={150} width={260} height={30} rx={6} fill="#10b98112" stroke={C.safe} strokeWidth={1} />
              <text x={330} y={169} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>법령: 주민번호·여권번호·바이오 → AES-128 이상 의무</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
