import { motion, useReducedMotion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

function Arrow({ x1, y1, x2, y2, color = 'var(--muted-foreground)', marker = 'moe-arrow', dashed = false }: {
  x1: number; y1: number; x2: number; y2: number; color?: string; marker?: string; dashed?: boolean;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5}
      strokeDasharray={dashed ? '5 4' : undefined} markerEnd={`url(#${marker})`}
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }} transition={{ duration: 0.35 }} />
  );
}

function Box({ x, y, w, h, title, sub, color, active = true }: {
  x: number; y: number; w: number; h: number; title: string; sub?: string; color: string; active?: boolean;
}) {
  const subLines = sub?.split('|') ?? [];
  return (
    <motion.g initial={{ opacity: 0, y: 7 }} animate={{ opacity: active ? 1 : 0.25, y: 0 }}>
      <rect x={x} y={y} width={w} height={h} rx={7} fill="var(--card)" stroke={active ? color : 'var(--border)'} />
      <rect x={x} y={y} width={w} height={4} rx={2} fill={active ? color : 'var(--border)'} />
      <text x={x + w / 2} y={y + h / 2 - (subLines.length > 1 ? 12 : sub ? 5 : -4)} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--foreground)">{title}</text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + (subLines.length > 1 ? 4 : 13)} textAnchor="middle" fontSize="12" fill="var(--muted-foreground)">
          {subLines.map((line, index) => <tspan key={line} x={x + w / 2} dy={index === 0 ? 0 : 14}>{line}</tspan>)}
        </text>
      )}
    </motion.g>
  );
}

function RoutingScene({ step }: { step: number }) {
  const experts = Array.from({ length: 12 }, (_, i) => i);
  const selected = new Set([2, 9]);
  return (
    <svg viewBox="0 0 760 350" className="h-auto w-full" role="img" aria-label="Dense FFN과 sparse MoE router가 token마다 일부 expert를 선택하는 비교">
      <defs><marker id="moe-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--muted-foreground)" /></marker></defs>
      <Box x={38} y={126} w={112} h={66} title="Token hidden" sub="x at layer l" color="#2563eb" />
      {step === 0 && (
        <g>
          <Arrow x1={150} y1={159} x2={270} y2={159} color="#2563eb" />
          <Box x={278} y={98} w={228} h={122} title="Dense FFN" sub="같은 large weight를|모든 token이 사용" color="#7c3aed" />
          <Arrow x1={506} y1={159} x2={610} y2={159} color="#7c3aed" />
          <Box x={618} y={126} w={104} h={66} title="Output" sub="y" color="#0f766e" />
          <text x="392" y="264" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">매 token마다 FFN weight 전체가 필요한 경로</text>
        </g>
      )}
      {step >= 1 && (
        <g>
          <Arrow x1={150} y1={159} x2={206} y2={159} color="#2563eb" />
          <Box x={214} y={126} w={100} h={66} title="Router" sub="score → Top-k" color="#a16207" />
          {experts.map((expert) => {
            const col = expert % 6;
            const row = Math.floor(expert / 6);
            const active = step >= 2 && selected.has(expert);
            return (
              <motion.g key={expert} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: step === 1 ? 0.65 : active ? 1 : 0.2, scale: 1 }} transition={{ delay: expert * 0.025 }}>
                <rect x={368 + col * 52} y={76 + row * 82} width={40} height={54} rx={5} fill={active ? '#0f766e18' : 'var(--card)'} stroke={active ? '#0f766e' : 'var(--border)'} />
                <text x={388 + col * 52} y={108 + row * 82} textAnchor="middle" fontSize="9" fontWeight="700" fill={active ? '#0f766e' : 'var(--muted-foreground)'}>E{expert}</text>
              </motion.g>
            );
          })}
          {step >= 2 && <><Arrow x1={314} y1={151} x2={458} y2={109} color="#0f766e" /><Arrow x1={314} y1={171} x2={614} y2={191} color="#0f766e" /></>}
          {step >= 3 && (
            <g>
              <Box x={368} y={268} w={120} h={48} title="Shared expert" sub="always resident" color="#7c3aed" />
              <Box x={526} y={268} w={120} h={48} title="Weighted sum" sub="router weights" color="#0f766e" />
              <Arrow x1={488} y1={292} x2={518} y2={292} color="#7c3aed" />
              <Arrow x1={586} y1={240} x2={586} y2={260} color="#0f766e" />
            </g>
          )}
        </g>
      )}
    </svg>
  );
}

