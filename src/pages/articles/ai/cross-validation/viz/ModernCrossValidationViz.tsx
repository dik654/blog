import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type Shape = "rows" | "split" | "model" | "target" | "group" | "clock" | "score";
type Item = { label: string; note: string; shape: Shape; accent?: boolean };
type Scene = { label: string; title: string; note: string; items: Item[] };

function Glyph({ item, x }: { item: Item; x: number }) {
  const stroke = item.accent ? "var(--primary)" : "var(--border)";
  const fill = item.accent ? "var(--primary)" : "var(--muted-foreground)";
  return (
    <motion.g
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {item.shape === "rows" && (
        <g>
          {[0, 1, 2, 3].map((row) => (
            <rect
              key={row}
              x={x - 31}
              y={70 + row * 16}
              width="62"
              height="11"
              rx="2"
              fill={fill}
              fillOpacity={row === 3 ? 0.18 : 0.07}
              stroke={stroke}
              strokeWidth="1"
            />
          ))}
        </g>
      )}
      {item.shape === "split" && (
        <g>
          <rect x={x - 34} y="72" width="68" height="54" rx="5" fill="var(--background)" stroke={stroke} strokeWidth="1.25" />
          <path d={`M${x - 11} 72 V126 M${x + 12} 72 V126`} stroke={stroke} strokeWidth="1" />
          <rect x={x + 13} y="73" width="20" height="52" fill={fill} fillOpacity=".14" />
        </g>
      )}
      {item.shape === "model" && (
        <path d={`M${x} 67 L${x + 35} 99 L${x} 131 L${x - 35} 99 Z`} fill={fill} fillOpacity=".08" stroke={stroke} strokeWidth="1.25" />
      )}
      {item.shape === "target" && (
        <g>
          <circle cx={x} cy="99" r="31" fill={fill} fillOpacity=".07" stroke={stroke} strokeWidth="1.25" />
          <circle cx={x} cy="99" r="14" fill="none" stroke={stroke} strokeWidth="1" />
          <circle cx={x} cy="99" r="3" fill={fill} />
        </g>
      )}
      {item.shape === "group" && (
        <g>
          <circle cx={x - 16} cy="87" r="13" fill={fill} fillOpacity=".09" stroke={stroke} />
          <circle cx={x + 17} cy="87" r="13" fill={fill} fillOpacity=".09" stroke={stroke} />
          <circle cx={x} cy="116" r="13" fill={fill} fillOpacity=".09" stroke={stroke} />
          <path d={`M${x - 10} 97 L${x - 4} 105 M${x + 10} 97 L${x + 4} 105`} stroke={stroke} />
        </g>
      )}
      {item.shape === "clock" && (
        <g>
          <circle cx={x} cy="99" r="31" fill="var(--background)" stroke={stroke} strokeWidth="1.25" />
          <path d={`M${x} 99 V80 M${x} 99 L${x + 15} 109`} stroke={stroke} strokeWidth="1.25" strokeLinecap="round" />
        </g>
      )}
      {item.shape === "score" && (
        <g>
          <path d={`M${x - 33} 126 V72 M${x - 33} 126 H${x + 34}`} stroke={stroke} strokeWidth="1.25" />
          <motion.path
            d={`M${x - 26} 115 L${x - 9} 100 L${x + 8} 106 L${x + 29} 79`}
            fill="none"
            stroke={fill}
            strokeWidth="1.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45 }}
          />
        </g>
      )}
      <text x={x} y="96" textAnchor="middle" className="fill-foreground text-[10px] font-bold">
        {item.label}
      </text>
      <text x={x} y="111" textAnchor="middle" className="fill-muted-foreground text-[8px]">
        {item.note}
      </text>
    </motion.g>
  );
}

