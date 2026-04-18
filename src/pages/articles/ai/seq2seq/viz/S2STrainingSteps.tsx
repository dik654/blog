import { motion } from 'framer-motion';
import { TF_C, FR_C, LOSS_C, SS_C } from './S2STrainingVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① Teacher Forcing */
export function Step0() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        입력 = 정답 시퀀스 (shifted),  병렬 학습 가능
      </text>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <text x={20} y={34} fontSize={8} fontWeight={600} fill={TF_C}>입력:</text>
        {['<SOS>', 'y₁', 'y₂', 'y₃'].map((t, i) => (
          <g key={i}>
            <rect x={60 + i * 70} y={24} width={55} height={20} rx={4}
              fill={TF_C + '15'} stroke={TF_C} strokeWidth={0.8} />
            <text x={87 + i * 70} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={TF_C}>{t}</text>
          </g>
        ))}
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <text x={20} y={62} fontSize={8} fontWeight={600} fill={LOSS_C}>타겟:</text>
        {['y₁', 'y₂', 'y₃', '<EOS>'].map((t, i) => (
          <g key={i}>
            <rect x={60 + i * 70} y={52} width={55} height={20} rx={4}
              fill={LOSS_C + '12'} stroke={LOSS_C} strokeWidth={0.8} />
            <text x={87 + i * 70} y={66} textAnchor="middle" fontSize={9} fontWeight={600} fill={LOSS_C}>{t}</text>
          </g>
        ))}
      </motion.g>

      {[0, 1, 2, 3].map(i => (
        <motion.line key={i} x1={87 + i * 70} y1={46} x2={87 + i * 70} y2={52}
          stroke="var(--border)" strokeWidth={0.6}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.05 }} />
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <rect x={20} y={82} width={440} height={62} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={30} y={98} fontSize={8} fill={TF_C}>
          장점: 모든 타임스텝 한 번에 병렬 계산 — GPU 행렬 연산 효율 극대화
        </text>
        <text x={30} y={114} fontSize={8} fill="var(--foreground)">
          장점: 이전 스텝 예측 오류가 다음 입력에 영향 없음 — 빠른 수렴
        </text>
        <text x={30} y={130} fontSize={8} fill={FR_C}>
          단점: 추론 시 정답 없음 → 학습/추론 동작 불일치 (exposure bias)
        </text>
      </motion.g>
    </g>
  );
}

/** ② Free Running */
export function Step1() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        추론 시: 이전 예측 ŷₜ₋₁ → 다음 입력 (오류 누적)
      </text>

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        {['<SOS>', 'ŷ₁✓', 'ŷ₂✗', 'ŷ₃✗✗'].map((t, i) => {
          const bad = i >= 2;
          return (
            <g key={i}>
              <rect x={30 + i * 110} y={28} width={90} height={28} rx={5}
                fill={bad ? FR_C + '15' : TF_C + '10'}
                stroke={bad ? FR_C : TF_C} strokeWidth={bad ? 1.2 : 0.8}
                strokeDasharray={bad ? '4 2' : 'none'} />
              <text x={75 + i * 110} y={46} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={bad ? FR_C : TF_C}>{t}</text>
              {i < 3 && (
                <motion.path d={`M${122 + i * 110},${42} L${138 + i * 110},${42}`}
                  stroke={bad ? FR_C : 'var(--border)'} strokeWidth={0.8}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }} />
              )}
            </g>
          );
        })}
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        {[
          { label: '오류 크기', bars: [0.05, 0.15, 0.45, 0.80] },
        ].map((row, ri) => (
          <g key={ri}>
            <text x={20} y={74} fontSize={8} fill="var(--foreground)">{row.label}</text>
            {row.bars.map((v, i) => (
              <motion.rect key={i} x={85 + i * 110} y={66} width={v * 60} height={8} rx={3}
                fill={v > 0.3 ? FR_C + '40' : TF_C + '25'}
                stroke={v > 0.3 ? FR_C : TF_C} strokeWidth={0.5}
                initial={{ width: 0 }} animate={{ width: v * 60 }}
                transition={{ ...sp, delay: 0.4 + i * 0.08 }} />
            ))}
          </g>
        ))}
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={20} y={86} width={440} height={56} rx={6}
          fill={FR_C + '06'} stroke={FR_C} strokeWidth={0.5} />
        <text x={30} y={102} fontSize={8} fill="var(--foreground)">
          P_train(yₜ₋₁) = 정답,  P_test(yₜ₋₁) = 모델 예측 — 분포 불일치
        </text>
        <text x={30} y={118} fontSize={8} fill={FR_C}>
          한 스텝 오류 → 다음 입력이 학습 때 본 적 없는 분포 → 오류 증폭
        </text>
        <text x={30} y={134} fontSize={7} fill="var(--muted-foreground)">
          문장이 길수록 누적 오류 심화 — 긴 번역에서 품질 급락의 원인
        </text>
      </motion.g>
    </g>
  );
}

