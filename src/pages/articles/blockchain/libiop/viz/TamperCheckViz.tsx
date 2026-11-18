import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-checks — 한 칸 변조(코드 구조가 깨짐)와 c=11 재인코딩(계산 관계가 깨짐)을 나눈다.
 * F17, p(t)=1+8t+4t²+7t³ → [1,3,4,12,1,13,5,2]. p′(t)=1+2t+13t²+4t³ → [1,3,4,11,14,3,2,1].
 * 3차 이하 식은 네 점으로 하나로 정해지므로, 앞 네 칸이 정한 식이 뒤 네 칸의 값을 예측한다.
 * 한 칸 변조 위치(5번 칸 13→14)는 설명용 가정이다.
 */
const GOOD = [1, 3, 4, 12, 1, 13, 5, 2] as const;
const TAMPERED = [1, 3, 4, 12, 1, 14, 5, 2] as const;
const REENCODED = [1, 3, 4, 11, 14, 3, 2, 1] as const;

const SCENES = [
  {
    label: "정상 표",
    summary: "8칸 모두 p(t)와 일치 · 3×4−12=0",
    note: "앞 네 칸 1·3·4·12가 3차 이하 식 p(t)를 하나로 정하고, 뒤 네 칸은 같은 식을 점 4·5·6·7에서 계산한 값입니다. 계산 관계도 3×4−12=0으로 맞습니다.",
  },
  {
    label: "한 칸만 몰래 변경",
    summary: "5번 칸: 예측 13 ≠ 받은 14",
    note: "5번 칸 하나만 14로 바꿨다고 해 봅시다(가정). 앞 네 칸이 정한 식은 5번 칸에서 13을 내놓아야 하므로 표가 더는 그 3차 이하 식의 평가표가 아닙니다. 이것은 표의 모양이 틀린 경우이고, 표가 낮은 차수 코드에 가까운지 보는 low-degree·proximity test가 맡습니다.",
  },
  {
    label: "c=11로 다시 인코딩",
    summary: "8칸 모두 p′(t)와 일치 · 3×4−11=1",
    note: "c를 11로 바꾸고 표 전체를 p′(t)로 다시 만들면 여덟 칸이 모두 한 3차 이하 식과 맞아 모양 검사로는 이상이 보이지 않습니다. 그러나 3×4−11=1이라 계산이 틀렸고, 이것은 R1CS의 Az·Bz=Cz 관계를 표에 연결해 확인하는 lincheck·rowcheck가 잡아야 하는 경우입니다.",
  },
] as const;

const ROWS = [GOOD, TAMPERED, REENCODED] as const;
const PREDICT = [GOOD, GOOD, REENCODED] as const;
const FORMULA = ["p(t)=1+8t+4t²+7t³", "p(t)=1+8t+4t²+7t³", "p′(t)=1+2t+13t²+4t³"] as const;

function Verdict({ title, ok, body }: { title: string; ok: boolean; body: string }) {
  return (
    <div className={`min-w-0 rounded-lg border p-3 ${ok ? "border-emerald-600/50" : "border-rose-600/60"}`}>
      <p className="text-[11px] font-bold text-muted-foreground">{title}</p>
      <p className={`mt-1 text-sm font-bold ${ok ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
        {ok ? "맞음" : "깨짐"}
      </p>
      <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">{body}</p>
    </div>
  );
}

export default function TamperCheckViz() {
  return (
    <SceneShell
      eyebrow="F17의 교육용 8칸 표"
      title="한 칸 변조와 다른 c의 재인코딩은 서로 다른 검사에 걸립니다"
      description="칸 번호는 평가점 t=0…7입니다. 앞 네 칸(테두리 강조)은 원래 값, 뒤 네 칸은 같은 식의 추가 평가값입니다. 3차 이하 식은 네 점이면 하나로 정해지므로 앞 네 칸이 뒤 네 칸의 값을 미리 정합니다."
      ariaLabel="정상 표, 한 칸 변조, c=11 재인코딩에서 모양 검사와 계산 검사의 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const row: readonly number[] = ROWS[active];
        const predicted: readonly number[] = PREDICT[active];
        const shapeOk = row.every((value, index) => value === predicted[index]);
        const c = row[3];
        const err = 3 * 4 - c;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2 text-[11px]">
              <span className="text-muted-foreground">칸</span>
              <div className="grid grid-cols-8 gap-1">
                {row.map((_, index) => (
                  <span key={index} className="text-center font-mono text-muted-foreground">{index}</span>
                ))}
              </div>
              <span className="font-bold">받은 표</span>
              <div className="grid grid-cols-8 gap-1">
                {row.map((value, index) => {
                  const bad = value !== predicted[index];
                  return (
                    <span
                      key={index}
                      className={`min-w-0 rounded border py-1.5 text-center font-mono text-xs font-bold ${
                        bad
                          ? "border-rose-600 text-rose-700 dark:text-rose-300"
                          : index < 4
                            ? "border-primary/60 bg-primary/5"
                            : "border-border bg-background"
                      }`}
                    >
                      {value}
                    </span>
                  );
                })}
              </div>
              <span className="text-muted-foreground">앞 네 칸이 정한 값</span>
              <div className="grid grid-cols-8 gap-1">
                {predicted.map((value, index) => (
                  <span key={index} className="text-center font-mono text-xs text-muted-foreground">{index < 4 ? "·" : value}</span>
                ))}
              </div>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">앞 네 칸을 지나는 식: {FORMULA[active]} (mod 17)</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Verdict
                title="표의 모양 · 한 3차 이하 식의 평가표인가"
                ok={shapeOk}
                body={shapeOk ? "여덟 칸 모두 앞 네 칸이 정한 식과 일치합니다." : "5번 칸이 예측값 13과 다릅니다."}
              />
              <Verdict
                title="계산 관계 · 3×4−c=0인가"
                ok={err === 0}
                body={`c=${c}이므로 3×4−${c}=${err}`}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
