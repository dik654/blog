import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function GetHead({ onCodeRef }: Props) {
  return (
    <section id="get-head" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GetHead & 가중치 전파</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("fc-head", codeRefs["fc-head"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            computeHead()
          </span>
        </div>

        {/* ── GetHead 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          GetHead — tie-breaking + proposer boost
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              GetHead 알고리즘
            </div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                <code>justified_checkpoint.Root</code>에서 시작 →{" "}
                <code>justifiedNode</code> 조회
              </li>
              <li>
                <code>head.Children</code> 순회하며 최대 <code>Weight</code>{" "}
                자식 선택
              </li>
              <li>
                동률 시 block root 순서를 사용해 모든 노드가 같은 자식을 고르는
                결정론적 tie-break 적용
              </li>
              <li>
                리프 도달 시 <code>head.Root</code> 반환
              </li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                시간 복잡도
              </div>
              <p className="text-sm">
                BestChild/BestDescendant 캐시를 활용하며, 실제 비용은 갱신된
                vote와 트리의 깊이·분기 수에 좌우된다.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                호출 시점
              </div>
              <ul className="text-sm space-y-1">
                <li>매 slot 시작 (attestation 대상 결정)</li>
                <li>RPC head 쿼리</li>
                <li>
                  Engine API <code>forkchoiceUpdated</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <code>GetHead</code>는 justified checkpoint에서 시작해 viable child 가운데 LMD-GHOST weight가 가장 큰 branch를 반복해서 선택합니다. 더 내려갈 child가 없으면 그 node가 head가 되며, 같은 score에서는 specification이 정한 root ordering으로 모든 client가 같은 tie-break를 적용합니다.
        </p>

        {/* ── Proposer Boost ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Proposer Boost — ex-ante reorg 방어
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <div className="text-xs font-semibold text-red-400 mb-2">
              공격 시나리오 (without boost)
            </div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>slot N proposer가 블록 생성 (시간 내)</li>
              <li>공격자 (다음 proposer)가 다른 fork 생성</li>
              <li>자기 validator들에게 attestation 투표 유도</li>
              <li>공격자 fork가 더 무거워지면 reorg 성공</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              방어 메커니즘
            </div>
            <p className="text-sm">
              현재 슬롯의 정시 블록을 지정된 proposer boost root로 기록한다.
              head 계산에서는 스펙 preset/config의{" "}
              <code>PROPOSER_SCORE_BOOST</code>와 위원회 가중치로 임시 점수를
              계산해 해당 가지에 더한다.
            </p>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">
              고정 숫자가 아닌 설정값
            </div>
            <p className="text-sm">
              정시 판정 구간, 슬롯 길이, 위원회 총 가중치와 boost 비율은
              네트워크 preset과 현재 스펙에서 읽는다. boost는 재조직 비용을
              높이지만 공격을 수학적으로 불가능하게 만들지는 않는다.
            </p>
          </div>
        </div>
        <p>
          <strong>Proposer boost</strong>는 current slot의 timely block에 temporary fork-choice weight를 더해 공격자가 이전 slot의 withheld block으로 honest head를 바꾸는 ex-ante reorg 전략을 어렵게 합니다. Boost는 slot이 지나면 사라지는 fork-choice mitigation이며 justification이나 finality를 대신하지 않습니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 Proposer Boost</strong> — 현재 슬롯에서 정시에 관찰한
          proposer block에 temporary weight를 더합니다. 구체적인 boost score와 timely condition은 현재 consensus specification을 따르고, 같은 final score는 deterministic root ordering으로 해소합니다.
        </p>
      </div>
    </section>
  );
}
