import { useState } from "react";

const applications = [
  {
    id: "denoise",
    title: "Denoising",
    input: "손상된 입력 x̃",
    target: "깨끗한 target x",
    output: "복원 x̂",
    check: "Noise 종류가 배포 환경과 맞는지 확인",
  },
  {
    id: "anomaly",
    title: "Anomaly detection",
    input: "정상 중심의 training data",
    target: "입력 자체",
    output: "Sample별 reconstruction score",
    check: "정상·이상 score가 실제로 분리되는지 검증",
  },
  {
    id: "pretrain",
    title: "Representation pretraining",
    input: "가리거나 손상한 관측값",
    target: "숨긴 원본 정보",
    output: "Downstream용 encoder",
    check: "Linear probe·fine-tuning으로 usefulness 확인",
  },
];

export default function ApplicationsViz() {
  const [selected, setSelected] = useState(0);
  const application = applications[selected];

  return (
    <figure data-viz="autoencoder-applications" className="not-prose my-8 min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
      <figcaption className="mb-4 text-sm font-semibold">같은 encoder–decoder라도 target과 평가 기준이 달라집니다</figcaption>
      <div className="mb-5 flex max-w-full gap-2 overflow-x-auto pb-1">
        {applications.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(index)}
            className={`shrink-0 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${selected === index ? "border-primary/45 bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {[["학습 입력", application.input], ["정답", application.target], ["얻는 값", application.output]].map(([label, value]) => (
          <div key={label} className="min-w-0 border-t border-border bg-background px-1 pt-4">
            <p className="text-xs font-bold text-primary/70">{label}</p>
            <p className="mt-2 text-sm font-semibold leading-6">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 border-l border-rose-500/45 pl-4 text-sm leading-6 text-muted-foreground">
        실패 조건: {application.check}
      </p>
    </figure>
  );
}
