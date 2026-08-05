import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const V0 = '#94a3b8';
const V1 = '#10b981';
const MB = '#6366f1';
const MC = '#0ea5e9';
const MH = '#f59e0b';
const HL = '#a855f7';

const STEPS = [
  { label: 'CIDv0 (legacy)', body: 'Qm 접두사 + base58btc(sha2-256). 항상 sha2-256 + base58btc, 46자 고정.' },
  { label: 'CIDv1 분해', body: 'multibase ‖ version ‖ multicodec ‖ multihash. 알고리즘·인코딩 모두 self-describing.' },
  { label: 'Multibase (인코딩)', body: 'b=base32 · z=base58btc · f=base16 · B=BASE32UPPER · k=base36.' },
  { label: 'Multicodec (데이터 형식)', body: '0x55=raw · 0x70=dag-pb · 0x71=dag-cbor · 0x0129=dag-json · 0x01=car.' },
  { label: 'Multihash (해시)', body: 'code + length + digest. 0x12 20=sha2-256, 0x1b 20=keccak-256, 0x14 20=blake3.' },
  { label: '실무 조합', body: 'Raw=raw+sha2-256 · UnixFS=dag-pb+sha2-256 · 구조화=dag-cbor+sha2-256 · iroh=raw+blake3.' },
];

const PARTS = [
  { key: 'mb', label: 'multibase', value: '"b"', sub: 'base32', color: MB, w: 70 },
  { key: 'ver', label: 'version', value: '0x01', sub: 'CIDv1', color: '#0284c7', w: 60 },
  { key: 'mc', label: 'multicodec', value: '0x70', sub: 'dag-pb', color: MC, w: 80 },
  { key: 'mh', label: 'multihash', value: '0x12 0x20 …', sub: 'sha2-256 + 32B digest', color: MH, w: 150 },
];

const COMBOS = [
  { name: 'Raw', value: 'raw + sha2-256' },
  { name: 'UnixFS', value: 'dag-pb + sha2-256' },
  { name: 'Structured', value: 'dag-cbor + sha2-256' },
  { name: 'Modern (iroh)', value: 'raw + blake3' },
];

const CODECS = [
  { code: '0x55', name: 'raw' },
  { code: '0x70', name: 'dag-pb (IPLD protobuf)' },
  { code: '0x71', name: 'dag-cbor (IPLD CBOR)' },
  { code: '0x01', name: 'car (Content Archive)' },
];

const HASHES = [
  { code: '0x12 20', name: 'sha2-256 (32B)' },
  { code: '0x1b 20', name: 'keccak-256 (32B)' },
  { code: '0x1e 20', name: 'blake2b-256 (32B)' },
  { code: '0x14 20', name: 'blake3 (32B)' },
];

const BASES = [
  { code: 'b', name: 'base32 (lowercase, 기본)' },
  { code: 'z', name: 'base58btc' },
  { code: 'f', name: 'base16 (hex)' },
  { code: 'B', name: 'BASE32UPPER' },
  { code: 'k', name: 'base36' },
];

export default function CIDFormatDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={V0}>
                CIDv0 — Legacy
              </text>
              <ModuleBox x={70} y={48} w={340} h={42}
                label="Qm + base58btc(sha2-256(content))"
                sub="46자 고정, sha2-256 + base58btc 만 가능"
                color={V0} />
              <text x={240} y={120} textAnchor="middle" fontSize={9} fill={V0}>
                예: QmWmyoMoctfbAaiEs2G46gpeUmhqFR3vCRuQxr...
              </text>
              <text x={240} y={150} textAnchor="middle" fontSize={10} fontWeight={600} fill={HL}>
                v1로의 진화 → 알고리즘 자유도 + self-describing
              </text>
              <line x1={140} y1={170} x2={340} y2={170} stroke={HL} strokeWidth={1} />
              <ModuleBox x={70} y={185} w={340} h={36}
                label="CIDv1: multibase ‖ version ‖ multicodec ‖ multihash"
                sub="" color={V1} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={V1}>
                CIDv1 분해
              </text>
              {PARTS.map((p, i) => {
                const x = 20 + (i === 0 ? 0 : PARTS.slice(0, i).reduce((s, pp) => s + pp.w + 6, 0));
                return (
                  <motion.g key={p.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <rect x={x} y={50} width={p.w} height={32} rx={5}
                      fill={p.color + '14'} stroke={p.color} strokeWidth={1} />
                    <text x={x + p.w / 2} y={67} textAnchor="middle"
                      fontSize={10} fontWeight={600} fill={p.color}>
                      {p.label}
                    </text>
                    <text x={x + p.w / 2} y={78} textAnchor="middle"
                      fontSize={8} fill="var(--muted-foreground)">
                      {p.value}
                    </text>
                  </motion.g>
                );
              })}
              <text x={240} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={10} fontWeight={600} fill={HL}>
                각 prefix가 자기 자신을 설명 → 알고리즘 교체 호환
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={MB}>
                Multibase — 인코딩 prefix
              </text>
              {BASES.map((b, i) => (
                <motion.g key={b.code}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <DataBox x={60} y={36 + i * 36} w={70} h={28}
                    label={b.code} color={MB} outlined />
                  <text x={150} y={56 + i * 36} fontSize={10} fill="var(--foreground)">
                    {b.name}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={MC}>
                Multicodec — 데이터 형식
              </text>
              {CODECS.map((c, i) => (
                <motion.g key={c.code}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <DataBox x={60} y={42 + i * 42} w={90} h={30}
                    label={c.code} color={MC} outlined />
                  <text x={170} y={62 + i * 42} fontSize={10} fill="var(--foreground)">
                    {c.name}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={MH}>
                Multihash — code · length · digest
              </text>
              <text x={240} y={36} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {'<hash-fn-code> <digest-size> <digest>'}
              </text>
              {HASHES.map((h, i) => (
                <motion.g key={h.code}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <DataBox x={60} y={56 + i * 42} w={100} h={30}
                    label={h.code} color={MH} outlined />
                  <text x={180} y={76 + i * 42} fontSize={10} fill="var(--foreground)">
                    {h.name}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                자주 쓰이는 조합
              </text>
              {COMBOS.map((c, i) => (
                <motion.g key={c.name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <ActionBox x={50} y={42 + i * 44} w={380} h={32}
                    label={c.name} sub={c.value} color={V1} />
                </motion.g>
              ))}
              <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                v0 → v1 변환: QmXxx → bafkxxx (같은 해시, 다른 표현)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
