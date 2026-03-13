import { CitationBlock } from '../../../../components/ui/citation';

export default function Security() {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보안 속성과 블록체인 적용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">프리이미지 저항성 (Preimage Resistance)</h3>
        <p>
          해시값 h가 주어졌을 때, H(x) = h를 만족하는 입력 x를 찾는 것이 계산적으로
          불가능한 성질입니다. 이 속성은 <strong>Proof of Work 마이닝</strong>의 이론적 기반입니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`PoW 마이닝과 프리이미지 저항성:

목표: SHA-256(SHA-256(block_header)) < target

block_header = {
  version,
  prev_block_hash,
  merkle_root,
  timestamp,
  difficulty_bits,
  nonce          ← 이것을 변경하며 탐색
}

채굴자의 작업:
  for nonce in 0..2^32:
    hash = SHA-256(SHA-256(header(nonce)))
    if hash < target:
      return nonce  // 유효한 블록 발견!

프리이미지 저항성 → 무차별 대입(brute force)만 가능
  target이 앞 d개 비트가 0이면 → 평균 2^d 번 시도 필요
  현재 Bitcoin 난이도 ≈ 2^75~2^80 해시 연산`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">제2 프리이미지 저항성 (Second Preimage Resistance)</h3>
        <p>
          입력 x가 주어졌을 때, x ≠ y이면서 H(x) = H(y)인 다른 입력 y를 찾는 것이
          불가능한 성질입니다. 이 속성은 <strong>블록 변조 방지</strong>의 핵심입니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`블록 변조 방지 시나리오:

원본 블록:
  Block #100 = {
    transactions: [tx1, tx2, tx3],
    hash: SHA-256(SHA-256(header)) = 0x00000abc...
  }

공격자가 tx2를 변조하면:
  Block #100' = {
    transactions: [tx1, tx2', tx3],
    hash: SHA-256(SHA-256(header')) = 0x7f3d1e9a...  ← 완전히 다른 해시
  }

제2 프리이미지 저항성에 의해:
  - 변조된 블록이 동일한 해시를 가질 수 없음
  - 후속 블록의 prev_hash와 불일치 → 체인 무효화
  - 공격자는 변조 블록 이후 모든 블록을 재계산해야 함`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">충돌 저항성 (Collision Resistance)</h3>
        <p>
          H(x) = H(y)인 서로 다른 x, y 쌍을 찾는 것이 불가능한 성질입니다.
          충돌 저항성은 <strong>머클 트리의 안전성</strong>을 보장합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`머클 트리와 충돌 저항성:

Merkle Root = H(H(H(tx1) || H(tx2)) || H(H(tx3) || H(tx4)))

충돌 저항성이 보장하는 것:
  1. 동일한 Merkle Root를 생성하는 다른 트랜잭션 집합을 만들 수 없음
  2. 트랜잭션 순서를 변경해도 Root가 달라짐
  3. SPV 증명(Merkle Proof)의 신뢰성 보장

만약 충돌이 가능하다면:
  공격자가 tx1' ≠ tx1 이면서 H(tx1') = H(tx1)인 tx1'을 찾아
  악의적 트랜잭션으로 교체 가능 → 머클 트리 무의미`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Birthday Attack</h3>
        <p>
          생일 역설(Birthday Paradox)에 기반한 공격으로, 충돌을 찾는 데 필요한 연산량이
          전체 해시 공간의 제곱근에 비례합니다. 256-bit 해시 함수의 경우 충돌을 찾으려면
          약 <strong>2^128</strong>번의 연산이 필요합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Birthday Attack 분석:

해시 출력 크기: n bits
전수 조사 (brute force): 2^n 연산
Birthday Attack:         2^(n/2) 연산

해시 함수별 충돌 저항성:
  SHA-256   (n=256): 2^128 연산 → 현재 기술로 불가능
  SHA-1     (n=160): 2^80  연산 → 2017년 Google이 충돌 발견 (SHAttered)
  MD5       (n=128): 2^64  연산 → 2004년 충돌 발견, 완전히 깨짐

보안 마진 비교:
  2^64  = ≈ 1.8 × 10^19  (현대 컴퓨팅으로 공격 가능)
  2^80  = ≈ 1.2 × 10^24  (국가 급 자원으로 공격 가능)
  2^128 = ≈ 3.4 × 10^38  (물리적으로 불가능한 수준)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">해시 함수 선택 기준: 보안성 vs 성능</h3>
        <p>
          블록체인 프로토콜은 용도에 따라 서로 다른 해시 함수를 선택합니다. 전통적인
          SHA-256이나 Keccak-256은 범용 보안성이 뛰어나지만, 영지식 증명(ZK) 환경에서는
          산술 회로 친화적인 해시 함수가 필요합니다.
        </p>

        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">해시 함수</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">주요 사용처</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">출력 크기</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium text-foreground">SHA-256</td>
                <td className="py-3 px-4 text-muted-foreground">Bitcoin, 대부분의 PoW 체인</td>
                <td className="py-3 px-4 text-muted-foreground">256-bit</td>
                <td className="py-3 px-4 text-muted-foreground">높은 보안성, 하드웨어 최적화 (ASIC)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium text-foreground">Keccak-256</td>
                <td className="py-3 px-4 text-muted-foreground">Ethereum, EVM 호환 체인</td>
                <td className="py-3 px-4 text-muted-foreground">256-bit</td>
                <td className="py-3 px-4 text-muted-foreground">Sponge 구조, length extension 내성</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium text-foreground">BLAKE2/BLAKE3</td>
                <td className="py-3 px-4 text-muted-foreground">Zcash, Filecoin, Substrate</td>
                <td className="py-3 px-4 text-muted-foreground">가변</td>
                <td className="py-3 px-4 text-muted-foreground">SHA-256 수준 보안, 2-3배 빠른 속도</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4 font-medium text-foreground">Poseidon</td>
                <td className="py-3 px-4 text-muted-foreground">ZK-rollup, ZK-SNARK 회로</td>
                <td className="py-3 px-4 text-muted-foreground">필드 원소</td>
                <td className="py-3 px-4 text-muted-foreground">산술 회로 친화적, 낮은 constraint 수</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-foreground">Pedersen Hash</td>
                <td className="py-3 px-4 text-muted-foreground">Zcash Sapling, 타원곡선 기반</td>
                <td className="py-3 px-4 text-muted-foreground">필드 원소</td>
                <td className="py-3 px-4 text-muted-foreground">ZK 친화적, 동형 성질</td>
              </tr>
            </tbody>
          </table>
        </div>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`ZK 환경에서의 해시 함수 비용 비교 (R1CS constraint 수):

SHA-256:     ~25,000 constraints per hash
Keccak-256:  ~150,000 constraints per hash
Poseidon:    ~250 constraints per hash (약 100배 효율)
Pedersen:    ~1,500 constraints per hash

→ ZK-rollup에서는 Poseidon이 사실상 표준
   예: zkSync, Polygon zkEVM (상태 증명에 Poseidon 사용)`}</code></pre>

        <CitationBlock source="Rogaway & Shrimpton — Cryptographic Hash-Function Basics" citeKey={3} type="paper" href="https://web.cs.ucdavis.edu/~rogaway/papers/relates.pdf">
          <p className="italic text-foreground/80">
            "We consider seven properties that a hash function may have... We give
            a systematic treatment of the relationships among these properties."
          </p>
          <p className="mt-2 text-xs">
            Rogaway와 Shrimpton의 이 논문은 해시 함수의 보안 속성들(프리이미지 저항성,
            제2 프리이미지 저항성, 충돌 저항성 등) 간의 관계를 체계적으로 분석한 핵심
            학술 연구입니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
