import { motion } from 'framer-motion';

const C = { s: '#6366f1', e: '#10b981', a: '#f59e0b' };
const mono = { fontFamily: 'monospace' };
const f = (d: number) => ({ initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

export function TrustChainStep() {
  const lines = [
    { line: 'ECREATE(km_enclave)  // 키 매니저 Enclave 생성', c: C.s, y: 22 },
    { line: 'MRENCLAVE = SHA-256(km_code || init_data)', c: C.s, y: 44 },
    { line: 'MRSIGNER  = SHA-256(developer_signing_key)', c: C.e, y: 66 },
    { line: 'EREPORT → QE.sign(ECDSA) → Quote', c: C.e, y: 88 },
    { line: 'verify(Quote.MRENCLAVE == expected_hash)', c: C.a, y: 112 },
    { line: '  → OK: 키 발급 허가', c: C.a, y: 132 },
  ];
  return (<g>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.08)}>
        <rect x={30} y={l.y - 12} width={480} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={45} y={l.y + 2} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function KeyHierarchyStep() {
  const lines = [
    { line: 'root_secret = EGETKEY(SEAL_KEY)  // SGX 봉인', c: C.s, y: 22 },
    { line: 'rt_secret   = HKDF-SHA512(root, runtime_id)', c: C.s, y: 44 },
    { line: 'ct_secret   = HKDF-SHA512(rt, contract_addr)', c: C.e, y: 66 },
    { line: 'state_enc   = HKDF(ct_secret, "state-enc")', c: C.a, y: 90 },
    { line: 'tx_dec      = HKDF(ct_secret, "tx-decrypt")', c: C.a, y: 112 },
    { line: 'signing     = HKDF(ct_secret, "signing")', c: C.a, y: 134 },
  ];
  return (<g>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.08)}>
        <rect x={30} y={l.y - 12} width={480} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={45} y={l.y + 2} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}

export function KeyRequestStep() {
  const lines = [
    { line: '1. worker → KM: CallGetOrCreateKey(runtime_id)', c: C.s, y: 22 },
    { line: '2. KM: verify_sgx_quote(worker_quote)?', c: C.s, y: 44 },
    { line: '3. KM: key = HKDF(root, [rt_id, contract])', c: C.e, y: 66 },
    { line: '4. KM: encrypted = AEAD_Seal(session_key, key)', c: C.e, y: 88 },
    { line: '5. worker: key = AEAD_Open(session_key, encrypted)', c: C.a, y: 112 },
    { line: '6. worker: plaintext = AES_Decrypt(key, tx_cipher)', c: C.a, y: 134 },
  ];
  return (<g>
    {lines.map((l, i) => (
      <motion.g key={i} {...f(i * 0.08)}>
        <rect x={30} y={l.y - 12} width={480} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
        <text x={45} y={l.y + 2} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
      </motion.g>
    ))}
  </g>);
}
