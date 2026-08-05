import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  intel: '#0ea5e9',
  amd: '#ec4899',
  arm: '#22c55e',
  tweak: '#f59e0b',
  vm: '#6366f1',
  mac: '#10b981',
  attack: '#ef4444',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: '6가지 메모리 암호화 방식',
    body: 'SGX EPC(AES-CTR+MAC) · SEV SME(AES-XEX, 페이지) · SEV(VM별 키) · SEV-SNP(+RMP) · TDX(AES-XTS-256) · ARM CCA(QARMA/AES).',
  },
  {
    label: 'Tweak-based encryption (XEX/XTS)',
    body: '주소를 tweak으로 사용 → 같은 평문이라도 주소마다 다른 암호문. 패턴 분석 방어. Intel/AMD 표준.',
  },
  {
    label: 'Per-VM keys: VM 격리의 핵심',
    body: 'VM마다 다른 키 → VM 간 메모리 노출 차단. SEV(2017+)가 도입한 핵심 혁신. TDX/CCA로 확산.',
  },
  {
    label: 'Integrity (MAC): 변조 감지 필수',
    body: 'SGX MAC tag/line, SEV-SNP RMP(Reverse Map), TDX built-in integrity. 암호화만으로는 replay/swap 공격 불가능.',
  },
  {
    label: '물리적 공격 대응 매트릭스',
    body: 'DMA → IOMMU + RMP, Cold Boot → 전원 cut 시 key 삭제, Bus probing → 모든 데이터 암호화, Chip attack → Secure processor 격리.',
  },
];

interface Method {
  name: string;
  vendor: string;
  algo: string;
  scope: string;
  color: string;
}

const METHODS: Method[] = [
  { name: 'SGX EPC', vendor: 'Intel', algo: 'AES-CTR+MAC', scope: '플랫폼-1개', color: C.intel },
  { name: 'SEV SME', vendor: 'AMD', algo: 'AES-128-XEX', scope: '페이지-1개', color: C.amd },
  { name: 'SEV', vendor: 'AMD', algo: 'AES-128-XEX', scope: 'VM-1개', color: C.amd },
  { name: 'SEV-SNP', vendor: 'AMD', algo: 'AES-128-XEX+RMP', scope: 'VM-1개', color: C.amd },
  { name: 'TDX', vendor: 'Intel', algo: 'AES-XTS-256', scope: 'TD-1개', color: C.intel },
  { name: 'ARM CCA', vendor: 'ARM', algo: 'QARMA/AES', scope: 'Realm-1개', color: C.arm },
];

