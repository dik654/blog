import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '규칙 기반의 구조적 한계',
    body: '새 수법 미탐지(미탐 증가), 높은 오탐률(경보 피로), 규칙 폭증(유지보수 급증), 적응형 회피(임계값 역추정). AI는 고정 임계값이 아닌 맥락을 종합 판단.',
  },
  {
    label: 'ML 모델 — 비지도 + 지도 학습 조합',
    body: 'Isolation Forest / Autoencoder: 라벨 없이도 이상치 탐지(비지도). XGBoost / LightGBM: 과거 STR 데이터로 정밀도 향상(지도). GNN: 거래 네트워크의 구조적 패턴 학습.',
  },
  {
    label: '실시간 스코어링 파이프라인',
    body: '특성 추출(수백 개) → 모델 추론(100ms 이내) → 점수 매핑(0~100) → 경보 연동(심각도별 자동 배정). 모든 입출금 실시간 검사.',
  },
  {
    label: '모델 거버넌스 — 설명 가능성 + 검증',
    body: 'SHAP/LIME으로 판단 근거 설명. 성능 지표·데이터 드리프트·편향 검사 정기 수행. 원칙: AI는 근거 제공, 사람이 최종 판단.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ai-fds-arrow)" />;
}

export default function AiFdsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ai-fds-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Rule-based limitations */}
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>규칙 기반 FDS의 구조적 한계</text>

              <AlertBox x={15} y={30} w={105} h={40} label="새 수법 미탐지" sub="미탐(FN) 증가" color={C.red} />
              <AlertBox x={130} y={30} w={105} h={40} label="높은 오탐률" sub="경보 피로 유발" color={C.red} />
              <AlertBox x={245} y={30} w={105} h={40} label="규칙 폭증" sub="수백~수천 규칙" color={C.amber} />
              <AlertBox x={360} y={30} w={105} h={40} label="적응형 회피" sub="임계값 역추정" color={C.red} />

              {/* VS AI */}
              <Arrow x1={240} y1={74} x2={240} y2={96} color={C.blue} />
              <text x={260} y={88} fontSize={8} fill={C.blue}>AI로 극복</text>

              <ModuleBox x={130} y={100} w={220} h={48} label="AI 기반 FDS" sub="맥락(context) 종합 판단 — 고정 임계값 없음" color={C.green} />

              {/* Example */}
              <text x={80} y={175} textAnchor="end" fontSize={8} fill={C.red}>규칙: 999만 원 &lt; 1천만 원 → 통과</text>
              <text x={80} y={190} textAnchor="end" fontSize={8} fill={C.green}>AI: 999만 원 × 3회 + 신규 + 즉시 출금 → 경보</text>

              <DataBox x={180} y={165} w={200} h={30} label="맥락 분석이 핵심 차별점" color={C.green} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Unsupervised models */}
              <text x={120} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>비지도 학습</text>
              <ModuleBox x={20} y={28} w={100} h={40} label="Isolation Forest" sub="랜덤 분할·격리" color={C.blue} />
              <ModuleBox x={130} y={28} w={100} h={40} label="Autoencoder" sub="압축→복원 오류" color={C.blue} />
              <text x={120} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">라벨 불필요 — 이상 거래 극소수(0.01%) 환경에 적합</text>

              {/* Supervised models */}
              <text x={370} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>지도 학습</text>
              <ModuleBox x={310} y={28} w={120} h={40} label="XGBoost / LightGBM" sub="의사결정 트리 앙상블" color={C.amber} />
              <text x={370} y={86} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">과거 STR 데이터 학습 → 정밀도 향상</text>

              {/* GNN */}
              <Arrow x1={120} y1={100} x2={240} y2={115} color={C.blue} />
              <Arrow x1={370} y1={100} x2={240} y2={115} color={C.amber} />

              <ModuleBox x={170} y={115} w={140} h={44} label="GNN" sub="Graph Neural Network" color={C.green} />
              <text x={240} y={178} textAnchor="middle" fontSize={9} fill={C.green}>거래 네트워크에서 의심 커뮤니티 탐지</text>

              {/* Round-tripping example */}
              <circle cx={140} cy={195} r={10} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={140} y={199} textAnchor="middle" fontSize={7} fill={C.red}>A</text>
              <Arrow x1={152} y1={195} x2={195} y2={195} color={C.red} />
              <circle cx={210} cy={195} r={10} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={210} y={199} textAnchor="middle" fontSize={7} fill={C.red}>B</text>
              <Arrow x1={222} y1={195} x2={265} y2={195} color={C.red} />
              <circle cx={280} cy={195} r={10} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={280} y={199} textAnchor="middle" fontSize={7} fill={C.red}>C</text>
              <path d="M 288 188 C 320 170, 170 170, 133 188" fill="none" stroke={C.red} strokeWidth={0.8} strokeDasharray="3 2" markerEnd="url(#ai-fds-arrow)" />
              <text x={350} y={199} fontSize={8} fill="var(--muted-foreground)">순환 거래(Round-tripping)</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Scoring pipeline */}
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">실시간 스코어링 파이프라인</text>

              <ActionBox x={10} y={35} w={100} h={42} label="특성 추출" sub="수백 개 실시간 계산" color={C.blue} />
              <Arrow x1={112} y1={56} x2={128} y2={56} color={C.blue} />

              <ActionBox x={130} y={35} w={100} h={42} label="모델 추론" sub="latency < 100ms" color={C.amber} />
              <Arrow x1={232} y1={56} x2={248} y2={56} color={C.amber} />

              <ActionBox x={250} y={35} w={100} h={42} label="점수 매핑" sub="0~100 변환" color={C.green} />
              <Arrow x1={352} y1={56} x2={368} y2={56} color={C.green} />

              <ActionBox x={370} y={35} w={100} h={42} label="경보 연동" sub="자동 배정" color={C.red} />

              {/* Score thresholds */}
              <StatusBox x={60} y={100} w={110} h={42} label="높음 70~100" sub="계정 정지 + STR" color={C.red} progress={0.9} />
              <StatusBox x={185} y={100} w={110} h={42} label="중간 40~69" sub="모니터링 강화" color={C.amber} progress={0.55} />
              <StatusBox x={310} y={100} w={110} h={42} label="낮음 0~39" sub="정상 처리" color={C.green} progress={0.2} />

              {/* Feature examples */}
              <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">주요 특성(Feature) 예시</text>
              <DataBox x={30} y={178} w={85} h={24} label="거래 금액" color={C.blue} />
              <DataBox x={125} y={178} w={65} h={24} label="빈도" color={C.blue} />
              <DataBox x={200} y={178} w={70} h={24} label="시간대" color={C.amber} />
              <DataBox x={280} y={178} w={90} h={24} label="상대방 위험도" color={C.red} />
              <DataBox x={380} y={178} w={85} h={24} label="누적 패턴" color={C.amber} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Governance framework */}
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">AI 모델 거버넌스</text>

              {/* Core principle */}
              <DataBox x={140} y={28} w={200} h={30} label="AI = 근거 제공 / 사람 = 최종 판단" color={C.green} />

              {/* XAI methods */}
              <ModuleBox x={20} y={75} w={100} h={44} label="SHAP" sub="특성별 기여도 수치" color={C.blue} />
              <ModuleBox x={135} y={75} w={100} h={44} label="LIME" sub="로컬 근사 모델" color={C.blue} />
              <Arrow x1={70} y1={121} x2={140} y2={140} color={C.blue} />
              <Arrow x1={185} y1={121} x2={140} y2={140} color={C.blue} />
              <ActionBox x={80} y={140} w={120} h={30} label="판단 근거 설명" sub="규제 검사 대응" color={C.blue} />

              {/* Validation cycle */}
              <ModuleBox x={270} y={75} w={90} h={36} label="성능 지표" sub="월 1회" color={C.amber} />
              <ModuleBox x={375} y={75} w={90} h={36} label="드리프트 감지" sub="월 1회" color={C.amber} />
              <ModuleBox x={270} y={122} w={90} h={36} label="편향 검사" sub="반기 1회" color={C.red} />
              <ModuleBox x={375} y={122} w={90} h={36} label="모델 재학습" sub="연 1회+" color={C.green} />

              {/* Cycle arrows */}
              <Arrow x1={362} y1={93} x2={373} y2={93} color={C.amber} />
              <Arrow x1={362} y1={140} x2={373} y2={140} color={C.green} />

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">설명 불가능한 모델 = 규제 검사 부적격</text>
              <text x={240} y={200} textAnchor="middle" fontSize={8} fill={C.amber}>OFAC 제재 주소 직접 거래 → 자동 차단 허용 (유일한 예외)</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
