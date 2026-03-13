import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const C = { user: '#f59e0b', api: '#6366f1', tools: '#10b981', perm: '#ef4444' };

const STEPS = [
  {
    label: '사용자 입력: 자연어 명령',
    body: '사용자가 터미널에서 자연어로 작업을 지시합니다. Claude Code는 이를 Claude API로 전달할 메시지로 변환합니다.',
  },
  {
    label: 'Claude API 호출: 메시지 + 도구 정의 전송',
    body: '사용자 메시지와 함께 사용 가능한 도구 정의(Read, Write, Bash, Grep 등)를 Claude API에 전송합니다. ~200K 토큰 컨텍스트 윈도우를 활용합니다.',
  },
  {
    label: '응답 분석: 텍스트 or 도구 호출?',
    body: 'Claude의 응답을 파싱하여 일반 텍스트인지, 도구 호출(tool_use) 요청인지 판별합니다. 텍스트이면 사용자에게 출력하고 대기합니다.',
  },
  {
    label: '도구 실행: 권한 확인 -> 실행 -> 결과 수집',
    body: '도구 호출 시 권한 모드(Ask/Auto-Allow/YOLO)에 따라 사용자 승인 여부를 결정합니다. 승인 후 도구를 실행하고 결과를 수집합니다.',
  },
  {
    label: '루프 반복: 평균 21.2회 도구 호출/요청',
    body: '도구 실행 결과를 대화 컨텍스트에 추가하고 다시 Claude API를 호출합니다. 하나의 요청당 평균 21.2회 도구 호출이 반복됩니다.',
  },
];

/* Shared SVG helpers */
function Box({ x, y, w, h, color, label, sub }: {
  x: number; y: number; w: number; h: number; color: string; label: string; sub?: string;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={`${color}18`} stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} textAnchor="middle"
        fontSize={9} fontWeight="700" fill={color}>{label}</text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle"
          fontSize={7} fill={color} opacity={0.75}>{sub}</text>
      )}
    </motion.g>
  );
}

function Arrow({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5}
      strokeDasharray={dashed ? '5 3' : undefined} markerEnd="url(#arrowhead)"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
  );
}

function Label({ x, y, text, color }: { x: number; y: number; text: string; color?: string }) {
  return <text x={x} y={y} fontSize={7} fill={color ?? 'hsl(var(--muted-foreground))'}>{text}</text>;
}

