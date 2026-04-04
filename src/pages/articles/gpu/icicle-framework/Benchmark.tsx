import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const scalingCode = `// MSM 입력 크기별 처리 시간 (BN254, A100 80GB)
//
// 입력 크기      ICICLE     bellperson    sppark
// ─────────    ────────   ──────────   ───────
// 2^16          0.8ms       3.2ms       1.1ms
// 2^18          2.1ms      11.5ms       3.0ms
// 2^20          7.8ms      42ms        10.2ms
// 2^22         28ms       160ms        35ms
// 2^24        105ms       620ms       130ms
// 2^26        410ms      2400ms       500ms
//
// ICICLE은 2^20 이상에서 bellperson 대비 5~6x 빠르다.
// sppark과는 비슷하거나 10~20% 우위.`;

const nttScalingCode = `// NTT 벤치마크 (BN254 스칼라 필드, A100 80GB)
//
// 입력 크기      ICICLE NTT    CPU (single)   속도 향상
// ─────────    ──────────    ───────────   ────────
// 2^20          1.2ms         85ms          ~70x
// 2^22          4.5ms        380ms          ~84x
// 2^24         17ms         1650ms          ~97x
// 2^26         68ms         7200ms         ~106x
//
// 입력이 클수록 GPU 병렬화 이점이 극대화된다.
// NTT는 butterfly 패턴이 규칙적이라 GPU 점유율이 높다.`;

export default function Benchmark() {
  return (
    <section id="benchmark" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">벤치마크 & 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ICICLE의 성능을 bellperson, sppark과 비교한다.<br />
          모든 벤치마크는 BN254 커브, NVIDIA A100 80GB 기준이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MSM 벤치마크</h3>
        <p>
          ICICLE은 Pippenger 알고리즘을 최적화한 버킷 방식을 사용한다.
          2^20 포인트 이상에서 bellperson 대비 <strong>5~6배</strong> 빠르고, sppark과 유사하거나 소폭 우위다.
        </p>
        <CodePanel title="MSM 벤치마크: ICICLE vs bellperson vs sppark" code={scalingCode} annotations={[
          { lines: [5, 11], color: 'sky', note: '입력 크기별 MSM 처리 시간' },
          { lines: [13, 14], color: 'emerald', note: 'ICICLE: 대규모에서 5~6x 우위' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">NTT 벤치마크</h3>
        <p>
          NTT는 butterfly 연산이 규칙적이어서 GPU 점유율이 높다.
          2^26 크기에서 CPU 대비 <strong>100배 이상</strong> 빠르며, 입력이 클수록 격차가 벌어진다.
        </p>
        <CodePanel title="NTT 벤치마크: GPU vs CPU" code={nttScalingCode} annotations={[
          { lines: [4, 9], color: 'sky', note: '입력 크기별 NTT 처리 시간' },
          { lines: [11, 12], color: 'emerald', note: 'GPU 병렬화 효율' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Multi-GPU & H100</h3>
        <div className="overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">구성</th>
                <th className="border border-border px-4 py-2 text-left">MSM 2^26</th>
                <th className="border border-border px-4 py-2 text-left">NTT 2^26</th>
                <th className="border border-border px-4 py-2 text-left">비고</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['A100 1장', '410ms', '68ms', '기준'],
                ['A100 4장', '115ms', '19ms', '~3.6x 스케일링'],
                ['H100 1장', '260ms', '42ms', 'A100 대비 ~1.6x'],
                ['H100 4장', '72ms', '12ms', '~3.6x 스케일링'],
              ].map(([cfg, msm, ntt, note]) => (
                <tr key={cfg}>
                  <td className="border border-border px-4 py-2 font-medium">{cfg}</td>
                  <td className="border border-border px-4 py-2">{msm}</td>
                  <td className="border border-border px-4 py-2">{ntt}</td>
                  <td className="border border-border px-4 py-2">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Multi-GPU 스케일링 효율은 약 90%다. 이론적 4x가 아닌 ~3.6x인 이유는 GPU 간 통신 오버헤드 때문이다.</p>
        <CitationBlock source="Ingonyama — ICICLE Benchmarks" citeKey={4} type="paper"
          href="https://www.ingonyama.com/blog/icicle-v3-benchmarks">
          <p className="text-xs">
            H100의 SM 수(132개)가 A100(108개)보다 22% 많고, 클럭도 높아 단일 GPU 성능이 ~1.6x 향상된다.<br />
            NVLink 4.0 기반 Multi-GPU에서 GPU 간 대역폭이 900GB/s로, 스케일링 효율이 높다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
