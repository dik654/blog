import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import { BRANCH_RESULTS, ERROR_COUNTS } from "../trace";

const SCENES = [
  "같은 열 개 sample ID를 맞춤",
  "RGB 분기의 세 오류를 표시",
  "주파수 분기의 네 오류를 표시",
  "겹치는 두 오류를 교집합으로 셈",
] as const;

const NOTES = [
  "S01부터 S10까지 같은 held-out 샘플을 두 분기에 넣습니다. 서로 다른 샘플 수의 정확도를 비교하면 공동 오류를 셀 수 없습니다.",
  "RGB 분기는 S02·S06·S09 세 개를 틀렸습니다. 오류율은 3/10=0.30입니다.",
  "주파수 분기는 S02·S04·S06·S10 네 개를 틀렸습니다. 오류율은 4/10=0.40입니다.",
  "두 분기가 함께 틀린 것은 S02·S06 두 개이므로 공동 오류율은 2/10=0.20입니다. RGB만 실패 1개, 주파수만 실패 2개도 따로 남습니다.",
] as const;

const STAGES = [
  { title: "샘플", detail: "S01–S10" },
  { title: "RGB", detail: "오류 3" },
  { title: "주파수", detail: "오류 4" },
  { title: "교집합", detail: "공동 오류 2" },
] as const;

function ResultRow({
  label,
  visible,
  values,
  joint,
}: {
  label: string;
  visible: boolean;
  values: readonly boolean[];
  joint?: readonly boolean[];
}) {
  return (
    <div className={`grid grid-cols-[5rem_repeat(10,minmax(0,1fr))] gap-px bg-border p-px transition-opacity ${visible ? "opacity-100" : "opacity-20"}`}>
      <strong className="flex items-center bg-background px-2 text-[10px] leading-4">{label}</strong>
      {values.map((isError, index) => {
        const isJoint = joint?.[index];
        return (
          <span
            key={`${label}-${index}`}
            className={`flex min-h-10 items-center justify-center bg-background font-mono text-[10px] font-black ${
              isJoint ? "!bg-destructive/15 text-destructive" : isError ? "!bg-primary/10 text-primary" : "text-muted-foreground"
            }`}
          >
            {isError ? "오류" : "정상"}
          </span>
        );
      })}
    </div>
  );
}

export default function JointErrorViz() {
  const rgb = BRANCH_RESULTS.map((row) => row.rgbError);
  const frequency = BRANCH_RESULTS.map((row) => row.frequencyError);
  const joint = BRANCH_RESULTS.map((row) => row.rgbError && row.frequencyError);

  return (
    <DeepfakeStageViz
      id="deepfake-joint-error"
      eyebrow="공동 오류"
      title="정확도 두 개 대신 같은 sample의 오류 겹침을 봅니다"
      description="샘플 순서를 고정한 뒤 RGB와 주파수 분기의 오류를 같은 열에 놓고 교집합을 셉니다."
      note="샘플 ID와 판정은 집합 계산을 설명하기 위한 가정입니다."
      scenes={SCENES}
      notes={NOTES}
      stages={STAGES}
    >
      {(active) => (
        <div className="space-y-3 overflow-x-auto pb-1">
          <div className="grid min-w-[34rem] grid-cols-[5rem_repeat(10,minmax(0,1fr))] gap-px bg-border p-px">
            <strong className="flex items-center bg-background px-2 text-[10px]">ID</strong>
            {BRANCH_RESULTS.map((row) => (
              <span key={row.sample} className="flex min-h-9 items-center justify-center bg-background font-mono text-[10px] font-bold">{row.sample}</span>
            ))}
          </div>
          <div className="min-w-[34rem] space-y-2">
            <ResultRow label="RGB" values={rgb} visible={active >= 1} />
            <ResultRow label="주파수" values={frequency} visible={active >= 2} />
            <ResultRow label="공동 오류" values={joint} joint={joint} visible={active >= 3} />
          </div>
          <p className={`min-w-[34rem] border-l border-primary/50 pl-3 text-xs font-bold transition-opacity ${active >= 3 ? "opacity-100" : "opacity-20"}`}>
            공동 오류 {ERROR_COUNTS.joint}/{ERROR_COUNTS.total} = 0.20 · RGB만 {ERROR_COUNTS.rgbOnly} · 주파수만 {ERROR_COUNTS.frequencyOnly}
          </p>
        </div>
      )}
    </DeepfakeStageViz>
  );
}
