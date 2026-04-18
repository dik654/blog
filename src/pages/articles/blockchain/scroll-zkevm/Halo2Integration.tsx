import Halo2FlowViz from './viz/Halo2FlowViz';

export default function Halo2Integration() {
  return (
    <section id="halo2-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Halo2 통합</h2>
      <div className="not-prose mb-8"><Halo2FlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Scroll zkEVM은 <strong>Halo2</strong> 영지식 증명 백엔드를 사용합니다.<br />
          모든 회로가 <code>Circuit</code> 트레이트를 구현하고,
          <code>SubCircuit</code> 트레이트로 서브회로 간 일관된 인터페이스를 제공합니다.
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">Circuit 트레이트</h3>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-3">
            <code className="text-xs">trait Circuit&lt;F: Field&gt;</code>
            <span className="text-muted-foreground font-normal ml-2">모든 회로가 구현</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3">
              <p className="font-semibold text-sky-700 dark:text-sky-300 mb-1">Associated Types</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">Config</code> — 회로 설정 (테이블, 컬럼)</li>
                <li><code className="text-xs">FloorPlanner</code> — 레이아웃 전략</li>
                <li><code className="text-xs">Params</code> — 파라미터</li>
              </ul>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">키 생성</p>
              <p className="text-foreground/80"><code className="text-xs">without_witnesses(&self) -&gt; Self</code> — 더미 회로 (keygen용)</p>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">생명주기</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">configure(meta)</code> — 제약 등록</li>
                <li><code className="text-xs">synthesize(config, layouter)</code> — witness 할당</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">SuperCircuit: <code className="text-xs">Config = (SuperCircuitConfig&lt;Fr&gt;, Challenges)</code>, <code className="text-xs">FloorPlanner = SimpleFloorPlanner</code></p>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">SubCircuit 패턴</h3>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-3">
            <code className="text-xs">trait SubCircuit&lt;F: Field&gt;</code>
            <span className="text-muted-foreground font-normal ml-2">서브회로 표준 인터페이스</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3">
              <p className="font-semibold text-sky-700 dark:text-sky-300 mb-1">Config + 팩토리</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">type Config: SubCircuitConfig&lt;F&gt;</code></li>
                <li><code className="text-xs">unusable_rows() -&gt; usize</code> — 블라인딩 행 (기본 256)</li>
                <li><code className="text-xs">new_from_block(block)</code> — Block에서 생성</li>
                <li><code className="text-xs">instance()</code> — 공개 입력</li>
              </ul>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-3">
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Witness 할당</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">synthesize_sub(config, challenges, layouter)</code></li>
                <li><code className="text-xs">min_num_rows_block(block) -&gt; (usize, usize)</code> — 동적 크기</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">SubCircuitConfig 트레이트</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code className="text-xs">type ConfigArgs</code> — 설정 인자 타입</li>
              <li><code className="text-xs">fn new(meta, args) -&gt; Self</code> — ConstraintSystem에서 생성</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">CellManager</h3>
        <p>
          CellManager는 셀 할당을 최적화합니다. EVM Circuit은 <strong>수평 정렬</strong>
          (가장 낮은 컬럼 선택), Keccak Circuit은 <strong>수직 정렬</strong>
          (행을 우선 채우기) 전략을 사용합니다.
        </p>
        <div className="not-prose rounded-lg border border-border bg-muted/30 p-4 mb-6">
          <p className="text-sm font-semibold mb-3">
            <code className="text-xs">CellManager&lt;F&gt;</code>
            <span className="text-muted-foreground font-normal ml-2">셀 할당 최적화</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/30 p-3">
              <p className="font-semibold text-sky-700 dark:text-sky-300 mb-1">구조체 필드</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">width: usize</code> — 컬럼 개수</li>
                <li><code className="text-xs">height: usize</code> — 최대 높이</li>
                <li><code className="text-xs">cells: Vec&lt;Cell&lt;F&gt;&gt;</code> — 미리 쿼리된 셀</li>
                <li><code className="text-xs">columns: Vec&lt;CellColumn&lt;F&gt;&gt;</code> — 컬럼 메타</li>
              </ul>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
              <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">6종 컬럼 타입</p>
              <ul className="space-y-1 text-foreground/80">
                <li><code className="text-xs">StoragePhase1</code> — Phase 1 일반 저장소</li>
                <li><code className="text-xs">StoragePermutation</code> — Phase 1 복사 제약용</li>
                <li><code className="text-xs">StoragePhase2</code> — Phase 2 일반 저장소</li>
                <li><code className="text-xs">StoragePermutationPhase2</code> — Phase 2 복사 제약용</li>
                <li><code className="text-xs">Lookup(table)</code> — 특정 테이블 룩업 전용</li>
                <li><code className="text-xs">LookupByte</code> — 바이트 룩업 전용</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">할당 방식: <code className="text-xs">query_cell(cell_type)</code> — 가장 높이가 낮은 컬럼을 선택하여 셀 할당</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Halo2 vs 다른 SNARK</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">SNARK 시스템</th>
                <th className="border border-border px-3 py-2 text-left">Trusted Setup</th>
                <th className="border border-border px-3 py-2 text-left">Proof 크기</th>
                <th className="border border-border px-3 py-2 text-left">Prover 속도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Groth16 (2016)</td>
                <td className="border border-border px-3 py-2">Per-circuit</td>
                <td className="border border-border px-3 py-2">192 bytes</td>
                <td className="border border-border px-3 py-2">빠름</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">PLONK (2019)</td>
                <td className="border border-border px-3 py-2">Universal</td>
                <td className="border border-border px-3 py-2">~500 bytes</td>
                <td className="border border-border px-3 py-2">중간</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Halo2 (2020)</strong></td>
                <td className="border border-border px-3 py-2">Universal (KZG)</td>
                <td className="border border-border px-3 py-2">~1-2 KB</td>
                <td className="border border-border px-3 py-2">중간</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Plonky2 (2022)</td>
                <td className="border border-border px-3 py-2">None (FRI)</td>
                <td className="border border-border px-3 py-2">~50 KB</td>
                <td className="border border-border px-3 py-2">매우 빠름</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">STARKs</td>
                <td className="border border-border px-3 py-2">None</td>
                <td className="border border-border px-3 py-2">~100 KB</td>
                <td className="border border-border px-3 py-2">빠름</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Scroll의 Halo2 선택 이유</p>
          <p>
            <strong>Universal setup</strong>: Circuit 변경 시 재설정 불필요<br />
            <strong>Lookup arguments</strong>: zkEVM table system에 필수<br />
            <strong>PLONKish arithmetization</strong>: 유연한 custom gates<br />
            <strong>활발한 생태계</strong>: ZCash, PSE, Axiom 등 공유
          </p>
        </div>

      </div>
    </section>
  );
}
