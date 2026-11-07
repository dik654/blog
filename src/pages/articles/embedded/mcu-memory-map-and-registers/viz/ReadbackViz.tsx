import SceneShell from "./SceneShell";

/**
 * 본문 대응: #readback — GPIO_OUT은 마지막에 설정한 래치 값을, GPIO_IN은 핀 입력을 샘플링한다.
 * 핀 기능·패드 설정은 래치와 핀 사이에, 외부 회로는 핀 바깥에 있어 래치 1이어도 핀에서 예상한 전압을 못 볼 수 있다.
 */
interface Scene {
  label: string;
  summary: string;
  note: string;
  read: "out" | "in" | "both";
}

const SCENES: readonly Scene[] = [
  { label: "GPIO_OUT 읽기", summary: "래치 값을 확인", read: "out", note: "GPIO_OUT을 읽으면 마지막에 설정한 출력 래치 값이 돌아옵니다. 핀까지 내려가서 본 값이 아니라 칩이 저장해 둔 값입니다." },
  { label: "GPIO_IN 읽기", summary: "핀 입력을 샘플링", read: "in", note: "핀의 실제 입력을 표본으로 읽는 GPIO_IN은 별도 레지스터입니다. 읽는 자리가 경로의 반대쪽 끝입니다." },
  { label: "둘을 같다고 보면 안 됩니다", summary: "래치 1 · 핀 전압은 보장 없음", read: "both", note: "외부 회로, 패드 설정, 핀 기능이 다르면 출력 래치가 1이어도 핀에서 예상한 전압을 보지 못할 수 있습니다. 주소에 쓰기만 성공했다고 장치가 실제로 반응했다고 결론 내리지 않습니다." },
];

function Stop({ title, detail, on }: { title: string; detail: string; on: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-center ${on ? "border-amber-600 bg-background" : "border-border"}`}>
      <strong className="block text-sm">{title}</strong>
      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{detail}</span>
    </div>
  );
}

export default function ReadbackViz() {
  return (
    <SceneShell
      eyebrow="쓴 값을 다시 읽기"
      title="두 레지스터는 경로의 서로 다른 끝을 읽습니다"
      description="왼쪽이 칩이 저장한 값, 오른쪽이 바깥과 맞닿은 연결점입니다."
      ariaLabel="GPIO_OUT과 GPIO_IN이 읽는 위치 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showOut = scene.read !== "in";
        const showIn = scene.read !== "out";
        return (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] items-stretch gap-2">
            <div className="flex min-w-0 flex-col gap-2">
              <Stop title="출력 래치" detail="값 1" on={showOut} />
              <p className={`text-center font-mono text-xs font-bold ${showOut ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/40"}`}>↑ GPIO_OUT<br />읽으면 1</p>
            </div>
            <div className="flex min-w-0 flex-col justify-start">
              <div className="rounded-lg border border-dashed border-border px-2 py-2 text-center text-xs leading-5 text-muted-foreground">
                → 핀 기능<br />→ 패드 설정
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <Stop title="GPIO5 핀" detail="외부 회로와 맞닿음 · 전압은 그림이 정하지 않음" on={showIn} />
              <p className={`text-center font-mono text-xs font-bold ${showIn ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/40"}`}>↑ GPIO_IN<br />읽으면 ?</p>
            </div>
          </div>
        );
      }}
    />
  );
}
