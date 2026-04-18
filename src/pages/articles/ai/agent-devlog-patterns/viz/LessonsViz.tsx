import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, PRINCIPLE_VS_RECIPE, LESSON_TOPICS, MEMORY_FILE_STRUCTURE } from './LessonsData';

const W = 480, H = 220;

export default function LessonsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ConvergeByTopic />}
          {step === 1 && <PrincipleVsRecipe />}
          {step === 2 && <TopicDirectories />}
          {step === 3 && <FileTemplate />}
          {step === 4 && <MemoryArchExample />}
          {step === 5 && <UpdateFlow />}
          {step === 6 && <NotInLessons />}
          {step === 7 && <IncidentFlow />}
        </svg>
      )}
    </StepViz>
  );
}

function ConvergeByTopic() {
  const events = [0.15, 0.35, 0.55, 0.75];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">시간순 이벤트 → 주제별 원칙으로 수렴</text>
      <line x1={40} y1={86} x2={440} y2={86} stroke="var(--border)" strokeWidth={0.8} />
      <text x={40} y={76} fontSize={8} fill="var(--muted-foreground)">time →</text>
      {events.map((t, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}>
          <circle cx={40 + t * 400} cy={86} r={5} fill="#3b82f6" />
          <text x={40 + t * 400} y={70} textAnchor="middle" fontSize={8}
            fill="#3b82f6">event {i + 1}</text>
        </motion.g>
      ))}
      {events.map((t, i) => (
        <motion.line key={`l${i}`}
          x1={40 + t * 400} y1={92} x2={W / 2} y2={148}
          stroke="#a855f7" strokeWidth={1} opacity={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.08 }} />
      ))}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}>
        <rect x={W / 2 - 100} y={148} width={200} height={42} rx={6}
          fill="#a855f715" stroke="#a855f7" strokeWidth={1.2} />
        <text x={W / 2} y={168} textAnchor="middle" fontSize={10}
          fontWeight={700} fill="#a855f7">agent-memory-architecture.md</text>
        <text x={W / 2} y={182} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">원칙 하나로 수렴 (업데이트 축적)</text>
      </motion.g>
    </motion.g>
  );
}

function PrincipleVsRecipe() {
  const colorMap: Record<string, string> = {
    principle: '#10b981',
    recipe: '#a3a3a3',
  };
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">원칙과 레시피 — 어디로 가는가</text>
      {PRINCIPLE_VS_RECIPE.map((e, i) => {
        const y = 40 + i * 28;
        const color = colorMap[e.kind];
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.06 }}>
            <rect x={30} y={y} width={250} height={20} rx={3}
              fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
            <text x={42} y={y + 14} fontSize={8.5}
              fill="var(--foreground)">{e.item}</text>
            <text x={290} y={y + 14} fontSize={10}
              fill="var(--muted-foreground)">→</text>
            <rect x={310} y={y} width={130} height={20} rx={3}
              fill={`${color}30`} stroke={color} strokeWidth={0.8} />
            <text x={375} y={y + 14} textAnchor="middle" fontSize={8.5}
              fontWeight={700} fill={color}>{e.where}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={210} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">"반복 가능한 판단" 만 Lessons 에 — 그 외는 코드/커밋/docs 에 맡긴다</text>
    </motion.g>
  );
}

function TopicDirectories() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">lessons/{'<topic>'}/ — 디렉토리가 주제</text>
      {LESSON_TOPICS.map((t, i) => {
        const y = 48 + i * 30;
        return (
          <motion.g key={t.name}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.08 }}>
            <rect x={40} y={y} width={4} height={22} fill={t.color} />
            <text x={58} y={y + 14} fontSize={10} fontWeight={700}
              fontFamily="monospace" fill={t.color}>{t.name}/</text>
            <text x={200} y={y + 14} fontSize={9}
              fill="var(--muted-foreground)">{t.desc}</text>
            <text x={420} y={y + 14} textAnchor="end" fontSize={8.5}
              fill="var(--muted-foreground)">{t.files} files</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">디렉토리 8개 초과 시 주제 재정리 — 흩어질수록 수렴이 안 된다</text>
    </motion.g>
  );
}

