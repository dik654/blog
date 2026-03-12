export default function Sortition() {
  return (
    <section id="sortition" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Poisson Sortition</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin은 블록 생성자 선출에 <strong>Poisson Sortition</strong>을 사용합니다.
          각 에폭(epoch)마다 여러 마이너가 동시에 블록을 생성할 수 있으며,
          선출 확률은 마이너의 스토리지 파워에 비례합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">티켓 생성과 검증</h3>
        <p>
          마이너는 VRF(Verifiable Random Function)를 사용하여 티켓을 생성합니다.
          티켓 값이 임계값보다 작으면 해당 에폭의 블록 생성 권한을 획득합니다.
          이 과정은 포아송 분포를 따르므로 한 에폭에 0개, 1개, 또는 여러 개의
          블록이 생성될 수 있습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Poisson Sortition 과정:
1. 마이너가 VRF로 랜덤 티켓 생성
2. 티켓 값과 임계값 비교
3. 임계값 = f(마이너 파워 / 전체 네트워크 파워)
4. 포아송 분포: P(k) = (λ^k * e^-λ) / k!
   - λ = 기대 블록 수 (Filecoin에서 약 5)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">WinCount</h3>
        <p>
          한 마이너가 하나의 에폭에서 여러 번 당선될 수 있습니다(WinCount &gt; 1).
          WinCount가 높을수록 더 많은 보상을 받으며, 이는 스토리지 파워가 큰
          마이너에게 공정한 보상을 보장합니다.
        </p>
      </div>
    </section>
  );
}
