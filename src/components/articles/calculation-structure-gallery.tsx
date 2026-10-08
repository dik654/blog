import VizFrame from "@/components/viz/VizFrame";

function Cells({ count, accent = false, columns = 8 }: { count: number; accent?: boolean; columns?: number }) {
  return (
    <div className="grid w-full gap-1" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={`aspect-square border ${accent ? "border-primary/60 bg-primary/20" : "border-border bg-muted/60"}`} />
      ))}
    </div>
  );
}

export function SpatialRangeViz() {
  return (
    <VizFrame eyebrow="무작위화하는 공간" title="Camera는 기준점 주위의 세 방향 범위 안에서 새 위치를 뽑습니다" description="가로 10cm, 세로 5cm, 깊이 10cm는 서로 다른 세 축의 허용 폭입니다." note="세 수를 곱해 부피를 구하려는 계산이 아닙니다. 학습할 때 camera 위치를 뽑는 세 좌표의 범위를 따로 표시한 값입니다.">
      <div data-viz-canvas className="grid min-w-0 gap-5 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-center">
        <div className="relative mx-auto w-full max-w-md px-8 py-7">
          <div className="grid aspect-[2/1] grid-cols-5 grid-rows-3 border border-primary/60 bg-primary/5">
            {Array.from({ length: 15 }, (_, index) => <span key={index} className="border border-border/70" />)}
          </div>
          <div className="absolute inset-x-8 bottom-1 flex items-center gap-2 text-xs text-muted-foreground"><span className="h-px flex-1 bg-primary" /><strong>가로 10cm</strong><span className="h-px flex-1 bg-primary" /></div>
          <div className="absolute bottom-7 left-0 top-7 flex flex-col items-center justify-center text-xs text-muted-foreground"><span className="h-full w-px bg-primary" /><strong className="mt-1">세로 5cm</strong></div>
          <div className="absolute right-0 top-1 flex items-center gap-1 text-xs text-muted-foreground"><span className="h-px w-8 rotate-[-28deg] bg-primary" /><strong>깊이 10cm</strong></div>
          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border border-primary bg-background" aria-label="기준 camera 위치" />
        </div>
        <div className="space-y-3 text-sm leading-6">
          <p className="border-l-2 border-primary pl-3"><strong>기준점</strong><br />가운데 작은 사각형</p>
          <p className="border-l-2 border-border pl-3"><strong>새 episode</strong><br />상자 안에서 x·y·z를 다시 뽑음</p>
          <p className="border-l-2 border-border pl-3"><strong>화각</strong><br />위치와 별도로 기준값의 ±5%</p>
        </div>
      </div>
    </VizFrame>
  );
}

export function BandwidthLaneViz() {
  const lanes = [
    { label: "가정한 통로", bandwidth: "8,000 GB/s", time: "0.831 ms", width: "100%" },
    { label: "관측 통로", bandwidth: "4,800 GB/s", time: "1.385 ms", width: "60%" },
  ] as const;
  return (
    <VizFrame eyebrow="6.65GB가 통로를 지나는 시간" title="같은 payload도 통로가 좁아지면 최소 이동 시간이 늘어납니다" description="맨 위 막대가 한 decode step에서 옮길 6.65GB입니다. 아래 두 줄은 서로 다른 지속 대역폭 가정입니다." note="나눗셈은 payload와 bandwidth만으로 구한 전송 하한입니다. Kernel 시작, 동기화, 통신과 계산 겹침은 추가로 측정해야 합니다.">
      <div data-viz-canvas className="min-w-0">
        <div className="border border-primary/50 bg-primary/15 p-3 text-center text-sm font-bold">이동할 weight · 6.65GB</div>
        <div className="mt-5 space-y-4">
          {lanes.map((lane) => (
            <div key={lane.bandwidth} className="grid gap-2 sm:grid-cols-[7rem_minmax(0,1fr)_7rem] sm:items-center">
              <p className="text-xs font-bold text-muted-foreground">{lane.label}<br />{lane.bandwidth}</p>
              <div className="h-7 border border-border bg-muted/30"><div className="h-full border-r border-primary bg-primary/20" style={{ width: lane.width }} /></div>
              <p className="font-mono text-sm font-bold text-primary">{lane.time}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 border-t border-border pt-4 font-mono text-sm leading-6">6.65GB ÷ bandwidth = seconds · 초에 1,000을 곱해 ms</p>
      </div>
    </VizFrame>
  );
}

export function ProductPermutationViz() {
  const rows = [
    { label: "원래", values: [5, 6, 14], result: "420", accent: false },
    { label: "순서만 변경", values: [14, 5, 6], result: "420", accent: true },
    { label: "값 하나 변경", values: [14, 5, 7], result: "490", accent: false },
  ] as const;
  return (
    <VizFrame eyebrow="순서와 값의 차이" title="같은 세 값을 섞으면 곱은 같고, 값 하나를 바꾸면 곱이 달라집니다" description="γ=2를 더한 뒤의 세 값을 실제 칸으로 놓았습니다. 위 두 줄은 칸의 순서만 다릅니다." note="이 작은 곱은 값의 모음만 비교합니다. 실제 PLONK copy argument는 위치와 무작위 질문을 함께 넣어 어느 칸끼리 연결됐는지도 묶습니다.">
      <div data-viz-canvas className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)_4.5rem] items-center gap-3">
            <p className="text-xs font-bold leading-5 text-muted-foreground">{row.label}</p>
            <div className="grid grid-cols-3 gap-2">
              {row.values.map((value, index) => <div key={`${value}-${index}`} className={`border p-2 text-center font-mono text-sm font-bold ${row.accent ? "border-primary/50 bg-primary/15" : "border-border bg-muted/40"}`}>{value}</div>)}
            </div>
            <p className={`font-mono text-sm font-bold ${row.result === "420" ? "text-primary" : "text-foreground"}`}>× = {row.result}</p>
          </div>
        ))}
        <div className="grid gap-2 border-t border-border pt-4 text-sm sm:grid-cols-2">
          <p>420 ÷ 420 = <strong className="text-primary">1</strong></p>
          <p>420 ÷ 490 = 6/7 ≡ <strong>84 mod 97</strong></p>
        </div>
      </div>
    </VizFrame>
  );
}

