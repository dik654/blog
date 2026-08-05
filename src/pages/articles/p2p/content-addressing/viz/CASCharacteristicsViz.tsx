import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const URL_C = '#94a3b8';
const CID_C = '#10b981';
const HL = '#6366f1';
const WARN = '#f59e0b';

const STEPS = [
  { label: 'Location vs Content', body: 'URL=서버 위치 + 경로. CID=내용 자체의 해시. 식별 기준이 근본적으로 다르다.' },
  { label: 'Immutability', body: '한번 쓰면 변경 불가. 변경=다른 CID. audit log, version control에 적합.' },
  { label: 'Deduplication', body: '같은 내용=같은 주소=한 번만 저장. 자동 storage 효율.' },
  { label: 'Integrity', body: 'verify: hash(content) == address. 변조 감지가 자동. 신뢰 없이 검증.' },
  { label: 'Distribution', body: '누구든 같은 CID로 서빙 가능. CDN-like, no trust needed.' },
  { label: 'Privacy', body: '주소=해시=high entropy. URL과 달리 경로 추측 불가.' },
  { label: 'Trade-offs', body: '✓ 불변·검증·dedup ✗ 최신 버전 갱신 어려움 (IPNS 필요) ✗ 초기 조회 느림 ✗ GC 복잡.' },
];

const CHARS = [
  { key: 'imm', label: 'Immutability', sub: '한번 쓰면 불변' },
  { key: 'dedup', label: 'Deduplication', sub: '같은 내용=1회 저장' },
  { key: 'int', label: 'Integrity', sub: 'hash(content)==addr' },
  { key: 'dist', label: 'Distribution', sub: 'no trust needed' },
  { key: 'priv', label: 'Privacy', sub: 'high entropy' },
];

const TRADEOFFS_PRO = [
  '✓ Immutable',
  '✓ Verifiable',
  '✓ Auto dedup',
];
const TRADEOFFS_CON = [
  '✗ "최신" 갱신 어려움',
  '✗ 초기 조회 느림',
  '✗ GC 복잡',
];

export default function CASCharacteristicsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={120} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={URL_C}>
                Location-based (HTTP)
              </text>
              <ModuleBox x={40} y={32} w={160} h={36}
                label="URL" sub="https://example.com/file.pdf" color={URL_C} />
              <ActionBox x={40} y={80} w={160} h={26}
                label="서버 관리자가 변경 가능" sub="동일 파일 → 여러 URL" color={URL_C} />
              <ActionBox x={40} y={114} w={160} h={26}
                label="서버 다운 → 접근 불가" sub="중앙 의존" color={WARN} />

              <text x={360} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={CID_C}>
                Content-addressable (IPFS)
              </text>
              <ModuleBox x={280} y={32} w={160} h={36}
                label="CID" sub="QmWmyo… (해시)" color={CID_C} />
              <ActionBox x={280} y={80} w={160} h={26}
                label="변경 = 다른 CID (불변)" sub="동일 내용 → 동일 CID" color={CID_C} />
              <ActionBox x={280} y={114} w={160} h={26}
                label="누구나 호스팅" sub="auto dedup" color={CID_C} />

              <text x={240} y={170} textAnchor="middle" fontSize={10} fontWeight={600} fill={HL}>
                식별 기준: 위치 vs 내용
              </text>
              <line x1={205} y1={50} x2={275} y2={50} stroke={HL} strokeWidth={1} strokeDasharray="3 2" />
              <text x={240} y={45} textAnchor="middle" fontSize={9} fill={HL}>vs</text>
            </motion.g>
          )}

          {step >= 1 && step <= 5 && (
            <>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                CAS 핵심 특성
              </text>
              {CHARS.map((c, i) => {
                const idx = i + 1;
                const active = step === idx;
                return (
                  <motion.g key={c.key}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0, scale: active ? 1.04 : 1 }}
                    transition={{ delay: i * 0.05 }}>
                    <ActionBox x={70} y={36 + i * 38} w={340} h={30}
                      label={c.label} sub={c.sub}
                      color={active ? HL : CID_C} />
                  </motion.g>
                );
              })}
            </>
          )}

          {step === 6 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Trade-offs
              </text>
              {TRADEOFFS_PRO.map((t, i) => (
                <motion.g key={t}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <DataBox x={50} y={50 + i * 40} w={170} h={30}
                    label={t} color={CID_C} outlined />
                </motion.g>
              ))}
              {TRADEOFFS_CON.map((t, i) => (
                <motion.g key={t}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}>
                  <DataBox x={260} y={50 + i * 40} w={170} h={30}
                    label={t} color={WARN} outlined />
                </motion.g>
              ))}
              <text x={240} y={220} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                응용: IPFS · iroh · OCI registry · Git · NFT metadata · backup
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
