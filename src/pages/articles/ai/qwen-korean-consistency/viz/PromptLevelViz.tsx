import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, FAILURE_MODES, POSITION_DECAY } from './PromptLevelData';

const W = 480, H = 220;

export default function PromptLevelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <WeakBias />}
          {step === 1 && <ReasoningBypass />}
          {step === 2 && <PositionDecay />}
          {step === 3 && <DomainTrigger />}
          {step === 4 && <FewShotContamination />}
          {step === 5 && <InstructionConflict />}
          {step === 6 && <Conclusion />}
        </svg>
      )}
    </StepViz>
  );
}

function WeakBias() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">"한국어로만 답변하세요"가 logit에 미치는 영향</text>
      <DataBox x={20} y={70} w={120} h={36}
        label="system prompt" sub='"한국어로만"' color="#3b82f6" outlined />
      <text x={150} y={92} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ModuleBox x={170} y={66} w={100} h={44}
        label="hidden h" sub="약한 회전" color="#a3a3a3" />
      <text x={280} y={92} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ModuleBox x={300} y={66} w={100} h={44}
        label="W (그대로)" sub="한자 row 강함" color="#ef4444" />
      <text x={W / 2} y={140} textAnchor="middle" fontSize={9.5}
        fill="var(--muted-foreground)">prompt는 h를 약간 회전시킬 뿐, lm_head W는 건드리지 못한다</text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={120} y={158} width={140} height={22} rx={3}
          fill="#3b82f620" stroke="#3b82f6" strokeWidth={1} />
        <text x={190} y={172} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="#3b82f6">분석 logit 7.4</text>
        <rect x={270} y={158} width={150} height={22} rx={3}
          fill="#ef444420" stroke="#ef4444" strokeWidth={1} />
        <text x={345} y={172} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="#ef4444">分析 logit 7.5</text>
        <text x={W / 2} y={198} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">격차가 0.1로 줄지만 부호는 뒤집히지 않음 → 여전히 한자가 이김</text>
      </motion.g>
    </motion.g>
  );
}

function ReasoningBypass() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">think 블록은 가드를 우회한다</text>
      <DataBox x={20} y={50} w={130} h={28}
        label="system: 한국어로" color="#3b82f6" outlined />
      <line x1={150} y1={64} x2={170} y2={64} stroke="var(--muted-foreground)" strokeWidth={0.6}
        strokeDasharray="2 2" />
      <text x={172} y={67} fontSize={8} fill="var(--muted-foreground)">멀리 떨어짐</text>

      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}>
        <rect x={20} y={92} width={440} height={62} rx={6}
          fill="#ef444408" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" />
        <text x={32} y={108} fontSize={9} fontWeight={700} fill="#ef4444">{'<think>'}</text>
        <text x={32} y={124} fontSize={10} fill="var(--foreground)">首先 분석해보자. 問題의 核心은 ...</text>
        <text x={32} y={140} fontSize={10} fill="var(--foreground)">需要 confirmation 后 进行 处理</text>
        <text x={32} y={154} fontSize={9} fontWeight={700} fill="#ef4444">{'</think>'}</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <DataBox x={20} y={166} w={300} h={28}
          label="최종 답: 분석 결과는 다음과 같습니다" color="#10b981" outlined />
        <text x={335} y={184} fontSize={9} fill="var(--muted-foreground)">한국어 OK</text>
      </motion.g>
      <text x={W / 2} y={213} textAnchor="middle" fontSize={8.5}
        fill="var(--muted-foreground)">long-CoT 학습 분포 자체가 중·영 → think 진입 시 attractor가 우회</text>
    </motion.g>
  );
}

