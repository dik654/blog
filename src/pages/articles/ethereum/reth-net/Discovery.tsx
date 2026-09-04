import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const LOOKUP = [
  ["seed", "Bootnode·DNS·local table에서 시작 후보를 고릅니다."],
  ["query", "Target과 가까운 record를 제한된 병렬도로 요청합니다."],
  [
    "verify",
    "Identity/signature·sequence·expiry·endpoint policy를 검사합니다.",
  ],
  [
    "promote",
    "Fresh candidate만 dial queue에 넣고 실제 session 결과를 feedback합니다.",
  ],
] as const;

export default function Discovery({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="discovery" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Discovery는 trusted peer를 찾는 것이 아니라 fresh dial candidate를
        유지한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Bootnode는 첫 접점이지 중앙 신뢰 기관이 아닙니다. discovery record의 서명은 record가 해당 node key에서 왔음을 보일 뿐입니다. endpoint가
          지금 reachable하다거나 peer가 honest하다는 뜻은 아닙니다. Sequence가 더 최신인지, address family와 port가 local policy에 맞는지,
          최근 liveness가 있는지를 확인해도 결과는 active peer가 아니라 dial 후보에 머뭅니다.
        </p>
      </div>

      <ol className="not-prose my-8 grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {LOOKUP.map(([title, body], index) => (
          <li key={title} className="min-w-0 border-t border-border pt-4">
            <p className="font-mono text-[11px] font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm font-bold">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </li>
        ))}
      </ol>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Stale·Sybil·eclipse input을 서로 다른 축에서 제한합니다</h3>
        <p>
          Stale record는 sequence·age와 failed dial history로 줄입니다. 한 IP prefix·ASN·identity cluster가 table과
          outbound slot을 독점하지 않도록 diversity와 rate limit을 둡니다. 그러나 diversity heuristic이 Sybil resistance를 증명하지는
          않으며 trusted/static peer도 identity·protocol handshake와 message validation을 생략할 권한은 없습니다. Discovery
          result와 session behavior score를 분리해 한 번의 transient timeout을 영구 ban으로 확대하지 않습니다.
        </p>
        <h3>Release test는 deterministic candidate fixture에서 시작합니다</h3>
        <p>
          Base와 candidate에 같은 signed records·DNS answers·random seed·clock과
          network fault schedule을 주고 stale sequence, invalid signature,
          duplicate identity, unreachable endpoint, identity mismatch, no shared
          capability, wrong genesis, message flood, channel saturation과
          restart를 주입합니다. Candidate→pending→active count, reason-coded
          close, slot·buffer 회수와 accepted message trace가 일치한 뒤 lookup
          rate·connection latency·CPU·memory를 비교합니다.
          <CodeViewButton
            onClick={() =>
              onCodeRef("net-discovery", codeRefs["net-discovery"])
            }
          />
        </p>
      </div>

      <div
        id="paper-devp2p-discv5"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 규격 읽기 · discovery threat model
        </p>
        <p className="mt-2 text-sm font-semibold">Ethereum Node Discovery v5</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 중앙 peer 목록 없이 signed node record를 찾고 갱신하는 것입니다. 규격이 담은 것은 discovery session·lookup·record
          semantics까지입니다. application protocol compatibility와 peer honesty, eclipse-free topology는 자동으로 따라오지
          않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/ethereum/devp2p/blob/master/discv5/discv5-theory.md"
          target="_blank"
          rel="noreferrer"
        >
          Discv5 규격 보기
        </a>
      </div>
    </section>
  );
}
