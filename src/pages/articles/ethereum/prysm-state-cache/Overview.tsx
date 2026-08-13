import ContextViz from "./viz/ContextViz";
import StateCacheViz from "./viz/StateCacheViz";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">State cache는 root·slot 조회를 hot·replay·archive 경로로 나눈다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          BeaconState는 합의 검증의 현재 문맥이다. 블록 처리와 fork choice는
          최근 상태를 반복해서 사용하지만, 과거 모든 슬롯의 전체 상태를 메모리에
          두거나 같은 밀도로 DB에 보존하는 것은 지속 가능하지 않다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          문제 — 같은 상태를 빠르게 읽되 중복 보존은 줄여야 한다
        </h3>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-xs">
          <div className="rounded-lg border bg-card p-3">
            <strong>tip</strong>
            <p className="text-muted-foreground mt-1">새 블록과 슬롯 전이</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>fork choice</strong>
            <p className="text-muted-foreground mt-1">여러 후보 root 조회</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>checkpoint</strong>
            <p className="text-muted-foreground mt-1">정당화·확정 경계</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>historical</strong>
            <p className="text-muted-foreground mt-1">RPC·복구 요청</p>
          </div>
        </div>
        <p className="leading-7">
          이 네 경로의 접근 빈도와 보존 기간이 다르므로 “최근 N개를 캐시한다”는
          규칙 하나로는 충분하지 않다. 캐시 hit·DB hit·재생 비용을 분리해
          관찰해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          아이디어 — cache·anchor·summary·replay의 계층
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Hot cache</h4>
            <p className="text-xs text-muted-foreground">
              최근 처리에서 반복되는 상태를 root 기반으로 재사용하고
              finality·메모리 정책에 따라 퇴출한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Stored anchor</h4>
            <p className="text-xs text-muted-foreground">
              직접 보존한 상태는 historical 요청을 재구성하는 시작점이 된다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">State summary</h4>
            <p className="text-xs text-muted-foreground">
              전체 상태 대신 slot·root 연결 정보를 남겨 적절한 anchor와 블록
              구간을 찾는다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Replay</h4>
            <p className="text-xs text-muted-foreground">
              anchor 이후의 빈 슬롯과 블록 전이를 순서대로 적용해 목표 상태를
              재구성한다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">구현을 읽는 순서</h3>
        <ol>
          <li>요청이 root인지 slot인지 식별하고 필요한 메타데이터를 찾는다.</li>
          <li>메모리 캐시와 직접 저장 상태를 확인한다.</li>
          <li>없다면 가까운 anchor와 적용할 블록·빈 슬롯 구간을 결정한다.</li>
          <li>
            재생 결과를 호출자에게 독립적인 상태로 반환하고 필요하면 캐시에
            승격한다.
          </li>
        </ol>
        <CitationBlock
          {...OFFICIAL_SOURCES.prysm.repository}
          citeKey={1}
          type="code"
        >
          내부 cache 이름·용량·보존 간격은 릴리스와 설정에 따라 달라질 수 있다.
          이 글은 현재 소스에서 확인 가능한 책임 경계를 중심으로 설명하고 고정
          성능 수치는 사용하지 않는다.
        </CitationBlock>
      </div>
      <div className="not-prose mt-6">
        <StateCacheViz />
      </div>
    </section>
  );
}
