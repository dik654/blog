import { CitationBlock } from "@/components/ui/citation";
import { DeepfakeMapReturn } from "../deepfake-detection/DeepfakePathLocator";
import ReleasePropagationViz from "./viz/ReleasePropagationViz";

export default function Release() {
  return (
    <section id="release" data-teach-level="7" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">사용 범위가 바뀌면 파생본과 주장도 다시 계산합니다</h2>
      <ReleasePropagationViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          설명용 <code>permission-C-r3</code>가 <code>permission-C-r4</code>로 바뀌었다고
          가정하겠습니다. 새 자료 release에는 person-C를 쓰지 않습니다. 시스템은 person-C의
          원본만 숨기는 것으로 끝나지 않습니다. Parent chain을 따라 조작 영상,
          재인코딩본, frame과 crop을 찾아 다음 자료 버전에서 제외해야 합니다.
        </p>
        <p>
          그러면 generator-Z·social codec 칸의 독립 원본 수가 10에서 9로 줄어듭니다.
          최소 근거를 10으로 정한 설명용 규칙에서는 새 <code>dataset-d09</code>가 해당 조건의
          수치 주장을 내보내지 않습니다. 이미 만든 checkpoint의 삭제·재학습 여부는 lineage
          그래프만으로 정할 수 없습니다. 적용되는 계약·정책·법률과 모델의 사용 상태를
          별도로 판단해야 합니다.
        </p>
      </div>
      <div id="paper-datasheets" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 자료의 수명주기</p>
        <CitationBlock type="paper" citeKey={2} source="Gebru et al. — Datasheets for Datasets" href="https://arxiv.org/abs/1803.09010">
          <p className="text-sm leading-6 text-muted-foreground">
            이 논문은 자료의 동기·구성·수집·전처리·사용·배포·유지보수를 함께 문서화하고,
            사람 자료에서는 동의 방식과 철회 수단을 묻도록 제안합니다. 여기서는 사용 범위
            revision이 파생본과 주장 범위에 연결되어야 한다는 근거로 사용합니다. 논문이
            본문의 필드 이름이나 최소 근거 10을 정했다는 뜻은 아닙니다.
          </p>
        </CitationBlock>
      </div>
      <div id="paper-dfdc" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · DFDC가 확인한 범위</p>
        <CitationBlock type="paper" citeKey={3} source="Dolhansky et al. — The DFDC Dataset · v4" href="https://arxiv.org/abs/2006.07397v4">
          <p className="text-sm leading-6 text-muted-foreground">
            DFDC 논문은 3,426명의 유급 참여자가 촬영과 얼굴 변형에 동의했으며, 100,000개가
            넘는 clip을 여러 방법으로 만들었다고 보고합니다. 여기서 확인되는 것은 논문에
            적힌 참여·변형 동의와 자료 구성 범위입니다. 공개 재배포·보유 기간·철회 처리까지
            본문의 설명용 manifest와 같았다고 확대하지 않습니다.
          </p>
        </CitationBlock>
      </div>
      <DeepfakeMapReturn current="dataset-governance" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>같은 사례로 확인해 보세요</h3>
        <ol>
          <li><code>crop-04-a1</code>에서 어떤 경로를 따라야 원본과 사용 범위 revision을 찾을 수 있나요? (답: 2절)</li>
          <li>Generator-Z·social codec 칸의 파일 60개가 독립 원본 10개인 이유는 무엇인가요? (답: 3절)</li>
          <li>Group 042-C를 새 release에서 제외하면 해당 칸의 근거와 수치 주장은 어떻게 달라지나요? (답: 4절)</li>
        </ol>
      </div>
    </section>
  );
}
