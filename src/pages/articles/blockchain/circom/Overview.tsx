import CompilerPipelineViz from './viz/CompilerPipelineViz';

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 컴파일 파이프라인'}</h2>
      <div className="not-prose mb-8">
        <CompilerPipelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Circom</strong>은 zkSNARK 증명 시스템을 위한 산술 회로를 정의하는
          도메인 특화 언어(DSL)입니다. <code>.circom</code> 소스를 파싱하여
          R1CS 제약 조건과 WASM 증인 계산기를 생성하고,
          snarkjs/rapidSnark와 연동하여 증명을 생성합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">컴파일러 크레이트 구조</h3>
        <div className="not-prose space-y-3 mb-6">
          {[
            {
              stage: '1', title: '프론트엔드', subtitle: '파싱 + AST', color: '#3b82f6',
              modules: [
                { name: 'parser/', desc: 'LALRPOP 기반 .circom 파싱 → AST' },
                { name: 'program_structure/', desc: 'Template, Signal, ProgramArchive' },
                { name: 'type_analysis/', desc: '신호 타입 검증, 매개변수 추론' },
              ],
            },
            {
              stage: '2', title: '제약 생성', subtitle: '핵심 엔진', color: '#10b981',
              modules: [
                { name: 'constraint_generation/', desc: 'R1CS 제약 생성' },
                { name: 'dag/', desc: 'DAG 기반 제약 최적화' },
                { name: 'circom_algebra/', desc: '유한체 산술 연산' },
              ],
            },
            {
              stage: '3', title: '최적화 + 출력', subtitle: '코드 생성', color: '#f59e0b',
              modules: [
                { name: 'code_producers/', desc: '.r1cs, .wasm, .sym, C++ 출력' },
                { name: 'constant_tracking/', desc: '상수 전파 최적화' },
                { name: 'constraint_list/', desc: '제약 조건 리스트 관리' },
                { name: 'constraint_writers/', desc: '제약 직렬화' },
              ],
            },
          ].map((s) => (
            <div key={s.stage} className="rounded-lg border overflow-hidden" style={{ borderColor: `${s.color}30` }}>
              <div className="flex items-center gap-2 px-4 py-2" style={{ background: `${s.color}10` }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: s.color }}>{s.stage}</span>
                <span className="text-sm font-bold" style={{ color: s.color }}>{s.title}</span>
                <span className="text-xs text-muted-foreground">{s.subtitle}</span>
              </div>
              <div className="grid gap-px sm:grid-cols-3 lg:grid-cols-4" style={{ background: 'var(--border)' }}>
                {s.modules.map((m) => (
                  <div key={m.name} className="bg-card px-3 py-2">
                    <code className="text-xs font-bold" style={{ color: s.color }}>{m.name}</code>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Circom 언어 생태계</h3>

        <div className="not-prose rounded-lg border p-4 text-sm space-y-4 mb-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">프로젝트 정보</p>
              <ul className="space-y-1 text-sm">
                <li>2019: iden3가 Circom 1 공개 (C++ 구현)</li>
                <li>2022: Circom 2 (Rust 재작성, 대폭 개편)</li>
                <li>현재: Circom 2.2.x (안정 버전)</li>
                <li>관리: iden3 (바르셀로나 ZK/ID 팀)</li>
                <li>라이선스: GPL-3.0</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">핵심 설계 원칙</p>
              <ul className="space-y-1 text-sm">
                <li><strong>Circuit-as-code</strong> — 회로를 함수처럼 작성, 컴파일러가 R1CS 제약 방출</li>
                <li><strong>비결정적 계산</strong> — <code>{'<--'}</code> 값만 대입 / <code>{'<=='}</code> 대입+제약 / <code>{'==='}</code> 제약만</li>
                <li><strong>유한체 산술</strong> — 모든 연산은 F_p 위에서 수행 (기본: bn128 스칼라 필드)</li>
                <li><strong>명시적 증인 생성</strong> — WASM/C++ 증인 계산기 별도 출력</li>
              </ul>
            </div>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">핵심 구문 요소</h4>
        <div className="not-prose grid gap-2 sm:grid-cols-3 mb-6">
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-semibold text-xs mb-2">회로 구성</p>
            <ul className="space-y-1">
              <li><code>signal</code> — 산술 회로의 와이어</li>
              <li><code>template</code> — 재사용 가능한 회로 블록 (클래스와 유사)</li>
              <li><code>component</code> — 템플릿 인스턴스</li>
              <li><code>var</code> — 컴파일 타임 변수 (시그널 아님!)</li>
            </ul>
          </div>
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-semibold text-xs mb-2">연산자</p>
            <ul className="space-y-1">
              <li><code>{'<=='}</code> — 제약 + 대입 동시</li>
              <li><code>{'<--'}</code> — 대입만 (비결정적)</li>
              <li><code>{'==='}</code> — 제약만 (대입 없음)</li>
            </ul>
          </div>
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-semibold text-xs mb-2">var vs signal</p>
            <ul className="space-y-1">
              <li><code>var x = 5</code> → 컴파일 타임 상수, R1CS에서 사라짐</li>
              <li><code>signal x</code> → 런타임 시그널, R1CS에 참여</li>
            </ul>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">컴파일 결과물</h4>
        <div className="not-prose grid gap-2 sm:grid-cols-2 mb-6">
          <div className="rounded-lg border bg-sky-50 dark:bg-sky-950/30 p-3 text-sm">
            <p className="font-semibold text-xs mb-1">.r1cs</p>
            <p className="text-muted-foreground">바이너리 R1CS 제약 시스템. snarkjs/rapidSnark가 증명에 사용</p>
          </div>
          <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 p-3 text-sm">
            <p className="font-semibold text-xs mb-1">.wasm</p>
            <p className="text-muted-foreground">WebAssembly 증인 계산기. 프로그램을 실행하여 모든 시그널 값 계산</p>
          </div>
          <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/30 p-3 text-sm">
            <p className="font-semibold text-xs mb-1">.sym</p>
            <p className="text-muted-foreground">심볼 테이블 (시그널 이름 ↔ 인덱스). 디버깅 용도</p>
          </div>
          <div className="rounded-lg border bg-violet-50 dark:bg-violet-950/30 p-3 text-sm">
            <p className="font-semibold text-xs mb-1">.cpp</p>
            <p className="text-muted-foreground">C++ 증인 계산기 (네이티브, 더 빠름). 프로덕션용 빌드 스크립트로 컴파일</p>
          </div>
        </div>

        <h4 className="font-semibold mt-6 mb-3">전형적 워크플로우</h4>
        <div className="not-prose flex flex-col gap-2 mb-6">
          {[
            { step: 1, text: '회로 작성', detail: 'circuit.circom 파일 작성' },
            { step: 2, text: '컴파일', detail: 'circom circuit.circom --r1cs --wasm --sym' },
            { step: 3, text: 'Trusted Setup', detail: 'R1CS를 Groth16 / PLONK 등에 전달' },
            { step: 4, text: '증인 생성', detail: 'WASM에 입력 전달 → witness 계산' },
            { step: 5, text: '증명 생성', detail: 'witness + proving key로 증명 생성' },
            { step: 6, text: '검증', detail: 'verification key로 증명 검증' },
          ].map(s => (
            <div key={s.step} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
              <span className="flex-none w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xs font-bold">{s.step}</span>
              <span className="font-medium w-28 flex-none">{s.text}</span>
              <span className="text-muted-foreground">{s.detail}</span>
            </div>
          ))}
        </div>

        <h4 className="font-semibold mt-6 mb-3">표준 라이브러리 (circomlib)</h4>
        <p className="text-sm text-muted-foreground mb-3">github.com/iden3/circomlib — 200+ 템플릿</p>
        <div className="not-prose grid gap-2 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {[
            { category: '해시 함수', items: 'Poseidon, Pedersen, MiMC, Sha256' },
            { category: '서명', items: 'EdDSA (Baby Jubjub), ECDSA' },
            { category: '머클 트리', items: 'binary, sparse, LEAN trees' },
            { category: '기본 가젯', items: 'AliasCheck, Num2Bits, Bits2Num, LessThan, IsEqual' },
            { category: '선택/스위칭', items: 'MultiMux, Switcher, GreaterThan' },
            { category: '암호 도구', items: 'AES, SMT proof, Babyjubjub ops' },
          ].map(c => (
            <div key={c.category} className="rounded-lg border p-3 text-sm">
              <p className="font-semibold text-xs mb-1">{c.category}</p>
              <p className="text-muted-foreground">{c.items}</p>
            </div>
          ))}
        </div>

        <h4 className="font-semibold mt-6 mb-3">프로덕션 프로젝트</h4>
        <div className="not-prose flex flex-wrap gap-2 mb-6">
          {[
            'Tornado Cash (mixer)',
            'Semaphore (익명 신호)',
            'MACI (반담합)',
            'Hermez Network (zkRollup)',
            'Iden3 (자기주권 신원)',
            'RollupNC',
            'Dark Forest (zkSNARK 게임)',
          ].map(p => (
            <span key={p} className="rounded-full border px-3 py-1 text-xs">{p}</span>
          ))}
        </div>

        <h4 className="font-semibold mt-6 mb-3">한계</h4>
        <div className="not-prose grid gap-2 sm:grid-cols-2 mb-4">
          {[
            '네이티브 비트 연산 없음 (Num2Bits 필요)',
            '문자열/바이트 미지원',
            '모든 값이 F_p (오버플로우 위험!)',
            '툴링이 Rust/Go 대비 약함',
            '시그널 인덱싱: O(n log n) 최악',
          ].map(l => (
            <div key={l} className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">{l}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
