import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import ChainStoreViz from "./viz/ChainStoreViz";
import StateMgrViz from "./viz/StateMgrViz";

const DATA_BOUNDARIES = [
  {
    title: "Chain data",
    description:
      "block header, message, tipset처럼 어떤 chain이 관측됐는지 재구성하는 데이터입니다.",
  },
  {
    title: "State data",
    description:
      "message 실행 뒤 actor state와 receipt가 가리키는 content-addressed object입니다.",
  },
  {
    title: "Execution",
    description:
      "부모 state에서 tipset message를 실행해 다음 state root를 계산하는 과정입니다.",
  },
] as const;

export default function ChainStore({
  onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="chainstore" className="mb-16 scroll-mt-20">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>ChainStore는 저장하고, StateManager는 계산한다</h2>
        <p>
          두 이름은 함께 등장하지만 책임은 다릅니다. ChainStore는 block과
          tipset을 찾고 현재 head 변화를 관리하는 데이터 접근점입니다.
          StateManager는 특정 tipset을 기준으로 state를 계산·조회하고 network
          upgrade의 migration 경계를 다룹니다.
        </p>
      </div>

      <div className="not-prose my-8 grid gap-3 md:grid-cols-3">
        {DATA_BOUNDARIES.map((boundary, index) => (
          <article
            key={boundary.title}
            className="min-w-0 rounded-2xl border bg-card p-5"
          >
            <span className="font-mono text-xs font-semibold text-primary">
              0{index + 1}
            </span>
            <h3 className="mt-3 font-semibold">{boundary.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {boundary.description}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>ChainStore: tipset과 head 변화의 소유자</h3>
        <p>
          코드에서 먼저 볼 것은 blockstore 필드, tipset·message 캐시, heaviest
          tipset, reorg 알림입니다. cache 크기나 backing database는 운영 구성과
          버전에 따라 달라질 수 있지만,{" "}
          <strong>content를 찾고 canonical head 변화를 알린다</strong>는 책임은
          유지됩니다.
        </p>
      </div>
      <ChainStoreViz onOpenCode={openCode} />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>StateManager: tipset을 실행 가능한 상태 문맥으로 바꾼다</h3>
        <p>
          StateManager는 ChainStore에서 부모와 message를 읽고 executor에 tipset
          실행을 위임합니다. network version에 맞는 규칙·migration을 선택하고,
          반복 계산을 줄이기 위한 cache도 관리합니다. cache hit rate 같은 수치는
          고정된 프로토콜 특성이 아니라 workload와 구현 설정의 결과입니다.
        </p>
      </div>
      <StateMgrViz onOpenCode={openCode} />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>새 tipset이 들어왔을 때의 경계</h3>
      </div>
      <ol className="not-prose my-8 grid gap-3">
        {[
          [
            "Receive",
            "peer에서 block과 message를 받아 tipset 후보를 구성합니다.",
          ],
          [
            "Persist",
            "ChainStore가 content-addressed data를 저장하고 부모를 찾습니다.",
          ],
          [
            "Execute",
            "StateManager가 부모 state에서 message를 순서대로 실행합니다.",
          ],
          [
            "Compare",
            "계산된 state root·receipt와 block header의 약속을 대조합니다.",
          ],
          [
            "Adopt",
            "유효성과 chain weight 조건을 만족하면 head 변경을 알립니다.",
          ],
        ].map(([title, description], index) => (
          <li
            key={title}
            className="grid min-w-0 gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:p-5"
          >
            <span className="font-mono text-xs font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h4 className="font-semibold">{title}</h4>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>운영 수치와 프로토콜 사실을 분리한다</h3>
        <p>
          disk 사용량, state 계산 시간, cache 효율은 node mode·snapshot·pruning
          정책과 hardware에 따라 달라집니다. 이 글에서는 그런 값을 아키텍처의
          고정 사실처럼 적지 않습니다. 장애 분석에서는 먼저
          <strong> 데이터 부재인지, 실행 불일치인지, head 변경인지</strong>를
          구분하고 그다음 실제 node metric을 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
