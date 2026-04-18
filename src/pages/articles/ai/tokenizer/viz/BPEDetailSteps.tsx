import { motion } from 'framer-motion';
import { C } from './BPEDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

/* ── Training Steps ── */

export function TrainStep0() {
  const chars = ['l', 'o', 'w', '</w>'];
  const gap = 8;
  const charWidths = chars.map(c => Math.max(c.length * 9, 24));
  const charOffsets = charWidths.reduce<number[]>((acc, tw, i) => {
    acc.push(i === 0 ? 120 : acc[i - 1] + charWidths[i - 1] + gap);
    return acc;
  }, []);
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.init}>Step 1: 초기화</text>
      {/* Word */}
      <rect x={20} y={24} width={60} height={24} rx={4}
        fill={`${C.init}10`} stroke={C.init} strokeWidth={1} />
      <text x={50} y={40} textAnchor="middle" fontSize={9} fontWeight={600}
        fontFamily={MF} fill={C.init}>"low"</text>
      {/* Arrow */}
      <line x1={80} y1={36} x2={110} y2={36} stroke={C.init} strokeWidth={1} />
      <polygon points="108,32 116,36 108,40" fill={C.init} />
      {/* Split chars */}
      {chars.map((c, i) => {
        const tw = charWidths[i];
        const x = charOffsets[i];
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={x} y={24} width={tw} height={24} rx={4}
              fill={`${C.init}12`} stroke={C.init} strokeWidth={1} />
            <text x={x + tw / 2} y={40} textAnchor="middle" fontSize={9}
              fontWeight={600} fontFamily={MF} fill={C.init}>{c}</text>
          </motion.g>
        );
      })}
      {/* Freq table */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={20} y={72} fontSize={8} fontWeight={600} fill={C.muted}>word_freq:</text>
        <text x={20} y={86} fontSize={8} fontFamily={MF} fill={C.freq}>
          "low{'</w>'}": 5,  "lower{'</w>'}": 2,  "newest": 6
        </text>
        <text x={20} y={100} fontSize={8} fill={C.muted}>
          초기 어휘 = 256바이트 + {'</w>'} = 257개
        </text>
      </motion.g>
      {/* Vocab counter */}
      <rect x={370} y={20} width={90} height={30} rx={5}
        fill={`${C.init}08`} stroke={C.init} strokeWidth={1} />
      <text x={415} y={32} textAnchor="middle" fontSize={8} fill={C.muted}>vocab</text>
      <text x={415} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.init}>257</text>
    </g>
  );
}

