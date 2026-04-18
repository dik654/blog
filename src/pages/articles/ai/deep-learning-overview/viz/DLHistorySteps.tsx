import { motion } from 'framer-motion';
import { C } from './DLHistoryVizData';
import { DataBox, AlertBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** Step 0: Dawn 1943-1969 */
export function DawnStep() {
  const events = [
    { year: '1943', label: 'McCulloch-Pitts', desc: '이진 뉴런', x: 30 },
    { year: '1949', label: 'Hebb 학습', desc: '시냅스 강화', x: 140 },
    { year: '1958', label: 'Perceptron', desc: '학습 가능 뉴런', x: 250 },
    { year: '1969', label: 'XOR 한계', desc: 'AI Winter', x: 360 },
  ];

  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        태동기 (1943-1969)
      </text>

      {/* Timeline line */}
      <line x1={20} y1={60} x2={460} y2={60} stroke={C.dawn} strokeWidth={1.5} opacity={0.3} />

      {events.map((e, i) => {
        const isLast = i === events.length - 1;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.2 }}>
            {/* Year dot */}
            <circle cx={e.x + 40} cy={60} r={5} fill={isLast ? C.winter : C.dawn} />
            <text x={e.x + 40} y={52} textAnchor="middle" fontSize={8} fontWeight={700}
              fill={isLast ? C.winter : C.dawn}>{e.year}</text>

            {/* Card below */}
            <rect x={e.x} y={72} width={80} height={42} rx={5}
              fill="var(--background)" stroke={isLast ? C.winter : C.dawn}
              strokeWidth={isLast ? 1.2 : 0.8}
              strokeDasharray={isLast ? '4 2' : 'none'} />
            <text x={e.x + 40} y={89} textAnchor="middle" fontSize={9} fontWeight={600}
              fill={isLast ? C.winter : C.dawn}>{e.label}</text>
            <text x={e.x + 40} y={104} textAnchor="middle" fontSize={8} fill={C.muted}>
              {e.desc}
            </text>
          </motion.g>
        );
      })}

      {/* Winter annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 1.0 }}>
        <text x={400} y={130} textAnchor="middle" fontSize={8} fill={C.winter} fontWeight={600}>
          First AI Winter
        </text>
      </motion.g>
    </g>
  );
}

/** Step 1: Revival 1986-1997 */
export function RevivalStep() {
  const events = [
    { year: '1986', label: 'Backprop', desc: 'Chain rule', x: 20, color: C.revival },
    { year: '1989', label: 'LeNet', desc: '최초 CNN', x: 135, color: C.revival },
    { year: '1989', label: '만능 근사', desc: '이론 기반', x: 250, color: C.revival },
    { year: '1997', label: 'LSTM', desc: 'Vanishing 해결', x: 365, color: C.revival },
  ];

  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        부활 (1986-1997)
      </text>

      <line x1={20} y1={60} x2={460} y2={60} stroke={C.revival} strokeWidth={1.5} opacity={0.3} />

      {events.map((e, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.2 }}>
          <circle cx={e.x + 40} cy={60} r={5} fill={e.color} />
          <text x={e.x + 40} y={52} textAnchor="middle" fontSize={8} fontWeight={700} fill={e.color}>
            {e.year}
          </text>
          <rect x={e.x} y={72} width={80} height={42} rx={5}
            fill="var(--background)" stroke={e.color} strokeWidth={0.8} />
          <text x={e.x + 40} y={89} textAnchor="middle" fontSize={9} fontWeight={600} fill={e.color}>
            {e.label}
          </text>
          <text x={e.x + 40} y={104} textAnchor="middle" fontSize={8} fill={C.muted}>{e.desc}</text>
        </motion.g>
      ))}

      {/* XOR solved */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 1.0 }}>
        <text x={60} y={130} textAnchor="middle" fontSize={8} fill={C.revival} fontWeight={600}>
          XOR 문제 해결!
        </text>
      </motion.g>
    </g>
  );
}

