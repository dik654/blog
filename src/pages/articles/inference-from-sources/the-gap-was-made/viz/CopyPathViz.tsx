import SceneShell from "./SceneShell";

/**
 * 본문 대응: copies 절과 그 ProgressiveDetail.
 * 다른 조항: 돌의 글자 → 읽는 사람(한 단계).
 * 돌아온 세 조항: 원본 → 사본(기원전 7세기, 어느 아시리아 왕을 위해) → 읽는 사람(한 단계 더).
 * 베끼며 바뀌었는지는 원본과 대어 보아야 아는데, 그 원본 자리가 지워졌다.
 * 지움과 사본 제작의 선후는 본문이 알 수 없다고 하므로 시간축에 놓지 않는다.
 */
const SCENES = [
  {
    label: "돌에서 바로",
    summary: "한 단계",
    note: "다른 조항들은 돌에 새겨진 글자를 읽은 것입니다. 글자가 만들어진 자리와 읽는 사람 사이에 단계가 하나뿐입니다.",
  },
  {
    label: "사본을 거쳐",
    summary: "한 단계 더",
    note: "돌아온 세 조항은 기원전 7세기에 어느 아시리아 왕을 위해 만들어진 사본에서 알려졌습니다. 누군가 베껴 적은 것을 읽었으니 단계가 하나 더 있습니다. 돌이 지워진 때가 그 사본보다 먼저인지 나중인지는 알 수 없어, 이 그림은 둘을 시간 순서로 놓지 않습니다.",
  },
  {
    label: "대어 볼 원본이 없음",
    summary: "확인 경로가 끊김",
    note: "베끼는 동안 글자가 바뀌었는지는 원본과 대어 보면 알 수 있습니다. 하필 그 부분의 원본이 지워진 자리입니다. 그래서 사본이 그대로 옮겼는지를 이 돌로는 확인할 수 없습니다.",
  },
  {
    label: "꼬리표는 경로에",
    summary: "본문 끝에 따로",
    note: "편집자는 세 조항에 번호를 붙여 순서 안에 넣지 않고 본문 끝에 따로 두었으며, 어디서 왔는지와 왜 싣는지를 함께 적었습니다. 내용은 나란히 읽되 근거의 무게는 다르게 잡으라는 표시이고, 이 꼬리표는 내용이 아니라 전해진 경로에 붙습니다.",
  },
] as const;

const STONE = "#0ea5e9";
const COPY = "#10b981";
const GONE = "#ef4444";
const NEUTRAL = "#94a3b8";

function Node({ label, sub, color, dashed = false, bold = false }: { label: string; sub?: string; color: string; dashed?: boolean; bold?: boolean }) {
  return (
    <div
      className="min-w-0 rounded-md border px-2 py-1.5 text-center text-xs leading-5"
      style={{ borderColor: color, borderStyle: dashed ? "dashed" : "solid", borderWidth: bold ? 2 : 1 }}
    >
      <span className="block font-bold">{label}</span>
      {sub && <span className="block text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

function Arrow({ text, color, broken = false }: { text: string; color: string; broken?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center px-0.5 text-center">
      <span className="text-[11px] leading-4" style={{ color }}>
        {text}
      </span>
      <span className="font-mono text-sm font-bold" style={{ color }} aria-hidden>
        {broken ? "→ ✕" : "→"}
      </span>
    </div>
  );
}

export default function CopyPathViz() {
  return (
    <SceneShell
      eyebrow="전해진 경로"
      title="돌아온 세 조항은 한 단계를 더 거쳤고, 그 단계를 확인할 원본이 지워졌습니다"
      description="한 줄이 한 묶음의 조항이 읽는 사람에게 오기까지의 경로입니다. 화살표 하나가 전해지는 단계 하나입니다."
      note="사본의 연대와 주문자, 세 조항을 본문 끝에 따로 실은 처리는 C. H. W. Johns 영역본(1903년 판)의 편집자 서술입니다. 단계를 세는 정리는 이 글의 것입니다."
      ariaLabel="돌에서 바로 읽은 조항과 사본을 거쳐 돌아온 세 조항의 전해진 경로 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <div
            className="min-w-0 rounded-lg border p-3 transition-opacity duration-300 motion-reduce:transition-none"
            style={{ borderColor: STONE, opacity: active === 0 || active === 3 ? 1 : 0.4 }}
          >
            <p className="text-xs font-bold" style={{ color: STONE }}>
              다른 조항들 · 한 단계
            </p>
            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1">
              <Node label="돌에 새겨진 글자" color={STONE} />
              <Arrow text="읽음" color={STONE} />
              <Node label="읽는 사람" sub="번호 붙은 본문" color={NEUTRAL} />
            </div>
          </div>

          <div
            className="min-w-0 rounded-lg border p-3 transition-opacity duration-300 motion-reduce:transition-none"
            style={{ borderColor: COPY, opacity: active >= 1 ? 1 : 0.4 }}
          >
            <p className="text-xs font-bold" style={{ color: COPY }}>
              돌아온 세 조항 · 두 단계
            </p>
            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1">
              <Node label="원본" sub={active >= 2 ? "돌의 그 자리는 지워짐" : "베낀 대상"} color={active >= 2 ? GONE : COPY} dashed={active >= 2} />
              <Arrow text="베낌" color={COPY} />
              <Node label="사본" sub="기원전 7세기 · 아시리아 왕을 위해" color={COPY} />
              <Arrow text="읽음" color={COPY} />
              <Node label="읽는 사람" sub={active === 3 ? "본문 끝에 따로" : " "} color={NEUTRAL} bold={active === 3} />
            </div>
            <div
              className="mt-3 rounded-md border border-dashed px-2 py-1.5 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none"
              style={{ borderColor: GONE, opacity: active >= 2 ? 1 : 0 }}
              aria-hidden={active < 2}
            >
              <span className="font-bold" style={{ color: GONE }}>
                확인:
              </span>{" "}
              사본이 그대로 옮겼나? → 원본과 대어 보기 → 그 자리가 지워져 대어 볼 수 없음
            </div>
          </div>

          <p
            className="rounded-md border border-dashed px-3 py-2 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none"
            style={{ borderColor: "#64748b", opacity: active === 3 ? 1 : 0.35 }}
          >
            내용은 나란히 읽고, 근거의 무게는 다르게 잡습니다
          </p>
        </div>
      )}
    />
  );
}
