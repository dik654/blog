import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, RETRY_DISTRIBUTION } from './RuntimeGuardData';

const W = 480, H = 220;

export default function RuntimeGuardViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <BlackBoxGuard />}
          {step === 1 && <RegexCheck />}
          {step === 2 && <RegexLimits />}
          {step === 3 && <LlmJudge />}
          {step === 4 && <HybridPath />}
          {step === 5 && <RetryStrategies />}
          {step === 6 && <RetryDistribution />}
          {step === 7 && <QualityGuardPattern />}
        </svg>
      )}
    </StepViz>
  );
}

function BlackBoxGuard() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">모델은 그대로, 출력만 검사</text>
      <DataBox x={20} y={70} w={90} h={36} label="request" color="#3b82f6" outlined />
      <text x={120} y={92} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ModuleBox x={135} y={68} w={100} h={44}
        label="model" sub="unchanged" color="#a3a3a3" />
      <text x={245} y={92} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ActionBox x={260} y={68} w={100} h={44}
        label="guard" sub="regex / LLM" color="#10b981" />
      <text x={370} y={92} fontSize={12} fill="var(--muted-foreground)">→</text>
      <DataBox x={385} y={70} w={80} h={36} label="OK" color="#10b981" outlined />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <path d="M 310 112 Q 310 140, 260 150 Q 180 160, 160 125"
          fill="none" stroke="#ef4444" strokeWidth={1.2} strokeDasharray="4 3" />
        <text x={230} y={168} textAnchor="middle" fontSize={8.5}
          fill="#ef4444">실패 시 retry</text>
      </motion.g>
      <text x={W / 2} y={200} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">모델 교체 자유도 — 어느 모델에도 붙는 안전망</text>
    </motion.g>
  );
}

function RegexCheck() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">CJK Unified Ideographs 범위 판정</text>
      <rect x={40} y={44} width={400} height={30} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={240} y={63} textAnchor="middle" fontSize={10} fontFamily="monospace"
        fontWeight={700} fill="#3b82f6">/[\u4E00-\u9FFF]/.test(response)</text>

      <text x={W / 2} y={92} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="var(--foreground)">판정 예시</text>
      {[
        { text: '분석 결과를 보면', has: false },
        { text: '分析 결과를 보면', has: true },
        { text: 'API 호출 완료', has: false },
      ].map((e, i) => {
        const y = 104 + i * 28;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}>
            <rect x={80} y={y} width={260} height={22} rx={3}
              fill={e.has ? '#ef444410' : '#10b98110'}
              stroke={e.has ? '#ef4444' : '#10b981'} strokeWidth={0.8} />
            <text x={90} y={y + 15} fontSize={10}
              fill="var(--foreground)">{e.text}</text>
            <text x={345} y={y + 15} fontSize={9} fontWeight={700}
              fill={e.has ? '#ef4444' : '#10b981'}>{e.has ? 'FAIL' : 'OK'}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={200} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">비용 마이크로초, 모든 응답에 부담 없이 적용</text>
    </motion.g>
  );
}

function RegexLimits() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">regex가 놓치거나 과도하게 잡는 경우</text>
      <text x={120} y={50} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="#f59e0b">False Positive</text>
      <text x={360} y={50} textAnchor="middle" fontSize={9} fontWeight={700}
        fill="#ef4444">False Negative</text>

      {[
        { fp: '"李舜臣 장군"', fn: '"분시 결과"', desc1: '고유명사 (정상)', desc2: '음차 (비정상)' },
        { fp: '"漢江 야경"', fn: '"펀시해보자"', desc1: '지명 (정상)', desc2: 'transliteration' },
        { fp: '"한문 번역해줘"', fn: '영어 혼용', desc1: '사용자 요청', desc2: 'regex 범위 밖' },
      ].map((e, i) => {
        const y = 68 + i * 38;
        return (
          <motion.g key={i}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.08 }}>
            <rect x={30} y={y} width={180} height={30} rx={3}
              fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="4 3" />
            <text x={40} y={y + 13} fontSize={9} fill="var(--foreground)">{e.fp}</text>
            <text x={40} y={y + 25} fontSize={8}
              fill="var(--muted-foreground)">{e.desc1}</text>

            <rect x={260} y={y} width={180} height={30} rx={3}
              fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="4 3" />
            <text x={270} y={y + 13} fontSize={9} fill="var(--foreground)">{e.fn}</text>
            <text x={270} y={y + 25} fontSize={8}
              fill="var(--muted-foreground)">{e.desc2}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">regex는 유니코드 판정만 — 의미를 모른다</text>
    </motion.g>
  );
}

