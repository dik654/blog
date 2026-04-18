import { motion } from 'framer-motion';

export default function UNetDetailSteps({ step }: { step: number }) {
  return (
    <g>
      {step === 0 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">U-Net 구조 (Stable Diffusion)</text>
          {/* Encoder path */}
          {[
            { x: 20, w: 60, h: 50, label: '64x64', sub: '320ch', color: '#3b82f6' },
            { x: 95, w: 50, h: 42, label: '32x32', sub: '640ch', color: '#3b82f6' },
            { x: 160, w: 40, h: 34, label: '16x16', sub: '1280', color: '#3b82f6' },
            { x: 215, w: 35, h: 28, label: '8x8', sub: '1280', color: '#3b82f6' },
          ].map((d, i) => (
            <g key={`e${i}`}>
              <rect x={d.x} y={75 - d.h / 2} width={d.w} height={d.h} rx={4} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <text x={d.x + d.w / 2} y={75 - d.h / 2 + 14} textAnchor="middle" fontSize={7} fontWeight={600} fill={d.color}>{d.label}</text>
              <text x={d.x + d.w / 2} y={75 + d.h / 2 - 4} textAnchor="middle" fontSize={6} fill="var(--muted-foreground)">{d.sub}</text>
              {i < 3 && <line x1={d.x + d.w + 2} y1={75} x2={[95, 160, 215][i] - 2} y2={75} stroke={d.color} strokeWidth={0.6} />}
            </g>
          ))}
          {/* Middle */}
          <rect x={260} y={60} width={40} height={30} rx={4} fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1} />
          <text x={280} y={79} textAnchor="middle" fontSize={7} fontWeight={600} fill="#8b5cf6">Mid</text>
          <line x1={250} y1={75} x2={260} y2={75} stroke="#8b5cf6" strokeWidth={0.6} />
          {/* Decoder path */}
          {[
            { x: 310, w: 35, h: 28 }, { x: 360, w: 40, h: 34 },
            { x: 415, w: 50, h: 42 },
          ].map((d, i) => (
            <g key={`d${i}`}>
              <rect x={d.x} y={75 - d.h / 2} width={d.w} height={d.h} rx={4} fill="#ec489910" stroke="#ec4899" strokeWidth={0.8} />
              <text x={d.x + d.w / 2} y={79} textAnchor="middle" fontSize={7} fontWeight={600} fill="#ec4899">
                {['8x8', '16x16', '32x32'][i]}
              </text>
              {i < 2 && <line x1={d.x + d.w + 2} y1={75} x2={[360, 415][i] - 2} y2={75} stroke="#ec4899" strokeWidth={0.6} />}
            </g>
          ))}
          <line x1={300} y1={75} x2={310} y2={75} stroke="#ec4899" strokeWidth={0.6} />
          {/* Skip connections */}
          {[0, 1, 2].map((i) => {
            const ex = [80, 145, 215][i];
            const dx = [465, 415, 360][i];
            return (
              <line key={`s${i}`} x1={ex} y1={50 - i * 3} x2={dx} y2={50 - i * 3}
                stroke="#10b981" strokeWidth={0.5} strokeDasharray="3 2" />
            );
          })}
          <text x={240} y={38} textAnchor="middle" fontSize={7} fill="#10b981">Skip connections</text>
          {/* Labels */}
          <text x={100} y={120} textAnchor="middle" fontSize={8} fill="#3b82f6">Encoder (Down)</text>
          <text x={280} y={120} textAnchor="middle" fontSize={8} fill="#8b5cf6">Middle</text>
          <text x={400} y={120} textAnchor="middle" fontSize={8} fill="#ec4899">Decoder (Up)</text>
          <text x={240} y={145} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">860M params | ResBlock + Attention 반복</text>
        </motion.g>
      )}

      {step === 1 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#f59e0b">Timestep Embedding</text>
          {/* 흐름 */}
          <circle cx={50} cy={65} r={16} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
          <text x={50} y={62} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">t</text>
          <text x={50} y={74} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">timestep</text>
          <line x1={66} y1={65} x2={100} y2={65} stroke="#f59e0b" strokeWidth={1} />
          <rect x={100} y={48} width={100} height={34} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
          <text x={150} y={63} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">Sin/Cos Emb</text>
          <text x={150} y={76} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">128dim</text>
          <line x1={200} y1={65} x2={230} y2={65} stroke="#f59e0b" strokeWidth={1} />
          <rect x={230} y={48} width={80} height={34} rx={6} fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
          <text x={270} y={63} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">MLP</text>
          <text x={270} y={76} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">SiLU</text>
          <line x1={310} y1={65} x2={340} y2={65} stroke="#f59e0b" strokeWidth={1} />
          <rect x={340} y={48} width={80} height={34} rx={6} fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
          <text x={380} y={63} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">t_emb</text>
          <text x={380} y={76} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">time_dim</text>
          {/* ResBlock 주입 */}
          <line x1={380} y1={82} x2={380} y2={100} stroke="#10b981" strokeWidth={0.8} />
          <rect x={280} y={100} width={200} height={32} rx={6} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={380} y={114} textAnchor="middle" fontSize={9} fill="#10b981">h = h + t_proj(t_emb)</text>
          <text x={380} y={126} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">모든 ResBlock에 주입</text>
          <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            Positional encoding과 동일 원리 — 시점 정보 인코딩
          </text>
        </motion.g>
      )}

      {step === 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#8b5cf6">Cross-Attention (텍스트 조건)</text>
          {/* CLIP */}
          <rect x={20} y={30} width={80} height={30} rx={4} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
          <text x={60} y={49} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3b82f6">Prompt</text>
          <line x1={100} y1={45} x2={120} y2={45} stroke="#3b82f6" strokeWidth={0.8} />
          <rect x={120} y={30} width={80} height={30} rx={4} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.8} />
          <text x={160} y={44} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3b82f6">CLIP Enc</text>
          <text x={160} y={56} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">77x768</text>
          {/* QKV */}
          <line x1={200} y1={45} x2={220} y2={45} stroke="#8b5cf6" strokeWidth={0.8} />
          <rect x={220} y={25} width={240} height={90} rx={8} fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.8} />
          <text x={340} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">Cross-Attention</text>
          {/* Q from image */}
          <rect x={230} y={50} width={65} height={22} rx={4} fill="#10b98110" stroke="#10b981" strokeWidth={0.6} />
          <text x={262} y={65} textAnchor="middle" fontSize={8} fill="#10b981">Q (이미지)</text>
          {/* K from text */}
          <rect x={305} y={50} width={65} height={22} rx={4} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.6} />
          <text x={337} y={65} textAnchor="middle" fontSize={8} fill="#3b82f6">K (텍스트)</text>
          {/* V from text */}
          <rect x={380} y={50} width={65} height={22} rx={4} fill="#3b82f610" stroke="#3b82f6" strokeWidth={0.6} />
          <text x={412} y={65} textAnchor="middle" fontSize={8} fill="#3b82f6">V (텍스트)</text>
          {/* 공식 */}
          <text x={340} y={92} textAnchor="middle" fontSize={9} fill="#8b5cf6">attn = softmax(Q·K^T/√d) · V</text>
          <text x={340} y={106} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">텍스트 의미 → 이미지 생성에 반영</text>
          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            Self-Attention (이미지 내) + Cross-Attention (텍스트 조건)
          </text>
        </motion.g>
      )}

      {step === 3 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">U-Net → DiT 전환</text>
          {[
            { x: 20, yr: '2020', name: 'DDPM U-Net', sub: '36M', color: '#3b82f6' },
            { x: 120, yr: '2022', name: 'SD 1.5', sub: '860M', color: '#6366f1' },
            { x: 230, yr: '2023', name: 'SDXL', sub: '3.5B', color: '#8b5cf6' },
            { x: 340, yr: '2024', name: 'SD3 DiT', sub: 'MM-DiT', color: '#10b981' },
          ].map((d) => (
            <g key={d.name}>
              <rect x={d.x} y={30} width={90} height={55} rx={8} fill={`${d.color}10`} stroke={d.color} strokeWidth={0.8} />
              <rect x={d.x} y={30} width={90} height={5} rx={2.5} fill={d.color} opacity={0.85} />
              <text x={d.x + 45} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={d.color}>{d.name}</text>
              <text x={d.x + 45} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{d.sub}</text>
              <text x={d.x + 45} y={78} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{d.yr}</text>
            </g>
          ))}
          {/* 화살표 */}
          {[0, 1, 2].map((i) => (
            <line key={i} x1={[110, 210, 320][i]} y1={57} x2={[120, 230, 340][i]} y2={57}
              stroke="var(--foreground)" strokeWidth={0.6} />
          ))}
          {/* 트렌드 */}
          <rect x={60} y={100} width={360} height={40} rx={6} fill="#10b98108" stroke="#10b981" strokeWidth={0.6} />
          <text x={240} y={116} textAnchor="middle" fontSize={9} fill="#10b981">Transformer 기반 확산 모델로 이동</text>
          <text x={240} y={132} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            Multi-resolution | Consistency distillation | Flow matching
          </text>
        </motion.g>
      )}
    </g>
  );
}
