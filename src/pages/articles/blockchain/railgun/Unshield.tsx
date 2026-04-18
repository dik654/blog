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
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">공개 (onchain, 누구나 볼 수 있음)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Recipient address (<code>to</code>)</li>
                <li>Token address</li>
                <li>Amount</li>
                <li>Nullifier (one-time)</li>
                <li>Tx sender (gas payer)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">여전히 비공개</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>어떤 commitment와 연결되는지</li>
                <li>원래 shield된 시점</li>
                <li>중간 거래 이력</li>
                <li>Sender와 recipient의 연관성</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">Tornado Cash 대비 장점</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center text-muted-foreground">
              <div className="bg-muted/50 rounded p-2">Arbitrary amount<br /><span className="text-xs">(denomination lock 없음)</span></div>
              <div className="bg-muted/50 rounded p-2">Timing 분산 가능<br /><span className="text-xs">(자유로운 출금 시점)</span></div>
              <div className="bg-muted/50 rounded p-2">중간 private transfer<br /><span className="text-xs">(연속 내부 거래)</span></div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/30 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-3">실전 privacy 개선 테크닉</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground/80">Time delay</p>
                <p>Shield 후 수시간~수일 대기 &mdash; deanon 방지</p>
              </div>
              <div>
                <p className="font-medium text-foreground/80">Amount randomization</p>
                <p>정확한 값 대신 약간 다른 값 &mdash; pattern matching 방어</p>
              </div>
              <div>
                <p className="font-medium text-foreground/80">Multi-hop</p>
                <p>Shield &rarr; Transfer &rarr; Transfer &rarr; Unshield &mdash; graph analysis 복잡화</p>
              </div>
              <div>
                <p className="font-medium text-foreground/80">Broadcaster 이용</p>
                <p>tx sender &ne; recipient &mdash; 완벽한 익명성</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
