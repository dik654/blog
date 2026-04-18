import type { CodeRef } from '@/components/code/types';
import NoteStructViz from './viz/NoteStructViz';

export default function NoteStruct({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="note-struct" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Note 구조체</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          RAILGUN의 기본 단위는 <strong>Note</strong>다. 4개 필드로 구성된다.
          <br />
          npk(공개키), token(ERC-20 주소), value(수량), random(블라인딩).
        </p>
        <p className="leading-7">
          <code>npk = poseidon(spendingKey)</code>로 계산한다. spendingKey는 비밀키다.
          <br />
          npk만 Note에 포함되므로, spendingKey 없이는 Note를 소비할 수 없다.
        </p>
        <p className="leading-7">
          <code>random</code> 필드는 블라인딩 팩터(blinding factor)다.
          <br />
          같은 금액을 두 번 보내도 random이 다르면 다른 commitment가 나온다.
          패턴 분석을 차단한다.
        </p>
      </div>
      <div className="not-prose"><NoteStructViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Note 필드 상세</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Note 구조체 (Solidity)</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <ul className="space-y-0.5">
                <li><code>npk</code>: <code>bytes32</code> &mdash; Note public key (Poseidon hash)</li>
                <li><code>token</code>: <code>address</code> &mdash; ERC-20 주소</li>
              </ul>
              <ul className="space-y-0.5">
                <li><code>value</code>: <code>uint128</code> &mdash; 수량</li>
                <li><code>random</code>: <code>bytes31</code> &mdash; 블라인딩 팩터</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">npk 파생 과정</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>비밀키</strong>: <code>spendingKey</code> = random 32 bytes</li>
                <li><strong>공개키</strong>: <code>npk = Poseidon(spendingKey, 1)</code> (domain separator)</li>
                <li><strong>소유권 증명</strong>: ZK proof &quot;I know x such that <code>npk = Poseidon(x, 1)</code>&quot;</li>
              </ul>
            </div>
            <div className="rounded-lg border border-violet-500/30 p-4">
              <p className="font-semibold text-sm text-violet-400 mb-2">Commitment 계산 (2단계 해시)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code>inner = Poseidon(npk, token, value)</code></li>
                <li><code>commitment = Poseidon(inner, random)</code></li>
                <li>2단계 분리 &rarr; circuit 효율성 (Poseidon constraint ~200/call)</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">왜 Poseidon인가</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>SNARK-friendly hash (MDS matrix, S-box)</li>
                <li>Keccak 대비 <strong>300x</strong> 회로 효율</li>
                <li>암호학적 안정성 검증됨 (2019~)</li>
                <li>ZCash, RAILGUN, Polygon 등 채택</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-muted-foreground mb-2">대안 해시 비교</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>Pedersen</strong>: discrete log 기반, 느림</li>
                <li><strong>MiMC</strong>: 간단하지만 Poseidon 대비 느림</li>
                <li><strong>Rescue</strong>: 더 빠르지만 덜 검증됨</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Note의 Privacy Properties</p>
          <p>
            <strong>Unlinkability</strong>: commitment → owner 매핑 불가<br />
            <strong>Untraceability</strong>: note flow 추적 불가<br />
            <strong>Hiding</strong>: commitment에서 value 추출 불가<br />
            <strong>Binding</strong>: 하나의 commitment가 여러 note에 대응 불가
          </p>
        </div>

      </div>
    </section>
  );
}
