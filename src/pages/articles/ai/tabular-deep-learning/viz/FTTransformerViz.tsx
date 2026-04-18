import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, COLORS as C, FEATURES } from './FTTransformerVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function FTTransformerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              {/* 입력 피처 → 토크나이저 → 토큰 */}
              <text x={260} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Feature Tokenizer: 피처 → d차원 토큰</text>
              {FEATURES.map((f, i) => {
                const y = 32 + i * 42;
                const isNum = f.type === 'num';
                const col = isNum ? C.num : C.cat;
                return (
                  <motion.g key={f.name} initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: i * 0.08 }}>
                    {/* 원본 피처 */}
                    <rect x={10} y={y} width={80} height={30} rx={6}
                      fill={col + '10'} stroke={col} strokeWidth={0.8} />
                    <text x={50} y={y + 13} textAnchor="middle" fontSize={9} fontWeight={600}
                      fill={col}>{f.name}</text>
                    <text x={50} y={y + 24} textAnchor="middle" fontSize={8}
                      fill="var(--muted-foreground)">{f.value}</text>
                    {/* 변환 화살표 */}
                    <line x1={92} y1={y + 15} x2={130} y2={y + 15}
                      stroke={col} strokeWidth={1} strokeDasharray="3 2" />
                    {/* 변환기 */}
                    <rect x={133} y={y + 2} width={80} height={26} rx={5}
                      fill="var(--card)" stroke={col} strokeWidth={0.6} />
                    <text x={173} y={y + 19} textAnchor="middle" fontSize={8}
                      fill={col}>{isNum ? 'W·x + b' : 'Embed(x)'}</text>
                    {/* 결과 화살표 */}
                    <line x1={215} y1={y + 15} x2={250} y2={y + 15}
                      stroke={col} strokeWidth={1} strokeDasharray="3 2" />
                    {/* 토큰 벡터 */}
                    <motion.rect x={253} y={y} width={100} height={30} rx={6}
                      fill={col + '15'} stroke={col} strokeWidth={1}
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      transition={{ ...sp, delay: i * 0.08 + 0.3 }}
                      style={{ transformOrigin: '253px center' }} />
                    <text x={303} y={y + 19} textAnchor="middle" fontSize={9} fontWeight={600}
                      fill={col}>t_{f.name} ∈ R^d</text>
                    {/* 타입 뱃지 */}
                    <rect x={360} y={y + 5} width={40} height={20} rx={10}
                      fill={col + '15'} stroke={col} strokeWidth={0.5} />
                    <text x={380} y={y + 19} textAnchor="middle" fontSize={8}
                      fill={col}>{isNum ? '수치' : '범주'}</text>
                  </motion.g>
                );
              })}
              <motion.text x={303} y={248} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                모든 피처가 동일한 d차원 → Transformer 입력 준비 완료
              </motion.text>
            </g>
          )}

          {step === 1 && (
            <g>
              {/* [CLS] + 피처 토큰 시퀀스 */}
              <text x={260} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">[CLS] 토큰 + 피처 토큰 시퀀스</text>
              {/* CLS 토큰 */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }} transition={sp}>
                <rect x={25} y={40} width={65} height={60} rx={8}
                  fill={C.cls + '15'} stroke={C.cls} strokeWidth={1.5} />
                <text x={57} y={65} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={C.cls}>[CLS]</text>
                <text x={57} y={80} textAnchor="middle" fontSize={8}
                  fill={C.cls}>학습 가능</text>
              </motion.g>
              {/* 피처 토큰들 */}
              {FEATURES.map((f, i) => {
                const col = f.type === 'num' ? C.num : C.cat;
                return (
                  <motion.g key={f.name} initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: 0.1 + i * 0.08 }}>
                    <rect x={105 + i * 80} y={40} width={65} height={60} rx={8}
                      fill={col + '10'} stroke={col} strokeWidth={0.8} />
                    <text x={137 + i * 80} y={65} textAnchor="middle" fontSize={10}
                      fontWeight={600} fill={col}>{f.name}</text>
                    <text x={137 + i * 80} y={80} textAnchor="middle" fontSize={8}
                      fill="var(--muted-foreground)">t ∈ R^d</text>
                  </motion.g>
                );
              })}
              {/* 화살표 → Transformer */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <defs>
                  <marker id="arrowDown" viewBox="0 0 10 10" refX={5} refY={8}
                    markerWidth={6} markerHeight={6} orient="auto">
                    <path d="M 0 0 L 10 0 L 5 10 z" fill={C.layer} />
                  </marker>
                </defs>
                <line x1={260} y1={108} x2={260} y2={138}
                  stroke={C.layer} strokeWidth={1.5} markerEnd="url(#arrowDown)" />
                <ModuleBox x={160} y={145} w={200} h={45}
                  label="Transformer Encoder" sub="L layers × H heads" color={C.attn} />
              </motion.g>
              {/* 최종 예측 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}>
                <line x1={260} y1={195} x2={260} y2={218}
                  stroke={C.output} strokeWidth={1.5} markerEnd="url(#arrowPred)" />
                <defs>
                  <marker id="arrowPred" viewBox="0 0 10 10" refX={5} refY={8}
                    markerWidth={6} markerHeight={6} orient="auto">
                    <path d="M 0 0 L 10 0 L 5 10 z" fill={C.output} />
                  </marker>
                </defs>
                <rect x={200} y={222} width={120} height={30} rx={8}
                  fill={C.cls + '10'} stroke={C.cls} strokeWidth={1} />
                <text x={260} y={242} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.cls}>[CLS] → 예측</text>
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              {/* Transformer 블록 상세 */}
              <text x={260} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.attn}>Transformer 블록: 피처 간 상호작용</text>
              {/* 토큰 입력 */}
              {['[CLS]', '나이', '소득', '직업', '지역', '등급'].map((name, i) => {
                const col = i === 0 ? C.cls : (i <= 2 ? C.num : C.cat);
                return (
                  <motion.g key={name} initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <rect x={15 + i * 82} y={28} width={72} height={24} rx={5}
                      fill={col + '15'} stroke={col} strokeWidth={0.6} />
                    <text x={51 + i * 82} y={44} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill={col}>{name}</text>
                  </motion.g>
                );
              })}
              {/* Self-Attention 연결선 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <g key={`attn-${i}`}>
                    <motion.line
                      x1={51} y1={52} x2={51 + i * 82} y2={52}
                      stroke={C.attn} strokeWidth={0.8} opacity={0.3}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }} />
                    <line x1={51 + i * 82} y1={52} x2={51 + i * 82} y2={66}
                      stroke={C.attn} strokeWidth={0.6} opacity={0.3} />
                  </g>
                ))}
                <text x={260} y={62} textAnchor="middle" fontSize={8}
                  fill={C.attn} fontWeight={600}>Self-Attention: 모든 피처 쌍 교차</text>
              </motion.g>
              {/* Multi-Head Attention 블록 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={30} y={72} width={460} height={40} rx={8}
                  fill={C.attn + '10'} stroke={C.attn} strokeWidth={0.8} />
                <text x={260} y={88} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.attn}>Multi-Head Self-Attention</text>
                <text x={260} y={103} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">Q=K=V = 피처 토큰 시퀀스</text>
              </motion.g>
              {/* FFN 블록 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.65 }}>
                <line x1={260} y1={112} x2={260} y2={125}
                  stroke={C.layer} strokeWidth={1} />
                <rect x={120} y={128} width={280} height={35} rx={8}
                  fill={C.ffn + '10'} stroke={C.ffn} strokeWidth={0.8} />
                <text x={260} y={148} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.ffn}>FFN: Linear → GELU → Linear</text>
                <text x={260} y={160} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">+ LayerNorm + Residual</text>
              </motion.g>
              {/* 피처 교차 예시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}>
                <rect x={30} y={178} width={460} height={65} rx={8}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={198} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">자동 피처 교차 학습</text>
                <text x={260} y={216} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  "나이" × "소득" 상호작용 → GBM에서는 수동 교차 피처 필요
                </text>
                <text x={260} y={232} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  Attention이 자동으로 관련 피처 쌍을 찾아 가중치 부여
                </text>
              </motion.g>
            </g>
          )}

          {step === 3 && (
            <g>
              {/* FT-Transformer 장점 */}
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.attn}>FT-Transformer의 강점</text>
              {/* Attention 맵 시각화 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}>
                <rect x={20} y={35} width={220} height={95} rx={8}
                  fill={C.attn + '08'} stroke={C.attn} strokeWidth={0.6} />
                <text x={130} y={52} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.attn}>해석 가능성</text>
                {/* 미니 히트맵 */}
                {['나이', '소득', '직업', '지역'].map((f, i) => (
                  <g key={f}>
                    <text x={55} y={72 + i * 14} fontSize={8} fill="var(--foreground)">{f}</text>
                    {[0.8, 0.6, 0.3, 0.1].map((v, j) => (
                      <rect key={j} x={80 + j * 30} y={62 + i * 14} width={25} height={12} rx={2}
                        fill={C.attn} opacity={v * 0.7 + 0.05}
                        stroke="var(--border)" strokeWidth={0.3} />
                    ))}
                  </g>
                ))}
                <text x={130} y={124} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">Attention weight → 피처 중요도</text>
              </motion.g>
              {/* Permutation invariant */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}>
                <rect x={260} y={35} width={240} height={95} rx={8}
                  fill={C.num + '08'} stroke={C.num} strokeWidth={0.6} />
                <text x={380} y={52} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.num}>순서 불변성</text>
                <text x={380} y={72} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">[나이, 소득, 직업] 입력</text>
                <text x={380} y={88} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">= [직업, 나이, 소득] 입력</text>
                <text x={380} y={108} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">피처 열 순서에 무관한 예측</text>
                <text x={380} y={122} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">→ 테이블 데이터에 자연스러운 귀납 편향</text>
              </motion.g>
              {/* 벤치마크 결과 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.55 }}>
                <rect x={20} y={148} width={480} height={90} rx={8}
                  fill={C.output + '06'} stroke={C.output} strokeWidth={0.6} />
                <text x={260} y={168} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.output}>벤치마크 결과 (Gorishniy et al., 2021)</text>
                {[
                  { name: '11개 데이터셋 중 6개', desc: 'GBM(XGBoost/CatBoost)과 동등 이상 성능', x: 260, y: 190 },
                  { name: '대규모 + 범주형 풍부', desc: '→ FT-Transformer 최적 영역', x: 260, y: 210 },
                  { name: '소규모 순수 수치형', desc: '→ 여전히 GBM이 우위', x: 260, y: 230 },
                ].map((r, i) => (
                  <g key={i}>
                    <text x={r.x} y={r.y} textAnchor="middle" fontSize={9}
                      fill="var(--foreground)">
                      <tspan fontWeight={600}>{r.name}</tspan>: {r.desc}
                    </text>
                  </g>
                ))}
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