export function CapacitorGeometryViz() {
  return (
    <VizFrame eyebrow="면적당 용량에서 전체 용량으로" title="10nm 간격의 두 판이 마주 보는 100µm²만큼 전하를 모읍니다" description="판 사이 간격은 면적당 용량을 정하고, 마주 보는 면적은 전체 용량을 정합니다." note="평행판과 균일한 SiO₂를 가정한 작은 신호 용량입니다. 가장자리 전기장, 양자 효과와 실제 배선 기생 성분은 포함하지 않습니다.">
      <div data-viz-canvas className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-center">
        <div className="min-w-0">
          <div className="border border-primary/60 bg-primary/15 p-3 text-center text-sm font-bold">위 전극 · 면적 100µm²</div>
          <div className="my-2 flex h-16 items-center justify-center border-x border-dashed border-border bg-muted/30 text-center text-xs leading-5 text-muted-foreground">SiO₂<br />두께 10nm</div>
          <div className="border border-border bg-muted/60 p-3 text-center text-sm font-bold">실리콘 표면 · 같은 면적</div>
        </div>
        <div className="space-y-3 text-sm leading-6">
          <p className="border-l-2 border-border pl-3">εox ÷ 10nm<br /><strong>3.453×10⁻³ F/m²</strong></p>
          <p className="border-l-2 border-primary pl-3">× 100µm²<br /><strong>0.3453pF</strong></p>
        </div>
      </div>
    </VizFrame>
  );
}

export function LayoutTransformViz({ mode }: { mode: "layout" | "swizzle" | "hierarchy" }) {
  if (mode === "layout") {
    return (
      <VizFrame eyebrow="중첩 좌표를 한 줄 주소로" title="좌표 (1,(0,1))의 세 축 기여를 더하면 offset 5가 됩니다" description="바깥 축의 stride 4, 안쪽 두 축의 stride 2와 1을 같은 주소에 더합니다." note="2×2×2의 여덟 자리를 2×4 표로 펼친 그림입니다. 같은 저장을 여러 좌표 모양으로 읽을 수 있다는 뜻입니다.">
        <div data-viz-canvas className="grid gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] sm:items-center">
          <div className="space-y-2 font-mono text-sm"><p>바깥 1 × stride 4 = 4</p><p>안쪽 0 × stride 2 = 0</p><p>안쪽 1 × stride 1 = 1</p><p className="border-t border-border pt-2 font-bold text-primary">4 + 0 + 1 = offset 5</p></div>
          <div><p className="mb-2 text-xs font-bold text-muted-foreground">2행 × 4열로 펼친 offset</p><div className="grid grid-cols-4 gap-1">{Array.from({length:8},(_,i)=><div key={i} className={`flex aspect-square items-center justify-center border font-mono text-sm ${i===5?"border-primary bg-primary/20 font-bold text-primary":"border-border bg-muted/40"}`}>{i}</div>)}</div></div>
        </div>
      </VizFrame>
    );
  }
  if (mode === "swizzle") {
    return (
      <VizFrame eyebrow="bank로 몰리는 주소를 XOR로 흩뜨리기" title="두 행이 같은 bank 묶음을 고르면 충돌하고, 행 bit를 섞으면 서로 다른 묶음으로 갑니다" description="각 행의 32개 half는 64B입니다. 두 행이 128B 구간을 나눠 쓰는 작은 사례를 16칸씩 줄여 그렸습니다." note="그림은 bank index가 어떻게 재배치되는지 보여 줍니다. 실제 cycle과 conflict 수는 instruction, bank width와 접근 패턴에서 측정해야 합니다.">
        <div data-viz-canvas className="space-y-4">
          {[0,1].map(row=><div key={row} className="grid grid-cols-[3.5rem_minmax(0,1fr)_4.5rem] items-center gap-2"><span className="text-xs font-bold text-muted-foreground">행 {row}</span><Cells count={16} columns={8} accent={row===1}/><span className="font-mono text-xs">bank {row===0?"0·1":"2·3"}</span></div>)}
          <p className="border-t border-border pt-4 font-mono text-sm leading-6">bank′ = column bank XOR row bits · 같은 열의 두 행을 다른 bank 묶음으로 이동</p>
        </div>
      </VizFrame>
    );
  }
  return (
    <VizFrame eyebrow="같은 128×128 출력을 세 층으로 나누기" title="Threadblock 한 칸을 warp 네 칸으로, warp 한 칸을 MMA 32칸으로 나눕니다" description="큰 칸 하나가 아래 단계에서 여러 작은 칸으로 갈라지는 계층을 같은 화면에 놓았습니다." note="128×128×32 threadblock, 64×64 warp, m16n8k16 명령 사례입니다. 이 모양이 특정 GPU에서 가장 빠르다는 측정 결과는 아닙니다.">
      <div data-viz-canvas className="grid gap-4 sm:grid-cols-3 sm:items-center">
        <div><p className="mb-2 text-xs font-bold">Threadblock · 128×128</p><Cells count={1} columns={1} accent /></div>
        <div><p className="mb-2 text-xs font-bold">Warp · 2×2</p><Cells count={4} columns={2} /></div>
        <div><p className="mb-2 text-xs font-bold">한 warp의 MMA · 4×8</p><Cells count={32} columns={8} accent /></div>
      </div>
    </VizFrame>
  );
}

