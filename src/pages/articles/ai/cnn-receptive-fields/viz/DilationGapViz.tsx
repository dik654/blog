import ReceptiveRows from "./ReceptiveRows";
import SceneShell from "./ReceptiveSceneShell";

/**
 * 본문 대응: #dilation — k=3, d=2는 tap 3개로 span 2×(3−1)+1 = 5, 좌표 0·2·4를 읽고 1·3을 건너뜀.
 * 두 층 조합은 그림용 가정이며 값은 r_l = r_{l-1} + (k−1)·d·j_{l-1}(j=1)로 계산:
 * d=2 두 층 → 1+4+4 = 9칸, 읽는 좌표 0·2·4·6·8 / d=1 다음 d=2 → 1+2+4 = 7칸, 1~7 모두 읽음.
 */
const SINGLE_DENSE = [
  { label: "입력", d: 1 },
  { label: "층 1", d: 1 },
  { label: "층 2", d: 1 },
] as const;
const SINGLE_DILATED = [
  { label: "입력", d: 1 },
  { label: "층 1", d: 2 },
  { label: "층 2", d: 2 },
] as const;
const MIXED = [
  { label: "입력", d: 1 },
  { label: "층 1", d: 1 },
  { label: "층 2", d: 2 },
] as const;

const SCENES = [
  {
    label: "Dense 3칸",
    summary: "d=1 · span 3 · 읽음 0·1·2",
    rows: SINGLE_DENSE,
    top: 1,
    pos: 1,
    note: "비교 기준입니다. Dilation 1이면 tap 세 개가 이웃한 세 좌표 0·1·2를 빠짐없이 읽습니다.",
  },
  {
    label: "Dilation 2",
    summary: "2×(3−1)+1 = 5칸 · 읽음 0·2·4",
    rows: SINGLE_DILATED,
    top: 1,
    pos: 2,
    note: "학습하는 tap은 여전히 세 개입니다. Tap 사이를 두 칸씩 벌려 span은 다섯 칸이 되지만, 이 layer는 빨간 점선의 1·3을 건너뜁니다.",
  },
  {
    label: "d=2를 두 번",
    summary: "5 + (3−1)×2 = 9칸 · 1·3·5·7 건너뜀",
    rows: SINGLE_DILATED,
    top: 2,
    pos: 4,
    note: "같은 d=2 layer를 한 번 더 쌓은 예입니다(가정). 범위는 0~8의 아홉 칸으로 넓어지지만 tap 간격이 모두 짝수라 1·3·5·7은 어느 경로로도 읽히지 않습니다. 본문이 경계로 든, 촘촘한 local evidence가 빠지는 모양입니다.",
  },
  {
    label: "d=1 뒤 d=2",
    summary: "3 + (3−1)×2 = 7칸 · 빈칸 없음",
    rows: MIXED,
    top: 2,
    pos: 4,
    note: "아래층을 d=1로 바꾼 예입니다(가정). 아래층의 이웃 세 칸이 위층 tap 사이를 메워 이 조합에서는 1~7이 모두 읽힙니다. 어떤 조합을 고를지는 이 글이 다루지 않습니다.",
  },
] as const;

export default function DilationGapViz() {
  return (
    <SceneShell
      eyebrow="Dilation의 빈 좌표"
      title="Tap 간격을 벌리면 범위는 넓어지지만 건너뛰는 좌표가 생깁니다"
      description="칸 하나가 한 축의 좌표이고 모든 층은 k=3·stride 1입니다. d는 tap 사이 input 간격입니다. 빨간 점선 칸은 범위 안에 있지만 읽히지 않는 좌표입니다."
      ariaLabel="dilation 1과 2, 그리고 두 층 조합에서 읽는 좌표와 건너뛰는 좌표 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <ReceptiveRows
            rows={scene.rows}
            topLayer={scene.top}
            topPos={scene.pos}
            ariaLabel={`${scene.label}: ${scene.summary}`}
          />
        );
      }}
    />
  );
}
