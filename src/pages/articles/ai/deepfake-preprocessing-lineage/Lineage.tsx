import { CitationBlock } from "@/components/ui/citation";
import { DeepfakeMapReturn } from "../deepfake-detection/DeepfakePathLocator";
import LineageReceiptViz from "./viz/LineageReceiptViz";

const RECEIPT_SCHEMA = `type CropReceipt = {
  // 어느 원본의 몇 ms인지 기록합니다.
  source: { videoSha256: string; timestampMs: number };
  // 얼굴을 찾은 구현과 좌표, 실패를 기록합니다.
  detection: { revision: string; box?: [number, number, number, number]; failure?: string };
  // 같은 인물이 이어졌는지 기록합니다.
  track: { id?: string; identity: "consistent" | "switched" | "unknown" };
  // 실제 입력을 만든 변환과 결과 checksum을 기록합니다.
  output: { transformRevision: string; cropSha256?: string; failure?: string };
};`;

export default function Lineage() {
  return (
    <section id="lineage" data-teach-level="7" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">완성된 입력을 원본과 실행 단계에 연결합니다</h2>
      <LineageReceiptViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>crop-04-a1</code>만 저장하면 입력이 달라졌을 때 원인을 알 수 없습니다. 원본
          checksum과 timestamp, decoder와 face detector revision, box, track ID, alignment와
          resize 값을 한 영수증으로 연결해야 같은 입력을 다시 만들고 두 revision을 비교할 수
          있습니다.
        </p>
        <p>
          실패도 같은 구조를 사용합니다. 00:05는 얼굴 위치까지 성공했지만 track 단계에서
          <code>TRACK_SWITCH</code>로 끝나므로 output checksum이 없습니다. 이 기록은 detector를
          자동으로 강건하게 만들지는 않지만, 입력 변화가 어느 단계에서 생겼는지 확인하고
          이전 revision으로 되돌릴 근거를 남깁니다.
        </p>
      </div>
      <pre className="not-prose my-8 max-w-full overflow-x-auto border-y border-border bg-muted/20 px-4 py-5 text-[12px] leading-6 sm:px-6 sm:text-[13px]">
        <code>{RECEIPT_SCHEMA}</code>
      </pre>
      <div id="paper-deepfake-preprocess" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · DeepfakeBench</p>
        <CitationBlock
          type="paper"
          citeKey={1}
          source="Yan et al. — DeepfakeBench: A Comprehensive Benchmark of Deepfake Detection"
          href="https://papers.nips.cc/paper_files/paper/2023/hash/0e735e4b4f07de483cbe250130992726-Abstract-Datasets_and_Benchmarks.html"
        >
          <p className="text-sm leading-6 text-muted-foreground">
            이 연구는 서로 다른 데이터 처리·구현·평가 조건이 detector 비교를 왜곡하는
            문제를 다루고, 통일된 데이터 관리와 평가 protocol을 제시합니다. 여기서는
            전처리 입력과 조건을 함께 고정해야 한다는 근거로 사용합니다. 특정 face detector나
            crop 규칙이 모든 실제 영상에 최적이라는 근거로 넓히지 않습니다.
          </p>
        </CitationBlock>
      </div>
      <DeepfakeMapReturn current="preprocessing-lineage" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>같은 사례로 확인해 보세요</h3>
        <ol>
          <li>얼굴 위치를 찾은 8개만 분모로 삼으면 어떤 실패가 사라지나요? (답: 2·3절)</li>
          <li>평가 시각 10개 중 유효 crop이 6개라면 최종 coverage는 얼마인가요? (답: 3절)</li>
          <li>00:05와 crop-04-a1을 각각 원본까지 되짚으려면 어떤 필드가 필요한가요? (답: 4절)</li>
        </ol>
      </div>
    </section>
  );
}
