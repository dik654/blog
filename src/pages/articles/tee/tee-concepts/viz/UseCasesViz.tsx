import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. Confidential Computing — 클라우드 VM 기밀, 의료/금융 처리, MPC' },
  { label: '2. 블록체인·Web3 — 기밀 컨트랙트, off-chain compute, MEV 보호' },
  { label: '3. DRM — Netflix Widevine L1, Apple FairPlay, 모바일 미디어' },
  { label: '4. Key Management — HW-backed keystore, signing, CA' },
  { label: '5. Biometric — Face ID, Fingerprint TA' },
  { label: '6. Federated Learning — privacy-preserving ML' },
];

const CASE_DATA: { color: string; examples: { name: string; sub: string }[] }[] = [
  {
    color: '#6366f1',
    examples: [
      { name: 'Azure Confidential VMs', sub: 'AMD SEV-SNP / Intel TDX' },
      { name: 'AWS Nitro Enclaves', sub: 'EC2 격리 boundary' },
      { name: '의료·금융 처리', sub: 'HIPAA/PCI-DSS 준수' },
      { name: 'Multi-party computation', sub: '여러 당사자 합산 연산' },
    ],
  },
  {
    color: '#10b981',
    examples: [
      { name: 'Oasis / Secret', sub: '기밀 스마트 컨트랙트' },
      { name: 'Phala', sub: 'off-chain compute oracle' },
      { name: 'Sealed-bid auction', sub: '입찰가 비공개' },
      { name: 'MEV 보호', sub: 'mempool 암호화' },
    ],
  },
  {
    color: '#f59e0b',
    examples: [
      { name: 'Netflix Widevine L1', sub: 'TrustZone TA' },
      { name: 'Apple FairPlay', sub: 'Secure Enclave' },
      { name: 'Spotify Premium', sub: 'modular DRM' },
      { name: 'Mobile streaming', sub: '4K HDR 방어' },
    ],
  },
  {
    color: '#0ea5e9',
    examples: [
      { name: 'HW-backed keystore', sub: 'Android KeyStore TEE' },
      { name: 'Code signing', sub: 'CI/CD 서명 키 보관' },
      { name: 'Apple Secure Enclave', sub: 'iOS/macOS 키' },
      { name: 'Google Titan', sub: '데이터센터 + Pixel' },
    ],
  },
  {
    color: '#a855f7',
    examples: [
      { name: 'Apple Secure Enclave Processor', sub: 'Touch/Face ID 처리' },
      { name: 'Android TEE TA', sub: '지문 매칭' },
      { name: 'Windows Hello', sub: 'VBS 격리' },
      { name: 'Qualcomm QSEE', sub: 'biometric vault' },
    ],
  },
  {
    color: '#ef4444',
    examples: [
      { name: 'Privacy-preserving ML', sub: '개별 데이터 비공개' },
      { name: 'Intel SGX + HE', sub: '연산 가속' },
      { name: 'Cross-org training', sub: '병원·은행 협업' },
      { name: 'Differential privacy', sub: 'noise + TEE 결합' },
    ],
  },
];

export default function UseCasesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const c = CASE_DATA[step];
        return (
          <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={c.color}>
              사용 사례 {step + 1}
            </text>
            {c.examples.map((ex, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}>
                <ModuleBox x={20 + (i % 2) * 245} y={45 + Math.floor(i / 2) * 80}
                  w={235} h={62} label={ex.name} sub={ex.sub} color={c.color} />
              </motion.g>
            ))}
          </svg>
        );
      }}
    </StepViz>
  );
}
