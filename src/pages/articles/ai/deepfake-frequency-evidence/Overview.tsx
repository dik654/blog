import ContentBoundary from "@/components/articles/content-boundary";
import DeepfakePathLocator from "../deepfake-detection/DeepfakePathLocator";
import FrequencyMapViz from "./viz/FrequencyMapViz";

export default function Overview() {
  return (
    <section id="overview" data-teach-level="1" className="mb-16 scroll-mt-20">
      <DeepfakePathLocator current="frequency-evidence" />
      <h2 className="mb-6 text-2xl font-bold">같은 입력을 좌표·손상·오류 세 관점에서 확인합니다</h2>
      <FrequencyMapViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞 글에서 원본까지 되짚을 수 있게 만든 <code>clip-042 · 00:04</code>의 얼굴
          입력을 이어서 보겠습니다. 같은 밝기 배열을 주파수 좌표로 바꾸면 반복되는 무늬가
          특정 주파수 막대로 모입니다. 그러나 이 막대는 계산 결과일 뿐, 그 자체가 딥페이크
          판정은 아닙니다.
        </p>
        <p>
          그래서 원본에서 보인 막대가 JPEG·크기 변경·흐림 뒤에도 남는지 먼저 확인합니다.
          그런 다음 공간 분기와 주파수 분기가 같은 열 개 샘플에서 어디를 각각 틀리고 함께
          틀렸는지 셉니다. 본문의 배열·손상값·샘플 판정은 이 검증 순서를 설명하기 위한
          가정입니다.
        </p>
      </div>
      <ContentBoundary article="deepfake-frequency-evidence" />
    </section>
  );
}
