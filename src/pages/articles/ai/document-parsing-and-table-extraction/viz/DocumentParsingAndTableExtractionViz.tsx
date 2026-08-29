import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 병합 셀·multi-level header가 있는 원본 표(0) → rowspan·colspan을 실제
 * 열 개수로 펼치고(1) → 펼쳐진 두 헤더 행을 하나의 flat header로 합친 뒤(2) → 정규화된
 * grid를 markdown·row-level 두 방식으로 linearize한다(3). Stage 높이는 4 장면 중 가장
 * 큰 scene(표+텍스트가 함께 있는 scene 3) 기준으로 고정한다.
 */
const SCENES = ["병합·다단 헤더 원본", "rowspan·colspan 펼치기", "헤더 합치기", "정규화·linearization"] as const;

const NOTES = [
  "지표 셀은 rowspan=2로 아래 칸까지, 2024 셀은 colspan=2로 옆 칸까지 병합돼 있어 표 그대로는 실제 열 개수를 알 수 없습니다.",
  "rowspan·colspan만큼 셀을 실제 칸 수로 펼치면 지표와 2024가 각각 두 번 나타나는 3열 grid가 되어 데이터 행과 열 개수가 맞아떨어집니다.",
  "펼쳐진 두 헤더 행을 위에서 아래 순서로 이어 붙이면 '2024 Q1'·'2024 Q2'처럼 하나의 flat header로 합쳐집니다.",
  "정규화된 grid를 markdown 표나 행마다 헤더를 반복하는 row-level 문장으로 linearize하면 LLM이 표를 읽을 수 있는 텍스트가 됩니다.",
] as const;

const cellCls = "border border-border p-2 text-center";
const mergedCls = "border border-primary/55 bg-primary/10 p-2 text-center font-bold text-foreground";

function RawTableScene() {
  return (
    <table className="mt-6 w-full border-collapse text-xs">
      <tbody>
        <tr>
          <td rowSpan={2} className={mergedCls}>
            지표
          </td>
          <td colSpan={2} className={mergedCls}>
            2024
          </td>
        </tr>
        <tr>
          <td className={cellCls}>Q1</td>
          <td className={cellCls}>Q2</td>
        </tr>
        <tr>
          <td className={cellCls}>매출</td>
          <td className={cellCls}>120</td>
          <td className={cellCls}>150</td>
        </tr>
      </tbody>
    </table>
  );
}

function ExpandScene() {
  return (
    <table className="mt-6 w-full border-collapse text-xs">
      <tbody>
        <tr>
          <td className={mergedCls}>지표</td>
          <td className={mergedCls}>2024</td>
          <td className={mergedCls}>2024</td>
        </tr>
        <tr>
          <td className={mergedCls}>지표</td>
          <td className={cellCls}>Q1</td>
          <td className={cellCls}>Q2</td>
        </tr>
        <tr>
          <td className={cellCls}>매출</td>
          <td className={cellCls}>120</td>
          <td className={cellCls}>150</td>
        </tr>
      </tbody>
    </table>
  );
}

function FlattenScene() {
  return (
    <table className="mt-6 w-full border-collapse text-xs">
      <tbody>
        <tr>
          <td className={mergedCls}>지표</td>
          <td className={mergedCls}>2024 Q1</td>
          <td className={mergedCls}>2024 Q2</td>
        </tr>
        <tr>
          <td className={cellCls}>매출</td>
          <td className={cellCls}>120</td>
          <td className={cellCls}>150</td>
        </tr>
      </tbody>
    </table>
  );
}

function LinearizeScene() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="border border-border p-3 text-xs">
        <p className="text-[11px] font-black text-primary">Markdown 표</p>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-6 text-muted-foreground">
          {"| 지표 | 2024 Q1 | 2024 Q2 |\n|---|---|---|\n| 매출 | 120 | 150 |"}
        </pre>
      </div>
      <div className="border border-border p-3 text-xs">
        <p className="text-[11px] font-black text-primary">Row-level 문장</p>
        <p className="mt-2 font-mono text-[11px] leading-6 text-muted-foreground">
          매출: 2024 Q1=120, 2024 Q2=150
        </p>
      </div>
    </div>
  );
}

export default function DocumentParsingAndTableExtractionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  return (
    <VizFrame
      eyebrow="병합 셀 · multi-level header → 정규화"
      title="병합 셀과 다단 헤더는 펼치고 합친 뒤에야 안전하게 linearize됩니다"
      description="rowspan·colspan이 있는 원본 표가 구조 인식·정규화를 거쳐 markdown·row-level 두 linearized 텍스트로 바뀌는 흐름입니다."
      note="지표·2024·Q1·Q2 표는 구조를 보여 주기 위한 예시이며 특정 문서의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="병합 셀과 multi-level header가 정규화·linearization을 거치는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[26rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          {scenes.active === 0 && <RawTableScene />}
          {scenes.active === 1 && <ExpandScene />}
          {scenes.active === 2 && <FlattenScene />}
          {scenes.active === 3 && <LinearizeScene />}

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