export function TrainStep1() {
  const pairs = [
    { a: 'l', b: 'o', freq: 7, top: true },
    { a: 'o', b: 'w', freq: 7, top: true },
    { a: 'w', b: '</w>', freq: 5, top: false },
    { a: 'e', b: 'r', freq: 2, top: false },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.freq}>Step 2: 인접 쌍 빈도</text>
      {/* Pair frequency table */}
      <text x={30} y={36} fontSize={8} fontWeight={600} fill={C.muted}>쌍</text>
      <text x={130} y={36} fontSize={8} fontWeight={600} fill={C.muted}>빈도</text>
      <line x1={20} y1={40} x2={200} y2={40} stroke="var(--border)" strokeWidth={0.5} />
      {pairs.map((p, i) => {
        const y = 54 + i * 22;
        const color = p.top ? C.merge : C.muted;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <text x={30} y={y} fontSize={9} fontFamily={MF} fill={color}>
              ("{p.a}", "{p.b}")
            </text>
            <text x={140} y={y} fontSize={9} fontWeight={p.top ? 700 : 400}
              fill={color}>{p.freq}</text>
            {p.top && (
              <text x={170} y={y} fontSize={8} fill={C.merge}>
                ← 최대
              </text>
            )}
          </motion.g>
        );
      })}
      {/* Highlight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={250} y={30} width={200} height={50} rx={5}
          fill={`${C.merge}10`} stroke={C.merge} strokeWidth={1}
          strokeDasharray="4 2" />
        <text x={350} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.merge}>argmax = ("l","o") 빈도 7</text>
        <text x={350} y={64} textAnchor="middle" fontSize={8} fill={C.muted}>
          단순 빈도 = BPE의 핵심 기준
        </text>
      </motion.g>
    </g>
  );
}

export function TrainStep2() {
  const before = ['l', 'o', 'w', '</w>'];
  const after = ['lo', 'w', '</w>'];
  const gap = 8;
  const bWidths = before.map(c => Math.max(c.length * 9, 22));
  const bOffsets = bWidths.reduce<number[]>((acc, tw, i) => {
    acc.push(i === 0 ? 80 : acc[i - 1] + bWidths[i - 1] + gap);
    return acc;
  }, []);
  const aWidths = after.map(c => Math.max(c.length * 9, 22));
  const aOffsets = aWidths.reduce<number[]>((acc, tw, i) => {
    acc.push(i === 0 ? 80 : acc[i - 1] + aWidths[i - 1] + gap);
    return acc;
  }, []);
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.merge}>Step 3: 병합 + 업데이트</text>
      {/* Before */}
      <text x={20} y={36} fontSize={8} fill={C.muted}>병합 전:</text>
      {before.map((c, i) => {
        const tw = bWidths[i];
        const x = bOffsets[i];
        return (
          <g key={`b-${i}`}>
            <rect x={x} y={24} width={tw} height={22} rx={3}
              fill={`${C.init}10`} stroke={C.init} strokeWidth={0.8} />
            <text x={x + tw / 2} y={39} textAnchor="middle" fontSize={8}
              fontFamily={MF} fill={C.init}>{c}</text>
          </g>
        );
      })}
      {/* Merge indicator -- arrow from between first two boxes */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <line x1={bOffsets[0] + bWidths[0] / 2 + (bWidths[0] / 2 + gap / 2)}
          y1={50}
          x2={bOffsets[0] + bWidths[0] / 2 + (bWidths[0] / 2 + gap / 2)}
          y2={66}
          stroke={C.merge} strokeWidth={1.2} />
        <polygon points={`${bOffsets[0] + bWidths[0] + gap / 2 - 4},64 ${bOffsets[0] + bWidths[0] + gap / 2},72 ${bOffsets[0] + bWidths[0] + gap / 2 + 4},64`} fill={C.merge} />
        <text x={bOffsets[1] + bWidths[1] + gap + 10} y={64} fontSize={8} fontWeight={600} fill={C.merge}>
          ("l","o") → "lo"
        </text>
      </motion.g>
      {/* After */}
      <text x={20} y={88} fontSize={8} fill={C.muted}>병합 후:</text>
      {after.map((c, i) => {
        const tw = aWidths[i];
        const x = aOffsets[i];
        const isNew = c === 'lo';
        return (
          <motion.g key={`a-${i}`} initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.3 + i * 0.08 }}>
            <rect x={x} y={76} width={tw} height={22} rx={3}
              fill={isNew ? `${C.merge}15` : `${C.init}10`}
              stroke={isNew ? C.merge : C.init}
              strokeWidth={isNew ? 1.5 : 0.8} />
            <text x={x + tw / 2} y={91} textAnchor="middle" fontSize={8}
              fontFamily={MF} fontWeight={isNew ? 700 : 400}
              fill={isNew ? C.merge : C.init}>{c}</text>
          </motion.g>
        );
      })}
      {/* Repeat indicator */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={280} y={24} width={180} height={70} rx={5}
          fill={`${C.freq}08`} stroke={C.freq} strokeWidth={1} />
        <text x={370} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.freq}>
          반복 수렴
        </text>
        <text x={290} y={58} fontSize={8} fill={C.muted}>merges: [("l","o"), ...]</text>
        <text x={290} y={72} fontSize={8} fill={C.muted}>vocab: 257 + n개</text>
        <text x={290} y={86} fontSize={8} fill={C.freq}>
          len(vocab) == target까지
        </text>
      </motion.g>
    </g>
  );
}

