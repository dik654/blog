import BenchViz from './viz/BenchViz';
import { COMPLEXITY_TABLE } from './BenchmarkData';

export default function Benchmark() {
  return (
    <section id="benchmark" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">벤치마크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Proof of SQL의 성능은 데이터 크기와 사용하는 하드웨어에 따라 달라집니다.
          <strong>GPU 가속</strong>(Blitzar 라이브러리)을 사용하면 Commitment 생성과
          다항식 연산에서 <strong>10-20배</strong> 성능 향상을 얻을 수 있습니다.
        </p>
        <h3>시간 복잡도</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">연산</th>
                <th className="text-left p-2">시간</th>
                <th className="text-left p-2">공간</th>
                <th className="text-left p-2">설명</th>
              </tr>
            </thead>
            <tbody>
              {COMPLEXITY_TABLE.map((c) => (
                <tr key={c.op} className="border-b border-muted">
                  <td className="p-2">{c.op}</td>
                  <td className="p-2 font-mono text-xs">{c.time}</td>
                  <td className="p-2 font-mono text-xs">{c.space}</td>
                  <td className="p-2">{c.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>GPU 가속 전략</h3>
        <ul>
          <li><strong>대규모 Commitment</strong> -- GPU에서 병렬 처리 (Rayon + CUDA)</li>
          <li><strong>수학적 연산</strong> -- 다항식 평가와 스칼라 곱셈을 CUDA 커널로 가속</li>
          <li><strong>스트리밍 처리</strong> -- 메모리 제한 시 청크 단위 분할 처리</li>
        </ul>
        <h3>향후 방향</h3>
        <p>
          JOIN, GROUP BY, 집계 함수 지원 확대, PLONK/FRI 기반 새로운 증명 통합,
          Lattice 기반 암호로 양자 저항성 확보 등이 계획되어 있습니다.
        </p>
      </div>
      <div className="mt-8"><BenchViz /></div>
    </section>
  );
}
