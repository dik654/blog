import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import LayerScheduleViz from "./viz/LayerScheduleViz";

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">48층을 선형 36개와 희소 12개로 나눕니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Qwen3.8-Flash-Next는 한 모델 안에서 두 종류의 sequence mixer를 층 단위로 번갈아 씁니다. 공개된
          config의 <code>layer_types</code>를 세어 보면 48개 층 가운데 36개가 Gated DeltaNet이고 12개가
          Qwen Sparse Attention입니다. 전체 문맥을 그대로 훑는 층은 하나도 없습니다.
        </p>

        <p className="leading-7">
          sequence mixer는 한 토큰이 다른 토큰의 정보를 가져오는 부분을 가리킵니다. Transformer에서는 보통
          attention 하나가 그 역할을 전담하지만, 최근 모델은 과거를 고정 크기 상태로 압축하는 선형 mixer와
          과거 토큰을 다시 읽는 attention을 섞어 씁니다. 이 글은 그 배치가 Flash-Next에서 어떤 모양인지를
          공개 config와 reference 구현으로 확인합니다.
        </p>

        <p className="leading-7">
          <Link to="/cs/ai/qwen36-hybrid-architecture#overview">Qwen3.6-27B</Link>도 같은 3:1 리듬을 씁니다.
          다만 그 모델의 네 번째 층은 문맥 전체를 보는 gated attention이었습니다. Flash-Next는 그 자리에
          indexer가 붙은 희소 attention을 넣어, 한 질의가 실제로 읽는 위치를 2천여 개로 묶어 둡니다.
        </p>

        <p className="leading-7">
          규모도 다릅니다. 3.6-27B가 64층 dense 모델이라면 Flash-Next는 층마다 512개 expert를 둔 Mixture of
          Experts이고, 공식 카드가 밝힌 backbone은 125B, 토큰당 활성은 6B입니다. 여기에 별도의 n-gram 임베딩
          표 51B와 multi-token prediction 모듈이 따로 붙습니다.
        </p>

        <ContentBoundary article="qwen38-flash-next-architecture" />

        <p className="leading-7">
          Qwen 팀은 이 모델을 Qwen4 아키텍처의 미리보기로 공개했고, Transformers는 같은 구조를{" "}
          <code>qwen4_exp</code>라는 이름으로 구현했습니다. 그래서 이 글의 코드 인용은 모두 Qwen4-Exp
          reference 구현을 가리킵니다. 이름이 다르지만 Flash-Next 체크포인트가 그대로 올라가는 구현입니다.
        </p>

        <p className="leading-7">
          순서는 이렇습니다. 먼저 희소 attention이 무엇을 골라 읽는지 보고, 그 다음 층과 층을 잇는 배선인
          gated residual을 봅니다. 이어서 2번 층에만 붙은 n-gram 임베딩을 확인하고, 세 종류의 파라미터
          회계와 요청 하나가 남기는 상태로 마무리합니다.
        </p>
      </div>

      <LayerScheduleViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("layer-schedule", codeRefs["layer-schedule"])} />
        <span className="text-xs text-muted-foreground">
          layer_types를 만드는 Qwen4ExpTextConfig.__post_init__
        </span>
      </div>
    </section>
  );
}
