import TelemetryArchViz from "./viz/TelemetryArchViz";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";

const signals = [
  ["Trace", "한 요청이 모델·tool·hook을 지나간 경로와 parent 관계"],
  ["Metric", "지연 분포, 오류율, token usage처럼 집계 가능한 수치"],
  ["Log", "특정 실패를 조사하기 위한 구조화된 세부 기록"],
  ["Event", "권한 거부, retry, compaction처럼 span 안의 상태 변화"],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Telemetry는 에이전트의 설명이 아니라 실행 증거다
      </h2>
      <ContentBoundary article="claw-telemetry" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          에이전트가 잘못된 결과를 냈을 때 최종 답변만 보면 모델이 잘못
          판단했는지, tool이 timeout됐는지, 권한이 거부됐는지 알 수 없습니다.
          Telemetry는 세션과 turn, model request, tool call에 연결 가능한
          identity를 붙여 실제 실행 경로와 실패 원인을 다시 구성하게 합니다.
        </p>
        <p>
          이 글의 pinned 구현 범위는 commit <code>b71afdd…</code>의 telemetry
          crate와 runtime usage source입니다. OpenTelemetry export, tail sampling,
          bounded queue, redaction과 versioned price reconciliation은 안전한 운영을
          위해 추가로 갖춰야 할 계약이며 pinned source가 모두 구현했다는 뜻은
          아닙니다.
        </p>

        <TelemetryArchViz />

        <div id="paper-claw-telemetry-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code telemetry crate @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/telemetry/src/lib.rs"
            citeKey={1}
            type="code"
          >
            <p>
              <strong>문제:</strong> HTTP attempt·analytics·session trace event를
              공통 sink로 기록합니다. <strong>기여:</strong> pinned source는 typed
              TelemetryEvent, in-memory sink와 append JSONL sink를 제공합니다.
              <strong>전제:</strong> commit·event input·local filesystem을
              고정합니다. <strong>근거 범위:</strong> event schema와 sink의 실제
              source 동작입니다. <strong>일반화 금지:</strong> OTLP exporter,
              bounded asynchronous queue, rotation·redaction·durable flush와
              end-to-end span propagation을 구현했다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          네 signal은 서로 대체하지 않는다
        </h3>
        <p>
          trace는 한 요청의 인과관계를 보여주고 metric은 많은 요청의 분포를 빠르게 관찰하게 합니다. log는 특정 오류의 세부를 담으며 event는 span 안에서 일어난 의미
          있는 변화를 표시합니다. 한 signal에 모든 것을 넣기보다 같은 trace identity로 다시 연결하는 편이 검색과 비용 양쪽에서 유리합니다.
        </p>
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map(([name, description]) => (
            <section key={name} className="rounded-lg border bg-card p-4">
              <code className="text-sm font-semibold text-primary">{name}</code>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </section>
          ))}
        </div>
        <p>
          이름을 제각각 만들기보다 표준 semantic conventions를 기준으로 삼으면
          exporter와 dashboard를 바꾸기 쉽습니다. 현재 OpenTelemetry는 공통
          <a
            href="https://opentelemetry.io/docs/specs/semconv/"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            semantic conventions
          </a>
          과 별도의
          <a
            href="https://github.com/open-telemetry/semantic-conventions-genai"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            GenAI conventions 저장소
          </a>
          를 제공합니다. GenAI 항목은 아직 변할 수 있으므로 사용하는 convention
          버전과 내부 mapping을 한곳에 고정해야 합니다.
        </p>

        <div id="paper-otel-traces" className="scroll-mt-24">
          <CitationBlock
            source="OpenTelemetry specifications"
            href="https://opentelemetry.io/docs/specs/"
            citeKey={2}
            type="paper"
          >
            <p>
              <strong>문제:</strong> 서로 다른 library와 backend에서 trace·metric·log
              의미가 어긋나는 문제를 다룹니다. <strong>기여:</strong> context
              propagation, signal data model, SDK와 exporter의 표준 계약을
              정의합니다. <strong>전제:</strong> 사용하는 specification·semantic
              convention version을 고정해야 합니다. <strong>근거 범위:</strong>
              vendor-neutral observability vocabulary입니다. <strong>일반화 금지:</strong>
              Claw event가 자동으로 표준에 맞고 telemetry가 누락 없이 전달되거나
              민감 정보가 안전하다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          내용 수집은 기본 비활성으로 시작한다
        </h3>
        <p>
          prompt와 model output, tool arguments에는 PII·secret·소스코드가 섞일 수 있습니다. 기본 telemetry가 내용 대신 model
          identity와 duration, token usage, status, 크기만 기록하고 본문 capture를 별도의 opt-in 정책으로 두는 이유입니다. 수집이 필요한
          환경에서도 exporter로 보내기 전에 redaction과 길이 제한을 적용합니다. 원문과 hash를 모두 남기는 식의 우회 수집도 피합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          관측 시스템의 장애를 실행 장애로 키우지 않는다
        </h3>
        <p>
          느린 exporter를 기다리느라 agent loop가 멈추면 telemetry가 서비스 장애를 확대합니다. queue 상한과 batch 크기를 정하고 retry budget과
          drop 우선순위도 미리 잡아 둡니다. 보안 감사 이벤트에는 진행률 이벤트보다 높은 우선순위를 둡니다. drop과 export failure도 metric으로 남겨야 “아무 오류가
          없었다”가 아니라 “관측하지 못했다”는 사실을 구분할 수 있습니다.
        </p>
        <p>
          아래에서는 trace topology와 집계 방식을 먼저 설명하고, 이어서 token
          usage와 비용을 재현 가능한 원장으로 관리하는 방법을 다룹니다. SSE
          framing과 provider별 stream event 해석은 중복하지 않고
          <a href="/ai/claw-api-client"> API client 글</a>로 연결합니다.
        </p>
      </div>
    </section>
  );
}
