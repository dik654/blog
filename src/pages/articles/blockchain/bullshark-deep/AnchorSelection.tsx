import { CitationBlock } from '@/components/ui/citation';

export default function AnchorSelection() {
  return (
    <section id="anchor-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">앵커 선택 규칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Spiegelman et al. — Bullshark §4.2" citeKey={2} type="paper">
          <p className="italic">
            "The anchor for wave w is the vertex of the designated leader at round 2w."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">앵커 선택 메커니즘</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">결정론적 선택</p>
            <p className="text-sm">
              anchor(w) = validator[(2w) mod n]<br />
              모든 노드가 동일한 앵커를 독립적으로 계산.<br />
              리더 통신 없이 합의 가능
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">앵커 부재 처리</p>
            <p className="text-sm">
              앵커 검증자가 해당 라운드에 정점을 생성하지 않으면<br />
              해당 웨이브는 스킵.<br />
              다음 웨이브의 앵커가 이전 미커밋 앵커를 포함
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">커밋 투표</p>
            <p className="text-sm">
              다음 웨이브의 홀수 라운드 정점이 앵커를 참조하면 "투표".<br />
              f+1 이상 참조 = 앵커 커밋.<br />
              DAG 구조 자체가 투표 역할
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">체인 커밋</p>
            <p className="text-sm">
              앵커 A가 커밋되면 A의 인과적 히스토리 전체 확정.<br />
              이전 웨이브의 미커밋 앵커도 순서대로 커밋.<br />
              한 번에 여러 웨이브 분량 확정 가능
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
