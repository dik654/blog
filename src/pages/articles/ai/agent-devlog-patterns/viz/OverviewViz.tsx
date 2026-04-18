import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, LAYERS, QUESTIONS } from './OverviewData';

const W = 480, H = 220;

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ProblemFlow />}
          {step === 1 && <GitLogLimit />}
          {step === 2 && <ThreeQuestions />}
          {step === 3 && <ThreeLayers />}
          {step === 4 && <QueryRouting />}
          {step === 5 && <MaintenanceCost />}
          {step === 6 && <ArticleMap />}
        </svg>
      )}
    </StepViz>
  );
}

function ProblemFlow() {
  const events = [
    { label: 'harness 버그', day: 'Mon' },
    { label: 'tool 실패', day: 'Tue' },
    { label: 'memory drift', day: 'Wed' },
    { label: '?', day: '3주 후' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">개인 에이전트 개발 — 문제와 수정의 끝없는 흐름</text>
      <line x1={40} y1={110} x2={440} y2={110} stroke="var(--border)" strokeWidth={1} />
      {events.map((e, i) => {
        const x = 60 + i * 120;
        const isLast = i === events.length - 1;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}>
            <circle cx={x} cy={110} r={6}
              fill={isLast ? '#ef4444' : '#3b82f6'} />
            <text x={x} y={92} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={isLast ? '#ef4444' : '#3b82f6'}>{e.label}</text>
            <text x={x} y={130} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">{e.day}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={162} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">3주 후 같은 증상 재발 — "저번에 어떻게 고쳤지?"</text>
      <text x={W / 2} y={180} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">해결 맥락이 사라지는 루프</text>
    </motion.g>
  );
}

function GitLogLimit() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">git log는 "무엇을" — "왜"는 사라진다</text>
      <rect x={40} y={50} width={400} height={90} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      {[
        'c2c9260  fix memory drift',
        '951d0da  refactor routing',
        'a8cd101  update prompt',
        'aec88f0  fix',
        'ee2e9db  .',
      ].map((line, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.06 }}>
          <text x={56} y={70 + i * 15} fontSize={9} fontFamily="monospace"
            fill="var(--foreground)">{line}</text>
        </motion.g>
      ))}
      <text x={W / 2} y={162} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">"왜 이 접근을 골랐는가" / "어떤 대안을 버렸는가"가 안 남는다</text>
      <text x={W / 2} y={178} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">실패한 시도, 뒤집은 결정도 흔적이 없다</text>
    </motion.g>
  );
}

