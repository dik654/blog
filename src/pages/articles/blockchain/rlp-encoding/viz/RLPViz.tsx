import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const C = { blue: '#60a5fa', orange: '#f97316', green: '#22c55e', purple: '#a78bfa' };

const STEPS = [
  { label: 'Step 1: RLP의 두 가지 데이터 타입', body: 'RLP는 오직 두 가지 타입만 처리합니다: 바이트 문자열(string)과 리스트(list). 모든 Ethereum 데이터는 이 두 타입으로 표현됩니다.' },
  { label: 'Step 2: Length Prefix 인코딩 규칙', body: '데이터 길이에 따라 다른 접두사를 사용합니다. 0x80(짧은 문자열), 0xb7(긴 문자열), 0xc0(짧은 리스트), 0xf7(긴 리스트).' },
  { label: 'Step 3: 중첩 구조 인코딩 (트랜잭션)', body: 'RLP는 재귀적으로 중첩된 구조를 인코딩합니다. Ethereum 트랜잭션은 필드들의 리스트로 RLP 인코딩됩니다.' },
];

function TypeStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* String type */}
      <rect x={30} y={30} width={145} height={160} rx={8}
        fill={`${C.blue}10`} stroke={C.blue} strokeWidth={1.5} />
      <text x={102} y={52} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.blue}>
        String (bytes)
      </text>
      <text x={102} y={72} textAnchor="middle" fontSize={8} fill={C.blue} opacity={0.7}>
        바이트 문자열
      </text>
      {/* Examples */}
      {['"dog"', '"cat"', '0x04f2', '""'].map((ex, i) => (
        <g key={i}>
          <rect x={50} y={85 + i * 25} width={105} height={20} rx={4}
            fill={`${C.green}18`} stroke={C.green} strokeWidth={1} />
          <text x={102} y={99 + i * 25} textAnchor="middle" fontSize={9} fontWeight="500" fill={C.green}>
            {ex}
          </text>
        </g>
      ))}

      {/* List type */}
      <rect x={215} y={30} width={145} height={160} rx={8}
        fill={`${C.orange}10`} stroke={C.orange} strokeWidth={1.5} />
      <text x={287} y={52} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.orange}>
        List
      </text>
      <text x={287} y={72} textAnchor="middle" fontSize={8} fill={C.orange} opacity={0.7}>
        다른 항목들의 리스트
      </text>
      {['["cat","dog"]', '[[],["a"]]', '[tx fields...]', '[]'].map((ex, i) => (
        <g key={i}>
          <rect x={225} y={85 + i * 25} width={125} height={20} rx={4}
            fill={`${C.purple}18`} stroke={C.purple} strokeWidth={1} />
          <text x={287} y={99 + i * 25} textAnchor="middle" fontSize={8} fontWeight="500" fill={C.purple}>
            {ex}
          </text>
        </g>
      ))}

      <text x={195} y={215} textAnchor="middle" fontSize={8} fill={C.blue} opacity={0.6}>
        모든 Ethereum 데이터는 이 두 타입의 조합
      </text>
    </motion.g>
  );
}

function PrefixStep() {
  const rules = [
    { range: '0x00-0x7f', desc: '단일 바이트', color: C.green, ex: '"a" → [0x61]' },
    { range: '0x80+len', desc: '0-55B 문자열', color: C.blue, ex: '"dog" → [0x83,d,o,g]' },
    { range: '0xb7+...', desc: '55B+ 문자열', color: C.purple, ex: '긴 데이터' },
    { range: '0xc0+len', desc: '0-55B 리스트', color: C.orange, ex: '["cat","dog"]' },
    { range: '0xf7+...', desc: '55B+ 리스트', color: '#f43f5e', ex: '큰 리스트' },
  ];

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={195} y={22} textAnchor="middle" fontSize={10} fontWeight="700" fill={C.blue}>
        Length Prefix 규칙
      </text>
      {rules.map((r, i) => (
        <g key={i}>
          <rect x={25} y={32 + i * 36} width={80} height={26} rx={5}
            fill={`${r.color}18`} stroke={r.color} strokeWidth={1.2} />
          <text x={65} y={49 + i * 36} textAnchor="middle" fontSize={9} fontWeight="600" fill={r.color}>
            {r.range}
          </text>
          <text x={125} y={49 + i * 36} textAnchor="start" fontSize={8} fontWeight="500" fill={r.color}>
            {r.desc}
          </text>
          <rect x={230} y={32 + i * 36} width={140} height={26} rx={5}
            fill={`${r.color}10`} stroke={r.color} strokeWidth={0.8} strokeDasharray="3 2" />
          <text x={300} y={49 + i * 36} textAnchor="middle" fontSize={8} fill={r.color} opacity={0.8}>
            {r.ex}
          </text>
        </g>
      ))}
      <text x={195} y={225} textAnchor="middle" fontSize={8} fill={C.green} opacity={0.6}>
        접두사만으로 데이터 타입과 길이를 식별
      </text>
    </motion.g>
  );
}

function NestedStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={195} y={20} textAnchor="middle" fontSize={10} fontWeight="700" fill={C.orange}>
        트랜잭션 RLP 인코딩
      </text>

      {/* Outer list frame */}
      <rect x={20} y={30} width={350} height={65} rx={6}
        fill={`${C.orange}08`} stroke={C.orange} strokeWidth={1.5} />
      <text x={30} y={46} fontSize={8} fontWeight="600" fill={C.orange}>0xf8...</text>
      <text x={30} y={58} fontSize={7} fill={C.orange} opacity={0.6}>list prefix</text>

      {/* Individual fields */}
      {[
        { label: 'nonce', w: 38 },
        { label: 'gasPrice', w: 48 },
        { label: 'gasLimit', w: 46 },
        { label: 'to', w: 30 },
        { label: 'value', w: 38 },
        { label: 'data', w: 34 },
      ].map((f, i) => {
        const x = 80 + i * (f.w + 8);
        return (
          <g key={i}>
            <rect x={x} y={38} width={f.w} height={20} rx={3}
              fill={`${C.blue}18`} stroke={C.blue} strokeWidth={1} />
            <text x={x + f.w / 2} y={52} textAnchor="middle" fontSize={6.5} fontWeight="500" fill={C.blue}>
              {f.label}
            </text>
          </g>
        );
      })}

      {/* v, r, s fields */}
      <rect x={80} y={65} width={24} height={18} rx={3}
        fill={`${C.purple}18`} stroke={C.purple} strokeWidth={1} />
      <text x={92} y={78} textAnchor="middle" fontSize={7} fontWeight="500" fill={C.purple}>v</text>
      <rect x={110} y={65} width={24} height={18} rx={3}
        fill={`${C.purple}18`} stroke={C.purple} strokeWidth={1} />
      <text x={122} y={78} textAnchor="middle" fontSize={7} fontWeight="500" fill={C.purple}>r</text>
      <rect x={140} y={65} width={24} height={18} rx={3}
        fill={`${C.purple}18`} stroke={C.purple} strokeWidth={1} />
      <text x={152} y={78} textAnchor="middle" fontSize={7} fontWeight="500" fill={C.purple}>s</text>
      <text x={200} y={78} fontSize={7} fill={C.purple} opacity={0.7}>← ECDSA 서명</text>

      {/* Arrow to hash */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <line x1={195} y1={100} x2={195} y2={120} stroke={C.green} strokeWidth={1.5} markerEnd="url(#arrowG)" />
        <text x={210} y={113} fontSize={7} fill={C.green} opacity={0.7}>keccak256</text>
      </motion.g>

      {/* Hash result */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <rect x={95} y={125} width={200} height={26} rx={5}
          fill={`${C.green}18`} stroke={C.green} strokeWidth={1.5} />
        <text x={195} y={142} textAnchor="middle" fontSize={8} fontWeight="600" fill={C.green}>
          txHash: 0x5c504ed432...
        </text>
      </motion.g>

      {/* Process flow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={195} y={175} textAnchor="middle" fontSize={8} fill={C.orange} opacity={0.8}>
          RLP(tx) → keccak256 → txHash → 서명 → 전파
        </text>
        <text x={195} y={195} textAnchor="middle" fontSize={7} fill={C.blue} opacity={0.6}>
          재귀적 인코딩: 각 필드가 개별 RLP → 전체를 리스트로 감싸기
        </text>
      </motion.g>

      {/* Arrow marker */}
      <defs>
        <marker id="arrowG" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={C.green} />
        </marker>
      </defs>
    </motion.g>
  );
}

export default function RLPViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 390 230" className="w-full max-w-[460px]" style={{ height: 'auto' }}>
          {step === 0 && <TypeStep />}
          {step === 1 && <PrefixStep />}
          {step === 2 && <NestedStep />}
        </svg>
      )}
    </StepViz>
  );
}
