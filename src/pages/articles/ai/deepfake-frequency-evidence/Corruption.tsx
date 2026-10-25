import { CitationBlock } from "@/components/ui/citation";
import CorruptionMatrixViz from "./viz/CorruptionMatrixViz";

export default function Corruption() {
  return (
    <section id="corruption" data-teach-level="5" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 원본만 손상시켜 주파수 단서가 남는지 봅니다</h2>
      <CorruptionMatrixViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          생성기 A와 B에서 나온 원본 묶음을 먼저 고정하고, 각 원본에서 JPEG·크기 변경·흐림
          파생본을 만듭니다. 이렇게 짝을 맞추면 서로 다른 얼굴이나 배경 차이를 손상 효과로
          잘못 읽는 일을 줄일 수 있습니다. 변환 revision과 입력 checksum도 함께 남겨야 같은
          cell을 다시 만들 수 있습니다.
        </p>
        <p>
          그림의 정규화 peak는 설명용 가정값입니다. 생성기 A의 값은 원본 0.84에서 흐림
          0.11까지 줄지만, 생성기 B는 원본부터 0.22입니다. 이 결과로 말할 수 있는 것은
          “A의 이 변환 조건에서 관측한 막대가 약해졌다”까지입니다. 모든 생성기의 보편
          서명이라는 주장은 이 행렬로 뒷받침되지 않습니다.
        </p>
      </div>
      <div id="paper-fourier-discrepancy" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 주파수 차이의 반례</p>
        <CitationBlock
          type="paper"
          citeKey={1}
          source="Chandrasegaran et al. — A Closer Look at Fourier Spectrum Discrepancies for CNN-Generated Images Detection"
          href="https://openaccess.thecvf.com/content/CVPR2021/html/Chandrasegaran_A_Closer_Look_at_Fourier_Spectrum_Discrepancies_for_CNN-Generated_Images_CVPR_2021_paper.html"
        >
          <p className="text-sm leading-6 text-muted-foreground">
            이 연구는 당시 여러 CNN 생성 모델에서 보고된 고주파 spectrum 감소 차이가
            생성 모델의 본질적 특성인지 재검토했습니다. 마지막 upsampling을 조금 바꾼
            반례 공간에서 그 차이를 피하고, 해당 특징을 쓰는 detector를 우회할 수 있음을
            보였습니다. 여기서는 주파수 단서의 근거 범위를 생성기와 처리 조건에 묶어야
            한다는 근거로만 사용합니다. 모든 주파수 특징이 무가치하다는 뜻으로 넓히지
            않습니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
