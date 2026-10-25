import DeepfakeStageViz from "../../deepfake-detection/viz/DeepfakeStageViz";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { COVERAGE_CELLS, GROUP_042_SOCIAL_FILES } from "../trace";

const GENERATORS = ["generator-X", "generator-Y", "generator-Z"] as const;
const CODECS = ["원본", "JPEG q70", "social codec"] as const;

const SCENES = ["조건별 파일 수 확인", "Source group 중복 제거", "Z·social 칸을 추적", "빈칸의 주장 중지"] as const;

const NOTES = [
  "256 px로 고정한 표입니다. 파일 수는 X 행 240·228·204, Y 행 132·120·0, Z 행 72·66·60입니다.",
  "각 파일을 source group으로 되돌려 중복을 없애면 독립 원본 수는 X 40·38·34, Y 22·20·0, Z 12·11·10입니다.",
  `Generator-Z·social codec의 파일 60개는 독립 원본 10개에서 왔습니다. Group 042-C의 ${GROUP_042_SOCIAL_FILES.length}개 crop도 그중 근거 1개입니다.`,
  "Generator-Y·social codec 칸은 파일과 독립 원본이 모두 0입니다. 다른 칸의 자료로 이 조건의 성능을 주장하지 않습니다.",
] as const;

const STAGES = [
  { title: "파일", detail: "파생본 개수 확인" },
  { title: "원본 묶음", detail: "중복을 뺀 원본 수" },
  { title: "조건 칸", detail: "Z · social: 60 → 10" },
  { title: "빈 조건", detail: "Y · social: 0 · 미확인" },
] as const;

function cell(generator: (typeof GENERATORS)[number], codec: (typeof CODECS)[number]) {
  const found = COVERAGE_CELLS.find((item) => item.generator === generator && item.codec === codec);
  if (!found) throw new Error(`coverage cell을 찾을 수 없습니다: ${generator}/${codec}`);
  return found;
}

export default function CoverageMatrixViz() {
  return (
    <DeepfakeStageViz
      id="deepfake-coverage-matrix"
      eyebrow="조건별 근거"
      title="같은 표에서 파일 수와 독립 원본 수를 나눠 봅니다"
      description="행은 generator, 열은 codec이며 해상도는 256 px로 고정한 설명용 slice입니다."
      note="모든 개수는 집계 방법을 설명하기 위한 가정입니다."
      scenes={SCENES}
      controlLabels={STAGES.map((stage) => stage.title)}
      notes={NOTES}
      stages={STAGES}
      showChildrenOnMobile
    >
      {(active) => {
        const rows = GENERATORS.map((generator) => [
          generator,
          ...CODECS.map((codec) => {
            const value = cell(generator, codec);
            const selected =
              (active === 2 && generator === "generator-Z" && codec === "social codec") ||
              (active === 3 && generator === "generator-Y" && codec === "social codec");

            return (
              <span
                key={codec}
                className={`block min-w-0 border-l-2 pl-2 ${
                  selected ? "border-primary bg-primary/10 py-1" : "border-transparent"
                }`}
              >
                <strong className={value.groups === 0 ? "text-destructive" : "text-foreground"}>
                  {active === 0 ? value.files : value.groups}
                </strong>
                <span className="ml-1 text-[10px] text-muted-foreground">
                  {active === 0 ? "files" : "groups"}
                </span>
                {active >= 1 ? (
                  <span className="mt-1 block text-[10px] text-muted-foreground">
                    {value.files} files
                  </span>
                ) : null}
              </span>
            );
          }),
        ]);

        return (
          <ResponsiveVizTable
            columns={["Generator", ...CODECS]}
            rows={rows}
            desktopMinWidthClassName="min-w-[34rem]"
            firstColumnClassName="font-mono text-[11px]"
          />
        );
      }}
    </DeepfakeStageViz>
  );
}
