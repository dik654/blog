import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  policy: '#6366f1',
  parse: '#10b981',
  tcb: '#0ea5e9',
  match: '#f59e0b',
  derive: '#8b5cf6',
  err: '#ef4444',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'struct Policy — allowed_mrtd · expected_rtmr · min_tcb · app_ids' },
  { label: '1) Quote 파싱 + 서명 검증 (Intel PCS root key)' },
  { label: '2) TCB 검사 — TDX module 버전이 정책 최소치 이상인지' },
  { label: '3) MRTD 매칭 — 알려진 image hash인지 확인' },
  { label: '4) RTMR[3] 매칭 — 앱 레벨 측정 (compose hash)' },
  { label: '5) App 키 파생 + 클라이언트 공개키로 암호화' },
];

const POLICY_FIELDS = [
  { f: 'allowed_mrtd', t: 'HashSet<[u8; 48]>', d: '허용된 이미지 SHA-384', color: C.policy },
  { f: 'expected_rtmr', t: 'HashMap<usize, Vec<...>>', d: 'RTMR index별 매칭 후보', color: C.policy },
  { f: 'min_tcb', t: 'TcbVersion', d: '최소 TDX module 버전', color: C.policy },
  { f: 'app_ids', t: 'HashSet<String>', d: '정책 적용 대상 앱 식별자', color: C.policy },
];

export default function KmsPolicyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            dstack-kms — pub async fn handle_attestation()
          </text>
          {step === 0 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.policy}>
                struct Policy (정책 객체)
              </text>
              {POLICY_FIELDS.map((p, i) => (
                <motion.g key={p.f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={48 + i * 36} width={420} height={30} rx={5}
                    fill={`${p.color}10`} stroke={`${p.color}45`} strokeWidth={0.7} />
                  <rect x={30} y={48 + i * 36} width={3.5} height={30} fill={p.color} />
                  <text x={45} y={62 + i * 36} fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={p.color}>{p.f}</text>
                  <text x={150} y={62 + i * 36} fontSize={8.5} fontFamily="monospace" fill="var(--muted-foreground)">{p.t}</text>
                  <text x={45} y={74 + i * 36} fontSize={8.5} fill="var(--muted-foreground)">{p.d}</text>
                </motion.g>
              ))}
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.parse}>
                Quote 파싱 + 서명 검증
              </text>
              {[
                { line: 'let parsed = parse_tdx_quote(quote)?;', c: C.parse },
                { line: 'verify_quote_signature(&parsed, intel_pcs)?;', c: C.parse },
                { line: '// PCK = Provisioning Certification Key', c: C.policy },
                { line: '// Cert chain: PCK → Intel SGX Root CA', c: C.policy },
                { line: '// 검증 실패 → Err(InvalidSignature)', c: C.err },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={56 + i * 26} width={440} height={22} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={70 + i * 26} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <ActionBox x={130} y={196} w={220} h={26} label="Quote 위변조 즉시 차단" color={C.parse} />
            </g>
          )}
          {step === 2 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.tcb}>
                TCB (Trusted Computing Base) 버전 체크
              </text>
              {[
                { line: 'if parsed.tcb < policy.min_tcb {', c: C.tcb },
                { line: '    return Err(Error::OutdatedTcb);', c: C.err },
                { line: '}', c: C.tcb },
                { line: '// TCB = TDX Module + microcode 버전', c: C.policy },
                { line: '// 패치 안 된 TDX는 known vuln 가능성', c: C.err },
                { line: '// 앱 owner가 정책으로 강제', c: C.tcb },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={56 + i * 24} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={68 + i * 24} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <text x={240} y={216} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Intel TCB Recovery 발생 시 정책 업데이트 → 강제 재배포
              </text>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.match}>
                MRTD 매칭 — 알려진 image인지
              </text>
              {[
                { line: 'if !policy.allowed_mrtd.contains(&parsed.mrtd) {', c: C.match },
                { line: '    return Err(Error::UnknownImage);', c: C.err },
                { line: '}', c: C.match },
                { line: '// MRTD = TD 초기 launch image hash (SHA-384)', c: C.policy },
                { line: '// = sha384(kernel || initrd || cmdline)', c: C.policy },
                { line: '// 다른 image면 거부 → 정확히 빌드한 것만 통과', c: C.match },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={56 + i * 24} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={68 + i * 24} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <DataBox x={130} y={200} w={220} h={26} label="Reproducible build → 결정적 MRTD" color={C.match} />
            </g>
          )}
          {step === 4 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.match}>
                RTMR[3] — 앱 레벨 measurement
              </text>
              {[
                { line: 'if !policy.expected_rtmr[&3]', c: C.match },
                { line: '    .contains(&parsed.rtmr[3]) {', c: C.match },
                { line: '    return Err(Error::WrongAppMeasurement);', c: C.err },
                { line: '}', c: C.match },
                { line: '// RTMR[3] = sha384(compose) ⊕ sha384(image_A) ⊕ ...', c: C.policy },
                { line: '// 같은 docker-compose + 같은 layers → 같은 RTMR[3]', c: C.match },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={56 + i * 24} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={68 + i * 24} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
              <AlertBox x={130} y={200} w={220} h={26} label="앱 변경되면 RTMR[3] 변경 → 거부" color={C.err} />
            </g>
          )}
          {step === 5 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.derive}>
                키 파생 + 클라이언트 공개키 암호화
              </text>
              {[
                { line: 'let app_key = derive_app_key(app_id, &parsed);', c: C.derive },
                { line: '// HKDF(root_key, "app:" + app_id)', c: C.policy },
                { line: 'let pubkey = &parsed.report_data[..32];', c: C.derive },
                { line: 'let encrypted = encrypt_with_pubkey(', c: C.derive },
                { line: '    &app_key, pubkey,', c: C.derive },
                { line: ');', c: C.derive },
                { line: 'Ok(encrypted)  // 클라이언트만 복호화 가능', c: C.match },
              ].map((l, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20} y={56 + i * 22} width={440} height={18} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
                  <text x={32} y={68 + i * 22} fontSize={9} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
