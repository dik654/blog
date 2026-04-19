import SpparkArchViz from './viz/SpparkArchViz';
import BatchAffineViz from './viz/BatchAffineViz';

export default function Sppark() {
  return (
    <section id="sppark" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">sppark 구현 분석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>sppark</strong>는 Supranational이 개발한 프로덕션 MSM 라이브러리다.<br />
          Filecoin의 SupraSeal에 통합되어 실제 증명 생성에 사용된다.<br />
          Rust 프론트엔드와 CUDA 백엔드로 구성되며, BLS12-381과 BN254 곡선을 지원한다.
        </p>
        <SpparkArchViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Batch Affine Inversion</h3>
        <p>
          Jacobian 좌표 덧셈은 16회 곱셈이 필요하지만, Affine 혼합 덧셈은 6회로 끝난다.<br />
          Montgomery's trick으로 n개 역원을 곱셈 3(n-1)회 + 역원 1회로 처리하면
          모든 점을 Affine로 변환할 수 있다. sppark는 이 기법으로 bellperson 대비 약 2배 빠르다.
        </p>
        <BatchAffineViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">라이브러리</th>
                <th className="border border-border px-4 py-2 text-left">BLS12-381 2^22</th>
                <th className="border border-border px-4 py-2 text-left">핵심 기법</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['bellperson', '~4.5s', 'Pippenger + Jacobian 누적'],
                ['sppark', '~2.2s', 'Batch Affine + 파이프라이닝'],
                ['ICICLE', '~2.5s', 'Radix Sort + 다중 곡선 추상화'],
              ].map(([lib, time, tech]) => (
                <tr key={lib}>
                  <td className="border border-border px-4 py-2 font-medium">{lib}</td>
                  <td className="border border-border px-4 py-2">{time}</td>
                  <td className="border border-border px-4 py-2">{tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
