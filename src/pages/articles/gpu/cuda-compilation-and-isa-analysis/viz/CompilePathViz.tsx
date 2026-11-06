import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pipeline — NVCC 문서 §3의 기본 경로. device 코드 → PTX → ptxas → 장치 코드, host 코드 → host compiler,
 * 필요한 장치 이미지가 배포 결과에 포함된다. 내부 도구 이름과 호출 순서는 일부러 그리지 않는다.
 */
const SCENES = [
  { label: "둘로 갈라짐", summary: "소스 → device · host", note: "한 소스에 GPU에서 돌 device 코드와 CPU에서 돌 host 코드가 함께 있습니다. 기본 경로는 두 부분을 서로 다른 길로 보냅니다." },
  { label: "device 경로", summary: "PTX → ptxas → 장치 코드", note: "device 코드는 PTX로 변환되고, 지정한 실제 대상에 대해 ptxas가 장치 코드를 만듭니다." },
  { label: "host 경로", summary: "host compiler", note: "Host 쪽 코드는 host compiler가 처리합니다. 장치 코드를 만드는 길과 따로 움직입니다." },
  { label: "배포 결과", summary: "주 프로그램 + 장치 이미지", note: "필요한 장치 이미지가 배포 결과에 포함됩니다. 분리 컴파일과 device link의 추가 단계는 그림 밖입니다." },
] as const;

function Box({ text, on, dim = false }: { text: string; on: boolean; dim?: boolean }) {
  return (
    <span
      className={`flex min-h-10 min-w-0 items-center justify-center rounded border px-1 py-1 text-center text-xs leading-4 break-keep ${
        on ? "border-primary bg-primary/10 font-semibold" : dim ? "border-border/60 text-muted-foreground/70" : "border-border bg-background"
      }`}
    >
      {text}
    </span>
  );
}

const Arrow = ({ on }: { on: boolean }) => (
  <span aria-hidden="true" className={`self-center text-center text-xs ${on ? "text-primary" : "text-muted-foreground/50"}`}>→</span>
);

const Join = ({ on, text }: { on: boolean; text: string }) => (
  <p className={`text-center text-xs ${on ? "font-semibold text-primary" : "text-muted-foreground/60"}`}>
    <span aria-hidden="true">↓ </span>
    {text}
  </p>
);

export default function CompilePathViz() {
  return (
    <SceneShell
      eyebrow="공개된 컴파일 단계"
      title="소스 하나가 두 길로 갈라졌다가 배포 결과에서 다시 만납니다"
      description="NVCC 문서 §3의 기본 경로입니다. 릴리스마다 달라질 수 있는 내부 단계는 넣지 않았습니다."
      ariaLabel="소스가 device 경로와 host 경로로 갈라져 배포 결과로 합쳐지는 기본 컴파일 경로"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-1.5">
          <Box text="소스 파일" on={active === 0} />
          <Join on={active === 0} text="두 길로 갈라짐" />
          <div>
            <p className="mb-1 text-xs font-semibold text-muted-foreground">device 쪽</p>
            <div className="grid grid-cols-[minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)] gap-1">
              <Box text="device 코드" on={active <= 1} dim={active === 2} />
              <Arrow on={active === 1} />
              <Box text="PTX" on={active === 1} dim={active !== 1 && active !== 3} />
              <Arrow on={active === 1} />
              <Box text="ptxas" on={active === 1} dim={active !== 1 && active !== 3} />
              <Arrow on={active === 1} />
              <Box text="장치 코드" on={active === 1 || active === 3} dim={active === 0 || active === 2} />
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold text-muted-foreground">host 쪽</p>
            <div className="grid grid-cols-[minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)] gap-1">
              <Box text="host 코드" on={active === 0 || active === 2} dim={active === 1} />
              <Arrow on={active === 2} />
              <Box text="host compiler" on={active === 2} dim={active !== 2 && active !== 3} />
              <Arrow on={active === 2} />
              <Box text="주 프로그램 부분" on={active === 2 || active === 3} dim={active < 2} />
            </div>
          </div>
          <Join on={active === 3} text="두 길의 결과가 만남" />
          <Box text={active === 3 ? "배포 결과 = 주 프로그램 부분 + 필요한 장치 이미지" : "배포 결과"} on={active === 3} dim={active !== 3} />
        </div>
      )}
    />
  );
}
