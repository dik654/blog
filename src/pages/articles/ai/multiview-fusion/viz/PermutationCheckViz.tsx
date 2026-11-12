import SceneShell from "./FusionSceneShell";

/**
 * 본문 대응: #overview 순열 불변 검사 — [정면, 측면, 위쪽]→[위쪽, 정면, 측면].
 * 표현값 2·5·8은 설명용 가정입니다. 평균 (2+5+8)/3 = 5는 순서와 무관하고,
 * 이어 붙인 벡터는 [2,5,8] → [8,2,5]로 자리별 값이 바뀝니다.
 */
const VALUE: Record<string, number> = { 정면: 2, 측면: 5, 위쪽: 8 };

const SCENES = [
  {
    label: "원래 나열 순서",
    summary: "평균 5 · 이어 붙이기 [2, 5, 8]",
    order: ["정면", "측면", "위쪽"],
    fixed: false,
    note: "세 사진의 표현을 평균하면 (2 + 5 + 8) ÷ 3 = 5입니다. 이어 붙이면 자리 1·2·3에 정면·측면·위쪽 값이 차례로 들어갑니다.",
  },
  {
    label: "순서만 바꾼 같은 묶음",
    summary: "평균 5 · 이어 붙이기 [8, 2, 5]",
    order: ["위쪽", "정면", "측면"],
    fixed: false,
    note: "사진 내용은 그대로이고 나열 순서만 바뀌었습니다. 평균은 합 15와 분모 3이 같아 여전히 5입니다. 이어 붙인 값은 자리 1에 위쪽 값이 들어가므로, 자리 1을 정면으로 배운 모델에게는 다른 입력이 됩니다.",
  },
  {
    label: "카메라 ID로 자리 고정",
    summary: "어떤 순서로 읽어도 [2, 5, 8]",
    order: ["정면", "측면", "위쪽"],
    fixed: true,
    note: "고정 카메라처럼 자리가 의미라면 파일을 읽은 순서와 관계없이 카메라 ID 순서로 다시 놓습니다. 그러면 자리 1은 늘 정면이므로 이어 붙이기도 쓸 수 있습니다.",
  },
] as const;

const CAMERA_COLOR: Record<string, string> = { 정면: "#2563eb", 측면: "#d97706", 위쪽: "#16a34a" };

export default function PermutationCheckViz() {
  return (
    <SceneShell
      eyebrow="순서 검사"
      title="순서를 바꿔도 평균은 그대로지만 이어 붙인 자리는 바뀝니다"
      description="표현은 인코더가 사진 한 장을 숫자로 바꾼 결과입니다. 실제로는 벡터지만 여기서는 사진마다 숫자 하나로 줄였고, 값 2·5·8은 설명용입니다(가정)."
      ariaLabel="같은 세 관측을 다른 순서로 넣었을 때 평균과 이어 붙이기 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const values = scene.order.map((name) => VALUE[name]);
        const mean = values.reduce<number>((sum, value) => sum + value, 0) / values.length;
        return (
          <div className="min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">
              {scene.fixed ? "카메라 ID 순서로 다시 놓은 입력" : "data loader가 넘긴 나열 순서"}
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {scene.order.map((name, slot) => (
                <div key={slot} className="rounded-lg border border-border px-2 py-1.5 text-center">
                  <span className="block text-[11px] text-muted-foreground">자리 {slot + 1}</span>
                  <span className="mt-1 block text-sm font-bold" style={{ color: CAMERA_COLOR[name] }}>{name}</span>
                  <span className="block font-mono text-sm">{VALUE[name]}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-xs font-semibold text-muted-foreground">평균 pooling</span>
                <span className="mt-1 block font-mono text-sm">({values.join(" + ")}) ÷ 3 = <strong>{mean}</strong></span>
                <span className="mt-1 block text-xs text-emerald-700 dark:text-emerald-400">세 장면 모두 5</span>
              </div>
              <div className={`rounded-lg border px-3 py-2 ${active === 1 ? "border-amber-600" : "border-border"}`}>
                <span className="block text-xs font-semibold text-muted-foreground">순서대로 이어 붙이기</span>
                <span className="mt-1 block font-mono text-sm">
                  [{values.map((value, index) => (
                    <span key={index}>
                      {index > 0 ? ", " : ""}
                      <strong style={{ color: CAMERA_COLOR[scene.order[index]] }}>{value}</strong>
                    </span>
                  ))}]
                </span>
                <span className={`mt-1 block text-xs ${active === 1 ? "font-semibold text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>
                  {active === 1 ? "자리 1 = 위쪽 값 (정면 아님)" : "자리 1 = 정면 값"}
                </span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
