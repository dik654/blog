import { motion } from 'framer-motion';
import { MONO_C, REORDER_C, MULTI_C, LIMIT_C } from './S2SAttnVisVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function HeatCell({ x, y, val, color }: { x: number; y: number; val: number; color: string }) {
  const opacity = Math.max(0.05, val);
  return (
    <g>
      <rect x={x} y={y} width={28} height={18} rx={2}
        fill={color} opacity={opacity} stroke={color} strokeWidth={0.3} />
      {val > 0.2 && (
        <text x={x + 14} y={y + 13} textAnchor="middle" fontSize={7} fontWeight={600} fill="var(--foreground)">
          {val.toFixed(1)}
        </text>
      )}
    </g>
  );
}

/** ① 단조 정렬 */
export function Step0() {
  const src = ['I', 'love', 'you'];
  const tgt = ['나는', '너를', '사랑해'];
  const matrix = [
    [0.9, 0.0, 0.0],
    [0.0, 0.1, 0.9],
    [0.0, 0.9, 0.0],
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        단조 정렬: "I love you" → "나는 너를 사랑해"
      </text>

      {src.map((s, i) => (
        <text key={i} x={135 + i * 34} y={36} textAnchor="middle" fontSize={8} fill={MONO_C}>{s}</text>
      ))}
      {tgt.map((t, i) => (
        <text key={i} x={95} y={56 + i * 22} textAnchor="end" fontSize={8} fill={MONO_C}>{t}</text>
      ))}
      {matrix.map((row, ri) =>
        row.map((val, ci) => (
          <motion.g key={`${ri}-${ci}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + ri * 0.08 + ci * 0.04 }}>
            <HeatCell x={106 + ci * 34} y={42 + ri * 22} val={val} color={MONO_C} />
          </motion.g>
        ))
      )}

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={250} y={34} width={220} height={60} rx={6}
          fill={MONO_C + '08'} stroke={MONO_C} strokeWidth={0.8} />
        <text x={360} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={MONO_C}>대각선 패턴</text>
        <text x={360} y={66} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          어순 유사 언어 쌍에서 자연 학습
        </text>
        <text x={360} y={82} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          phrase-based MT의 수작업 alignment를 자동 대체
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={30} y={112} width={420} height={36} rx={4}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={126} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          "나는"→"I"(α=0.9), "너를"→"you"(α=0.9), "사랑해"→"love"(α=0.9)
        </text>
        <text x={240} y={142} textAnchor="middle" fontSize={7} fill={MONO_C}>
          높은 대각선 값 = 1:1 매핑이 명확하게 학습됨
        </text>
      </motion.g>
    </g>
  );
}

/** ② 순서 역전 */
export function Step1() {
  const src = ['I', 'sold', 'it', 'yest.'];
  const tgt = ['어제', '나는', '그것을', '팔았다'];
  const matrix = [
    [0.0, 0.0, 0.0, 0.9],
    [0.9, 0.0, 0.0, 0.0],
    [0.0, 0.0, 0.9, 0.0],
    [0.1, 0.8, 0.0, 0.0],
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        순서 역전: "I sold it yesterday" → "어제 나는 그것을 팔았다"
      </text>

      {src.map((s, i) => (
        <text key={i} x={130 + i * 32} y={36} textAnchor="middle" fontSize={7} fill={REORDER_C}>{s}</text>
      ))}
      {tgt.map((t, i) => (
        <text key={i} x={98} y={52 + i * 20} textAnchor="end" fontSize={7} fill={REORDER_C}>{t}</text>
      ))}
      {matrix.map((row, ri) =>
        row.map((val, ci) => (
          <motion.g key={`${ri}-${ci}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.08 + ri * 0.06 + ci * 0.03 }}>
            <HeatCell x={106 + ci * 32} y={40 + ri * 20} val={val} color={REORDER_C} />
          </motion.g>
        ))
      )}

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={250} y={34} width={220} height={68} rx={6}
          fill={REORDER_C + '08'} stroke={REORDER_C} strokeWidth={0.8} />
        <text x={360} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={REORDER_C}>반대각선 요소</text>
        <text x={360} y={66} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          "어제"→"yesterday"(맨 뒤→맨 앞)
        </text>
        <text x={360} y={82} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          어순 재배치를 자동 학습
        </text>
        <text x={360} y={96} textAnchor="middle" fontSize={7} fill={REORDER_C}>
          기존 MT: 별도 reordering 모델 필요
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={30} y={120} width={420} height={28} rx={4}
          fill={REORDER_C + '06'} stroke={REORDER_C} strokeWidth={0.5} />
        <text x={240} y={138} textAnchor="middle" fontSize={8} fill={REORDER_C}>
          고정 정렬 가정 불필요 — Attention의 유연성이 핵심 장점
        </text>
      </motion.g>
    </g>
  );
}

