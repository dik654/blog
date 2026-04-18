import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './OverviewVizData';

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Training from scratch — cost */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={50} w={100} h={36} label="내 데이터" sub="5,000장" color={COLORS.pretrain} />
              <line x1={125} y1={68} x2={175} y2={68} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrTL)" />
              <ModuleBox x={180} y={45} w={130} h={46} label="CNN (Random Init)" sub="가중치 랜덤 초기화" color={COLORS.pretrain} />
              <line x1={315} y1={68} x2={355} y2={68} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrTL)" />
              <AlertBox x={360} y={44} w={130} h={48} label="Acc 62%" sub="과적합 + 느린 수렴" color="#ef4444" />
              <text x={260} y={135} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                소량 데이터로 밑바닥부터 학습 → 과적합, 낮은 정확도
              </text>
              {/* GPU cost bar */}
              <rect x={100} y={155} width={320} height={20} rx={4} fill="var(--border)" opacity={0.2} />
              <motion.rect x={100} y={155} width={0} height={20} rx={4} fill="#ef4444" opacity={0.5}
                animate={{ width: 320 }} transition={{ ...sp, duration: 1 }} />
              <text x={260} y={169} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                GPU 수천 시간 · 데이터 수백만 장 필요
              </text>
            </motion.g>
          )}

          {/* Step 1: Transfer learning overview */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={10} y={30} w={120} h={46} label="Pretrained Model" sub="ImageNet 1400만장" color={COLORS.pretrain} />
              <motion.path d="M135,53 L185,53" stroke={COLORS.finetune} strokeWidth={2} fill="none" markerEnd="url(#arrTL)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.6 }} />
              <ActionBox x={190} y={34} w={130} h={38} label="Fine-tuning" sub="내 데이터 5,000장" color={COLORS.finetune} />
              <motion.path d="M325,53 L375,53" stroke={COLORS.finetune} strokeWidth={2} fill="none" markerEnd="url(#arrTL)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.6, delay: 0.2 }} />
              <StatusBox x={380} y={28} w={120} h={50} label="Acc 94%" sub="빠른 수렴" color={COLORS.finetune} progress={0.94} />
              {/* Time comparison bars */}
              <rect x={60} y={110} width={400} height={14} rx={3} fill="var(--border)" opacity={0.15} />
              <motion.rect x={60} y={110} width={0} height={14} rx={3} fill={COLORS.finetune} opacity={0.6}
                animate={{ width: 60 }} transition={{ ...sp, duration: 0.8 }} />
              <text x={130} y={121} fontSize={8} fill="var(--foreground)">Fine-tuning: 30분</text>
              <rect x={60} y={130} width={400} height={14} rx={3} fill="var(--border)" opacity={0.15} />
              <motion.rect x={60} y={130} width={0} height={14} rx={3} fill="#ef4444" opacity={0.4}
                animate={{ width: 400 }} transition={{ ...sp, duration: 1 }} />
              <text x={130} y={141} fontSize={8} fill="var(--foreground)">From Scratch: 48시간+</text>
              <text x={260} y={175} textAnchor="middle" fontSize={10} fill={COLORS.finetune} fontWeight={600}>
                학습 시간 10배 이상 단축 + 정확도 대폭 향상
              </text>
            </motion.g>
          )}

          {/* Step 2: CV — low-level to high-level feature reuse */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Layer stack */}
              {[
                { label: 'Conv1: 에지', sub: '도메인 무관', color: COLORS.pretrain, y: 25, w: 90, freeze: true },
                { label: 'Conv2: 텍스처', sub: '도메인 무관', color: COLORS.pretrain, y: 65, w: 110, freeze: true },
                { label: 'Conv3: 패턴', sub: '약간 특화', color: COLORS.domain, y: 105, w: 130, freeze: false },
                { label: 'FC: 분류', sub: '도메인 특화', color: COLORS.finetune, y: 145, w: 150, freeze: false },
              ].map((layer, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={40} y={layer.y} width={layer.w} height={30} rx={6}
                    fill={`${layer.color}18`} stroke={layer.color} strokeWidth={1.5}
                    strokeDasharray={layer.freeze ? '0' : '4 3'} />
                  <text x={48} y={layer.y + 15} fontSize={9} fontWeight={600} fill={layer.color}>{layer.label}</text>
                  <text x={48} y={layer.y + 25} fontSize={7.5} fill="var(--muted-foreground)">{layer.sub}</text>
                  {layer.freeze && (
                    <text x={layer.w + 48} y={layer.y + 18} fontSize={8} fill={COLORS.pretrain} fontWeight={600}>
                      ❄ Freeze
                    </text>
                  )}
                  {!layer.freeze && (
                    <text x={layer.w + 48} y={layer.y + 18} fontSize={8} fill={COLORS.finetune} fontWeight={600}>
                      🔥 Train
                    </text>
                  )}
                </motion.g>
              ))}
              {/* Arrow: general → specific */}
              <line x1={310} y1={40} x2={310} y2={165} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrTL)" />
              <text x={320} y={50} fontSize={8} fill="var(--muted-foreground)">일반적</text>
              <text x={320} y={165} fontSize={8} fill="var(--muted-foreground)">도메인 특화</text>
              {/* Right side: examples */}
              <DataBox x={370} y={35} w={120} h={28} label="ImageNet 피처" sub="에지·질감·형태" color={COLORS.pretrain} />
              <line x1={430} y1={67} x2={430} y2={95} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrTL)" />
              <DataBox x={370} y={100} w={120} h={28} label="내 도메인 피처" sub="종양·세포·균열" color={COLORS.finetune} />
            </motion.g>
          )}

          {/* Step 3: NLP pretrained models */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={30} w={100} h={46} label="BERT" sub="MLM + NSP" color={COLORS.nlp} />
              <ModuleBox x={140} y={30} w={100} h={46} label="GPT" sub="Autoregressive LM" color={COLORS.accent} />
              <ModuleBox x={260} y={30} w={100} h={46} label="T5" sub="Text-to-Text" color={COLORS.domain} />
              {/* Arrows down */}
              {[70, 190, 310].map((cx, i) => (
                <motion.line key={i} x1={cx} y1={80} x2={cx} y2={110}
                  stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrTL)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }} />
              ))}
              {/* Downstream tasks */}
              <ActionBox x={20} y={115} w={100} h={34} label="감성 분석" sub="Fine-tune 분류헤드" color={COLORS.finetune} />
              <ActionBox x={140} y={115} w={100} h={34} label="텍스트 생성" sub="Fine-tune LM" color={COLORS.finetune} />
              <ActionBox x={260} y={115} w={100} h={34} label="요약·번역" sub="Fine-tune Seq2Seq" color={COLORS.finetune} />
              {/* Common pattern */}
              <rect x={380} y={50} width={120} height={70} rx={8} fill={COLORS.finetune} fillOpacity={0.08}
                stroke={COLORS.finetune} strokeWidth={1} />
              <text x={440} y={72} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.finetune}>공통 패턴</text>
              <text x={440} y={88} textAnchor="middle" fontSize={8} fill="var(--foreground)">대규모 코퍼스로</text>
              <text x={440} y={100} textAnchor="middle" fontSize={8} fill="var(--foreground)">언어 구조 학습 후</text>
              <text x={440} y={112} textAnchor="middle" fontSize={8} fill="var(--foreground)">태스크별 미세조정</text>
              <text x={260} y={180} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                NLP 혁명의 핵심: pretrained LM → downstream fine-tuning
              </text>
            </motion.g>
          )}

          {/* Step 4: Domain-specific */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* General pretrained */}
              <ModuleBox x={20} y={20} w={110} h={42} label="General Pretrained" sub="BERT / ResNet" color={COLORS.pretrain} />
              <motion.path d="M135,41 L175,41" stroke={COLORS.domain} strokeWidth={2} fill="none" markerEnd="url(#arrTL)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5 }} />
              {/* Domain pretraining */}
              <ActionBox x={180} y={22} w={140} h={38} label="도메인 추가 학습" sub="Continued Pretraining" color={COLORS.domain} />
              <motion.path d="M325,41 L365,41" stroke={COLORS.finetune} strokeWidth={2} fill="none" markerEnd="url(#arrTL)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5, delay: 0.2 }} />
              {/* Domain-specific model */}
              <ModuleBox x={370} y={20} w={130} h={42} label="Domain Model" sub="BioBERT / SatMAE" color={COLORS.finetune} />
              {/* Examples */}
              {[
                { label: '의료: BioBERT', sub: 'PubMed 논문 18억 토큰', color: COLORS.vision, y: 90 },
                { label: '유전체: DNABERT', sub: 'DNA 서열 k-mer 토큰화', color: COLORS.accent, y: 130 },
                { label: '위성: SatMAE', sub: '지구 관측 이미지 MAE', color: COLORS.domain, y: 170 },
              ].map((ex, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.12 }}>
                  <DataBox x={80 + i * 140} y={ex.y} w={130} h={32} label={ex.label} sub={ex.sub} color={ex.color} />
                </motion.g>
              ))}
            </motion.g>
          )}

          <defs>
            <marker id="arrTL" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
