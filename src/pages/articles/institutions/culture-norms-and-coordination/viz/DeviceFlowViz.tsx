import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 분담·관찰·이의 절차가 각각 다른 문제를 맡고, 대응은 그 확인 뒤에 온다.
 * 되돌아가는 선 = 이의 절차가 기록을 고치는 길.
 */
const BOXES = [
  { name: "분담 규칙", ask: "얼마를 누구에게", x: 4 },
  { name: "관찰", ask: "냈나·청소했나", x: 94 },
  { name: "이의 절차", ask: "기록이 맞나", x: 184 },
  { name: "대응", ask: "확인 뒤 무엇을", x: 274 },
];
const BOX_W = 82;

const SCENES = [
  { label: "분담 규칙", summary: "얼마를 누구에게", on: 0, note: "같은 2만원이 언제나 공정한 것은 아닙니다. 가게 크기·이용량·감당할 수 있는 정도를 고려할지 구성원이 정하고, 규칙을 바꿀 사람이 누구인지도 함께 정합니다." },
  { label: "관찰", summary: "실제 납부 · 청소 확인", on: 1, note: "규칙은 약속일 뿐이므로 실제로 돈을 냈는지, 청소가 이뤄졌는지는 따로 확인합니다. 납부 기록과 청소 기록이 여기에 쓰입니다." },
  { label: "이의 절차", summary: "틀린 기록을 고치는 길", on: 2, note: "기록이 틀렸거나 예외 사정이 있으면 이 길로 관찰 결과를 고칩니다. 그림의 되돌아가는 선입니다." },
  { label: "이의 길이 없다면", summary: "기록은 보여도 고칠 수 없음", on: -1, note: "납부명단이 잘 보여도 반론할 수 없다면 억울한 기록이 계속 남을 수 있습니다. 관찰이 잘 되는 것과 정정할 수 있는 것은 다른 일입니다." },
  { label: "대응", summary: "확인 뒤에 옵니다", on: 3, note: "규칙을 어겼을 때의 대응은 이런 확인 뒤에 옵니다. 안내·정정·지급 일정 조정과 반복 위반에 대한 대응을 구분할 수 있고, 구체적인 제재를 할 수 있는지는 계약과 현지 법도 확인해야 합니다." },
] as const;

export default function DeviceFlowViz() {
  return (
    <SceneShell
      eyebrow="세 장치와 대응의 순서"
      title="각 장치는 서로 다른 질문을 맡습니다"
      description="왼쪽에서 오른쪽으로 읽습니다. 네모 안 작은 글씨가 그 장치가 답하는 질문입니다."
      ariaLabel="분담 규칙, 관찰, 이의 절차, 대응의 순서와 되돌아가는 길"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cut = active === 3;
        const backOn = active === 2;
        const backColor = cut ? "#dc2626" : backOn ? "#2563eb" : "#94a3b8";
        return (
          <svg key={scene.label} viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {BOXES.map((box, index) => {
              const on = scene.on === index || (cut && index === 2);
              return (
                <g key={box.name}>
                  <rect x={box.x} y={12} width={BOX_W} height={48} rx={8} fill={on ? "#2563eb" : "#94a3b8"} fillOpacity={on ? 0.14 : 0.08} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={on ? 1.25 : 1} />
                  <text x={box.x + BOX_W / 2} y={32} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="currentColor">{box.name}</text>
                  <text x={box.x + BOX_W / 2} y={49} textAnchor="middle" fontSize={11} fill="#64748b">{box.ask}</text>
                  {index < 3 && <path d={`M${box.x + BOX_W + 1} 36 h5 m-3 -3 l3 3 l-3 3`} fill="none" stroke="#64748b" strokeWidth={1} />}
                </g>
              );
            })}
            <path d="M225 60 V88 H135 V66" fill="none" stroke={backColor} strokeWidth={backOn || cut ? 1.25 : 1} strokeDasharray={cut ? "4 3" : undefined} />
            <path d="M131 70 L135 62 L139 70" fill="none" stroke={backColor} strokeWidth={1} />
            {cut && <text x={180} y={92} textAnchor="middle" fontSize={15} fontWeight={700} fill="#dc2626">×</text>}
            <text x={180} y={108} textAnchor="middle" fontSize={12} fill={cut ? "#dc2626" : backOn ? "#2563eb" : "#64748b"}>
              {cut ? "반론할 수 없으면 기록이 그대로 남을 수 있음" : "기록이 틀렸거나 예외 사정이 있으면 고침"}
            </text>
            <path d="M315 60 V116 M179 124 V116 H315 M302 116 V124" fill="none" stroke={scene.on === 3 ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
            {[{ x: 118, w: 122, t: "안내·정정·일정 조정" }, { x: 248, w: 108, t: "반복 위반 대응" }].map((chip) => (
              <g key={chip.t}>
                <rect x={chip.x} y={124} width={chip.w} height={32} rx={8} fill="none" stroke={scene.on === 3 ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                <text x={chip.x + chip.w / 2} y={144} textAnchor="middle" fontSize={12} fill={scene.on === 3 ? "currentColor" : "#64748b"}>{chip.t}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
