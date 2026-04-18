import { motion } from 'framer-motion';
import { C } from './LayerNormDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.ln}>정규화 방향 차이</text>
      {/* Shape label */}
      <text x={20} y={32} fontSize={8} fontFamily={MF} fill={C.muted}>
        입력 shape: (B, N, d_model)
      </text>
      {/* BatchNorm -- B direction */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={40} width={190} height={50} rx={5}
          fill={`${C.bn}08`} stroke={C.bn} strokeWidth={1} />
        <text x={30} y={56} fontSize={9} fontWeight={600} fill={C.bn}>BatchNorm</text>
        <text x={30} y={70} fontSize={8} fill={C.muted}>B 방향 (배치 차원) 정규화</text>
        <text x={30} y={82} fontSize={7} fill={C.bn}>CNN 유리 / 패딩 문제 / 배치 크기 의존</text>
        {/* Arrow showing B direction */}
        <line x1={195} y1={55} x2={195} y2={80} stroke={C.bn} strokeWidth={1.5} />
        <polygon points="191,78 195,86 199,78" fill={C.bn} />
        <text x={200} y={68} fontSize={7} fill={C.bn}>B</text>
      </motion.g>
      {/* LayerNorm -- d direction */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={250} y={40} width={210} height={50} rx={5}
          fill={`${C.ln}10`} stroke={C.ln} strokeWidth={1.2} />
        <text x={260} y={56} fontSize={9} fontWeight={600} fill={C.ln}>LayerNorm</text>
        <text x={260} y={70} fontSize={8} fill={C.muted}>d_model 방향 (특징 차원) 정규화</text>
        <text x={260} y={82} fontSize={7} fill={C.ln}>배치 무관 / 가변 길이 OK / Transformer 표준</text>
        {/* Arrow showing d direction */}
        <line x1={260} y1={88} x2={440} y2={88} stroke={C.ln} strokeWidth={1.5} />
        <polygon points="438,84 446,88 438,92" fill={C.ln} />
        <text x={350} y={98} textAnchor="middle" fontSize={7} fill={C.ln}>d_model</text>
      </motion.g>
      {/* Key */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={100} y={108} width={280} height={18} rx={3}
          fill={`${C.ln}08`} />
        <text x={240} y={121} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ln}>
          각 토큰의 모든 특징에 걸쳐 평균/분산 계산 → 토큰 독립
        </text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  const postSteps = ['x', 'SubLayer(x)', 'x + out', 'LN(...)'];
  const preSteps = ['x', 'LN(x)', 'SubLayer(LN)', 'x + out'];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.post}>Pre-LN vs Post-LN</text>
      {/* Post-LN */}
      <text x={20} y={36} fontSize={8} fontWeight={600} fill={C.post}>Post-LN (원 Transformer)</text>
      {postSteps.map((s, i) => {
        const x = 30 + i * 100;
        return (
          <motion.g key={`post-${i}`} initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={x} y={42} width={85} height={20} rx={3}
              fill={`${C.post}10`} stroke={C.post} strokeWidth={0.8} />
            <text x={x + 42} y={56} textAnchor="middle" fontSize={7} fontFamily={MF}
              fill={C.post}>{s}</text>
            {i < postSteps.length - 1 && (
              <text x={x + 90} y={56} fontSize={8} fill={C.muted}>→</text>
            )}
          </motion.g>
        );
      })}
      {/* Pre-LN */}
      <text x={20} y={80} fontSize={8} fontWeight={600} fill={C.pre}>Pre-LN (GPT-2 이후)</text>
      {preSteps.map((s, i) => {
        const x = 30 + i * 100;
        return (
          <motion.g key={`pre-${i}`} initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.4 + i * 0.08 }}>
            <rect x={x} y={86} width={85} height={20} rx={3}
              fill={`${C.pre}10`} stroke={C.pre} strokeWidth={0.8} />
            <text x={x + 42} y={100} textAnchor="middle" fontSize={7} fontFamily={MF}
              fill={C.pre}>{s}</text>
            {i < preSteps.length - 1 && (
              <text x={x + 90} y={100} fontSize={8} fill={C.muted}>→</text>
            )}
          </motion.g>
        );
      })}
      {/* Comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={50} y={116} width={180} height={36} rx={4}
          fill={`${C.post}08`} stroke={C.post} strokeWidth={0.6} />
        <text x={60} y={130} fontSize={7} fill={C.post}>Post-LN: warmup 필수</text>
        <text x={60} y={142} fontSize={7} fill={C.post}>최종 성능 약간 좋음</text>

        <rect x={260} y={116} width={180} height={36} rx={4}
          fill={`${C.pre}08`} stroke={C.pre} strokeWidth={0.6} />
        <text x={270} y={130} fontSize={7} fill={C.pre}>Pre-LN: 학습 안정적</text>
        <text x={270} y={142} fontSize={7} fill={C.pre}>gradient flow 균일 → LLM 표준</text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.rms}>RMSNorm 단순화</text>
      {/* LayerNorm formula */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={200} height={44} rx={5}
          fill={`${C.ln}08`} stroke={C.ln} strokeWidth={1} />
        <text x={30} y={42} fontSize={8} fontWeight={600} fill={C.ln}>LayerNorm</text>
        <text x={30} y={56} fontSize={8} fontFamily={MF} fill={C.ln}>
          {'y = γ · (x-μ)/√(σ²+ε) + β'}
        </text>
        <text x={30} y={68} fontSize={7} fill={C.muted}>평균(μ) + 분산(σ²) 계산</text>
      </motion.g>
      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={220} y1={50} x2={260} y2={50} stroke={C.rms} strokeWidth={1.2} />
        <polygon points="258,46 266,50 258,54" fill={C.rms} />
        <text x={240} y={42} textAnchor="middle" fontSize={7} fill={C.rms}>단순화</text>
      </motion.g>
      {/* RMSNorm formula */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={270} y={28} width={190} height={44} rx={5}
          fill={`${C.rms}10`} stroke={C.rms} strokeWidth={1.2} />
        <text x={280} y={42} fontSize={8} fontWeight={600} fill={C.rms}>RMSNorm</text>
        <text x={280} y={56} fontSize={8} fontFamily={MF} fill={C.rms}>
          {'y = γ · x / RMS(x)'}
        </text>
        <text x={280} y={68} fontSize={7} fill={C.muted}>평균 제거 생략 → 7% 속도 향상</text>
      </motion.g>
      {/* Benefits */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={98} fontSize={8} fontWeight={600} fill={C.rms}>채택 모델:</text>
        {['LLaMA', 'Mistral', 'T5'].map((m, i) => (
          <g key={i}>
            <rect x={100 + i * 80} y={86} width={70} height={20} rx={3}
              fill={`${C.rms}12`} stroke={C.rms} strokeWidth={0.8} />
            <text x={135 + i * 80} y={100} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={C.rms}>{m}</text>
          </g>
        ))}
        <rect x={60} y={116} width={360} height={18} rx={3}
          fill={`${C.rms}06`} />
        <text x={240} y={129} textAnchor="middle" fontSize={8} fill={C.muted}>
          평균 중심화가 실질적 성능 차이 없음 → 계산량 절감이 대규모에서 누적
        </text>
      </motion.g>
    </g>
  );
}

export function Step3() {
  const variants = [
    { name: 'Pre-LN', models: 'GPT-2, GPT-3, LLaMA', color: C.pre },
    { name: 'Post-LN', models: 'Transformer, BERT', color: C.post },
    { name: 'Sandwich-LN', models: 'PaLM', color: '#8b5cf6' },
    { name: 'DeepNorm', models: '1000층 가능', color: '#ec4899' },
    { name: 'RMSNorm', models: 'LLaMA, Mistral', color: C.rms },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.ln}>위치 변형 총정리</text>
      {variants.map((v, i) => {
        const y = 28 + i * 24;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={20} y={y} width={100} height={20} rx={3}
              fill={`${v.color}15`} stroke={v.color} strokeWidth={1} />
            <text x={70} y={y + 14} textAnchor="middle" fontSize={8}
              fontWeight={700} fill={v.color}>{v.name}</text>
            <text x={130} y={y + 14} fontSize={8} fill={C.muted}>{v.models}</text>
          </motion.g>
        );
      })}
      {/* Trend summary */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={280} y={40} width={180} height={50} rx={5}
          fill={`${C.pre}08`} stroke={C.pre} strokeWidth={1} strokeDasharray="4 2" />
        <text x={370} y={58} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.pre}>
          현대 LLM 트렌드
        </text>
        <text x={370} y={74} textAnchor="middle" fontSize={8} fill={C.muted}>
          Pre-LN + RMSNorm 조합 지배적
        </text>
        <text x={370} y={86} textAnchor="middle" fontSize={8} fill={C.muted}>
          규모 커질수록 안정성 우선
        </text>
      </motion.g>
    </g>
  );
}
