import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#6366f1', green: '#10b981', amber: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: '1단계 — 위험 식별', body: '고객·상품·지역·채널 4개 범주에서 ML/TF 위험 요소를 찾아낸다.' },
  { label: '2단계 — 위험 분석', body: '발생 가능성(1~5) x 영향도(1~5) = 위험 점수 → 고/중/저 등급 산출.' },
  { label: '3단계 — 위험 평가', body: '고유위험 - 통제효과 = 잔여위험. 수용 가능 수준인지 경영진이 판단.' },
  { label: '4단계 — 지속 평가', body: '정기(연 1회) + 수시(법규 변경, 신상품) 재평가로 환경 변화 반영.' },
  { label: '위험 매트릭스', body: '4단계 결과를 매트릭스로 문서화 — 위험 요소별 점수·통제·잔여위험 기록.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ra-arrow)" />;
}

export default function RiskAssessmentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ra-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>위험 식별 — 4대 범주</text>

              {/* Customer Risk */}
              <DataBox x={20} y={32} w={100} h={36} label="고객 위험" sub="Customer" color={C.red} />
              <rect x={20} y={78} width={100} height={46} rx={4} fill={`${C.red}06`} stroke={C.red} strokeWidth={0.4} />
              <text x={70} y={93} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">PEP, 셸컴퍼니</text>
              <text x={70} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">제재국 국적자</text>
              <text x={70} y={119} textAnchor="middle" fontSize={7} fill={C.red}>실소유자 불명 = 최고위험</text>

              {/* Product Risk */}
              <DataBox x={135} y={32} w={100} h={36} label="상품 위험" sub="Product" color={C.amber} />
              <rect x={135} y={78} width={100} height={46} rx={4} fill={`${C.amber}06`} stroke={C.amber} strokeWidth={0.4} />
              <text x={185} y={93} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">프라이버시 코인</text>
              <text x={185} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">크로스체인 브릿지</text>
              <text x={185} y={119} textAnchor="middle" fontSize={7} fill={C.amber}>신규 상품 → 초기 고위험</text>

              {/* Geographic Risk */}
              <DataBox x={250} y={32} w={100} h={36} label="지역 위험" sub="Geographic" color={C.blue} />
              <rect x={250} y={78} width={100} height={46} rx={4} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.4} />
              <text x={300} y={93} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이란, 북한</text>
              <text x={300} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FATF 회색목록</text>
              <text x={300} y={119} textAnchor="middle" fontSize={7} fill={C.blue}>대응조치 촉구 국가</text>

              {/* Channel Risk */}
              <DataBox x={365} y={32} w={100} h={36} label="채널 위험" sub="Channel" color={C.green} />
              <rect x={365} y={78} width={100} height={46} rx={4} fill={`${C.green}06`} stroke={C.green} strokeWidth={0.4} />
              <text x={415} y={93} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비대면 서비스</text>
              <text x={415} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">제3자 입금</text>
              <text x={415} y={119} textAnchor="middle" fontSize={7} fill={C.green}>VASP = 구조적 고위험</text>

              {/* Bottom flow arrow */}
              <Arrow x1={70} y1={132} x2={70} y2={150} color={C.red} />
              <Arrow x1={185} y1={132} x2={185} y2={150} color={C.amber} />
              <Arrow x1={300} y1={132} x2={300} y2={150} color={C.blue} />
              <Arrow x1={415} y1={132} x2={415} y2={150} color={C.green} />
              <rect x={40} y={150} width={400} height={26} rx={6} fill={`${C.blue}08`} stroke={C.blue} strokeWidth={0.5} />
              <text x={240} y={167} textAnchor="middle" fontSize={9} fill={C.blue}>
                4개 범주를 축으로 위험 요소를 전수 식별
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.amber}>위험 분석 — 점수 산출</text>

              {/* Likelihood axis */}
              <text x={30} y={50} fontSize={9} fontWeight={600} fill={C.blue}>발생 가능성</text>
              <text x={30} y={65} fontSize={8} fill="var(--muted-foreground)">Likelihood</text>
              {[1,2,3,4,5].map(n => (
                <g key={`l${n}`}>
                  <rect x={30 + (n-1)*25} y={75} width={20} height={16} rx={3}
                    fill={n >= 4 ? `${C.red}20` : `${C.blue}12`} stroke={n >= 4 ? C.red : C.blue} strokeWidth={0.5} />
                  <text x={40 + (n-1)*25} y={87} textAnchor="middle" fontSize={9} fill={n >= 4 ? C.red : C.blue}>{n}</text>
                </g>
              ))}

              {/* Impact axis */}
              <text x={200} y={50} fontSize={9} fontWeight={600} fill={C.amber}>영향도</text>
              <text x={200} y={65} fontSize={8} fill="var(--muted-foreground)">Impact</text>
              {[1,2,3,4,5].map(n => (
                <g key={`i${n}`}>
                  <rect x={200 + (n-1)*25} y={75} width={20} height={16} rx={3}
                    fill={n >= 4 ? `${C.red}20` : `${C.amber}12`} stroke={n >= 4 ? C.red : C.amber} strokeWidth={0.5} />
                  <text x={210 + (n-1)*25} y={87} textAnchor="middle" fontSize={9} fill={n >= 4 ? C.red : C.amber}>{n}</text>
                </g>
              ))}

              {/* Multiply sign */}
              <text x={170} y={87} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">x</text>

              {/* Formula */}
              <rect x={370} y={68} width={90} height={26} rx={6} fill={`${C.red}10`} stroke={C.red} strokeWidth={0.8} />
              <text x={415} y={86} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>= 위험 점수</text>
              <text x={355} y={85} fontSize={12} fontWeight={700} fill="var(--foreground)">=</text>

              {/* Risk grades */}
              <rect x={30} y={110} width={130} height={30} rx={5} fill={`${C.green}10`} stroke={C.green} strokeWidth={0.6} />
              <text x={95} y={128} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>1~8: 저위험</text>

              <rect x={175} y={110} width={130} height={30} rx={5} fill={`${C.amber}10`} stroke={C.amber} strokeWidth={0.6} />
              <text x={240} y={128} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.amber}>9~15: 중위험</text>

              <rect x={320} y={110} width={130} height={30} rx={5} fill={`${C.red}10`} stroke={C.red} strokeWidth={0.6} />
              <text x={385} y={128} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>16~25: 고위험</text>

              {/* Example */}
              <rect x={60} y={155} width={360} height={40} rx={6} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.4} />
              <text x={240} y={172} textAnchor="middle" fontSize={8.5} fill={C.blue}>
                예: PEP 고객 — 가능성 3 x 영향도 5 = 15점 (고위험)
              </text>
              <text x={240} y={186} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                복수 평가자 독립 채점 + 합의(calibration)로 주관성 최소화
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.green}>위험 평가 — 잔여위험 산출</text>

              {/* Inherent Risk */}
              <ModuleBox x={30} y={35} w={120} h={46} label="고유위험" sub="Inherent Risk" color={C.red} />
              <text x={90} y={100} textAnchor="middle" fontSize={9} fill={C.red} fontWeight={600}>20점</text>
              <text x={90} y={113} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">통제 0 가정</text>

              {/* Minus sign */}
              <text x={175} y={62} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">-</text>

              {/* Control Effectiveness */}
              <ModuleBox x={200} y={35} w={120} h={46} label="통제효과" sub="Control Effect" color={C.green} />
              <text x={260} y={100} textAnchor="middle" fontSize={9} fill={C.green} fontWeight={600}>-15점</text>
              <text x={260} y={113} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">거래 전면 차단</text>

              {/* Equals sign */}
              <text x={345} y={62} textAnchor="middle" fontSize={18} fontWeight={700} fill="var(--foreground)">=</text>

              {/* Residual Risk */}
              <ModuleBox x={370} y={35} w={100} h={46} label="잔여위험" sub="Residual Risk" color={C.blue} />
              <text x={420} y={100} textAnchor="middle" fontSize={9} fill={C.blue} fontWeight={600}>5점 (저)</text>

              {/* Flow arrows */}
              <Arrow x1={150} y1={58} x2={190} y2={58} color="var(--muted-foreground)" />
              <Arrow x1={320} y1={58} x2={362} y2={58} color="var(--muted-foreground)" />

              {/* Example: OTC */}
              <rect x={30} y={130} width={210} height={36} rx={5} fill={`${C.amber}08`} stroke={C.amber} strokeWidth={0.5} />
              <text x={135} y={147} textAnchor="middle" fontSize={8.5} fill={C.amber}>
                OTC: 고유 16점 - 대면확인(6점) = 잔여 10점(중)
              </text>
              <text x={135} y={160} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                통제가 약하면 잔여위험 높음
              </text>

              {/* Risk appetite decision */}
              <rect x={260} y={130} width={200} height={36} rx={5} fill={`${C.red}08`} stroke={C.red} strokeWidth={0.5} />
              <text x={360} y={147} textAnchor="middle" fontSize={8.5} fill={C.red}>
                잔여위험 &gt; 수용 수준?
              </text>
              <text x={360} y={160} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                → 추가 통제 or 서비스 중단
              </text>

              <Arrow x1={240} y1={166} x2={260} y2={166} color={C.red} />

              <rect x={100} y={180} width={280} height={24} rx={4} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.4} strokeDasharray="3,3" />
              <text x={240} y={196} textAnchor="middle" fontSize={8} fill={C.blue}>
                경영진이 risk appetite 이내인지 최종 판단
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.amber}>지속 평가 — 환경 변화 반영</text>

              {/* Timeline */}
              <line x1={50} y1={60} x2={430} y2={60} stroke="var(--border)" strokeWidth={1} />

              {/* Annual assessment */}
              <circle cx={120} cy={60} r={6} fill={C.blue} />
              <text x={120} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.blue}>정기</text>
              <rect x={70} y={75} width={100} height={40} rx={5} fill={`${C.blue}08`} stroke={C.blue} strokeWidth={0.5} />
              <text x={120} y={91} textAnchor="middle" fontSize={8} fill={C.blue}>연 1회 이상</text>
              <text x={120} y={104} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">회계연도·감사 연동</text>

              {/* Ad-hoc triggers */}
              <circle cx={260} cy={60} r={6} fill={C.red} />
              <text x={260} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>수시</text>
              <rect x={200} y={75} width={120} height={40} rx={5} fill={`${C.red}08`} stroke={C.red} strokeWidth={0.5} />
              <text x={260} y={91} textAnchor="middle" fontSize={8} fill={C.red}>즉시 재평가</text>
              <text x={260} y={104} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">법규·신상품·사고 발생</text>

              {/* Cycle arrow (loop) */}
              <circle cx={390} cy={60} r={6} fill={C.green} />
              <text x={390} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>갱신</text>
              <rect x={340} y={75} width={100} height={40} rx={5} fill={`${C.green}08`} stroke={C.green} strokeWidth={0.5} />
              <text x={390} y={91} textAnchor="middle" fontSize={8} fill={C.green}>매트릭스 갱신</text>
              <text x={390} y={104} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">전제 변경 여부 확인</text>

              {/* Trigger examples */}
              <rect x={40} y={130} width={400} height={50} rx={6} fill={`${C.amber}06`} stroke={C.amber} strokeWidth={0.4} />
              <text x={240} y={148} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>수시 평가 트리거 예시</text>
              <text x={140} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">크로스체인 브릿지 출현</text>
              <text x={280} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">NFT 유형 등장</text>
              <text x={400} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Travel Rule 확대</text>

              {/* Loop back arrow */}
              <path d="M 430 60 Q 450 60 450 30 Q 450 10 240 10 Q 50 10 50 30 Q 50 50 50 60" stroke={C.green} strokeWidth={0.8} fill="none" markerEnd="url(#ra-arrow)" />
              <text x={240} y={200} textAnchor="middle" fontSize={8} fill={C.green}>위험평가는 1회가 아닌 순환 프로세스</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>위험평가 매트릭스</text>

              {/* Matrix header */}
              <rect x={15} y={30} width={450} height={20} rx={3} fill={`${C.blue}12`} />
              <text x={50} y={44} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.blue}>위험 요소</text>
              <text x={120} y={44} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.blue}>가능성</text>
              <text x={170} y={44} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.blue}>영향도</text>
              <text x={225} y={44} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.blue}>고유위험</text>
              <text x={300} y={44} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.blue}>통제수단</text>
              <text x={385} y={44} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.blue}>잔여위험</text>

              {/* Row 1 - PEP */}
              <rect x={15} y={52} width={450} height={28} rx={0} fill={`${C.red}04`} />
              <text x={50} y={70} textAnchor="middle" fontSize={8} fill="var(--foreground)">PEP 고객</text>
              <text x={120} y={70} textAnchor="middle" fontSize={9} fill={C.amber}>3</text>
              <text x={170} y={70} textAnchor="middle" fontSize={9} fill={C.red}>5</text>
              <rect x={205} y={60} width={40} height={16} rx={3} fill={`${C.red}15`} stroke={C.red} strokeWidth={0.5} />
              <text x={225} y={72} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>15</text>
              <text x={300} y={70} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">EDD+경영진승인</text>
              <rect x={365} y={60} width={40} height={16} rx={3} fill={`${C.green}15`} stroke={C.green} strokeWidth={0.5} />
              <text x={385} y={72} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>8</text>

              {/* Row 2 - Privacy coin */}
              <rect x={15} y={82} width={450} height={28} rx={0} fill="transparent" />
              <text x={50} y={100} textAnchor="middle" fontSize={8} fill="var(--foreground)">프라이버시코인</text>
              <text x={120} y={100} textAnchor="middle" fontSize={9} fill={C.red}>4</text>
              <text x={170} y={100} textAnchor="middle" fontSize={9} fill={C.red}>4</text>
              <rect x={205} y={90} width={40} height={16} rx={3} fill={`${C.red}15`} stroke={C.red} strokeWidth={0.5} />
              <text x={225} y={102} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>16</text>
              <text x={300} y={100} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">취급 금지</text>
              <rect x={365} y={90} width={40} height={16} rx={3} fill={`${C.green}15`} stroke={C.green} strokeWidth={0.5} />
              <text x={385} y={102} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>4</text>

              {/* Row 3 - Non-face-to-face */}
              <rect x={15} y={112} width={450} height={28} rx={0} fill={`${C.amber}04`} />
              <text x={50} y={130} textAnchor="middle" fontSize={8} fill="var(--foreground)">비대면 가입</text>
              <text x={120} y={130} textAnchor="middle" fontSize={9} fill={C.amber}>4</text>
              <text x={170} y={130} textAnchor="middle" fontSize={9} fill={C.amber}>3</text>
              <rect x={205} y={120} width={40} height={16} rx={3} fill={`${C.amber}15`} stroke={C.amber} strokeWidth={0.5} />
              <text x={225} y={132} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.amber}>12</text>
              <text x={300} y={130} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">eKYC+실명계좌</text>
              <rect x={365} y={120} width={40} height={16} rx={3} fill={`${C.green}15`} stroke={C.green} strokeWidth={0.5} />
              <text x={385} y={132} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>7</text>

              {/* Arrows showing reduction */}
              <Arrow x1={245} y1={68} x2={360} y2={68} color={C.green} />
              <Arrow x1={245} y1={98} x2={360} y2={98} color={C.green} />
              <Arrow x1={245} y1={128} x2={360} y2={128} color={C.green} />

              {/* Legend */}
              <rect x={15} y={155} width={450} height={30} rx={5} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.4} />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill={C.blue}>
                통제가 강할수록 고유위험 → 잔여위험 감소폭이 큼 (문서화 필수)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
