import M from '@/components/ui/math';
import E2EPipelineViz from './viz/E2EPipelineViz';

export default function ProofGenVerify() {
  return (
    <section id="proof-gen-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 생성 및 검증</h2>
      <div className="not-prose mb-8"><E2EPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">E2E 파이프라인</h3>
        <p>회로 작성부터 검증까지 <strong>5단계</strong>로 구성된다. 컴파일과 키생성은 1회, 증명-검증은 매번 수행한다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">전체 파이프라인 (End-to-End)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-sky-500/30 p-3">
                <p className="font-semibold text-sm text-sky-400 mb-1">1회성</p>
                <ol className="text-sm space-y-0.5 text-muted-foreground list-decimal pl-5">
                  <li>회로 작성: 게이트 + 와이어 정의</li>
                  <li>컴파일: 선택자/순열 다항식 생성</li>
                  <li>SRS + 키생성: <code>pk</code>, <code>vk</code> 산출</li>
                </ol>
              </div>
              <div className="rounded border border-emerald-500/30 p-3">
                <p className="font-semibold text-sm text-emerald-400 mb-1">반복</p>
                <ol className="text-sm space-y-0.5 text-muted-foreground list-decimal pl-5" start={4}>
                  <li>증명 생성: 5-Round 프로토콜</li>
                  <li>검증: 페어링 2회 <M>{'O(1)'}</M></li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">증명 생성</h3>
        <p>5-Round 프로토콜의 복잡도는 <strong>O(n log n)</strong>이다. FFT/IFFT가 지배적이다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-sky-500/30 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">증명 생성 흐름</p>
            <p className="text-sm text-muted-foreground mb-2">witness 대입 → Lagrange 보간 → 블라인딩 → KZG commit (Round 1-3) → 평가 + 오프닝 (Round 4-5)</p>
            <div className="grid grid-cols-2 gap-3 text-sm mt-2">
              <div className="bg-muted/50 rounded p-2 text-center">
                <p className="text-amber-400 font-medium">시간</p>
                <p className="text-muted-foreground"><M>{'O(n \\log n)'}</M> -- FFT/IFFT 지배적</p>
              </div>
              <div className="bg-muted/50 rounded p-2 text-center">
                <p className="text-amber-400 font-medium">공간</p>
                <p className="text-muted-foreground"><M>{'O(n)'}</M> -- 다항식 계수 저장</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">검증</h3>
        <p>검증자는 <strong>상수 시간 O(1)</strong>으로 증명을 검증한다. 페어링 2회와 소수의 스칼라 곱만 필요하다.</p>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-violet-500/30 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">검증 흐름</p>
            <p className="text-sm text-muted-foreground mb-2"><M>{'\\pi'}</M> + public inputs → Fiat-Shamir 재생 → 선형화 재구성 → 배치 KZG check</p>
            <div className="grid grid-cols-2 gap-3 text-sm mt-2">
              <div className="bg-muted/50 rounded p-2 text-center">
                <p className="text-emerald-400 font-medium">시간</p>
                <p className="text-muted-foreground"><M>{'O(1)'}</M> -- 페어링 2회 + G1 스칼라곱 수회</p>
              </div>
              <div className="bg-muted/50 rounded p-2 text-center">
                <p className="text-emerald-400 font-medium">공간</p>
                <p className="text-muted-foreground"><M>{'O(1)'}</M> -- 상수 개수의 점/스칼라</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">성능 벤치마크</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">PLONK 성능</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="py-2 text-muted-foreground font-medium">회로 크기</th>
                    <th className="py-2 text-muted-foreground font-medium">증명 시간</th>
                    <th className="py-2 text-muted-foreground font-medium">검증 시간</th>
                    <th className="py-2 text-muted-foreground font-medium">증명 크기</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/20"><td className="py-1.5"><M>{'2^{10}'}</M></td><td>~50 ms</td><td>~5 ms</td><td>768 B</td></tr>
                  <tr className="border-b border-border/20"><td className="py-1.5"><M>{'2^{16}'}</M></td><td>~800 ms</td><td>~5 ms</td><td>768 B</td></tr>
                  <tr><td className="py-1.5"><M>{'2^{20}'}</M></td><td>~12 s</td><td>~5 ms</td><td>768 B</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-emerald-400 mt-2 font-medium text-center">증명 크기와 검증 시간은 회로 크기에 무관!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