/** ③ 손실 함수와 역전파 경로 */
export function Step2() {
  const blocks = [
    { label: 'softmax', desc: 'P(yₜ)', color: LOSS_C },
    { label: 'Decoder', desc: 'LSTM 전체', color: TF_C },
    { label: 'Encoder', desc: 'LSTM 전체', color: SS_C },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        L → softmax → Decoder LSTM → Encoder LSTM (하나의 역전파)
      </text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={20} y={28} width={60} height={30} rx={5}
          fill={FR_C + '15'} stroke={FR_C} strokeWidth={1.2} />
        <text x={50} y={47} textAnchor="middle" fontSize={10} fontWeight={700} fill={FR_C}>L</text>
      </motion.g>

      {blocks.map((b, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
          <line x1={82 + i * 130} y1={43} x2={110 + i * 130} y2={43}
            stroke={b.color} strokeWidth={1} />
          <text x={96 + i * 130} y={38} textAnchor="middle" fontSize={7} fill={FR_C}>∂L</text>
          <rect x={112 + i * 130} y={28} width={100} height={30} rx={5}
            fill={b.color + '10'} stroke={b.color} strokeWidth={1} />
          <text x={162 + i * 130} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill={b.color}>
            {b.label}
          </text>
          <text x={162 + i * 130} y={54} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            {b.desc}
          </text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={20} y={70} width={440} height={74} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={30} y={86} fontSize={8} fill={LOSS_C}>
          L = −Σₜ log P(yₜ | y{'<'}ₜ^true, X) — teacher forcing 적용 cross-entropy
        </text>
        <text x={30} y={102} fontSize={8} fill="var(--foreground)">
          P(yₜ) = softmax(W·sₜ)[yₜ] — vocab 전체 확률 중 정답 토큰의 확률
        </text>
        <text x={30} y={118} fontSize={8} fill={TF_C}>
          모든 파라미터 동시 업데이트: W_enc, W_dec, W_embed, W_out
        </text>
        <text x={30} y={134} fontSize={7} fill="var(--muted-foreground)">
          하나의 계산 그래프로 encoder+decoder end-to-end 학습
        </text>
      </motion.g>
    </g>
  );
}

/** ④ Scheduled Sampling */
export function Step3() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        확률 ε로 정답, (1−ε)로 모델 예측 사용
      </text>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <text x={30} y={38} fontSize={8} fontWeight={600} fill="var(--foreground)">에포크별 ε 변화:</text>
        {[
          { epoch: '초기', eps: 1.0, w: 150, desc: '100% 정답' },
          { epoch: '중간', eps: 0.5, w: 75, desc: '50/50' },
          { epoch: '후기', eps: 0.1, w: 15, desc: '90% 예측' },
        ].map((d, i) => (
          <g key={i}>
            <text x={30} y={56 + i * 18} fontSize={8} fill="var(--foreground)">{d.epoch}</text>
            <motion.rect x={80} y={48 + i * 18} width={d.w} height={10} rx={3}
              fill={TF_C + '30'} stroke={TF_C} strokeWidth={0.5}
              initial={{ width: 0 }} animate={{ width: d.w }}
              transition={{ ...sp, delay: 0.1 + i * 0.1 }} />
            <motion.rect x={80 + d.w} y={48 + i * 18} width={150 - d.w} height={10} rx={3}
              fill={FR_C + '20'} stroke={FR_C} strokeWidth={0.5}
              initial={{ width: 0 }} animate={{ width: 150 - d.w }}
              transition={{ ...sp, delay: 0.15 + i * 0.1 }} />
            <text x={240} y={57 + i * 18} fontSize={7} fill="var(--muted-foreground)">ε={d.eps} — {d.desc}</text>
          </g>
        ))}
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={290} y={28} width={180} height={68} rx={6}
          fill={SS_C + '08'} stroke={SS_C} strokeWidth={0.8} />
        <text x={380} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={SS_C}>Scheduled Sampling</text>
        <text x={380} y={60} textAnchor="middle" fontSize={8} fill="var(--foreground)">Bengio 2015</text>
        <text x={380} y={76} textAnchor="middle" fontSize={8} fill="var(--foreground)">ε: 1→0 점진 감소</text>
        <text x={380} y={90} textAnchor="middle" fontSize={7} fill={SS_C}>학습↔추론 격차 해소</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={20} y={108} width={440} height={36} rx={4}
          fill={SS_C + '06'} stroke={SS_C} strokeWidth={0.5} />
        <text x={240} y={122} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          학습 초기: teacher forcing으로 빠른 수렴. 후기: free running에 점진 적응
        </text>
        <text x={240} y={138} textAnchor="middle" fontSize={7} fill={SS_C}>
          exposure bias 완화 — 현대 LLM에서도 curriculum learning 형태로 변형 사용
        </text>
      </motion.g>
    </g>
  );
}
