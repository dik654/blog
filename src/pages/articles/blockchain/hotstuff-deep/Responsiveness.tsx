import { CitationBlock } from '@/components/ui/citation';

export default function Responsiveness() {
  return (
    <section id="responsiveness" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">응답성 (Responsiveness)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Yin et al., PODC 2019 — §6" citeKey={3} type="paper">
          <p className="italic">
            "A protocol is responsive if the leader can make progress as soon as it receives messages from a quorum of replicas, without waiting for a known upper bound on network delay."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">응답성이란?</h3>
        <p>
          프로토콜 진행 속도가 실제 네트워크 지연에 비례.<br />
          고정 타임아웃을 기다리지 않고, 2f+1 응답 도착 즉시 진행.<br />
          네트워크가 빠르면 합의도 빠름
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff의 응답성 한계</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">정상 경로: 응답적</p>
            <p className="text-sm">
              리더가 2f+1 투표를 받으면 즉시 다음 단계 진행.<br />
              타임아웃 대기 없음
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">View Change: 비응답적</p>
            <p className="text-sm">
              리더 장애 감지에 타임아웃 필요.<br />
              이 타임아웃이 실제 네트워크 지연보다 클 수 있음
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">후속 프로토콜의 개선</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Jolteon</p>
            <p className="text-sm">
              정상 경로에서 낙관적 응답성 추가.<br />
              2단계 fast path + 3단계 slow path
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">HotStuff-2</p>
            <p className="text-sm">
              3단계를 2단계로 축소하면서 응답성 유지.<br />
              View Change에서도 최적 지연 달성
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
