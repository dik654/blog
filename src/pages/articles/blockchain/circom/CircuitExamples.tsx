import CircuitExampleViz from './viz/CircuitExampleViz';

export default function CircuitExamples({ title }: { title?: string }) {
  return (
    <section id="examples" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '실전 회로 예제'}</h2>
      <div className="not-prose mb-8">
        <CircuitExampleViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          실전 ZK 애플리케이션에서 자주 사용되는 Circom 회로 패턴입니다.<br />
          Tornado Cash, Semaphore 등 프로덕션 프로젝트에서 검증된 구조입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Poseidon 해시 회로</h3>
        <div className="not-prose rounded-lg border p-4 text-sm space-y-3 mb-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
            <p className="text-xs font-medium mb-2">입력/출력 시그널</p>
            <div className="font-mono text-xs space-y-1">
              <p><code>template</code> <strong>Poseidon</strong>(nInputs) {'{'}</p>
              <p className="pl-4"><code>signal input</code> inputs[nInputs]; <span className="text-muted-foreground">// 입력 배열</span></p>
              <p className="pl-4"><code>signal output</code> out; <span className="text-muted-foreground">// 단일 해시 출력</span></p>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
            <p className="text-xs font-medium mb-2">Full/Partial 라운드 구조</p>
            <div className="font-mono text-xs space-y-1">
              <p className="pl-4"><code>component</code> ark[nRounds]; <span className="text-muted-foreground">// AddRoundKey</span></p>
              <p className="pl-4"><code>component</code> sbox[nRounds]; <span className="text-muted-foreground">// S-box</span></p>
              <p className="pl-4"><code>component</code> mix[nRounds]; <span className="text-muted-foreground">// MixLayer</span></p>
              <p className="pl-4 text-muted-foreground">// Full rounds → Partial rounds → Full rounds</p>
              <p className="pl-4">sbox[r] = (r {'<'} RF/2 || r {'>'}= RF/2+RP)</p>
              <p className="pl-8">? SBoxFull(nInputs) : SBoxPartial();</p>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">출력</p>
            <p className="font-mono text-xs">out <code>{'<=='}</code> mix[nRounds-1].out[0];</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Merkle Proof 검증 회로</h3>
        <div className="not-prose rounded-lg border p-4 text-sm space-y-3 mb-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
            <p className="text-xs font-medium mb-2">입력 시그널</p>
            <div className="font-mono text-xs space-y-1">
              <p><code>template</code> <strong>MerkleProof</strong>(levels) {'{'}</p>
              <p className="pl-4"><code>signal input</code> leaf; <span className="text-muted-foreground">// 검증할 리프</span></p>
              <p className="pl-4"><code>signal input</code> pathElements[levels]; <span className="text-muted-foreground">// 경로 요소</span></p>
              <p className="pl-4"><code>signal input</code> pathIndices[levels]; <span className="text-muted-foreground">// 경로 인덱스 (좌/우)</span></p>
              <p className="pl-4"><code>signal output</code> root; <span className="text-muted-foreground">// 루트 해시</span></p>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
            <p className="text-xs font-medium mb-2">경로 인덱스로 좌우 선택</p>
            <div className="font-mono text-xs space-y-1">
              <p className="pl-4">hashers[i].inputs[0] <code>{'<=='}</code> leaf * (1 - pathIndices[i])</p>
              <p className="pl-8">+ pathElements[i] * pathIndices[i];</p>
              <p className="pl-4">hashers[i].inputs[1] <code>{'<=='}</code> leaf * pathIndices[i]</p>
              <p className="pl-8">+ pathElements[i] * (1 - pathIndices[i]);</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">pathIndices[i] = 0이면 왼쪽, 1이면 오른쪽 배치</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3">
            <p className="text-xs font-medium mb-1">결과</p>
            <p className="font-mono text-xs">root <code>{'<=='}</code> hashers[levels-1].out;</p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">실전 회로 패턴</h3>

        <h4 className="font-semibold mt-6 mb-3">1. Nullifier 구성 (Tornado Cash)</h4>
        <div className="not-prose rounded-lg border p-4 text-sm space-y-3 mb-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
            <p className="text-xs font-medium mb-2">Commitment 템플릿</p>
            <div className="font-mono text-xs space-y-1">
              <p><code>template</code> <strong>Commitment</strong>() {'{'}</p>
              <p className="pl-4"><code>signal input</code> nullifier; <span className="text-muted-foreground">// 증명자 비밀</span></p>
              <p className="pl-4"><code>signal input</code> secret; <span className="text-muted-foreground">// 증명자 비밀</span></p>
              <p className="pl-4"><code>signal output</code> commitment; <span className="text-muted-foreground">// 공개</span></p>
              <p className="pl-4"><code>signal output</code> nullifierHash; <span className="text-muted-foreground">// 공개</span></p>
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 font-mono text-xs space-y-1">
            <p className="pl-4"><code>component</code> commitHasher = Poseidon(2);</p>
            <p className="pl-4">commitHasher.inputs[0] <code>{'<=='}</code> nullifier;</p>
            <p className="pl-4">commitHasher.inputs[1] <code>{'<=='}</code> secret;</p>
            <p className="pl-4">commitment <code>{'<=='}</code> commitHasher.out;</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 mt-2">
            <div className="rounded bg-white dark:bg-neutral-800 p-2 text-xs text-center">
              <p className="font-semibold">입금 시</p>
              <p className="text-muted-foreground">commitment 공개, (nullifier, secret) 보관</p>
            </div>
            <div className="rounded bg-white dark:bg-neutral-800 p-2 text-xs text-center">
              <p className="font-semibold">출금 시</p>
              <p className="text-muted-foreground">nullifierHash 공개, 트리 소속 증명</p>
            </div>
            <div className="rounded bg-white dark:bg-neutral-800 p-2 text-xs text-center">
              <p className="font-semibold">이중 사용 방지</p>
              <p className="text-muted-foreground">nullifier 고유성으로 보장</p>
            </div>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">2. Signal Membership (Semaphore)</h4>
        <div className="not-prose rounded-lg border p-4 text-sm mb-6">
          <p className="text-xs font-medium mb-3">SemaphoreSignal 템플릿 — 4단계 검증</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
              <p className="text-xs font-semibold mb-1">① Identity Commitment</p>
              <div className="font-mono text-xs space-y-1">
                <p><code>component</code> id = Poseidon(2);</p>
                <p>id.inputs[0] <code>{'<=='}</code> identityNullifier;</p>
                <p>id.inputs[1] <code>{'<=='}</code> identityTrapdoor;</p>
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3">
              <p className="text-xs font-semibold mb-1">② Merkle Inclusion</p>
              <div className="font-mono text-xs space-y-1">
                <p><code>component</code> tree = MerkleTree(levels);</p>
                <p>tree.leaf <code>{'<=='}</code> id.out;</p>
                <p>tree.root <code>{'==='}</code> root;</p>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3">
              <p className="text-xs font-semibold mb-1">③ Nullifier Hash</p>
              <div className="font-mono text-xs space-y-1">
                <p><code>component</code> nh = Poseidon(2);</p>
                <p>nh.inputs <code>{'<=='}</code> [extNullifier, idNullifier];</p>
                <p>nh.out <code>{'==='}</code> nullifierHash;</p>
              </div>
            </div>
            <div className="bg-violet-50 dark:bg-violet-950/30 rounded p-3">
              <p className="text-xs font-semibold mb-1">④ Signal Binding</p>
              <div className="font-mono text-xs space-y-1">
                <p><code>signal</code> signalSquared;</p>
                <p>signalSquared <code>{'<=='}</code> signalHash * signalHash;</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">증명을 특정 메시지에 바인딩</p>
            </div>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">3. EdDSA 서명 검증</h4>
        <div className="not-prose rounded-lg border p-4 text-sm mb-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 font-mono text-xs space-y-1">
            <p><code>template</code> <strong>VerifySignature</strong>() {'{'}</p>
            <p className="pl-4"><code>signal input</code> msg[256];</p>
            <p className="pl-4"><code>signal input</code> pubKey[2]; <span className="text-muted-foreground">// Baby Jubjub point</span></p>
            <p className="pl-4"><code>signal input</code> R8[2]; <span className="text-muted-foreground">// signature R</span></p>
            <p className="pl-4"><code>signal input</code> S; <span className="text-muted-foreground">// signature S</span></p>
            <p className="pl-4"><code>component</code> verifier = EdDSAVerifier(256);</p>
            <p>{'}'}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Baby Jubjub: BN254 회로 내에서 효율적인 타원곡선</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">4. Range Proof</h4>
        <div className="not-prose rounded-lg border p-4 text-sm mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded p-3 font-mono text-xs space-y-1">
            <p><code>template</code> <strong>RangeProof</strong>(bits) {'{'}</p>
            <p className="pl-4"><code>signal input</code> value;</p>
            <p className="pl-4"><code>component</code> n2b = Num2Bits(bits);</p>
            <p className="pl-4">n2b.in <code>{'<=='}</code> value;</p>
            <p className="pl-4"><span className="text-muted-foreground">// 비트 분해 성공 = value {'<'} 2^bits 증명</span></p>
            <p>{'}'}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">사용: <code>component</code> rp = RangeProof(32); rp.in <code>{'<=='}</code> age;</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">5. Switcher (조건부 실행)</h4>
        <div className="not-prose rounded-lg border p-4 text-sm mb-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 font-mono text-xs space-y-1">
            <p><code>template</code> <strong>Switcher</strong>() {'{'}</p>
            <p className="pl-4"><code>signal input</code> sel, L, R;</p>
            <p className="pl-4"><code>signal output</code> outL, outR;</p>
            <p className="pl-4">outL <code>{'<=='}</code> (R - L) * sel + L;</p>
            <p className="pl-4">outR <code>{'<=='}</code> (L - R) * sel + R;</p>
            <p>{'}'}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 mt-2">
            <div className="rounded bg-white dark:bg-neutral-800 p-2 text-xs text-center">
              <span className="font-semibold">sel=0</span>: (outL, outR) = (L, R)
            </div>
            <div className="rounded bg-white dark:bg-neutral-800 p-2 text-xs text-center">
              <span className="font-semibold">sel=1</span>: (outL, outR) = (R, L)
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">머클 트리에서 경로 비트에 따라 좌/우 스왑에 사용</p>
        </div>

        <h4 className="font-semibold mt-6 mb-3">6. ECDSA 서명 (고비용)</h4>
        <div className="not-prose rounded-lg border border-dashed p-4 text-sm mb-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-xs mb-1">ECDSAVerify(n, k)</p>
              <p className="text-xs text-muted-foreground">secp256k1 수학을 BN254 필드에서 수행</p>
              <p className="text-xs text-muted-foreground">Ethereum 서명 검증에 필요</p>
            </div>
            <div>
              <p className="font-semibold text-xs mb-1">제약 수</p>
              <p className="text-xs">~1.5M (나이브) / ~400K (최적화)</p>
              <p className="text-xs text-muted-foreground">매우 비쌈 — 재귀로 위임하는 경우 많음</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">회로 통계 (실전 dApp)</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">프로젝트</th>
                <th className="text-left py-2 px-3">머클 깊이</th>
                <th className="text-left py-2 px-3">제약 수</th>
                <th className="text-left py-2 px-3">증명 시간</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Tornado Cash 10 ETH', depth: '20', constraints: '~12,000', time: '1-5초' },
                { name: 'Semaphore', depth: '16', constraints: '~8,000', time: '0.5-2초' },
                { name: 'Dark Forest (게임)', depth: '-', constraints: '50,000+', time: '5-30초' },
                { name: 'Hermez zkRollup', depth: '-', constraints: '~1M (배치)', time: '-' },
              ].map(r => (
                <tr key={r.name} className="border-b border-border/40">
                  <td className="py-2 px-3 font-medium">{r.name}</td>
                  <td className="py-2 px-3 font-mono text-xs">{r.depth}</td>
                  <td className="py-2 px-3 font-mono text-xs">{r.constraints}</td>
                  <td className="py-2 px-3 text-muted-foreground">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
