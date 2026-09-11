import { Link } from "react-router-dom";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { codeRefs } from "./codeRefs";
import PoolingViz from "./viz/PoolingViz";

export default function Pooling({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="pooling" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">출력은 벡터 하나가 아니라 패치 수만큼 나옵니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          사진 한 장을 넣으면 모델은 토큰 시퀀스를 돌려줍니다. 224픽셀 입력에 패치 16이면 패치 토큰만 196개이고,
          그 앞에 요약용 토큰과 보조 토큰이 더 붙습니다. 이 중 무엇을 어떻게 합쳐 하나의 벡터로 만들지가 두 번째
          결정입니다.
        </p>

        <p className="leading-7">
          가장 간단한 선택은 맨 앞의 요약 토큰을 그대로 쓰는 것입니다. 참조 구현에서 흔히 보는 pooler 출력이
          실제로는 별도 계산이 아니라 0번 토큰을 꺼낸 값입니다. 학습이 이 토큰에 이미지 전체를 대표하도록 압력을
          줬으므로 장면 단위 검색에는 잘 맞습니다.
        </p>

        <p className="leading-7">
          다른 선택은 패치 토큰의 평균입니다. 여기서 자주 나는 사고가 앞쪽 토큰을 함께 평균 내는 것입니다. 토큰
          배치가 요약 토큰, 보조 토큰, 패치 순서라면 평균 대상은 그 뒤부터입니다. 앞의 몇 칸을 자르지 않으면
          이미지 위치와 무관한 벡터가 섞여 들어갑니다.
        </p>
      </div>

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("token-layout", codeRefs["token-layout"])} />
        <span className="text-xs text-muted-foreground">토큰 배치와 pooler 출력의 실제 정의</span>
      </div>

      <PoolingViz />

      <AlgorithmBlock
        title="패치 평균을 낼 때의 최소 절차"
        input={["모델 출력 시퀀스 (B, 1 + R + P, D)", "보조 토큰 개수 R", "유효 영역 마스크 (여백을 채운 경우)"]}
        steps={[
          { code: "patches = out[:, 1 + R :, :]", note: "요약 토큰과 보조 토큰을 잘라냅니다. R은 모델 설정에서 읽습니다" },
          { code: "patches = patches[valid_mask]", note: "여백 채우기를 썼다면 채워 넣은 자리를 평균에서 제외합니다" },
          { code: "v = patches.mean(dim=1)", note: "남은 패치만 평균 냅니다" },
          { code: "v = v / v.norm(dim=-1, keepdim=True)", note: "L2 정규화해 이후 내적이 코사인 유사도가 되게 합니다" },
        ]}
        output="사진 한 장을 대표하는 벡터 하나"
      />

      <h3 id="dense-vs-global" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        부분을 찾으려면 벡터를 하나로 줄이면 안 됩니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          "이 사진과 비슷한 사진"을 찾는 것과 "이 물체가 들어 있는 사진"을 찾는 것은 다른 질의입니다. 앞의
          질의는 장면 전체가 비교 대상이라 벡터 하나로 충분합니다. 뒤의 질의는 사진의 작은 일부가 근거라서,
          평균을 내면 그 일부가 배경에 묻힙니다.
        </p>

        <p className="leading-7">
          부분 검색이 목적이면 패치 벡터를 그대로 색인하는 선택지가 있습니다. 사진 한 장이 벡터 하나가 아니라
          수백 개가 되므로 색인 크기와 질의 비용이 그만큼 커지고, 한 사진의 여러 패치가 동시에 상위에 올라오는
          중복 문제도 따라옵니다.
        </p>

        <p className="leading-7">
          절충안은 영역 단위로 묶는 것입니다. 패치를 격자나 분할 결과로 몇 덩어리씩 묶어 평균 내면 사진당 벡터가
          수십 개로 줄어듭니다. 어느 쪽이든 색인 설계가 함께 바뀌므로, 이 결정은 검색 요구사항을 먼저 정한 뒤에
          내려야 합니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="패치 벡터를 색인하면 비용이 얼마나 늘어나나요"
          preview="224픽셀·패치 16이면 사진당 196개입니다. 1,000만 장이면 벡터 수가 20억 개가 되어 색인 전략 자체가 달라집니다."
        >
          <p className="leading-7">
            벡터 하나가 1,024차원 float16이면 2KB입니다. 사진당 하나면 1,000만 장에 20GB이지만, 패치 196개를 다
            넣으면 약 3.9TB가 됩니다. 이 규모에서는 양자화와 디스크 기반 색인이 선택이 아니라 전제가 됩니다.
          </p>
          <p className="leading-7">
            질의 비용도 같이 오릅니다. 후보를 넉넉히 뽑아도 같은 사진의 패치가 자리를 차지하므로, 사진 단위로
            묶어 상위를 다시 고르는 단계가 필요합니다. 이 구조는{" "}
            <Link to="/ai/retrieval-ranking-funnel">검색 랭킹 퍼널</Link>에서 다루는 후보 생성과 재순위의
            분리와 같은 모양입니다.
          </p>
          <p className="leading-7">
            그래서 현실적인 순서는 이렇습니다. 먼저 장면 벡터 하나로 후보를 좁히고, 그 후보 안에서만 패치 단위
            비교를 합니다. 전수 패치 색인은 후보 축소가 불가능한 과제에서만 정당화됩니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