export function RooflineArithmeticViz({ mode }: { mode: "intensity" | "boundary" }) {
  if (mode === "boundary") {
    return (
      <VizFrame eyebrow="Roofline에 넣기 전 같은 경계 맞추기" title="64 FLOP의 분모에는 같은 실행 구간에서 DRAM을 지난 byte를 넣습니다" description="유효 배열 크기 768B와 실제 DRAM traffic 768B가 같다는 가정을 눈에 보이게 분리했습니다." note="Cache miss, write allocation, ECC, transaction 낭비가 있으면 오른쪽 DRAM 막대가 달라집니다. 대역폭도 명목 peak가 아니라 지속 가능한 같은 경계의 값을 써야 합니다.">
        <div data-viz-canvas className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center"><div><p className="mb-2 text-xs font-bold">프로그램이 요구한 유효량</p><div className="h-10 border border-border bg-muted/60"/><p className="mt-2 font-mono text-sm">A 256 + B 256 + C 256 = 768B</p></div><span className="text-center text-sm font-bold text-primary">같다고 가정</span><div><p className="mb-2 text-xs font-bold">DRAM 경계를 지난 실제량</p><div className="h-10 border border-primary/60 bg-primary/20"/><p className="mt-2 font-mono text-sm">Q_DRAM = 768B</p></div></div>
      </VizFrame>
    );
  }
  return (
    <VizFrame eyebrow="64번 계산과 768바이트" title="연산 막대보다 데이터 막대가 12배 길어 1/12 FLOP/B입니다" description="입력 A·B를 각각 256B 읽고 출력 C를 256B 쓰는 같은 64원소 덧셈입니다." note="1TB/s와 1TFLOP/s는 설명용 상한입니다. 실제 병목은 같은 경계의 지속 bandwidth와 해당 instruction의 처리율로 다시 비교합니다.">
      <div data-viz-canvas className="space-y-4"><div className="grid grid-cols-[5rem_minmax(0,1fr)_5rem] items-center gap-2"><span className="text-xs font-bold">계산</span><div className="h-6 w-[8.333%] min-w-3 border border-primary bg-primary/30"/><span className="font-mono text-xs">64 FLOP</span></div><div className="grid grid-cols-[5rem_minmax(0,1fr)_5rem] items-center gap-2"><span className="text-xs font-bold">데이터</span><div className="grid h-6 grid-cols-3 border border-border"><span className="bg-muted/50"/><span className="border-x border-border bg-muted/70"/><span className="bg-primary/15"/></div><span className="font-mono text-xs">768 B</span></div><div className="grid gap-2 border-t border-border pt-4 text-sm sm:grid-cols-2"><p><strong>연산 강도</strong><br/><span className="font-mono">64÷768 = 1/12 FLOP/B</span></p><p><strong>대역폭 상한</strong><br/><span className="font-mono">1TB/s×1/12 = 83.3GFLOP/s</span></p></div></div>
    </VizFrame>
  );
}