function LlmJudge() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">작은 판정 LLM에 의미까지 묻기</text>
      <DataBox x={20} y={58} w={130} h={40}
        label="response" sub="검사 대상" color="#3b82f6" outlined />
      <text x={160} y={82} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ModuleBox x={175} y={54} w={130} h={48}
        label="judge LLM" sub="Haiku / Qwen3-4B" color="#a855f7" />
      <text x={315} y={82} fontSize={12} fill="var(--muted-foreground)">→</text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={330} y={54} width={130} height={16} rx={2}
          fill="#10b98130" stroke="#10b981" strokeWidth={0.8} />
        <text x={395} y={65} textAnchor="middle" fontSize={8.5}
          fontWeight={700} fill="#10b981">yes — 자연스러움</text>
        <rect x={330} y={74} width={130} height={16} rx={2}
          fill="#f59e0b30" stroke="#f59e0b" strokeWidth={0.8} />
        <text x={395} y={85} textAnchor="middle" fontSize={8.5}
          fontWeight={700} fill="#f59e0b">partial — 혼합</text>
        <rect x={330} y={94} width={130} height={16} rx={2}
          fill="#ef444430" stroke="#ef4444" strokeWidth={0.8} />
        <text x={395} y={105} textAnchor="middle" fontSize={8.5}
          fontWeight={700} fill="#ef4444">no — 재작성 필요</text>
      </motion.g>

      <rect x={40} y={130} width={400} height={64} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={55} y={148} fontSize={9} fontWeight={700}
        fill="var(--foreground)">judge가 regex보다 잘 보는 것</text>
      <text x={55} y={162} fontSize={9} fill="var(--muted-foreground)">• 고유명사 허용 (李舜臣 = 정상)</text>
      <text x={55} y={176} fontSize={9} fill="var(--muted-foreground)">• 음차 탐지 (분시 = 비정상)</text>
      <text x={55} y={190} fontSize={9} fill="var(--muted-foreground)">• 의미 보존 확인 (문맥상 자연스러운가)</text>
    </motion.g>
  );
}

function HybridPath() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={26} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">regex fast path → judge slow path</text>
      <DataBox x={20} y={70} w={90} h={36} label="response" color="#3b82f6" outlined />
      <text x={120} y={92} fontSize={12} fill="var(--muted-foreground)">→</text>
      <ActionBox x={135} y={68} w={100} h={44}
        label="regex" sub="1μs" color="#3b82f6" />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <line x1={235} y1={82} x2={270} y2={60} stroke="#10b981" strokeWidth={1.2} />
        <text x={253} y={55} textAnchor="middle" fontSize={8} fill="#10b981">85% OK</text>
        <DataBox x={275} y={45} w={110} h={28} label="→ return" color="#10b981" outlined />

        <line x1={235} y1={105} x2={270} y2={130} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={253} y={128} textAnchor="middle" fontSize={8} fill="#f59e0b">15% 의심</text>
        <ActionBox x={275} y={118} w={100} h={42}
          label="judge LLM" sub="~700ms" color="#a855f7" />
        <text x={385} y={140} fontSize={12} fill="var(--muted-foreground)">→</text>
        <DataBox x={400} y={124} w={60} h={28} label="verdict" color="#ef4444" outlined />
      </motion.g>

      <text x={W / 2} y={190} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">평균 latency 오버헤드 50~100ms / 비용도 judge 호출 15%만</text>
      <text x={W / 2} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">fast path가 대다수 흡수 — slow path는 의심에만</text>
    </motion.g>
  );
}

