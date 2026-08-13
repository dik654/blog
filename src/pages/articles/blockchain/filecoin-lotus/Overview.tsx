import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const COMPONENTS = [
  {
    name: "lotus daemon",
    role: "체인 노드",
    description:
      "P2P 네트워크에서 블록과 메시지를 동기화하고, 체인 상태·지갑·JSON-RPC API를 제공합니다.",
  },
  {
    name: "lotus-miner",
    role: "스토리지 제공자 조정자",
    description:
      "sector와 저장 경로를 관리하고 sealing·증명 작업을 worker에 배치합니다.",
  },
  {
    name: "lotus-worker",
    role: "무거운 작업 실행자",
    description:
      "sealing과 proof 계산을 수행합니다. 여러 worker를 붙여 계산과 저장 장치를 확장할 수 있습니다.",
  },
  {
    name: "Boost",
    role: "deal 입구",
    description:
      "client의 저장 요청을 받고 deal을 관리합니다. 현재 제공자 구성에서는 Lotus와 구분해 보는 편이 정확합니다.",
  },
] as const;

const BOUNDARIES = [
  {
    index: "01",
    title: "체인을 따라간다",
    owner: "lotus daemon",
    description:
      "tipset과 message를 검증·동기화하고 FVM 실행 결과로 같은 chain state를 재현합니다.",
    codeKey: "lotus-chainstore",
    codeLabel: "ChainStore 코드 보기",
  },
  {
    index: "02",
    title: "저장 작업을 계획한다",
    owner: "Boost + lotus-miner",
    description:
      "deal의 piece를 sector 작업으로 바꾸고, 저장 경로와 worker 자원을 고려해 작업을 배치합니다.",
  },
  {
    index: "03",
    title: "저장을 증명한다",
    owner: "lotus-worker + proof stack",
    description:
      "PoRep로 sector가 고유하게 봉인됐음을 만들고, 이후 PoSt로 계속 보관 중임을 증명합니다.",
  },
  {
    index: "04",
    title: "체인 상태로 확정한다",
    owner: "FVM actors + consensus",
    description:
      "증명과 provider message가 actor state를 바꾸고, Expected Consensus와 F3가 선택·finality의 서로 다른 역할을 맡습니다.",
    codeKey: "lotus-filecoin-ec",
    codeLabel: "합의 코드 보기",
  },
] as const;

export default function Overview({
  onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>Lotus를 하나의 프로그램으로 보면 헷갈린다</h2>
        <p className="lead">
          Lotus는 Go로 작성된 Filecoin 참조 구현이지만, 실제 운영 단위는 한
          프로세스가 아닙니다. 체인을 따라가는 노드, 저장 작업을 조정하는
          프로세스, 무거운 증명 계산을 수행하는 worker, deal을 받는 입구가 서로
          다른 책임을 가집니다.
        </p>
        <p>
          따라서 이 글은 패키지 목록부터 외우지 않습니다. 먼저
          <strong>
            {" "}
            누가 체인을 관리하고, 누가 파일을 sector로 만들며, 어떤 결과가
            on-chain state가 되는지
          </strong>
          를 분리합니다. 그 경계를 잡으면 뒤의 ChainStore, StateManager,
          Expected Consensus 코드를 어디에 놓아야 하는지 자연스럽게 보입니다.
        </p>
      </div>

      <div className="not-prose my-8 overflow-hidden rounded-2xl border bg-card/60">
        <div className="border-b bg-muted/30 px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Process boundary
          </p>
          <h3 className="mt-1 text-lg font-semibold">
            현재 Lotus 제공자 스택의 역할
          </h3>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2">
          {COMPONENTS.map((component) => (
            <article
              key={component.name}
              className="min-w-0 bg-background p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <code className="break-all text-sm font-semibold text-primary">
                  {component.name}
                </code>
                <span className="text-xs font-medium text-muted-foreground">
                  {component.role}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {component.description}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>프로세스와 프로토콜을 연결하는 네 경계</h3>
        <p>
          위 네 프로그램은 아래 흐름에서 만납니다. 화살표 하나로 뭉개기보다, 각
          단계의 소유자와 산출물을 따로 보면 장애를 추적할 때도 유리합니다.
        </p>
      </div>

      <ol className="not-prose my-8 space-y-3">
        {BOUNDARIES.map((boundary) => (
          <li
            key={boundary.index}
            className="grid min-w-0 gap-3 rounded-2xl border bg-card p-4 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:p-5"
          >
            <span className="font-mono text-sm font-semibold text-primary">
              {boundary.index}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h4 className="font-semibold">{boundary.title}</h4>
                <span className="text-xs text-muted-foreground">
                  {boundary.owner}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {boundary.description}
              </p>
              {"codeKey" in boundary && boundary.codeKey && onCodeRef ? (
                <button
                  type="button"
                  onClick={() =>
                    onCodeRef(boundary.codeKey, codeRefs[boundary.codeKey])
                  }
                  className="mt-3 inline-flex min-h-9 items-center rounded-lg border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {boundary.codeLabel} →
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>이 글에서 구분해 읽어야 할 세 가지</h3>
        <ul>
          <li>
            <strong>chain selection과 finality는 같은 말이 아닙니다.</strong>{" "}
            Expected Consensus는 어느 tipset chain을 따라갈지 정하고, F3는 그
            결과에 더 빠른 finality를 제공합니다.
          </li>
          <li>
            <strong>
              FVM과 built-in actors는 저장 파일 자체를 보관하지 않습니다.
            </strong>{" "}
            체인 위에는 message 실행 결과, provider power, deal·sector와 proof에
            관한 검증 가능한 상태가 남습니다.
          </li>
          <li>
            <strong>
              Lotus와 deal/retrieval 제품 전체를 동일시하면 안 됩니다.
            </strong>{" "}
            Lotus가 체인과 provider 작업의 핵심을 맡더라도, deal 입구 같은 제품
            경계는 별도 구성요소로 발전했습니다.
          </li>
        </ul>

        <h3>이후 글을 읽는 순서</h3>
        <p>
          먼저 <strong>Consensus &amp; Proofs</strong>에서 EC·PoRep·PoSt의
          역할을 나누고, <strong>Chain Store &amp; State</strong>에서 tipset과
          actor state가 저장·실행되는 경로를 봅니다. 마지막으로{" "}
          <strong>Block Creation</strong>에서 message 선택부터 header 조립까지를
          코드와 연결합니다. sealing의 세부 단계는 그 문맥 안에서 한 번만
          설명합니다.
        </p>
      </div>
    </section>
  );
}
