export default function PowToPos() {
  return (
    <section id="pow-to-pos" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PoW에서 PoS 전환과 Peer Slots</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-4 mb-3">PoW 시대: 블록 기반 동기화</h3>
        <p>
          PoW 시대에는 블록 번호로 포크 시점을 지정했습니다. Difficulty Bomb으로
          채굴 난이도를 점진적으로 증가시켜 PoS 전환을 강제했으며,
          Muir Glacier, Arrow Glacier, Gray Glacier 등의 포크로 이를 연기했습니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">The Merge와 타임스탬프 전환</h3>
        <p>
          The Merge(블록 17,034,870) 이후 PoS로 전환되면서 블록 타임이 약 12초로
          고정되었습니다. 이에 따라 포크 시점 지정 방식이 블록 번호에서
          타임스탬프 기반으로 변경되었고, Fork ID 계산도 이를 반영합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`PoW: 블록 번호로 포크 지정 (가변 블록 타임)
  예: Homestead = 블록 1,150,000

PoS: 타임스탬프로 포크 지정 (고정 12초 블록 타임)
  예: Shanghai = 타임스탬프 1681338455`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Peer Slot과 Fork-ID 필터링</h3>
        <p>
          각 노드는 최대 50~100개의 피어 슬롯을 유지합니다.
          Fork-ID로 비호환 피어를 조기 필터링하여 슬롯 낭비를 방지합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Fork-ID 적용 시:
├─ 호환 피어 40개 연결
├─ 비호환 피어 0개 (필터됨)
└─ 남은 슬롯 10개

Fork-ID 없이:
├─ 호환 피어 30개 연결
├─ 비호환 피어 15개 (슬롯 낭비)
└─ 남은 슬롯 5개`}</code>
        </pre>
      </div>
    </section>
  );
}