function ValidationSceneViz({
  id,
  eyebrow,
  title,
  description,
  scenes,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  scenes: Scene[];
}) {
  const controls = useAnimatedScenes(scenes.length, 2700);
  const scene = scenes[controls.active];
  const gap = 270 / Math.max(scene.items.length - 1, 1);
  return (
    <VizFrame title={title} description={description} className="my-8">
      <div
        id={id}
        data-viz
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
          {eyebrow} · {String(controls.active + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-7">{scene.title}</h3>
        <div data-viz-canvas className="min-w-0">
          <svg viewBox="0 0 360 198" role="img" aria-label={`${scene.label}: ${scene.title}`} className="mx-auto mt-5 block h-auto w-full max-w-[560px] overflow-visible">
            <defs>
              <marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill="var(--muted-foreground)" />
              </marker>
            </defs>
            {scene.items.slice(0, -1).map((_, index) => (
              <motion.line
                key={index}
                x1={45 + index * gap + 36}
                y1="99"
                x2={45 + (index + 1) * gap - 36}
                y2="99"
                stroke="var(--muted-foreground)"
                strokeWidth="1.25"
                markerEnd={`url(#${id}-arrow)`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: index * 0.1 }}
              />
            ))}
            {scene.items.map((item, index) => (
              <Glyph key={`${scene.label}-${index}`} item={item} x={45 + index * gap} />
            ))}
            <path d="M45 160 H315" stroke="var(--border)" strokeWidth="1" />
            {scenes.map((_, index) => (
              <circle key={index} cx={45 + index * (270 / Math.max(scenes.length - 1, 1))} cy="160" r="4" fill={index === controls.active ? "var(--primary)" : "var(--muted-foreground)"} />
            ))}
          </svg>
        </div>
        <p className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{scene.note}</p>
        <AnimatedSceneControls labels={scenes.map((item) => item.label)} {...controls} />
      </div>
    </VizFrame>
  );
}

export const ValidationRiskViz = () => (
  <ValidationSceneViz
    id="validation-risk-modern"
    eyebrow="Question before split"
    title="배포에서 새로 만날 물체가 split의 모양을 결정합니다"
    description="Row를 먼저 섞지 않고 배포 질문→독립 단위→loss→split 순서로 이동합니다."
    scenes={[
      { label: "Deploy", title: "먼저 배포에서 무엇을 새로 만나는지 묻습니다", note: "새 row, 새 환자, 다음 달, 새 site의 다음 달은 서로 다른 prediction question입니다.", items: [{ label: "deploy", note: "question", shape: "target", accent: true }, { label: "unit", note: "what is new", shape: "group" }] },
      { label: "Unit", title: "Loss를 평균낼 독립에 가까운 단위를 고정합니다", note: "한 환자의 patch 5,000개는 새 환자 5,000명을 뜻하지 않습니다.", items: [{ label: "rows", note: "many records", shape: "rows" }, { label: "entity", note: "one cause", shape: "group", accent: true }] },
      { label: "Risk", title: "그 단위에서 model이 낼 loss의 기대값을 목표로 둡니다", note: "Validation score는 숫자 하나가 아니라 어느 배포 분포의 어떤 loss인지까지 포함한 estimand입니다.", items: [{ label: "model", note: "procedure", shape: "model" }, { label: "loss", note: "new unit", shape: "target", accent: true }] },
      { label: "Split", title: "마지막에 질문을 흉내 내는 split family를 고릅니다", note: "새 row는 K-fold, 새 entity는 group, 미래는 walk-forward, 새 site의 미래는 group×time이 출발점입니다.", items: [{ label: "question", note: "fixed", shape: "target" }, { label: "split", note: "matched", shape: "split", accent: true }] },
    ]}
  />
);

export const FoldLocalViz = () => (
  <ValidationSceneViz
    id="fold-local-modern"
    eyebrow="Information boundary"
    title="Validation row는 transform을 fit할 때도 보이지 않아야 합니다"
    description="Fold manifest→train fit→validation transform→선택 뒤 full refit을 분리합니다."
    scenes={[
      { label: "Assign", title: "행마다 fold ID를 먼저 고정합니다", note: "Fold assignment가 바뀌면 preprocessing state와 prediction provenance도 함께 바뀝니다.", items: [{ label: "rows", note: "row IDs", shape: "rows" }, { label: "fold", note: "manifest", shape: "split", accent: true }] },
      { label: "Fit", title: "Scaler·imputer·vocabulary는 train fold에서만 배웁니다", note: "Validation 평균이나 category frequency가 fitted state에 들어오면 label을 보지 않았어도 누출입니다.", items: [{ label: "train", note: "fit data", shape: "rows", accent: true }, { label: "state", note: "mean·vocab", shape: "model" }] },
      { label: "Apply", title: "Validation에는 저장된 state로 transform만 적용합니다", note: "Unknown category와 missing fallback도 이 단계에서 고정된 규칙으로 처리합니다.", items: [{ label: "state", note: "frozen", shape: "model" }, { label: "valid", note: "transform", shape: "rows", accent: true }] },
      { label: "Refit", title: "선택이 끝난 뒤에만 전체 training data로 다시 fit합니다", note: "Full-data refit은 final holdout을 여전히 보지 않는다는 조건 아래 deployment artifact를 만듭니다.", items: [{ label: "select", note: "frozen", shape: "target" }, { label: "all train", note: "refit", shape: "model", accent: true }] },
    ]}
  />
);

export const OofRiskViz = () => (
  <ValidationSceneViz
    id="oof-risk-modern"
    eyebrow="Unseen prediction"
    title="각 행은 자신을 학습하지 않은 model에게서 prediction 하나를 받습니다"
    description="Fold prediction→row 위치 복원→pooled loss→procedure 해석 순서입니다."
    scenes={[
      { label: "Hold", title: "한 fold를 잠시 validation으로 빼 둡니다", note: "그 fold의 행은 model과 fitted transform을 만드는 데 참여하지 않습니다.", items: [{ label: "folds", note: "K parts", shape: "split" }, { label: "held", note: "unseen", shape: "rows", accent: true }] },
      { label: "Predict", title: "나머지 fold로 fit해 held-out 행만 예측합니다", note: "이 과정을 모든 fold에 반복하면 모든 training row에 정확히 한 OOF prediction이 생깁니다.", items: [{ label: "train", note: "K−1 folds", shape: "rows" }, { label: "model", note: "fit", shape: "model" }, { label: "OOF", note: "held rows", shape: "target", accent: true }] },
      { label: "Pool", title: "Fold 평균이 아니라 원래 행과 weight로 다시 모읍니다", note: "20행 loss .2와 80행 loss .4는 equal-fold .3이 아니라 pooled-row .36입니다.", items: [{ label: "OOF", note: "row order", shape: "rows" }, { label: "risk", note: "weighted", shape: "score", accent: true }] },
      { label: "Interpret", title: "점수는 특정 full-data model보다 procedure에 가깝습니다", note: "Fold마다 training subset과 fitted model이 다르므로 CV가 무엇을 추정하는지 별도로 명시합니다.", items: [{ label: "fold models", note: "resampled", shape: "model" }, { label: "procedure", note: "average risk", shape: "target", accent: true }] },
    ]}
  />
);

export const GroupedValidationViz = () => (
  <ValidationSceneViz
    id="grouped-validation-modern"
    eyebrow="Shared cause"
    title="같은 원인에서 나온 여러 row를 하나의 group으로 움직입니다"
    description="파생 row→group key→disjoint fold→독립 근거 수를 구분합니다."
    scenes={[
      { label: "Rows", title: "여러 row가 같은 entity에서 파생됐는지 찾습니다", note: "Patient patch·동일 문서 chunk·같은 device 측정은 서로 닮은 공유 원인을 가집니다.", items: [{ label: "rows", note: "100k", shape: "rows" }, { label: "cause", note: "patient", shape: "group", accent: true }] },
      { label: "Key", title: "배포에서 새로울 가장 강한 공유 원인을 group key로 둡니다", note: "Patient보다 household나 hospital이 더 강한 dependency라면 상위 key가 필요할 수 있습니다.", items: [{ label: "patient", note: "nested", shape: "group" }, { label: "site", note: "stronger", shape: "group", accent: true }] },
      { label: "Disjoint", title: "Train과 validation의 group 교집합을 비웁니다", note: "한 group의 모든 row는 같은 partition에 들어가며 row-level shuffle은 그 뒤의 내부 순서일 뿐입니다.", items: [{ label: "train", note: "groups A·B", shape: "split" }, { label: "valid", note: "groups C·D", shape: "split", accent: true }] },
      { label: "Evidence", title: "행 수와 독립 평가 단위 수를 따로 보고합니다", note: "20명×5,000 patch는 100,000 rows이지만 unseen-patient 근거 반복은 20입니다.", items: [{ label: "rows", note: "100,000", shape: "rows" }, { label: "units", note: "20 people", shape: "group", accent: true }] },
    ]}
  />
);

export const WalkForwardViz = () => (
  <ValidationSceneViz
    id="walk-forward-modern"
    eyebrow="Time direction"
    title="각 prediction origin에서 실제로 알았던 정보만 왼쪽에 둡니다"
    description="Event time과 available time을 분리하고 gap·purge 뒤 origin을 전진시킵니다."
    scenes={[
      { label: "Origin", title: "Prediction을 내렸다고 가정할 시각을 세웁니다", note: "날짜가 과거라는 사실만으로 그 row의 feature와 label이 이미 알려졌다는 뜻은 아닙니다.", items: [{ label: "history", note: "before", shape: "rows" }, { label: "origin", note: "predict now", shape: "clock", accent: true }] },
      { label: "Available", title: "Event time과 system available time을 따로 봅니다", note: "결과가 30일 뒤 확정되고 보고가 7일 늦으면 event 이후 37일까지 training label이 아닙니다.", items: [{ label: "event", note: "occurred", shape: "clock" }, { label: "label", note: "available", shape: "clock", accent: true }] },
      { label: "Purge", title: "겹치는 feature·target interval을 split 경계에서 비웁니다", note: "Gap은 가까운 row를 띄우고 purge는 validation과 정보를 공유하는 training interval을 제거합니다.", items: [{ label: "train", note: "safe past", shape: "rows" }, { label: "gap", note: "empty", shape: "split", accent: true }, { label: "valid", note: "future", shape: "rows" }] },
      { label: "Advance", title: "같은 규칙으로 origin을 앞으로 옮겨 backtest합니다", note: "Expanding은 history를 누적하고 rolling은 고정 길이만 남기므로 production retraining policy와 맞춰야 합니다.", items: [{ label: "origin 1", note: "fit→test", shape: "clock" }, { label: "origin 2", note: "fit→test", shape: "clock", accent: true }] },
    ]}
  />
);

export const ValidationFeedbackViz = () => (
  <ValidationSceneViz
    id="validation-feedback-modern"
    eyebrow="Adaptive feedback"
    title="점수 차이·순서 차이·protocol 변경을 서로 다른 기록으로 남깁니다"
    description="Local/public parity→후보 쌍 방향→변경 receipt→frozen holdout으로 닫습니다."
    scenes={[
      { label: "Parity", title: "먼저 metric·row·preprocess가 같은지 확인합니다", note: "계산 계약이 다르면 score mismatch를 distribution shift로 해석하기 전에 구현부터 맞춰야 합니다.", items: [{ label: "local", note: "metric", shape: "score" }, { label: "public", note: "same rows?", shape: "score", accent: true }] },
      { label: "Rank", title: "절대 score와 후보 우열 방향을 분리합니다", note: "후보 쌍 10개 중 방향이 8개 같으면 pairwise agreement는 .8입니다.", items: [{ label: "pairs", note: "10", shape: "rows" }, { label: "agree", note: "8/10", shape: "score", accent: true }] },
      { label: "Adapt", title: "Feedback 뒤 바꾼 split·metric·feature를 기록합니다", note: "합리적인 bug fix라도 public score를 본 뒤라면 해당 holdout에 적응한 변경입니다.", items: [{ label: "feedback", note: "observed", shape: "score" }, { label: "protocol", note: "changed", shape: "model", accent: true }] },
      { label: "Freeze", title: "선택에 쓰지 않은 holdout에서 마지막으로 확인합니다", note: "Audit는 편향을 지우지 않습니다. 새 독립 data와 종료 조건이 평가 분리를 회복합니다.", items: [{ label: "chosen", note: "frozen", shape: "model" }, { label: "holdout", note: "unused", shape: "target", accent: true }] },
    ]}
  />
);
