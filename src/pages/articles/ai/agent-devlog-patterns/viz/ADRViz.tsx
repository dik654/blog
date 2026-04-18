import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, ADR_FIELDS, ADR_SECTIONS, ADR_VS_OTHER } from './ADRData';

const W = 480, H = 220;

export default function ADRViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <WhatIsADR />}
          {step === 1 && <PromotionBar />}
          {step === 2 && <FileNumbering />}
          {step === 3 && <Template />}
          {step === 4 && <RealExample />}
          {step === 5 && <Superseded />}
          {step === 6 && <ADRvsOther />}
        </svg>
      )}
    </StepViz>
  );
}

function WhatIsADR() {
  const sections = [
    { label: 'Context', desc: '왜 결정이 필요?', color: '#3b82f6' },
    { label: 'Decision', desc: '무엇을 골랐나', color: '#a855f7' },
    { label: 'Consequences', desc: '얻은 것 · 잃은 것', color: '#10b981' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">ADR — 결정을 1등 시민으로 기록</text>
      {sections.map((s, i) => {
        const x = 40 + i * 140;
        return (
          <motion.g key={s.label}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}>
            <rect x={x} y={56} width={120} height={72} rx={6}
              fill={`${s.color}15`} stroke={s.color} strokeWidth={1.2} />
            <text x={x + 60} y={82} textAnchor="middle" fontSize={11}
              fontWeight={700} fill={s.color}>{s.label}</text>
            <text x={x + 60} y={102} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">{s.desc}</text>
          </motion.g>
        );
      })}
      <line x1={160} y1={92} x2={180} y2={92} stroke="var(--muted-foreground)" strokeWidth={0.8} />
      <line x1={300} y1={92} x2={320} y2={92} stroke="var(--muted-foreground)" strokeWidth={0.8} />
      <text x={W / 2} y={160} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">code diff로는 못 남는 "탐색한 대안"이 여기에 들어간다</text>
      <text x={W / 2} y={178} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">"왜 이것을 골랐는가" + "무엇을 버렸는가"가 핵심</text>
    </motion.g>
  );
}

function PromotionBar() {
  const bars = [
    { label: 'bug fix', level: 1, target: 'Changelog', color: '#3b82f6' },
    { label: 'prompt tuning', level: 1, target: 'Changelog', color: '#3b82f6' },
    { label: 'routing 조정', level: 2, target: 'Changelog', color: '#3b82f6' },
    { label: '새 LLM 추가', level: 3, target: 'ADR 고민', color: '#f59e0b' },
    { label: '구조 변경', level: 4, target: 'ADR', color: '#a855f7' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">승격 기준: 6개월 뒤의 내가 배경을 이해할 수 있을까</text>
      {bars.map((b, i) => {
        const y = 48 + i * 28;
        const barW = 60 + b.level * 50;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.08 }}>
            <text x={130} y={y + 12} textAnchor="end" fontSize={9} fontWeight={700}
              fill="var(--foreground)">{b.label}</text>
            <rect x={140} y={y} width={barW} height={18}
              fill={`${b.color}30`} stroke={b.color} strokeWidth={0.8} />
            <text x={145 + barW} y={y + 12} fontSize={8}
              fontWeight={700} fill={b.color}>{b.target}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">ADR은 높은 문턱 — 한 달에 1~3개, 프로젝트 전체 3~5개가 적정선</text>
    </motion.g>
  );
}

function FileNumbering() {
  const files = [
    { num: '001', slug: 'dev-journaling-pattern', status: 'accepted' },
    { num: '002', slug: 'memory-sandwich', status: 'accepted' },
    { num: '003', slug: 'provider-agnostic-gateway', status: 'accepted' },
    { num: '004', slug: 'legacy-single-json', status: 'superseded' },
    { num: '005', slug: 'memory-b-multifile', status: 'accepted' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">lessons/decisions/NNN-short-slug.md</text>
      <rect x={40} y={48} width={400} height={148} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      {files.map((f, i) => {
        const y = 66 + i * 26;
        const isSuper = f.status === 'superseded';
        return (
          <motion.g key={f.num}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.07 }}>
            <text x={56} y={y} fontSize={9} fontWeight={700}
              fontFamily="monospace" fill="#a855f7">{f.num}-</text>
            <text x={88} y={y} fontSize={9}
              fontFamily="monospace" fill={isSuper ? 'var(--muted-foreground)' : 'var(--foreground)'}
              textDecoration={isSuper ? 'line-through' : undefined}>{f.slug}.md</text>
            <text x={420} y={y} textAnchor="end" fontSize={8}
              fill={isSuper ? '#ef4444' : '#10b981'}>{f.status}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={210} textAnchor="middle" fontSize={8.5}
        fill="var(--muted-foreground)">번호는 재사용하지 않음 — 폐기된 결정도 연대기 안에 남는다</text>
    </motion.g>
  );
}

function Template() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">frontmatter + 4섹션 템플릿</text>
      <rect x={30} y={46} width={200} height={150} rx={4}
        fill="#3b82f608" stroke="#3b82f6" strokeWidth={0.8} />
      <text x={46} y={64} fontSize={9} fontWeight={700} fill="#3b82f6">frontmatter</text>
      {ADR_FIELDS.map((f, i) => (
        <motion.g key={f.name}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.06 }}>
          <text x={46} y={80 + i * 22} fontSize={9} fontFamily="monospace"
            fontWeight={700} fill={f.color}>{f.name}:</text>
          <text x={46} y={91 + i * 22} fontSize={8}
            fill="var(--muted-foreground)">{f.desc}</text>
        </motion.g>
      ))}

      <rect x={250} y={46} width={200} height={150} rx={4}
        fill="#a855f708" stroke="#a855f7" strokeWidth={0.8} />
      <text x={266} y={64} fontSize={9} fontWeight={700} fill="#a855f7">본문 5섹션</text>
      {ADR_SECTIONS.map((s, i) => (
        <motion.g key={s.name}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.06 }}>
          <text x={266} y={80 + i * 22} fontSize={9} fontWeight={700}
            fill="#a855f7">## {s.name}</text>
          <text x={266} y={91 + i * 22} fontSize={8}
            fill="var(--muted-foreground)">{s.desc}</text>
        </motion.g>
      ))}
    </motion.g>
  );
}

