import ExplainedFormula from "@/components/ui/explained-formula";
import GeometricViz from "./viz/GeometricViz";

export default function Geometric() {
  return (
    <section id="geometric" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">기하 변환에서는 pixel과 annotation이 같은 좌표계를 써야 합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Flip, rotation, crop, affine transform은 위치·크기·방향이 달라져도 task의
          의미가 유지된다는 가정을 넣습니다. Classification에서는 label 하나가
          그대로일 수 있지만 detection의 box, segmentation mask, pose keypoint는
          pixel과 똑같은 geometric map을 적용해야 합니다. Random parameter를
          image와 annotation에 따로 뽑으면 눈으로는 그럴듯해도 target이 틀린
          training pair가 됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="Affine transform을 적용할 때 한 점과 bounding box 좌표를 어떻게 함께 옮길까?"
        idea={<>회전·scale·shear를 2×2 matrix A에, 평행 이동을 vector t에 넣습니다. Box는 네 모서리를 모두 같은 식으로 옮긴 뒤 transformed points를 감싸는 새 axis-aligned 범위를 계산합니다.</>}
        formula={String.raw`\begin{aligned}
p' &= Ap+t,\qquad p=\begin{bmatrix}u\\v\end{bmatrix} \\
B' &= \operatorname{bbox}\!\left(\{Ap_j+t\}_{j=1}^{4}\right)
\end{aligned}`}
        terms={[
          { symbol: "p=(u,v)", name: "image point", description: "Pixel·keypoint·box corner의 원래 image coordinates입니다." },
          { symbol: "A", name: "linear geometric map", description: "Rotation·scale·shear를 조합한 2×2 matrix입니다." },
          { symbol: "t", name: "translation", description: "Crop origin과 canvas 이동을 반영하는 2D vector입니다." },
          { symbol: "B′", name: "transformed box", description: "변환된 네 corner를 감싸는 axis-aligned bounding box입니다." },
        ]}
        assumptions={["Image와 annotation에 동일한 A와 t를 적용합니다.", "Coordinate convention·crop origin·inclusive/exclusive boundary를 library 설정과 맞춥니다."]}
        interpretation="회전한 box는 원래 box의 두 점만 옮겨서는 구할 수 없습니다. 네 corner를 모두 옮기고 crop 밖 좌표를 clip한 뒤 남은 object area 기준을 검사해야 합니다."
      />

      <div className="not-prose my-8"><GeometricViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>변환 범위는 camera와 object 통계에서 정합니다</h3>
        <p>
          모든 task에 통하는 rotation angle이나 crop ratio는 없습니다. 배포 camera
          pose, horizon, object size와 위치 분포에서 plausible range를 정하고 작은
          object가 crop 밖으로 사라지는 비율, interpolation blur, padding artifact를
          측정합니다. 의료 영상에서는 좌우 표기와 anatomical orientation처럼
          pixel 외 metadata까지 함께 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
