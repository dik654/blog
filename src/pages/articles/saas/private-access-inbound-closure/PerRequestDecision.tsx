import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import DecisionViz from "./viz/DecisionViz";

export default function PerRequestDecision() {
  return (
    <section id="per-request-decision" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">어디서 왔는지가 아니라 누가 무엇으로 요청했는지를 봅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞의 두 절은 닿을 수 있는 범위를 좁혔습니다. 남은 절반은 통과 기준입니다. 범위를 아무리 좁혀도 그
          안에서 "내부 주소에서 왔으니 통과"라는 규칙이 남아 있으면, 그 좁은 범위 안에서는 여전히 확인 없이
          움직일 수 있습니다.
        </p>

        <p className="leading-7">
          그래서 판단 근거를 위치에서 요청 자체로 옮기는 설계가 나옵니다. 사내망이라는 특권 구역을 없애고
          내부 애플리케이션을 인터넷 쪽에 두되, 모든 접근을 사용자와 기기를 확인해 요청 단위로 판정하는
          방식입니다. 2014년에 공개된 사례가 이 전환을 처음 정리했습니다.
        </p>

        <p className="leading-7">
          판정에 들어가는 것은 신원만이 아닙니다. 어떤 기기로 요청했는지, 그 기기가 관리 대상인지, 최근 상태
          점검을 통과했는지가 함께 들어갑니다. 같은 사람이라도 관리되지 않는 기기로 접근하면 다른 결과가
          나옵니다.
        </p>

        <p className="leading-7">
          이 구조에서 사설망 접속은 필수 단계가 아니라 하나의 신호로 내려갑니다. 접속 여부가 권한을 주지 않고,
          판정에 참고되는 여러 항목 중 하나가 됩니다. 그 결과 접속하지 않은 상태에서도 조건을 만족하면 쓸 수
          있고, 접속한 상태여도 조건이 나쁘면 거절됩니다.
        </p>
      </div>

      <DecisionViz />

      <CitationBlock
        source="Ward · Beyer — BeyondCorp: A New Approach to Enterprise Security (;login: 39(6), 2014)"
        citeKey={3}
        href="https://research.google/pubs/beyondcorp-a-new-approach-to-enterprise-security/"
      >
        특권적인 사내망을 없애고 사내 애플리케이션을 인터넷 쪽으로 옮기며, 접근 판정을 네트워크 위치가 아니라
        사용자와 기기 확인으로 대체한다는 방향을 제시한 문헌입니다. 조직 규모와 기기 관리 체계가 갖춰진 환경을
        전제로 한 사례이므로, 여기서 제시된 구성 요소가 모든 조직에 그대로 옮겨진다는 뜻은 아닙니다.
      </CitationBlock>

      <h3 id="credential-lifetime" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        수명이 짧아야 철회가 실제로 작동합니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          요청마다 판정한다는 말은 판정 결과가 오래 남지 않는다는 뜻이기도 합니다. 한 번 통과한 뒤 몇 달 동안
          유효한 자격 증명을 주면, 기기 상태가 나빠지거나 사람이 퇴사해도 그 증명은 계속 통과합니다. 판정
          자체를 아무리 정교하게 만들어도 결과가 오래 살면 의미가 줄어듭니다.
        </p>

        <p className="leading-7">
          그래서 이 구조는 짧은 수명을 기본값으로 둡니다. 자격 증명이 몇 시간 단위로 만료되고, 계속 쓰려면 다시
          판정을 받습니다. 철회가 필요할 때 모든 곳에 취소를 전파하는 대신 다음 갱신을 거절하기만 하면 되므로
          운영이 단순해집니다.
        </p>

        <p className="leading-7">
          비용은 갱신 경로가 가용성의 일부가 된다는 점입니다. 판정 지점이 멈추면 새 요청이 통과하지 못하고,
          수명이 짧을수록 그 영향이 빨리 도달합니다. 앞 글에서 다룬 감지와 이동의 시간이 여기서도 그대로
          문제가 됩니다.
        </p>

        <p className="leading-7">
          자격 증명의 발급·변경·폐기를 사람의 입·이동·퇴사 사건과 맞춰 관리하는 절차 자체는{" "}
          <Link to="/isms-aml/isms-auth-management#account-lifecycle">계정·인증 관리</Link>가 소유합니다. 이
          절은 그 수명이 접근 구조의 성질을 어떻게 바꾸는지만 다뤘습니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="판정 지점이 새 단일 지점 아닙니까"
          preview="맞습니다. 다만 비교 대상은 무결점 상태가 아니라 이전 구조이며, 이전에도 사설망 게이트웨이라는 단일 지점이 있었습니다."
        >
          <p className="leading-7">
            요청마다 판정하는 구조에서는 판정 지점이 멈추면 새 접근이 전부 막힙니다. 이 사실만 보면 위험이
            커진 것처럼 읽히지만, 이전 구조에도 사설망 접속 장치라는 동일한 성격의 지점이 있었고 그쪽이 멈추면
            역시 아무도 들어오지 못했습니다.
          </p>
          <p className="leading-7">
            달라진 것은 그 지점이 고장 났을 때의 실패 방향입니다. 사설망 게이트웨이는 멈추면 닫히지만, 이미
            접속한 세션은 한동안 살아 있어 내부에서 계속 움직일 수 있었습니다. 판정 지점은 멈추면 새 판정이
            없으니 짧은 수명과 결합해 더 빨리 전부 닫힙니다.
          </p>
          <p className="leading-7">
            그래서 이 구조에서는 판정 지점의 중복 구성과 감지 시간이 보안 항목이 아니라 가용성 항목으로
            관리됩니다. 무엇을 단일 지점으로 둘지 고르는 문제이지 단일 지점을 없애는 문제가 아닙니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
