import { CitationBlock } from "@/components/ui/citation";
import MirrorViz from "./viz/MirrorViz";

export default function SkeletonAmbiguity() {
  return (
    <section id="skeleton-ambiguity" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">후면 뷰가 안 나온 진짜 원인은 정체성 쪽이 아니었습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          자세를 강제하는 신호로 관절 위치를 쓰는 방법이 있습니다. 사지 배치를 좌표로 주고 매 단계마다 조건으로
          거는 방식이라, 출발점만 주는 방법과 달리 완전한 노이즈에서 시작해도 제약이 유지됩니다.
        </p>

        <p className="leading-7">
          몸은 실제로 따라갑니다. 참조 잠재가 못 하던 회전을 해냅니다. 그런데 네 각도를 뽑아 보니 후면 뷰에서도
          얼굴이 정면이었습니다. 처음에는 정체성 주입이 정면 얼굴을 밀어 넣기 때문이라고 봤습니다.
        </p>

        <p className="leading-7">
          확인해 보니 아니었습니다. 정체성 주입을 완전히 꺼도 후면 뷰에 정면 얼굴이 나왔습니다. 관절 좌표에서
          얼굴 지점을 전부 제거해도 마찬가지였습니다.
        </p>

        <p className="leading-7">
          원인은 더 단순했습니다. 관절 좌표는 앞뒤가 거울 대칭입니다. 정면에서 본 사람과 뒤에서 본 사람의 관절 위치가 사실상 같아서 이 신호만으로는 어느 쪽을 향하고 있는지 표현할 수가
          없습니다.
        </p>
      </div>

      <MirrorViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          그리고 제 쪽 실수가 하나 더 있었습니다. 관절 신호의 효과를 격리하려고 프롬프트에서 시점 표현을 일부러
          빼 두고 있었습니다. 방향을 말해 주는 유일한 통로를 스스로 막아 놓고 방향이 안 나온다고 본 것입니다.
        </p>

        <p className="leading-7">
          격리 자체는 옳은 선택이었습니다. 관절 신호가 얼마나 기여하는지 보려면 다른 신호를 꺼야 합니다.
          문제는 그 격리 조건에서 나온 결과를 실제 파이프라인의 한계로 읽은 것입니다. 실제 구성이라면 둘 다
          씁니다.
        </p>

        <p className="leading-7">
          이 두 가지를 합치면 원인 진단이 완전히 달라집니다. 후면 뷰가 안 나온 것은 정체성 주입의 편향
          때문이 아니라, 방향을 표현할 수 있는 신호가 그 실행에 하나도 없었기 때문이었습니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 후면 뷰 원인 격리 (2026-09-11, RTX 4090 48GB)"
        citeKey={3}
        href="https://github.com/dik654/blog"
      >
        정체성 주입을 완전히 끈 실행에서도 후면 뷰에 정면 얼굴이 나왔고, 관절 좌표에서 얼굴 지점을 제거한
        실행에서도 같았습니다. 해당 좌표 표현이 앞뒤 구분을 담지 못하며, 이 실행들은 관절 신호의 기여를
        격리하려고 프롬프트에서 시점 표현을 뺀 조건이었습니다.
      </CitationBlock>
    </section>
  );
}
