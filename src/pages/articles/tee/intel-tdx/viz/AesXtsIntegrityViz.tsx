import { motion } from 'framer-motion';

const V10 = '#f59e0b';
const V15 = '#10b981';
const ATK = '#ef4444';
const KEY = '#8b5cf6';

interface Threat { name: string; v10: string; v15: string; }

const THREATS: Threat[] = [
  { name: 'Physical DRAM Read', v10: '방어 (암호문)', v15: '방어 (암호문)' },
  { name: 'Bit-flip 변조', v10: '랜덤값화', v15: '탐지 → MCE' },
  { name: 'Replay (old cipher)', v10: '취약', v15: '주소-결속 MAC' },
  { name: 'Cold Boot', v10: '방어', v15: '방어' },
];

export default function AesXtsIntegrityViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 320" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">AES-XTS + 무결성 — TDX 1.0 vs 1.5</text>

        {/* TDX 1.0 panel */}
        <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
          <rect x={20} y={40} width={210} height={130} rx={8}
            fill={V10} fillOpacity={0.08} stroke={V10} strokeWidth={1.2} />
          <text x={125} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill={V10}>
            TDX 1.0 — 암호화만
          </text>
          <text x={125} y={72} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            Sapphire Rapids (4th Gen Xeon)
          </text>

          <rect x={32} y={82} width={186} height={20} rx={3}
            fill={KEY} fillOpacity={0.15} stroke={KEY} strokeWidth={0.5} />
          <text x={125} y={96} textAnchor="middle" fontSize={8} fontFamily="monospace" fontWeight={600} fill={KEY}>
            AES-XTS-128 (data only)
          </text>

          <rect x={32} y={108} width={186} height={20} rx={3}
            fill={ATK} fillOpacity={0.12} stroke={ATK} strokeWidth={0.5} strokeDasharray="3 2" />
          <text x={125} y={122} textAnchor="middle" fontSize={8} fontWeight={600} fill={ATK}>
            MAC 없음 → 변조 미탐지
          </text>

          <rect x={32} y={134} width={186} height={20} rx={3}
            fill={ATK} fillOpacity={0.12} stroke={ATK} strokeWidth={0.5} strokeDasharray="3 2" />
          <text x={125} y={148} textAnchor="middle" fontSize={8} fontWeight={600} fill={ATK}>
            Replay 취약 (old ciphertext)
          </text>
        </motion.g>

        {/* TDX 1.5 panel */}
        <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <rect x={250} y={40} width={210} height={130} rx={8}
            fill={V15} fillOpacity={0.08} stroke={V15} strokeWidth={1.2} />
          <text x={355} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill={V15}>
            TDX 1.5 — Crypto Integrity
          </text>
          <text x={355} y={72} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            Emerald · Granite Rapids
          </text>

          <rect x={262} y={82} width={186} height={20} rx={3}
            fill={KEY} fillOpacity={0.15} stroke={KEY} strokeWidth={0.5} />
          <text x={355} y={96} textAnchor="middle" fontSize={8} fontFamily="monospace" fontWeight={600} fill={KEY}>
            AES-XTS + 28-bit MAC/line
          </text>

          <rect x={262} y={108} width={186} height={20} rx={3}
            fill={V15} fillOpacity={0.18} stroke={V15} strokeWidth={0.5} />
          <text x={355} y={122} textAnchor="middle" fontSize={8} fontWeight={600} fill={V15}>
            ECC 비트에 MAC 저장
          </text>

          <rect x={262} y={134} width={186} height={20} rx={3}
            fill={V15} fillOpacity={0.18} stroke={V15} strokeWidth={0.5} />
          <text x={355} y={148} textAnchor="middle" fontSize={8} fontWeight={600} fill={V15}>
            변조 → MCE 발생 → TD poison
          </text>
        </motion.g>

        {/* Threat comparison table */}
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <text x={240} y={195} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
            공격 모델별 방어 비교
          </text>
        </motion.g>

        <text x={36} y={215} fontSize={7} fontWeight={600} fill="var(--muted-foreground)">공격</text>
        <text x={210} y={215} fontSize={7} fontWeight={600} fill={V10}>TDX 1.0</text>
        <text x={340} y={215} fontSize={7} fontWeight={600} fill={V15}>TDX 1.5</text>

        {THREATS.map((t, i) => {
          const v10Bad = t.v10.includes('취약') || t.v10.includes('미탐지') || t.v10.includes('랜덤');
          const v10Color = v10Bad ? ATK : V10;
          return (
            <motion.g key={i}
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}>
              <rect x={20} y={222 + i * 22} width={440} height={19} rx={3}
                fill="var(--muted)" opacity={0.12} stroke="var(--border)" strokeWidth={0.4} />
              <text x={36} y={234 + i * 22} fontSize={7.5} fontWeight={600} fill="var(--foreground)">
                {t.name}
              </text>
              <rect x={195} y={225 + i * 22} width={120} height={13} rx={2}
                fill={v10Color} fillOpacity={0.18} stroke={v10Color} strokeWidth={0.4} />
              <text x={255} y={234 + i * 22} textAnchor="middle"
                fontSize={7} fontWeight={600} fill={v10Color}>
                {t.v10}
              </text>
              <rect x={325} y={225 + i * 22} width={120} height={13} rx={2}
                fill={V15} fillOpacity={0.18} stroke={V15} strokeWidth={0.4} />
              <text x={385} y={234 + i * 22} textAnchor="middle"
                fontSize={7} fontWeight={600} fill={V15}>
                {t.v15}
              </text>
            </motion.g>
          );
        })}

        {/* Bottom note */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
          <text x={240} y={312} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">
            BIOS: Intel TME-MT Enable + TDX Enable · Linux: /proc/cpuinfo | grep tdx_host_platform
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
