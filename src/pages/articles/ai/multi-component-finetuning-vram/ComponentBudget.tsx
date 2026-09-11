import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import BudgetViz from "./viz/BudgetViz";

const ROWS = [
  { part: "denoiser (학습 대상 호스트)", params: "2.6B", bf16: "5.2 GB", note: "어댑터를 품고 있어 반드시 상주" },
  { part: "text encoder", params: "4.7B", bf16: "9.4 GB", note: "매 스텝 캡션 인코딩에 사용" },
  { part: "autoencoder", params: "84M", bf16: "0.17 GB", note: "매 스텝 이미지 인코딩에 사용" },
  { part: "어댑터", params: "10M", bf16: "0.02 GB", note: "학습 대상. gradient·optimizer state도 여기만" },
];

export default function ComponentBudget() {
  return (
    <section id="component-budget" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">부품마다 따로 세고 항목마다 따로 곱합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          예산을 세는 순서는 부품 목록을 적고 각 부품의 파라미터 수에 dtype 바이트를 곱하는 것부터입니다.
          여기까지가 가중치 항이고, 그다음에 학습 대상에만 gradient와 optimizer state를 더하며, 마지막으로
          activation을 배치와 해상도에서 계산합니다.
        </p>

        <p className="leading-7">
          자주 놓치는 지점은 text encoder입니다. 이미지 생성 모델에서 denoiser만 크다고 생각하기 쉬운데, 큰
          문장 인코더를 쓰는 구성에서는 이쪽이 denoiser보다 클 수 있습니다. 아래는 그런 구성을 가정한 예시
          계산입니다.
        </p>
      </div>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border border-border text-sm">
          <thead>
            <tr className="bg-muted/50">
              {["부품", "파라미터", "BF16 가중치", "역할"].map((h) => (
                <th key={h} className="border border-border px-3 py-2 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.part}>
                <td className="border border-border px-3 py-2 font-medium">{r.part}</td>
                <td className="border border-border px-3 py-2">{r.params}</td>
                <td className="border border-border px-3 py-2">{r.bf16}</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-sm leading-6 text-muted-foreground">
          파라미터 수는 설명을 위해 고른 예시 구성이며 특정 제품의 값이 아닙니다. 실제 모델의 수치는 공개
          config와 가중치 색인에서 확인해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="부품이 여러 개일 때 학습 메모리를 어떻게 씁니까"
        idea="가중치는 모든 부품에서, gradient와 optimizer state는 학습 대상에서만, activation은 실행 조건에서 계산해 더합니다."
        formula={String.raw`M = \sum_{k} b\,N_k + (2b + K)\,N_{\text{tr}} + A(B, R, T)`}
        annotatedFormula={String.raw`M = \underbrace{\sum_{k} b\,N_k}_{\text{모든 부품 가중치}} + \underbrace{(2b + K)\,N_{\text{tr}}}_{\text{학습 대상에만}} + \underbrace{A(B, R, T)}_{\text{activation}}`}
        operations={[
          {
            expression: String.raw`\sum_{k} b\,N_k`,
            annotation: [
              "부품 k의 파라미터 수에 dtype 바이트를 곱해 전부 더합니다",
              "동결 여부와 무관하게 모든 부품이 여기 들어갑니다",
            ],
          },
          {
            expression: String.raw`(2b + K)\,N_{\text{tr}}`,
            annotation: "학습 대상 파라미터에만 gradient(b)와 master weight(b), optimizer state(K)가 붙습니다",
          },
          {
            expression: String.raw`A(B, R, T)`,
            annotation: "배치 B, 해상도 R, 프레임 수 T가 커지면 함께 커지는 항입니다. 해상도는 제곱으로 들어갑니다",
          },
        ]}
        terms={[
          { symbol: String.raw`N_k`, name: "부품 k의 파라미터 수", description: "denoiser·text encoder·autoencoder 등 각각입니다." },
          { symbol: String.raw`N_{\text{tr}}`, name: "학습 대상 파라미터 수", description: "LoRA면 어댑터 크기이고 전체 미세조정이면 호스트 전체입니다." },
          { symbol: "b", name: "dtype 바이트", description: "BF16이면 2입니다. 부품마다 다른 dtype을 쓸 수도 있습니다." },
          { symbol: "K", name: "optimizer state 바이트", description: "옵티마이저가 파라미터당 유지하는 상태의 크기입니다." },
          { symbol: "B, R, T", name: "배치·해상도·프레임", description: "activation 크기를 정하는 실행 조건입니다." },
        ]}
        assumptions={[
          "부품이 모두 같은 장치에 상주한다고 가정합니다. offload를 쓰면 첫 항이 줄지만 전송 시간이 추가됩니다.",
          "activation 항은 구조에 따라 달라지므로 여기서는 함수로만 두고 실제 값은 측정으로 구합니다.",
        ]}
        interpretation="LoRA가 줄이는 것은 두 번째 항뿐입니다. 첫 번째와 세 번째 항은 그대로 남으므로 '어댑터만 학습하니 가볍다'는 직관이 어긋나는 지점이 여기입니다."
      />

      <BudgetViz />

      <h3 id="worked-budget" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        예시 구성으로 합을 내 봅니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          위 표의 구성에서 가중치 항부터 셉니다. 2.6B와 4.7B, 84M, 10M을 더하면 약 7.4B이고 BF16이면 약
          14.8 GB입니다. 여기서 text encoder 하나가 9.4 GB로 전체의 60%를 넘습니다.
        </p>

        <p className="leading-7">
          두 번째 항은 어댑터에만 붙습니다. 1,000만 개 파라미터에 gradient 2바이트, FP32 master weight 4바이트,
          Adam 계열 상태 8바이트를 더하면 약 0.14 GB입니다. 전체 대비 1%도 되지 않습니다.
        </p>

        <p className="leading-7">
          세 번째 항은 실행 조건에 달려 있어 계산보다 측정이 빠릅니다. 다만 방향은 분명합니다. 배치를 늘리거나
          해상도를 올리면 이 항만 커지고, 영상이면 프레임 수가 여기에 그대로 곱해집니다. 그래서 예산이 빠듯할 때
          가장 먼저 조정하는 손잡이가 됩니다.
        </p>

        <p className="leading-7">
          합쳐 보면 그림이 나옵니다. 어댑터 학습이라 두 번째 항은 거의 0에 가깝지만 첫 번째 항 14.8 GB가
          그대로 남고, 여기에 activation이 얹힙니다. 24 GB 장치라면 activation에 쓸 수 있는 여유가 채 9 GB가
          되지 않는 셈입니다.
        </p>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          단일 모델에서 가중치·gradient·optimizer state가 파라미터당 몇 바이트인지의 표준 계산은{" "}
          <Link to="/ai/training-memory-budget#memory-math">학습 메모리 예산</Link>에 있습니다. 이 절은 그 계산을
          부품 수만큼 반복하고 학습 대상에만 두 번째 항을 붙인다는 점만 더했습니다.
        </p>
      </div>
    </section>
  );
}
