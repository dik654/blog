export default function Tipset() {
  return (
    <section id="tipset" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tipset 선택과 Block Finalization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-4 mb-3">Tipset이란</h3>
        <p>
          Tipset은 같은 에폭에서 같은 부모를 공유하는 블록들의 집합입니다.
          Filecoin은 단일 블록 체인이 아닌 Tipset 기반 체인으로,
          한 에폭에 여러 블록이 포함될 수 있어 처리량을 높입니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">부모 Tipset 선정</h3>
        <p>
          체인의 헤드는 가장 무거운(weight가 큰) Tipset으로 결정됩니다.
          Weight는 해당 Tipset까지의 누적 스토리지 파워로 계산되며,
          포크 발생 시 더 무거운 체인이 선택됩니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Tipset 체인 구조:
Epoch N:   [Block A, Block B, Block C]  ← Tipset
              ↑
Epoch N-1: [Block D, Block E]           ← Parent Tipset
              ↑
Epoch N-2: [Block F]                    ← Grandparent`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 확정과 F3</h3>
        <p>
          기존 EC(Expected Consensus)에서는 900 에폭(약 7.5시간) 후에
          블록이 확정되었습니다. F3(Fast Finality) 프로토콜 도입으로
          확정 시간이 크게 단축되었습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`블록 확정 방식:
EC (기존):  900 epoch 대기 (~7.5시간)
F3 (신규):  수 분 내 확정

F3 참여 조건:
- participation lease 획득 필요
- F3 활성화 epoch 이후 참여 가능
- 스마트 컨트랙트로 활성화 시점 관리`}</code>
        </pre>
      </div>
    </section>
  );
}
