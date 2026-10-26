import { motion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const scenes = [
  {
    code: "기록",
    title: "run-27의 모델 파일을 고정 버전 v21로 등록합니다",
    note: "설명용 가정입니다. Backend DB에는 실행 ID·모델 버전·파일 위치를 기록하고, artifact store에는 가중치·tokenizer·입력 명세·검증 자료의 실제 바이트를 둡니다.",
  },
  {
    code: "검사",
    title: "DB 행이 아니라 필수 파일 전체의 존재와 digest를 검사합니다",
    note: "v21의 필수 파일 네 개가 모두 존재하고 읽을 수 있으며, 기록된 digest와 schema가 맞아야 다시 실행할 수 있습니다.",
  },
  {
    code: "승인",
    title: "Champion 별명이 가리킨 v21을 승인 기록에 고정합니다",
    note: "Champion은 나중에 이동할 수 있습니다. 승인 시각의 v21, bundle digest, 정책 revision, 승인자와 시각을 promotion-84에 함께 기록합니다.",
  },
  {
    code: "배포",
    title: "배포 명세에는 Champion이 아니라 고정한 v21을 넣습니다",
    note: "기존 v17 Pod와 새 v21 Pod가 잠시 공존할 수 있지만, 새 Pod는 모델 버전과 모델 파일·container·설정 digest를 보고해야 합니다.",
  },
  {
    code: "대조",
    title: "READY와 별개로 endpoint의 v21 실행을 확인합니다",
    note: "endpoint가 READY여도 loaded_version=v17이면 실패입니다. promotion-84와 실행 보고값이 모두 맞은 v21에만 트래픽을 늘립니다.",
  },
] as const;

const artifacts = [
  ["weights.safetensors", "sha256:5af1…", "✓"],
  ["tokenizer.json", "sha256:0c42…", "✓"],
  ["signature.json", "sha256:22be…", "✓"],
  ["fixture.jsonl", "sha256:81d0…", "✓"],
] as const;

function ProcessRail({ active }: { active: number }) {
  return (
    <ol
      className="grid grid-cols-5 gap-px bg-border p-px"
      aria-label="모델 등록부터 실행 중인 endpoint 대조까지의 전체 위치"
    >
      {scenes.map((scene, index) => (
        <li
          key={scene.code}
          aria-current={index === active ? "step" : undefined}
          className={`relative min-w-0 overflow-hidden bg-background px-1 py-1.5 text-center sm:py-2 ${
            index === active
              ? "border-b-2 border-primary text-foreground"
              : index < active
                ? "text-foreground"
                : "text-muted-foreground"
          }`}
        >
          {index === active && (
            <motion.span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          )}
          <span className="block font-mono text-[9px] font-black text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <strong className="mt-0.5 block break-keep text-[10px] leading-4 sm:text-xs">
            {scene.code}
          </strong>
        </li>
      ))}
    </ol>
  );
}

function IdentityHeader({ state }: { state: "v21" | "alias" | "runtime" }) {
  const value =
    state === "v21"
      ? "prod.ml_team.claims_model / v21"
      : state === "alias"
        ? "Champion → v21 · promotion-84"
        : "claims-prod · v21 실행";

  return (
    <div className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-2 border-l-2 border-primary pl-3 text-xs sm:grid-cols-[7rem_minmax(0,1fr)]">
      <span className="text-[9px] font-bold text-muted-foreground">지금 고정하는 식별값</span>
      <strong className="break-all font-mono text-[10px] leading-5 sm:text-xs">
        {value}
      </strong>
    </div>
  );
}

function ArtifactManifest() {
  return (
    <div className="mt-3 border-y border-border text-xs">
      <div className="grid grid-cols-[minmax(0,1fr)_6.4rem_2rem] gap-2 border-b border-border py-1 text-[9px] font-bold text-muted-foreground sm:py-2">
        <span>필수 파일</span>
        <span>내용 digest</span>
        <span className="text-right">검사</span>
      </div>
      {artifacts.map(([name, digest, result]) => (
        <div
          key={name}
          className="grid grid-cols-[minmax(0,1fr)_6.4rem_2rem] items-center gap-2 border-b border-border py-1 last:border-b-0 sm:py-2"
        >
          <strong className="min-w-0 break-all text-[10px] sm:text-xs">{name}</strong>
          <span className="font-mono text-[9px] text-muted-foreground">{digest}</span>
          <span className="text-right font-bold text-primary">{result}</span>
        </div>
      ))}
    </div>
  );
}

function SceneBody({ active }: { active: number }) {
  if (active === 0) {
    return (
      <div>
        <IdentityHeader state="v21" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] sm:items-stretch">
          <div className="border-y border-border py-3">
            <span className="text-[9px] font-bold text-muted-foreground">Backend DB · 실행 기록</span>
            <strong className="mt-1 block text-sm">run-27 → 모델 v21</strong>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
              실행 ID · 고정 버전 · 파일 위치 · 태그
            </p>
          </div>
          <div className="hidden items-center justify-center sm:flex" aria-hidden>
            <motion.span
              className="h-px w-full bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.65 }}
            />
          </div>
          <div className="border-y border-border py-3">
            <span className="text-[9px] font-bold text-muted-foreground">Artifact store · 실제 모델 파일</span>
            <strong className="mt-1 block text-sm">파일 묶음 sha256:9b7e…</strong>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
              가중치 · tokenizer · 입력 명세 · 검증 자료
            </p>
          </div>
        </div>
        <p className="mt-3 break-keep text-xs font-bold leading-5 text-primary">
          DB와 파일 저장소 중 하나만 복구되면 v21은 다시 실행할 수 없습니다.
        </p>
      </div>
    );
  }

  if (active === 1) {
    return (
      <div>
        <IdentityHeader state="v21" />
        <ArtifactManifest />
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-l-2 border-primary pl-3">
          <div>
            <span className="text-[9px] font-bold text-muted-foreground">공동 무결성 판정</span>
            <strong className="mt-1 block text-sm">실행 기록 ✓ · 필수 파일 4/4 ✓</strong>
          </div>
          <span className="border border-primary px-2 py-1 text-[10px] font-bold text-primary">재생 가능</span>
        </div>
      </div>
    );
  }

  if (active === 2) {
    return (
      <div>
        <IdentityHeader state="alias" />
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center text-xs sm:gap-4">
          <div className="border-y border-border py-3">
            <span className="block text-[9px] font-bold text-muted-foreground">변경 가능한 이름</span>
            <strong className="mt-1 block">Champion</strong>
          </div>
          <motion.span
            aria-hidden
            className="font-mono text-primary"
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            →
          </motion.span>
          <div className="border-y border-primary/60 py-3">
            <span className="block text-[9px] font-bold text-muted-foreground">승인 순간의 고정 대상</span>
            <strong className="mt-1 block">v21 · sha256:9b7e…</strong>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] sm:text-xs">
          {[
            ["승인 기록", "promotion-84"],
            ["정책", "release-policy-v6"],
            ["승인자", "ml-release@team"],
            ["승인 시각", "2026-10-26T09:30Z"],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-border pb-2">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-0.5 block break-all font-mono text-[10px] leading-4 sm:text-xs">{value}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (active === 3) {
    return (
      <div>
        <IdentityHeader state="alias" />
        <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
          <div className="border-y border-border py-3">
            <span className="text-[9px] font-bold text-muted-foreground">배포 명세</span>
            <strong className="mt-1 block text-sm">model_version: 21</strong>
            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">별명이 아니라 승인한 고정 버전</p>
          </div>
          <span className="hidden font-mono text-primary sm:block" aria-hidden>→</span>
          <div className="grid grid-cols-2 gap-px bg-border p-px text-xs">
            <div className="bg-background p-3">
              <span className="text-[9px] font-bold text-muted-foreground">기존 Pod</span>
              <strong className="mt-1 block">v17 · 90%</strong>
            </div>
            <div className="bg-background p-3">
              <span className="text-[9px] font-bold text-muted-foreground">새 Pod</span>
              <strong className="mt-1 block text-primary">v21 · 10%</strong>
            </div>
          </div>
        </div>
        <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground sm:mt-3">
          Canary 동안 v17과 v21이 함께 실행될 수 있습니다. 각 버전과 트래픽 비율을 배포 기록에 남깁니다.
        </p>
      </div>
    );
  }

  return (
    <div>
      <IdentityHeader state="runtime" />
      <div className="mt-2 border-y border-border text-[9px] sm:mt-4 sm:text-xs">
        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)_minmax(0,.75fr)_2.5rem] gap-1 border-b border-border py-1 font-bold text-muted-foreground sm:gap-3 sm:py-2">
          <span>대조 항목</span>
          <span>승인 기록</span>
          <span>실행 보고</span>
          <span className="text-right">결과</span>
        </div>
        {[
          ["모델 버전", "v21", "v21", "일치"],
          ["모델 파일 digest", "9b7e…", "9b7e…", "일치"],
          ["container digest", "d18c…", "d18c…", "일치"],
          ["설정 digest", "53aa…", "53aa…", "일치"],
        ].map(([field, expected, actual, result]) => (
          <div
            key={field}
            className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)_minmax(0,.75fr)_2.5rem] items-center gap-1 border-b border-border py-1 last:border-b-0 sm:gap-3 sm:py-2"
          >
            <span className="min-w-0 break-keep font-bold text-muted-foreground">{field}</span>
            <span className="truncate font-mono">{expected}</span>
            <span className="truncate font-mono">{actual}</span>
            <strong className="text-right text-primary">{result}</strong>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-l-2 border-primary pl-3">
        <div>
          <span className="text-[9px] font-bold text-muted-foreground">promotion-84 ↔ 실행 보고값</span>
          <strong className="mt-1 block break-keep text-sm">v21 트래픽 확대 허용</strong>
        </div>
        <span className="border border-primary px-2 py-1 text-[10px] font-bold text-primary">통과</span>
      </div>
    </div>
  );
}

function ReducedMotionSummary() {
  return (
    <div data-viz-live-only className="min-h-0">
      <p className="text-[10px] font-black uppercase tracking-[.16em] text-primary">
        축소 모션 · 전체 순서
      </p>
      <ol className="mt-3 divide-y divide-border border-y border-border">
        {scenes.map((scene, index) => (
          <li key={scene.code} className="grid gap-1 py-4 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-4">
            <span className="font-mono text-[10px] font-black text-primary">
              {String(index + 1).padStart(2, "0")} · {scene.code}
            </span>
            <div>
              <strong className="block break-keep text-sm leading-6">{scene.title}</strong>
              <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">{scene.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ModelArtifactRegistryViz() {
  const labels = scenes.map((scene) => scene.title);
  const notes = scenes.map((scene) => scene.note);
  const controls = useAnimatedScenes(scenes.length, 6500, {
    autoPlay: false,
    loop: false,
  });
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    liveRegionRef.current?.scrollTo({ top: 0 });
  }, [controls.active]);

  return (
    <VizFrame
      eyebrow="모델 한 버전"
      title="한 모델이 등록되어 고객 요청을 처리하기까지"
      description="한 번의 학습 실행이 모델 파일을 만들었습니다. 이 글에서는 그 실행을 run-27, 등록한 고정 버전을 v21이라고 부릅니다. 이름과 digest는 설명용 가정입니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="model-artifact-registry"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="scroll-mt-24 flex min-h-full min-w-0 flex-col border-y border-border/70 bg-background px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6 sm:py-4"
      >
        {controls.reducedMotion ? (
          <ReducedMotionSummary />
        ) : (
          <>
            <div
              ref={liveRegionRef}
              data-viz-live-only
              className="flex min-h-0 flex-1 flex-col"
            >
              <ProcessRail active={controls.active} />
              <p className="mt-2 hidden text-[10px] font-black uppercase tracking-[.16em] text-primary sm:mt-3 sm:block">
                장면 · {String(controls.active + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 break-keep text-lg font-bold leading-7 sm:mt-2 sm:min-h-8">
                {scenes[controls.active].title}
              </h3>
              <div className="mt-2 flex min-h-0 flex-1 items-center border-t border-border pt-3 sm:mt-3 sm:min-h-56">
                <div className="w-full">
                  <SceneBody active={controls.active} />
                </div>
              </div>
            </div>

            <AnimatedSceneControls
              {...controls}
              active={controls.active}
              labels={labels}
              controlLabels={scenes.map((scene) => scene.code)}
              className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-2 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-desktop-controls]>button:last-child]:w-16 lg:[&_[data-viz-mobile-controls]]:hidden"
            />
          </>
        )}
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
