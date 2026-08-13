import { CitationBlock } from "@/components/ui/citation";
import ContextViz from "./viz/ContextViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 GPU를 비교해야 하는가</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          RTX 4090·5090과 A100·H100은 모두 CUDA 커널을 실행하지만 설계 목표부터
          다름
          <br />
          GeForce — 한 장의 높은 처리량과 접근성에 집중
          <br />
          데이터센터 GPU — 큰 HBM, GPU 간 연결, 격리와 관리, 서버 통합에 집중
        </p>
        <p className="leading-7">
          따라서 “가장 빠른 GPU”를 찾기보다{" "}
          <strong>내 작업에서 먼저 막히는 자원</strong>을 찾아야 함<br />
          작업 집합이 VRAM에 들어가는지 확인하고, 메모리 이동과 연산의 비율을
          측정한 뒤, 다중 GPU 통신과 배치 환경까지 순서대로 좁혀가는 방식
        </p>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-cyan-500 mb-2">
              사양표가 답하는 것
            </p>
            <p className="text-sm leading-6">
              용량 상한 · 이론 대역폭 · 전력 한도 · 지원 연결 방식
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-violet-500 mb-2">
              벤치마크가 답하는 것
            </p>
            <p className="text-sm leading-6">
              실제 커널 시간 · 전송 비용 · 지속 클럭 · 종단 처리량
            </p>
          </div>
        </div>

        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">💡 비교 원칙</p>
          <p className="text-sm leading-6">
            CUDA 코어 수는 같은 아키텍처 안의 대략적인 규모 지표일 뿐, 세대와
            제품군이 다른 GPU의 실성능 순위가 아님.
            <br />
            같은 입력·같은 라이브러리·같은 정밀도로 측정한 결과만 최종 판단에
            사용
          </p>
        </div>

        <CitationBlock
          source="NVIDIA — GeForce RTX 4090 공식 사양"
          citeKey={1}
          href="https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/"
        >
          RTX 4090 Founders Edition: CUDA 코어 16,384개, 24GB GDDR6X, TGP 450W,
          NVLink 미지원.
        </CitationBlock>
        <CitationBlock
          source="NVIDIA — GeForce RTX 5090 공식 사양"
          citeKey={2}
          href="https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/rtx-5090/"
        >
          RTX 5090 Founders Edition: CUDA 코어 21,760개, 32GB GDDR7, TGP 575W.
        </CitationBlock>
      </div>
    </section>
  );
}
