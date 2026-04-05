import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import UnshieldViz from './viz/UnshieldViz';

export default function Unshield({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="unshield" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Unshield — ERC-20 출금</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>unshield()</code>는 shielded 잔액을 일반 ERC-20으로 출금하는 함수다.
          <br />
          ZK 증명으로 Note 소유권을 입증한 뒤, ERC-20 transfer로 토큰을 전송한다.
          <CodeViewButton onClick={() => onCodeRef('rg-unshield', codeRefs['rg-unshield'])} />
        </p>
        <p className="leading-7">
          출금 시점에 수신 주소(to)와 금액(amount)이 공개된다.
          <br />
          하지만 어떤 commitment에서 출금했는지는 nullifier 뒤에 숨는다.
          자금 출처를 추적할 수 없다.
        </p>
      </div>
      <div className="not-prose"><UnshieldViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Unshield Privacy Analysis</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Unshield 시 공개되는 정보

// ✗ 공개 (onchain, 누구나 볼 수 있음)
// - Recipient address (to)
// - Token address
// - Amount
// - Nullifier (one-time)
// - Tx sender (gas payer)

// ✓ 여전히 비공개
// - 어떤 commitment와 연결되는지
// - 원래 shield된 시점
// - 중간 거래 이력
// - Sender와 recipient의 연관성

// 의의
// Tornado Cash 대비 장점:
// - Arbitrary amount (denomination lock 없음)
// - Transaction timing 분산 가능
// - 중간 private transfer 가능

// 실전 privacy 개선 테크닉
// 1) Time delay
//    - Shield 후 수시간~수일 대기
//    - Deanon 방지

// 2) Amount randomization
//    - 정확한 값 대신 약간 다른 값
//    - Pattern matching 방어

// 3) Multi-hop
//    - Shield → Transfer → Transfer → Unshield
//    - Graph analysis 복잡화

// 4) Broadcaster 이용
//    - Gas cost도 private (tx sender ≠ recipient)
//    - 완벽한 익명성`}</pre>

      </div>
    </section>
  );
}
