import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Multibase 접두사', body: 'b=base32, z=base58btc — 인코딩 자기 설명' },
  { label: 'Version 필드', body: '0x01=CIDv1, CIDv0은 legacy sha256 전용' },
  { label: 'Multicodec', body: 'dag-pb(0x70), dag-cbor(0x71), raw(0x55) 디코딩 방법 내장' },
  { label: 'Multihash', body: '해시 함수 코드 + 다이제스트 길이 + 해시값으로 알고리즘 교체 호환' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const PARTS = [
  { label: 'Multibase', w: 70, c: '#6366f1' },
  { label: 'Version', w: 55, c: '#0ea5e9' },
  { label: 'Multicodec', w: 80, c: '#10b981' },
  { label: 'Multihash', w: 140, c: '#f59e0b' },
];

export default function CIDStructViz() {
  let offset = 20;
  const positions = PARTS.map(p => {
    const x = offset;
    offset += p.w + 6;
    return x;
  });

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* CID label */}
          <text x={210} y={18} textAnchor="middle" fontSize={10} fontWeight={600}
            fill="var(--foreground)">CIDv1 구조</text>

          {/* Parts */}
          {PARTS.map((p, i) => {
            const active = i === step;
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.25, y: active ? -4 : 0 }}
                transition={sp}>
                <rect x={positions[i]} y={35} width={p.w} height={32} rx={5}
                  fill={p.c + '12'} stroke={p.c} strokeWidth={active ? 1.5 : 1} />
                <text x={positions[i] + p.w / 2} y={55} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={p.c}>{p.label}</text>
                {/* Detail below */}
                {active && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <text x={positions[i] + p.w / 2} y={85} textAnchor="middle"
                      fontSize={10} fill={p.c}>
                      {['"b" (base32)', '0x01', '0x70 (dag-pb)', 'sha2-256 + digest'][i]}
                    </text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}

          {/* Example CID */}
          <text x={210} y={105} textAnchor="middle" fontSize={10}
            fill="var(--foreground)" opacity={0.4}>
            bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
          </text>
        </svg>
      )}
    </StepViz>
  );
}