function MethodGrid() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">TEE 메모리 암호화 — 알고리즘 · 키 범위</text>
      {/* header */}
      <text x={28} y={32} fontSize={8} fontWeight={700} fill={C.muted}>방식</text>
      <text x={120} y={32} fontSize={8} fontWeight={700} fill={C.muted}>vendor</text>
      <text x={210} y={32} fontSize={8} fontWeight={700} fill={C.muted}>algo</text>
      <text x={380} y={32} fontSize={8} fontWeight={700} fill={C.muted}>scope</text>
      {METHODS.map((m, i) => {
        const y = 38 + i * 16;
        return (
          <motion.g key={m.name} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}>
            <rect x={20} y={y} width={440} height={14} rx={2}
              fill={`${m.color}10`} stroke={`${m.color}50`} strokeWidth={0.5} />
            <text x={28} y={y + 10} fontSize={9} fontWeight={700} fill={m.color}>{m.name}</text>
            <text x={120} y={y + 10} fontSize={8.5} fill="var(--foreground)">{m.vendor}</text>
            <text x={210} y={y + 10} fontSize={8.5} fontFamily="monospace" fill={m.color}>{m.algo}</text>
            <text x={380} y={y + 10} fontSize={8.5} fill={C.muted}>{m.scope}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

function TweakViz() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.tweak}>
        Tweak-based encryption — 주소가 ciphertext에 영향
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={26} width={440} height={28} rx={4}
          fill={`${C.tweak}10`} stroke={C.tweak} strokeWidth={1} />
        <text x={240} y={45} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={700} fill={C.tweak}>
          C = E(K, P XOR (T*α^i))   /* T = address */
        </text>
      </motion.g>
      {[
        { addr: '0x1000', plain: 'AAAA', cipher: '7f3c4d8a', y: 70, color: C.intel },
        { addr: '0x2000', plain: 'AAAA', cipher: 'b291ec55', y: 90, color: C.amd },
        { addr: '0x3000', plain: 'AAAA', cipher: '03e8f1ab', y: 110, color: C.arm },
      ].map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}>
          <text x={30} y={r.y} fontSize={9} fontFamily="monospace" fontWeight={600} fill={r.color}>
            addr={r.addr}
          </text>
          <text x={130} y={r.y} fontSize={9} fontFamily="monospace" fill={C.muted}>plain={r.plain}</text>
          <text x={230} y={r.y} fontSize={9} fontFamily="monospace" fontWeight={700} fill={r.color}>
            → cipher={r.cipher}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

function PerVmKeys() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.vm}>
        Per-VM keys — VM 격리
      </text>
      {[
        { name: 'VM-A', key: 'key_A', x: 30, color: C.vm },
        { name: 'VM-B', key: 'key_B', x: 180, color: C.amd },
        { name: 'VM-C', key: 'key_C', x: 330, color: C.arm },
      ].map((vm, i) => (
        <motion.g key={vm.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={vm.x} y={28} width={120} height={56} rx={6}
            fill={`${vm.color}10`} stroke={vm.color} strokeWidth={1} />
          <text x={vm.x + 60} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={vm.color}>{vm.name}</text>
          <text x={vm.x + 60} y={62} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={vm.color}>{vm.key}</text>
          <text x={vm.x + 60} y={76} textAnchor="middle" fontSize={8} fill={C.muted}>memory: 암호문</text>
        </motion.g>
      ))}
      <motion.text x={240} y={104} textAnchor="middle" fontSize={9} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        VM-A의 ciphertext를 VM-B가 읽으면 → 쓰레기 값 (key 다름)
      </motion.text>
    </g>
  );
}

function IntegrityViz() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mac}>
        Integrity — 변조 감지
      </text>
      {[
        { tee: 'SGX', mech: 'MAC tag per cache line', desc: 'cipher + 8B MAC', color: C.intel },
        { tee: 'SEV-SNP', mech: 'RMP (Reverse Map Table)', desc: 'page mapping 검증', color: C.amd },
        { tee: 'TDX', mech: 'Built-in integrity', desc: 'SEAM 강제', color: C.intel },
      ].map((r, i) => (
        <motion.g key={r.tee} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={20} y={28 + i * 28} width={440} height={22} rx={4}
            fill={`${r.color}10`} stroke={r.color} strokeWidth={0.8} />
          <text x={32} y={42 + i * 28} fontSize={10} fontWeight={700} fill={r.color}>{r.tee}</text>
          <text x={130} y={42 + i * 28} fontSize={9} fontWeight={600} fill="var(--foreground)">{r.mech}</text>
          <text x={300} y={42 + i * 28} fontSize={9} fill={C.muted}>{r.desc}</text>
        </motion.g>
      ))}
    </g>
  );
}

function PhysicalAttacks() {
  const attacks = [
    { name: 'DMA 공격', defense: 'IOMMU + SEV-SNP RMP', color: C.attack },
    { name: 'Cold Boot', defense: '전원 cut 시 key 삭제', color: C.attack },
    { name: 'Bus probing', defense: '모든 data encrypted', color: C.attack },
    { name: 'Chip attack', defense: 'Secure processor 격리', color: C.attack },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">물리적 공격 → 방어 매핑</text>
      {attacks.map((a, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 20 + col * 225;
        const y = 28 + row * 50;
        return (
          <motion.g key={a.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={x} y={y} width={215} height={42} rx={5}
              fill={`${a.color}08`} stroke={a.color} strokeWidth={0.8} strokeDasharray="3 2" />
            <text x={x + 10} y={y + 16} fontSize={10} fontWeight={700} fill={a.color}>X {a.name}</text>
            <text x={x + 10} y={y + 32} fontSize={8.5} fill={C.mac}>→ {a.defense}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function EncryptCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <MethodGrid />}
          {step === 1 && <TweakViz />}
          {step === 2 && <PerVmKeys />}
          {step === 3 && <IntegrityViz />}
          {step === 4 && <PhysicalAttacks />}
        </svg>
      )}
    </StepViz>
  );
}
