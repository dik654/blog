import ConstantTimeViz from './viz/ConstantTimeViz';
import CtLibrariesViz from './viz/CtLibrariesViz';
import OramViz from './viz/OramViz';
import ObliviousAlgViz from './viz/ObliviousAlgViz';
import CachePartitionViz from './viz/CachePartitionViz';
import NoiseInjectionViz from './viz/NoiseInjectionViz';

export default function Defense() {
  return (
    <section id="defense" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">방어 기법 — Constant-time, ORAM, Partitioning</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">방어 계층 전략</h3>
        <p>
          <strong>Defense in depth</strong>: 하드웨어 + 컴파일러 + 앱 모두에서 대응<br />
          단일 계층만으로는 불충분 — 공격자는 약한 고리 찾음<br />
          <strong>성능 비용 인식</strong>: 완전한 방어는 수십% 오버헤드 감수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Constant-time 프로그래밍</h3>
        <div className="not-prose mb-6"><ConstantTimeViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Constant-time 라이브러리</h3>
        <div className="not-prose mb-6"><CtLibrariesViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">ORAM (Oblivious RAM)</h3>
        <div className="not-prose mb-6"><OramViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Oblivious Algorithms</h3>
        <div className="not-prose mb-6"><ObliviousAlgViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 파티셔닝 (Cache Allocation)</h3>
        <div className="not-prose mb-6"><CachePartitionViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Noise Injection</h3>
        <div className="not-prose mb-6"><NoiseInjectionViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 방어 기법 비교 — 비용 vs 효과</p>
          <p>
            <strong>Constant-time</strong>:<br />
            ✓ 저오버헤드 (보통 2-5%)<br />
            ✓ 타이밍·캐시 공격 대부분 차단<br />
            ✗ 개발자 훈련 필요, 검증 어려움
          </p>
          <p className="mt-2">
            <strong>ORAM</strong>:<br />
            ✓ 가장 강력한 방어<br />
            ✗ O(log²N) 오버헤드 — 일반 앱 비현실적<br />
            ✗ 특정 use case만 (key store, 검색)
          </p>
          <p className="mt-2">
            <strong>Cache partitioning</strong>:<br />
            ✓ 하드웨어 지원, 투명<br />
            ✗ SMT 공격 방어 못 함<br />
            ✗ Intel 전용, way 수 제한
          </p>
          <p className="mt-2">
            <strong>실무 추천</strong>:<br />
            1. Constant-time 기본 (모든 crypto 코드)<br />
            2. SMT 비활성화 (confidential 워크로드)<br />
            3. Cache partitioning (multi-tenant)<br />
            4. ORAM은 high-value secrets만
          </p>
        </div>

      </div>
    </section>
  );
}