function PositionDecay() {
  const x0 = 60, y0 = 170, w = 360, h = 110;
  const maxX = 1200, maxY = 50;
  const toX = (v: number) => x0 + (v / maxX) * w;
  const toY = (v: number) => y0 - (v / maxY) * h;
  const path = POSITION_DECAY.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${toX(p.x).toFixed(1)} ${toY(p.y).toFixed(1)}`
  ).join(' ');
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">응답 길이가 늘어날수록 한자 비율이 monotonic하게 증가</text>
      {/* axes */}
      <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke="var(--border)" strokeWidth={1} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - h} stroke="var(--border)" strokeWidth={1} />
      {/* y ticks */}
      {[0, 20, 40].map((v) => (
        <g key={v}>
          <line x1={x0 - 3} y1={toY(v)} x2={x0} y2={toY(v)} stroke="var(--muted-foreground)" strokeWidth={0.5} />
          <text x={x0 - 6} y={toY(v) + 3} textAnchor="end" fontSize={7.5}
            fill="var(--muted-foreground)">{v}%</text>
        </g>
      ))}
      {/* x ticks */}
      {[0, 400, 800, 1200].map((v) => (
        <g key={v}>
          <line x1={toX(v)} y1={y0} x2={toX(v)} y2={y0 + 3} stroke="var(--muted-foreground)" strokeWidth={0.5} />
          <text x={toX(v)} y={y0 + 13} textAnchor="middle" fontSize={7.5}
            fill="var(--muted-foreground)">{v}</text>
        </g>
      ))}
      <text x={x0 + w / 2} y={y0 + 25} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">응답 토큰 수</text>
      <text x={x0 - 18} y={y0 - h / 2} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)" transform={`rotate(-90 ${x0 - 18} ${y0 - h / 2})`}>한자 비율</text>
      {/* curve */}
      <motion.path d={path} fill="none" stroke="#ef4444" strokeWidth={1.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
      {POSITION_DECAY.map((p, i) => (
        <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r={2} fill="#ef4444" />
      ))}
      <text x={W / 2} y={48} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">self-prime: 한자 토큰이 다음 한자 토큰을 부르는 self-reinforcement</text>
    </motion.g>
  );
}

function DomainTrigger() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">코드·수식 주변에서 한자 폭증</text>
      <DataBox x={20} y={56} w={140} h={26} label="한국어 텍스트" color="#3b82f6" outlined />
      <line x1={160} y1={69} x2={180} y2={69} stroke="var(--muted-foreground)" strokeWidth={0.8} />
      <ModuleBox x={180} y={50} w={120} h={38} label="def parse(x):" sub="코드 블록 진입" color="#a855f7" />
      <line x1={300} y1={69} x2={320} y2={69} stroke="var(--muted-foreground)" strokeWidth={0.8} />
      <AlertBox x={320} y={56} w={140} h={26} label="결과를 確認하면" color="#ef4444" />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <text x={W / 2} y={108} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">학습 분포에서 본 패턴</text>
        <rect x={60} y={120} width={360} height={50} rx={4}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={75} y={138} fontSize={9} fill="var(--muted-foreground)">코드 + 중국어 주석:</text>
        <text x={75} y={152} fontSize={9} fill="var(--foreground)" fontFamily="monospace">def parse(x):  # 解析输入</text>
        <text x={75} y={164} fontSize={8.5} fill="var(--muted-foreground)">→ 모델은 코드 직후 한자 토큰을 자연스럽게 본다</text>
      </motion.g>
      <text x={W / 2} y={195} textAnchor="middle" fontSize={8.5}
        fill="var(--muted-foreground)">도메인 전환 시점에서 hidden state가 학습 mode로 끌려감</text>
    </motion.g>
  );
}

function FewShotContamination() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">few-shot 예시 한 글자가 허용 신호가 된다</text>

      <text x={28} y={56} fontSize={9} fontWeight={700} fill="var(--foreground)">예시 (의도하지 않은 한자)</text>
      <rect x={20} y={62} width={210} height={58} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={32} y={78} fontSize={9} fill="var(--muted-foreground)">Q: 데이터를 분석해줘</text>
      <text x={32} y={92} fontSize={9} fill="var(--foreground)">A: 分析 결과 평균은 ...</text>
      <text x={32} y={108} fontSize={8} fill="#ef4444">↑ 한 글자만 한자라도 모델은 "허용"으로 학습</text>

      <text x={258} y={56} fontSize={9} fontWeight={700} fill="var(--foreground)">실제 출력</text>
      <rect x={250} y={62} width={210} height={58} rx={4}
        fill="#ef444408" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" />
      <text x={262} y={78} fontSize={9} fill="var(--foreground)">分析 結果를 보면</text>
      <text x={262} y={92} fontSize={9} fill="var(--foreground)">問題의 核心이 보인다</text>
      <text x={262} y={108} fontSize={8} fill="#ef4444">↑ 한자 비율이 오히려 증가</text>

      <text x={W / 2} y={148} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">in-context learning: 긍정 신호 ≫ 부정 신호</text>
      <text x={W / 2} y={164} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">가드를 강화하려 넣은 예시가 leakage를 증폭시키는 역설</text>
    </motion.g>
  );
}

function InstructionConflict() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">정확성 vs 한국어 강제 — 두 목표의 충돌</text>
      <ActionBox x={40} y={60} w={150} h={42} label="목표 A: 정확성" sub="RLHF 우선 학습" color="#3b82f6" />
      <text x={210} y={86} fontSize={14} fontWeight={700} fill="#ef4444">⚔</text>
      <ActionBox x={230} y={60} w={170} h={42} label="목표 B: 한국어 강제" sub="prompt instruction" color="#10b981" />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <line x1={115} y1={108} x2={W / 2} y2={140} stroke="#3b82f6" strokeWidth={1.2} />
        <line x1={315} y1={108} x2={W / 2} y2={140} stroke="#10b981" strokeWidth={1.2} />
        <AlertBox x={W / 2 - 90} y={140} w={180} h={42}
          label='"가장 적합한 토큰"' sub="lm_head 구조상 한자가 자주 우위" color="#ef4444" />
      </motion.g>
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">정확성을 추구할수록 한자가 채택됨 → prompt 강도로 해소 불가</text>
    </motion.g>
  );
}

function Conclusion() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">5가지 실패 모드의 공통 구조</text>
      {FAILURE_MODES.map((m, i) => {
        const y = 50 + i * 28;
        return (
          <motion.g key={m.id}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}>
            <rect x={30} y={y} width={6} height={20} fill={m.color} rx={1} />
            <text x={44} y={y + 14} fontSize={10} fontWeight={700}
              fill="var(--foreground)">{m.label}</text>
            <text x={170} y={y + 14} fontSize={9}
              fill="var(--muted-foreground)">{m.short}</text>
            {[1, 2, 3, 4].map((s) => (
              <rect key={s} x={300 + s * 14} y={y + 6} width={10} height={10} rx={2}
                fill={s <= m.severity ? m.color : 'var(--border)'}
                opacity={s <= m.severity ? 0.85 : 0.3} />
            ))}
            <text x={420} y={y + 14} fontSize={8}
              fill="var(--muted-foreground)">심각도</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">전부 입력단 가드는 출력단 logit 격차를 못 이긴다는 한 가지 사실로 환원</text>
    </motion.g>
  );
}
