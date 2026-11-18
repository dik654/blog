import G16SceneShell from "./G16SceneShell";

/**
 * 본문 대응: #source-qap — 제약 2 + 공개 변수 3(상수 1 포함) = 5 → 평가 영역 8.
 * 칸 0·1 곱셈 줄, 칸 2–4 공개 변수 자리, 칸 5–7 0 채움.
 * U=[3,12,1,3,144,0,0,0], V=[4,12,0,…], W=[12,144,0,…]. H는 8계수(마지막 0), H-query 7개.
 * 점 5·7·11 검산: 유효 답안 모두 맞음, w=5 불량 답안은 5만 맞고 7·11 틀림.
 */
const ROLES = ["줄", "줄", "공개", "공개", "공개", "0", "0", "0"] as const;
const ROWS = [
  { name: "U", values: [3, 12, 1, 3, 144, 0, 0, 0] },
  { name: "V", values: [4, 12, 0, 0, 0, 0, 0, 0] },
  { name: "W", values: [12, 144, 0, 0, 0, 0, 0, 0] },
] as const;
const POINTS = [5, 7, 11] as const;

const SCENES = [
  { label: "칸 수 정하기", summary: "2 + 3 = 5 → 8칸", note: "곱셈 제약 2개에 상수 1을 포함한 공개 변수 3개를 더하면 5칸이 필요합니다. 이를 수용하는 평가 영역의 크기는 8이고 남는 세 칸은 0으로 채웁니다." },
  { label: "평가 배열 채우기", summary: "U · V · W 각 8칸", note: "첫 두 칸에는 두 곱셈 줄의 왼쪽·오른쪽·결과 값이, U의 다음 세 칸에는 공개 변수 1·3·144가 들어갑니다. 손계산의 두 점 장부와 칸의 수부터 다릅니다." },
  { label: "몫 H와 검산", summary: "H 8계수 · X=5·7·11 모두 맞음", note: "유효 답안의 H는 8개 계수로 나오고 마지막 계수는 0이었습니다. 원문의 H-query는 7개입니다. 별도 검산은 X=5·7·11을 넣어 UV−W=HT를 확인했습니다. 평가 영역이 두 점이 아니라 8칸이므로 손계산의 h=72를 그대로 이 H 배열이라 부를 수 없습니다." },
  { label: "w = 5 불량 답안", summary: "X=5만 맞고 7·11 틀림", note: "몫을 계산하는 원문 함수(witness_map)는 불량 답안에도 배열을 돌려줍니다. X=5는 원문이 몫을 계산할 때 실제로 쓴 평가점이라 그곳의 숫자 나눗셈은 맞게 만들어집니다. 다른 값 7·11에서 틀리므로 다항식 항등식은 성립하지 않습니다." },
] as const;

function roleColor(role: string) {
  if (role === "줄") return "border-[#2563eb] bg-[#dbeafe]/60";
  if (role === "공개") return "border-[#d97706] bg-[#fef3c7]/60";
  return "border-dashed border-border";
}

function Picture({ scene }: { scene: number }) {
  const showValues = scene >= 1;
  return (
    <div className="min-w-0 space-y-4">
      <div className="grid grid-cols-[1.75rem_repeat(8,minmax(0,1fr))] gap-1 text-center">
        <span />
        {ROLES.map((role, i) => (
          <span key={i} className={`rounded-md border py-1 text-[11px] leading-4 sm:text-xs ${roleColor(role)}`}>
            <span className="block font-mono text-muted-foreground">{i}</span>
            <span className="block">{role}</span>
          </span>
        ))}
        {ROWS.map((row) => (
          <div key={row.name} className="contents">
            <span className="self-center font-mono text-sm font-bold">{row.name}</span>
            {row.values.map((v, i) => (
              <span key={i} className={`rounded-md border border-border py-1.5 font-mono text-[11px] sm:text-sm ${showValues ? "" : "text-transparent"} ${showValues && v === 0 ? "text-muted-foreground/60" : ""}`}>
                {v}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 items-center gap-2 text-sm">
        <span className="col-span-3 text-xs text-muted-foreground">UV−W=HT에 넣은 X 값 (위 칸 번호 5·7과 무관한 체의 값)</span>
        {POINTS.map((p) => {
          const shown = scene >= 2;
          const ok = scene === 2 || p === 5;
          return (
            <span
              key={p}
              className={`rounded-md border px-2 py-1.5 text-center font-mono text-xs sm:text-sm ${!shown ? "border-dashed border-border text-muted-foreground" : ok ? "border-[#16a34a] text-[#15803d]" : "border-[#dc2626] text-[#b91c1c]"}`}
            >
              X={p}: {shown ? (ok ? "맞음" : "틀림") : "—"}
            </span>
          );
        })}
      </div>
      <div className="text-xs leading-5 text-muted-foreground">
        {scene === 3 ? "이 장면의 검산 결과만 불량 답안(w=5)이고 위 배열은 유효 답안의 값입니다." : "칸 아래 숫자는 유효 답안 (3, 144, 4, 12)의 실제 평가 배열입니다."}
      </div>
    </div>
  );
}

export default function EvalDomainViz() {
  return (
    <G16SceneShell
      eyebrow="여덟 칸의 평가 영역"
      title="두 줄은 여덟 칸 중 앞의 두 칸만 차지합니다"
      description="칸 하나가 평가 영역의 점 하나입니다. 파란 칸은 곱셈 줄, 주황 칸은 공개 변수 자리, 점선 칸은 0으로 채운 자리입니다. 숫자는 16절의 실제 Rust 실행에서 관측한 배열입니다."
      ariaLabel="평가 영역 여덟 칸의 역할, U·V·W 배열, 점 5·7·11에서의 검산 결과"
      scenes={SCENES}
      render={(index) => <Picture scene={index} />}
    />
  );
}
