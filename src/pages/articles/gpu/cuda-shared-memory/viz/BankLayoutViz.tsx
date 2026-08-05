import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: '공유 메모리 = 32 banks × 4-byte stride',
    body: '연속된 4바이트 주소가 연속 뱅크에 매핑된다. 각 뱅크는 4바이트(32비트) 폭.',
  },
  {
    label: '주소 0~3 → Bank 0, 4~7 → Bank 1, ...',
    body: 'Bank 번호 = (address / 4) % 32. 같은 워프 32 스레드가 32 다른 뱅크를 동시 접근하면 1사이클.',
  },
  {
    label: '주소 128~131 → Bank 0 (다시 0번으로 순환)',
    body: '뱅크는 32개로 순환. 128바이트마다 같은 뱅크가 반복된다.',
  },
];

const BANKS_PER_ROW = 16;
const BANK_W = 24;
const BANK_H = 22;

export default function BankLayoutViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            공유 메모리 뱅크 레이아웃
          </text>

          {/* Bank header — 32 banks (2 rows of 16) */}
          {Array.from({ length: 32 }).map((_, b) => {
            const r = Math.floor(b / BANKS_PER_ROW);
            const c = b % BANKS_PER_ROW;
            const x = 50 + c * BANK_W;
            const y = 50 + r * (BANK_H + 4);
            const isHighlighted =
              (step === 1 && b < 8) ||
              (step === 2 && b === 0);
            return (
              <motion.g key={b}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: b * 0.01 }}>
                <rect x={x} y={y} width={BANK_W - 2} height={BANK_H} rx={2}
                  fill={isHighlighted ? '#6366f1' : '#888'}
                  opacity={isHighlighted ? 0.85 : 0.25} />
                <text x={x + (BANK_W - 2) / 2} y={y + 14} textAnchor="middle"
                  fontSize={7.5} fontWeight={600}
                  fill={isHighlighted ? 'white' : 'var(--muted-foreground)'}>
                  {b}
                </text>
              </motion.g>
            );
          })}
          <text x={50} y={45} fontSize={8} fill="var(--muted-foreground)">Banks 0..31 (4-byte width each)</text>

          {/* Address mapping detail */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                주소 → 뱅크 매핑
              </text>
              {[
                { addr: '0..3', bank: 0 },
                { addr: '4..7', bank: 1 },
                { addr: '8..11', bank: 2 },
                { addr: '12..15', bank: 3 },
                { addr: '...', bank: -1 },
                { addr: '124..127', bank: 31 },
              ].map((m, i) => {
                const x = 50 + i * 70;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}>
                    <rect x={x} y={155} width={62} height={28} rx={3}
                      fill="#10b981" opacity={0.15} stroke="#10b981" strokeWidth={0.5} />
                    <text x={x + 31} y={170} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill="#10b981">{m.addr}</text>
                    <text x={x + 31} y={180} textAnchor="middle" fontSize={8}
                      fill="var(--muted-foreground)">
                      {m.bank >= 0 ? `Bank ${m.bank}` : ''}
                    </text>
                  </motion.g>
                );
              })}
              <text x={240} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Bank = (address / 4) % 32
              </text>
              <text x={240} y={224} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                연속 4B → 다른 뱅크 → 충돌 없음
              </text>
            </motion.g>
          )}

          {/* Step 2: 순환 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                128B 마다 Bank 0이 반복
              </text>

              {[
                { addr: 0, bank: 0, c: '#6366f1' },
                { addr: 4, bank: 1, c: '#10b981' },
                { addr: 124, bank: 31, c: '#f59e0b' },
                { addr: 128, bank: 0, c: '#6366f1' },
                { addr: 132, bank: 1, c: '#10b981' },
                { addr: 256, bank: 0, c: '#6366f1' },
              ].map((m, i) => {
                const x = 30 + i * 75;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}>
                    <rect x={x} y={160} width={70} height={32} rx={3}
                      fill={m.c} opacity={0.15} stroke={m.c} strokeWidth={0.6} />
                    <text x={x + 35} y={175} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill={m.c}>addr {m.addr}</text>
                    <text x={x + 35} y={187} textAnchor="middle" fontSize={8}
                      fill="var(--muted-foreground)">→ Bank {m.bank}</text>
                  </motion.g>
                );
              })}
              <text x={240} y={220} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 색 = 같은 뱅크 → 동시 접근 시 충돌
              </text>
            </motion.g>
          )}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                32 banks × 4 bytes = 128 bytes 폭
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                32 스레드가 32 다른 뱅크 동시 접근 → 1 사이클
              </text>
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 뱅크에 N 스레드 동시 접근 → N 사이클 직렬
              </text>
              <text x={240} y={210} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">
                Bank = (address / 4) % 32
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
