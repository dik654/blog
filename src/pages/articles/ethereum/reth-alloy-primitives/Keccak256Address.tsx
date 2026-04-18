import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import Keccak256Viz from './viz/Keccak256Viz';

export default function Keccak256Address({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="keccak256-address" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Keccak256과 Address 생성</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 주소는 공개키에서 파생된다.<br />
          secp256k1 공개키(64바이트)를 Keccak256으로 해시하면 32바이트가 나오고, 그 하위 20바이트가 Address가 된다.
        </p>
        <p className="leading-7">
          컨트랙트 배포 시 주소 생성 방법은 두 가지다.<br />
          <strong>CREATE</strong>는 sender 주소와 nonce를 RLP 인코딩한 후 Keccak256 해시의 하위 20바이트를 사용한다.<br />
          nonce가 변할 때마다 주소도 변하므로 배포 전 주소를 예측하기 어렵다.
        </p>
        <p className="leading-7">
          <strong>CREATE2</strong>는 <code>0xff + sender + salt + init_code_hash</code>를 해시한다.<br />
          salt와 배포 코드만 알면 주소를 미리 계산할 수 있다.<br />
          이를 counterfactual deployment라 부르며, 상태 채널이나 지갑 팩토리에서 활용된다.
        </p>

        {/* ── Keccak256 vs SHA-3 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Keccak256 vs SHA3-256 — 이더리움의 특수성</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm leading-6 mb-3">
            이더리움은 "표준" SHA3-256이 아니라 "원본" Keccak-256을 사용한다.
            2015년 런칭 당시 NIST가 패딩 규칙을 바꾸기 직전이었고, 이더리움은 변경 전 Keccak을 채택했다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2">
              <p className="font-semibold mb-1">SHA3-256</p>
              <p className="text-muted-foreground">Keccak[r=1088, c=512] + 패딩 <code>0x06</code></p>
              <p className="text-xs text-muted-foreground mt-1 break-all">sha3(""): 0xa7ffc6f8...f8434a</p>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <p className="font-semibold mb-1">Keccak256</p>
              <p className="text-muted-foreground">Keccak[r=1088, c=512] + 패딩 <code>0x01</code></p>
              <p className="text-xs text-muted-foreground mt-1 break-all">keccak(""): 0xc5d24601...d85a470</p>
            </div>
          </div>
          <p className="text-sm font-semibold mb-2"><code>tiny_keccak</code> 크레이트 (Reth 사용)</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-1.5">pure Rust, <code>no_std</code> 지원</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">~2 cycles/byte</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">HW 가속 불가 (소프트웨어 only)</div>
          </div>
          <p className="text-sm font-semibold mb-2">keccak256 호출 빈도 (블록 실행 1회 = 수천~수만 호출)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-1.5 text-center">EVM SHA3 opcode</div>
            <div className="rounded border border-border bg-background px-3 py-1.5 text-center">Address 생성</div>
            <div className="rounded border border-border bg-background px-3 py-1.5 text-center">Merkle trie 노드</div>
            <div className="rounded border border-border bg-background px-3 py-1.5 text-center">TX 해시</div>
          </div>
        </div>
        <p className="leading-7">
          이더리움이 Keccak256을 계속 쓰는 이유: <strong>하위 호환성</strong>.<br />
          2015년 런칭 이후 모든 블록이 Keccak256 기반이므로 변경 불가능.<br />
          Bitcoin의 SHA-256과 대조적 — Bitcoin은 HW 가속 가능, 이더리움은 소프트웨어 only.
        </p>

        {/* ── Address 생성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">공개키 → Address 파생</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2">secp256k1 공개키 구조</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2"><code>[0x04, x(32B), y(32B)]</code> = 65B uncompressed</div>
            <div className="rounded border border-border bg-background px-3 py-2"><code>[0x02|0x03, x(32B)]</code> = 33B compressed</div>
          </div>
          <p className="text-sm font-semibold mb-2">Address 유도 (5단계)</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">1.</span>
              <span>공개키를 uncompressed 직렬화 → <code>{'[u8; 65]'}</code></span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">2.</span>
              <span>첫 바이트 <code>0x04</code> prefix 제거 → 64바이트</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">3.</span>
              <span><code>keccak256(pk_bytes)</code> → 32바이트 해시</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">4.</span>
              <span>하위 20바이트 추출: <code>hash[12..32]</code></span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">5.</span>
              <span><code>Address::from(addr_bytes)</code>로 래핑</span>
            </div>
          </div>
          <p className="text-sm font-semibold mb-2">왜 하위 20바이트인가?</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-start gap-2"><span className="text-muted-foreground">-</span> 충돌 확률: 2^160 = ~10^48 → 실제로 0</div>
            <div className="flex items-start gap-2"><span className="text-muted-foreground">-</span> 20바이트는 시각적 가독성과 보안의 타협점</div>
            <div className="flex items-start gap-2"><span className="text-muted-foreground">-</span> birthday attack: 2^80 시도 필요 — 현재 HW로 비현실적 (cost &gt; 2^40 dollars)</div>
          </div>
        </div>
        <p className="leading-7">
          <code>pk.serialize_uncompressed()[1..]</code> — 첫 0x04 prefix를 제거하는 것이 핵심.<br />
          이 prefix는 "uncompressed 형식"을 나타내는 메타데이터일 뿐, 실제 공개키 데이터는 64바이트 (x, y 좌표).<br />
          keccak256 결과의 <strong>하위 20바이트</strong>만 사용 — 충돌 저항성(2^80 시도)과 가독성의 타협.
        </p>

        {/* ── CREATE 주소 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CREATE — sender + nonce RLP 기반</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-sm font-semibold mb-2"><code>create_address(sender: &amp;Address, nonce: u64) -&gt; Address</code></p>
          <div className="space-y-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">1.</span>
              <span><code>RLP([sender, nonce])</code> 인코딩 → 버퍼 생성</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">2.</span>
              <span><code>keccak256(&amp;buf)</code> → 32바이트 해시</span>
            </div>
            <div className="rounded border border-border bg-background px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-indigo-500 shrink-0">3.</span>
              <span>하위 20바이트 추출 → <code>Address::from_slice(&amp;hash[12..32])</code></span>
            </div>
          </div>
          <p className="text-sm font-semibold mb-2">예시</p>
          <div className="rounded border border-border bg-background px-3 py-2 text-sm mb-4">
            EOA(<code>0xAbC...</code>)가 nonce=5에서 배포 → RLP: <code>[0xd4, 0x94, 0xAbC..., 0x05]</code> → keccak256 → 하위 20B = contract address
          </div>
          <p className="text-sm font-semibold mb-2">특성</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-1.5">예측 가능 (sender + nonce만 알면)</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">같은 sender의 컨트랙트 주소 순차 변화</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">nonce가 바뀌면 미래 주소도 변경</div>
            <div className="rounded border border-border bg-background px-3 py-1.5">EOA nonce = TX당 +1 → deterministic</div>
          </div>
        </div>
        <p className="leading-7">
          CREATE의 주소는 <strong>sender의 미래 nonce</strong>에 묶여 있음.<br />
          같은 지갑에서 1,2,3번째 컨트랙트는 서로 다른 예측 가능한 주소.<br />
          하지만 지갑이 다른 TX를 먼저 보내면 nonce가 변해 주소도 변함 → 재배포 시 주소가 고정되지 않음.
        </p>

        {/* ── CREATE2 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CREATE2 — counterfactual deployment</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-5 my-4">
          <p className="text-xs text-muted-foreground mb-2">EIP-1014 (Constantinople fork, 2019-02)</p>
          <p className="text-sm font-semibold mb-2"><code>create2_address(sender, salt: &amp;B256, init_code_hash: &amp;B256) -&gt; Address</code></p>
          <div className="rounded border border-border bg-background px-3 py-2 text-sm mb-4">
            <code>keccak256(0xff ++ sender(20B) ++ salt(32B) ++ init_code_hash(32B))</code> → 하위 20바이트
          </div>
          <p className="text-sm font-semibold mb-2">주소 결정 요소</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-4">
            <div className="rounded border border-border bg-background px-3 py-2"><code>sender</code> — 배포자 (팩토리 컨트랙트 주소)</div>
            <div className="rounded border border-border bg-background px-3 py-2"><code>salt</code> — 사용자 선택 32B (충돌 방지 + 주소 커스터마이즈)</div>
            <div className="rounded border border-border bg-background px-3 py-2"><code>init_code_hash</code> — 배포 바이트코드의 keccak256</div>
          </div>
          <p className="text-sm font-semibold mb-2">사용 사례</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">Smart Contract Wallets</span> (Safe, Argent) — 지갑 주소를 배포 전에 계산, 자금 먼저 입금 → 나중에 배포
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">Uniswap V2/V3</span> — pair 컨트랙트 주소를 온체인 조회 없이 공식 계산
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">Rollup sequencer</span> — L1 컨트랙트 주소를 L2에서 미리 계산 (cross-chain messaging)
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <span className="font-medium">Vanity address</span> — salt brute-force로 예쁜 prefix 주소 생성 (0x0000dead1234...)
            </div>
          </div>
        </div>
        <p className="leading-7">
          CREATE2의 혁신: <strong>주소를 예측 가능하게 만듦</strong>.<br />
          지갑 주소로 자금을 먼저 보내고, 필요할 때 지갑을 배포하는 "counterfactual" 패턴 가능.<br />
          Uniswap V2의 pair 주소 계산, Safe Wallet의 주소 유도가 모두 CREATE2 기반.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: 해시 함수의 양면성</p>
          <p className="mt-2">
            Keccak256 하나의 함수가 이더리움 곳곳에서 사용:<br />
            - Address 유도 (pubkey → 20바이트)<br />
            - CREATE / CREATE2 주소<br />
            - TX 해시, 블록 해시<br />
            - Merkle trie 노드 해시<br />
            - EVM 스토리지 키 매핑<br />
            - EIP-712 구조화 서명
          </p>
          <p className="mt-2">
            해시 함수 하나에 모든 신뢰가 걸림:<br />
            - 만약 Keccak256에 취약점 발견 → 체인 전체 위험<br />
            - 그래서 "암호학적 해시의 충돌 저항성"이 블록체인 안전의 토대<br />
            - Keccak은 SHA-3 표준의 기반 → 수많은 암호학자가 분석 → 현재까지 안전
          </p>
          <p className="mt-2">
            Reth의 <code>keccak256()</code> 함수는 초당 수백만 번 호출 — tiny_keccak 크레이트의 최적화가 전체 성능에 직접 기여.
          </p>
        </div>
      </div>

      <div className="not-prose">
        <Keccak256Viz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
