import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import EndpointViz from "./viz/EndpointViz";

export default function ServiceGap() {
  return (
    <section id="service-abstraction-gap" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">기본 서비스 추상에는 모델 서버의 상태가 들어갈 자리가 없습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          쿠버네티스에서 같은 일을 하는 파드 여러 개 앞에 두는 것은 서비스입니다. 서비스는 준비 상태인 파드 목록을 들고 있다가 들어온 연결을 그중 하나로 보냅니다. 고르는 기준은 연결
          수준의 단순한 규칙이고 그 파드가 지금 무엇을 하고 있는지는 보지 않습니다.
        </p>

        <p className="leading-7">
          웹 요청에서는 이 단순함이 문제가 되지 않습니다. 요청 하나의 처리 시간이 대체로 비슷해서 요청 수를 고르게 나누면 부하도 고르게 나뉩니다. 추론 요청은 다릅니다. 입력 길이와
          출력 길이에 따라 한 요청의 비용이 수십 배씩 차이 나므로 요청 수를 고르게 나눠도 부하는 고르지 않습니다.
        </p>

        <p className="leading-7">
          게다가 모델 서버에는 상태가 있습니다. 방금 처리한 요청의 캐시가 남아 있어서 같은 앞부분을 공유하는 다음 요청은 그 서버에서 훨씬 싸게 끝납니다. 연결 수준에서 고르는 규칙은 이
          사실을 알 수 없습니다.
        </p>

        <p className="leading-7">
          그래서 필요한 것은 더 나은 분배 알고리즘이 아니라, 분배를 결정하는 지점에 모델 서버의 지표가 들어갈 자리입니다. 이 자리를 표준화하는 확장이 최근에 자리 잡았습니다. 모델을
          서빙하는 엔드포인트 묶음을 하나의 자원으로 선언하고 그 묶음 안에서 어느 엔드포인트로 보낼지는 별도의 선택기가 정하게 하는 구조입니다.
        </p>
      </div>

      <EndpointViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          선택기가 보는 것은 공개된 설명 기준으로 대기 중인 요청 수, 캐시 사용 상황, 어떤 어댑터가 올라가
          있는지 같은 항목입니다. 어느 항목을 어떻게 저울질할지는 구현이 정하지만, 중요한 것은 그 값들이
          모델 서버에서 나온다는 점입니다. 프록시가 스스로 추측하지 않습니다.
        </p>

        <p className="leading-7">
          이 분리가 온프레미스에서 특히 중요한 이유가 있습니다. 모델 서버는 바뀝니다. 엔진을 교체하면 노출하는
          지표의 이름과 의미가 달라지는데, 그때 바꿔야 하는 것이 선택기 하나면 앞단 프록시 설정과 애플리케이션
          설정은 그대로입니다.
        </p>

        <p className="leading-7">
          반대로 이 구조가 공짜는 아닙니다. 선택기가 모든 요청의 경로에 들어가므로 그것의 지연과 가용성이 곧 서비스의 지연과 가용성이 됩니다. 지표를 얼마나 자주 긁어 올지도 선택이
          필요합니다. 너무 자주면 모델 서버에 부담이고 너무 드물면 이미 지난 상태를 보고 고릅니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="그냥 프록시에서 요청 수를 세면 안 됩니까"
          preview="셀 수는 있지만 그 수가 부하를 대표하지 않습니다. 실행 중인 요청 수가 같아도 한쪽은 긴 입력을 처리 중이고 다른 쪽은 짧은 출력을 뽑고 있을 수 있습니다."
        >
          <p className="leading-7">
            프록시는 자기가 보낸 요청의 수는 알지만 그 요청이 얼마나 남았는지는 모릅니다. 추론에서는 남은 양이
            출력 길이에 달려 있고 그것은 생성이 끝나야 확정됩니다. 그래서 보낸 수로 나누는 규칙은 긴 요청이
            몰린 서버에 계속 보내는 쪽으로 치우칩니다.
          </p>
          <p className="leading-7">
            모델 서버는 이것을 압니다. 지금 배치에 몇 개가 들어 있는지, 대기열에 몇 개가 밀려 있는지, 캐시
            공간이 얼마나 남았는지를 알고 있습니다. 이 값들을 밖으로 내보내면 프록시가 추측할 필요가
            없어집니다.
          </p>
          <p className="leading-7">
            다만 이 값들도 즉시 반영되지는 않습니다. 지표를 긁는 주기만큼 지난 상태이고 그 사이에 도착한 요청들은 아직 반영돼 있지 않습니다. 그래서 같은 순간에 여러 요청이 같은
            서버로 몰리는 현상이 남고 구현들은 보낸 직후의 요청을 따로 세는 식으로 이를 보정합니다.
          </p>
        </ProgressiveDetail>
      </div>

      <CitationBlock
        source="Kubernetes — Gateway API Inference Extension 소개와 프로젝트 문서 (2026-09-11 확인)"
        citeKey={1}
        href="https://kubernetes.io/blog/2025/06/05/introducing-gateway-api-inference-extension/"
      >
        일반적인 순환 분배와 최소 요청 분배가 모델 정체성·요청 중요도·모델 서버의 실시간 지표를 보지 못한다는
        문제 제기, 모델을 서빙하는 엔드포인트 묶음을 자원으로 선언하고 엔드포인트 선택을 확장 지점으로 빼는
        구조, 선택에 대기열 깊이와 캐시 사용률·어댑터 적재 상황 같은 모델 서버 지표를 쓴다는 설명이 이
        문서에 있습니다. 구체적인 가중치와 성능 수치는 구현과 버전에 따라 달라지므로 이 글은 구조만 다룹니다.
      </CitationBlock>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          어떤 규칙으로 저울질할지, 특히 캐시 적중과 부하 균형이 어떻게 맞서는지는{" "}
          <Link to="/ai/disaggregated-prefill-decode-serving#routing">복제본 라우팅</Link>이 소유합니다. 이
          절은 그 규칙이 놓일 자리를 클러스터가 어떻게 마련하는지만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
