import ContextViz from "./viz/ContextViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">
        lotus-miner snapshot에서 Curio의 작업 모델로
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        번들 code는 단일 lotus-miner와 lotus-worker가 sector FSM·PoSt·block
        production을 관리하던 역사적 구조다. 현재 provider architecture는
        Curio로 이행 중이며, 여러 node가 database-backed task를 공유하는
        high-availability 경계를 중심으로 본다.
      </p>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">
              Chain-triggered tasks
            </h3>
            <p className="text-sm text-muted-foreground">
              head·deadline·randomness·message state가 sealing, PoSt, message
              submission의 시작 조건을 만든다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Shared durable queue</h3>
            <p className="text-sm text-muted-foreground">
              task lease, retry, priority와 result를 HarmonyDB에 기록해 process
              장애와 여러 miner ID를 견딘다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Stateless workers</h3>
            <p className="text-sm text-muted-foreground">
              CPU·GPU·storage capability에 맞는 node가 task를 가져가며
              dealmaking은 Boost 같은 별도 서비스가 맡는다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          특정 CPU·GPU·RAM·NVMe 조합과 초기 비용을 architecture의 정답으로
          고정하지 않는다. capacity는 sector size, concurrent sealing jobs,
          WindowPoSt partition, deadline tail latency와 redundancy 목표로
          계산한다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          현재 설계 방향은{" "}
          <a
            href="https://docs.curiostorage.org/"
            target="_blank"
            rel="noreferrer"
          >
            Curio 공식 문서
          </a>
          를 기준으로 보고, lotus-miner code는 state-machine evolution을
          비교하는 자료로만 사용한다.
        </p>
      </div>
    </section>
  );
}
