import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import PipelineViz from "./viz/PipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">막는 위치가 앞일수록 비용이 싸집니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          웹 앞단 서비스를 쓰면 "알아서 막아 준다"는 느낌만 남고 무엇이 어디서 걸러지는지는 잘 보이지 않습니다.
          그런데 이 구조는 한 가지 원칙으로 설명됩니다. 같은 트래픽이라도 더 앞에서, 더 적은 정보로 판단해
          버릴수록 처리 비용이 싸다는 것입니다.
        </p>

        <p className="leading-7">
          그래서 방어는 층으로 쌓입니다. 맨 앞에서는 패킷을 커널에 올리기도 전에 버리고, 그다음 층에서 연결을 맺으며 얻은 정보로 판단하고, 마지막 층에서 요청 내용을 보고 판단합니다.
          뒤로 갈수록 정확하지만 한 건당 비용이 커지므로 값싼 층에서 최대한 걸러 내는 것이 설계 목표가 됩니다.
        </p>

        <p className="leading-7">
          이 글은 그 층을 하나씩 따라갑니다. 각 층이 어떤 정보를 갖고 무엇을 판단할 수 있는지, 그리고 판단이
          틀렸을 때 어떤 대가를 치르는지를 봅니다. 특정 회사의 제품 설명이 아니라 공개된 설계 문서에서 읽을 수
          있는 구조를 정리한 것입니다.
        </p>

        <ContentBoundary article="edge-request-defense-pipeline" />

        <p className="leading-7">
          순서는 패킷 층, 요청 층, 클라이언트 식별, 오리진 보호입니다. 앞의 둘은 트래픽을 얼마나 감당하느냐의 문제이고 뒤의 둘은 누구를 통과시키느냐의 문제입니다. 마지막에 오탐 비용과
          판단 순서로 닫습니다.
        </p>

        <p className="leading-7">
          TLS 핸드셰이크가 무엇을 주고받는지는{" "}
          <Link to="/cs/p2p/tls-fundamentals#handshake">TLS 1.3 기초</Link>가, 요청 수를 제한하는 알고리즘 자체는{" "}
          <Link to="/cs/ai/rate-limiting-and-reliability-patterns">레이트 리밋과 신뢰성 패턴</Link>이 소유합니다.
          이 글은 그 요소들이 엣지 방어에서 어떤 층에 놓이는지를 다룹니다.
        </p>
      </div>

      <PipelineViz />
    </section>
  );
}
