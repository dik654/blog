export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin 증명 시스템 & GPU 가속 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin의 저장 증명 시스템은 <strong>PoRep</strong>(Proof of Replication)과
          <strong> PoSt</strong>(Proof of Spacetime)로 구성됩니다.
          이 증명 생성 과정에서 <strong>GPU 가속</strong>은 필수적이며,
          특히 PC2(Groth16 MSM/NTT)와 C2(Groth16 증명 생성) 단계가 핵심입니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">섹터 봉인 파이프라인</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Filecoin 섹터 봉인(Sealing) 파이프라인:

┌─────────────────────────────────────────────────────┐
│ AddPiece — 클라이언트 데이터를 섹터에 패킹            │
│ → CPU 바운드, I/O 중심                               │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ PreCommit Phase 1 (PC1) — SDR 인코딩                 │
│ → CPU 집약적: SHA-256 해시 체인 (11 레이어)           │
│ → 순차적 의존성 → GPU 가속 불가 (의도적 설계)         │
│ → 32GB 섹터: ~3시간 (고성능 CPU)                     │
│ → 병렬화: 코어 수만큼 레이어 동시 처리 가능            │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ PreCommit Phase 2 (PC2) — Merkle Tree 구축           │
│ → ★ GPU 가속 핵심: Poseidon 해시로 Column Hash Tree  │
│ → 32GB 섹터의 Merkle 트리 구축                       │
│ → GPU: ~10분 / CPU: ~수 시간                         │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ WaitSeed — 체인에서 랜덤 시드 대기 (150 에포크)       │
│ → ~75분 대기 (인터랙티브 PoRep 보안)                  │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ Commit Phase 1 (C1) — 도전-응답 준비                  │
│ → CPU: Merkle 증명 경로 추출                          │
│ → 상대적으로 빠름 (~수 분)                             │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ Commit Phase 2 (C2) — Groth16 zk-SNARK 증명 생성     │
│ → ★ GPU 가속 핵심: MSM + NTT on GPU                  │
│ → bellperson 라이브러리 사용                           │
│ → GPU: ~10분 / CPU: ~수 시간                         │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ SubmitProof — 증명을 체인에 제출                      │
│ → 온체인 검증 (Groth16 Verifier)                     │
└─────────────────────────────────────────────────────┘

GPU가 필수인 단계: PC2 (Poseidon Merkle), C2 (Groth16)
CPU만 사용하는 단계: PC1 (SDR), C1 (Merkle 경로)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 하드웨어 요구사항</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">단계</th>
                <th className="border border-border px-4 py-2 text-left">연산</th>
                <th className="border border-border px-4 py-2 text-left">GPU VRAM</th>
                <th className="border border-border px-4 py-2 text-left">권장 GPU</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">PC2</td>
                <td className="border border-border px-4 py-2">Poseidon 해시 (Merkle Tree)</td>
                <td className="border border-border px-4 py-2">{'>'}8GB</td>
                <td className="border border-border px-4 py-2">RTX 3080+, A100</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">C2</td>
                <td className="border border-border px-4 py-2">Groth16 (MSM + NTT)</td>
                <td className="border border-border px-4 py-2">{'>'}11GB</td>
                <td className="border border-border px-4 py-2">RTX 3090, A100</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">WindowPoSt</td>
                <td className="border border-border px-4 py-2">Groth16 (증명 갱신)</td>
                <td className="border border-border px-4 py-2">{'>'}8GB</td>
                <td className="border border-border px-4 py-2">RTX 3080+</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">WinningPoSt</td>
                <td className="border border-border px-4 py-2">Groth16 (블록 생성)</td>
                <td className="border border-border px-4 py-2">{'>'}6GB</td>
                <td className="border border-border px-4 py-2">RTX 3070+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
