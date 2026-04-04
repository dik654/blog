import { motion } from 'framer-motion';

export function OverInstruction() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={60} y={70} width={340} height={55} rx={5}
        fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
      <text x={80} y={92} fontSize={9} fill="var(--foreground)">
        500+ 토큰 지시 → 핵심 지시 무시 확률 ↑</text>
      <text x={80} y={110} fontSize={9} fill="#10b981">
        ✅ 핵심 규칙 3~5개, 우선순위 번호 매기기</text>
    </motion.g>
  );
}

export function VagueRole() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={40} y={70} width={175} height={55} rx={5}
        fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
      <text x={55} y={88} fontSize={9} fill="#ef4444">
        "도움이 되는 어시스턴트"</text>
      <text x={55} y={105} fontSize={9} fill="#ef4444">
        → 모호, 자의적 해석</text>
      <rect x={245} y={70} width={175} height={55} rx={5}
        fill="#10b98110" stroke="#10b981" strokeWidth={1} />
      <text x={260} y={88} fontSize={9} fill="#10b981">
        "Python 시니어 개발자"</text>
      <text x={260} y={105} fontSize={9} fill="#10b981">
        → 역할+기준 구체적</text>
    </motion.g>
  );
}

export function NegativePrompt() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={40} y={70} width={175} height={55} rx={5}
        fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
      <text x={55} y={88} fontSize={9} fill="#ef4444">
        "개인정보 출력하지 마"</text>
      <text x={55} y={105} fontSize={9} fill="#ef4444">
        → "개인정보" 활성화</text>
      <rect x={245} y={70} width={175} height={55} rx={5}
        fill="#10b98110" stroke="#10b981" strokeWidth={1} />
      <text x={260} y={88} fontSize={9} fill="#10b981">
        "공개 가능 정보만 포함"</text>
      <text x={260} y={105} fontSize={9} fill="#10b981">
        → 긍정형 지시</text>
    </motion.g>
  );
}

export function ContextPollution() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={60} y={70} width={340} height={55} rx={5}
        fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
      <text x={80} y={92} fontSize={9} fill="var(--foreground)">
        긴 대화 → 초기 시스템 프롬프트 영향력 감소</text>
      <text x={80} y={110} fontSize={9} fill="#10b981">
        ✅ 중요 지시 재주입 / 요약 후 리셋</text>
    </motion.g>
  );
}
