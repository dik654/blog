import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function KvSchema({ onCodeRef: _ }: Props) {
  return (
    <section id="kv-schema" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KV 버킷 스키마</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BoltDB는 버킷(bucket)으로 네임스페이스를 분리한다.<br />
          각 버킷은 독립된 B+Tree이며, 키는 바이트 배열이다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">주요 버킷</h3>
        <ul>
          <li><code>blocksBucket</code> — root → SSZ(SignedBeaconBlock)</li>
          <li><code>stateBucket</code> — root → SSZ(BeaconState)</li>
          <li><code>validatorsBucket</code> — pubkey → 검증자 인덱스</li>
          <li><code>proposerSlashingsBucket</code> — 제안자 슬래싱 증거</li>
          <li><code>attesterSlashingsBucket</code> — 증인자 슬래싱 증거</li>
          <li><code>stateSummaryBucket</code> — root → StateSummary</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 인덱스 버킷 설계</strong> — blockSlotIndicesBucket은 슬롯→블록 루트 매핑을 저장<br />
          슬롯 번호로 블록을 빠르게 찾는 보조 인덱스<br />
          B+Tree 키 순서 스캔으로 범위 조회가 O(log N + K)
        </p>
      </div>
    </section>
  );
}
