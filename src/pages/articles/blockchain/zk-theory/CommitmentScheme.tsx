import M from '@/components/ui/math';
import CommitmentViz from './viz/CommitmentViz';

export default function CommitmentScheme() {
  return (
    <section id="commitment-scheme" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pedersen 커밋먼트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          값을 확정하되 공개하지 않는 &ldquo;봉인된 봉투&rdquo; &mdash; Bulletproofs, PLONK의 기반 빌딩 블록.
        </p>
      </div>
      <div className="not-prose"><CommitmentViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Commitment Scheme 정의</h3>

        {/* 비유 + 2대 성질 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">"봉인된 봉투"</div>
          <p className="text-sm text-muted-foreground">
            <strong>Commit</strong>: 값을 봉투에 넣어 봉인 (공개 불가) &mdash; <strong>Open</strong>: 나중에 봉투를 열어 공개
          </p>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">1. Hiding</div>
            <p className="text-sm text-muted-foreground">
              커밋값 <M>c</M>로부터 <M>v</M>에 대한 정보를 얻을 수 없음
            </p>
            <div className="grid grid-cols-2 gap-1 mt-2">
              <div className="rounded bg-muted/50 p-1.5 text-center text-xs text-muted-foreground">Perfect: 완전한 무정보</div>
              <div className="rounded bg-muted/50 p-1.5 text-center text-xs text-muted-foreground">Computational: 계산적 불가</div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">2. Binding</div>
            <p className="text-sm text-muted-foreground">
              같은 <M>c</M>로 두 다른 <M>v</M>를 open 불가
            </p>
            <div className="grid grid-cols-2 gap-1 mt-2">
              <div className="rounded bg-muted/50 p-1.5 text-center text-xs text-muted-foreground">Perfect binding</div>
              <div className="rounded bg-muted/50 p-1.5 text-center text-xs text-muted-foreground">Computational binding</div>
            </div>
          </div>
        </div>

        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-1">Hiding ↔ Binding 트레이드오프</div>
          <p className="text-sm text-muted-foreground">둘 다 perfect 불가 &mdash; 하나 perfect + 다른 하나 computational</p>
        </div>

        {/* Pedersen Commitment */}
        <h4 className="text-lg font-semibold mt-5 mb-3">Pedersen Commitment</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-sm font-semibold mb-1">Setup</p>
              <p className="text-sm text-muted-foreground"><M>g, h</M>: generators (관계 미지)</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Commit</p>
              <p className="text-sm text-muted-foreground"><M>{'r \\leftarrow \\text{random}'}</M></p>
              <M display>{'\\underbrace{c}_{\\text{커밋값}} = \\underbrace{g^v}_{\\text{값 바인딩}} \\cdot \\underbrace{h^r}_{\\text{블라인딩}} \\bmod \\underbrace{p}_{\\text{소수 모듈러스}}'}</M>
              <p className="text-sm text-muted-foreground mt-2">g, h = 이산로그 관계 미지인 두 생성원, v = 커밋할 값, r = 랜덤 블라인딩 팩터. r이 균일 랜덤이면 c의 분포도 균일 -- perfect hiding 보장.</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">Open</p>
              <p className="text-sm text-muted-foreground">공개: <M>{'v, r'}</M></p>
              <p className="text-sm text-muted-foreground">검증: <M>{'c \\stackrel{?}{=} g^v \\cdot h^r'}</M></p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-500/20 p-2 text-center text-xs text-muted-foreground">
              <span className="font-semibold">Perfect Hiding</span> &mdash; <M>r</M> 랜덤이면 <M>c</M> 분포 균일
            </div>
            <div className="rounded bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500/20 p-2 text-center text-xs text-muted-foreground">
              <span className="font-semibold">Computational Binding</span> &mdash; DLP 어려움 가정
            </div>
          </div>
        </div>

        {/* 다른 Commitment Schemes */}
        <h4 className="text-lg font-semibold mt-5 mb-3">다른 Commitment Schemes</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Hash-based</div>
            <M display>{'\\underbrace{c}_{\\text{커밋값}} = \\underbrace{H}_{\\text{해시 함수}}(\\underbrace{v}_{\\text{값}} \\| \\underbrace{r}_{\\text{랜덤 논스}})'}</M>
            <p className="text-sm text-muted-foreground mt-2">H = 충돌 저항 해시(SHA-256 등), v = 커밋할 값, r = 랜덤 논스, || = 연결(concatenation). 가장 단순한 커밋먼트 구조.</p>
            <ul className="text-xs text-muted-foreground space-y-1 mt-1">
              <li>Perfect binding (충돌 저항)</li>
              <li>Computational hiding (random oracle)</li>
              <li>가장 간단, 널리 사용</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">ElGamal</div>
            <M display>{'\\underbrace{c}_{\\text{커밋값}} = (\\underbrace{g^r}_{\\text{임시 공개키}},\\; \\underbrace{g^v \\cdot h^r}_{\\text{암호화된 값}})'}</M>
            <p className="text-sm text-muted-foreground mt-2">g, h = 생성원, r = 랜덤 값, v = 커밋할 값. 두 원소 쌍으로 구성 -- 첫째는 블라인딩용 임시 공개키, 둘째는 값과 블라인딩의 결합.</p>
            <ul className="text-xs text-muted-foreground space-y-1 mt-1">
              <li>Homomorphic</li>
              <li>Perfect binding</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">KZG (Kate) Commitment</div>
            <M display>{'\\underbrace{c}_{\\text{커밋값}} = \\underbrace{p(\\tau)}_{\\text{비밀점 평가}} \\cdot \\underbrace{G}_{\\text{타원곡선 생성원}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">p(tau) = 다항식 p를 비밀 점 tau에서 평가한 스칼라, G = 타원곡선 위의 생성원(base point), tau = trusted setup에서 생성 후 폐기되는 비밀값. 다항식 전체를 하나의 타원곡선 점으로 압축.</p>
            <ul className="text-xs text-muted-foreground space-y-1 mt-1">
              <li>다항식 커밋먼트 (trusted setup)</li>
              <li>Constant-size proof + Batch opening</li>
              <li>Ethereum EIP-4844 (blobs)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Bulletproofs IPA</div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>Inner-Product Argument</li>
              <li>No trusted setup</li>
              <li>Logarithmic proof size</li>
              <li>Bulletproofs 코어</li>
            </ul>
          </div>
        </div>

        {/* 사용 사례 */}
        <div className="not-prose rounded-lg border bg-card p-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">사용 사례</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {['Coin flipping', 'Sealed auction', 'Voting', 'ZK proof 내부', 'Range proofs', 'Confidential TX'].map(u => (
              <div key={u} className="rounded bg-muted/50 p-2 text-center text-xs text-muted-foreground">{u}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
