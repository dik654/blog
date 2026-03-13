import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const C = { client: '#f59e0b', gateway: '#6366f1', pi: '#10b981', response: '#0ea5e9' };

const STEPS = [
  { label: 'Client 연결: Operator/Node/WebChat → Gateway',
    body: 'Operator(CLI/TUI), Node(macOS/iOS 앱), WebChat 클라이언트가 ws://127.0.0.1:18789로 Gateway에 연결합니다. 각 클라이언트 유형별로 다른 인증 방식을 사용합니다.' },
  { label: '메시지 수신: 채널 라우팅 (20+ 채널)',
    body: 'Gateway의 Channel Router가 수신 메시지를 정규화하고, DM/그룹/멘션 라우팅 규칙에 따라 적절한 에이전트 세션으로 전달합니다.' },
  { label: 'Pi Agent: tool adapter + 모델 실행',
    body: 'Pi SDK의 createAgentSession()으로 에이전트를 실행합니다. toToolDefinitions()로 도구를 브릿지하고, 멀티 프로바이더 모델을 선택하여 에이전트 루프를 수행합니다.' },
  { label: '응답 스트리밍: SSE/WebSocket으로 반환',
    body: '에이전트의 text_delta 이벤트를 실시간 스트리밍으로 클라이언트에 전달합니다. 채널별 리치 메시지 포맷으로 변환하여 최종 응답을 전송합니다.' },
];

function Box({ x, y, w, h, label, color, sub }: {
  x: number; y: number; w: number; h: number; label: string; color: string; sub?: string;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={`${color}18`} stroke={color} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} textAnchor="middle"
        fontSize={9} fontWeight="600" fill={color}>{label}</text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle"
          fontSize={7} fill="hsl(var(--muted-foreground))">{sub}</text>
      )}
    </motion.g>
  );
}

function Arrow({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.5} markerEnd="url(#arrowhead)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay }} />
  );
}

export default function GatewayViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 200" className="w-full max-w-[480px]" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--muted-foreground))" />
            </marker>
          </defs>

          {/* Step 0: Client connection */}
          {step === 0 && (
            <g>
              <Box x={10} y={20} w={80} h={32} label="Operator" color={C.client} sub="CLI / TUI" />
              <Box x={10} y={70} w={80} h={32} label="Node" color={C.client} sub="macOS / iOS" />
              <Box x={10} y={120} w={80} h={32} label="WebChat" color={C.client} sub="브라우저" />

              <Arrow x1={90} y1={36} x2={180} y2={86} color={C.client} delay={0.1} />
              <Arrow x1={90} y1={86} x2={180} y2={90} color={C.client} delay={0.2} />
              <Arrow x1={90} y1={136} x2={180} y2={96} color={C.client} delay={0.3} />

              <Box x={180} y={65} w={140} h={50} label="OpenClaw Gateway" color={C.gateway} sub="ws://127.0.0.1:18789" />

              <motion.text x={200} y={150} fontSize={8} fill="hsl(var(--muted-foreground))"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                단일 Node.js 프로세스로 모든 클라이언트 관리
              </motion.text>
            </g>
          )}

          {/* Step 1: Channel routing */}
          {step === 1 && (
            <g>
              <Box x={10} y={65} w={80} h={50} label="Gateway" color={C.gateway} sub="Channel Router" />

              <Arrow x1={90} y1={78} x2={150} y2={30} color={C.gateway} delay={0.1} />
              <Arrow x1={90} y1={85} x2={150} y2={65} color={C.gateway} delay={0.15} />
              <Arrow x1={90} y1={92} x2={150} y2={100} color={C.gateway} delay={0.2} />
              <Arrow x1={90} y1={100} x2={150} y2={135} color={C.gateway} delay={0.25} />
              <Arrow x1={90} y1={107} x2={150} y2={170} color={C.gateway} delay={0.3} />

              {['WhatsApp', 'Telegram', 'Slack', 'Discord', 'iMessage'].map((ch, i) => (
                <motion.g key={ch} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}>
                  <rect x={150} y={18 + i * 35} width={70} height={24} rx={4}
                    fill={`${C.gateway}15`} stroke={C.gateway} strokeWidth={1} />
                  <text x={185} y={34 + i * 35} textAnchor="middle"
                    fontSize={8} fontWeight="500" fill={C.gateway}>{ch}</text>
                </motion.g>
              ))}

              <motion.text x={240} y={60} fontSize={8} fill="hsl(var(--muted-foreground))"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                + Matrix, Teams,
              </motion.text>
              <motion.text x={240} y={72} fontSize={8} fill="hsl(var(--muted-foreground))"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                IRC, Signal, ...
              </motion.text>
              <motion.text x={240} y={90} fontSize={9} fontWeight="600" fill={C.gateway}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                20+ 채널 지원
              </motion.text>
            </g>
          )}

          {/* Step 2: Pi Agent processing */}
          {step === 2 && (
            <g>
              <Box x={10} y={30} w={100} h={36} label="Tool Adapter" color={C.pi} sub="toToolDefinitions()" />
              <Arrow x1={110} y1={48} x2={150} y2={90} color={C.pi} delay={0.1} />

              <Box x={150} y={70} w={120} h={44} label="Pi Agent Session" color={C.pi} sub="createAgentSession()" />
              <Arrow x1={270} y1={92} x2={300} y2={92} color={C.pi} delay={0.3} />

              <Box x={300} y={70} w={90} h={44} label="LLM Model" color={C.pi} sub="멀티 프로바이더" />

              {/* Agent loop arrow */}
              <motion.path d="M 345,114 C 345,140 210,145 210,114"
                fill="none" stroke={C.pi} strokeWidth={1} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }} />
              <motion.text x={270} y={155} textAnchor="middle" fontSize={7} fill={C.pi}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                에이전트 루프 (도구 호출 반복)
              </motion.text>

              {/* Tools */}
              {['bash', 'read', 'edit', 'messaging'].map((t, i) => (
                <motion.g key={t} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}>
                  <rect x={10 + i * 55} y={140} width={48} height={20} rx={3}
                    fill={`${C.pi}15`} stroke={C.pi} strokeWidth={1} />
                  <text x={34 + i * 55} y={154} textAnchor="middle"
                    fontSize={7} fill={C.pi}>{t}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 3: Response streaming */}
          {step === 3 && (
            <g>
              <Box x={10} y={65} w={100} h={44} label="Pi Agent" color={C.pi} sub="text_delta 이벤트" />

              {/* Streaming dots */}
              {[0, 1, 2, 3, 4].map(i => (
                <motion.circle key={i} cx={130 + i * 18} cy={87} r={3}
                  fill={C.response}
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: [0, 1, 0.3], x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.12, repeat: Infinity, repeatDelay: 1 }} />
              ))}

              <Box x={230} y={55} w={100} h={26} label="SSE Stream" color={C.response} />
              <Box x={230} y={90} w={100} h={26} label="WebSocket" color={C.response} />

              <Arrow x1={330} y1={68} x2={360} y2={68} color={C.response} delay={0.4} />
              <Arrow x1={330} y1={103} x2={360} y2={103} color={C.response} delay={0.5} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={360} y={60} width={30} height={50} rx={4}
                  fill={`${C.client}18`} stroke={C.client} strokeWidth={1.5} />
                <text x={375} y={89} textAnchor="middle" fontSize={8} fontWeight="600" fill={C.client}>
                  Client
                </text>
              </motion.g>

              <motion.text x={200} y={155} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                채널별 리치 메시지 포맷으로 변환하여 실시간 전달
              </motion.text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
