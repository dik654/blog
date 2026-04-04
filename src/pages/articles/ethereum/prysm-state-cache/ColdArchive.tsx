import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ColdArchive({ onCodeRef: _ }: Props) {
  return (
    <section id="cold-archive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cold State 아카이브</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Finalized된 에폭의 상태는 Hot 캐시에서 제거되고 Cold 영역으로 이동한다.<br />
          Cold 상태는 매 <strong>K 슬롯</strong>마다 DB에 저장된다 (기본 K = 2048).
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Hot → Cold 전환</h3>
        <ul>
          <li><strong>트리거</strong> — Finalized 체크포인트 갱신 시</li>
          <li><strong>대상</strong> — 이전 Finalized 에폭까지의 Hot 상태</li>
          <li><strong>저장</strong> — K 슬롯 간격으로 선택적 저장</li>
          <li><strong>정리</strong> — 나머지 상태는 Hot 캐시에서 삭제</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 K값과 재생 비용</strong> — K=2048이면 최대 2047슬롯(~6.8시간)을 재생해야 함<br />
          자주 조회되는 인프라는 K값을 줄이거나 아카이벌 모드를 사용<br />
          K값이 작을수록 디스크 사용량은 늘지만 조회 속도는 향상
        </p>
      </div>
    </section>
  );
}
