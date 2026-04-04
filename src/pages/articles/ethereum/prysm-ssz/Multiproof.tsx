import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Multiproof(_props: Props) {
  return (
    <section id="multiproof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Multiproof & Light Client</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">GeneralizedIndex</h3>
        <p>
          머클 트리의 모든 노드에 <strong>일반화 인덱스</strong>(1부터 BFS 순서)를 부여한다.<br />
          루트=1, 왼쪽 자식=2i, 오른쪽 자식=2i+1.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">단일 필드 증명</h3>
        <p>
          특정 필드의 증명 = 루트까지 경로의 <strong>형제 해시</strong> 목록.<br />
          검증자는 필드 값 + 형제 해시들로 루트를 재구성하여 일치 여부 확인.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Multiproof</h3>
        <p>
          여러 필드를 동시에 증명할 때, 공유 경로의 형제 해시를 중복 제거한다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 라이트 클라이언트 핵심</strong> — 싱크 위원회 서명으로 블록 헤더의 상태 루트를 신뢰<br />
          GeneralizedIndex로 특정 필드(잔고, 슬래싱 등) 증명 요청<br />
          전체 상태 없이 O(log n) 해시만으로 검증 — 모바일·브라우저에서 가능
        </p>
      </div>
    </section>
  );
}
