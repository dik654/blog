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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Note 구조 (Solidity struct)
struct Note {
    bytes32 npk;        // Note public key (Poseidon hash)
    address token;       // ERC-20 address
    uint128 value;       // Amount
    bytes31 random;      // Blinding factor
}

// npk 파생
// 사용자 private key:
//   spendingKey = random 32 bytes (hex)
// 공개키:
//   npk = Poseidon(spendingKey, 1)  // domain separator
// 소유권 증명:
//   ZK proof "I know x such that npk = Poseidon(x, 1)"

// Commitment 계산
commitment = Poseidon(
    Poseidon(npk, token_bytes32, value_as_field),
    random_as_field
)
// 2단계 hash → circuit 효율성 (Poseidon constraint ~200 per call)

// 왜 Poseidon인가
// - SNARK-friendly hash (MDS matrix, S-box)
// - Keccak 대비 300x 회로 효율
// - 암호학적 안정성 검증됨 (2019~)
// - ZCash, RAILGUN, Polygon 등 채택

// 대안
// Pedersen hash: discrete log 기반, 느림
// MiMC: 간단하지만 Poseidon 대비 느림
// Rescue: 새로운 option, 더 빠르지만 덜 검증됨`}</pre>

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
