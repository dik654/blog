import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SignalViz from "./viz/SignalViz";

export default function ClientSignals() {
  return (
    <section id="client-signals" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">연결을 맺는 방식만으로도 정체가 드러납니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          클라이언트가 암호화 연결을 시작할 때 보내는 첫 메시지에는 지원하는 암호 목록과 확장 기능, 상위
          프로토콜 협상 정보가 들어 있습니다. 이 조합은 소프트웨어마다 다릅니다. 브라우저와 스크립트 라이브러리는
          같은 사이트에 접속하더라도 이 첫 인사의 모양이 다릅니다.
        </p>

        <p className="leading-7">
          그래서 이 메시지를 해시해 지문으로 쓰는 방법이 자리 잡았습니다. 초기 방식은 확장 순서에 의존해
          무작위화에 약했고, 이후 방식은 순서 의존을 줄이고 상위 프로토콜 협상 정보 같은 차원을 더해 더
          안정적인 지문을 만듭니다.
        </p>

        <p className="leading-7">
          이 신호의 가치는 얻는 시점에 있습니다. 연결이 설정되는 동안 공짜로 도착하므로 스크립트가 돌기 전,
          쿠키가 생기기 전에 이미 알 수 있습니다. 요청 내용을 보기 전에 대략의 분류가 가능하다는 뜻이고, 값싼
          층에서 판단할 재료가 하나 늘어납니다.
        </p>

        <p className="leading-7">
          같은 원리가 상위 프로토콜에도 적용됩니다. 프레임 설정값과 우선순위 표현 방식이 구현마다 달라 또 다른
          지문이 됩니다. 두 지문을 함께 쓰면 "브라우저라고 주장하지만 연결 방식은 스크립트"인 경우가 드러납니다.
        </p>
      </div>

      <SignalViz />

      <h3 id="score-and-action" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        점수로 모으고 임계로 행동을 정합니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          지문 하나로 결론을 내리지는 않습니다. 여러 신호를 모아 하나의 점수로 만들고, 그 점수의 구간에 따라
          통과·확인·차단을 배정합니다. 규칙은 이 점수를 조건으로 쓰기 때문에 운영자는 임계만 조정하면 됩니다.
        </p>

        <p className="leading-7">
          점수화의 이점은 결정을 한곳에 모은다는 것입니다. 신호가 추가되거나 모델이 바뀌어도 규칙은 그대로
          두고 점수 계산만 바꾸면 됩니다. 반대로 단점은 왜 이 점수가 나왔는지가 운영자에게 잘 보이지 않는다는
          점이라, 지문별 관측 이력을 함께 제공하는 기능이 따라붙습니다.
        </p>

        <p className="leading-7">
          허용 목록도 이 층에 있습니다. 검색 엔진 수집기처럼 자동화이지만 막으면 안 되는 클라이언트가 있기
          때문입니다. 이들은 별도로 검증된 목록으로 관리되며, 자칭이 아니라 역방향 조회 같은 확인을 거칩니다.
        </p>
      </div>

      <ExplainedFormula
        question="임계를 어디에 둘지 어떻게 정합니까"
        idea="차단으로 잃는 정상 요청의 비용과 통과로 잃는 방어 효과를 같은 단위로 놓고 총비용이 가장 작은 임계를 고릅니다."
        formula={String.raw`C(\tau) = c_{\text{fp}}\,\mathrm{FP}(\tau) + c_{\text{fn}}\,\mathrm{FN}(\tau)`}
        annotatedFormula={String.raw`C(\tau) = \underbrace{c_{\text{fp}}\,\mathrm{FP}(\tau)}_{\text{정상을 막아 잃는 비용}} + \underbrace{c_{\text{fn}}\,\mathrm{FN}(\tau)}_{\text{공격을 통과시켜 잃는 비용}}`}
        operations={[
          {
            expression: String.raw`\mathrm{FP}(\tau)`,
            annotation: [
              "임계 τ에서 정상 클라이언트가 차단되거나 확인 절차를 받는 비율입니다",
              "이탈률과 문의 건수로 환산할 수 있습니다",
            ],
          },
          {
            expression: String.raw`\mathrm{FN}(\tau)`,
            annotation: "임계 τ에서 자동화 트래픽이 그대로 통과하는 비율입니다",
          },
          {
            expression: String.raw`c_{\text{fp}},\ c_{\text{fn}}`,
            annotation: "각각 한 건의 오탐과 미탐이 조직에 주는 비용이며 서비스 성격에서 정해집니다",
          },
        ]}
        terms={[
          { symbol: String.raw`\tau`, name: "임계", description: "이 값을 기준으로 통과·확인·차단이 갈립니다." },
          { symbol: String.raw`c_{\text{fp}}`, name: "오탐 단가", description: "정상 사용자를 막았을 때의 비용입니다." },
          { symbol: String.raw`c_{\text{fn}}`, name: "미탐 단가", description: "공격을 통과시켰을 때의 비용입니다." },
        ]}
        assumptions={[
          "두 오류의 비용을 같은 단위로 환산할 수 있다고 가정합니다. 환산 자체가 조직의 판단입니다.",
          "임계를 올리거나 내릴 때 두 비율이 반대로 움직인다고 가정합니다.",
        ]}
        interpretation="식이 말하는 것은 최적 임계가 모델 성능이 아니라 두 단가의 비율에서 나온다는 점입니다. 로그인 페이지와 공개 문서 페이지에 같은 임계를 쓰는 것이 잘못된 이유가 여기 있습니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          암호화 연결의 첫 메시지에 무엇이 담기는지는{" "}
          <Link to="/p2p/tls-fundamentals#handshake">TLS 1.3 기초</Link>에서 다룹니다. 이 절은 그 메시지가
          보안 용도 외에 클라이언트 식별에도 쓰인다는 점과, 그로부터 나오는 판단 구조를 정리했습니다.
        </p>
      </div>

      <CitationBlock
        source="Cloudflare — JA4 지문과 요청 간 신호에 대한 공개 기술 문서 (2026-09-11 확인)"
        citeKey={2}
        href="https://blog.cloudflare.com/ja4-signals/"
      >
        암호화 연결 첫 메시지를 해시해 클라이언트 소프트웨어를 구분하고, 그 지문이 규칙과 점수 모델의 입력으로
        쓰이며 연결 설정 중에 비용 없이 얻어진다는 설명은 해당 사업자의 공개 문서입니다. 지문만으로 정체가
        확정된다는 뜻은 아니며 여러 신호를 합친 점수가 실제 판정에 쓰입니다.
      </CitationBlock>
    </section>
  );
}
