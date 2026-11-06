import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { FlowArrow, FlowLine, FlowNode } from "./Flow";
import SceneShell from "./SceneShell";

/** 본문 대응: #comparison — 광고주→플랫폼 거래와 제작자에게 가는 별도 대가를 나누고, 추천 기준 공개와 지급 관계 공개를 한 화면에 놓는다. */
const SCENES = [
  { label: "돈이 플랫폼으로 갈 때", summary: "화면의 광고 거래", note: "광고주가 플랫폼에 1만 원을 내고 광고 1천 회를 얻는 경우입니다(가정). 확인할 것은 이 광고 거래입니다." },
  { label: "돈이 제작자에게 갈 때", summary: "게시물 뒤의 지급 관계", note: "제작자에게 따로 지급한 대가라면 확인할 관계가 달라집니다. 10개 중 한 게시물이 유료 후기라면 그 관계를 화면의 광고 거래와 분리해 읽습니다(가정)." },
  { label: "한 화면, 다른 질문", summary: "기준 공개 ≠ 관계 공개 ≠ 사실 검증", note: "한국이나 다른 나라는 현지 규정을 확인해야 합니다. 플랫폼 표시 기능이 있다는 사실만으로 언제나 충분한 공개가 됐다고 보지는 않습니다." },
] as const;

function Question({ tag, text }: { tag: string; text: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2">
      <p className="text-xs font-bold leading-5 text-primary">{tag}</p>
      <p className="text-sm leading-6">{text}</p>
    </div>
  );
}

export default function MoneyRelationsViz() {
  return (
    <SceneShell
      eyebrow="관계 분리"
      title="돈이 어디로 갔는지에 따라 확인할 관계가 다릅니다"
      description="1만 원과 유료 후기 한 건은 가정 사례입니다. EU·미국 설명은 2026-10-04 확인 기준입니다."
      ariaLabel="광고 거래와 제작자 지급 관계, 추천 기준 공개의 구별"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <FlowLine key="ad">
              <FlowNode title="광고주" />
              <FlowArrow label="1만 원" />
              <FlowNode title="플랫폼" />
              <FlowArrow label="광고 1천 회" />
              <FlowNode title="이용자 화면" sub="광고 칸" tone="accent" />
            </FlowLine>,
            <FlowLine key="creator">
              <FlowNode title="광고주" />
              <FlowArrow label="따로 지급한 대가" />
              <FlowNode title="제작자" />
              <FlowArrow label="유료 후기" />
              <FlowNode title="이용자 화면" sub="게시물 10개 중 한 칸" tone="accent" />
            </FlowLine>,
            <div key="questions" className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <Question tag="EU 디지털서비스법 제27조" text="100개 중 10개를 고른 주요 기준은?" />
              <Question tag="미국 FTC 추천·보증 광고 안내" text="판단에 영향을 줄 지급 관계가 있나?" />
              <Question tag="별도 작업: 사실 검증" text="글의 내용이 맞나? 공개 여부와는 다른 일" />
            </div>,
          ]}
        />
      )}
    />
  );
}
