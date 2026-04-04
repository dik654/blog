import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '키 계층 — HKDF-SHA256: derive(root_key, [app_id, purpose])' },
  { label: '키 발급 — MRTD 화이트리스트 검사 → 디스크/환경/K256 키 유도' },
  { label: 'K256 서명 — HKDF → SigningKey → root_key.sign(app_pubkey)' },
  { label: '부팅 정책 — MRTD 화이트리스트 미등록 시 키 발급 거부' },
];
const mono = { fontFamily: 'monospace' };
const f = (d: number) => ({ initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

export default function KeyMgmtStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">HKDF-SHA256 키 파생 계층</text>
            {[
              { line: 'root_secret  = SGX_EGETKEY(SEAL_KEY)', c: '#6366f1', y: 42 },
              { line: 'root_ca_key  = HKDF(root, "ca-key")', c: '#6366f1', y: 64 },
              { line: 'k256_root    = HKDF(root, "k256-root")', c: '#f59e0b', y: 86 },
              { line: 'app_disk_key = HKDF(root_ca, [app_id, "disk"])', c: '#10b981', y: 108 },
              { line: 'app_env_key  = HKDF(root_ca, [app_id, "env"])', c: '#10b981', y: 130 },
              { line: 'app_k256_key = HKDF(k256_root, [app_id, "app"])', c: '#f59e0b', y: 152 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">get_app_key 키 발급 흐름</text>
            {[
              { line: '1. let quote = tdx_attest::get_quote(&report)?;', c: '#6366f1', y: 42 },
              { line: '2. verify_quote(&quote)?;  // PCK 체인 검증', c: '#6366f1', y: 64 },
              { line: '3. let mrtd = quote.td_report.mrtd;', c: '#10b981', y: 86 },
              { line: '4. whitelist.contains(&mrtd)?;  // 정책 검사', c: '#f59e0b', y: 108 },
              { line: '5. let disk = HKDF(root, [app_id, "disk"]);', c: '#10b981', y: 130 },
              { line: '6. let k256 = HKDF(k256_root, [app_id, "app"]);', c: '#f59e0b', y: 152 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">K256 키 유도 + 루트 서명</text>
            {[
              { line: 'let ctx = [app_id.as_bytes(), b"app-key"];', c: '#6366f1', y: 42 },
              { line: 'let secret = hkdf.expand(&ctx, 32)?;', c: '#6366f1', y: 64 },
              { line: 'let signing_key = k256::SigningKey::from(secret);', c: '#10b981', y: 86 },
              { line: 'let pub_bytes = signing_key.verifying_key().sec1();', c: '#10b981', y: 108 },
              { line: 'let sig = root_k256.sign(b"dstack-kms-issued"', c: '#f59e0b', y: 130 },
              { line: '                        || &pub_bytes);', c: '#f59e0b', y: 150 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">부팅 허가 정책</text>
            {[
              { line: 'let mrtd = quote.td_report.mrtd;  // 48B 해시', c: '#6366f1', y: 42 },
              { line: 'if !config.allowed_mrtd.contains(&mrtd) {', c: '#ef4444', y: 66 },
              { line: '  return Err(KmsError::UnauthorizedTd);', c: '#ef4444', y: 86 },
              { line: '}', c: '#ef4444', y: 106 },
              { line: '// 통과 시: app_id = sha256(compose) → 키 유도', c: '#10b981', y: 130 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.1)}>
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
