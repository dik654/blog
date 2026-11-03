import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AxesViz from "./viz/AxesViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 break-keep text-2xl font-bold">
        가속기는 벤더 이름보다 배치 경계와 한 요청의 병목으로 고릅니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          고정한 가상 업무는 BF16 70B dense 모델, 32K 문맥, 동시 요청 8개입니다.
          자체 데이터센터 두 곳에서 기본 용량을 운영하고, 급증분만 cloud로
          보냅니다. 이 조건에서는 모든 가속기를 한 표에 놓고 가장 큰 수를 고를 수
          없습니다.
        </p>
        <p className="leading-7">
          자체 랙에 설치할 기반 장비를 고르는 질문에는 OEM이 판매하는 NVIDIA·AMD·
          Intel 계열이 들어올 수 있습니다. Google TPU와 AWS Trainium은 이 글의
          조달 경계에서는 각각 Google Cloud와 AWS에서 빌리는 실행 환경입니다.
          cloud burst 후보로는 비교할 수 있지만, 자체 데이터센터의 모듈을 그대로
          대체하는 구매 후보는 아닙니다.
        </p>
        <p className="leading-7">
          <strong>
            먼저 어디에 배치할 수 있는지 가르고, 그다음 메모리 적합성·요청 지연·
            통신 범위·소프트웨어 기능·운영비를 같은 요청으로 검증해야 합니다.
          </strong>{" "}
          peak FLOPS는 이 관문을 모두 통과한 뒤에야 의미가 생깁니다.
        </p>
      </div>

      <AxesViz />
      <ContentBoundary article="ai-accelerator-vendor-comparison" />

      <TermBreakdown
        title="처음부터 분리해야 하는 세 종류의 비교"
        items={[
          {
            term: "칩 비교",
            description: "한 가속기의 HBM 용량·대역폭·지원 정밀도처럼 장치 자체를 비교합니다.",
            example: "70B 사례가 한 장에 들어갈 최소 nominal HBM 후보를 가릅니다.",
            boundary: "칩 하나의 수치로 여러 장 시스템의 통신과 운영 성능을 알 수 없습니다.",
          },
          {
            term: "시스템 비교",
            description: "가속기 여러 개, scale-up fabric, host, NIC, 전력과 냉각이 묶인 실행 단위를 비교합니다.",
            example: "HGX·Helios·TPU slice·Trainium UltraServer처럼 실제로 예약하거나 설치하는 단위를 봅니다.",
            boundary: "서로 다른 domain 크기의 aggregate 수치를 GPU 한 장 수치처럼 나누어 읽으면 안 됩니다.",
          },
          {
            term: "서비스 비교",
            description: "지역별 capacity, 예약 방식, 가격, 데이터 위치, 지원과 장애 책임까지 포함합니다.",
            example: "TPU나 Trainium을 사용할 수 있어도 필요한 region과 기간에 quota가 없으면 후보가 아닙니다.",
            boundary: "공식 제품 문서에 존재한다는 사실은 지금 내 계정에서 조달할 수 있다는 보장이 아닙니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          NVIDIA 제품 안의 세대 비교는{" "}
          <Link to="/cs/gpu/hw-gpu-comparison">GPU 비교</Link>가, 링크의
          물리적 대역폭 계산은{" "}
          <Link to="/cs/gpu/gpu-interconnects">GPU 인터커넥트</Link>가
          소유합니다. 이 글은 서로 다른 생태계를 같은 업무 계약에 넣어 어떤
          순서로 탈락시키고 무엇을 실측해야 하는지를 다룹니다.
        </p>
      </div>
    </section>
  );
}