function RetryStrategies() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">retry는 동일 프롬프트가 아니라 변형</text>
      {[
        { title: 'temperature ↓', detail: '1.0 → 0.3  덜 창의적 = 덜 실험적', color: '#3b82f6' },
        { title: 'system prompt 강화', detail: '"이전 응답에 한자 섞임, 재작성"', color: '#10b981' },
        { title: 'negative few-shot', detail: '실패 응답을 예시로 "이렇게 쓰지 마"', color: '#a855f7' },
      ].map((s, i) => {
        const y = 50 + i * 46;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}>
            <rect x={40} y={y} width={400} height={36} rx={4}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={0.8} />
            <rect x={40} y={y} width={4} height={36} fill={s.color} />
            <text x={56} y={y + 14} fontSize={10} fontWeight={700}
              fill={s.color}>{s.title}</text>
            <text x={56} y={y + 28} fontSize={9}
              fill="var(--muted-foreground)">{s.detail}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={200} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">단순 retry는 같은 분포에서 다시 뽑을 뿐 — 변형이 필요</text>
    </motion.g>
  );
}

function RetryDistribution() {
  const x0 = 70, y0 = 170, w = 340, h = 110;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">retry 분포 — 대부분 첫 시도에 통과</text>
      {/* axes */}
      <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke="var(--border)" strokeWidth={1} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - h} stroke="var(--border)" strokeWidth={1} />
      {[0, 50, 100].map((v) => (
        <g key={v}>
          <text x={x0 - 6} y={y0 - (v / 100) * h + 3} textAnchor="end" fontSize={7.5}
            fill="var(--muted-foreground)">{v}%</text>
          <line x1={x0 - 3} y1={y0 - (v / 100) * h} x2={x0} y2={y0 - (v / 100) * h}
            stroke="var(--muted-foreground)" strokeWidth={0.5} />
        </g>
      ))}

      {RETRY_DISTRIBUTION.map((r, i) => {
        const bw = 60;
        const bx = x0 + 30 + i * 80;
        const bh = (r.success / 100) * h;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            style={{ transformOrigin: `${bx + bw / 2}px ${y0}px` }}>
            <rect x={bx} y={y0 - bh} width={bw} height={bh}
              fill="#3b82f640" stroke="#3b82f6" strokeWidth={1} />
            <text x={bx + bw / 2} y={y0 - bh - 6} textAnchor="middle"
              fontSize={9} fontWeight={700} fill="#3b82f6">{r.success}%</text>
            <text x={bx + bw / 2} y={y0 + 13} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">attempt {r.attempt}</text>
          </motion.g>
        );
      })}
      <text x={W / 2} y={200} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">retry rate &gt; 20%면 모델을 교체해야 한다는 신호</text>
    </motion.g>
  );
}

function QualityGuardPattern() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={24} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">runWithQualityGuard 실전 구조</text>
      <rect x={30} y={38} width={420} height={130} rx={4}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      {[
        'async function runWithQualityGuard(prompt, maxRetries=2):',
        '  for attempt in 0..maxRetries:',
        '    resp = await model.generate(prompt, temp=1.0 - attempt*0.3)',
        '    if regexCheck(resp).ok: return resp',
        '    if judge(resp) == "fail":',
        '      prompt = reinforce(prompt, resp)',
        '      continue',
        '  return postProcess(resp)',
      ].map((line, i) => (
        <text key={i} x={44} y={56 + i * 14} fontSize={8.5} fontFamily="monospace"
          fill="var(--foreground)">{line}</text>
      ))}
      <text x={W / 2} y={188} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">가드를 생성 경로에 encapsulate — 호출자는 존재를 모른다</text>
      <text x={W / 2} y={204} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">실패 처리 분기가 호출 사이트에 새어나가지 않음</text>
    </motion.g>
  );
}
