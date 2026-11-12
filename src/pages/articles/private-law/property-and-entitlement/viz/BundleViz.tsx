import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bundle — 소유는 권능의 묶음. 세를 주면 쓰는 권능을 기간을 정해 넘기고,
 * 기간이 끝나면 저절로 돌아오며, 담보로 잡히면 갚지 않을 때 팔아 값을 받을 권능을 넘긴다.
 * 행 위치(왼쪽·오른쪽)가 지금 누가 그 권능을 쥐는지를 뜻한다.
 */
const POWERS = [
  "쓰는 권능",
  "거기서 나오는 것을 가져가는 권능",
  "남을 배제하는 권능",
  "넘기거나 없앨 권능",
  "갚지 않을 때 팔아 값을 받을 권능",
] as const;

const SCENES = [
  {
    label: "묶음이 전부 내 손에",
    summary: "본문이 꼽은 네 권능 모두 소유자",
    object: "내 집",
    other: "다른 사람",
    moved: [] as number[],
    shown: 4,
    note: "소유를 한 덩어리가 아니라 본문이 꼽은 네 가닥으로 나눠 봅니다. 아직 아무것도 떼어 주지 않았으므로 모든 가닥이 소유자에게 있습니다.",
  },
  {
    label: "세를 준 집",
    summary: "쓰는 권능만 기간을 정해 넘김",
    object: "세를 준 집",
    other: "세 든 사람",
    moved: [0],
    shown: 4,
    note: "세를 주는 것은 쓰는 권능을 기간을 정해 넘기는 것입니다. 나머지 가닥은 그대로 소유자에게 남습니다.",
  },
  {
    label: "기간이 끝나면",
    summary: "쓰는 권능이 저절로 돌아옴",
    object: "세를 준 집",
    other: "세 든 사람",
    moved: [] as number[],
    shown: 4,
    note: "떼어 준 것을 빼고 남은 전부가 자기에게 돌아온다는 점이 소유권의 강함입니다. 기간이 끝나면 쓰는 권능이 저절로 되돌아옵니다.",
  },
  {
    label: "담보로 잡힌 땅",
    summary: "갚지 않을 때 팔 권능만 넘김",
    object: "담보로 잡힌 땅",
    other: "담보를 잡은 쪽",
    moved: [4],
    shown: 5,
    note: "담보로 잡히는 것은 갚지 않을 때 팔아 값을 받을 권능을 넘기는 것입니다. 이 가닥은 본문이 담보 예에서 따로 이름 붙인 권능이라 이 장면에서 더해 그렸습니다. 쓰는 권능을 포함한 나머지는 그대로 두고 필요한 조각만 옮깁니다.",
  },
] as const;

const ROWS = POWERS.map((_, i) => i);

export default function BundleViz() {
  return (
    <SceneShell
      eyebrow="권능의 묶음"
      title="필요한 가닥만 떼어 주고 나머지는 남습니다"
      description="한 줄이 권능 하나이고, 그 줄이 왼쪽에 있으면 소유자가, 오른쪽에 있으면 상대가 쥐고 있습니다. 집과 땅은 본문의 두 예를 따로 그린 것입니다."
      ariaLabel="소유를 권능의 묶음으로 보고 세와 담보에서 어느 가닥이 옮겨 가는지 보이는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const moved: readonly number[] = scene.moved;
        return (
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">대상: {scene.object}</p>
            <div className="grid grid-cols-2 gap-x-3 border-b border-border pb-1 text-xs font-bold sm:gap-x-6">
              <span>소유자</span>
              <span className="text-right sm:text-left">{scene.other}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {ROWS.map((i) => {
                const visible = i < scene.shown;
                const right = moved.includes(i);
                const pill = (
                  <span
                    className={`block rounded-md border px-2 py-1.5 text-xs leading-4 sm:text-sm sm:leading-5 ${
                      right ? "border-amber-600 bg-amber-50 font-semibold text-amber-900 dark:bg-amber-950/40 dark:text-amber-200" : "border-indigo-400 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200"
                    }`}
                  >
                    {POWERS[i]}
                  </span>
                );
                return (
                  <li key={i} className={`grid grid-cols-2 items-center gap-x-3 sm:gap-x-6 ${visible ? "" : "invisible"}`} aria-hidden={!visible}>
                    <span className="min-w-0">{right ? <span className="block rounded-md border border-dashed border-border px-2 py-1.5 text-xs leading-4 text-muted-foreground sm:text-sm sm:leading-5">떼어 줌</span> : pill}</span>
                    <span className="min-w-0">{right ? pill : null}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }}
    />
  );
}