function FileTemplate() {
  const flow = [
    { label: 'Problem', desc: '무엇에 대한 판단인가', color: '#3b82f6' },
    { label: 'Naive', desc: '가장 먼저 떠오르는 접근', color: '#a3a3a3' },
    { label: 'Right', desc: '실제로 되는 접근', color: '#10b981' },
    { label: 'Why', desc: '5가지 이유', color: '#a855f7' },
    { label: 'Cost', desc: 'trade-off', color: '#f59e0b' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Lessons 파일의 전형적 흐름</text>
      {flow.map((f, i) => {
        const x = 30 + i * 88;
        return (
          <motion.g key={f.label}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}>
            <rect x={x} y={70} width={76} height={52} rx={6}
              fill={`${f.color}15`} stroke={f.color} strokeWidth={1} />
            <text x={x + 38} y={92} textAnchor="middle" fontSize={10}
              fontWeight={700} fill={f.color}>{f.label}</text>
            <text x={x + 38} y={108} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">{f.desc}</text>
            {i < flow.length - 1 && (
              <text x={x + 80} y={100} fontSize={10}
                fill="var(--muted-foreground)">→</text>
            )}
          </motion.g>
        );
      })}
      <text x={W / 2} y={170} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">"대조"가 핵심 — Naive 와 Right 를 나란히 두면 원칙이 선명해진다</text>
      <text x={W / 2} y={188} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">코드 블록은 설명이 아니라 대조용으로만</text>
    </motion.g>
  );
}

function MemoryArchExample() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">agent-memory-architecture.md 발췌</text>
      <rect x={40} y={44} width={400} height={158} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      {MEMORY_FILE_STRUCTURE.map((f, i) => {
        const y = 60 + i * 11;
        const colorMap: Record<string, string> = {
          h1: '#3b82f6',
          h2: '#a855f7',
          body: 'var(--foreground)',
          blank: 'transparent',
        };
        const weight = f.kind === 'h1' || f.kind === 'h2' ? 700 : 400;
        return (
          <motion.text key={i}
            x={56} y={y}
            fontSize={8.5} fontFamily="monospace"
            fontWeight={weight}
            fill={colorMap[f.kind]}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.05 + i * 0.03 }}>
            {f.line}
          </motion.text>
        );
      })}
    </motion.g>
  );
}

function UpdateFlow() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">두 번째 유사 사건 → 기존 파일 업데이트</text>
      <rect x={30} y={56} width={170} height={60} rx={4}
        fill="#a855f708" stroke="#a855f7" strokeWidth={1} />
      <text x={46} y={74} fontSize={9} fontWeight={700} fill="#a855f7">agent-memory-arch.md</text>
      <text x={46} y={90} fontSize={8.5} fill="var(--muted-foreground)">## Problem</text>
      <text x={46} y={104} fontSize={8.5} fill="var(--muted-foreground)">## Why</text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <text x={215} y={92} fontSize={12}
          fill="var(--muted-foreground)">→</text>
        <text x={220} y={108} fontSize={8} fill="var(--muted-foreground)">Known risks</text>
        <text x={220} y={120} fontSize={8} fill="var(--muted-foreground)">섹션 추가</text>
      </motion.g>

      <rect x={270} y={56} width={180} height={86} rx={4}
        fill="#a855f715" stroke="#a855f7" strokeWidth={1.2} />
      <text x={286} y={74} fontSize={9} fontWeight={700} fill="#a855f7">agent-memory-arch.md</text>
      <text x={286} y={90} fontSize={8.5} fill="var(--muted-foreground)">## Problem</text>
      <text x={286} y={104} fontSize={8.5} fill="var(--muted-foreground)">## Why</text>
      <text x={286} y={118} fontSize={8.5} fontWeight={700} fill="#10b981">## Known risks ★ new</text>
      <text x={286} y={132} fontSize={8} fill="var(--muted-foreground)">rewrite 방식의 위험</text>

      <text x={W / 2} y={168} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">새 파일 X — 기존 파일이 점점 성숙</text>
      <text x={W / 2} y={184} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">원칙의 일관성이 유지되고 Lessons 층이 얇게 유지된다</text>
    </motion.g>
  );
}

