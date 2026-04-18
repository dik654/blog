import M from '@/components/ui/math';
import IPAViz from './viz/IPAViz';

export default function IPA() {
  return (
    <section id="ipa" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Inner Product Argument</h2>
      <div className="not-prose mb-8"><IPAViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">IPA란?</h3>
        <p>KZG의 대안으로, <strong>Trusted Setup 없이</strong> 다항식 commitment를 구현한다. 페어링 대신 이산 로그 가정만 사용한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">IPA 개념</p>
            <div className="rounded border border-sky-500/30 p-3 mb-3">
              <p className="text-sm text-sky-400 font-medium mb-1">내적 관계 증명</p>
              <p className="text-sm text-muted-foreground">주장: <M>{'\\langle \\mathbf{a}, \\mathbf{b} \\rangle = c'}</M></p>
            </div>
            <div className="rounded border border-emerald-500/30 p-3">
              <p className="text-sm text-emerald-400 font-medium mb-1">KZG와의 핵심 차이</p>
              <div className="grid grid-cols-2 gap-3 text-sm mt-1">
                <div className="bg-muted/50 rounded p-2 text-center text-muted-foreground">KZG: 타원곡선 페어링 필요<br />(BN254, BLS12-381)</div>
                <div className="bg-muted/50 rounded p-2 text-center text-muted-foreground">IPA: 페어링 불필요<br />이산 로그 가정만 사용</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                <div className="bg-muted/50 rounded p-2 text-center text-muted-foreground">증명 크기: <M>{'O(\\log n)'}</M><br />KZG의 <M>{'O(1)'}</M>보다 크지만</div>
                <div className="bg-muted/50 rounded p-2 text-center text-muted-foreground">Trusted Setup: 불필요!<br />(투명 셋업)</div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">재귀적 축소 (Recursive Halving)</h3>
        <p>벡터를 반으로 접어 <strong>log(n)</strong> 라운드만에 스칼라 1개로 축소한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">재귀적 절반 축소</p>
            <div className="rounded border border-border/40 p-3 mb-2">
              <p className="text-sm text-muted-foreground font-medium">Round 1: <M>{'(\\mathbf{a}, \\mathbf{b})'}</M> 길이 n → 길이 n/2로 축소</p>
              <div className="mt-1 space-y-0.5">
                <p className="text-sm text-muted-foreground"><M>{'L = \\langle \\mathbf{a}_{\\text{lo}}, \\mathbf{b}_{\\text{hi}} \\rangle \\cdot G + \\ldots'}</M></p>
                <p className="text-sm text-muted-foreground"><M>{'R = \\langle \\mathbf{a}_{\\text{hi}}, \\mathbf{b}_{\\text{lo}} \\rangle \\cdot G + \\ldots'}</M></p>
                <p className="text-sm text-muted-foreground"><M>{'x \\leftarrow'}</M> challenge</p>
                <p className="text-sm text-muted-foreground"><M>{'\\mathbf{a}\' = \\mathbf{a}_{\\text{lo}} + x \\cdot \\mathbf{a}_{\\text{hi}}'}</M></p>
                <p className="text-sm text-muted-foreground"><M>{'\\mathbf{b}\' = \\mathbf{b}_{\\text{hi}} + x^{-1} \\cdot \\mathbf{b}_{\\text{lo}}'}</M></p>
              </div>
            </div>
            <div className="rounded border border-amber-500/30 p-2">
              <p className="text-sm text-amber-400 font-medium">최종: 스칼라 1개</p>
              <p className="text-sm text-muted-foreground">round k: 반복 → 길이 1로 축소. 스칼라 1개와 점 2k개로 검증</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">KZG vs IPA</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">KZG vs IPA 비교</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="py-2 text-muted-foreground font-medium"></th>
                    <th className="py-2 text-violet-400 font-medium">KZG</th>
                    <th className="py-2 text-emerald-400 font-medium">IPA</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/20"><td className="py-1.5 font-medium">Setup</td><td>Trusted SRS</td><td>투명 (없음)</td></tr>
                  <tr className="border-b border-border/20"><td className="py-1.5 font-medium">증명 크기</td><td><M>{'O(1)'}</M></td><td><M>{'O(\\log n)'}</M></td></tr>
                  <tr className="border-b border-border/20"><td className="py-1.5 font-medium">검증 시간</td><td><M>{'O(1)'}</M> 페어링</td><td><M>{'O(n)'}</M> 스칼라곱</td></tr>
                  <tr><td className="py-1.5 font-medium">곡선</td><td>페어링 곡선</td><td>임의 곡선</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 rounded border border-emerald-500/30 p-2">
              <p className="text-sm text-emerald-400 font-medium">IPA 기반 시스템들</p>
              <p className="text-sm text-muted-foreground">Bulletproofs = IPA + Range Proof / Halo/Halo2 = IPA 기반 재귀 증명</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Halo 트릭</h3>
        <p>IPA의 O(n) 검증 비용을 <strong>accumulator로 지연</strong>시켜 재귀 합성을 가능하게 한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 space-y-3">
            <div className="rounded border border-sky-500/30 p-3">
              <p className="text-sm text-sky-400 font-medium mb-1">O(n) 검증 지연</p>
              <p className="text-sm text-muted-foreground">IPA 검증의 <M>{'O(n)'}</M> 비용을 지연시킴 → &quot;accumulator&quot;로 검증을 누적 → 최종 1회만 <M>{'O(n)'}</M> 검증 수행</p>
            </div>
            <div className="rounded border border-emerald-500/30 p-3">
              <p className="text-sm text-emerald-400 font-medium mb-1">재귀적 증명 체인</p>
              <p className="text-sm text-muted-foreground">재귀 합성(recursive composition):</p>
              <M display>{'\\text{증명}_k = \\text{verify}(\\text{증명}_{k-1}) + \\text{새로운 연산}'}</M>
              <p className="text-sm text-muted-foreground">→ 체인처럼 쌓아서 최종 1회 검증</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
