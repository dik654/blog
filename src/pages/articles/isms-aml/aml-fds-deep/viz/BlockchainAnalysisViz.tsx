import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '지갑 클러스터링 + 거래 그래프 추적',
    body: '클러스터링: 동일 소유자의 여러 주소를 하나의 그룹으로 묶는다(공통 입력 소유권 휴리스틱). 거래 그래프: 자금 이동 경로를 방향 그래프로 시각화하여 출처-목적지 추적.',
  },
  {
    label: '주소 라벨링 + 위험 점수 산정',
    body: '라벨링: 거래소·믹서·다크웹·OFAC 제재 주소를 태그하여 DB로 관리. 위험 점수: 0~100 자동 산정 → 임계값 초과 시 입금 보류·심층 조사 진행.',
  },
  {
    label: 'Travel Rule — VASP 간 정보 공유',
    body: '100만 원 이상 이전 시 송신인·수신인 정보를 VASP 간 전자 전송. 비호스팅 지갑(개인 지갑·DeFi)에는 미적용 — 우회 경로가 됨.',
  },
  {
    label: '분석의 한계 — DeFi·크로스체인·프라이버시',
    body: 'DeFi: 컨트랙트 내부 로직 복잡+KYC 없음. 크로스체인: 체인 간 주소 연결 단절. 프라이버시 코인: 거래 자체 암호화. L2: 오프체인 거래 개별 추적 곤란.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ba-arrow)" />;
}

