import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1) Message Construction — RawMessage' },
  { label: '2) Validation — size/duplicate/sig' },
  { label: '3) Recipient Selection — mesh/fanout' },
  { label: '4) IDONTWANT Broadcast (v1.2)' },
  { label: '5) Send + mcache update' },
  { label: 'IDONTWANT 효과 — bandwidth 절감' },
  { label: 'Flood vs Fanout 모드' },
];

const RAW_FIELDS = [
  { name: 'source', desc: 'PeerId', color: '#10b981' },
  { name: 'data', desc: 'Bytes', color: '#6366f1' },
  { name: 'sequence_number', desc: 'u64', color: '#f59e0b' },
  { name: 'topic', desc: 'TopicHash', color: '#ec4899' },
  { name: 'signature', desc: 'Option<Vec<u8>>', color: '#8b5cf6' },
  { name: 'validated', desc: 'bool', color: '#06b6d4' },
];

const VALIDATION = [
  { label: 'Message size check', color: '#f59e0b' },
  { label: 'Duplicate check (mcache)', color: '#ef4444' },
  { label: 'Signature validation', color: '#10b981' },
  { label: 'Topic subscription check', color: '#6366f1' },
];

export default function PublishFlowDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: RawMessage */}
          {step === 0 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                struct RawMessage
              </text>
              {RAW_FIELDS.map((f, i) => (
                <motion.g key={f.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                  <DataBox x={30 + (i % 2) * 230} y={38 + Math.floor(i / 2) * 50}
                    w={220} h={42} label={f.name} sub={f.desc} color={f.color} outlined />
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  message_id = hash(from || seqno || data)
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 1: validation */}
          {step === 1 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Validation Pipeline
              </text>
              {VALIDATION.map((v, i) => (
                <motion.g key={v.label} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={50} y={50 + i * 36} width={380} height={28} rx={4}
                    fill={v.color + '0a'} stroke={v.color + '50'} strokeWidth={0.7} />
                  <text x={70} y={68 + i * 36} fontSize={10} fontWeight={600} fill={v.color}>{v.label}</text>
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <rect x={80} y={205} width={320} height={26} rx={5}
                  fill="#ef44440a" stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={240} y={221} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#ef4444">
                  duplicate → drop silently
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 2: recipient selection */}
          {step === 2 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Recipient Selection
              </text>
              {[
                { y: 40, label: 'topic ∈ self.mesh', desc: '→ mesh[topic] 사용 (subscribed)', color: '#10b981' },
                { y: 90, label: 'topic ∈ self.fanout', desc: '→ fanout[topic] 재사용 (1분 TTL)', color: '#f59e0b' },
                { y: 140, label: 'else', desc: '→ peers_topic.shuffle()[:D=6] (새 fanout 생성)', color: '#6366f1' },
                { y: 190, label: 'flood_publish=true', desc: '→ all subscribed peers (optional)', color: '#ec4899' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={30} y={s.y} width={420} height={42} rx={5}
                    fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.7} />
                  <text x={50} y={s.y + 18} fontSize={10} fontWeight={700} fill={s.color}
                    style={{ fontFamily: 'monospace' }}>{s.label}</text>
                  <text x={50} y={s.y + 33} fontSize={9} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 3: IDONTWANT broadcast */}
          {step === 3 && (
            <g>
              <ModuleBox x={20} y={50} w={120} h={50} label="Publisher" sub="message 보유" color="#10b981" />
              {[
                { x: 200, y: 30, label: 'mesh peer 1' },
                { x: 200, y: 90, label: 'mesh peer 2' },
                { x: 340, y: 30, label: 'non-mesh A' },
                { x: 340, y: 90, label: 'non-mesh B' },
              ].map((p, i) => (
                <motion.g key={p.label} initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <DataBox x={p.x} y={p.y} w={120} h={36} label={p.label}
                    color={i < 2 ? '#10b981' : '#94a3b8'} />
                  {i < 2 && (
                    <line x1={140} y1={75} x2={p.x} y2={p.y + 18}
                      stroke="#10b981" strokeWidth={1.4} markerEnd="url(#par1)" />
                  )}
                  {i >= 2 && (
                    <line x1={140} y1={75} x2={p.x} y2={p.y + 18}
                      stroke="#ec4899" strokeWidth={1.2} strokeDasharray="3 2" markerEnd="url(#par2)" />
                  )}
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <text x={240} y={170} fontSize={9} fontWeight={700} fill="#10b981">─ full message</text>
                <text x={240} y={186} fontSize={9} fontWeight={700} fill="#ec4899">--- IDONTWANT(msg_id) (~50 bytes)</text>
                <text x={240} y={210} fontSize={9} fill="var(--muted-foreground)">non-mesh 가 같은 msg 보내지 않게 사전 dedup</text>
              </motion.g>
              <defs>
                <marker id="par1" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#10b981" />
                </marker>
                <marker id="par2" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#ec4899" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 4: send + mcache */}
          {step === 4 && (
            <g>
              <ActionBox x={30} y={50} w={140} h={50} label="create_publish_message" sub="(topic, data)" color="#6366f1" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <line x1={170} y1={75} x2={210} y2={75} stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#sar)" />
                <ActionBox x={210} y={50} w={140} h={50} label="send_rpc" sub="for peer in recipients" color="#ec4899" />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <line x1={350} y1={75} x2={390} y2={75} stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#sar)" />
                <DataBox x={390} y={55} w={70} h={42} label="recipients" color="#10b981" />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <line x1={280} y1={100} x2={280} y2={140} stroke="#10b981" strokeWidth={1.4}
                  markerEnd="url(#sar)" />
                <rect x={150} y={140} width={260} height={36} rx={5}
                  fill="#10b9810a" stroke="#10b981" strokeWidth={0.8} />
                <text x={280} y={158} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                  mcache.put(message_id, raw)
                </text>
                <text x={280} y={170} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                  IHAVE 발송 대기열 추가
                </text>
              </motion.g>
              <text x={240} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                return message_id — 호출자에게 ID 반환
              </text>
              <defs>
                <marker id="sar" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 5: IDONTWANT effect */}
          {step === 5 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                IDONTWANT — bandwidth 절감
              </text>
              <motion.g initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5 }} style={{ transformOrigin: 'bottom center' }}>
                <rect x={70} y={70} width={120} height={130} rx={6}
                  fill="#ef44440a" stroke="#ef4444" strokeWidth={0.8} />
                <text x={130} y={92} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
                  Main msg
                </text>
                <text x={130} y={110} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
                  KB ~ MB
                </text>
                <text x={130} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  Eth2 block ~10KB
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }} style={{ transformOrigin: 'bottom center' }}>
                <rect x={290} y={170} width={120} height={30} rx={6}
                  fill="#10b9810a" stroke="#10b981" strokeWidth={0.8} />
                <text x={350} y={185} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
                  IDONTWANT
                </text>
                <text x={350} y={196} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
                  ~50 bytes
                </text>
              </motion.g>
              <motion.text x={240} y={224} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                ~200x 작은 메시지로 중복 전송 회피 — Eth2 블록 전파 최적화
              </motion.text>
            </g>
          )}

          {/* Step 6: flood vs fanout */}
          {step === 6 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Flood vs Fanout
              </text>
              {[
                { y: 50, label: 'flood_publish = true', desc: '모든 subscribed peers (높은 bandwidth, 높은 신뢰성)', color: '#ef4444' },
                { y: 110, label: 'flood_publish = false', desc: 'fanout 만 (D=6) — 기본값, 효율적', color: '#10b981' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}>
                  <rect x={30} y={s.y} width={420} height={50} rx={6}
                    fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.8} />
                  <text x={50} y={s.y + 22} fontSize={10.5} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={50} y={s.y + 38} fontSize={9} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
              <AlertBox x={50} y={180} w={380} h={40} label="fanout_ttl: 60s"
                sub="미구독 topic의 fanout 유지 시간 — expire 후 정리" color="#f59e0b" />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
