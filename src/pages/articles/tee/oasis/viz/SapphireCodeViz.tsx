import StepViz from '@/components/ui/step-viz';
import { ContractStep, KeyDerivStep, EthCompatStep } from './SapphireCodeVizParts';

const STEPS = [
  { label: '기밀 컨트랙트: SecretBallot', body: '일반 Solidity 문법 그대로 작성. Sapphire 위 배포 시 상태가 SGX 내에서만 복호화. 개별 투표는 비공개, 집계만 공개.' },
  { label: '키 파생 구조 (HKDF)', body: 'KM Root Secret → Runtime Key → Contract Key → State Encryption Key + Tx Decryption Key. 컨트랙트 주소 기반 HKDF 유도.' },
  { label: 'Ethereum 호환: sapphire-ethers', body: 'sapphire.wrap()으로 기존 ethers 지갑을 감싸면 모든 트랜잭션이 자동 암호화. Chain ID: 0x5afe (23294).' },
];

export default function SapphireCodeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ContractStep />}
          {step === 1 && <KeyDerivStep />}
          {step === 2 && <EthCompatStep />}
        </svg>
      )}
    </StepViz>
  );
}