function RealExample() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">001-dev-journaling-pattern.md 발췌</text>
      <rect x={30} y={44} width={420} height={158} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      {[
        { l: '---', color: 'var(--muted-foreground)' },
        { l: 'id: 001', color: '#3b82f6' },
        { l: 'title: Dev journaling 3-layer pattern', color: '#3b82f6' },
        { l: 'status: accepted', color: '#10b981' },
        { l: 'date: 2026-04-15', color: '#3b82f6' },
        { l: '---', color: 'var(--muted-foreground)' },
        { l: '', color: '' },
        { l: '## Context', color: '#a855f7' },
        { l: 'git log만으로는 "왜"가 사라진다 ...', color: 'var(--foreground)' },
        { l: '', color: '' },
        { l: '## Alternatives', color: '#a855f7' },
        { l: '(a) Keep-a-Changelog only — 결정 맥락 X', color: 'var(--foreground)' },
        { l: '(b) ADR only — 일상 변경 누락', color: 'var(--foreground)' },
        { l: '(c) 프리폼 devlog — 검색 불가', color: 'var(--foreground)' },
      ].map((line, i) => (
        <motion.text key={i}
          x={46} y={62 + i * 11}
          fontSize={8.5} fontFamily="monospace"
          fill={line.color}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.05 + i * 0.03 }}>
          {line.l}
        </motion.text>
      ))}
    </motion.g>
  );
}

function Superseded() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">결정이 뒤집힐 때 — 파일을 지우지 않는다</text>
      <rect x={40} y={56} width={170} height={70} rx={4}
        fill="var(--card)" stroke="#a3a3a3" strokeWidth={0.8} />
      <text x={56} y={74} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">004-legacy-single-json.md</text>
      <text x={56} y={90} fontSize={8.5} fill="var(--muted-foreground)">status:</text>
      <text x={96} y={90} fontSize={8.5} fontWeight={700} fill="#ef4444">superseded by 005</text>
      <text x={56} y={106} fontSize={8.5} fill="var(--muted-foreground)">내용 그대로 보존</text>

      <text x={220} y={98} fontSize={14} fontWeight={700}
        fill="var(--muted-foreground)">→</text>

      <rect x={250} y={56} width={200} height={70} rx={4}
        fill="#a855f708" stroke="#a855f7" strokeWidth={1} />
      <text x={266} y={74} fontSize={9} fontWeight={700} fill="#a855f7">005-memory-b-multifile.md</text>
      <text x={266} y={90} fontSize={8.5} fill="var(--foreground)">status: accepted</text>
      <text x={266} y={106} fontSize={8.5} fill="var(--foreground)">supersedes: 004</text>

      <text x={W / 2} y={160} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">두 파일이 공존 → "언제 왜 생각이 바뀌었는가"가 남는다</text>
      <text x={W / 2} y={178} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">미래의 내가 같은 고민을 할 때 이 연쇄가 답이 된다</text>
    </motion.g>
  );
}

function ADRvsOther() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">무엇이 어디로 가는가</text>
      {ADR_VS_OTHER.map((e, i) => {
        const y = 48 + i * 26;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 + i * 0.06 }}>
            <rect x={40} y={y} width={240} height={20} rx={3}
              fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
            <text x={54} y={y + 14} fontSize={9}
              fill="var(--foreground)">{e.item}</text>
            <text x={290} y={y + 14} fontSize={10} fill="var(--muted-foreground)">→</text>
            <rect x={310} y={y} width={130} height={20} rx={3}
              fill={`${e.color}30`} stroke={e.color} strokeWidth={0.8} />
            <text x={375} y={y + 14} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={e.color}>{e.target}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={208} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">unique 결정 = ADR / 반복 판단 = Lessons / 일상 변경 = Changelog</text>
    </motion.g>
  );
}
