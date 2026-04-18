import ProofAggViz from './viz/ProofAggViz';
import M from '@/components/ui/math';

export default function ProofPipeline() {
  return (
    <section id="proof-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 생성 파이프라인</h2>
      <div className="not-prose mb-8"><ProofAggViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Scroll zkEVM은 <strong>Chunk → Batch → Bundle</strong> 3단계 증명 집계를 사용합니다.<br />
          KZG 커밋먼트 + SHPLONK 개구 증명으로 각 Chunk를 증명하고,
          여러 Chunk를 Batch로 집계한 뒤, 최종 Bundle을 L1에 제출합니다.
        </p>

        {/* Setup & 키 생성 */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Setup & 키 생성</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">KZG 파라미터 + Proving Key</p>
          <div className="grid gap-2">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">KZG 파라미터</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>k = 20</code> → 회로 크기 <M>{'2^{20} = 1{,}048{,}576'}</M> 행.
                <code>ParamsKZG::&lt;Bn256&gt;::setup(k, rng)</code>로 생성.
              </p>
            </div>
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">VK + PK 생성</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>keygen_vk(&params, &circuit)</code> → Verifying Key.
                <code>keygen_pk(&params, vk, &circuit)</code> → Proving Key.
              </p>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">증명 생성 4단계</p>
              <ol className="list-decimal list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                <li>Commitment Phase — Advice column → 다항식 → KZG 커밋</li>
                <li>Challenge Gen — Fiat-Shamir → challenge 생성</li>
                <li>Evaluation Phase — Challenge 점에서 다항식 평가</li>
                <li>Opening Phase — KZG opening proof 생성</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 증명 생성 */}
        <h3 className="text-lg font-semibold mt-6 mb-3">증명 생성</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">SuperCircuit 빌드 → SNARK 생성</p>
          <div className="grid gap-2">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">SuperCircuit 빌드 — Geth 데이터 → 회로</p>
              <ol className="list-decimal list-inside text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                <li><code>BlockData::new_from_geth_data_with_params()</code>로 블록 데이터 구성</li>
                <li><code>new_circuit_input_builder()</code> → <code>handle_block()</code>으로 트레이스 처리</li>
                <li><code>block_convert()</code>로 Block 변환</li>
                <li><code>SuperCircuit::new_from_block(&block)</code>으로 회로 인스턴스 생성</li>
                <li><code>k = log2_ceil(unusable_rows + rows_needed)</code>로 회로 크기 결정</li>
              </ol>
            </div>
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">KZG + SHPLONK 증명 생성</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>Blake2bWrite::init(vec![])</code>로 transcript 초기화.
                <code>create_proof::&lt;KZGCommitmentScheme&lt;Bn256&gt;, ProverGWC&lt;_&gt;, ...&gt;()</code>로
                params, pk, circuit, instances를 입력받아 증명 생성.
                <code>transcript.finalize()</code>로 최종 바이트 반환.
              </p>
            </div>
          </div>
        </div>

        {/* 집계 전략 */}
        <h3 className="text-lg font-semibold mt-6 mb-3">집계 전략</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-2">Chunk → Batch → Bundle</p>
          <div className="grid gap-2">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">Chunk Proof</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                연속된 블록 묶음의 증명(SuperCircuit).
                <code>min_num_rows_block()</code>으로 동적 크기 결정 — 각 서브회로의 필요 행 수 중 최대값 선택.
              </p>
            </div>
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Batch Proof</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                여러 Chunk 증명을 집계. 중간 상태 루트 검증 + 배치 해시 연속성 보장.
              </p>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1">Bundle Proof</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                최종 온체인 제출용. L1 검증 컨트랙트에 제출. 가스 효율적 단일 증명.
              </p>
            </div>
            <div className="rounded border bg-violet-50/50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800 p-3">
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">동적 크기 결정</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <code>SuperCircuit::min_num_rows_block(block)</code> —
                <code>EvmCircuit</code>, <code>KeccakCircuit</code>, <code>TxCircuit</code> 등
                각 회로의 필요 행 수 중 최대값을 반환.
              </p>
            </div>
          </div>
        </div>

        {/* 왜 3단계 집계인가 */}
        <h3 className="text-xl font-semibold mt-8 mb-3">왜 3단계 집계인가</h3>
        <div className="rounded-lg border bg-muted/30 p-4 not-prose mb-6">
          <p className="text-sm font-semibold mb-3">L1 제출 비용 문제와 해결</p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
            Halo2 proof 크기 ~400KB, L1 verify gas ~500K gas per proof.
            각 블록마다 개별 제출 시 비현실적 비용 → 계층적 집계로 해결.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            <div className="rounded border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800 p-3">
              <p className="text-sm font-bold text-sky-700 dark:text-sky-300">Layer 1: Chunk</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                일반 SNARK proof. 400KB, 500K gas. 10-100 블록 포함.
              </p>
            </div>
            <div className="rounded border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-3">
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Layer 2: Batch</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Recursive proof로 집계. 400KB(고정), 500K gas. 같은 비용으로 더 많은 tx 검증.
              </p>
            </div>
            <div className="rounded border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-3">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-300">Layer 3: Bundle</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                최종 L1 제출. 400KB(여전히 고정!). Gas amortization 극대화.
              </p>
            </div>
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            1 bundle = 수백 batches = 수천 chunks = 수만 transactions를 500K gas로 L1 제출.
            Per-tx cost ~$0.005 (L1 gas 20 gwei 기준).
            Recursive SNARK의 힘 — 증명의 증명 생성 가능. Trade-off로 prover 비용 증가하지만, L1 cost 절감이 훨씬 큼.
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: KZG + SHPLONK 선택</p>
          <p>
            <strong>KZG commitment</strong>: Trusted setup 필요, proof 작음 (48 bytes)<br />
            <strong>SHPLONK</strong>: Multi-point opening 최적화 — 여러 점 한번에 증명<br />
            대안 <strong>FRI</strong>(STARK): No trusted setup, proof 큼 (수십 KB)<br />
            Scroll은 <strong>proof 크기 우선</strong> → KZG 선택
          </p>
        </div>

      </div>
    </section>
  );
}
