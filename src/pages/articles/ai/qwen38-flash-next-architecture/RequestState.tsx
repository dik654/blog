import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import RequestStateViz from "./viz/RequestStateViz";

export default function RequestState() {
  return (
    <section id="request-state" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">요청 하나가 남기는 상태는 세 종류입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          지금까지 본 구조는 요청 하나가 서로 다른 규칙으로 자라는 세 가지 상태를 만든다는 결론으로 모입니다.
          토큰 수에 비례해 커지는 것, 요청마다 크기가 고정된 것, 그리고 몇 토큰 분량으로 끝나는 것입니다. 셋을
          한 공식으로 묶으면 용량 계산이 크게 어긋납니다.
        </p>

        <p className="leading-7">
          비례해서 커지는 쪽은 희소 attention 층의 K/V입니다. 층 12개에서 키와 값 두 종류, KV head 2개,
          head 차원 256, BF16이므로 토큰당 12 × 2 × 2 × 256 × 2 = 24,576 바이트입니다. 24 KiB이고, 262,144
          토큰을 모두 채우면 6 GiB입니다.
        </p>

        <p className="leading-7">
          희소 attention이라고 해서 이 양이 줄지는 않습니다. 읽을 위치를 2천여 개로 줄이는 것은 계산이지
          저장이 아닙니다. 어떤 블록이 나중에 선택될지 미리 알 수 없으므로 K/V는 전부 남겨야 합니다.
        </p>

        <p className="leading-7">
          indexer도 자기 몫을 쌓습니다. 층마다 공유 key head 하나를 128차원으로 저장하므로 토큰당 12 × 128 ×
          2 = 3,072 바이트가 더 붙습니다. 앞의 24 KiB에 3 KiB가 얹히는 셈이고, 이 두 번째 캐시는 Qwen3.6에는
          없던 항목입니다.
        </p>

        <p className="leading-7">
          고정된 쪽은 선형 층의 상태입니다. 층마다 value head 48개가 128 × 128 행렬을 FP32로 들고 있어 3 MiB,
          36개 층이면 108 MiB입니다. 문맥이 4,000 토큰이든 262,144 토큰이든 이 값은 변하지 않습니다.
        </p>

        <p className="leading-7">
          마지막은 짧은 상태입니다. 2번 층의 확장 convolution이 9 토큰, n-gram 조회가 직전 2개 토큰 id를
          기억합니다. 합쳐도 요청당 수백 KiB 수준이라 용량 계산에서는 무시할 만하지만, 존재를 잊으면 요청을
          다른 장비로 옮기거나 캐시를 잘라 낼 때 문제가 됩니다.
        </p>
      </div>

      <RequestStateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          262,144 토큰을 가득 채운 요청 하나를 예로 들면 K/V 6 GiB, indexer 키 0.75 GiB, 선형 상태 108 MiB로
          약 6.9 GiB입니다.{" "}
          <Link to="/cs/ai/qwen36-long-context-deployment#memory-profile">Qwen3.6-27B</Link>가 같은 길이에서 토큰당
          64 KiB로 16 GiB를 쓰는 것과 비교하면 절반 아래입니다. 층 수가 줄고 KV head가 4개에서 2개로 줄어든
          결과입니다.
        </p>

        <p className="leading-7">
          다만 이 비교는 상태 크기만의 비교입니다. Flash-Next는 backbone 자체가 125B라 가중치가 차지하는 자리가
          훨씬 크고, expert를 어느 장비에 나눠 얹는지에 따라 장비당 여유가 달라집니다. 두 모델 중 무엇을 올릴지는
          상태 크기가 아니라 가중치와 상태를 함께 놓고 판단해야 합니다.
        </p>

        <p className="leading-7">
          크기 규칙이 다른 캐시를 한 장비에 함께 배치하는 일반 원리는{" "}
          <Link to="/cs/ai/hybrid-kv-cache-allocation">하이브리드 KV cache 배치</Link>에서 다룹니다. 그 글이
          설명하는 두 그룹에 이 모델은 세 번째 그룹인 indexer 키 캐시를 더한 형태입니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="이 숫자를 그대로 용량 계획에 넣어도 되나요"
          preview="논리적 바이트이므로 실제 할당량과는 다릅니다. 블록 단위 할당과 병렬 배치, 실행 중 버퍼가 더해집니다."
        >
          <p className="leading-7">
            위 계산은 텐서 모양과 dtype만 곱한 값입니다. 실제 서빙 엔진은 K/V를 고정 크기 블록으로 나눠
            할당하므로 마지막 블록에 남는 자리가 생기고, 텐서 병렬로 쪼개면 장비마다 나눠 갖는 대신 통신용
            버퍼가 추가됩니다.
          </p>
          <p className="leading-7">
            indexer 키 캐시는 특히 구현 의존적입니다. reference 구현은 전체 문맥의 index key를 그대로 들고
            있지만, 실제 서빙 구현은 선택에 필요한 범위만 유지하는 식으로 이 비용을 줄일 수 있습니다. 여기서는
            reference 구현 기준의 상한으로만 읽어야 합니다.
          </p>
          <p className="leading-7">
            그래서 이 값들은 요청 하나를 받기 전에 무엇이 얼마나 자랄지 가늠하는 기준이지, 특정 엔진에서 측정한
            수치가 아닙니다. 실제 수용량은 대상 엔진과 하드웨어에서 직접 재야 합니다.
          </p>
        </ProgressiveDetail>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          다음 질문은 이 상태들을 실제 서빙 엔진이 어떻게 다루느냐입니다. indexer 키를 줄이는 방법, 예측 모듈을
          붙였을 때 선택을 다시 계산하지 않는 방법, 95 GiB짜리 표를 호스트에 두고 필요한 행만 가져오는 방법은
          모두 런타임 쪽 주제라 이 글에서는 구조와 상한까지만 다뤘습니다.
        </p>

        <p className="leading-7">
          이어서 읽을 글은{" "}
          <Link to="/cs/ai/qwen36-hybrid-runtime">하이브리드 런타임의 prefill과 decode</Link>입니다. 두 종류의
          상태를 한 요청으로 묶어 관리하는 방식이 Flash-Next에서도 같은 골격으로 이어집니다.
        </p>
      </div>
    </section>
  );
}
