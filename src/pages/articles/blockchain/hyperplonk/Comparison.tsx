import Math from '@/components/ui/math';
import ComparisonViz from './viz/ComparisonViz';

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PLONK vs HyperPLONK</h2>
      <ComparisonViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-4">비교 테이블</h3>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium">항목</th>
                <th className="text-left p-3 font-medium">PLONK</th>
                <th className="text-left p-3 font-medium">HyperPLONK</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">다항식 유형</td>
                <td className="p-3">단변수 (univariate)</td>
                <td className="p-3">다중선형 (multilinear)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Arithmetization</td>
                <td className="p-3">PLONKish 게이트</td>
                <td className="p-3">커스텀 제약 + sumcheck</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Prover 병목</td>
                <td className="p-3">
                  FFT/NTT — <Math>{'O(n \\log n)'}</Math>
                </td>
                <td className="p-3">
                  Sumcheck — <Math>{'O(n)'}</Math>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">FFT 필요 여부</td>
                <td className="p-3">필수</td>
                <td className="p-3">불필요</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">Commitment Scheme</td>
                <td className="p-3">KZG (trusted setup)</td>
                <td className="p-3">Dory / Zeromorph</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-medium">증명 크기</td>
                <td className="p-3">
                  <Math>{'O(1)'}</Math> (KZG)
                </td>
                <td className="p-3">
                  <Math>{'O(\\log^2 n)'}</Math> (Dory)
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium">검증 시간</td>
                <td className="p-3">
                  <Math>{'O(1)'}</Math> pairing
                </td>
                <td className="p-3">
                  <Math>{'O(\\log n)'}</Math> pairing
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">HyperPLONK을 선택할 때</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>FFT가 병목일 때</strong> — 제약 수가 <Math>{'2^{20}'}</Math> 이상이면 NTT 비용이 지배적, sumcheck이 유리</li>
          <li><strong>GPU/FPGA 친화적 증명</strong> — sumcheck의 각 라운드는 독립적인 부분합이라 병렬화 용이</li>
          <li><strong>투명 셋업이 필요할 때</strong> — Dory는 trusted setup 없이 다중선형 commit 가능</li>
          <li><strong>유연한 제약 구조</strong> — PLONKish 게이트에 국한되지 않고 custom constraint 정의 가능</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">PLONK을 선택할 때</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>성숙한 생태계</strong> — Halo2, Plonky2, gnark 등 검증된 프레임워크 존재</li>
          <li><strong>작은 증명 크기</strong> — KZG의 <Math>{'O(1)'}</Math> 증명은 온체인 검증에 최적</li>
          <li><strong>빠른 검증</strong> — pairing 2회로 <Math>{'O(1)'}</Math> 검증, L1 gas 비용 최소화</li>
          <li><strong>Plookup 통합</strong> — 테이블 룩업이 자연스럽게 결합됨</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-4">수렴하는 방향</h3>
        <p>
          Zeromorph — KZG 기반으로 다중선형 commit 지원, HyperPLONK에 <Math>{'O(1)'}</Math> 크기 증명 부여
          <br />
          두 세계의 장점을 결합하는 연구가 활발히 진행 중
          <br />
          <a href="/blockchain/plonk" className="text-indigo-400 hover:underline">PLONK 아티클</a>에서 기반 구조를 먼저 이해하면 HyperPLONK의 설계 동기가 더 명확해짐
        </p>
      </div>
    </section>
  );
}
