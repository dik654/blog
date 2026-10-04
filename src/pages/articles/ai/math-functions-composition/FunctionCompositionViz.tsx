import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["입력 선택", "g로 변환", "f로 변환", "순서 반대로"] as const;

export default function FunctionCompositionViz() {
  const scenes = useAnimatedScenes(LABELS.length);
  const active = scenes.active;
  const reversed = active === 3;
  const values = reversed ? [["1", "2", "3"], ["1", "4", "9"], ["4", "13", "28"]] : [["1", "2", "3"], ["4", "7", "10"], ["16", "49", "100"]];
  const labels = reversed ? ["고른 입력", "f: 제곱", "g: 세 배+1"] : ["고른 입력", "g: 세 배+1", "f: 제곱"];

  return (
    <VizFrame
      eyebrow="함수 합성"
      title="앞 출력이 다음 입력이 되는 순서를 따라갑니다"
      description="가정 사례의 입력 2를 강조했습니다. 순서를 바꾸면 중간값과 최종 결과가 함께 달라집니다."
      note="나열한 수는 각 집합의 일부입니다. 여러 입력이 같은 출력으로 모여도 함수가 될 수 있습니다."
    >
      <div data-viz-canvas tabIndex={0} role="group" aria-label="함수 합성 순서 애니메이션" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {values.map((column, index) => <div key={index} className={`min-w-0 border-y py-3 transition-opacity ${active >= index || reversed ? "border-primary opacity-100" : "border-border opacity-35"}`}>
            <p className="text-center text-xs font-semibold">{labels[index]}</p>
            <div className="mt-3 space-y-2">
              {column.map((value, row) => <p key={row} className={`text-center font-mono text-lg ${row === 1 ? "font-black text-primary" : "text-muted-foreground"}`}>{value}</p>)}
            </div>
          </div>)}
        </div>
        <div className="mt-5 flex h-32 flex-col justify-center border-b border-border pb-5" aria-live="polite">
          <p className="font-mono text-lg font-bold">{reversed ? "2 → 4 → 13" : "2 → 7 → 49"}</p>
          <p className="mt-2 text-sm leading-6">{active === 0 ? "입력 2를 고릅니다. 오른쪽은 앞으로 계산할 경로입니다." : active === 1 ? "g가 3×2+1=7을 만듭니다. 이 7이 다음 계산으로 갑니다." : active === 2 ? "f가 앞의 7을 제곱합니다. 최종 결과는 49입니다." : "f부터 실행하면 2²=4입니다. g가 3×4+1=13을 만듭니다."}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} />
      </div>
    </VizFrame>
  );
}
