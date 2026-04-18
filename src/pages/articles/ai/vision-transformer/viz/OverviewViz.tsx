import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { STEPS, C } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: CNN local receptive field */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 이미지 그리드 */}
              <rect x={30} y={30} width={120} height={120} rx={4} fill={C.cnn + '10'} stroke={C.cnn} strokeWidth={0.8} />
              <text x={90} y={22} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cnn}>입력 이미지</text>
              {/* 3x3 커널 하이라이트 */}
              {[0, 1, 2].map(r =>
                [0, 1, 2].map(c => (
                  <motion.rect key={`k-${r}-${c}`} x={60 + c * 14} y={60 + r * 14}
                    width={12} height={12} rx={2} fill={C.cnn + '30'} stroke={C.cnn} strokeWidth={1.2}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: (r * 3 + c) * 0.04 }} />
                ))
              )}
              <text x={81} y={115} textAnchor="middle" fontSize={8} fill={C.cnn} fontWeight={600}>3x3 커널</text>
              {/* 화살표 */}
              <motion.line x1={160} y1={90} x2={200} y2={90} stroke={C.cnn} strokeWidth={1.5}
                markerEnd="url(#arrCnn)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <defs><marker id="arrCnn" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill={C.cnn} /></marker></defs>
              {/* 특징맵 */}
              <rect x={210} y={50} width={80} height={80} rx={4} fill={C.cnn + '08'} stroke={C.cnn} strokeWidth={0.8} />
              <text x={250} y={85} textAnchor="middle" fontSize={9} fill={C.cnn}>특징 맵</text>
              <text x={250} y={98} textAnchor="middle" fontSize={8} fill={C.cnn} opacity={0.6}>로컬 영역만 반영</text>
              {/* 층 쌓기 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <line x1={300} y1={90} x2={330} y2={90} stroke={C.cnn} strokeWidth={1} strokeDasharray="3 2" />
                <rect x={340} y={55} width={60} height={70} rx={4} fill={C.cnn + '05'} stroke={C.cnn} strokeWidth={0.5} strokeDasharray="3 2" />
                <text x={370} y={85} textAnchor="middle" fontSize={8} fill={C.cnn}>깊은 층 필요</text>
                <text x={370} y={98} textAnchor="middle" fontSize={7} fill={C.cnn} opacity={0.5}>→ 글로벌 정보</text>
              </motion.g>
              {/* 범례 */}
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C.cnn} fontWeight={600}>
                CNN: 로컬 → 점진적 확장 → 글로벌
              </text>
            </motion.g>
          )}

          {/* Step 1: ViT global self-attention */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 패치 그리드 4x4 */}
              {[0, 1, 2, 3].map(r =>
                [0, 1, 2, 3].map(c => (
                  <motion.rect key={`p-${r}-${c}`} x={30 + c * 28} y={30 + r * 28}
                    width={24} height={24} rx={3}
                    fill={(r === 1 && c === 1) ? C.vit + '40' : C.patch + '18'}
                    stroke={(r === 1 && c === 1) ? C.vit : C.patch}
                    strokeWidth={(r === 1 && c === 1) ? 1.8 : 0.8}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: (r * 4 + c) * 0.02 }} />
                ))
              )}
              <text x={86} y={22} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.patch}>패치 토큰</text>
              {/* 어텐션 연결선: 중앙 패치 → 모든 패치 */}
              {[0, 1, 2, 3].map(r =>
                [0, 1, 2, 3].map(c => {
                  if (r === 1 && c === 1) return null;
                  const x1 = 42 + 1 * 28 + 12;
                  const y1 = 42 + 1 * 28 + 12;
                  const x2 = 42 + c * 28;
                  const y2 = 42 + r * 28;
                  return (
                    <motion.line key={`a-${r}-${c}`} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={C.attn} strokeWidth={0.8} opacity={0.4}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.3 + (r * 4 + c) * 0.02 }} />
                  );
                })
              )}
              {/* Transformer 블록 */}
              <motion.g initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <line x1={155} y1={85} x2={195} y2={85} stroke={C.vit} strokeWidth={1.5} markerEnd="url(#arrVit)" />
                <defs><marker id="arrVit" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto">
                  <path d="M0,0 L10,5 L0,10 Z" fill={C.vit} /></marker></defs>
                <ModuleBox x={200} y={60} w={110} h={50} label="Transformer" sub="Self-Attention" color={C.vit} />
                <line x1={315} y1={85} x2={345} y2={85} stroke={C.vit} strokeWidth={1.5} markerEnd="url(#arrVit)" />
                <DataBox x={350} y={68} w={90} h={34} label="글로벌 표현" sub="첫 레이어부터" color={C.vit} />
              </motion.g>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C.vit} fontWeight={600}>
                ViT: 모든 패치 → 즉시 글로벌 관계 포착
              </text>
            </motion.g>
          )}

          {/* Step 2: Paper idea */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 이미지 */}
              <rect x={20} y={40} width={64} height={64} rx={4} fill={C.patch + '15'} stroke={C.patch} strokeWidth={1} />
              {[0, 1, 2, 3].map(r =>
                [0, 1, 2, 3].map(c => (
                  <rect key={`g-${r}-${c}`} x={20 + c * 16} y={40 + r * 16} width={16} height={16}
                    fill="transparent" stroke={C.patch} strokeWidth={0.3} />
                ))
              )}
              <text x={52} y={32} textAnchor="middle" fontSize={9} fill={C.patch} fontWeight={600}>224x224</text>
              {/* 화살표 */}
              <line x1={92} y1={72} x2={120} y2={72} stroke={C.vit} strokeWidth={1.2} markerEnd="url(#arrP)" />
              <defs><marker id="arrP" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill={C.vit} /></marker></defs>
              {/* 패치 토큰 */}
              {[0, 1, 2].map(i => (
                <motion.g key={`tk-${i}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.08 }}>
                  <rect x={125} y={42 + i * 22} width={50} height={18} rx={9}
                    fill={C.patch + '15'} stroke={C.patch} strokeWidth={0.8} />
                  <text x={150} y={54 + i * 22} textAnchor="middle" fontSize={8} fill={C.patch}>
                    p{i + 1}
                  </text>
                </motion.g>
              ))}
              <text x={150} y={112} textAnchor="middle" fontSize={7} fill={C.patch} opacity={0.5}>...196개</text>
              {/* NLP Transformer */}
              <line x1={180} y1={72} x2={215} y2={72} stroke={C.vit} strokeWidth={1.2} markerEnd="url(#arrP)" />
              <ModuleBox x={220} y={48} w={100} h={48} label="NLP Transformer" sub="수정 없이 적용" color={C.vit} />
              {/* 결과 */}
              <line x1={325} y1={72} x2={355} y2={72} stroke={C.vit} strokeWidth={1.2} markerEnd="url(#arrP)" />
              <DataBox x={360} y={56} w={95} h={32} label="ImageNet SOTA" sub="88.55% Top-1" color={C.vit} outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.vit}>
                "An Image is Worth 16x16 Words"
              </text>
              <text x={240} y={166} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                Dosovitskiy et al., 2020 (Google Brain)
              </text>
            </motion.g>
          )}

          {/* Step 3: Local vs Global */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* CNN side */}
              <rect x={20} y={30} width={200} height={130} rx={8} fill={C.cnn + '06'} stroke={C.cnn} strokeWidth={0.5} />
              <text x={120} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cnn}>CNN</text>
              <text x={120} y={68} textAnchor="middle" fontSize={9} fill={C.cnn}>귀납 편향 내장</text>
              {['지역성 (Locality)', '이동 등변성', '적은 데이터 OK'].map((t, i) => (
                <motion.g key={t} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}>
                  <circle cx={50} cy={88 + i * 22} r={3} fill={C.cnn} />
                  <text x={60} y={92 + i * 22} fontSize={9} fill={C.cnn}>{t}</text>
                </motion.g>
              ))}
              {/* ViT side */}
              <rect x={260} y={30} width={200} height={130} rx={8} fill={C.vit + '06'} stroke={C.vit} strokeWidth={0.5} />
              <text x={360} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.vit}>ViT</text>
              <text x={360} y={68} textAnchor="middle" fontSize={9} fill={C.vit}>데이터에서 학습</text>
              {['편향 없음 (Flexible)', '글로벌 어텐션', '대규모 데이터 필수'].map((t, i) => (
                <motion.g key={t} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}>
                  <circle cx={290} cy={88 + i * 22} r={3} fill={C.vit} />
                  <text x={300} y={92 + i * 22} fontSize={9} fill={C.vit}>{t}</text>
                </motion.g>
              ))}
              {/* VS */}
              <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
                <circle cx={240} cy={95} r={18} fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
                <text x={240} y={99} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">vs</text>
              </motion.g>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                데이터 10만장+ → ViT 우세 | 데이터 1만장 이하 → CNN 우세
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
