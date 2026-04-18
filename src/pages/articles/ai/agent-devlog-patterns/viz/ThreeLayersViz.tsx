import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox } from '@/components/viz/boxes';
import { STEPS, LIFECYCLE, SETUP_STEPS, RULES_SUMMARY } from './ThreeLayersData';

const W = 480, H = 220;

export default function ThreeLayersViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <LinkNetwork />}
          {step === 1 && <EventLifecycle />}
          {step === 2 && <QueryRoutes />}
          {step === 3 && <SetupSteps />}
          {step === 4 && <Enemies />}
          {step === 5 && <TeamVsPersonal />}
          {step === 6 && <RulesSummary />}
        </svg>
      )}
    </StepViz>
  );
}

function LinkNetwork() {
  const nodes = [
    { id: 'cl', label: 'Changelog', x: 240, y: 60, color: '#3b82f6' },
    { id: 'adr', label: 'ADR', x: 120, y: 150, color: '#a855f7' },
    { id: 'ls', label: 'Lessons', x: 360, y: 150, color: '#10b981' },
  ];
  const edges = [
    { from: 'cl', to: 'adr' },
    { from: 'cl', to: 'ls' },
    { from: 'adr', to: 'ls' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">세 층은 링크로 네트워크를 이룬다</text>
      {edges.map((e, i) => {
        const from = nodes.find(n => n.id === e.from)!;
        const to = nodes.find(n => n.id === e.to)!;
        return (
          <motion.line key={i}
            x1={from.x} y1={from.y + 18} x2={to.x} y2={to.y - 18}
            stroke="var(--border)" strokeWidth={1.5} strokeDasharray="4 3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }} />
        );
      })}
      {nodes.map((n, i) => (
        <motion.g key={n.id}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.1 }}>
          <rect x={n.x - 55} y={n.y - 18} width={110} height={36} rx={18}
            fill={`${n.color}20`} stroke={n.color} strokeWidth={1.5} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={11}
            fontWeight={700} fill={n.color}>{n.label}</text>
        </motion.g>
      ))}
      <text x={180} y={108} fontSize={8} fill="var(--muted-foreground)">링크</text>
      <text x={300} y={108} fontSize={8} fill="var(--muted-foreground)">링크</text>
      <text x={240} y={172} fontSize={8} fill="var(--muted-foreground)">참조</text>
    </motion.g>
  );
}

function EventLifecycle() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">사건의 99%는 Changelog에서 끝난다</text>
      {LIFECYCLE.map((l, i) => {
        const y = 52 + i * 48;
        const barW = (l.pct / 100) * 280;
        return (
          <motion.g key={l.phase}
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.1 + i * 0.12 }}
            style={{ transformOrigin: '120px center' }}>
            <text x={115} y={y + 12} textAnchor="end" fontSize={9.5}
              fontWeight={700} fill="var(--foreground)">{l.phase}</text>
            <rect x={120} y={y} width={barW} height={22}
              fill={`${l.color}30`} stroke={l.color} strokeWidth={1} />
            <text x={124 + barW} y={y + 14} fontSize={9}
              fill={l.color}>{l.pct}%</text>
            <text x={120} y={y + 36} fontSize={8}
              fill="var(--muted-foreground)">→ {l.layers.join(' + ')}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={210} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">세 층 모두 관여하는 사건은 전체의 1~2% 뿐</text>
    </motion.g>
  );
}

