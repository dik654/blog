import M from '@/components/ui/math';
import PlookupViz from './viz/PlookupViz';

export default function Plookup() {
  return (
    <section id="plookup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Plookup (Lookup Argument)</h2>
      <div className="not-prose mb-8"><PlookupViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 Lookup이 필요한가?</h3>
        <p>PLONK 게이트만으로 range check(<code className="bg-accent px-1.5 py-0.5 rounded text-sm">0 &le; x &lt; 256</code>)를 하면 비트 분해에 약 16개 제약이 필요하다.
        <br />
          Plookup(Lookup Argument, 테이블 조회 논증)은 테이블 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">T = {'{'}0..255{'}'}</code>에서 한 번의 lookup으로 1개 제약으로 줄인다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">PLONK vs Plookup 제약 수 비교</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded border border-rose-500/30 p-3">
                <p className="font-semibold text-sm text-rose-400 mb-1">PLONK만으로</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground">
                  <li>Range check: 비트 분해 (8개 boolean gate) + 결합 확인 → ~16개 제약</li>
                  <li>XOR (8비트): 비트 분해 + 비트별 XOR + 결합 → ~32개 제약</li>
                </ul>
              </div>
              <div className="rounded border border-emerald-500/30 p-3">
                <p className="font-semibold text-sm text-emerald-400 mb-1">Plookup으로</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground">
                  <li>Range check: 테이블 <M>{'T = \\{0,\\ldots,255\\}'}</M>, lookup 1회 → 1개 제약</li>
                  <li>XOR: XOR 테이블에서 한 번의 lookup → 1개 제약</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 아이디어: 정렬된 병합</h3>
        <p>f의 모든 원소가 T에 있음을 <strong>&quot;f와 T를 T의 순서로 정렬할 수 있다&quot;</strong>는 것으로 환원한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 space-y-3">
            <div className="rounded border border-emerald-500/30 p-3">
              <p className="font-semibold text-sm text-emerald-400 mb-1">멤버십 성공 → 정렬 가능</p>
              <p className="text-sm font-mono text-muted-foreground">T = [0, 1, 2, 3], f = [1, 2]</p>
              <p className="text-sm font-mono text-muted-foreground">sorted(f &cup; T) = [0, 1, 1, 2, 2, 3] &larr; T 순서 유지하며 f 삽입 가능</p>
            </div>
            <div className="rounded border border-rose-500/30 p-3">
              <p className="font-semibold text-sm text-rose-400 mb-1">멤버십 실패 → 정렬 불가능</p>
              <p className="text-sm font-mono text-muted-foreground">T = [0, 1, 2, 3], f = [5]</p>
              <p className="text-sm font-mono text-muted-foreground">5는 T에 없으므로 T 순서로 정렬 불가능!</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">프로토콜 단계</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Plookup 프로토콜</p>
            <p className="text-sm text-muted-foreground mb-2">입력: 테이블 <M>{'t = (t_0, \\ldots, t_{d-1})'}</M>, 조회값 <M>{'f = (f_0, \\ldots, f_{n-1})'}</M>. 주장: <M>{'f \\subseteq t'}</M></p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal pl-5">
              <li>정렬된 병합: <M>{'s = \\text{sort}(f \\cup t)'}</M> (t의 순서 유지) -- 핵심 단계</li>
              <li>중첩 분리: <M>{'h_1 = s[..d],\\; h_2 = s[d{-}1..]'}</M> (<M>{'h_1'}</M>의 마지막 = <M>{'h_2'}</M>의 첫 원소)</li>
              <li>검증자가 랜덤 <M>{'\\beta, \\gamma'}</M> 선택</li>
              <li>Grand product <M>{'Z(x)'}</M> 계산</li>
            </ol>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Grand Product 검증</h3>
        <p>permutation argument와 동일한 패턴으로, 곱의 텔레스코핑으로 정렬의 올바름을 증명한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-emerald-500/30 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Grand Product 검증</p>
            <div className="my-2">
              <M display>{'Z(\\omega^0) = 1'}</M>
              <M display>{'Z(\\omega^{i+1}) = Z(\\omega^i) \\cdot \\frac{(1+\\beta)(\\gamma + f_i)(\\gamma(1+\\beta) + t_i + \\beta \\cdot t_{i+1})}{(\\gamma(1+\\beta) + h_{1,i} + \\beta \\cdot h_{1,i+1})(\\gamma(1+\\beta) + h_{2,i} + \\beta \\cdot h_{2,i+1})}'}</M>
            </div>
            <p className="text-sm text-muted-foreground">최종: <M>{'Z(\\omega^{n-1})'}</M> &middot; (마지막 항) = 1 → 분자/분모 전체가 상쇄되면 <M>{'f \\subseteq t'}</M> 증명 완료</p>
          </div>
        </div>
        <p><M>{'h_1, h_2'}</M>는 증명자가 제공하는 witness이며, KZG로 commit된다. 연속 원소 쌍 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">(s_i, s_{'{'}i+1{'}'})</code>의 관계가 멤버십을 보장한다.</p>
      </div>
    </section>
  );
}
