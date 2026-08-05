import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.18, duration: 0.5 };
const C = {
  cliBi: '#0ea5e9',
  srvBi: '#10b981',
  cliUni: '#a855f7',
  srvUni: '#f59e0b',
  flow1: '#6366f1',
  flow2: '#ec4899',
  flow3: '#14b8a6',
};

const STEPS = [
  {
    label: 'Stream ID — 62-bit varint, 하위 2비트가 타입',
    body: '상위 비트는 일련번호. 하위 2비트로 시작 측(client/server) 와 방향(bi/uni) 을 인코딩.',
  },
  {
    label: '4가지 스트림 타입 한눈에',
    body: 'Stream ID & 0b11 결과로 한 번에 분기. HTTP/3 요청은 0x0 (client-initiated bidi).',
  },
  {
    label: '스트림 상태 전이 — 양 측이 독립',
    body: 'idle → open → half-closed → closed. 송신/수신 방향이 따로 돌아가므로 한 쪽만 닫혀도 다른 쪽은 계속.',
  },
  {
    label: 'Flow Control — 3 단계 계층',
    body: '수신 측이 광고하는 윈도우. 스트림 단위 / 연결 단위 / 동시 스트림 수 제한.',
  },
];

interface TypeRowProps { y: number; bits: string; name: string; color: string; example: string; }

function TypeRow({ y, bits, name, color, example }: TypeRowProps) {
  return (
    <g>
      <DataBox x={20} y={y} w={56} h={22} label={bits} color={color} outlined />
      <text x={88} y={y + 15} fontSize={10} fontWeight={600} fill={color}>{name}</text>
      <text x={300} y={y + 15} fontSize={9} fill="#9ca3af">{example}</text>
    </g>
  );
}

export default function StreamIdAndFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                Stream ID (62-bit variable-length integer)
              </text>
              {/* High bits */}
              <rect x={40} y={40} width={300} height={36} rx={4}
                fill={`${C.flow1}10`} stroke={C.flow1} strokeWidth={0.8} />
              <text x={190} y={62} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.flow1}>
                upper 60 bits — 일련번호 (per-direction 증가)
              </text>
              {/* Low 2 bits */}
              <rect x={350} y={40} width={90} height={36} rx={4}
                fill={`${C.cliBi}15`} stroke={C.cliBi} strokeWidth={0.8} />
              <text x={395} y={56} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.cliBi}>
                lower 2 bits
              </text>
              <text x={395} y={70} textAnchor="middle" fontSize={9} fill={C.cliBi}>
                type encoding
              </text>
              <text x={240} y={98} textAnchor="middle" fontSize={9} fill="#9ca3af">
                ID &amp; 0b11 → 4가지 분기
              </text>
              <motion.path d="M 395 76 L 395 100 L 240 130 L 240 145"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                stroke={C.cliBi} strokeWidth={1} fill="none" strokeDasharray="3 2" />
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill={C.cliBi} fontWeight={600}>
                다음 단계 →
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <TypeRow y={20} bits="0b00" name="client-initiated bidi" color={C.cliBi}
                example="예: HTTP/3 요청" />
              <TypeRow y={50} bits="0b01" name="server-initiated bidi" color={C.srvBi}
                example="예: 서버 푸시 응답" />
              <TypeRow y={80} bits="0b10" name="client-initiated uni" color={C.cliUni}
                example="예: 제어 메시지 송신" />
              <TypeRow y={110} bits="0b11" name="server-initiated uni" color={C.srvUni}
                example="예: HTTP/3 SETTINGS" />
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="#9ca3af">
                각 타입은 독립된 ID 공간. 충돌 없음.
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {['idle', 'open', 'half-closed', 'closed'].map((s, i) => (
                <g key={s}>
                  <ModuleBox x={20 + i * 115} y={50} w={95} h={42} label={s}
                    sub={['초기', '양방향 전송', '한쪽 종료', '완전 종료'][i]}
                    color={[C.flow1, C.cliBi, C.srvUni, '#94a3b8'][i]} />
                  {i < 3 && (
                    <motion.path d={`M ${115 + i * 115} 71 L ${135 + i * 115} 71`}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.2 }}
                      stroke="var(--foreground)" strokeWidth={1.2} fill="none"
                      markerEnd="url(#sarrow)" />
                  )}
                </g>
              ))}
              <defs>
                <marker id="sarrow" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
                  <polygon points="0 0, 5 2.5, 0 5" fill="var(--foreground)" />
                </marker>
              </defs>
              <text x={240} y={120} textAnchor="middle" fontSize={9} fill="#9ca3af">
                송신/수신 방향이 별도. 한쪽이 FIN 보내도 반대 방향은 계속.
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                3-level Flow Control
              </text>
              <StatusBox x={20} y={30} w={140} h={48} label="MAX_STREAM_DATA"
                sub="개별 스트림 윈도우" color={C.flow1} progress={0.6} />
              <StatusBox x={170} y={30} w={140} h={48} label="MAX_DATA"
                sub="연결 전체 합계" color={C.flow2} progress={0.45} />
              <StatusBox x={320} y={30} w={140} h={48} label="MAX_STREAMS"
                sub="동시 스트림 수" color={C.flow3} progress={0.75} />
              <text x={90} y={100} textAnchor="middle" fontSize={8.5} fill={C.flow1}>
                stream ⊂ connection
              </text>
              <text x={240} y={100} textAnchor="middle" fontSize={8.5} fill={C.flow2}>
                Σ streams ≤ MAX_DATA
              </text>
              <text x={390} y={100} textAnchor="middle" fontSize={8.5} fill={C.flow3}>
                새 스트림 생성 한도
              </text>
              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="#9ca3af">
                receiver 가 광고 → sender 가 준수 → 메모리 폭주 방지
              </text>
              <text x={240} y={148} textAnchor="middle" fontSize={9} fill="#9ca3af">
                window 도달 시 STREAM_DATA_BLOCKED / DATA_BLOCKED 신호
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