function ThreeQuestions() {
  const colors = ['#3b82f6', '#a855f7', '#10b981'];
  const qs = [
    { axis: '시간 축', q: '"2주 전에 그 이슈 언제?"' },
    { axis: '결정 축', q: '"이 아키텍처 왜 이렇게?"' },
    { axis: '원칙 축', q: '"비슷한 상황 어느 판단?"' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">조회 질문은 세 종류다</text>
      {qs.map((item, i) => {
        const y = 52 + i * 44;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}>
            <rect x={40} y={y} width={4} height={34} fill={colors[i]} />
            <text x={56} y={y + 14} fontSize={10} fontWeight={700}
              fill={colors[i]}>{item.axis}</text>
            <text x={56} y={y + 30} fontSize={10}
              fill="var(--foreground)">{item.q}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={200} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">한 파일이 셋을 다 감당하면 어느 쪽도 제대로 못 한다</text>
    </motion.g>
  );
}

function ThreeLayers() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">세 층으로 분리 — 각자 다른 조회 질문 담당</text>
      {LAYERS.map((l, i) => {
        const y = 46 + i * 52;
        return (
          <motion.g key={l.id}
            initial={{ opacity: 0, y: y + 4 }} animate={{ opacity: 1, y }}
            transition={{ delay: 0.1 + i * 0.1 }}>
            <rect x={40} y={0} width={4} height={42} fill={l.color} />
            <text x={56} y={14} fontSize={11} fontWeight={700}
              fill={l.color}>{l.name}</text>
            <text x={150} y={14} fontSize={9}
              fill="var(--muted-foreground)">{l.q}</text>
            <text x={56} y={28} fontSize={8.5}
              fill="var(--muted-foreground)">{l.struct}</text>
            <text x={56} y={40} fontSize={8.5}
              fill="var(--muted-foreground)">{l.unit}</text>
          </motion.g>
        );
      })}
    </motion.g>
  );
}

function QueryRouting() {
  const colorMap: Record<string, string> = {
    changelog: '#3b82f6',
    adr: '#a855f7',
    lessons: '#10b981',
  };
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">질문이 층을 지정한다</text>
      {QUESTIONS.map((q, i) => {
        const y = 44 + i * 26;
        const color = colorMap[q.target];
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.06 }}>
            <rect x={30} y={y} width={260} height={20} rx={3}
              fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
            <text x={42} y={y + 14} fontSize={9}
              fill="var(--foreground)">{q.q}</text>
            <text x={300} y={y + 14} fontSize={9} fill="var(--muted-foreground)">→</text>
            <rect x={320} y={y} width={110} height={20} rx={3}
              fill={`${color}30`} stroke={color} strokeWidth={0.8} />
            <text x={375} y={y + 14} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={color}>{q.target}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">층들은 서로 링크로 연결돼 네트워크를 이룬다</text>
    </motion.g>
  );
}

function MaintenanceCost() {
  const rows = [
    { name: 'Changelog', freq: '매 작업', time: '1분', size: '3~5줄', color: '#3b82f6' },
    { name: 'ADR', freq: '중요 결정', time: '10분', size: '10~20줄', color: '#a855f7' },
    { name: 'Lessons', freq: '교훈 수렴 시', time: '20분', size: '주제 수렴', color: '#10b981' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">유지 비용 — "짧게 자주"가 원칙</text>
      <text x={90} y={52} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">층</text>
      <text x={210} y={52} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">빈도</text>
      <text x={300} y={52} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">소요</text>
      <text x={390} y={52} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">크기</text>
      <line x1={40} y1={58} x2={440} y2={58} stroke="var(--border)" strokeWidth={0.5} />
      {rows.map((r, i) => {
        const y = 74 + i * 32;
        return (
          <motion.g key={r.name}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}>
            <rect x={40} y={y - 12} width={4} height={24} fill={r.color} />
            <text x={90} y={y + 4} fontSize={10} fontWeight={700} fill={r.color}>{r.name}</text>
            <text x={210} y={y + 4} fontSize={9} fill="var(--foreground)">{r.freq}</text>
            <text x={300} y={y + 4} fontSize={9} fill="var(--foreground)">{r.time}</text>
            <text x={390} y={y + 4} fontSize={9} fill="var(--foreground)">{r.size}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={200} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">길게 쓰려는 순간 유지가 깨진다 — 짧은 엔트리가 오래 간다</text>
    </motion.g>
  );
}

function ArticleMap() {
  const sections = [
    { n: '2', name: 'Changelog', color: '#3b82f6' },
    { n: '3', name: 'ADR', color: '#a855f7' },
    { n: '4', name: 'Lessons', color: '#10b981' },
    { n: '5', name: '세 층 분담', color: '#f59e0b' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">이 글의 남은 4개 섹션</text>
      {sections.map((s, i) => {
        const x = 50 + i * 108;
        return (
          <motion.g key={s.n}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}>
            <rect x={x} y={60} width={96} height={60} rx={6}
              fill={`${s.color}15`} stroke={s.color} strokeWidth={1.2} />
            <text x={x + 48} y={82} textAnchor="middle" fontSize={11}
              fontWeight={700} fill={s.color}>§{s.n}</text>
            <text x={x + 48} y={100} textAnchor="middle" fontSize={9}
              fontWeight={600} fill="var(--foreground)">{s.name}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={160} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">각 섹션은 한 층의 포맷·규칙·유지 흐름을 깊게 본다</text>
      <text x={W / 2} y={180} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">마지막 섹션에서 세 층의 상호작용과 자동화를 묶는다</text>
    </motion.g>
  );
}
