import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  agent: '#6366f1',
  tdx: '#10b981',
  qe: '#0ea5e9',
  rd: '#f59e0b',
  size: '#8b5cf6',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'generate_quote(report_data) — guest agent 진입점' },
  { label: 'TDREPORT 발급 — get_tdx_report() 호출 (1024B 결과)' },
  { label: 'configfs-tsm — Linux 6.5+의 새 표준 인터페이스' },
  { label: 'Legacy 경로 — /dev/tdx-attest ioctl 호출' },
  { label: 'report_data 구조 — 32B pubkey hash + 32B nonce' },
];

export default function QuoteGenViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            dstack-guest-agent — TDX Quote 생성 (Rust)
          </text>
          {step === 0 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.agent}>
                pub async fn generate_quote()
              </text>
              {[
                { line: 'pub async fn generate_quote(', c: C.agent },
                { line: '    report_data: [u8; 64]', c: C.agent },
                { line: ') -> Result<Vec<u8>> {', c: C.agent },
                { line: '    let report = get_tdx_report(&report_data)?;', c: C.tdx },
                { line: '    let quote = configfs_tsm_report(&report)?;', c: C.qe },
                { line: '    Ok(quote)', c: C.agent },
                { line: '}', c: C.agent },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={52 + i * 22} width={440} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={64 + i * 22} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <text x={240} y={216} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                use tdx_attest::get_tdx_report;
              </text>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.tdx}>
                TDREPORT 발급 — TDX Module이 생성
              </text>
              <ActionBox x={30} y={56} w={150} h={42} label="report_data 입력" sub="64 bytes" color={C.rd} />
              <text x={195} y={80} fontSize={11} fill={C.tdx}>→</text>
              <ActionBox x={210} y={56} w={120} h={42} label="TDX Module" sub="TDG.MR.REPORT" color={C.tdx} />
              <text x={345} y={80} fontSize={11} fill={C.tdx}>→</text>
              <DataBox x={360} y={62} w={100} h={32} label="TDREPORT" sub="1024 bytes" color={C.qe} outlined />
              <text x={240} y={120} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.tdx}>TDREPORT 구성</text>
              {[
                'TDREPORT = MRTD + RTMR[0..3] + platform info',
                'MRTD = TD launch 시 초기 image hash (SHA-384)',
                'RTMR[0..3] = 런타임 측정 (extend-only)',
                'TEE_TCB_INFO = TDX module 버전 등',
              ].map((t, i) => (
                <motion.text key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.2 + i * 0.1 }}
                  x={36} y={142 + i * 16} fontSize={8.5} fill="var(--muted-foreground)">• {t}</motion.text>
              ))}
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.qe}>
                configfs-tsm — Linux 6.5+ 표준 인터페이스
              </text>
              {[
                { line: '// configfs-tsm path', c: C.qe },
                { line: 'mkdir /sys/kernel/config/tsm/report/instance1', c: C.qe },
                { line: 'echo $report_data > .../inblob', c: C.tdx },
                { line: 'cat .../outblob   # → quote bytes', c: C.tdx },
                { line: '// Rust binding', c: C.qe },
                { line: 'let quote = configfs_tsm_report(&report)?;', c: C.agent },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={52 + i * 24} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={66 + i * 24} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Vendor-agnostic — TDX/SEV/CCA 모두 같은 API 사용 예정
              </text>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.tdx}>
                Legacy 경로 (/dev/tdx-attest)
              </text>
              {[
                { line: 'let fd = open("/dev/tdx-attest", O_RDWR)?;', c: C.qe },
                { line: 'let req = TdxQuoteReq {', c: C.tdx },
                { line: '    report_data: [u8; 64],', c: C.tdx },
                { line: '    quote: [u8; 4096],', c: C.tdx },
                { line: '};', c: C.tdx },
                { line: 'ioctl(fd, TDX_CMD_GET_QUOTE, &mut req)?;', c: C.qe },
                { line: '// req.quote에 결과 저장', c: C.agent },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={52 + i * 22} width={440} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={65 + i * 22} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <text x={240} y={216} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                구버전 TDX guest kernel에서 사용 (현재 deprecated)
              </text>
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.rd}>
                report_data — 64 bytes 구성
              </text>
              <motion.g initial={{ opacity: 0, scaleX: 0.5 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.2 }} style={{ transformOrigin: '240px 80px' }}>
                <rect x={40} y={58} width={400} height={44} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} />
                <rect x={40} y={58} width={200} height={44} rx={6} fill={`${C.qe}25`} stroke={C.qe} strokeWidth={0.8} />
                <rect x={240} y={58} width={200} height={44} rx={6} fill={`${C.rd}25`} stroke={C.rd} strokeWidth={0.8} />
                <text x={140} y={78} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.qe}>앞 32 bytes</text>
                <text x={140} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">앱 공개키 해시</text>
                <text x={340} y={78} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.rd}>뒤 32 bytes</text>
                <text x={340} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">KMS nonce</text>
              </motion.g>
              {[
                { c: C.qe, t: '세션 키 binding — Quote 검증 후 동일 키로 암호화 통신' },
                { c: C.rd, t: 'Replay 방어 — KMS가 매 요청마다 새 nonce 발급' },
                { c: C.size, t: 'TDREPORT = 1024B  ·  TDX Quote ≈ 4 KB (cert chain 포함)' },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
                  <rect x={30} y={120 + i * 24} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={42} y={134 + i * 24} fontSize={8.5} fill={l.c} fontWeight={600}>{l.t}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