export default function AgentLoopViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 180" className="w-full max-w-[480px]" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--muted-foreground))" />
            </marker>
          </defs>

          {/* Step 0: User input */}
          {step === 0 && (
            <g>
              <Box x={20} y={50} w={120} h={50} color={C.user} label="User" sub="자연어 명령 입력" />
              <Arrow x1={140} y1={75} x2={210} y2={75} color={C.user} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Box x={220} y={50} w={130} h={50} color={C.api} label="Claude API" sub="메시지 수신 대기" />
              </motion.g>
              <Label x={155} y={68} text="프롬프트 전달" />
            </g>
          )}

          {/* Step 1: API call */}
          {step === 1 && (
            <g>
              <Box x={10} y={20} w={100} h={40} color={C.user} label="Messages" sub="대화 히스토리" />
              <Box x={10} y={75} w={100} h={40} color={C.tools} label="Tool Defs" sub="Read, Bash, Grep..." />
              <Arrow x1={110} y1={50} x2={160} y2={70} color={C.user} />
              <Arrow x1={110} y1={90} x2={160} y2={75} color={C.tools} />
              <Box x={170} y={45} w={130} h={50} color={C.api} label="Claude API" sub="~200K 토큰 컨텍스트" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Arrow x1={300} y1={70} x2={345} y2={70} color={C.api} />
                <Label x={310} y={60} text="응답 생성" />
                <rect x={345} y={55} width={25} height={30} rx={4} fill={`${C.api}22`} stroke={C.api}
                  strokeWidth={1} strokeDasharray="3 2" />
                <text x={357} y={74} textAnchor="middle" fontSize={7} fill={C.api}>...</text>
              </motion.g>
            </g>
          )}

          {/* Step 2: Decision branch */}
          {step === 2 && (
            <g>
              <Box x={120} y={10} w={130} h={40} color={C.api} label="Claude 응답" />
              {/* Diamond decision */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <polygon points="185,70 220,90 185,110 150,90"
                  fill={`${C.api}15`} stroke={C.api} strokeWidth={1.5} />
                <text x={185} y={93} textAnchor="middle" fontSize={8} fontWeight="600" fill={C.api}>분기</text>
              </motion.g>
              <Arrow x1={185} y1={50} x2={185} y2={70} color={C.api} />
              {/* Text path */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Arrow x1={150} y1={90} x2={40} y2={90} color={C.user} />
                <Box x={5} y={105} w={90} h={35} color={C.user} label="텍스트 출력" sub="사용자에게 표시" />
                <Label x={60} y={84} text="텍스트 응답" color={C.user} />
              </motion.g>
              {/* Tool path */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Arrow x1={220} y1={90} x2={290} y2={90} color={C.tools} />
                <Box x={290} y={72} w={80} h={35} color={C.tools} label="도구 호출" sub="tool_use" />
                <Label x={230} y={84} text="도구 요청" color={C.tools} />
              </motion.g>
            </g>
          )}

          {/* Step 3: Tool execution with permission */}
          {step === 3 && (
            <g>
              <Box x={10} y={55} w={80} h={40} color={C.tools} label="도구 호출" sub="Write, Bash..." />
              <Arrow x1={90} y1={75} x2={120} y2={75} color={C.tools} />
              {/* Permission gate */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <rect x={125} y={50} width={70} height={50} rx={6}
                  fill={`${C.perm}12`} stroke={C.perm} strokeWidth={1.5} strokeDasharray="4 3" />
                <text x={160} y={72} textAnchor="middle" fontSize={8} fontWeight="700" fill={C.perm}>권한 확인</text>
                <text x={160} y={86} textAnchor="middle" fontSize={6.5} fill={C.perm} opacity={0.7}>Ask / Auto / YOLO</text>
              </motion.g>
              <Arrow x1={195} y1={75} x2={225} y2={75} color={C.perm} />
              {/* Execution */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Box x={230} y={55} w={70} h={40} color={C.tools} label="실행" sub="도구 동작" />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <Arrow x1={300} y1={75} x2={325} y2={75} color={C.tools} />
                <Box x={325} y={55} w={50} h={40} color={C.api} label="결과" sub="수집" />
              </motion.g>
              {/* Sandboxing note */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Label x={115} y={120} text="OS 샌드박싱: Seatbelt (macOS) / bwrap (Linux)" color={C.perm} />
              </motion.g>
            </g>
          )}

          {/* Step 4: Loop back */}
          {step === 4 && (
            <g>
              {/* Central loop diagram */}
              <Box x={130} y={15} w={110} h={35} color={C.api} label="Claude API" />
              <Box x={270} y={60} w={90} h={35} color={C.tools} label="도구 실행" />
              <Box x={130} y={110} w={110} h={35} color={C.api} label="결과 추가" sub="컨텍스트 업데이트" />

              {/* Arrows forming loop */}
              <Arrow x1={240} y1={32} x2={290} y2={60} color={C.api} />
              <Arrow x1={315} y1={95} x2={240} y2={120} color={C.tools} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Arrow x1={130} y1={127} x2={80} y2={90} color={C.api} dashed />
                <Arrow x1={80} y1={60} x2={130} y2={32} color={C.api} dashed />
                {/* Loop label */}
                <text x={55} y={80} textAnchor="middle" fontSize={10} fontWeight="800" fill={C.user}>
                  Loop
                </text>
              </motion.g>

              {/* Stats */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={10} y={150} width={360} height={22} rx={4} fill={`${C.user}15`} stroke={C.user} strokeWidth={1} />
                <text x={190} y={165} textAnchor="middle" fontSize={8} fontWeight="700" fill={C.user}>
                  평균 21.2회 도구 호출 / 요청 | 병렬 실행 가능 | 서브에이전트 최대 7개
                </text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
