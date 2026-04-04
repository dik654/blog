import ERC4337Viz from './viz/ERC4337Viz';
import CodePanel from '@/components/ui/code-panel';

const erc4337Code = `// ERC-4337: Account Abstraction via Alt Mempool

// UserOperation 구조:
//   sender: Smart Account 주소
//   nonce: 리플레이 방지 (2차원 nonce — key + sequence)
//   callData: 실행할 함수 호출 데이터
//   signature: 커스텀 서명 (ECDSA, BLS, Passkey 등)

// Bundler:
//   UserOp를 수집하여 하나의 트랜잭션으로 번들링
//   handleOps(UserOperation[]) → EntryPoint에 제출
//   Bundler 자체는 EOA — 온체인 트랜잭션 개시

// EntryPoint (싱글턴 컨트랙트):
//   1. validateUserOp() — Smart Account의 검증 로직 호출
//   2. paymaster.validatePaymasterUserOp() — 가스비 대납 검증
//   3. account.execute(callData) — 실제 실행
//   검증과 실행을 분리하여 DoS 방지

// Paymaster:
//   가스비를 대신 지불하는 컨트랙트
//   ERC-20 토큰, 구독 모델, 무료 체험 등 구현 가능`;

const annotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [3, 7], color: 'sky', note: 'UserOperation — 사용자 의도 기술' },
  { lines: [9, 12], color: 'emerald', note: 'Bundler — UserOp 번들링 & 제출' },
  { lines: [14, 18], color: 'amber', note: 'EntryPoint — 검증-실행 분리' },
];

export default function ERC4337() {
  return (
    <section id="erc4337" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ERC-4337: UserOp, Bundler, EntryPoint</h2>
      <div className="not-prose mb-8"><ERC4337Viz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ERC-4337(Vitalik et al., 2021)은 프로토콜 변경 없이
          스마트 컨트랙트 지갑을 통한 AA를 구현합니다.<br />
          UserOperation이라는 의사 트랜잭션(pseudo-transaction)을
          Bundler가 수집하여 EntryPoint 컨트랙트에 제출합니다.
        </p>
        <CodePanel title="ERC-4337 아키텍처" code={erc4337Code}
          annotations={annotations} />
        <p className="leading-7">
          EntryPoint는 검증(validation)과 실행(execution)을 분리합니다.<br />
          검증 단계에서 실패하면 가스가 소비되지 않아 DoS를 방지합니다.
        </p>
      </div>
    </section>
  );
}