function QueryRoutes() {
  const routes = [
    { q: '최근 며칠 뭐 했지?', entry: 'Changelog', jump: '—', ec: '#3b82f6' },
    { q: 'memory 설계 원칙?', entry: 'Lessons', jump: '—', ec: '#10b981' },
    { q: '왜 multi-file로?', entry: 'ADR', jump: 'Lessons', ec: '#a855f7' },
    { q: '그 이슈 언제였지?', entry: 'Changelog', jump: 'Lessons', ec: '#3b82f6' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">질문 → 진입점 → (점프)</text>
      <text x={50} y={48} fontSize={8.5} fontWeight={700} fill="var(--muted-foreground)">질문</text>
      <text x={300} y={48} fontSize={8.5} fontWeight={700} fill="var(--muted-foreground)">진입</text>
      <text x={400} y={48} fontSize={8.5} fontWeight={700} fill="var(--muted-foreground)">점프</text>
      <line x1={30} y1={54} x2={450} y2={54} stroke="var(--border)" strokeWidth={0.5} />
      {routes.map((r, i) => {
        const y = 68 + i * 32;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.08 }}>
            <text x={50} y={y + 12} fontSize={9.5}
              fill="var(--foreground)">{r.q}</text>
            <rect x={275} y={y} width={80} height={20} rx={10}
              fill={`${r.ec}25`} stroke={r.ec} strokeWidth={0.8} />
            <text x={315} y={y + 14} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={r.ec}>{r.entry}</text>
            <text x={400} y={y + 14} fontSize={9}
              fill="var(--muted-foreground)">{r.jump}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={208} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">한 번 진입하면 링크를 따라 필요한 곳으로 — 세 층이 한 네트워크</text>
    </motion.g>
  );
}

function SetupSteps() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">새 프로젝트에서 0→세팅, 5분</text>
      {SETUP_STEPS.map((s, i) => {
        const y = 48 + i * 30;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.07 }}>
            <circle cx={46} cy={y + 10} r={9}
              fill="#3b82f620" stroke="#3b82f6" strokeWidth={1} />
            <text x={46} y={y + 13} textAnchor="middle" fontSize={8}
              fontWeight={700} fill="#3b82f6">{i + 1}</text>
            <text x={68} y={y + 10} fontSize={9} fontFamily="monospace"
              fill="var(--foreground)">{s.cmd}</text>
            <text x={68} y={y + 24} fontSize={8}
              fill="var(--muted-foreground)">{s.desc}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={210} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">빈 디렉토리는 만들지 않음 — 필요한 시점에 생긴다</text>
    </motion.g>
  );
}

function Enemies() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">유지의 두 가지 적</text>
      <AlertBox x={30} y={52} w={200} h={60}
        label="완벽주의" sub="빈 파일 10개 만들어 놓고 죄책감" color="#ef4444" />
      <AlertBox x={250} y={52} w={200} h={60}
        label="과도한 구조화" sub="4층, 5층 나누기 → 어디에 쓰지?" color="#ef4444" />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={80} y={136} width={320} height={48} rx={6}
          fill="#10b98115" stroke="#10b981" strokeWidth={1.2} />
        <text x={W / 2} y={158} textAnchor="middle" fontSize={10}
          fontWeight={700} fill="#10b981">해독제: "3층이면 충분 + 필요할 때만 만든다"</text>
        <text x={W / 2} y={174} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">빈 디렉토리 X / 빈 템플릿 X / 의무 필드 최소화</text>
      </motion.g>
    </motion.g>
  );
}

function TeamVsPersonal() {
  const rows = [
    { aspect: '독자', personal: '"미래의 나" 1명', team: '맥락 공유 X 팀원', color: '#3b82f6' },
    { aspect: 'Changelog', personal: '간결, 약어 OK', team: '같은 형식', color: '#3b82f6' },
    { aspect: 'ADR 상세도', personal: '"나만 알면 됨"', team: '"왜"를 더 명시적으로', color: '#a855f7' },
    { aspect: 'Lessons', personal: '암묵지 허용', team: '모든 맥락 문서화', color: '#10b981' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">개인 vs 팀 — 차이는 ADR·Lessons의 상세도</text>
      <text x={220} y={48} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">개인</text>
      <text x={380} y={48} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">팀</text>
      <line x1={40} y1={54} x2={450} y2={54} stroke="var(--border)" strokeWidth={0.5} />
      {rows.map((r, i) => {
        const y = 64 + i * 32;
        return (
          <motion.g key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.08 + i * 0.07 }}>
            <rect x={40} y={y} width={4} height={22} fill={r.color} />
            <text x={58} y={y + 14} fontSize={9} fontWeight={700}
              fill="var(--foreground)">{r.aspect}</text>
            <text x={220} y={y + 14} fontSize={9}
              fill="var(--muted-foreground)">{r.personal}</text>
            <text x={380} y={y + 14} fontSize={9}
              fill="var(--muted-foreground)">{r.team}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">Changelog는 보편, ADR·Lessons는 독자에 맞춰 상세도 조절</text>
    </motion.g>
  );
}

function RulesSummary() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">한 줄짜리 규칙 모음</text>
      {RULES_SUMMARY.map((r, i) => {
        const y = 48 + i * 32;
        return (
          <motion.g key={r.layer}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.08 }}>
            <rect x={40} y={y} width={4} height={24} fill={r.color} />
            <text x={58} y={y + 10} fontSize={10} fontWeight={700}
              fill={r.color}>{r.layer}</text>
            <text x={58} y={y + 22} fontSize={9}
              fill="var(--foreground)">{r.rule}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={210} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">이 다섯 줄을 CLAUDE.md 상단에 적어두면 AI 에이전트도 따른다</text>
    </motion.g>
  );
}