/** ③ 다대일 · 일대다 */
export function Step2() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        비선형 정렬: 다대일, 일대다 — soft alignment
      </text>

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={26} width={220} height={68} rx={6}
          fill={MULTI_C + '10'} stroke={MULTI_C} strokeWidth={1} />
        <text x={120} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={MULTI_C}>다대일</text>
        <text x={120} y={58} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          "New York" (2토큰) → "뉴욕" (1토큰)
        </text>

        <rect x={50} y={68} width={40} height={16} rx={3}
          fill={MULTI_C + '25'} stroke={MULTI_C} strokeWidth={0.6} />
        <text x={70} y={80} textAnchor="middle" fontSize={7} fill={MULTI_C}>0.5</text>
        <rect x={100} y={68} width={40} height={16} rx={3}
          fill={MULTI_C + '25'} stroke={MULTI_C} strokeWidth={0.6} />
        <text x={120} y={80} textAnchor="middle" fontSize={7} fill={MULTI_C}>0.5</text>
        <text x={170} y={80} fontSize={7} fill="var(--muted-foreground)">← 두 소스 평균</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={245} y={26} width={225} height={68} rx={6}
          fill={LIMIT_C + '08'} stroke={LIMIT_C} strokeWidth={1} />
        <text x={358} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={LIMIT_C}>일대다</text>
        <text x={358} y={58} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          "beautiful" → "아름" + "다운"
        </text>
        <text x={358} y={74} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          여러 target 토큰이 같은 source 참조
        </text>
        <text x={358} y={88} textAnchor="middle" fontSize={7} fill={LIMIT_C}>
          BPE 토큰화에서 자연스럽게 발생
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <rect x={10} y={104} width={460} height={44} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={20} y={120} fontSize={8} fill="var(--foreground)">
          soft alignment: 연속적 가중치 → gradient flow 보장 (학습 가능)
        </text>
        <text x={20} y={136} fontSize={8} fill={MULTI_C}>
          hard alignment (1:1 매핑)과 달리 단어 경계 불일치 문제를 자연 해결
        </text>
      </motion.g>
    </g>
  );
}

/** ④ 해석 가능성 한계 */
export function Step3() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        Attention ≠ Explanation — 해석의 한계와 가능성
      </text>

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={26} width={220} height={54} rx={6}
          fill={LIMIT_C + '06'} stroke={LIMIT_C} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={120} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill={LIMIT_C}>한계</text>
        <text x={120} y={58} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          Jain & Wallace (2019)
        </text>
        <text x={120} y={72} textAnchor="middle" fontSize={7} fill={LIMIT_C}>
          Attention ≠ 정확한 중요도
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={245} y={26} width={225} height={54} rx={6}
          fill={MULTI_C + '10'} stroke={MULTI_C} strokeWidth={1} />
        <text x={358} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill={MULTI_C}>유용성</text>
        <text x={358} y={58} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          디버깅 + 직관 제공
        </text>
        <text x={358} y={72} textAnchor="middle" fontSize={7} fill={MULTI_C}>
          번역 오류 시 정렬 패턴 추적
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={10} y={90} width={460} height={56} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={20} y={106} fontSize={8} fontWeight={600} fill="var(--foreground)">
          정확한 중요도 측정: gradient attribution, Shapley value 등 별도 기법 필요
        </text>
        <text x={20} y={122} fontSize={8} fill={MONO_C}>
          Transformer: 12 layers × 12 heads = 144개 attention matrix
        </text>
        <text x={20} y={138} fontSize={7} fill="var(--muted-foreground)">
          BertViz, attention rollout 등 분석 도구로 패턴 시각화 가능
        </text>
      </motion.g>
    </g>
  );
}
