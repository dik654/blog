import TwoDErasureViz from './viz/TwoDErasureViz';

export default function TwoDimensional() {
  return (
    <section id="two-dimensional">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        2D 이레이저 코딩 &amp; DAS
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          k x k 매트릭스에 행/열 독립 RS 코딩 &rarr; 2k x 2k 확장. DAS의 기반 기술.
        </p>
      </div>
      <div className="not-prose"><TwoDErasureViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 mb-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">2D Erasure Coding &amp; DAS</h3>
        <p>
          1D RS만으로도 손실 복구는 충분한데 왜 2D가 필요한가?
        </p>
        <p>
          답은 <strong>light client</strong> 때문이다.
        </p>
        <p>
          라이트 노드는 블록 전체를 다운로드할 수 없고, 일부 샘플만 보고 "데이터가 실제로 존재하는가"를 확인해야 한다.
        </p>
        <p>
          1D 코딩에선 악의적 producer가 k-1개 심볼만 숨겨도 탐지가 어렵다.
        </p>
        <p>
          2D로 확장하면 "잘못된 인코딩"이 <em>행 또는 열 단위의 선형 제약</em>을 위반하기 때문에 소수의 무작위 셀만 확인해도 전체를 확률적으로 보장할 수 있다.
        </p>
        <p>
          구조는 단순하다: data를 k×k 매트릭스로 배치 → 각 <strong>행</strong>에 1D RS 인코딩(→ 2k로 확장) → 각 <strong>열</strong>에도 독립적으로 1D RS 인코딩.
        </p>
        <p>
          결과는 2k × 2k 매트릭스로 총 4k² 심볼, 원본의 4배.
        </p>
        <p>
          라이트 클라이언트는 이 그리드에서 랜덤 셀을 샘플링하고 Merkle 증명으로 각 셀의 진위를 확인 — 모든 샘플이 통과하면 "데이터가 가용하다"고 확률적으로 결론낸다.
        </p>
        <p>
          이 과정 전체가 <strong>DAS (Data Availability Sampling)</strong>.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">Construction</p>
          <ol className="text-sm text-foreground/80 space-y-1.5 list-decimal list-inside">
            <li>data → k×k matrix (k² symbols)</li>
            <li>각 행 RS 인코딩 → 2k symbols/행</li>
            <li>각 열 RS 인코딩 → 2k symbols/열</li>
            <li>결과: 2k × 2k = 4k² symbols</li>
            <li>overhead 3× (총 4×)</li>
          </ol>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">복구 가능성</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>임의 k개 row/col 완전 수신 → 복원</li>
            <li>부분 row/col → iterative solving</li>
            <li>최대 75% loss 견딤 (MDS-like)</li>
          </ul>
        </div>
      </div>

      <div className="not-prose rounded-lg border border-foreground/10 bg-muted/30 p-5 mb-4">
        <p className="font-semibold text-sm text-foreground/60 mb-2">Matrix 구조 (2k × 2k)</p>
        <div className="grid grid-cols-2 gap-2 max-w-md font-mono text-xs">
          <div className="rounded border border-indigo-500/30 bg-indigo-500/10 p-3 text-center">
            <div className="font-semibold text-indigo-400">Original</div>
            <div className="text-foreground/60">k × k</div>
          </div>
          <div className="rounded border border-amber-500/30 bg-amber-500/10 p-3 text-center">
            <div className="font-semibold text-amber-400">Row RS Parity</div>
            <div className="text-foreground/60">k × k</div>
          </div>
          <div className="rounded border border-amber-500/30 bg-amber-500/10 p-3 text-center">
            <div className="font-semibold text-amber-400">Col RS Parity</div>
            <div className="text-foreground/60">k × k</div>
          </div>
          <div className="rounded border border-rose-500/30 bg-rose-500/10 p-3 text-center">
            <div className="font-semibold text-rose-400">Parity of Parity</div>
            <div className="text-foreground/60">k × k</div>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          매트릭스의 네 사분면 중 좌상단은 <strong>원본</strong>, 우상단은 각 행에 RS를 돌려 만든 <strong>row parity</strong>, 좌하단은 각 열의 <strong>column parity</strong>, 우하단은 parity의 parity.
        </p>
        <p>
          행·열 모두의 선형 제약을 만족해야 하므로 위조가 극도로 어렵다.
        </p>
        <p>
          원본이 사라져도 해당 행 또는 열에서 각각 독립적으로 복구 가능하고, 두 방향에서의 복구가 서로 검증 역할을 한다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">DAS (Data Availability Sampling)</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>light client가 직접 검증</li>
            <li>2D grid에서 무작위 셀 샘플</li>
            <li>Merkle 증명으로 셀 authenticity 확인</li>
            <li>모든 샘플이 유효 → 데이터 available (확률적)</li>
          </ul>
        </div>
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-5">
          <p className="font-semibold text-sm text-rose-400 mb-2">DAS 보안</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>1 sample → ~50% 탐지</li>
            <li>10 samples → 99.9%</li>
            <li>30 samples → 99.9999999999%</li>
            <li>샘플 수에 대해 <strong>지수적</strong> 보안</li>
          </ul>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>왜 이런 확률이 나오는가?</p>
        <p>
          Producer가 블록의 절반 이상(50% 이상)을 숨기지 않으면 전체 블록 인코딩이 성립하지 않으므로, 공격자는 <em>최소 절반은 숨겨야</em> 한다.
        </p>
        <p>
          무작위 샘플 하나가 "숨겨진 영역"에 떨어질 확률이 ≥ 1/2이므로 한 번 샘플로 50% 탐지.
        </p>
        <p>
          s번 독립 샘플하면 <strong>1 − (1/2)^s</strong>로 지수 증가 — 30번이면 10⁻⁹ 수준.
        </p>
        <p>
          즉 블록 전체를 다운로드하지 않고도 <em>수학적으로 근접한</em> 가용성 보증을 얻는다.
        </p>
      </div>

      <div className="not-prose rounded-lg border border-foreground/10 bg-muted/30 p-5 mb-4">
        <p className="font-semibold text-sm text-foreground/60 mb-2">Commitment 구조</p>
        <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
          <li>각 행: Merkle root</li>
          <li>각 열: Merkle root</li>
          <li>row roots + column roots → tree</li>
          <li>최종 DA root (32 bytes)</li>
        </ul>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400 mb-1">Ethereum (EIP-4844)</p>
          <ul className="text-xs text-foreground/70 space-y-0.5 list-disc list-inside">
            <li>blob transactions</li>
            <li>2D erasure coded</li>
            <li>light client DAS</li>
            <li>blob sidecars</li>
          </ul>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="font-semibold text-sm text-emerald-400 mb-1">Celestia</p>
          <ul className="text-xs text-foreground/70 space-y-0.5 list-disc list-inside">
            <li>모듈러 DA layer</li>
            <li>2D RS coding</li>
            <li>light client friendly</li>
          </ul>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="font-semibold text-sm text-amber-400 mb-1">EigenDA</p>
          <ul className="text-xs text-foreground/70 space-y-0.5 list-disc list-inside">
            <li>EigenLayer DA</li>
            <li>2D RS</li>
            <li>restaking economics</li>
          </ul>
        </div>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-5">
          <p className="font-semibold text-sm text-rose-400 mb-2">기술적 난제</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>encoding throughput</li>
            <li>computation cost</li>
            <li>sampling efficiency</li>
            <li>잘못된 인코딩에 대한 fraud proof</li>
          </ul>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">최적화</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>SIMD RS</li>
            <li>row/column 병렬화</li>
            <li>GPU 가속</li>
            <li>KZG polynomial commitment</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