export function MoeRoutingViz() {
  return (
    <StepViz steps={[
      { label: '1. Dense FFN은 모든 token이 같은 큰 weight matrix를 읽는다.', body: 'Model storage와 token당 active compute가 거의 함께 움직인다. Layer streaming은 가능하지만 필요한 전체 layer weight를 순서대로 읽어야 한다.' },
      { label: '2. Sparse MoE는 FFN 자리에 router와 expert bank를 둔다.', body: '전체 expert는 model capacity를 키우지만 아직 어느 expert를 계산할지는 정해지지 않았다.' },
      { label: '3. Router가 현재 token hidden state에서 Top-k expert를 고른다.', body: '선택되지 않은 expert는 이 token의 compute에 참여하지 않는다. 이 sparsity가 weight-selective streaming을 가능하게 한다.' },
      { label: '4. Routed expert 출력과 shared path를 합쳐 layer output을 만든다.', body: 'Attention, embedding, shared expert 같은 dense weight는 여전히 매 token 필요하므로 fast memory에 resident하게 두는 편이 유리하다.' },
    ]}>
      {(step) => <RoutingScene step={step} />}
    </StepViz>
  );
}

function TierScene({ step }: { step: number }) {
  const reduceMotion = useReducedMotion();
  const hot = [1, 3, 4];
  return (
    <svg viewBox="0 0 760 380" className="h-auto w-full" role="img" aria-label="VRAM, RAM, SSD memory tier 사이에서 routed expert를 cache하고 streaming하는 과정">
      <defs><marker id="tier-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="var(--muted-foreground)" /></marker></defs>
      <Box x={42} y={54} w={150} h={72} title="Fast tier" sub="VRAM / pinned RAM" color="#7c3aed" />
      <Box x={42} y={153} w={150} h={72} title="Resident RAM" sub="dense weights + cache" color="#0f766e" />
      <Box x={42} y={252} w={150} h={72} title="NVMe SSD" sub="cold expert store" color="#a16207" />
      <Box x={570} y={54} w={145} h={72} title="Layer router" sub="Top-k expert ids" color="#2563eb" />
      <Box x={570} y={153} w={145} h={72} title="Expert matmul" sub="consume weight" color="#b42318" />
      {step === 0 && (
        <g>
          <Arrow x1={570} y1={90} x2={200} y2={280} color="#2563eb" marker="tier-arrow" />
          <text x="390" y="192" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">router가 필요한 expert id를 확정</text>
        </g>
      )}
      {step >= 1 && (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <rect x={238 + i * 47} y={267} width={34} height={28} rx={4} fill="var(--card)" stroke={i === 4 ? '#b42318' : 'var(--border)'} />
              <text x={255 + i * 47} y={285} textAnchor="middle" fontSize="12" fill={i === 4 ? '#b42318' : 'var(--muted-foreground)'}>E{i}</text>
            </motion.g>
          ))}
          <Arrow x1={570} y1={90} x2={442} y2={259} color="#2563eb" marker="tier-arrow" />
          <motion.rect x={426} y={267} width={34} height={28} rx={4} fill="#b42318" initial={{ y: 0 }} animate={{ y: step >= 2 ? -102 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.6 }} />
        </g>
      )}
      {step >= 2 && (
        <g>
          <Arrow x1={460} y1={181} x2={562} y2={187} color="#0f766e" marker="tier-arrow" />
          <text x="390" y="151" textAnchor="middle" fontSize="9.5" fill="#0f766e">cache fill → compute</text>
        </g>
      )}
      {step >= 3 && (
        <g>
          {hot.map((i) => (
            <rect key={i} x={253 + i * 62} y={72} width={42} height={32} rx={4} fill="#7c3aed18" stroke="#7c3aed" />
          ))}
          <text x="390" y="125" textAnchor="middle" fontSize="9.5" fill="#7c3aed">usage histogram이 hot expert를 상위 tier에 고정</text>
          <Arrow x1={570} y1={89} x2={500} y2={88} color="#7c3aed" marker="tier-arrow" />
        </g>
      )}
      {step >= 4 && (
        <g>
          <motion.path d="M570 105 C516 128 510 248 454 254" fill="none" stroke="#a16207" strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#tier-arrow)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          <text x="510" y="247" textAnchor="end" fontSize="9" fill="#a16207">predicted next expert prefetch</text>
          <text x="389" y="350" textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">wrong prediction은 read bandwidth와 cache slot을 낭비한다</text>
        </g>
      )}
    </svg>
  );
}