export function TrainStep3() {
  const stages = [
    { tokens: ['l', 'o', 'w', 'e', 'r'], label: '문자 분해' },
    { tokens: ['lo', 'w', 'er'], label: 'merges 적용' },
    { tokens: ['low', 'er'], label: '연쇄 병합' },
  ];
  const gap = 8;
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.freq}>추론: merges 순서대로 적용</text>
      <text x={20} y={30} fontSize={8} fill={C.muted}>입력: "lower"</text>
      {stages.map((s, si) => {
        const y = 40 + si * 38;
        const tWidths = s.tokens.map(t => Math.max(t.length * 10, 20));
        const tOffsets = tWidths.reduce<number[]>((acc, tw, i) => {
          acc.push(i === 0 ? 100 : acc[i - 1] + tWidths[i - 1] + gap);
          return acc;
        }, []);
        return (
          <motion.g key={si} initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: si * 0.2 }}>
            <text x={20} y={y + 14} fontSize={8} fill={C.muted}>{s.label}:</text>
            {s.tokens.map((t, ti) => {
              const tw = tWidths[ti];
              const x = tOffsets[ti];
              return (
                <g key={ti}>
                  <rect x={x} y={y} width={tw} height={22} rx={3}
                    fill={`${C.freq}10`} stroke={C.freq} strokeWidth={0.8} />
                  <text x={x + tw / 2} y={y + 14} textAnchor="middle" fontSize={8}
                    fontFamily={MF} fill={C.freq}>{t}</text>
                </g>
              );
            })}
            {si < stages.length - 1 && (
              <line x1={90} y1={y + 22} x2={90} y2={y + 34}
                stroke={C.merge} strokeWidth={0.8} strokeDasharray="2 2" />
            )}
          </motion.g>
        );
      })}
      {/* Complexity */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={300} y={40} width={160} height={60} rx={5}
          fill={`${C.init}08`} stroke={C.init} strokeWidth={1} />
        <text x={380} y={58} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.init}>
          시간 복잡도
        </text>
        <text x={310} y={74} fontSize={8} fill={C.muted}>Naive: O(|corpus| x V)</text>
        <text x={310} y={88} fontSize={8} fill={C.freq}>Tiktoken: Rust 최적화</text>
      </motion.g>
    </g>
  );
}

/* ── Byte-level Steps ── */

