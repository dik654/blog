import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './GenomicVizData';

export default function GenomicViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: gLM 개념 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* DNA 서열 입력 */}
              <text x={260} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                DNA 서열을 텍스트로 취급 → Transformer 학습
              </text>

              {/* 서열 시각화 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={40} y={30} width={440} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                {['A', 'T', 'C', 'G', 'A', 'T', 'C', 'G', 'T', 'A', 'G', 'C', 'A', 'T', 'G', 'C', 'A', 'T'].map((base, i) => {
                  const c = base === 'A' ? '#ef4444' : base === 'T' ? '#3b82f6' : base === 'C' ? '#10b981' : '#f59e0b';
                  return (
                    <motion.text key={i} x={55 + i * 24} y={50} textAnchor="middle" fontSize={12}
                      fontWeight={700} fontFamily="monospace" fill={c}
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ ...sp, delay: 0.15 + i * 0.03 }}>
                      {base}
                    </motion.text>
                  );
                })}
              </motion.g>

              {/* k-mer 토큰화 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <text x={40} y={82} fontSize={9} fontWeight={600} fill={COLORS.dna}>k-mer 토큰화 (k=6):</text>
                {['ATCGAT', 'TCGATC', 'CGATCG', 'GATCGT'].map((kmer, i) => (
                  <DataBox key={i} x={40 + i * 115} y={88} w={100} h={26} label={kmer} sub={`토큰 ${i + 1}`} color={COLORS.dna} />
                ))}
              </motion.g>

              {/* Transformer */}
              <motion.path d="M260,118 L260,138" stroke={COLORS.model} strokeWidth={2} fill="none" markerEnd="url(#arrGN)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.4, delay: 0.5 }} />
              <ModuleBox x={180} y={140} w={160} h={42} label="Transformer (MLM)" sub="[MASK] 토큰 예측 학습" color={COLORS.model} />

              <motion.text x={260} y={205} textAnchor="middle" fontSize={9} fill={COLORS.dna} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                자연어와 동일한 구조 → 유전체도 "언어"로 학습 가능
              </motion.text>
            </motion.g>
          )}

          {/* Step 1: k-mer vs BPE */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                DNA 토큰화 방식 비교
              </text>

              {/* 입력 서열 */}
              <rect x={120} y={28} width={280} height={22} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={260} y={43} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={600} fill="var(--foreground)">
                A T C G A T C G
              </text>

              {/* k-mer 방식 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={20} y={65} width={230} height={80} rx={8} fill={COLORS.dna} fillOpacity={0.06}
                  stroke={COLORS.dna} strokeWidth={0.8} />
                <text x={135} y={83} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.dna}>k-mer (슬라이딩 윈도우)</text>
                <text x={135} y={100} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill="var(--foreground)">
                  [ATC] [TCG] [CGA] [GAT]
                </text>
                <text x={135} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  stride=1, 생물학적 모티프와 정렬
                </text>
                <text x={135} y={132} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.dna}>
                  코돈(3-mer) 단위 = 아미노산 대응
                </text>
              </motion.g>

              {/* BPE 방식 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.35 }}>
                <rect x={270} y={65} width={230} height={80} rx={8} fill={COLORS.accent} fillOpacity={0.06}
                  stroke={COLORS.accent} strokeWidth={0.8} />
                <text x={385} y={83} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.accent}>BPE (빈도 기반 병합)</text>
                <text x={385} y={100} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill="var(--foreground)">
                  [AT] [CG] [ATCG]
                </text>
                <text x={385} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  빈도 높은 쌍부터 병합
                </text>
                <text x={385} y={132} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.accent}>
                  생물학 단위와 무관할 수 있음
                </text>
              </motion.g>

              {/* 결론 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={70} y={160} width={380} height={40} rx={8} fill={COLORS.dna} fillOpacity={0.06}
                  stroke={COLORS.dna} strokeWidth={0.8} />
                <text x={260} y={178} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.dna}>
                  DNABERT: 6-mer 채택 → 프로모터/인핸서 모티프 포착에 유리
                </text>
                <text x={260} y={193} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  Nucleotide Transformer: BPE 채택 → 다양한 길이의 패턴 학습
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: DNABERT vs Nucleotide Transformer */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                유전체 언어모델 구조 비교
              </text>

              {/* DNABERT */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={20} y={30} width={230} height={100} rx={8} fill={COLORS.model} fillOpacity={0.06}
                  stroke={COLORS.model} strokeWidth={0.8} />
                <text x={135} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.model}>DNABERT</text>
                <text x={135} y={66} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">BERT-base (110M params)</text>
                <text x={135} y={80} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">6-mer 토큰화 + MLM</text>
                <text x={135} y={94} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">인간 게놈 참조 서열 학습</text>
                <text x={135} y={118} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.model}>
                  프로모터 예측 F1: 0.90
                </text>
              </motion.g>

              {/* Nucleotide Transformer */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={270} y={30} width={230} height={100} rx={8} fill={COLORS.dna} fillOpacity={0.06}
                  stroke={COLORS.dna} strokeWidth={0.8} />
                <text x={385} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.dna}>Nucleotide Transformer</text>
                <text x={385} y={66} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">최대 2.5B params</text>
                <text x={385} y={80} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">BPE 토큰화 + MLM</text>
                <text x={385} y={94} textAnchor="middle" fontSize={8.5} fill="var(--foreground)">3,200종 다종 게놈 학습</text>
                <text x={385} y={118} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.dna}>
                  프로모터 예측 F1: 0.94
                </text>
              </motion.g>

              {/* 규모 효과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={60} y={145} width={400} height={50} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={165} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.contrast}>
                  규모 확대 효과: 파라미터 20x 증가 → 다운스트림 태스크 전반 성능 향상
                </text>
                <text x={260} y={182} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  프로모터, 스플라이스 사이트, 인핸서 검출 등 18개 태스크 벤치마크
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: Contrastive Fine-tuning for SNV */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                SNV 민감도 개선: Contrastive Fine-tuning
              </text>

              {/* 원본 vs 변이 서열 */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <rect x={30} y={30} width={200} height={28} rx={6} fill={COLORS.dna} fillOpacity={0.08}
                  stroke={COLORS.dna} strokeWidth={0.8} />
                <text x={40} y={48} fontSize={10} fontWeight={600} fill={COLORS.dna}>원본:</text>
                <text x={85} y={48} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                  A T
                </text>
                <text x={105} y={48} fontSize={10} fontFamily="monospace" fontWeight={700} fill={COLORS.dna}>C</text>
                <text x={117} y={48} fontSize={10} fontFamily="monospace" fill="var(--foreground)"> G A T</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.25 }}>
                <rect x={30} y={64} width={200} height={28} rx={6} fill={COLORS.snv} fillOpacity={0.08}
                  stroke={COLORS.snv} strokeWidth={0.8} />
                <text x={40} y={82} fontSize={10} fontWeight={600} fill={COLORS.snv}>변이:</text>
                <text x={85} y={82} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
                  A T
                </text>
                <text x={105} y={82} fontSize={10} fontFamily="monospace" fontWeight={700} fill={COLORS.snv}>G</text>
                <text x={117} y={82} fontSize={10} fontFamily="monospace" fill="var(--foreground)"> G A T</text>
              </motion.g>

              {/* SNV 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
                <line x1={110} y1={60} x2={110} y2={64} stroke={COLORS.snv} strokeWidth={2} />
                <text x={160} y={60} fontSize={8} fontWeight={700} fill={COLORS.snv}>C → G (SNV)</text>
              </motion.g>

              {/* Contrastive learning */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.4 }}>
                {/* 임베딩 공간 */}
                <rect x={270} y={30} width={220} height={80} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={380} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.contrast}>임베딩 공간</text>

                {/* 양성 쌍: 가까이 */}
                <circle cx={320} cy={75} r={6} fill={COLORS.dna} opacity={0.7} />
                <text x={332} y={79} fontSize={7.5} fill={COLORS.dna}>원본</text>
                <circle cx={340} cy={65} r={6} fill={COLORS.dna} opacity={0.5} />
                <text x={352} y={69} fontSize={7.5} fill={COLORS.dna}>동의변이</text>

                {/* 음성 쌍: 멀리 */}
                <circle cx={440} cy={80} r={6} fill={COLORS.snv} opacity={0.7} />
                <text x={448} y={75} fontSize={7.5} fill={COLORS.snv}>병원성 변이</text>

                {/* 거리 표시 */}
                <line x1={346} y1={68} x2={434} y2={78} stroke={COLORS.contrast} strokeWidth={1} strokeDasharray="3 2" />
                <text x={390} y={62} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={COLORS.contrast}>거리 확대</text>
              </motion.g>

              {/* Contrastive Loss 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
                <rect x={30} y={125} width={460} height={45} rx={8} fill={COLORS.contrast} fillOpacity={0.06}
                  stroke={COLORS.contrast} strokeWidth={0.8} />
                <text x={260} y={143} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.contrast}>
                  Contrastive Loss: 같은 기능 변이는 가까이, 다른 기능 변이는 멀리
                </text>
                <text x={260} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  결과: 단일 염기 차이에 민감한 임베딩 → 병원성 변이 검출 정확도 향상
                </text>
              </motion.g>

              <motion.text x={260} y={195} textAnchor="middle" fontSize={8.5} fill={COLORS.dna} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                기존 gLM: SNV 구분 AUC 0.72 → contrastive fine-tune 후: AUC 0.89
              </motion.text>
            </motion.g>
          )}

          {/* Step 4: 대회 적용 파이프라인 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                유전체 도메인 Fine-tuning 파이프라인 (대회 전략)
              </text>

              {/* 5단계 파이프라인 */}
              {[
                { label: 'gLM 선택', sub: 'DNABERT-2 / NT', color: COLORS.model, x: 20, y: 35 },
                { label: 'Continued Pretrain', sub: '도메인 데이터 1~3 ep', color: COLORS.contrast, x: 120, y: 35 },
                { label: 'Contrastive FT', sub: 'SNV 민감도 강화', color: COLORS.snv, x: 240, y: 35 },
                { label: 'Task Head', sub: '분류/회귀 학습', color: COLORS.dna, x: 350, y: 35 },
                { label: '앙상블', sub: 'gLM + XGBoost', color: COLORS.comp, x: 450, y: 35 },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={s.x} y={s.y} width={90} height={50} rx={6}
                    fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={0.8} />
                  <text x={s.x + 45} y={s.y + 20} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={s.x + 45} y={s.y + 35} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{s.sub}</text>
                  {i < 4 && (
                    <motion.line x1={s.x + 94} y1={s.y + 25} x2={s.x + 105} y2={s.y + 25}
                      stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrGN)"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ ...sp, duration: 0.3, delay: 0.1 + i * 0.12 }} />
                  )}
                </motion.g>
              ))}

              {/* 핵심 팁들 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
                {[
                  { tip: 'Continued Pretrain LR: 원래의 1/10 (5e-6)', x: 30, y: 105 },
                  { tip: 'Contrastive: Hard Negative Mining으로 효과 극대화', x: 30, y: 125 },
                  { tip: 'Task Head: Discriminative LR (하위→상위 점진 증가)', x: 30, y: 145 },
                  { tip: '앙상블: gLM 임베딩 + 수공학 피처 → XGBoost 결합', x: 30, y: 165 },
                ].map((t, i) => (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: 0.8 + i * 0.08 }}>
                    <circle cx={t.x + 5} cy={t.y - 3} r={2.5} fill={COLORS.dna} />
                    <text x={t.x + 15} y={t.y} fontSize={8.5} fill="var(--foreground)">{t.tip}</text>
                  </motion.g>
                ))}
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 1.1 }}>
                <rect x={80} y={180} width={360} height={25} rx={6} fill={COLORS.comp} fillOpacity={0.06}
                  stroke={COLORS.comp} strokeWidth={0.8} />
                <text x={260} y={196} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={COLORS.comp}>
                  Kaggle 유전체 대회 Top 솔루션의 공통 패턴: gLM + 전통 ML 앙상블
                </text>
              </motion.g>
            </motion.g>
          )}

          <defs>
            <marker id="arrGN" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