export function MemoryTierViz() {
  return (
    <StepViz steps={[
      { label: '1. Router result가 현재 layer에 필요한 expert id를 알려준다.', body: 'Dense model의 OS page fault와 달리 runtime은 어느 expert file range가 필요한지 model semantics에서 알 수 있다.' },
      { label: '2. Cache miss면 expert weight를 SSD에서 읽는다.', body: 'Model 전체가 아니라 Top-k expert의 packed int4/int8 block만 요청한다. 그러나 layer마다 반복되는 random read 양은 여전히 크다.' },
      { label: '3. 읽은 expert를 RAM cache에 넣고 matmul에 사용한다.', body: 'Compute와 I/O를 겹칠 수 있지만 weight가 도착하기 전에 해당 expert 계산을 시작할 수는 없다.' },
      { label: '4. 자주 선택되는 hot expert를 빠른 tier에 유지한다.', body: 'Prompt domain과 layer에 따라 routing locality가 생기면 cache hit가 올라간다. Workload가 바뀌면 hot set도 바뀐다.' },
      { label: '5. 다음 layer routing을 예측해 비동기 prefetch할 수 있다.', body: '예측이 맞으면 대기를 숨기고, 틀리면 쓸모없는 read와 eviction이 생긴다. Prefetch는 latency를 숨길 뿐 SSD byte를 공짜로 만들지 않는다.' },
    ]}>
      {(step) => <TierScene step={step} />}
    </StepViz>
  );
}

function TimelineScene({ step }: { step: number }) {
  const rows = step === 0
    ? [
        ['L1', 24, 100, '#a16207', 'read E2,E9'], ['L1', 126, 62, '#0f766e', 'compute'],
        ['L2', 202, 106, '#a16207', 'read E3,E7'], ['L2', 310, 62, '#0f766e', 'compute'],
        ['L3', 386, 112, '#a16207', 'read E1,E8'], ['L3', 500, 62, '#0f766e', 'compute'],
      ]
    : step === 1
      ? [
          ['L1', 24, 76, '#a16207', 'read'], ['L1', 102, 76, '#0f766e', 'compute'],
          ['L2', 116, 76, '#a16207', 'prefetch'], ['L2', 194, 76, '#0f766e', 'compute'],
          ['L3', 208, 76, '#a16207', 'prefetch'], ['L3', 286, 76, '#0f766e', 'compute'],
        ]
      : [
          ['L1', 24, 42, '#7c3aed', 'hit'], ['L1', 68, 76, '#0f766e', 'compute'],
          ['L2', 158, 42, '#7c3aed', 'hit'], ['L2', 202, 76, '#0f766e', 'compute'],
          ['L3', 292, 70, '#a16207', 'miss'], ['L3', 364, 76, '#0f766e', 'compute'],
        ];
  return (
    <svg viewBox="0 0 760 330" className="h-auto w-full" role="img" aria-label="Cold cache, asynchronous prefetch, warm cache의 expert read와 compute timeline">
      <text x="380" y="28" textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--foreground)">{step === 0 ? 'Cold cache · read가 critical path' : step === 1 ? 'Async prefetch · read와 compute overlap' : 'Warm cache · hit는 빠르고 miss만 SSD 대기'}</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <text x="72" y={101 + i * 72} textAnchor="end" fontSize="10" fontWeight="700" fill="var(--foreground)">Layer {i + 1}</text>
          <line x1={88} y1={96 + i * 72} x2={704} y2={96 + i * 72} stroke="var(--border)" />
        </g>
      ))}
      {rows.map(([layer, x, w, color, label], i) => {
        const layerIndex = Number(String(layer).slice(1)) - 1;
        return (
          <motion.g key={`${layer}-${x}-${label}`} initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: i * 0.05 }} style={{ transformOrigin: `${90 + Number(x)}px ${82 + layerIndex * 72}px` }}>
            <rect x={90 + Number(x)} y={77 + layerIndex * 72} width={Number(w)} height={38} rx={5} fill={`${color}18`} stroke={String(color)} />
            <text x={90 + Number(x) + Number(w) / 2} y={101 + layerIndex * 72} textAnchor="middle" fontSize="12" fontWeight="650" fill={String(color)}>{label}</text>
          </motion.g>
        );
      })}
      <text x="90" y="301" fontSize="9" fill="var(--muted-foreground)">time →</text>
      <line x1={136} y1={298} x2={704} y2={298} stroke="var(--muted-foreground)" strokeWidth={1.2} />
    </svg>
  );
}

export function StreamingTimelineViz() {
  return (
    <StepViz steps={[
      { label: '1. Cold cache에서는 각 layer가 SSD read를 기다린다.', body: 'Top-k만 읽어도 수십 layer에서 반복되면 token당 random-read byte가 커진다. Marketing sequential bandwidth가 그대로 나오지 않는다.' },
      { label: '2. Async prefetch가 다음 read와 현재 compute를 겹친다.', body: 'Compute 시간이 read latency보다 충분히 길고 예측이 맞으면 일부 I/O가 critical path 밖으로 숨는다.' },
      { label: '3. Warm cache에서는 hit가 늘지만 cold expert miss는 남는다.', body: 'More RAM은 cache capacity를 늘려 속도를 높인다. 작은 RAM이라는 headline과 실용 속도를 높이는 조건이 서로 긴장하는 이유다.' },
    ]}>
      {(step) => <TimelineScene step={step} />}
    </StepViz>
  );
}
