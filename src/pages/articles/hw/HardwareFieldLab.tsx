import { EngineeringDepthBlocks, type EngineeringDepthData } from "../cloud/EngineeringDepthBlocks";

export default function HardwareFieldLab({ data }: { data: EngineeringDepthData }) {
  return (
    <section className="my-16 min-w-0 border-t border-border pt-10" aria-labelledby="hardware-field-lab">
      <p className="text-xs font-bold text-primary">05 · 06 · 07 현장 드릴</p>
      <h2 id="hardware-field-lab" className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        실제 명령으로 정상 경로를 따라간 뒤 실패 경계를 확인합니다
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
        먼저 판단 항목을 실물과 연결하고(4), 실제 명령·설정을 엽니다(5). 이어서 정상 출력 한 번을 끝까지 읽고(6),
        같은 위치에서 실패 출력이 어떻게 달라지는지 확인합니다(7). 아래 출력은 읽는 법을 보여 주는 예시이며 실제 측정값이 아닙니다.
      </p>
      <EngineeringDepthBlocks data={data} section="mechanism" />
      <EngineeringDepthBlocks data={data} section="source" />
      <EngineeringDepthBlocks data={data} section="limits" />
    </section>
  );
}
