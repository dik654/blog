import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: '1단계: 자산 분류 체계',
    body: '조직이 보유한 모든 IT 자원, 물리 자원, 데이터를 유형별로 분류. VASP는 약 14종의 자산 유형을 식별하며, 지갑전용PC와 암호키가 고유 자산.',
  },
  {
    label: '2단계: CIA 기반 보안등급 산정',
    body: '기밀성(C) + 무결성(I) + 가용성(A)을 1~3점으로 평가. 평균 2.0 초과 = 비밀, 1.0~2.0 = 대외비, 1.0 이하 = 일반.',
  },
  {
    label: '3단계: 위험평가 5단계',
    body: '자산 식별 →중요도 산정 →위협 수집 →위험 평가(자산 중요도 x 발생 가능성) →DoA 승인. 위험값이 DoA 이상이면 미수용 위험.',
  },
  {
    label: '4단계: 보호대책 선정',
    body: '미수용 위험에 대해 4가지 전략 적용: 감소(통제 추가), 회피(활동 중단), 전가(보험/외주), 수용(경영진 승인). 비밀 등급 자산은 다중 전략 적용.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#ar-arrow)" />;
}

export default function AssetRiskViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ar-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: Asset Classification */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">VASP 자산 분류 (14종)</text>

              {/* Row 1: IT Assets */}
              <DataBox x={15} y={30} w={65} h={28} label="서버" color={C.blue} />
              <DataBox x={90} y={30} w={65} h={28} label="DBMS" color={C.blue} />
              <DataBox x={165} y={30} w={70} h={28} label="네트워크" color={C.blue} />
              <DataBox x={245} y={30} w={70} h={28} label="보안장비" color={C.blue} />
              <DataBox x={325} y={30} w={65} h={28} label="PC/단말" color={C.blue} />
              <DataBox x={400} y={30} w={70} h={28} label="클라우드" color={C.blue} />

              {/* Row 2: Data Assets */}
              <DataBox x={15} y={70} w={75} h={28} label="응용프로그램" color={C.green} />
              <DataBox x={100} y={70} w={70} h={28} label="소스코드" color={C.green} />
              <DataBox x={180} y={70} w={55} h={28} label="문서" color={C.green} />
              <DataBox x={245} y={70} w={65} h={28} label="CCTV" color={C.green} />
              <DataBox x={320} y={70} w={75} h={28} label="출입시스템" color={C.green} />

              {/* Row 3: VASP-specific (highlighted) */}
              <motion.rect x={15} y={115} width={450} height={48} rx={8} fill={`${C.red}08`} stroke={C.red} strokeWidth={0.8} strokeDasharray="4 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.red}>VASP 고유 자산</text>

              <ModuleBox x={25} y={122} w={120} h={36} label="지갑전용PC" sub="에어갭 + 최고 보안" color={C.red} />
              <ModuleBox x={165} y={122} w={120} h={36} label="암호키" sub="개인키 = 자산 자체" color={C.red} />
              <ModuleBox x={305} y={122} w={120} h={36} label="개인정보파일" sub="KYC + 실명 DB" color={C.amber} />

              {/* Scale indicator */}
              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">자산 분류 →보안등급 산정 →위험평가 →보호대책 선정</text>
              <motion.rect x={100} y={196} width={280} height={3} rx={1.5} fill={C.blue}
                initial={{ width: 0 }} animate={{ width: 280 }} transition={{ duration: 1 }} />
            </motion.g>
          )}

          {/* Step 1: CIA Scoring */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">CIA 평가 →보안등급</text>

              {/* CIA headers */}
              <ActionBox x={30} y={30} w={120} h={36} label="기밀성 (C)" sub="유출 시 피해" color={C.blue} />
              <ActionBox x={180} y={30} w={120} h={36} label="무결성 (I)" sub="변조 시 영향" color={C.green} />
              <ActionBox x={330} y={30} w={120} h={36} label="가용성 (A)" sub="중단 시 영향" color={C.amber} />

              {/* Example: Cold wallet key */}
              <text x={240} y={88} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">예시: 콜드월렛 개인키</text>

              {/* Score bars */}
              <rect x={60} y={98} width={60} height={18} rx={4} fill={`${C.blue}20`} stroke={C.blue} strokeWidth={0.8} />
              <text x={90} y={111} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>C = 3</text>

              <text x={155} y={111} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">+</text>

              <rect x={180} y={98} width={60} height={18} rx={4} fill={`${C.green}20`} stroke={C.green} strokeWidth={0.8} />
              <text x={210} y={111} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>I = 3</text>

              <text x={275} y={111} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">+</text>

              <rect x={300} y={98} width={60} height={18} rx={4} fill={`${C.amber}20`} stroke={C.amber} strokeWidth={0.8} />
              <text x={330} y={111} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>A = 2</text>

              {/* Result */}
              <Arrow x1={240} y1={118} x2={240} y2={135} />
              <text x={240} y={148} textAnchor="middle" fontSize={11} fill="var(--foreground)">평균 = (3+3+2) / 3 = 2.67</text>

              {/* Grade scale */}
              <rect x={60} y={165} width={120} height={22} rx={4} fill={`${C.red}15`} stroke={C.red} strokeWidth={1} />
              <text x={120} y={180} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.red}>비밀 (2.0 초과)</text>

              <rect x={190} y={165} width={120} height={22} rx={4} fill={`${C.amber}15`} stroke={C.amber} strokeWidth={0.8} />
              <text x={250} y={180} textAnchor="middle" fontSize={9} fill={C.amber}>대외비 (1.0~2.0)</text>

              <rect x={320} y={165} width={100} height={22} rx={4} fill="var(--muted)" stroke="var(--border)" strokeWidth={0.8} />
              <text x={370} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">일반 (1.0 이하)</text>

              {/* Arrow to selected grade */}
              <motion.circle cx={120} cy={195} r={3} fill={C.red}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
              <motion.text x={120} y={208} textAnchor="middle" fontSize={8} fill={C.red} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                2.67 →비밀 등급
              </motion.text>
            </motion.g>
          )}

          {/* Step 2: Risk Assessment 5 Steps */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 5 steps in pipeline */}
              <ActionBox x={10} y={20} w={82} h={40} label="1. 자산 식별" sub="대장 등록" color={C.blue} />
              <ActionBox x={102} y={20} w={82} h={40} label="2. 중요도" sub="CIA 수치화" color={C.blue} />
              <ActionBox x={194} y={20} w={82} h={40} label="3. 위협 수집" sub="KISA/OWASP" color={C.green} />
              <ActionBox x={286} y={20} w={82} h={40} label="4. 위험 평가" sub="H/M/L 판정" color={C.amber} />
              <ActionBox x={378} y={20} w={82} h={40} label="5. DoA 승인" sub="CISO 결재" color={C.red} />

              <Arrow x1={92} y1={40} x2={100} y2={40} />
              <Arrow x1={184} y1={40} x2={192} y2={40} />
              <Arrow x1={276} y1={40} x2={284} y2={40} />
              <Arrow x1={368} y1={40} x2={376} y2={40} />

              {/* Risk formula */}
              <rect x={60} y={80} width={360} height={30} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={1} />
              <text x={240} y={100} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.amber}>
                위험값 = 자산 중요도 x 발생 가능성 (H=3, M=2, L=1)
              </text>

              {/* DoA threshold */}
              <Arrow x1={240} y1={112} x2={240} y2={128} />

              <rect x={80} y={130} width={150} height={40} rx={8} fill={`${C.green}10`} stroke={C.green} strokeWidth={0.8} />
              <text x={155} y={148} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>DoA 이하</text>
              <text x={155} y={162} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">잔여위험 수용 (경영진 서명)</text>

              <rect x={250} y={130} width={150} height={40} rx={8} fill={`${C.red}10`} stroke={C.red} strokeWidth={0.8} />
              <text x={325} y={148} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>DoA 초과</text>
              <text x={325} y={162} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">미수용 위험 →보호대책 필수</text>

              {/* DoA label */}
              <motion.text x={240} y={193} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                DoA = Degree of Assurance (수용 가능 위험 수준, 예: 4점)
              </motion.text>
            </motion.g>
          )}

          {/* Step 3: Protection Strategy Selection */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertBox x={160} y={10} w={160} h={36} label="미수용 위험" sub="DoA 초과 항목" color={C.red} />

              <Arrow x1={200} y1={46} x2={100} y2={70} />
              <Arrow x1={230} y1={46} x2={200} y2={70} />
              <Arrow x1={270} y1={46} x2={310} y2={70} />
              <Arrow x1={300} y1={46} x2={400} y2={70} />

              {/* 4 strategies */}
              <ActionBox x={45} y={75} w={110} h={42} label="감소 (Mitigation)" sub="통제 추가" color={C.blue} />
              <ActionBox x={170} y={75} w={110} h={42} label="회피 (Avoidance)" sub="활동 중단" color={C.green} />
              <ActionBox x={295} y={75} w={110} h={42} label="전가 (Transfer)" sub="보험/외주" color={C.amber} />
              <ActionBox x={415} y={75} w={55} h={42} label="수용" sub="경영진 승인" color="var(--muted-foreground)" />

              {/* Example: Cold wallet */}
              <text x={240} y={140} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">예시: 콜드월렛 개인키 다중 보호</text>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <ModuleBox x={70} y={150} w={160} h={42} label="에어갭 PC + 멀티시그" sub="위험 감소" color={C.blue} />
                <text x={260} y={175} textAnchor="middle" fontSize={14} fill="var(--muted-foreground)">+</text>
                <ModuleBox x={280} y={150} w={130} h={42} label="사이버 보험" sub="위험 전가" color={C.amber} />
              </motion.g>

              {/* Output document */}
              <Arrow x1={240} y1={194} x2={240} y2={200} />
              <DataBox x={150} y={200} w={180} h={24} label="위험 처리 계획서 (RTP)" color={C.green} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
