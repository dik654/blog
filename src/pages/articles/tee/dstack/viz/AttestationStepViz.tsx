import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'report_data 생성 — SHA-512("tag":content) → 64바이트 패딩' },
  { label: '/dev/tdx_guest ioctl — TDG.MR.REPORT → SEAM → ECDSA Quote' },
  { label: 'Quote 구조 (v4) — Header + TdReport(MRTD, RTMR) + PCK 서명' },
  { label: 'RA-TLS — X.509 OID에 TDX Quote 임베딩, report_data = SHA-512(pubkey)' },
];
const mono = { fontFamily: 'monospace' };
const f = (d: number) => ({ initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

export default function AttestationStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">report_data 생성</text>
            {[
              { line: 'let content_type = QuoteContentType::RaTlsCert;', c: '#6366f1', y: 42 },
              { line: 'let tag = format!("{}:", content_type);', c: '#6366f1', y: 64 },
              { line: 'let hash = SHA-512(tag.as_bytes() || content);', c: '#10b981', y: 86 },
              { line: 'let mut report_data = [0u8; 64];', c: '#10b981', y: 108 },
              { line: 'report_data.copy_from_slice(&hash[..64]);', c: '#10b981', y: 130 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.1)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">TDX Quote 생성 (커널 경로)</text>
            {[
              { line: 'fd = open("/dev/tdx_guest", O_RDWR)', c: '#6366f1', y: 42 },
              { line: 'ioctl(fd, TDX_CMD_GET_REPORT, &report_data)', c: '#6366f1', y: 64 },
              { line: '  → TDCALL[TDG.MR.REPORT]  // CPU 명령어', c: '#10b981', y: 86 },
              { line: '  → SEAM 모듈이 MRTD + RTMR 포함 Report 생성', c: '#10b981', y: 108 },
              { line: 'ioctl(fd, TDX_CMD_GET_QUOTE, &quote_buf)', c: '#f59e0b', y: 130 },
              { line: '  → QE: ECDSA-P256(att_key, report) = Quote', c: '#f59e0b', y: 152 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">TdxQuote v4 구조체</text>
            {[
              { line: 'header     { version: 4, att_key: ECDSA_P256 }', c: '#6366f1', y: 42 },
              { line: 'td_report  {', c: '#10b981', y: 66 },
              { line: '  mrtd[48B],   // TD 초기 해시 (SHA-384)', c: '#10b981', y: 86 },
              { line: '  rtmr[0..3],  // 런타임 측정 (각 48B)', c: '#10b981', y: 106 },
              { line: '  report_data[64B]  // Guest 데이터', c: '#10b981', y: 126 },
              { line: '}  signature: PCK ECDSA-P256 서명', c: '#f59e0b', y: 148 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={50} y={l.y - 13} width={420} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={65} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">RA-TLS: Quote 임베딩</text>
            {[
              { line: '// X.509 인증서에 TDX Quote 삽입', c: '#6366f1', y: 42 },
              { line: 'cert.add_extension(OID_TDX_QUOTE, quote_bytes)', c: '#6366f1', y: 64 },
              { line: 'report_data = SHA-512("ratls-cert:" || pubkey)', c: '#10b981', y: 88 },
              { line: '// 검증자:', c: '#f59e0b', y: 112 },
              { line: 'tls_handshake() → extract_quote(cert)', c: '#f59e0b', y: 132 },
              { line: 'verify_quote(quote) && check(report_data, pubkey)', c: '#f59e0b', y: 152 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
