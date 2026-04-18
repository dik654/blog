import M from '@/components/ui/math';
import MerkleDamgardViz from './viz/MerkleDamgardViz';
import CompressionFnViz from './viz/CompressionFnViz';
import SpongeViz from './viz/SpongeViz';
import AbsorbViz from './viz/AbsorbViz';
import PermutationViz from './viz/PermutationViz';
import SqueezeViz from './viz/SqueezeViz';

export default function Constructions() {
  return (
    <section id="constructions" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle-Damgard & Sponge</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          내부 압축 함수를 반복 적용하여 임의 길이 &rarr; 고정 길이.
          반복 방식이 두 갈래.
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-3">Merkle-Damgard 구성</h3>
      <div className="not-prose mb-6"><MerkleDamgardViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">압축함수 f 내부</h4>
      <div className="not-prose mb-8"><CompressionFnViz /></div>

      <h3 className="text-xl font-semibold mb-3">Sponge 구성 (Keccak/SHA-3)</h3>
      <div className="not-prose mb-6"><SpongeViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">흡수 (Absorb)</h4>
      <div className="not-prose mb-8"><AbsorbViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">순열 (Keccak-f)</h4>
      <div className="not-prose mb-8"><PermutationViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">압출 (Squeeze)</h4>
      <div className="not-prose"><SqueezeViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle-Damgard 상세</h3>

        {/* 구조 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-3">구조 (1989)</div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>메시지 <M>m</M> &rarr; 블록 <M>{'m_1, m_2, \\ldots, m_k'}</M> (패딩)</p>
            <M display>{'\\underbrace{h_0}_{\\text{초기 상태}} = \\underbrace{\\text{IV}}_{\\text{초기화 벡터 (고정값)}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              <M>{'h_0'}</M>: 해시 체인의 시작점. IV는 알고리즘마다 고정된 상수 (SHA-256: 소수 제곱근의 소수부)
            </p>
            <M display>{'h_i = \\underbrace{f}_{\\text{압축 함수}}(\\underbrace{h_{i-1}}_{\\text{이전 상태}},\\, \\underbrace{m_i}_{\\text{메시지 블록}}) \\quad \\text{for } i = 1 \\ldots k'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              <M>f</M>: 고정 크기 입력을 받아 고정 크기 출력을 내는 압축 함수. <M>{'m_i'}</M>: 패딩된 메시지의 <M>i</M>번째 블록
            </p>
            <M display>{'\\underbrace{H(m)}_{\\text{최종 해시 출력}} = \\underbrace{h_k}_{\\text{마지막 상태}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              마지막 블록 처리 후의 상태 <M>{'h_k'}</M>가 곧 해시값. 추가 후처리 없이 그대로 출력
            </p>
            <p>압축 함수 <M>f</M>: <M>{'\\{0,1\\}^n \\times \\{0,1\\}^b \\to \\{0,1\\}^n'}</M> &mdash; 이전 상태 + 블록 &rarr; 새 상태</p>
          </div>
        </div>

        {/* 안전성 + 길이 확장 */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">안전성 증명</div>
            <p className="text-sm text-muted-foreground">
              "만약 <M>f</M>가 충돌 저항 &rarr; <M>H</M>도 충돌 저항" (Merkle, Damgard 정리)
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">길이 확장 공격 (Length Extension)</div>
            <p className="text-sm text-muted-foreground">
              <M>{'H(m)'}</M>과 <M>{'|m|'}</M>만 알면 <M>{'H(m \\| \\text{pad} \\| m\')'}</M> 계산 가능.
              영향: SHA-1, SHA-256, SHA-512.
              방어: HMAC, SHA-3, BLAKE2.
            </p>
          </div>
        </div>

        {/* SHA-256 압축 함수 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">SHA-256 압축 함수 내부</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-sm text-muted-foreground mb-3">
            <div className="rounded bg-muted/50 p-2">64 라운드</div>
            <div className="rounded bg-muted/50 p-2">32-bit words</div>
            <div className="rounded bg-muted/50 p-2">ROTR, SHR, XOR</div>
            <div className="rounded bg-muted/50 p-2">8개 레지스터 (a-h)</div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">라운드 연산:</p>
            <M display>{'t_1 = \\underbrace{h}_{\\text{레지스터}} + \\underbrace{\\Sigma_1(e)}_{\\text{회전+XOR}} + \\underbrace{\\text{Ch}(e,f,g)}_{\\text{선택 함수}} + \\underbrace{K_i}_{\\text{라운드 상수}} + \\underbrace{W_i}_{\\text{확장된 메시지}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              <M>{'\\text{Ch}'}</M>: <M>e</M>가 1이면 <M>f</M>, 0이면 <M>g</M> 선택. <M>{'K_i'}</M>: 소수 세제곱근의 소수부. <M>{'W_i'}</M>: 메시지 스케줄 출력
            </p>
            <M display>{'t_2 = \\underbrace{\\Sigma_0(a)}_{\\text{회전+XOR}} + \\underbrace{\\text{Maj}(a,b,c)}_{\\text{다수결 함수}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              <M>{'\\text{Maj}'}</M>: <M>a,b,c</M> 중 다수(2개 이상)가 1이면 1. <M>{'t_1 + t_2'}</M>가 새 레지스터 <M>a</M>가 됨
            </p>
            <p><M>{'h \\leftarrow g,\\; g \\leftarrow f,\\; f \\leftarrow e,\\; e \\leftarrow d + t_1'}</M></p>
            <p><M>{'d \\leftarrow c,\\; c \\leftarrow b,\\; b \\leftarrow a,\\; a \\leftarrow t_1 + t_2'}</M></p>
          </div>
        </div>

        {/* Davies-Meyer */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-6">
          <div className="text-sm font-semibold mb-2">Davies-Meyer 구성</div>
          <p className="text-sm text-muted-foreground mb-1">
            블록 암호 &rarr; 해시 압축 함수: <M>{'f(h, m) = E_m(h) \\oplus h'}</M> (메시지를 키로 사용)
          </p>
          <p className="text-sm text-muted-foreground">
            채택: SHA-1 (deprecated), SHA-256, SHA-512, BLAKE, BLAKE2
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Sponge Construction 상세</h3>

        {/* Sponge 구조 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-3">구조 (Keccak/SHA-3, 2015)</div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>State <M>S</M>: <M>b = r + c</M> bits &mdash; <M>r</M>: rate (흡수/방출 부분), <M>c</M>: capacity (보안 마진)</p>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Phase 1</div>
            <div className="text-sm font-semibold mb-1">Absorbing (흡수)</div>
            <p className="text-sm text-muted-foreground">
              각 블록마다: <M>{'S_r \\oplus= \\text{block}'}</M> &rarr; <M>{'S = \\text{perm}(S)'}</M>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Phase 2</div>
            <div className="text-sm font-semibold mb-1">Transitioning</div>
            <p className="text-sm text-muted-foreground">(선택적)</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Phase 3</div>
            <div className="text-sm font-semibold mb-1">Squeezing (방출)</div>
            <p className="text-sm text-muted-foreground">
              <M>{'\\text{output} \\mathrel{+}= S_r'}</M> &rarr; <M>{'S = \\text{perm}(S)'}</M> 반복
            </p>
          </div>
        </div>

        {/* Keccak-f */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Keccak-f[1600]</div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm text-muted-foreground mb-2">
            <div className="rounded bg-muted/50 p-2">State: 5x5x64 = 1600 bits</div>
            <div className="rounded bg-muted/50 p-2">24 rounds</div>
            <div className="rounded bg-muted/50 p-2">5 steps: <M>{'\\theta, \\rho, \\pi, \\chi, \\iota'}</M></div>
          </div>
        </div>

        {/* SHA-3 파라미터 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">SHA-3 파라미터</h4>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2 font-semibold">변형</th>
                <th className="p-2 font-semibold">r (rate)</th>
                <th className="p-2 font-semibold">c (capacity)</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50"><td className="p-2">SHA3-224</td><td className="p-2">1152</td><td className="p-2">448</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">SHA3-256</td><td className="p-2">1088</td><td className="p-2">512</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">SHA3-384</td><td className="p-2">832</td><td className="p-2">768</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">SHA3-512</td><td className="p-2">576</td><td className="p-2">1024</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">SHAKE128</td><td className="p-2">1344</td><td className="p-2">256</td></tr>
              <tr><td className="p-2">SHAKE256</td><td className="p-2">1088</td><td className="p-2">512</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground mt-1">SHAKE: 임의 길이 출력 가능 (Extendable Output)</p>
        </div>

        {/* Sponge 장점 */}
        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Sponge 장점</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Length extension 방어</li>
            <li>Flexible output length</li>
            <li>간단한 구조, 하드웨어 친화적</li>
            <li>Keyed hash (MAC), stream cipher 등 다용도</li>
          </ul>
        </div>

        {/* 사용 예 */}
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">SHA-3</div>
            <p className="text-xs text-muted-foreground">NIST 표준</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">Keccak-256</div>
            <p className="text-xs text-muted-foreground">Ethereum</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">SHAKE</div>
            <p className="text-xs text-muted-foreground">Post-quantum 후보들</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold mb-1">Ascon</div>
            <p className="text-xs text-muted-foreground">NIST lightweight 2023</p>
          </div>
        </div>
      </div>
    </section>
  );
}