function NotInLessons() {
  const items = [
    { bad: '"이 에러는 .env 에 X=Y 추가"', reason: '디버깅 레시피 → 코드/커밋', color: '#ef4444' },
    { bad: '"컴포넌트 A가 B를 호출"', reason: '아키텍처 설명 → docs/', color: '#ef4444' },
    { bad: '"2026-04-16 memory wipeout"', reason: '사건 단일 기록 → Changelog', color: '#ef4444' },
    { bad: '"Gateway 경유 유일 규칙"', reason: 'unique 결정 → ADR', color: '#ef4444' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Lessons 에 들어가면 안 되는 것</text>
      {items.map((it, i) => {
        const y = 46 + i * 36;
        return (
          <motion.g key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.08 + i * 0.08 }}>
            <rect x={30} y={y} width={420} height={28} rx={4}
              fill={`${it.color}10`} stroke={it.color} strokeWidth={0.8}
              strokeDasharray="4 3" />
            <text x={46} y={y + 12} fontSize={9}
              fill="var(--foreground)">{it.bad}</text>
            <text x={46} y={y + 22} fontSize={8}
              fill={it.color}>{it.reason}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={208} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">Lessons = "반복 가능한 판단" 만 — 나머지는 다른 층이 진실</text>
    </motion.g>
  );
}

function IncidentFlow() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Memory B wipeout — 한 사건이 두 파일을 성숙시킴</text>
      <rect x={30} y={44} width={180} height={30} rx={4}
        fill="#3b82f615" stroke="#3b82f6" strokeWidth={0.8} />
      <text x={46} y={63} fontSize={9} fontWeight={700}
        fill="#3b82f6">Event: Memory B wipeout</text>

      <line x1={120} y1={76} x2={120} y2={94} stroke="var(--muted-foreground)" strokeWidth={0.6} />
      <line x1={80} y1={94} x2={380} y2={94} stroke="var(--muted-foreground)" strokeWidth={0.6} />
      <line x1={80} y1={94} x2={80} y2={110} stroke="var(--muted-foreground)" strokeWidth={0.6} />
      <line x1={380} y1={94} x2={380} y2={110} stroke="var(--muted-foreground)" strokeWidth={0.6} />

      <rect x={20} y={112} width={200} height={60} rx={4}
        fill="#a855f708" stroke="#a855f7" strokeWidth={1} />
      <text x={36} y={130} fontSize={9} fontWeight={700} fill="#a855f7">agent-memory-architecture.md</text>
      <text x={36} y={144} fontSize={8.5} fill="var(--muted-foreground)">+ Known risks 섹션</text>
      <text x={36} y={158} fontSize={8.5} fill="var(--muted-foreground)">(rewrite 방식의 위험)</text>

      <rect x={260} y={112} width={200} height={60} rx={4}
        fill="#10b98108" stroke="#10b981" strokeWidth={1} />
      <text x={276} y={130} fontSize={9} fontWeight={700} fill="#10b981">llm-promise-vs-capability.md</text>
      <text x={276} y={144} fontSize={8.5} fill="var(--muted-foreground)">+ tool hallucination</text>
      <text x={276} y={158} fontSize={8.5} fill="var(--muted-foreground)">(reverse case)</text>

      <text x={W / 2} y={195} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">한 사건이 서로 다른 두 주제를 건드리면 두 파일을 동시에 업데이트</text>
    </motion.g>
  );
}
