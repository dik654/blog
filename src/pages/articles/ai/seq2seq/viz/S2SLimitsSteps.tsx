import { motion } from 'framer-motion';
import { BOTTLE_C, SEQ_C, SOLVE_C, LEGACY_C } from './S2SLimitsVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① 고정 차원 Bottleneck */
export function Step0() {
  const data = [
    { len: '<10', bleu: 22.9, w: 70 },
    { len: '10-20', bleu: 29.0, w: 100 },
    { len: '20-30', bleu: 28.6, w: 97 },
    { len: '30-40', bleu: 26.3, w: 85 },
    { len: '>40', bleu: 20.5, w: 58 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        c ∈ ℝ^d (d=512) — 모든 문장을 같은 크기 벡터에 압축
      </text>

      {data.map((d, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.06 }}>
          <text x={30} y={36 + i * 20} fontSize={8} fill="var(--foreground)">{d.len}</text>
          <motion.rect x={80} y={28 + i * 20} width={d.w} height={12} rx={3}
            fill={i === 4 ? BOTTLE_C + '30' : SOLVE_C + '20'}
            stroke={i === 4 ? BOTTLE_C : SOLVE_C} strokeWidth={0.6}
            initial={{ width: 0 }} animate={{ width: d.w }}
            transition={{ ...sp, delay: 0.15 + i * 0.06 }} />
          <text x={86 + d.w} y={38 + i * 20} fontSize={8}
            fontWeight={i === 4 ? 700 : 400}
            fill={i === 4 ? BOTTLE_C : 'var(--foreground)'}>
            BLEU {d.bleu}
          </text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={250} y={28} width={220} height={68} rx={6}
          fill={BOTTLE_C + '08'} stroke={BOTTLE_C} strokeWidth={0.8} />
        <text x={360} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={BOTTLE_C}>Bottleneck</text>
        <text x={360} y={60} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          10단어 = 100단어 = d=512
        </text>
        <text x={360} y={76} textAnchor="middle" fontSize={7} fill={BOTTLE_C}>
          40단어+ → BLEU 급락
        </text>
        <text x={360} y={90} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          Shannon: 입력 엔트로피 {'>'} 벡터 용량
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={30} y={130} width={420} height={18} rx={4}
          fill={BOTTLE_C + '06'} stroke={BOTTLE_C} strokeWidth={0.5} />
        <text x={240} y={142} textAnchor="middle" fontSize={8} fill={BOTTLE_C}>
          고정 크기 벡터의 정보 용량 한계 → Attention으로 해소
        </text>
      </motion.g>
    </g>
  );
}

/** ② 장기 의존성 + 순차 처리 */
export function Step1() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        장기 의존성 + 순차 처리 → 성능 · 효율 한계
      </text>

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={24} width={225} height={60} rx={6}
          fill={SEQ_C + '08'} stroke={SEQ_C} strokeWidth={0.8} />
        <text x={122} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={SEQ_C}>장기 의존성</text>
        <text x={122} y={56} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          앞부분 정보 → hₜ 전달 어려움
        </text>
        <text x={122} y={70} textAnchor="middle" fontSize={8} fill={SEQ_C}>
          LSTM도 ~100 토큰 한계
        </text>
        <text x={122} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          역순 입력 = 임시방편
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={245} y={24} width={225} height={60} rx={6}
          fill={BOTTLE_C + '08'} stroke={BOTTLE_C} strokeWidth={0.8} />
        <text x={358} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={BOTTLE_C}>순차 처리</text>
        <text x={358} y={56} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          Encoder·Decoder 모두 LSTM
        </text>
        <text x={358} y={70} textAnchor="middle" fontSize={8} fill={BOTTLE_C}>
          시간축 병렬화 불가
        </text>
        <text x={358} y={80} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          T=50 → 50번 순차 연산
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        {[1, 2, 3, 4, 5].map((t, i) => {
          const cx = 40 + i * 90;
          const fade = 1 - i * 0.18;
          return (
            <motion.rect key={i} x={cx - 20} y={96} width={40} height={20} rx={4}
              fill={SEQ_C} opacity={fade} stroke={SEQ_C} strokeWidth={0.5}
              initial={{ opacity: 0 }} animate={{ opacity: fade }}
              transition={{ delay: 0.4 + i * 0.06 }} />
          );
        })}
        <text x={240} y={130} textAnchor="middle" fontSize={7} fill={SEQ_C}>
          h₁ h₂ h₃ h₄ h₅ — 시간축으로 기울기 감쇠
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={30} y={138} width={420} height={16} rx={4}
          fill={SOLVE_C + '08'} stroke={SOLVE_C} strokeWidth={0.5} />
        <text x={240} y={149} textAnchor="middle" fontSize={7} fill={SOLVE_C}>
          Transformer: Self-Attention O(1) 직접 연결 + 완전 병렬 처리
        </text>
      </motion.g>
    </g>
  );
}

