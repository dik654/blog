import ExplainedFormula from "@/components/ui/explained-formula";
import CoverageMatrixViz from "./viz/CoverageMatrixViz";

export default function Coverage() {
  return (
    <section id="coverage" data-teach-level="6" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">파일 60개를 독립 원본 10개로 셉니다</h2>
      <CoverageMatrixViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          해상도를 256 px로 고정한 설명용 표에서 generator-Z와 social codec이 만나는
          칸에는 파일 60개가 있습니다. 원본 묶음은 10개이고, 각 묶음에서 여섯 crop이
          나왔다는 가정입니다. <code>group 042-C</code>의 여섯 crop도 파일은 여섯 개지만
          이 칸의 독립 근거에는 1만 더합니다.
        </p>
        <p>
          반대로 generator-Y와 social codec이 만나는 칸은 0입니다. 다른 코덱의 파일이
          많아도 이 빈칸을 채우지 못합니다. 따라서 이 표는 관측한
          generator·codec·resolution 조합까지만 뒷받침합니다. 빈칸이나 아직 이름을 모르는
          생성 조건의 성능은 미확인으로 남습니다.
        </p>
      </div>
      <ExplainedFormula
        question="같은 조건의 파일에서 독립 원본 근거만 어떻게 셉니까?"
        idea={<>먼저 generator·codec·resolution이 같은 파일을 고르고, 각 파일의 source group ID를 집합에 넣어 중복을 없앱니다.</>}
        formula={String.raw`N_{g,c,256}=|\{\operatorname{group}(x):x\in D_{g,c,256}\}|`}
        annotatedFormula={String.raw`\begin{aligned}
D_{Z,S,256}&=\underbrace{\{x:g(x)=Z,\ c(x)=S,\ r(x)=256\}}_{\text{generator-Z · social codec · 256 px 파일 60개}},\\
U_{Z,S,256}&=\underbrace{\{\operatorname{group}(x):x\in D_{Z,S,256}\}}_{\text{각 파일을 원본 group으로 되돌린 집합}},\\
N_{Z,S,256}&=\underbrace{|\operatorname{unique}(U_{Z,S,256})|}_{\text{중복을 지운 독립 원본 수}}=10.
\end{aligned}`}
        operations={[
          { expression: String.raw`D_{Z,S,256}`, annotation: ["generator-Z·social codec·256 px 조건을 만족하는 파일만 선택", "설명용 파일 수 60개"] },
          { expression: String.raw`\operatorname{group}(x)`, annotation: ["각 파일의 parent chain에서 source group ID를 읽음", "group 042-C의 여섯 crop은 같은 ID 여섯 번"] },
          { expression: String.raw`\operatorname{unique}`, annotation: ["반복된 group ID를 하나로 접음", "파일 60개가 독립 원본 10개로 바뀜"] },
        ]}
        terms={[
          { symbol: "g", name: "생성 조건", description: "조작 영상을 만든 generator와 recipe를 구분하는 축입니다." },
          { symbol: "c", name: "유통 조건", description: "원본·JPEG·social codec처럼 다시 저장된 방식을 구분하는 축입니다." },
          { symbol: "group(x)", name: "원본 묶음", description: "파일 x를 원본 영상과 등장 인물의 독립 묶음으로 되돌린 ID입니다." },
        ]}
        assumptions={[
          "표의 모든 파일은 parent chain과 source group ID를 보존합니다.",
          "Generator·codec·resolution은 평가 전에 정한 같은 정의를 사용합니다.",
          "60개 파일·10개 group은 계산을 설명하기 위한 가정이며 실제 자료 측정값이 아닙니다.",
        ]}
        interpretation="Generator-Z·social codec·256 px 칸은 파일 60개가 아니라 독립 원본 10개의 근거를 가집니다. Generator-Y·social codec 칸은 0이므로 그 조건의 성능을 주장할 근거가 없습니다."
      />
    </section>
  );
}
