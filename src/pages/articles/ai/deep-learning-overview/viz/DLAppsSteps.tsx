import { motion } from 'framer-motion';
import { C } from './DLAppsVizData';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** Step 0: Industry applications */
export function IndustryAppsStep() {
  const sectors = [
    { label: '의료', sub: 'AlphaFold', x: 10, y: 30 },
    { label: '자율주행', sub: 'Tesla FSD', x: 130, y: 30 },
    { label: '금융', sub: '이상탐지', x: 250, y: 30 },
    { label: '제조', sub: '결함검사', x: 370, y: 30 },
    { label: '소매', sub: '추천시스템', x: 70, y: 90 },
    { label: '과학', sub: '신약개발', x: 200, y: 90 },
    { label: '안전', sub: 'Alignment', x: 330, y: 90 },
  ];

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        산업별 DL 혁신
      </text>

      {sectors.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          <ModuleBox x={s.x} y={s.y} w={100} h={44} label={s.label} sub={s.sub} color={C.industry} />
        </motion.g>
      ))}

      {/* Connections - hub-and-spoke from center */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.9 }}>
        <text x={240} y={148} textAnchor="middle" fontSize={8} fill={C.muted}>
          대규모 데이터 + 깊은 네트워크 + GPU 가속 = 전 산업 침투
        </text>
      </motion.g>
    </g>
  );
}

/** Step 1: Closed Source Frontier Models */
export function ClosedSourceStep() {
  const models = [
    { name: 'GPT-4/4o', feat: '~1.7T params', detail: 'Multi-modal, Tool use', x: 20, y: 35 },
    { name: 'Claude 3.5', feat: '200K context', detail: 'Artifacts, Computer use', x: 175, y: 35 },
    { name: 'Gemini 1.5', feat: '1M+ context', detail: 'Multi-modal, Code gen', x: 330, y: 35 },
  ];

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        Frontier Models (Closed Source)
      </text>

      {models.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.2 }}>
          <rect x={m.x} y={m.y} width={135} height={65} rx={6}
            fill="var(--background)" stroke={C.closed} strokeWidth={1} />
          {/* Color bar */}
          <rect x={m.x} y={m.y} width={135} height={5} rx={3} fill={C.closed} opacity={0.7} />
          <text x={m.x + 67} y={m.y + 24} textAnchor="middle" fontSize={10} fontWeight={700}
            fill={C.fg}>{m.name}</text>
          <text x={m.x + 67} y={m.y + 40} textAnchor="middle" fontSize={8} fontWeight={600}
            fill={C.closed}>{m.feat}</text>
          <text x={m.x + 67} y={m.y + 54} textAnchor="middle" fontSize={8}
            fill={C.muted}>{m.detail}</text>
        </motion.g>
      ))}

      {/* Common traits */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        {['긴 문맥', '멀티모달', 'Agent'].map((t, i) => (
          <g key={i}>
            <rect x={80 + i * 130} y={115} width={90} height={24} rx={12}
              fill={`${C.closed}12`} stroke={C.closed} strokeWidth={0.8} />
            <text x={125 + i * 130} y={131} textAnchor="middle" fontSize={9} fontWeight={600}
              fill={C.closed}>{t}</text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}

/** Step 2: Open Source competition */
export function OpenSourceStep() {
  const models = [
    { name: 'LLaMA-3', size: '8B~405B', org: 'Meta' },
    { name: 'Mistral', size: '~120B', org: 'Mistral' },
    { name: 'Mixtral', size: 'MoE 140B', org: 'Mistral' },
    { name: 'DeepSeek-V2', size: 'MoE 236B', org: 'DeepSeek' },
    { name: 'Qwen-2', size: '0.5B~72B', org: 'Alibaba' },
    { name: 'Gemma-2', size: '9B/27B', org: 'Google' },
  ];

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        Open Source 경쟁 가속
      </text>

      {models.map((m, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 20 + col * 155;
        const y = 32 + row * 52;

        return (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={x} y={y} width={140} height={42} rx={5}
              fill={`${C.open}08`} stroke={C.open} strokeWidth={0.8} />
            <text x={x + 70} y={y + 18} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={C.fg}>{m.name}</text>
            <text x={x + 40} y={y + 33} textAnchor="middle" fontSize={8} fill={C.open}>
              {m.size}
            </text>
            <text x={x + 105} y={y + 33} textAnchor="middle" fontSize={8} fill={C.muted}>
              {m.org}
            </text>
          </motion.g>
        );
      })}

      {/* Specialized models */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <text x={240} y={148} textAnchor="middle" fontSize={8} fill={C.muted}>
          + Codex(코드) / Whisper(음성) / SD3(이미지) / Sora(비디오)
        </text>
      </motion.g>
    </g>
  );
}

/** Step 3: Benchmarks and trends */
export function BenchmarkStep() {
  const benchmarks = [
    { name: 'MMLU', score: 86, max: 89, label: 'GPT-4 86% (Human 89%)' },
    { name: 'HumanEval', score: 90, max: 100, label: 'GPT-4 90%' },
    { name: 'GSM8K', score: 95, max: 100, label: 'Claude 3.5 95%' },
  ];
  const barMaxW = 180;

  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.fg}>
        성능 벤치마크
      </text>

      {benchmarks.map((b, i) => {
        const y = 35 + i * 32;
        const barW = (b.score / b.max) * barMaxW;

        return (
          <motion.g key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            <text x={90} y={y + 15} textAnchor="end" fontSize={10} fontWeight={600} fill={C.fg}>
              {b.name}
            </text>
            <rect x={100} y={y + 2} width={barMaxW} height={18} rx={3}
              fill="var(--border)" opacity={0.2} />
            <motion.rect x={100} y={y + 2} width={barW} height={18} rx={3}
              fill={C.trend} opacity={0.7}
              initial={{ width: 0 }} animate={{ width: barW }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }} />
            <text x={108 + barW} y={y + 16} fontSize={8} fontWeight={600} fill={C.trend}>
              {b.label}
            </text>
          </motion.g>
        );
      })}

      {/* Trend tags */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.7 }}>
        <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.fg}>
          2024 트렌드
        </text>
      </motion.g>

      {['1M+ tokens', '멀티모달', 'Agent', '효율 추론'].map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: 0.85 + i * 0.1 }}>
          <rect x={30 + i * 110} y={138} width={95} height={20} rx={10}
            fill={`${C.trend}12`} stroke={C.trend} strokeWidth={0.8} />
          <text x={77 + i * 110} y={152} textAnchor="middle" fontSize={8} fontWeight={600}
            fill={C.trend}>{t}</text>
        </motion.g>
      ))}
    </g>
  );
}
