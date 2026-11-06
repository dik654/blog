import type { ReactNode } from "react";
import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow } from "./TimeLanes";

/**
 * 본문 대응: #memory-fence — fence 범위 셋, fence만 둔 경우, 보통 flag의 race, release/acquire 전달, 재사용.
 * 가로는 진행 순서이며 시간 수치가 아닙니다. 의사코드 원리이고 flag 초기값 0은 본문 조건입니다.
 */
const SCOPES = [
  ["__threadfence_system", "system"],
  ["__threadfence", "device"],
  ["__threadfence_block", "block"],
] as const;

const DATA = { from: 0, to: 4, label: "data=7", tone: "send" } as const;

const SCENES: readonly { label: string; summary: string; note: string; lanes?: readonly LaneRow[] }[] = [
  { label: "순서의 범위 셋", summary: "block ⊂ device ⊂ system", note: "세 함수는 각각 block·device·system 범위의 순서에 대응합니다. 주소가 shared인지 global인지는 이 범위와 별개의 축입니다." },
  {
    label: "fence만 두면",
    summary: "consumer의 도착은 미정",
    note: "fence는 호출 thread의 메모리 접근 순서만 정합니다. Producer가 지나갔어도 consumer가 그 지점까지 온 것은 아니어서, 읽는 시점이 정해지지 않습니다.",
    lanes: [
      { name: "producer", segs: [DATA, { from: 4, to: 7, label: "fence", tone: "barrier" }, { from: 7, to: 14, label: "상대를 기다리지 않음", tone: "idle" }] },
      { name: "consumer", segs: [{ from: 1, to: 5, label: "읽기?", tone: "bad" }] },
    ],
  },
  {
    label: "보통 flag를 더하면",
    summary: "동시 읽기·쓰기 = data race",
    note: "fence 뒤에 보통의 flag를 두고 동시에 읽고 쓰면 data race가 남아 동작이 정의되지 않을 수 있습니다. volatile로 바꿔 읽어도 같은 것이 아닙니다.",
    lanes: [
      { name: "producer", segs: [DATA, { from: 4, to: 7, label: "fence", tone: "barrier" }, { from: 7, to: 11, label: "flag=1", tone: "bad" }] },
      { name: "consumer", segs: [{ from: 7, to: 11, label: "flag 읽기", tone: "bad" }] },
    ],
  },
  {
    label: "release → acquire",
    summary: "1을 본 뒤 data 읽기 → 7",
    note: "release는 앞선 쓰기를 뒤로 넘기지 않는 저장, acquire는 뒤의 읽기를 앞당기지 않는 읽기입니다. consumer가 같은 범위의 acquire로 1을 본 뒤 data를 읽습니다. flag는 처음 0이고 다른 쓰기와 충돌하지 않으며 7을 덮지 않아야 합니다.",
    lanes: [
      { name: "producer", segs: [DATA, { from: 4, to: 8, label: "flag=1 release", tone: "flag" }] },
      { name: "consumer", segs: [{ from: 0, to: 3, label: "0", tone: "idle" }, { from: 3, to: 6, label: "0", tone: "idle" }, { from: 8, to: 11, label: "1 봄", tone: "flag" }, { from: 11, to: 14, label: "7", tone: "run" }] },
    ],
  },
  {
    label: "다시 쓰려면",
    summary: "소비 완료 → 다음 세대",
    note: "앞의 구성은 한 번 전달하는 사례입니다. 반복해서 재사용하려면 소비 완료와 다음 세대까지 연결해야 하며, 그 전에 producer가 7을 덮으면 안 됩니다.",
    lanes: [
      { name: "producer", segs: [DATA, { from: 4, to: 7, label: "공개", tone: "flag" }, { from: 11, to: 14, label: "다음 세대", tone: "send" }] },
      { name: "consumer", segs: [{ from: 7, to: 9, label: "7", tone: "run" }, { from: 9, to: 11, label: "소비 알림", tone: "flag" }] },
    ],
  },
];

function ScopeNest() {
  return (
    <div className="min-w-0">
      {SCOPES.reduceRight<ReactNode>(
        (inner, [fn, scope]) => (
          <div className="rounded-lg border border-border p-2 sm:p-3">
            <p className="break-words text-xs leading-5 sm:text-sm"><strong>{scope}</strong> · <code className="font-mono">{fn}</code></p>
            {inner && <div className="mt-2">{inner}</div>}
          </div>
        ),
        null,
      )}
    </div>
  );
}

export default function FencePublishViz() {
  return (
    <SceneShell
      eyebrow="값 공개하기"
      title="data=7 뒤 fence만 두면 consumer는 언제 읽어도 될까요"
      description="가로는 진행 순서이며 시간 수치가 아닙니다. 점선 칸은 안전하지 않은 접근입니다. 의사코드 원리입니다."
      ariaLabel="fence의 범위, fence만 둔 경우, 보통 flag의 race, release와 acquire를 이용한 전달, 재사용 조건"
      scenes={SCENES}
      render={(index) => {
        const lanes = SCENES[index].lanes;
        return lanes ? <TimeLanes lanes={lanes} max={14} /> : <ScopeNest />;
      }}
    />
  );
}
