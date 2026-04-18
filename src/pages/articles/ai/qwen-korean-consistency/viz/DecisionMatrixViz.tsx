import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, METHODS, COVERAGE, SCENARIOS } from './DecisionMatrixData';

const W = 480, H = 220;

export default function DecisionMatrixViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <InterventionPoint />}
          {step === 1 && <CostAxis />}
          {step === 2 && <CoverageHeatmap />}
          {step === 3 && <DeploymentConstraint />}
          {step === 4 && <StackingLayers />}
          {step === 5 && <Scenarios />}
          {step === 6 && <RecommendedPath />}
        </svg>
      )}
    </StepViz>
  );
}

function InterventionPoint() {
  const levels = [
    { label: '입력 (prompt)', color: '#a3a3a3', x: 0.1 },
    { label: '출력 사후 (runtime)', color: '#10b981', x: 0.35 },
    { label: '가중치 (Smoothie)', color: '#3b82f6', x: 0.62 },
    { label: '정책 (RL)', color: '#ef4444', x: 0.88 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">어디에서 개입하는가 — 강도와 비용의 지도</text>
      <line x1={40} y1={100} x2={440} y2={100} stroke="var(--border)" strokeWidth={1} />
      <text x={40} y={92} fontSize={8.5} fill="var(--muted-foreground)">모델 밖</text>
      <text x={440} y={92} textAnchor="end" fontSize={8.5} fill="var(--muted-foreground)">모델 안</text>
      {levels.map((l, i) => {
        const x = 40 + l.x * 400;
        return (
          <motion.g key={l.label}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}>
            <circle cx={x} cy={100} r={6} fill={l.color} />
            <line x1={x} y1={106} x2={x} y2={130} stroke={l.color} strokeWidth={1} />
            <text x={x} y={144} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={l.color}>{l.label}</text>
          </motion.g>
        );
      })}
      <text x={40} y={170} fontSize={9} fill="var(--muted-foreground)">← 약함 · 싸다</text>
      <text x={440} y={170} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">강함 · 비쌈 →</text>
      <text x={W / 2} y={198} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">개입 지점이 lm_head에 가까울수록 logit 격차의 부호를 뒤집을 힘이 커진다</text>
    </motion.g>
  );
}

function CostAxis() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">1회 비용 vs 지속 비용</text>
      <text x={160} y={48} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--muted-foreground)">개발 비용 (1회)</text>
      <text x={360} y={48} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--muted-foreground)">운영 비용 (지속)</text>
      {METHODS.map((m, i) => {
        const y = 60 + i * 34;
        const devW = 14 + m.dev * 24;
        const runW = 14 + m.run * 24;
        return (
          <motion.g key={m.id}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}>
            <text x={90} y={y + 12} textAnchor="end" fontSize={9.5}
              fontWeight={700} fill={m.color}>{m.name}</text>
            <rect x={100} y={y} width={devW} height={18}
              fill={`${m.color}30`} stroke={m.color} strokeWidth={1} />
            <text x={104 + devW} y={y + 12} fontSize={8}
              fill="var(--muted-foreground)">{m.dev === 0 ? '0' : '★'.repeat(m.dev)}</text>
            <rect x={280} y={y} width={runW} height={18}
              fill={`${m.color}30`} stroke={m.color} strokeWidth={1} />
            <text x={284 + runW} y={y + 12} fontSize={8}
              fill="var(--muted-foreground)">{m.run === 0 ? '0' : '★'.repeat(m.run)}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={210} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">지속 비용은 scale 할수록 누적 — 1회 비용 해법이 장기적으로 저렴</text>
    </motion.g>
  );
}

function CoverageHeatmap() {
  const methodNames = ['prompt', 'runtime', 'smoothie', 'rl'];
  const methodColors = ['#a3a3a3', '#10b981', '#3b82f6', '#ef4444'];
  const cw = 48, ch = 22, x0 = 160, y0 = 48;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">실패 모드 × 해법 — 커버리지 히트맵</text>
      {methodNames.map((n, i) => (
        <text key={n} x={x0 + i * cw + cw / 2} y={40} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={methodColors[i]}>{n}</text>
      ))}
      {COVERAGE.map((row, r) => (
        <motion.g key={row.mode}
          initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 + r * 0.06 }}>
          <text x={x0 - 6} y={y0 + r * ch + 14} textAnchor="end" fontSize={8.5}
            fill="var(--foreground)">{row.mode}</text>
          {row.scores.map((s, c) => {
            const fillOp = Math.round(s * 80);
            return (
              <g key={c}>
                <rect x={x0 + c * cw + 2} y={y0 + r * ch + 2} width={cw - 4} height={ch - 4} rx={2}
                  fill={methodColors[c]} fillOpacity={fillOp / 100}
                  stroke={methodColors[c]} strokeWidth={0.6} />
                <text x={x0 + c * cw + cw / 2} y={y0 + r * ch + 14} textAnchor="middle"
                  fontSize={8} fontWeight={700}
                  fill={s > 0.5 ? '#fff' : 'var(--foreground)'}>{s.toFixed(2)}</text>
              </g>
            );
          })}
        </motion.g>
      ))}
      <text x={W / 2} y={205} textAnchor="middle" fontSize={8.5}
        fill="var(--muted-foreground)">숫자 = 해당 실패 모드를 잡는 비율 (0~1)</text>
    </motion.g>
  );
}

