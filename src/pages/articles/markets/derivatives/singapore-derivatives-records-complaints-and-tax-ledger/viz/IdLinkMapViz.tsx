import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 거래 ID 하나가 세 파일(고객·민원, 규제 보존, 세무)로 이어진다.
 * 민원 ID는 거래 ID와 통화·이메일·최종답변을 잇는다.
 * 세 파일은 서로 참조하지만 접근권한과 보존 근거가 다르다(구체 권한 내용은 글에 없음).
 */
const FILES = [
  {
    key: "customer",
    title: "고객·민원 파일",
    rows: ["설명서", "주문", "확인서", "손실 계산"],
    sub: { title: "민원 ID", rows: ["통화", "이메일", "최종답변"] },
  },
  { key: "retention", title: "규제 보존 장부", rows: ["계약 종료일", "파기 가능일"], sub: null },
  { key: "tax", title: "세무 장부", rows: ["실현 여부", "공급 분류"], sub: null },
] as const;

const SCENES = [
  { label: "거래 ID로 묶기", summary: "설명서·주문·확인서·손실 계산", lit: ["customer"], showSub: false, showBasis: false, note: "거래 ID를 가운데에 두고 고객이 받은 설명서·주문·확인서와 손실 계산을 묶습니다." },
  { label: "민원 ID 잇기", summary: "거래 ↔ 통화·이메일·최종답변", lit: ["customer"], showSub: true, showBasis: false, note: "민원 ID는 따로 떠 있지 않고 이 거래 ID에 걸립니다. 그 아래에 통화·이메일·최종답변을 시간순으로 연결합니다." },
  { label: "보존·세무 장부", summary: "종료일·파기 가능일 / 실현·공급 분류", lit: ["retention", "tax"], showSub: true, showBasis: false, note: "보존 장부는 계약 종료일과 파기 가능일을, 세무 장부는 실현 여부와 공급 분류를 적습니다. 두 장부도 같은 거래 ID를 참조합니다." },
  { label: "참조는 같고 근거는 다름", summary: "세 파일 · 권한과 보존 근거 따로", lit: ["customer", "retention", "tax"], showSub: true, showBasis: true, note: "세 파일은 같은 거래 ID로 서로 찾아가지만 접근권한과 보존 근거가 다릅니다." },
] as const;

export default function IdLinkMapViz() {
  return (
    <SceneShell
      eyebrow="식별자 지도"
      title="거래 ID 하나가 세 파일로 갈라집니다"
      description="선은 같은 거래 ID로 서로 찾아가는 연결입니다. 칸 안 항목은 4절에 나온 것만 적었습니다."
      ariaLabel="거래 ID에서 고객·민원 파일, 규제 보존 장부, 세무 장부로 이어지는 연결 구조"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lit = new Set<string>(scene.lit);
        return (
          <div className="min-w-0">
            <div className="flex justify-center">
              <span className="rounded-md border border-[#2563eb] px-3 py-1 font-mono text-sm font-bold text-[#2563eb]">거래 ID</span>
            </div>
            <div className="mx-auto h-4 w-px bg-[#94a3b8]" />
            <div className="grid grid-cols-3">
              {FILES.map((file, index) => {
                const on = lit.has(file.key);
                const bar = index === 0 ? "ml-[50%]" : index === FILES.length - 1 ? "mr-[50%]" : "";
                return (
                  <div key={file.key} className="flex min-w-0 flex-col items-center">
                    <div className={`h-px self-stretch bg-[#94a3b8] ${bar}`} />
                    <div className="h-4 w-px bg-[#94a3b8]" />
                    <div className="w-full px-1 sm:px-2">
                      <div className={`w-full rounded-lg border px-2 py-2 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none sm:text-sm ${on ? "border-foreground/50 opacity-100" : "border-border opacity-35"}`}>
                      <p className="font-bold">{file.title}</p>
                      <p className="mt-1 text-muted-foreground">{file.rows.join(" · ")}</p>
                      {file.sub && (
                        <div className={`mt-2 rounded-md border border-dashed px-2 py-1 transition-opacity duration-300 motion-reduce:transition-none ${scene.showSub ? "border-[#d97706] opacity-100" : "border-border opacity-25"}`}>
                          <p className="font-mono font-bold text-[#d97706]">{file.sub.title}</p>
                          <p className="text-muted-foreground">{file.sub.rows.join(" · ")}</p>
                        </div>
                      )}
                      <p className={`mt-2 border-t border-border pt-1 text-[11px] leading-4 transition-opacity duration-300 motion-reduce:transition-none ${scene.showBasis ? "opacity-100" : "opacity-0"}`}>
                        근거·권한 따로
                      </p>
                    </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
