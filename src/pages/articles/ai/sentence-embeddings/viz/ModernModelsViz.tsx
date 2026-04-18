import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, C } from './ModernModelsVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function ModernModelsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: E5 architecture */}
          {step === 0 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.e5}>
                E5: Task Prefix + Contrastive Learning
              </text>
              {/* Input with prefix */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={20} y={30} width={130} height={28} rx={6}
                  fill={C.e5 + '12'} stroke={C.e5} strokeWidth={1} />
                <text x={85} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.e5}>prefix</text>
                <text x={85} y={53} textAnchor="middle" fontSize={8} fill={C.e5}>"query: 맛집 추천"</text>
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, ...sp }}>
                <rect x={170} y={30} width={170} height={28} rx={6}
                  fill={C.e5 + '12'} stroke={C.e5} strokeWidth={1} />
                <text x={255} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.e5}>prefix</text>
                <text x={255} y={53} textAnchor="middle" fontSize={8} fill={C.e5}>"passage: 서울 강남 맛집..."</text>
              </motion.g>
              {/* Encoder */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                <ModuleBox x={120} y={70} w={200} h={40} label="BERT Encoder" sub="사전학습: CCPairs" color={C.e5} />
              </motion.g>
              {/* Training stages */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <ActionBox x={30} y={125} w={130} h={36} label="1단계: CCPairs" sub="대규모 비지도 대조학습" color={C.e5} />
                <ActionBox x={180} y={125} w={130} h={36} label="2단계: NLI+STS" sub="지도 파인튜닝" color={C.e5} />
                <DataBox x={330} y={128} w={120} h={30} label="E5 임베딩" sub="태스크 인식 벡터" color={C.e5} />
              </motion.g>
              {/* Prefix types */}
              <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}>
                <rect x={30} y={175} width={420} height={36} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                {['query:', 'passage:', 'classification:'].map((p, i) => (
                  <g key={p}>
                    <rect x={42 + i * 143} y={181} width={120} height={22} rx={4}
                      fill={C.e5 + '10'} stroke={C.e5} strokeWidth={0.5} />
                    <text x={102 + i * 143} y={196} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.e5}>
                      {p} {['검색 쿼리', '문서 패시지', '텍스트 분류'][i]}
                    </text>
                  </g>
                ))}
              </motion.g>
            </g>
          )}

          {/* Step 1: BGE */}
          {step === 1 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bge}>
                BGE: RetroMAE + Multi-stage Training
              </text>
              {/* RetroMAE pre-training */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={30} y={32} width={420} height={48} rx={6}
                  fill={C.bge + '06'} stroke={C.bge} strokeWidth={0.8} />
                <text x={240} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.bge}>
                  RetroMAE 사전학습
                </text>
                <text x={240} y={62} textAnchor="middle" fontSize={8} fill={C.bge}>
                  인코더: 15% 마스킹 → 디코더: 50~70% 마스킹으로 복원 — 강한 문장 표현 학습
                </text>
                <text x={240} y={74} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  디코더를 어렵게 만들어 인코더가 더 풍부한 표현을 만들도록 유도
                </text>
              </motion.g>
              {/* 2-stage fine-tuning */}
              {[
                { label: '1단계: 대규모 대조학습', desc: '약 2억 텍스트 쌍', y: 95 },
                { label: '2단계: 태스크별 파인튜닝', desc: '어려운 네거티브 마이닝', y: 140 },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.15 }}>
                  <ActionBox x={60} y={s.y} w={160} h={34} label={s.label} sub={s.desc} color={C.bge} />
                  {i === 0 && (
                    <line x1={140} y1={129} x2={140} y2={140}
                      stroke={C.bge} strokeWidth={1} opacity={0.4} />
                  )}
                </motion.g>
              ))}
              {/* Instruction */}
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}>
                <rect x={260} y={100} width={190} height={80} rx={6}
                  fill={C.bge + '08'} stroke={C.bge} strokeWidth={0.8} />
                <text x={355} y={118} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bge}>
                  Instruction Prefix
                </text>
                <text x={355} y={136} textAnchor="middle" fontSize={8} fill={C.bge}>
                  "Represent this sentence:"
                </text>
                <text x={355} y={152} textAnchor="middle" fontSize={8} fill={C.bge}>
                  "Represent this query:"
                </text>
                <text x={355} y={168} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  다국어 지원 (한국어 포함)
                </text>
              </motion.g>
              {/* Output */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}>
                <DataBox x={140} y={188} w={200} h={28} label="BGE 임베딩" sub="다국어 + 지시문 인식" color={C.bge} />
              </motion.g>
            </g>
          )}

          {/* Step 2: GTE */}
          {step === 2 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.gte}>
                GTE: Multi-stage Contrastive Learning
              </text>
              {/* Three stages */}
              {[
                { label: '1단계: 비지도 대조학습', desc: '위키피디아, 웹 크롤', color: C.gte, y: 40 },
                { label: '2단계: 지도 학습', desc: 'NLI + STS 데이터셋', color: C.gte, y: 90 },
                { label: '3단계: Hard Negative Mining', desc: '어려운 부정 샘플 집중', color: C.gte, y: 140 },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, ...sp }}>
                  <rect x={30} y={s.y} width={240} height={36} rx={6}
                    fill={s.color + '10'} stroke={s.color} strokeWidth={1} />
                  {/* left accent bar */}
                  <rect x={30} y={s.y} width={4} height={36} rx={2} fill={s.color} />
                  <text x={155} y={s.y + 15} textAnchor="middle" fontSize={9} fontWeight={600} fill={s.color}>
                    {s.label}
                  </text>
                  <text x={155} y={s.y + 28} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                    {s.desc}
                  </text>
                  {i < 2 && (
                    <line x1={150} y1={s.y + 36} x2={150} y2={s.y + 50}
                      stroke={C.gte} strokeWidth={1} opacity={0.3} />
                  )}
                </motion.g>
              ))}
              {/* Model sizes */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}>
                <rect x={300} y={40} width={160} height={130} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={380} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.gte}>
                  모델 크기 변형
                </text>
                {[
                  { name: 'GTE-small', params: '33M', w: 40 },
                  { name: 'GTE-base', params: '109M', w: 80 },
                  { name: 'GTE-large', params: '335M', w: 130 },
                ].map((m, i) => (
                  <g key={m.name}>
                    <rect x={315} y={68 + i * 30} width={m.w} height={18} rx={4}
                      fill={C.gte + '20'} stroke={C.gte} strokeWidth={0.5} />
                    <text x={320} y={80 + i * 30} fontSize={8} fontWeight={600} fill={C.gte}>{m.name}</text>
                    <text x={450} y={80 + i * 30} textAnchor="end" fontSize={7}
                      fill="var(--muted-foreground)">{m.params}</text>
                  </g>
                ))}
              </motion.g>
              {/* Key insight */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}>
                <rect x={30} y={188} width={420} height={24} rx={4}
                  fill={C.gte + '08'} stroke={C.gte} strokeWidth={0.5} strokeDasharray="4 3" />
                <text x={240} y={204} textAnchor="middle" fontSize={8} fill={C.gte}>
                  Hard Negative Mining: 유사하지만 관련 없는 문서를 집중 학습 → 변별력 강화
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 3: Instruction-based embedding */}
          {step === 3 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.instruct}>
                인스트럭션 기반 임베딩
              </text>
              {/* Traditional vs Instruction */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                {/* Traditional */}
                <rect x={20} y={32} width={200} height={80} rx={6}
                  fill={C.compare + '06'} stroke={C.compare} strokeWidth={0.8} />
                <text x={120} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.compare}>
                  전통 임베딩
                </text>
                <circle cx={80} cy={80} r={22} fill={C.compare + '10'} stroke={C.compare} strokeWidth={0.5} />
                <text x={80} y={77} textAnchor="middle" fontSize={7} fill={C.compare}>검색</text>
                <text x={80} y={87} textAnchor="middle" fontSize={7} fill={C.compare}>분류</text>
                <circle cx={150} cy={80} r={22} fill={C.compare + '10'} stroke={C.compare} strokeWidth={0.5} />
                <text x={150} y={77} textAnchor="middle" fontSize={7} fill={C.compare}>클러스터</text>
                <text x={150} y={87} textAnchor="middle" fontSize={7} fill={C.compare}>STS</text>
                <text x={120} y={105} textAnchor="middle" fontSize={7} fill={C.compare} opacity={0.7}>
                  하나의 공간 → 태스크 간 충돌
                </text>
              </motion.g>
              {/* Instruction-based */}
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, ...sp }}>
                <rect x={250} y={32} width={210} height={80} rx={6}
                  fill={C.instruct + '06'} stroke={C.instruct} strokeWidth={0.8} />
                <text x={355} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.instruct}>
                  인스트럭션 기반
                </text>
                {['query:', 'classify:', 'cluster:'].map((prefix, i) => (
                  <g key={prefix}>
                    <rect x={262 + i * 65} y={60} width={55} height={36} rx={4}
                      fill={C.instruct + '15'} stroke={C.instruct} strokeWidth={0.8} />
                    <text x={289 + i * 65} y={76} textAnchor="middle" fontSize={8} fontWeight={600}
                      fill={C.instruct}>{prefix}</text>
                    <text x={289 + i * 65} y={90} textAnchor="middle" fontSize={7}
                      fill="var(--muted-foreground)">{['검색 모드', '분류 모드', '클러스터'][i]}</text>
                  </g>
                ))}
                <text x={355} y={105} textAnchor="middle" fontSize={7} fill={C.instruct} opacity={0.7}>
                  prefix로 태스크 전환 → 최적 공간
                </text>
              </motion.g>
              {/* Example */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}>
                <rect x={30} y={125} width={420} height={80} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={142} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.instruct}>
                  같은 문장, 다른 인스트럭션 → 다른 벡터
                </text>
                <text x={50} y={162} fontSize={8} fill={C.e5}>query: "파이썬 딕셔너리 사용법"</text>
                <text x={380} y={162} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">→ 검색 최적화 벡터</text>
                <text x={50} y={180} fontSize={8} fill={C.bge}>classify: "파이썬 딕셔너리 사용법"</text>
                <text x={380} y={180} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">→ 분류 최적화 벡터</text>
                <text x={50} y={198} fontSize={8} fill={C.gte}>cluster: "파이썬 딕셔너리 사용법"</text>
                <text x={380} y={198} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">→ 클러스터 최적화 벡터</text>
              </motion.g>
            </g>
          )}

          {/* Step 4: Model comparison */}
          {step === 4 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                MTEB 벤치마크 성능 비교
              </text>
              {/* Model bars */}
              {[
                { name: 'SBERT-base', score: 64.1, color: '#6366f1', params: '110M' },
                { name: 'E5-large-v2', score: 66.2, color: C.e5, params: '335M' },
                { name: 'BGE-large-en', score: 64.2, color: C.bge, params: '335M' },
                { name: 'GTE-large', score: 65.4, color: C.gte, params: '335M' },
                { name: 'E5-mistral-7b', score: 66.6, color: '#ef4444', params: '7B' },
              ].map((m, i) => (
                <motion.g key={m.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, ...sp }}>
                  {/* label */}
                  <text x={120} y={46 + i * 34} textAnchor="end" fontSize={9} fontWeight={600}
                    fill={m.color}>{m.name}</text>
                  {/* bar background */}
                  <rect x={130} y={35 + i * 34} width={250} height={18} rx={4}
                    fill={m.color + '10'} />
                  {/* bar fill — scale 50-70 to 0-250 */}
                  <motion.rect x={130} y={35 + i * 34}
                    width={0} height={18} rx={4}
                    fill={m.color + '40'}
                    animate={{ width: ((m.score - 50) / 20) * 250 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }} />
                  {/* score */}
                  <text x={135 + ((m.score - 50) / 20) * 250} y={48 + i * 34}
                    fontSize={8} fontWeight={700} fill={m.color}>{m.score}</text>
                  {/* params */}
                  <text x={400} y={48 + i * 34} fontSize={7} fill="var(--muted-foreground)">
                    {m.params}
                  </text>
                </motion.g>
              ))}
              {/* Scale */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  MTEB 평균 점수 (56개 태스크) — 높을수록 좋음
                </text>
                <text x={400} y={210} textAnchor="start" fontSize={7} fill="var(--muted-foreground)">
                  파라미터 수
                </text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
