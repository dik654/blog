import SceneShell from "./SceneShell";

/**
 * 본문 대응: #manifest — 최종 B 파일에서 실행·입력·파일 버전을 거슬러 찾는다.
 * 전체 자료로 재학습하면 새 실행·seed·새 모델 파일을 이전 평가 후보에 연결한다.
 * 목록만 있고 과거 파일을 읽을 수 없으면 재전송·복원이 안 될 수 있다.
 */
type Row = { label: string; detail: string; changed?: boolean };

const BASE: readonly Row[] = [
  { label: "최종 파일", detail: "제출한 파일의 digest" },
  { label: "제출 생성", detail: "실행 환경 · batch 설정 · 후처리 버전 · 행 수와 순서 · 누락·중복·허용 범위 검사" },
  { label: "모델 파일", detail: "평가 때 쓴 후보 B의 모델 파일" },
  { label: "실행", detail: "후보 B의 run ID" },
  { label: "입력", detail: "코드 · 자료 · 분할 · 전처리 버전" },
];

const RETRAIN: readonly Row[] = BASE.map((row) =>
  row.label === "모델 파일"
    ? { label: "모델 파일", detail: "전체 학습 자료로 다시 학습한 새 모델 파일", changed: true }
    : row.label === "실행"
      ? { label: "실행", detail: "새 run ID와 seed → 이전 평가 후보 B의 실행에 연결", changed: true }
      : row,
);

const SCENES = [
  { label: "후보 B를 그대로 제출", summary: "파일 → 생성 → 모델 → 실행 → 입력", rows: BASE, kept: true, note: "최종 파일에서 한 칸씩 내려가며 그 파일을 만든 설정과 모델, 실행, 입력 버전을 찾을 수 있어야 합니다." },
  { label: "전체 자료로 재학습", summary: "새 실행·seed·모델을 평가 후보에 연결", rows: RETRAIN, kept: true, note: "전체 학습 자료로 다시 학습했다면 새 실행과 seed, 새 모델 파일을 기록하고 이전 평가 후보 B에 연결합니다." },
  { label: "목록만 남긴 경우", summary: "버전 이름은 있으나 파일이 없음", rows: BASE, kept: false, note: "버전 목록만 있고 과거 파일을 보관하지 않았거나 읽을 수 없으면 같은 내용의 재전송이나 복원이 안 될 수 있습니다." },
] as const;

export default function ManifestLineageViz() {
  return (
    <SceneShell
      eyebrow="최종 파일에서 거슬러 가기"
      title="최종 B 파일 아래로 실행과 입력이 줄지어 연결됩니다"
      description="위가 제출한 파일이고 아래로 갈수록 그것을 만든 앞 단계입니다. ↑는 아래 칸이 위 칸을 만든다는 뜻이고, 추적은 위에서 아래로 거슬러 갑니다. 칸마다 버전을 기록하고 실제 파일을 보관합니다."
      ariaLabel="최종 제출 파일에서 제출 생성, 모델 파일, 실행, 입력 버전으로 거슬러 가는 연결"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <ol className="min-w-0 space-y-1.5">
            {scene.rows.map((row, index) => (
              <li key={row.label} className="min-w-0">
                {index > 0 && <span className="block pl-[2.6rem] text-xs leading-4 text-muted-foreground" aria-hidden="true">↑</span>}
                <div
                  className={`grid min-h-[3.25rem] grid-cols-[4.75rem_minmax(0,1fr)_3.5rem] items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs leading-5 ${
                    row.changed ? "border-primary bg-background" : scene.kept ? "border-border bg-background" : "border-dashed border-border"
                  }`}
                >
                  <span className="font-semibold">{row.label}</span>
                  <span className={row.changed ? "font-semibold text-primary" : "text-muted-foreground"}>{row.detail}</span>
                  <span className={`text-right text-[11px] font-semibold ${scene.kept ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"}`}>
                    {scene.kept ? "파일 보관" : "이름만"}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        );
      }}
    />
  );
}