/** ③ 해결책 진화 */
export function Step2() {
  const timeline = [
    { year: '2015', label: 'Attention', desc: '동적 context\nbottleneck 해소', color: SOLVE_C },
    { year: '2017', label: 'Transformer', desc: 'RNN 제거\n완전 병렬', color: LEGACY_C },
    { year: '2018', label: 'BERT/GPT', desc: '사전학습\n파인튜닝', color: SEQ_C },
    { year: '2020+', label: 'Foundation', desc: 'few-shot\nzero-shot', color: BOTTLE_C },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        Seq2Seq 한계 극복의 진화 경로
      </text>

      <line x1={30} y1={50} x2={450} y2={50} stroke="var(--border)" strokeWidth={1} />

      {timeline.map((t, i) => {
        const cx = 60 + i * 110;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <circle cx={cx} cy={50} r={4} fill={t.color} />
            <text x={cx} y={40} textAnchor="middle" fontSize={8} fontWeight={600} fill={t.color}>{t.year}</text>
            <text x={cx} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
              {t.label}
            </text>
            {t.desc.split('\n').map((line, li) => (
              <text key={li} x={cx} y={82 + li * 12} textAnchor="middle" fontSize={7}
                fill="var(--muted-foreground)">{line}</text>
            ))}
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={20} y={108} width={440} height={40} rx={6}
          fill={SOLVE_C + '08'} stroke={SOLVE_C} strokeWidth={0.5} />
        <text x={30} y={124} fontSize={8} fill={SOLVE_C}>
          Attention: 모든 encoder state 저장 + 동적 선택 → bottleneck 해소
        </text>
        <text x={30} y={140} fontSize={8} fill={LEGACY_C}>
          Transformer: Multi-head(8~16) + Self-Attention → 병렬 처리 + 다각화
        </text>
      </motion.g>
    </g>
  );
}

/** ④ Seq2Seq의 유산 */
export function Step3() {
  const legacies = [
    { label: 'Encoder-Decoder', desc: 'T5, BART 등 현재까지 사용', color: LEGACY_C },
    { label: 'Autoregressive', desc: 'GPT-4, Claude 기본 생성 방식', color: SOLVE_C },
    { label: 'Teacher Forcing', desc: '현대 LLM 학습의 핵심 기법', color: SEQ_C },
    { label: 'BLEU 평가', desc: '2014년부터 번역 벤치마크 표준', color: BOTTLE_C },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        Seq2Seq의 영속적 유산 — 현대 LLM의 모든 기반
      </text>

      {legacies.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          <rect x={15 + (i % 2) * 235} y={26 + Math.floor(i / 2) * 58} width={220} height={48} rx={6}
            fill={l.color + '10'} stroke={l.color} strokeWidth={1} />
          <text x={125 + (i % 2) * 235} y={44 + Math.floor(i / 2) * 58}
            textAnchor="middle" fontSize={10} fontWeight={700} fill={l.color}>{l.label}</text>
          <text x={125 + (i % 2) * 235} y={62 + Math.floor(i / 2) * 58}
            textAnchor="middle" fontSize={8} fill="var(--foreground)">{l.desc}</text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={30} y={140} width={420} height={16} rx={4}
          fill={LEGACY_C + '08'} stroke={LEGACY_C} strokeWidth={0.5} />
        <text x={240} y={151} textAnchor="middle" fontSize={8} fill={LEGACY_C}>
          2014년 Seq2Seq → 2024년 LLM: 10년간 패러다임의 근간
        </text>
      </motion.g>
    </g>
  );
}