export function ByteStep0() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.byte}>
        문제: 문자 기반 BPE의 한계
      </text>
      {/* Problem boxes */}
      {[
        { label: '유니코드 복잡', desc: '다국어 전처리 필요', y: 28 },
        { label: 'OOV 발생', desc: '이모지, 신규 언어', y: 60 },
        { label: '언어 의존', desc: '언어별 별도 처리', y: 92 },
      ].map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <rect x={20} y={p.y} width={140} height={26} rx={4}
            fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
          <text x={30} y={p.y + 11} fontSize={8} fontWeight={600} fill="#ef4444">
            {p.label}
          </text>
          <text x={30} y={p.y + 22} fontSize={7} fill={C.muted}>{p.desc}</text>
        </motion.g>
      ))}
      {/* Solution arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={170} y1={70} x2={220} y2={70} stroke={C.byte} strokeWidth={1.2} />
        <polygon points="218,66 226,70 218,74" fill={C.byte} />
        <rect x={230} y={40} width={220} height={60} rx={6}
          fill={`${C.byte}10`} stroke={C.byte} strokeWidth={1.5} />
        <text x={340} y={60} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.byte}>GPT-2 해결: Byte-level BPE</text>
        <text x={340} y={76} textAnchor="middle" fontSize={8} fill={C.muted}>
          모든 텍스트를 UTF-8 바이트로 변환 후 BPE
        </text>
        <text x={340} y={90} textAnchor="middle" fontSize={8} fill={C.byte}>
          초기 어휘 = 256바이트만으로 출발
        </text>
      </motion.g>
    </g>
  );
}

export function ByteStep1() {
  const bytes = ['EC', '95', '88', 'EB', '85', '95'];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.byte}>
        Byte-level BPE: UTF-8 바이트 기반
      </text>
      {/* Korean char */}
      <rect x={20} y={28} width={50} height={30} rx={4}
        fill={`${C.byte}10`} stroke={C.byte} strokeWidth={1.2} />
      <text x={45} y={48} textAnchor="middle" fontSize={12} fontWeight={700}
        fill={C.byte}>"안녕"</text>
      {/* Arrow */}
      <line x1={70} y1={43} x2={100} y2={43} stroke={C.byte} strokeWidth={1} />
      <polygon points="98,39 106,43 98,47" fill={C.byte} />
      <text x={85} y={36} textAnchor="middle" fontSize={7} fill={C.muted}>UTF-8</text>
      {/* Bytes */}
      {bytes.map((b, i) => {
        const x = 110 + i * 36;
        const isFirst3 = i < 3;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.06 }}>
            <rect x={x} y={28} width={30} height={30} rx={3}
              fill={isFirst3 ? `${C.byte}12` : `${C.gpt}12`}
              stroke={isFirst3 ? C.byte : C.gpt} strokeWidth={1} />
            <text x={x + 15} y={40} textAnchor="middle" fontSize={7}
              fill={C.muted}>{isFirst3 ? '안' : '녕'}</text>
            <text x={x + 15} y={52} textAnchor="middle" fontSize={9}
              fontFamily={MF} fontWeight={600}
              fill={isFirst3 ? C.byte : C.gpt}>0x{b}</text>
          </motion.g>
        );
      })}
      {/* Merge arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={240} y1={58} x2={240} y2={75} stroke={C.merge} strokeWidth={1} />
        <polygon points="236,73 240,81 244,73" fill={C.merge} />
        <text x={240} y={95} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.merge}>BPE 병합으로 "안녕" 학습</text>
      </motion.g>
      {/* Pros/Cons */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={118} fontSize={8} fill={C.freq}>
          OOV 완전 해결 + 언어 독립적 + 이모지 자연 처리
        </text>
        <text x={20} y={132} fontSize={8} fill="#ef4444">
          한글 1글자 = 3바이트 → 기본 토큰 수 증가 (비효율)
        </text>
      </motion.g>
    </g>
  );
}

export function ByteStep2() {
  const models = [
    { name: 'GPT-2', vocab: '50K', year: '2019', w: 50 },
    { name: 'GPT-3', vocab: '50K', year: '2020', w: 50 },
    { name: 'GPT-4', vocab: '100K', year: '2023', w: 100 },
    { name: 'GPT-4o', vocab: '200K', year: '2024', w: 200 },
  ];
  const maxW = 200;
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.gpt}>
        GPT 시리즈 어휘 진화
      </text>
      {models.map((m, i) => {
        const y = 30 + i * 28;
        const barW = (m.w / 200) * maxW;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.12 }}>
            <text x={20} y={y + 14} fontSize={8} fontWeight={600} fill={C.gpt}>
              {m.name}
            </text>
            <text x={65} y={y + 14} fontSize={7} fill={C.muted}>{m.year}</text>
            <motion.rect x={100} y={y} width={barW} height={20} rx={3}
              fill={`${C.gpt}15`} stroke={C.gpt} strokeWidth={1}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '100px center' }}
              transition={{ ...sp, delay: 0.2 + i * 0.1 }} />
            <text x={105 + barW} y={y + 14} fontSize={8} fontWeight={600}
              fill={C.gpt}>{m.vocab}</text>
          </motion.g>
        );
      })}
      {/* Insight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={20} y={142} width={440} height={14} rx={2}
          fill={`${C.merge}08`} />
        <text x={240} y={153} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.merge}>
          GPT-4o 200K vocab: 한국어 토큰 수 ~40% 감소 -- 다국어 효율 혁신
        </text>
      </motion.g>
    </g>
  );
}
