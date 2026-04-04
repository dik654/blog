import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = (d: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace' };

/* Step 0: MSR 레지스터 초기화 */
export function StepSwLimit() {
  const regs = [
    { reg: 'IA32_FEATURE_CONTROL', val: '0x5', desc: 'SGX Enable + Lock' },
    { reg: 'IA32_SGX_SVN_STATUS', val: '0x0', desc: 'Security Version 확인' },
    { reg: 'CPUID.07H:EBX[2]', val: '1', desc: 'SGX 지원 확인' },
  ];
  return (<g>
    <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.hw}>BIOS: TEE 활성화 MSR 설정</text>
    {regs.map((r, i) => (
      <motion.g key={r.reg} {...f(i * 0.15)}>
        <rect x={30} y={30 + i * 28} width={200} height={22} rx={3} fill={`${C.hw}12`} stroke={C.hw} strokeWidth={1} />
        <text x={40} y={45 + i * 28} fontSize={10} fill={C.hw} fontWeight={600} {...mono}>{r.reg}</text>
        <text x={250} y={45 + i * 28} fontSize={10} fill={C.ok} fontWeight={600} {...mono}>{r.val}</text>
        <text x={310} y={45 + i * 28} fontSize={10} fill="var(--muted-foreground)">{r.desc}</text>
      </motion.g>
    ))}
    <motion.text x={240} y={120} textAnchor="middle" fontSize={10} fill={C.err} {...f(0.5)}>
      Lock Bit = 1 → 재부팅 전 WRMSR 거부
    </motion.text>
  </g>);
}

/* Step 1: CR4 보호 비트 */
export function StepTCB() {
  const bits = [
    { bit: 'CR4.SMEP', val: '1', desc: 'Ring 0에서 유저 코드 실행 차단' },
    { bit: 'CR4.SMAP', val: '1', desc: 'Ring 0에서 유저 데이터 접근 차단' },
    { bit: 'CR4.PKE', val: '1', desc: 'Protection Key 활성화' },
  ];
  return (<g>
    <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>CR4 보호 비트: 커널 권한 제한</text>
    {bits.map((b, i) => (
      <motion.g key={b.bit} {...f(i * 0.15)}>
        <rect x={40} y={30 + i * 28} width={120} height={22} rx={3} fill={`${C.ok}12`} stroke={C.ok} strokeWidth={1} />
        <text x={50} y={45 + i * 28} fontSize={10} fill={C.ok} fontWeight={600} {...mono}>{b.bit} = {b.val}</text>
        <text x={180} y={45 + i * 28} fontSize={10} fill="var(--foreground)">{b.desc}</text>
      </motion.g>
    ))}
    <motion.text x={240} y={120} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)" {...f(0.6)}>
      TCB = CPU 마이크로코드 + 펌웨어만 신뢰
    </motion.text>
  </g>);
}

/* Step 2: MEE 암호화 경로 */
export function StepThreat() {
  const steps = [
    { label: 'CPU Core', desc: 'plaintext', color: C.hw },
    { label: 'MEE', desc: 'AES-XTS(addr)', color: C.key },
    { label: 'DRAM', desc: 'ciphertext', color: C.err },
  ];
  return (<g>
    <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.key}>MEE: 메모리 버스 암호화</text>
    {steps.map((s, i) => (
      <motion.g key={s.label} {...f(i * 0.15)}>
        <rect x={30 + i * 150} y={35} width={120} height={40} rx={6} fill={`${s.color}12`} stroke={s.color} strokeWidth={1.2} />
        <text x={90 + i * 150} y={52} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.color}>{s.label}</text>
        <text x={90 + i * 150} y={66} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)" {...mono}>{s.desc}</text>
        {i < 2 && <motion.line x1={150 + i * 150} y1={55} x2={180 + i * 150} y2={55} stroke={s.color} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.15 + 0.1 }} />}
      </motion.g>
    ))}
    <motion.text x={240} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)" {...f(0.5)}>
      tweak = AES(key2, phys_addr) → 같은 데이터도 주소별 다른 암호문
    </motion.text>
  </g>);
}

/* Step 3: OTP 퓨즈 Root of Trust */
export function StepRoT() {
  const chain = [
    { label: 'OTP Fuse', desc: 'Root Key (소성)', color: C.key },
    { label: 'CSME ROM', desc: '서명 검증', color: C.fw },
    { label: 'ACM', desc: 'Auth Code Module', color: C.fw },
    { label: 'BIOS', desc: '측정 부트', color: C.hw },
  ];
  return (<g>
    <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.key}>Root of Trust: 퓨즈 → 부트 체인</text>
    {chain.map((c, i) => (
      <motion.g key={c.label} {...f(i * 0.12)}>
        <rect x={10 + i * 115} y={32} width={100} height={38} rx={5} fill={`${c.color}12`} stroke={c.color} strokeWidth={1} />
        <text x={60 + i * 115} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={c.color}>{c.label}</text>
        <text x={60 + i * 115} y={62} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{c.desc}</text>
        {i < 3 && <motion.line x1={110 + i * 115} y1={51} x2={125 + i * 115} y2={51}
          stroke={c.color} strokeWidth={1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.12 + 0.1 }} />}
      </motion.g>
    ))}
    <motion.text x={240} y={95} textAnchor="middle" fontSize={10} fill={C.ok} {...f(0.6)}>
      OTP = One-Time Programmable → 소프트웨어로 변경 불가
    </motion.text>
  </g>);
}