/** Step 2: Revolution 2006-2017 */
export function RevolutionStep() {
  const events = [
    { year: '2006', label: 'DBN', desc: 'Hinton', x: 10 },
    { year: '2012', label: 'AlexNet', desc: 'GPU 학습', x: 90 },
    { year: '2014', label: 'GAN', desc: '생성 모델', x: 170 },
    { year: '2015', label: 'ResNet', desc: '152층', x: 250 },
    { year: '2017', label: 'Transformer', desc: 'Attention', x: 330 },
  ];

  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        딥러닝 혁명 (2006-2017)
      </text>

      <line x1={20} y1={60} x2={460} y2={60} stroke={C.revolution} strokeWidth={1.5} opacity={0.3} />

      {events.map((e, i) => {
        const highlight = i === 1 || i === 4;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            <circle cx={e.x + 40} cy={60} r={highlight ? 6 : 4}
              fill={C.revolution} />
            <text x={e.x + 40} y={50} textAnchor="middle" fontSize={8} fontWeight={700}
              fill={C.revolution}>{e.year}</text>

            <rect x={e.x} y={72} width={75} height={42} rx={5}
              fill={highlight ? `${C.revolution}10` : 'var(--background)'}
              stroke={C.revolution} strokeWidth={highlight ? 1.2 : 0.8} />
            <text x={e.x + 37} y={89} textAnchor="middle" fontSize={9} fontWeight={600}
              fill={C.revolution}>{e.label}</text>
            <text x={e.x + 37} y={104} textAnchor="middle" fontSize={8} fill={C.muted}>
              {e.desc}
            </text>
          </motion.g>
        );
      })}

      {/* AlexNet star */}
      <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.9 }}>
        <text x={130} y={130} textAnchor="middle" fontSize={8} fill={C.revolution} fontWeight={700}>
          ImageNet 16.4% err
        </text>
      </motion.g>
    </g>
  );
}

/** Step 3: AI Winters */
export function WintersStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        AI Winters - 왜 오래 걸렸나
      </text>

      {/* First winter */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <AlertBox x={20} y={30} w={190} h={50} label="1st Winter (1974-80)" sub="Perceptron 한계 + 연구비 삭감" color={C.winter} />
      </motion.g>

      {/* Second winter */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <AlertBox x={260} y={30} w={190} h={50} label="2nd Winter (1987-93)" sub="Expert system 한계" color={C.winter} />
      </motion.g>

      {/* Three required conditions */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.45 }}>
        <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.fg}>
          돌파를 위한 3가지 조건
        </text>
      </motion.g>

      {[
        { label: 'GPU 컴퓨팅', sub: 'GTX 580 (2012)', x: 30, color: C.revolution },
        { label: '대규모 데이터', sub: 'ImageNet 1.4M', x: 180, color: C.revival },
        { label: '알고리즘 혁신', sub: 'ReLU, Dropout, BN', x: 330, color: C.llm },
      ].map((item, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.55 + i * 0.15 }}>
          <DataBox x={item.x} y={112} w={120} h={32} label={item.label} sub={item.sub} color={item.color} />
        </motion.g>
      ))}
    </g>
  );
}

/** Step 4: LLM era */
export function LLMEraStep() {
  const events = [
    { year: '2018', label: 'BERT/GPT', x: 20 },
    { year: '2020', label: 'GPT-3', x: 110 },
    { year: '2022', label: 'ChatGPT', x: 200 },
    { year: '2023', label: 'GPT-4', x: 290 },
    { year: '2024', label: 'Claude/Gemini', x: 370 },
  ];

  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        LLM 시대 (2018-현재)
      </text>

      <line x1={20} y1={50} x2={460} y2={50} stroke={C.llm} strokeWidth={1.5} opacity={0.3} />

      {events.map((e, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.15 }}>
          <circle cx={e.x + 40} cy={50} r={4} fill={C.llm} />
          <text x={e.x + 40} y={42} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.llm}>
            {e.year}
          </text>
          <rect x={e.x} y={58} width={80} height={24} rx={4}
            fill="var(--background)" stroke={C.llm} strokeWidth={0.8} />
          <text x={e.x + 40} y={74} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.llm}>
            {e.label}
          </text>
        </motion.g>
      ))}

      {/* Trends */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.9 }}>
        <text x={240} y={105} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.fg}>
          주요 트렌드
        </text>
      </motion.g>

      {[
        { label: '멀티모달', color: C.llm, x: 40 },
        { label: 'Tool Use', color: C.revolution, x: 160 },
        { label: 'Agent/Reasoning', color: C.revival, x: 280 },
      ].map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: 1.0 + i * 0.12 }}>
          <rect x={t.x} y={115} width={110} height={24} rx={12}
            fill={`${t.color}12`} stroke={t.color} strokeWidth={0.8} />
          <text x={t.x + 55} y={131} textAnchor="middle" fontSize={9} fontWeight={600} fill={t.color}>
            {t.label}
          </text>
        </motion.g>
      ))}
    </g>
  );
}
