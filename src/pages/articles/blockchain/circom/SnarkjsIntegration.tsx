import SnarkjsFlowViz from './viz/SnarkjsFlowViz';

export default function SnarkjsIntegration({ title }: { title?: string }) {
  return (
    <section id="snarkjs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'snarkjs 통합'}</h2>
      <div className="not-prose mb-8">
        <SnarkjsFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Circom 컴파일 결과물(<code>.r1cs</code>, <code>.wasm</code>, <code>.sym</code>)은
          snarkjs와 연동하여 완전한 zkSNARK 증명 시스템을 구축합니다.<br />
          Powers of Tau 세레모니부터 Groth16 증명/검증까지의 전체 워크플로우입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">snarkjs 전체 워크플로우</h3>
        <div className="not-prose flex flex-col gap-2 mb-6">
          <div className="rounded-lg border bg-sky-50 dark:bg-sky-950/30 p-4 text-sm">
            <p className="text-xs font-semibold text-sky-700 dark:text-sky-300 mb-2">① Powers of Tau 세레모니 (신뢰 셋업)</p>
            <div className="font-mono text-xs space-y-1">
              <p>snarkjs.powersOfTau.<strong>newAccumulator</strong>("bn128", 12, "pot.ptau")</p>
              <p>snarkjs.powersOfTau.<strong>contribute</strong>("pot.ptau", "pot1.ptau", "contrib")</p>
              <p>snarkjs.powersOfTau.<strong>preparePhase2</strong>("pot1.ptau", "pot_final.ptau")</p>
            </div>
          </div>
          <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">② 회로별 키 생성</p>
            <div className="font-mono text-xs space-y-1">
              <p>snarkjs.zKey.<strong>newZKey</strong>("circuit.r1cs", "pot_final.ptau", "circuit.zkey")</p>
              <p>snarkjs.zKey.<strong>contribute</strong>("circuit.zkey", "circuit_final.zkey", "contrib2")</p>
              <p>snarkjs.zKey.<strong>exportVerificationKey</strong>("circuit_final.zkey") → vKey</p>
            </div>
          </div>
          <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/30 p-4 text-sm">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">③ 증인 계산 (WASM)</p>
            <div className="font-mono text-xs space-y-1">
              <p>const wc = await WitnessCalculatorBuilder(wasmBuffer)</p>
              <p>const witness = await wc.<strong>calculateWitness</strong>(input)</p>
            </div>
          </div>
          <div className="rounded-lg border bg-violet-50 dark:bg-violet-950/30 p-4 text-sm">
            <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-2">④ 증명 생성 & 검증</p>
            <div className="font-mono text-xs space-y-1">
              <p>const {'{'} proof, publicSignals {'}'} = await snarkjs.groth16.<strong>prove</strong>(zkey, witness)</p>
              <p>const valid = await snarkjs.groth16.<strong>verify</strong>(vKey, publicSignals, proof)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Powers of Tau 세레모니</h3>
        <div className="not-prose rounded-lg border p-4 text-sm space-y-3 mb-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="font-semibold text-xs mb-2">다자간 계산(MPC) 셋업</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>각 참가자가 무작위성(toxic waste) 기여</li>
                <li>1명이라도 정직하면 안전</li>
                <li>전원 공모 시 가짜 증명 생성 가능</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-xs mb-2">주요 세레모니</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>Perpetual Powers of Tau — 50+ 참가자</li>
                <li>Zcash Phase 1 — 87 참가자</li>
                <li>Hermez Network Phase 2 — 36 참가자</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Semaphore', 'Tornado Cash', 'MACI', '주요 Circom dApp'].map(p => (
              <span key={p} className="rounded-full border px-3 py-1 text-xs">{p}</span>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">키 구조</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-6">
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold text-xs text-sky-600 dark:text-sky-400 mb-2">.zkey (증명 키)</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>필드 소수 + 회로 R1CS</li>
              <li>Alpha, Beta, Gamma, Delta (G1/G2)</li>
              <li>A, B, C 다항식 (Lagrange 기저)</li>
              <li>H 다항식 계수</li>
            </ul>
            <p className="text-xs mt-2">크기: ~100MB (1M 제약 기준). 압축 불가 (랜덤 원소)</p>
          </div>
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mb-2">vkey (검증 키)</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>Alpha, Beta, Gamma, Delta (4 그룹 원소)</li>
              <li>IC[] (공개 입력당 1개 + 1)</li>
            </ul>
            <p className="text-xs mt-2">크기: ~1KB. Solidity 검증자에 내장 가능</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Solidity 검증자 내보내기</h3>
        <div className="not-prose rounded-lg border p-4 text-sm mb-6">
          <div className="font-mono text-xs mb-3">
            snarkjs zkey export solidityverifier final.zkey verifier.sol
          </div>
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3">
            <p className="text-xs font-medium mb-2">생성되는 컨트랙트</p>
            <div className="font-mono text-xs space-y-1">
              <p>contract <strong>Verifier</strong> {'{'}</p>
              <p className="pl-4">function verifyProof(</p>
              <p className="pl-8">uint[2] a, uint[2][2] b, uint[2] c, uint[] input</p>
              <p className="pl-4">) public view returns (bool);</p>
              <p>{'}'}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 mt-3">
              <div className="rounded bg-white dark:bg-neutral-800 p-2 text-xs text-center">
                <p className="font-semibold">프리컴파일</p>
                <p className="text-muted-foreground">EIP-196/197</p>
              </div>
              <div className="rounded bg-white dark:bg-neutral-800 p-2 text-xs text-center">
                <p className="font-semibold">페어링</p>
                <p className="text-muted-foreground">bn128 페어링 체크</p>
              </div>
              <div className="rounded bg-white dark:bg-neutral-800 p-2 text-xs text-center">
                <p className="font-semibold">가스비</p>
                <p className="text-muted-foreground">~200K per 검증</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">성능 비교</h3>
        <div className="not-prose overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">증명자</th>
                <th className="text-left py-2 px-3">1M 제약 증명 시간</th>
                <th className="text-left py-2 px-3">특징</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prover: 'snarkjs (JS/WASM)', time: '~60초', note: '브라우저 호환, 개발용' },
                { prover: 'rapidSnark (C++)', time: '~5-10초', note: '프로덕션 (Polygon ID, Tornado Cash), x86_64' },
                { prover: 'GPU 증명자', time: '<1초', note: '롤업 사용 (Polygon zkEVM), CUDA 기반' },
              ].map(r => (
                <tr key={r.prover} className="border-b border-border/40">
                  <td className="py-2 px-3 font-medium">{r.prover}</td>
                  <td className="py-2 px-3 font-mono text-xs">{r.time}</td>
                  <td className="py-2 px-3 text-muted-foreground">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">입력 JSON 포맷</h3>
        <div className="not-prose rounded-lg border p-4 text-sm mb-6">
          <div className="bg-sky-50 dark:bg-sky-950/30 rounded p-3 font-mono text-xs space-y-1">
            <p>{'{'}</p>
            <p className="pl-4">"in": [1, 2, 3, 4],</p>
            <p className="pl-4">"leaf": "12345...",</p>
            <p className="pl-4">"path": [...],</p>
            <p className="pl-4">"secret": "67890..."</p>
            <p>{'}'}</p>
          </div>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
            <li>모든 값은 문자열 (BigNumber 지원)</li>
            <li>회로의 시그널 이름과 일치해야 함</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">PLONK vs Groth16</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 mb-6">
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold text-xs text-sky-600 dark:text-sky-400 mb-2">Groth16</p>
            <ul className="space-y-1 text-xs">
              <li>증명: 3 그룹 원소 (~192 bytes)</li>
              <li>검증: 3 페어링</li>
              <li>회로별 셋업 (새 세레모니 필요)</li>
              <li>빠른 증명자 (~1x)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">용도: 고정 회로, 최소 증명 크기</p>
          </div>
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mb-2">PLONK</p>
            <ul className="space-y-1 text-xs">
              <li>증명: 9 그룹 원소 + 6 스칼라 (~768 bytes)</li>
              <li>검증: 2 페어링 + commits</li>
              <li>범용 셋업 (크기 이하 모든 회로에 재사용)</li>
              <li>느린 증명자 (~1.5-2x)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">용도: 잦은 회로 업데이트, 유연성</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">디버깅 워크플로우</h3>
        <div className="not-prose grid gap-2 sm:grid-cols-2 mb-4">
          {[
            { cmd: 'snarkjs r1cs info circuit.r1cs', desc: '제약 수, 시그널 수 확인' },
            { cmd: 'snarkjs r1cs print circuit.r1cs circuit.sym', desc: '시그널 이름 포함 사람이 읽을 수 있는 제약' },
            { cmd: 'snarkjs r1cs export json circuit.r1cs circuit.json', desc: '분석용 JSON 포맷' },
            { cmd: 'snarkjs wtns check circuit.r1cs witness.wtns', desc: '증인이 모든 제약을 만족하는지 검증' },
          ].map(d => (
            <div key={d.cmd} className="rounded-lg border p-3 text-sm">
              <p className="font-mono text-xs font-medium mb-1">{d.cmd}</p>
              <p className="text-xs text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
