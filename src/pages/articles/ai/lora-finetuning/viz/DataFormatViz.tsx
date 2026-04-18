import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const d = 0.07;
const P = '#6366f1', G = '#10b981', W = '#f59e0b', B = '#3b82f6', R = '#ef4444';

const STEPS = [
  {
    label: '1. Instruction 포맷: Alpaca vs ChatML',
    body: '대부분의 fine-tuning은 instruction-following 형태\nAlpaca: instruction/input/output 3필드 / ChatML: 대화 턴 기반\n모델의 기존 학습 포맷과 일치시키는 것이 핵심',
  },
  {
    label: '2. 데이터 품질 > 데이터 양',
    body: 'LIMA 논문(2023): 1000개 고품질 예제로 GPT-4급 정렬 가능\n중복 제거, 일관된 톤, 정확한 답변이 핵심\n잡음이 많은 10만개보다 정제된 5000개가 효과적',
  },
  {
    label: '3. 도메인 데이터 수집 & 정제',
    body: '자체 도메인 문서에서 Q&A 쌍 추출 → 필터링 → 검수\n길이 분포 확인: 너무 짧거나 긴 예제 제거\n도메인 전문가 검수 또는 GPT-4 기반 품질 평가',
  },
  {
    label: '4. 합성 데이터 생성 전략',
    body: 'Self-Instruct: 기존 예제를 기반으로 GPT-4가 새 예제 생성\nEvol-Instruct(WizardLM): 기존 instruction을 점진적으로 복잡화\n핵심: seed 데이터의 다양성이 합성 데이터 품질을 결정',
  },
];

