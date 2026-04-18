import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS as C } from './WhenDLWinsVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function WhenDLWinsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              {/* 의사결정 플로차트 */}
              <defs>
                <marker id="arrowFlow" viewBox="0 0 10 10" refX={8} refY={5}
                  markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C.neutral} />
                </marker>
              </defs>
              {/* Q1: 데이터 크기 */}
              <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={sp}>
                <rect x={170} y={10} width={180} height={32} rx={6}
                  fill={C.data + '15'} stroke={C.data} strokeWidth={1} />
                <text x={260} y={30} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.data}>샘플 수 100K 이상?</text>
              </motion.g>
              {/* No → GBM */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}>
                <line x1={170} y1={26} x2={80} y2={26}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowFlow)" />
                <text x={125} y={20} textAnchor="middle" fontSize={8} fill={C.warn}>No</text>
                <DataBox x={10} y={15} w={65} h={28} label="GBM" sub="우선" color={C.gbm} />
              </motion.g>
              {/* Yes → Q2 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}>
                <line x1={260} y1={42} x2={260} y2={68}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowFlow)" />
                <text x={270} y={58} fontSize={8} fill={C.dl}>Yes</text>
              </motion.g>
              {/* Q2: 멀티모달 */}
              <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <rect x={170} y={72} width={180} height={32} rx={6}
                  fill={C.data + '15'} stroke={C.data} strokeWidth={1} />
                <text x={260} y={92} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.data}>멀티모달 입력?</text>
              </motion.g>
              {/* Yes → DL */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}>
                <line x1={350} y1={88} x2={420} y2={88}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowFlow)" />
                <text x={385} y={82} textAnchor="middle" fontSize={8} fill={C.dl}>Yes</text>
                <DataBox x={425} y={75} w={80} h={28} label="DL 필수" sub="인코더 결합" color={C.dl} />
              </motion.g>
              {/* No → Q3 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}>
                <line x1={260} y1={104} x2={260} y2={128}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowFlow)" />
                <text x={270} y={118} fontSize={8} fill={C.warn}>No</text>
              </motion.g>
              {/* Q3: 고카디널리티 */}
              <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={155} y={132} width={210} height={32} rx={6}
                  fill={C.data + '15'} stroke={C.data} strokeWidth={1} />
                <text x={260} y={152} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.data}>고카디널리티 범주형?</text>
              </motion.g>
              {/* Yes → DL 고려 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                <line x1={365} y1={148} x2={420} y2={148}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowFlow)" />
                <text x={393} y={142} textAnchor="middle" fontSize={8} fill={C.dl}>Yes</text>
                <DataBox x={425} y={135} w={80} h={28}
                  label="DL 고려" sub="임베딩 활용" color={C.dl} />
              </motion.g>
              {/* No → Q4 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}>
                <line x1={260} y1={164} x2={260} y2={188}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowFlow)" />
                <text x={270} y={178} fontSize={8} fill={C.warn}>No</text>
              </motion.g>
              {/* Q4: 사전학습 데이터 */}
              <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={150} y={192} width={220} height={32} rx={6}
                  fill={C.data + '15'} stroke={C.data} strokeWidth={1} />
                <text x={260} y={212} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.data}>사전학습 데이터 풍부?</text>
              </motion.g>
              {/* Yes → DL */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}>
                <line x1={370} y1={208} x2={420} y2={208}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowFlow)" />
                <text x={395} y={202} textAnchor="middle" fontSize={8} fill={C.dl}>Yes</text>
                <DataBox x={425} y={195} w={80} h={28}
                  label="DL 유리" sub="전이학습" color={C.dl} />
              </motion.g>
              {/* No → GBM */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}>
                <line x1={150} y1={208} x2={85} y2={208}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowFlow)" />
                <text x={118} y={202} textAnchor="middle" fontSize={8} fill={C.warn}>No</text>
                <DataBox x={10} y={195} w={70} h={28} label="GBM" sub="최선" color={C.gbm} />
              </motion.g>
            </g>
          )}

          {step === 1 && (
            <g>
              {/* 데이터 크기 vs 성능 그래프 */}
              <text x={260} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">데이터 크기에 따른 GBM vs DL 성능</text>
              {/* 축 */}
              <line x1={60} y1={200} x2={480} y2={200}
                stroke="var(--border)" strokeWidth={1} />
              <line x1={60} y1={30} x2={60} y2={200}
                stroke="var(--border)" strokeWidth={1} />
              <text x={270} y={225} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">샘플 수 (log scale)</text>
              <text x={25} y={115} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)" transform="rotate(-90, 25, 115)">성능</text>
              {/* X축 라벨 */}
              {['1K', '10K', '50K', '100K', '500K', '1M'].map((l, i) => (
                <text key={l} x={80 + i * 76} y={215} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">{l}</text>
              ))}
              {/* GBM 곡선 */}
              <motion.path
                d="M 80 120 Q 160 75, 240 65 Q 320 58, 400 55 L 460 54"
                fill="none" stroke={C.gbm} strokeWidth={2.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }} />
              <text x={470} y={50} fontSize={9} fontWeight={600} fill={C.gbm}>GBM</text>
              {/* DL 곡선 */}
              <motion.path
                d="M 80 170 Q 160 130, 240 90 Q 320 65, 400 52 L 460 48"
                fill="none" stroke={C.dl} strokeWidth={2.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }} />
              <text x={470} y={42} fontSize={9} fontWeight={600} fill={C.dl}>DL</text>
              {/* 교차점 강조 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}>
                <circle cx={370} cy={55} r={8} fill="none" stroke={C.both}
                  strokeWidth={2} strokeDasharray="3 2" />
                <text x={370} y={40} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={C.both}>교차점</text>
                <line x1={370} y1={55} x2={370} y2={200}
                  stroke={C.both} strokeWidth={0.8} strokeDasharray="4 3" opacity={0.5} />
              </motion.g>
              {/* 영역 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}>
                <rect x={65} y={195} width={150} height={4} rx={2} fill={C.gbm} opacity={0.5} />
                <text x={140} y={240} textAnchor="middle" fontSize={8}
                  fill={C.gbm} fontWeight={600}>GBM 우위 영역</text>
                <rect x={350} y={195} width={130} height={4} rx={2} fill={C.dl} opacity={0.5} />
                <text x={415} y={240} textAnchor="middle" fontSize={8}
                  fill={C.dl} fontWeight={600}>DL 접근/추월</text>
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              {/* 앙상블 전략 */}
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.both}>실전: GBM + DL 하이브리드 전략</text>
              {/* 전략 1: 앙상블 */}
              <motion.g initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <ActionBox x={20} y={40} w={220} h={55}
                  label="전략 1: 앙상블" sub="GBM + DL 예측 평균/스태킹" color={C.both} />
                <text x={130} y={110} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">상호 보완적 오차 → 1~3% 향상</text>
              </motion.g>
              {/* 전략 2: 임베딩 추출 */}
              <motion.g initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ActionBox x={270} y={40} w={220} h={55}
                  label="전략 2: 임베딩 → GBM" sub="DL을 피처 추출기로 활용" color={C.dl} />
                <text x={380} y={110} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">범주형 임베딩 + LightGBM 조합</text>
              </motion.g>
              {/* 구체 흐름도 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={30} y={130} width={460} height={110} rx={10}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={150} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">임베딩 → GBM 파이프라인</text>
                {/* 파이프라인 */}
                <DataBox x={40} y={162} w={90} h={30}
                  label="고카디널리티" sub="10K+ 유니크" color={C.warn} />
                <line x1={135} y1={177} x2={165} y2={177}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowE)" />
                <defs>
                  <marker id="arrowE" viewBox="0 0 10 10" refX={8} refY={5}
                    markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={C.neutral} />
                  </marker>
                </defs>
                <ActionBox x={170} y={162} w={80} h={30}
                  label="Entity Embed" sub="학습" color={C.dl} />
                <line x1={255} y1={177} x2={285} y2={177}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowE)" />
                <DataBox x={290} y={162} w={80} h={30}
                  label="밀집 벡터" sub="R^d" color={C.dl} />
                <line x1={375} y1={177} x2={405} y2={177}
                  stroke={C.neutral} strokeWidth={1} markerEnd="url(#arrowE)" />
                <ActionBox x={410} y={162} w={70} h={30}
                  label="LightGBM" sub="학습" color={C.gbm} />
                <text x={260} y={215} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  Kaggle 상위 솔루션에서 가장 빈번한 패턴
                </text>
              </motion.g>
            </g>
          )}

          {step === 3 && (
            <g>
              {/* 최종 정리 */}
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">테이블 DL의 현재와 미래</text>
              {/* 현재 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={35} width={230} height={95} rx={8}
                  fill={C.gbm + '08'} stroke={C.gbm} strokeWidth={0.6} />
                <text x={135} y={55} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.gbm}>현재 (2024)</text>
                <text x={135} y={75} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">대부분 테이블 → GBM 우선</text>
                <text x={135} y={93} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">DL은 조건부 선택</text>
                <text x={135} y={111} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">"모델보다 피처가 더 중요"</text>
              </motion.g>
              {/* 미래 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={270} y={35} width={230} height={95} rx={8}
                  fill={C.dl + '08'} stroke={C.dl} strokeWidth={0.6} />
                <text x={385} y={55} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={C.dl}>미래</text>
                <text x={385} y={75} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">TabPFN: in-context learning</text>
                <text x={385} y={93} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">TabR: retrieval-augmented</text>
                <text x={385} y={111} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">학습 없이 추론 시점에 적응</text>
              </motion.g>
              {/* 핵심 메시지 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.55 }}>
                <rect x={40} y={150} width={440} height={90} rx={10}
                  fill={C.both + '08'} stroke={C.both} strokeWidth={1} />
                <text x={260} y={175} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={C.both}>핵심 원칙</text>
                <text x={260} y={198} textAnchor="middle" fontSize={10}
                  fill="var(--foreground)">
                  ① 피처 엔지니어링 {'>'} 모델 선택
                </text>
                <text x={260} y={216} textAnchor="middle" fontSize={10}
                  fill="var(--foreground)">
                  ② 교차 검증으로 공정 비교 — 편향된 벤치마크 주의
                </text>
                <text x={260} y={234} textAnchor="middle" fontSize={10}
                  fill="var(--foreground)">
                  ③ 앙상블이 단일 모델보다 항상 안전한 선택
                </text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