export default function BlockchainAnalysisViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ba-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Clustering (left) */}
              <text x={120} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>지갑 클러스터링</text>

              {/* Addresses forming a cluster */}
              <circle cx={50} cy={55} r={16} fill="var(--card)" stroke={C.blue} strokeWidth={1} />
              <text x={50} y={59} textAnchor="middle" fontSize={8} fill={C.blue}>Addr 1</text>
              <circle cx={120} cy={40} r={16} fill="var(--card)" stroke={C.blue} strokeWidth={1} />
              <text x={120} y={44} textAnchor="middle" fontSize={8} fill={C.blue}>Addr 2</text>
              <circle cx={190} cy={55} r={16} fill="var(--card)" stroke={C.blue} strokeWidth={1} />
              <text x={190} y={59} textAnchor="middle" fontSize={8} fill={C.blue}>Addr 3</text>

              {/* Cluster outline */}
              <ellipse cx={120} cy={52} rx={100} ry={35} fill="none" stroke={C.blue} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={120} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">공통 입력 소유권 → 같은 소유자</text>

              {/* Graph tracing (right) */}
              <text x={370} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>거래 그래프 추적</text>

              {/* Directed graph */}
              <circle cx={290} cy={50} r={14} fill={C.red} opacity={0.15} stroke={C.red} strokeWidth={1} />
              <text x={290} y={54} textAnchor="middle" fontSize={8} fill={C.red}>출처</text>
              <Arrow x1={306} y1={50} x2={335} y2={50} color={C.amber} />
              <circle cx={350} cy={50} r={14} fill="var(--card)" stroke={C.amber} strokeWidth={1} />
              <text x={350} y={53} textAnchor="middle" fontSize={7} fill={C.amber}>1홉</text>
              <Arrow x1={366} y1={50} x2={395} y2={50} color={C.amber} />
              <circle cx={410} cy={50} r={14} fill="var(--card)" stroke={C.amber} strokeWidth={1} />
              <text x={410} y={53} textAnchor="middle" fontSize={7} fill={C.amber}>2홉</text>
              <Arrow x1={426} y1={50} x2={448} y2={50} color={C.green} />
              <circle cx={460} cy={50} r={14} fill={C.green} opacity={0.15} stroke={C.green} strokeWidth={1} />
              <text x={460} y={54} textAnchor="middle" fontSize={7} fill={C.green}>목적지</text>

              {/* Branch */}
              <Arrow x1={350} y1={66} x2={350} y2={88} color={C.amber} />
              <circle cx={350} cy={100} r={12} fill="var(--card)" stroke={C.red} strokeWidth={1} strokeDasharray="3 2" />
              <text x={350} y={104} textAnchor="middle" fontSize={7} fill={C.red}>믹서?</text>

              <text x={375} y={100} fontSize={8} fill="var(--muted-foreground)">3~5홉 추적 필요</text>

              {/* Bottom */}
              <DataBox x={80} y={130} w={320} h={34} label="클러스터링 정확도 = 분석 신뢰도" sub="CoinJoin은 공통 입력 소유권 휴리스틱을 의도적으로 무력화" color={C.amber} />
              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">홉이 깊을수록 관련성 약화 — 그러나 세탁은 3홉 이상 경유</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Labeling DB */}
              <text x={130} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>주소 라벨링</text>
              <ModuleBox x={15} y={28} w={70} h={30} label="거래소" sub="핫/콜드 월렛" color={C.blue} />
              <ModuleBox x={95} y={28} w={55} h={30} label="믹서" sub="" color={C.red} />
              <ModuleBox x={160} y={28} w={65} h={30} label="다크웹" sub="" color={C.red} />
              <Arrow x1={50} y1={60} x2={120} y2={78} color={C.blue} />
              <Arrow x1={122} y1={60} x2={120} y2={78} color={C.red} />
              <Arrow x1={192} y1={60} x2={120} y2={78} color={C.red} />
              <DataBox x={70} y={78} w={100} h={30} label="라벨링 DB" sub="수억 개 주소 태그" color={C.amber} />

              {/* Risk scoring */}
              <text x={370} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>위험 점수 산정</text>
              <StatusBox x={280} y={28} w={80} h={40} label="높음" sub="70~100" color={C.red} progress={0.9} />
              <StatusBox x={370} y={28} w={80} h={40} label="중간" sub="40~69" color={C.amber} progress={0.55} />
              <StatusBox x={280} y={78} w={80} h={40} label="낮음" sub="0~39" color={C.green} progress={0.2} />

              {/* Actions */}
              <ActionBox x={370} y={80} w={90} h={30} label="높음 → 정지" sub="+STR 검토" color={C.red} />
              <ActionBox x={370} y={118} w={90} h={30} label="중간 → 모니터링" color={C.amber} />
              <ActionBox x={370} y={156} w={90} h={30} label="낮음 → 정상" color={C.green} />

              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">라벨링 DB 규모·갱신 속도가 분석 도구의 경쟁력을 결정</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Travel Rule flow */}
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">Travel Rule — VASP 간 정보 전달</text>

              <ModuleBox x={20} y={35} w={120} h={44} label="송신 VASP" sub="출금 요청 접수" color={C.blue} />
              <Arrow x1={142} y1={57} x2={178} y2={57} color={C.blue} />

              {/* Info transfer box */}
              <DataBox x={180} y={42} w={120} h={30} label="이름·주소·계정" sub="전자적 전송" color={C.amber} />
              <Arrow x1={302} y1={57} x2={338} y2={57} color={C.amber} />

              <ModuleBox x={340} y={35} w={120} h={44} label="수신 VASP" sub="수신인 정보 대조" color={C.green} />

              {/* Match / Mismatch */}
              <Arrow x1={400} y1={81} x2={340} y2={110} color={C.green} />
              <Arrow x1={400} y1={81} x2={460} y2={110} color={C.red} />
              <ActionBox x={285} y={110} w={110} h={30} label="일치 → 입금 승인" color={C.green} />
              <AlertBox x={420} y={110} w={55} h={30} label="불일치" sub="거부" color={C.red} />

              {/* Unhosted wallet bypass */}
              <AlertBox x={20} y={110} w={180} h={36} label="비호스팅 지갑(DeFi·개인)" sub="Travel Rule 미적용 → 우회 경로" color={C.red} />

              {/* threshold */}
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill={C.amber}>한국: 100만 원 이상 이전 시 적용 (특금법 시행령)</text>
              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">VASP 간 상호 검증으로 거래소 경유 세탁 난이도 크게 상승</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Limitations grid */}
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>블록체인 분석의 한계 영역</text>

              <AlertBox x={15} y={32} w={110} h={42} label="DeFi 프로토콜" sub="복잡 컨트랙트·KYC 없음" color={C.red} />
              <AlertBox x={135} y={32} w={110} h={42} label="크로스체인 브릿지" sub="주소 연결 단절" color={C.red} />
              <AlertBox x={255} y={32} w={110} h={42} label="프라이버시 코인" sub="거래 자체 암호화" color={C.red} />
              <AlertBox x={375} y={32} w={95} h={42} label="L2 / P2P" sub="오프체인·직접 거래" color={C.amber} />

              {/* Arrows to countermeasures */}
              <Arrow x1={70} y1={76} x2={70} y2={100} color={C.blue} />
              <Arrow x1={190} y1={76} x2={190} y2={100} color={C.blue} />
              <Arrow x1={310} y1={76} x2={310} y2={100} color={C.blue} />
              <Arrow x1={422} y1={76} x2={422} y2={100} color={C.blue} />

              <ActionBox x={15} y={102} w={110} h={36} label="컨트랙트 분석" sub="프로토콜별 디코딩" color={C.blue} />
              <ActionBox x={135} y={102} w={110} h={36} label="멀티체인 통합" sub="브릿지 모니터링" color={C.blue} />
              <ActionBox x={255} y={102} w={110} h={36} label="입출금 차단" sub="연구 수준 역추적" color={C.amber} />
              <ActionBox x={375} y={102} w={95} h={36} label="L2 인덱싱" sub="P2P 규제 강화" color={C.green} />

              {/* Best practice */}
              <DataBox x={100} y={160} w={280} h={34} label="2개 이상 분석 도구 병행 = 최선의 실무 관행" sub="단일 도구 의존 → 사각지대 발생" color={C.green} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
