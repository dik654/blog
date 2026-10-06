import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";

const rows = [
  ["−2", "2⁻² = 0.25", "log₂ 0.25 = −2"],
  ["0", "2⁰ = 1", "log₂ 1 = 0"],
  ["3", "2³ = 8", "log₂ 8 = 3"],
];

export default function InverseTableViz() {
  return (
    <figure data-viz className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/70 px-4 py-3 text-sm font-bold sm:px-6">지수 함수와 로그 함수가 입력·출력을 되돌리는 예</figcaption>
      <div className="px-4 pb-4"><ResponsiveVizTable columns={["지수 y", "Exponential: y → x", "Logarithm: x → y"]} rows={rows} desktopMinWidthClassName="min-w-[34rem]" firstColumnClassName="font-mono" /></div>
    </figure>
  );
}
