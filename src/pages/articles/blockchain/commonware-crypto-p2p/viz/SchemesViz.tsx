import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { C, STEPS, STEP_REFS, STEP_LABELS } from './SchemesVizData';

interface Props {
  onOpenCode?: (key: string) => void;
}

const B = ({ x, y, w, h, c, t, s1, s2 }: {
  x: number; y: number; w: number; h: number;
  c: string; t: string; s1: string; s2: string;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={5} fill="var(--card)" />
    <rect x={x} y={y} width={w} height={h} rx={5}
      fill={`${c}10`} stroke={c} strokeWidth={1} />
    <text x={x + w / 2} y={y + 16} textAnchor="middle"
      fontSize={10} fontWeight={600} fill={c}>{t}</text>
    <text x={x + w / 2} y={y + 30} textAnchor="middle"
      fontSize={10} fill="var(--muted-foreground)">{s1}</text>
    <text x={x + w / 2} y={y + 42} textAnchor="middle"
      fontSize={10} fill="var(--muted-foreground)">{s2}</text>
  </g>
);

export default function SchemesViz({ onOpenCode }: Props) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 480 100" className="w-full max-w-2xl"
            style={{ height: 'auto' }}>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {step === 0 && <>
                <B x={20} y={10} w={200} h={52} c={C.ed}
                  t="ed25519::PrivateKey"
                  s1="Secret<SigningKey>"
                  s2="PK 32B · Sig 64B" />
                <B x={250} y={10} w={200} h={52} c={C.ed}
                  t="ed25519::PublicKey"
                  s1="Ord + Hash + Array"
                  s2="Batch 검증 지원" />
                <line x1={220} y1={36} x2={250} y2={36}
                  stroke="var(--border)" strokeWidth={0.6} />
                <text x={240} y={84} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">
                  ed25519-consensus — 합의 컨텍스트 엄격 검증
                </text>
              </>}
              {step === 1 && <>
                <B x={20} y={10} w={200} h={52} c={C.bls}
                  t="bls12381::PrivateKey"
                  s1="Secret<[u8; 32]> + Private"
                  s2="PK 48B(G1) · Sig 96B(G2)" />
                <B x={250} y={10} w={200} h={52} c={C.bls}
                  t="집계 서명"
                  s1="G2 점 덧셈 → 96B 유지"
                  s2="O(1) 인증서 크기" />
                <line x1={220} y1={36} x2={250} y2={36}
                  stroke="var(--border)" strokeWidth={0.6} />
                <text x={240} y={84} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">
                  blst 크레이트 — MinPk variant (공개키 최소화)
                </text>
              </>}
              {step === 2 && <>
                <B x={20} y={10} w={200} h={52} c={C.secp}
                  t="secp256r1::standard"
                  s1="RFC 6979 + BIP 62 low-s"
                  s2="PK 33B · Sig 64B" />
                <B x={250} y={10} w={200} h={52} c={C.secp}
                  t="secp256r1::recoverable"
                  s1="Sig 65B (r+s+v)"
                  s2="공개키 복원 가능" />
                <line x1={220} y1={36} x2={250} y2={36}
                  stroke="var(--border)" strokeWidth={0.6} />
                <text x={240} y={84} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">
                  NIST P-256 — HSM/TEE 하드웨어 호환
                </text>
              </>}
            </motion.g>
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton
                onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">
                {STEP_LABELS[step]}
              </span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
