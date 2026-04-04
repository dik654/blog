import { CitationBlock } from '@/components/ui/citation';

export default function LeaderRotation() {
  return (
    <section id="leader-rotation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">리더 교체의 안전성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Yin et al., PODC 2019 — §4 Safety" citeKey={2} type="paper">
          <p className="italic">
            "The key insight is that HotStuff's view change protocol has the same communication complexity as normal operation — O(n)."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff vs PBFT 리더 교체</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">PBFT View Change</p>
            <p className="text-sm">
              각 노드가 prepared 증거를 전체 브로드캐스트.<br />
              O(n) 증거 x O(n²) 브로드캐스트 = O(n³).<br />
              새 Primary가 모든 증거 검증 후 NEW-VIEW 전송
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">HotStuff View Change</p>
            <p className="text-sm">
              각 노드가 highQC(가장 높은 QC)만 새 리더에게 전송.<br />
              새 리더가 가장 높은 QC 선택 → 제안 시작.<br />
              O(n) 메시지 — 정상 경로와 동일 비용
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Safety 증명 핵심</h3>
        <p>
          Chained HotStuff에서 리더가 교체되어도 Safety가 유지되는 이유:<br />
          QC는 2f+1 노드의 서명이 포함된 암호학적 증거.<br />
          새 리더가 가장 높은 QC를 기반으로 제안하므로,<br />
          이미 commit된 블록과 충돌하는 제안은 불가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">3단계가 필요한 이유</h3>
        <p>
          2단계만으로는 View Change 시 O(n) 유지 불가.<br />
          3단계(Prepare → Pre-Commit → Commit)는<br />
          "투표의 QC"를 한 단계 더 쌓아 리더 교체 안전성 확보.<br />
          HotStuff-2가 이 한계를 돌파하여 2단계를 달성
        </p>
      </div>
    </section>
  );
}