export default function DataFormatViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                Instruction 포맷 비교
              </text>
              {/* Alpaca format */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d }}>
                <ModuleBox x={20} y={28} w={210} h={78} label="Alpaca 포맷" sub="Stanford Alpaca" color={B} />
                <rect x={28} y={58} width={194} height={44} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                <text x={36} y={72} fontSize={7.5} fontFamily="monospace" fill={B}>instruction:</text>
                <text x={110} y={72} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">번역해줘</text>
                <text x={36} y={84} fontSize={7.5} fontFamily="monospace" fill={B}>input:</text>
                <text x={110} y={84} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">Hello world</text>
                <text x={36} y={96} fontSize={7.5} fontFamily="monospace" fill={G}>output:</text>
                <text x={110} y={96} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">안녕 세상</text>
              </motion.g>

              {/* ChatML format */}
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: d * 2 }}>
                <ModuleBox x={250} y={28} w={210} h={78} label="ChatML 포맷" sub="OpenAI 대화형" color={P} />
                <rect x={258} y={58} width={194} height={44} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.3} />
                <text x={266} y={72} fontSize={7.5} fontFamily="monospace" fill={P}>&lt;|system|&gt;</text>
                <text x={340} y={72} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">번역기입니다</text>
                <text x={266} y={84} fontSize={7.5} fontFamily="monospace" fill={B}>&lt;|user|&gt;</text>
                <text x={340} y={84} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">Hello world</text>
                <text x={266} y={96} fontSize={7.5} fontFamily="monospace" fill={G}>&lt;|assistant|&gt;</text>
                <text x={358} y={96} fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">안녕 세상</text>
              </motion.g>

              {/* Key point */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <rect x={60} y={118} width={360} height={24} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={134} textAnchor="middle" fontSize={8} fill="var(--foreground)">
                  모델의 원래 chat template에 맞추는 것이 핵심 — Llama: Alpaca, GPT계열: ChatML
                </text>
              </motion.g>

              {/* Additional formats */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <DataBox x={60} y={152} w={80} h={28} label="ShareGPT" sub="다중 턴 대화" color={W} />
                <DataBox x={160} y={152} w={80} h={28} label="OASST" sub="트리 구조" color={G} />
                <DataBox x={260} y={152} w={100} h={28} label="Llama-2 Chat" sub="[INST] 태그" color={R} />
              </motion.g>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                데이터 품질 vs 양
              </text>
              {/* LIMA insight */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <rect x={30} y={30} width={200} height={55} rx={6} fill={`${G}10`} stroke={G} strokeWidth={0.5} />
                <text x={130} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={G}>LIMA (2023)</text>
                <text x={130} y={64} textAnchor="middle" fontSize={8} fill="var(--foreground)">1,000개 고품질 예제</text>
                <text x={130} y={78} textAnchor="middle" fontSize={8} fill={G}>GPT-4급 정렬 달성</text>
              </motion.g>

              {/* vs */}
              <motion.text x={240} y={60} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                vs
              </motion.text>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <rect x={260} y={30} width={200} height={55} rx={6} fill={`${R}10`} stroke={R} strokeWidth={0.5} />
                <text x={360} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={R}>잡음 데이터</text>
                <text x={360} y={64} textAnchor="middle" fontSize={8} fill="var(--foreground)">100,000개 저품질 예제</text>
                <text x={360} y={78} textAnchor="middle" fontSize={8} fill={R}>오히려 성능 저하</text>
              </motion.g>

              {/* Quality checklist */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <rect x={60} y={95} width={360} height={90} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">품질 체크리스트</text>
                <text x={80} y={130} fontSize={8} fill={G}>&#x2713; 정확성 — 사실관계 오류 없음</text>
                <text x={80} y={146} fontSize={8} fill={G}>&#x2713; 일관성 — 톤, 형식 통일</text>
                <text x={80} y={162} fontSize={8} fill={G}>&#x2713; 다양성 — 태스크 유형 분산</text>
                <text x={280} y={130} fontSize={8} fill={R}>&#x2717; 중복 — 유사 예제 반복</text>
                <text x={280} y={146} fontSize={8} fill={R}>&#x2717; 모호함 — 여러 해석 가능</text>
                <text x={280} y={162} fontSize={8} fill={R}>&#x2717; 편향 — 특정 패턴 과집중</text>
              </motion.g>
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                도메인 데이터 수집 파이프라인
              </text>
              {/* Pipeline: 문서 → 추출 → 필터 → 검수 → 학습 데이터 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <ModuleBox x={10} y={40} w={80} h={44} label="도메인 문서" sub="PDF, DB, Wiki" color={B} />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <line x1={90} y1={62} x2={110} y2={62} stroke="var(--border)" strokeWidth={1} />
                <polygon points="107,57 107,67 115,62" fill="var(--muted-foreground)" />
                <ActionBox x={115} y={40} w={80} h={44} label="Q&A 추출" sub="GPT-4 활용" color={P} />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <line x1={195} y1={62} x2={215} y2={62} stroke="var(--border)" strokeWidth={1} />
                <polygon points="212,57 212,67 220,62" fill="var(--muted-foreground)" />
                <ActionBox x={220} y={40} w={80} h={44} label="필터링" sub="길이/품질 기준" color={W} />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 4 }}>
                <line x1={300} y1={62} x2={320} y2={62} stroke="var(--border)" strokeWidth={1} />
                <polygon points="317,57 317,67 325,62" fill="var(--muted-foreground)" />
                <ActionBox x={325} y={40} w={80} h={44} label="전문가 검수" sub="표본 추출 검증" color={G} />
              </motion.g>

              {/* Output */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 5 }}>
                <line x1={365} y1={84} x2={365} y2={104} stroke={G} strokeWidth={1} />
                <polygon points="360,101 370,101 365,108" fill={G} />
                <DataBox x={310} y={110} w={110} h={28} label="학습 데이터" sub="JSON/JSONL" color={G} />
              </motion.g>

              {/* Filter criteria */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 6 }}>
                <rect x={30} y={105} width={250} height={80} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={155} y={120} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">필터링 기준</text>
                <text x={40} y={138} fontSize={8} fill="var(--muted-foreground)">길이: 답변 50-2000 토큰 (극단값 제거)</text>
                <text x={40} y={154} fontSize={8} fill="var(--muted-foreground)">품질: perplexity 임계값 이상 제거</text>
                <text x={40} y={170} fontSize={8} fill="var(--muted-foreground)">중복: 유사도 0.9 이상 예제 deduplicate</text>
              </motion.g>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                합성 데이터 생성 전략
              </text>
              {/* Self-Instruct */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d }}>
                <rect x={20} y={30} width={210} height={72} rx={6} fill="var(--card)" stroke={B} strokeWidth={0.5} />
                <text x={125} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={B}>Self-Instruct</text>
                <DataBox x={30} y={52} w={60} h={22} label="Seed" sub="175개" color={B} />
                <text x={100} y={66} fontSize={9} fill="var(--muted-foreground)">→</text>
                <ActionBox x={110} y={52} w={50} h={22} label="GPT-4" color={P} />
                <text x={170} y={66} fontSize={9} fill="var(--muted-foreground)">→</text>
                <DataBox x={180} y={52} w={40} h={22} label="52K" color={G} />
                <text x={125} y={96} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  소수 예제로부터 대량 생성
                </text>
              </motion.g>

              {/* Evol-Instruct */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 2 }}>
                <rect x={250} y={30} width={210} height={72} rx={6} fill="var(--card)" stroke={W} strokeWidth={0.5} />
                <text x={355} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={W}>Evol-Instruct (WizardLM)</text>
                <DataBox x={260} y={52} w={55} h={22} label="기본 Q" color={W} />
                <text x={325} y={66} fontSize={9} fill="var(--muted-foreground)">→</text>
                <ActionBox x={335} y={52} w={55} h={22} label="복잡화" color={R} />
                <text x={400} y={66} fontSize={9} fill="var(--muted-foreground)">→</text>
                <DataBox x={410} y={52} w={40} h={22} label="고급 Q" color={G} />
                <text x={355} y={96} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  난이도를 점진적으로 높임
                </text>
              </motion.g>

              {/* Key insight */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d * 3 }}>
                <rect x={60} y={116} width={360} height={70} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={132} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">합성 데이터 핵심 원칙</text>
                <text x={80} y={150} fontSize={8} fill={G}>1. Seed 다양성이 결과 다양성 결정</text>
                <text x={80} y={166} fontSize={8} fill={B}>2. 생성 후 반드시 필터링 (환각 제거)</text>
                <text x={80} y={182} fontSize={8} fill={W}>3. 실제 데이터와 합성 데이터 혼합이 최적</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
