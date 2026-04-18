import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './OverviewVizData';

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 범용 모델의 한계 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={30} y={20} w={120} h={46} label="BERT / GPT" sub="일반 코퍼스 학습" color={COLORS.general} />
              <motion.path d="M155,43 L195,43" stroke="var(--muted-foreground)" strokeWidth={1.5} fill="none" markerEnd="url(#arrOV)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5 }} />
              {/* 도메인 텍스트 입력 */}
              <DataBox x={200} y={28} w={110} h={30} label="유전체 서열" sub="ATCGATCG..." color={COLORS.bio} />
              <motion.path d="M315,43 L355,43" stroke="#ef4444" strokeWidth={1.5} fill="none" markerEnd="url(#arrOV)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5, delay: 0.15 }} />
              <AlertBox x={360} y={18} w={130} h={50} label="성능 저하" sub="토큰 분해 + OOV" color={COLORS.alert} />
              {/* 어휘 불일치 시각화 */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <text x={260} y={105} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.alert}>
                  일반 토크나이저가 도메인 용어를 과도하게 분해
                </text>
                <rect x={80} y={115} width={360} height={30} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={90} y={134} fontSize={9} fill={COLORS.general}>"BRCA1" →</text>
                <text x={155} y={134} fontSize={9} fill={COLORS.alert}>["BR", "##CA", "##1"]</text>
                <text x={290} y={134} fontSize={9} fill="var(--muted-foreground)">의미 단위가 파괴됨</text>
              </motion.g>
              {/* 도메인 예시 3개 */}
              {[
                { label: '유전체', sub: 'ATCG 서열', x: 80 },
                { label: '의료', sub: 'MeSH 용어', x: 215 },
                { label: '제조', sub: '공정 로그', x: 350 },
              ].map((d, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.1 }}>
                  <DataBox x={d.x} y={165} w={100} h={30} label={d.label} sub={d.sub} color={COLORS.domain} outlined />
                </motion.g>
              ))}
            </motion.g>
          )}

          {/* Step 1: 3단계 파이프라인 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Stage 1 */}
              <ModuleBox x={20} y={40} w={130} h={50} label="1. 범용 사전학습" sub="위키·뉴스·책 코퍼스" color={COLORS.general} />
              <motion.path d="M155,65 L195,65" stroke={COLORS.domain} strokeWidth={2} fill="none" markerEnd="url(#arrOV)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5 }} />
              {/* Stage 2 */}
              <ActionBox x={200} y={42} w={130} h={46} label="2. 도메인 추가학습" sub="도메인 코퍼스 MLM/CLM" color={COLORS.domain} />
              <motion.path d="M335,65 L375,65" stroke={COLORS.task} strokeWidth={2} fill="none" markerEnd="url(#arrOV)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...sp, duration: 0.5, delay: 0.15 }} />
              {/* Stage 3 */}
              <StatusBox x={380} y={38} w={120} h={54} label="3. 태스크 학습" sub="분류/추출/생성" color={COLORS.task} progress={0.85} />
              {/* 핵심 차이 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
                <rect x={60} y={120} width={400} height={40} rx={8} fill={COLORS.domain} fillOpacity={0.06}
                  stroke={COLORS.domain} strokeWidth={0.8} />
                <text x={260} y={140} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.domain}>
                  2단계(도메인 추가학습)가 성능 격차의 핵심
                </text>
                <text x={260} y={154} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                  도메인 어휘·문맥·패턴을 모델이 내재화하는 단계
                </text>
              </motion.g>
              {/* 각 단계 키워드 */}
              <text x={85} y={105} textAnchor="middle" fontSize={8} fill={COLORS.general}>언어 구조</text>
              <text x={265} y={105} textAnchor="middle" fontSize={8} fill={COLORS.domain}>도메인 지식</text>
              <text x={440} y={105} textAnchor="middle" fontSize={8} fill={COLORS.task}>목적 특화</text>
            </motion.g>
          )}

          {/* Step 2: 어휘 분포 차이 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={130} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.general}>일반 코퍼스</text>
              <text x={390} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.bio}>유전체 코퍼스</text>
              {/* 일반 코퍼스 빈도 바 */}
              {[
                { word: 'the', w: 140 },
                { word: 'is', w: 110 },
                { word: 'of', w: 95 },
                { word: 'and', w: 85 },
                { word: 'to', w: 75 },
              ].map((item, i) => (
                <motion.g key={`gen-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <text x={25} y={44 + i * 24} fontSize={9} fill="var(--foreground)" fontFamily="monospace">{item.word}</text>
                  <motion.rect x={60} y={34 + i * 24} width={0} height={14} rx={3}
                    fill={COLORS.general} fillOpacity={0.5}
                    animate={{ width: item.w }} transition={{ ...sp, duration: 0.6, delay: i * 0.08 }} />
                </motion.g>
              ))}
              {/* 유전체 코퍼스 빈도 바 */}
              {[
                { word: 'ATCG', w: 130 },
                { word: 'exon', w: 100 },
                { word: 'SNV', w: 90 },
                { word: 'allele', w: 75 },
                { word: 'codon', w: 60 },
              ].map((item, i) => (
                <motion.g key={`bio-${i}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.08 }}>
                  <text x={285} y={44 + i * 24} fontSize={9} fill="var(--foreground)" fontFamily="monospace">{item.word}</text>
                  <motion.rect x={325} y={34 + i * 24} width={0} height={14} rx={3}
                    fill={COLORS.bio} fillOpacity={0.5}
                    animate={{ width: item.w }} transition={{ ...sp, duration: 0.6, delay: 0.2 + i * 0.08 }} />
                </motion.g>
              ))}
              {/* 구분선 */}
              <line x1={260} y1={30} x2={260} y2={160} stroke="var(--border)" strokeWidth={1} strokeDasharray="4 3" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <text x={260} y={185} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.domain}>
                  어휘 겹침이 거의 없음 → 기존 임베딩으로는 도메인 의미 포착 불가
                </text>
                <text x={260} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  도메인 추가학습으로 임베딩 공간을 재구성해야 함
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: 성능 비교 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                도메인 적응 전후 성능 비교
              </text>
              {/* 의료 NER */}
              <text x={25} y={55} fontSize={9} fontWeight={600} fill="var(--foreground)">의료 NER</text>
              <rect x={100} y={42} width={380} height={16} rx={3} fill="var(--border)" opacity={0.15} />
              <motion.rect x={100} y={42} width={0} height={16} rx={3} fill={COLORS.alert} opacity={0.4}
                animate={{ width: 296 }} transition={{ ...sp, duration: 0.8 }} />
              <text x={404} y={54} fontSize={8} fill={COLORS.alert} fontWeight={600}>BERT F1: 78%</text>
              <rect x={100} y={62} width={380} height={16} rx={3} fill="var(--border)" opacity={0.15} />
              <motion.rect x={100} y={62} width={0} height={16} rx={3} fill={COLORS.task} opacity={0.5}
                animate={{ width: 330 }} transition={{ ...sp, duration: 0.8, delay: 0.1 }} />
              <text x={438} y={74} fontSize={8} fill={COLORS.task} fontWeight={600}>BioBERT F1: 87%</text>
              {/* DNA 분류 */}
              <text x={25} y={110} fontSize={9} fontWeight={600} fill="var(--foreground)">DNA 분류</text>
              <rect x={100} y={97} width={380} height={16} rx={3} fill="var(--border)" opacity={0.15} />
              <motion.rect x={100} y={97} width={0} height={16} rx={3} fill={COLORS.alert} opacity={0.4}
                animate={{ width: 235 }} transition={{ ...sp, duration: 0.8, delay: 0.2 }} />
              <text x={343} y={109} fontSize={8} fill={COLORS.alert} fontWeight={600}>BERT Acc: 62%</text>
              <rect x={100} y={117} width={380} height={16} rx={3} fill="var(--border)" opacity={0.15} />
              <motion.rect x={100} y={117} width={0} height={16} rx={3} fill={COLORS.task} opacity={0.5}
                animate={{ width: 345 }} transition={{ ...sp, duration: 0.8, delay: 0.3 }} />
              <text x={453} y={129} fontSize={8} fill={COLORS.task} fontWeight={600}>DNABERT Acc: 91%</text>
              {/* 핵심 메시지 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={80} y={150} width={360} height={40} rx={8} fill={COLORS.task} fillOpacity={0.06}
                  stroke={COLORS.task} strokeWidth={0.8} />
                <text x={260} y={168} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.task}>
                  도메인 적응 = +9~29% 성능 향상
                </text>
                <text x={260} y={182} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                  모델 크기 증가보다 도메인 데이터가 더 효과적
                </text>
              </motion.g>
            </motion.g>
          )}

          <defs>
            <marker id="arrOV" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
