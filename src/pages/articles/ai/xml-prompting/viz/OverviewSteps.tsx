import { motion } from 'framer-motion';

const MF = 'ui-monospace,monospace';

export function StepUnstructured() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={60} y={30} width={140} height={60} rx={6}
        fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={130} y={52} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#f59e0b">자연어 프롬프트</text>
      <text x={130} y={68} textAnchor="middle" fontSize={9}
        fontFamily={MF} fill="var(--muted-foreground)">
        "요약해줘, 한국어로, 짧게"
      </text>
      <line x1={200} y1={60} x2={250} y2={110}
        stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" />
      <rect x={250} y={80} width={150} height={70} rx={6}
        fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
      <text x={325} y={98} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">LLM 출력</text>
      <text x={325} y={115} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">실행 A: 3줄 요약</text>
      <text x={325} y={128} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">실행 B: 10줄 분석</text>
      <text x={325} y={141} textAnchor="middle" fontSize={9}
        fill="#f59e0b">→ 형식 불안정</text>
    </motion.g>
  );
}

export function StepStructured({ cx }: { cx: number }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={30} y={20} width={170} height={100} rx={6}
        fill="#6366f110" stroke="#6366f1" strokeWidth={1.5} />
      <text x={115} y={38} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#6366f1">XML 구조화 프롬프트</text>
      {['<instructions>', '<context>', '<output_format>'].map((t, i) => (
        <text key={t} x={50} y={58 + i * 18} fontSize={9}
          fontFamily={MF} fill="#6366f1">{t}</text>
      ))}
      <line x1={200} y1={70} x2={250} y2={70}
        stroke="#6366f1" strokeWidth={1.5} />
      <polygon points="248,66 256,70 248,74" fill="#6366f1" />
      <rect x={260} y={40} width={160} height={60} rx={6}
        fill="#10b98110" stroke="#10b981" strokeWidth={1.5} />
      <text x={340} y={60} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#10b981">안정적 출력</text>
      <text x={340} y={78} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">매 실행 동일 구조</text>
      <text x={cx} y={140} textAnchor="middle" fontSize={9}
        fill="#10b981" fontWeight={600}>역할 · 입력 · 출력 · 규칙 명확 분리</text>
    </motion.g>
  );
}
