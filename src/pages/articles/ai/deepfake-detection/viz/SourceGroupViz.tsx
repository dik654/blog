import DeepfakeStageViz from "./DeepfakeStageViz";

const SCENES = [
  "파생본이 양쪽에 섞임",
  "원본 묶음으로 되돌림",
  "묶음 전체를 한쪽으로 이동",
  "교집합이 비었는지 검사",
] as const;

const NOTES = [
  "clip-042의 crop은 train에, 같은 frame의 JPEG는 test에 있습니다. 파일 hash는 달라도 같은 원본 증거가 양쪽에 들어간 누수입니다.",
  "두 파일의 source clip과 등장 인물을 따라 group=(clip-042, person-C) 하나로 되돌립니다. 파일 개수가 아니라 독립 원본 수가 평가 단위가 됩니다.",
  "clip-042에서 나온 frame·crop·재인코딩을 모두 test로 옮깁니다. 한 파일만 옮기면 원본 증거가 여전히 남습니다.",
  "train group과 test group의 교집합이 0일 때 source-independent split을 통과합니다. 이 검사는 generator holdout을 대신하지 않습니다.",
] as const;

const STAGES = [
  { title: "누수", detail: "같은 원본의 crop과 JPEG가 train·test에 분산" },
  { title: "묶음 복원", detail: "두 파일 모두 group 042-C" },
  { title: "한쪽으로 이동", detail: "group 042-C 전체를 test에 배치" },
  { title: "교집합 검사", detail: "Gtrain ∩ Gtest = ∅" },
] as const;

function FileChip({ children, muted = false }: { children: string; muted?: boolean }) {
  return (
    <span className={`block border px-3 py-2 font-mono text-[11px] leading-4 ${muted ? "border-border text-muted-foreground line-through" : "border-primary/35 text-foreground"}`}>
      {children}
    </span>
  );
}

export default function SourceGroupViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-source-group-split"
      eyebrow="자료 분리"
      title="파일을 먼저 나누면 같은 시험 문제가 양쪽에 남습니다"
      description="누수가 있는 manifest를 원본 묶음으로 복원하고, 묶음 전체를 이동한 뒤 교집합을 검사합니다."
      note="파일 이름과 group key는 설명용 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => {
        const moved = active >= 2;
        return (
          <div>
            <div className="grid grid-cols-[1fr_5rem_1fr] items-stretch gap-4">
              <section className="border-y border-border px-4 py-4" aria-label="학습 manifest">
                <p className="text-[11px] font-bold text-muted-foreground">TRAIN MANIFEST</p>
                <div className="mt-3 space-y-2">
                  <FileChip>clip-017/original.mp4 · group 017-A</FileChip>
                  <FileChip muted={moved}>clip-042/frame120-crop.png · group 042-C</FileChip>
                </div>
              </section>
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[11px] text-muted-foreground">공유 group</span>
                <strong className={`mt-2 font-mono text-xl ${active === 3 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
                  {active === 3 ? "0" : "1"}
                </strong>
                <span className="mt-1 text-[11px] font-bold">{active === 3 ? "통과" : "누수"}</span>
              </div>
              <section className="border-y border-border px-4 py-4" aria-label="시험 manifest">
                <p className="text-[11px] font-bold text-muted-foreground">TEST MANIFEST</p>
                <div className="mt-3 space-y-2">
                  {moved ? <FileChip>clip-042/frame120-crop.png · group 042-C</FileChip> : null}
                  <FileChip>clip-042/frame120-social.jpg · group 042-C</FileChip>
                  <FileChip>clip-108/original.mp4 · group 108-D</FileChip>
                </div>
              </section>
            </div>
            <p className={`mt-4 text-center font-mono text-xs font-bold ${active === 3 ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}>
              {active === 3 ? "G_train ∩ G_test = ∅" : "group 042-C를 파일보다 먼저 추적"}
            </p>
          </div>
        );
      }}
    </DeepfakeStageViz>
  );
}