function DeploymentConstraint() {
  const rows = [
    { name: '프롬프트', weight: false, train: false, data: false, infra: false },
    { name: '런타임 가드', weight: false, train: false, data: false, infra: true },
    { name: 'Smoothie', weight: true, train: false, data: false, infra: false },
    { name: 'RL', weight: true, train: true, data: true, infra: true },
  ];
  const cols = ['가중치', '학습', '데이터셋', '인프라'];
  const x0 = 180, cw = 60, y0 = 60, ch = 28;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">배포 제약 — 무엇을 요구하는가</text>
      {cols.map((c, i) => (
        <text key={c} x={x0 + i * cw + cw / 2} y={52} textAnchor="middle"
          fontSize={8.5} fontWeight={700} fill="var(--foreground)">{c}</text>
      ))}
      {rows.map((row, r) => {
        const vals = [row.weight, row.train, row.data, row.infra];
        return (
          <motion.g key={row.name}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.05 + r * 0.06 }}>
            <text x={x0 - 8} y={y0 + r * ch + 16} textAnchor="end" fontSize={9}
              fontWeight={700} fill="var(--foreground)">{row.name}</text>
            {vals.map((v, c) => (
              <g key={c}>
                <rect x={x0 + c * cw + 4} y={y0 + r * ch + 4} width={cw - 8} height={ch - 8} rx={2}
                  fill={v ? '#ef444430' : '#10b98120'}
                  stroke={v ? '#ef4444' : '#10b981'} strokeWidth={0.6} />
                <text x={x0 + c * cw + cw / 2} y={y0 + r * ch + 17} textAnchor="middle"
                  fontSize={9} fontWeight={700}
                  fill={v ? '#ef4444' : '#10b981'}>{v ? '필요' : '—'}</text>
              </g>
            ))}
          </motion.g>
        );
      })}
      <text x={W / 2} y={195} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">대부분 팀의 현실적 최대치는 Smoothie까지 — RL은 제약 4개 전부 필요</text>
    </motion.g>
  );
}

function StackingLayers() {
  const layers = [
    { label: 'Layer 4: RL fine-tune (선택)', color: '#ef4444', y: 50, optional: true },
    { label: 'Layer 3: 런타임 hybrid 가드', color: '#10b981', y: 82 },
    { label: 'Layer 2: Smoothie-Qwen 모델', color: '#3b82f6', y: 114 },
    { label: 'Layer 1: 최소 프롬프트 가드레일', color: '#a3a3a3', y: 146 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">4가지 해법은 stacking으로 쓰는 게 정상</text>
      {layers.map((l, i) => (
        <motion.g key={l.label}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}>
          <rect x={60} y={l.y} width={360} height={24} rx={4}
            fill={`${l.color}${l.optional ? '15' : '25'}`}
            stroke={l.color} strokeWidth={1}
            strokeDasharray={l.optional ? '4 3' : undefined} />
          <text x={240} y={l.y + 16} textAnchor="middle" fontSize={10}
            fontWeight={700} fill={l.color}>{l.label}</text>
        </motion.g>
      ))}
      <text x={W / 2} y={192} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">대부분 Layer 1~3의 3층으로 충분 — Layer 4는 잔여 문제가 명확할 때만</text>
    </motion.g>
  );
}

function Scenarios() {
  const stackColors: Record<string, string> = {
    prompt: '#a3a3a3',
    runtime: '#10b981',
    smoothie: '#3b82f6',
    rl: '#ef4444',
  };
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">상황별 추천 조합</text>
      {SCENARIOS.map((s, i) => {
        const y = 46 + i * 30;
        return (
          <motion.g key={s.id}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.07 }}>
            <text x={130} y={y + 14} textAnchor="end" fontSize={9.5}
              fontWeight={700} fill={s.color}>{s.label}</text>
            {s.stack.map((m, j) => (
              <g key={m}>
                <rect x={140 + j * 76} y={y + 3} width={72} height={18} rx={3}
                  fill={`${stackColors[m]}30`}
                  stroke={stackColors[m]} strokeWidth={0.8} />
                <text x={176 + j * 76} y={y + 15} textAnchor="middle" fontSize={8}
                  fontWeight={700} fill={stackColors[m]}>{m}</text>
              </g>
            ))}
          </motion.g>
        );
      })}
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">워크로드에 따라 stack 깊이를 조절 — 과도한 투자 회피</text>
    </motion.g>
  );
}

function RecommendedPath() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">권장 시도 순서 — 거꾸로 가면 며칠을 잃는다</text>

      <ActionBox x={30} y={56} w={140} h={40}
        label="1. Smoothie 교체" sub="비용 0 / 효과 95%" color="#3b82f6" />
      <text x={175} y={80} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ActionBox x={190} y={56} w={140} h={40}
        label="2. 잔여 측정" sub="retry rate / judge pass" color="#f59e0b" />
      <text x={335} y={80} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ActionBox x={350} y={56} w={110} h={40}
        label="3. 가드 추가" sub="regex or hybrid" color="#10b981" />

      <line x1={W / 2} y1={108} x2={W / 2} y2={130} stroke="var(--border)" strokeWidth={0.8} />

      <DataBox x={60} y={132} w={150} h={30}
        label="< 5%: regex만" color="#10b981" outlined />
      <DataBox x={220} y={132} w={150} h={30}
        label="5-20%: hybrid" color="#3b82f6" outlined />
      <DataBox x={380} y={132} w={80} h={30}
        label="> 20%" color="#ef4444" outlined />

      <line x1={W / 2} y1={164} x2={W / 2} y2={178} stroke="var(--border)" strokeWidth={0.8} />
      <ActionBox x={100} y={178} w={280} h={30}
        label="워크로드 재검토 — 프롬프트/데이터 먼저 의심"
        color="#ef4444" />
    </motion.g>
  );
}
