import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import PleNgramViz from "./viz/PleNgramViz";

export default function PleNgram({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="ple-ngram" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">n-gram 임베딩은 한 층에만 붙고 표는 51B입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Flash-Next는 2번 층 하나에서만 직전 토큰 조합을 따로 조회합니다. 현재 토큰과 직전 한두 토큰을 해시해
          전용 임베딩 표에서 16개 행을 읽고, 그 값을 지금 stream 상태로 게이팅해 더합니다. 이 표 하나가
          512억 개 파라미터로 backbone 125B와 맞먹는 크기입니다.
        </p>

        <p className="leading-7">
          토큰 임베딩만으로는 같은 단어가 앞에 무엇이 왔는지에 따라 달라지는 부분을 표현하기 어렵습니다.
          그 구분을 attention이 학습하게 두는 대신, 조합 자체에 전용 벡터를 주는 방식이 Per-Layer Embedding
          입니다. 이름 그대로 특정 층에만 붙습니다.
        </p>

        <p className="leading-7">
          조회 키는 해시로 만듭니다. 직전 토큰들의 id에 seed로 정해진 곱수를 곱한 뒤 XOR로 섞고, head마다
          다른 소수로 나눈 나머지를 행 번호로 씁니다. 2,000만보다 큰 소수 16개를 골라 쓰므로 head 하나가
          약 2천만 행을 갖고, 16개를 합치면 3억 2천만 행입니다.
        </p>

        <p className="leading-7">
          행 하나의 폭은 2,560을 16으로 나눈 160차원입니다. 3억 2천만에 160을 곱하면 512억 개, BF16으로
          담으면 95.4 GiB가 됩니다. 공식 카드가 backbone과 따로 51B라고 적은 숫자가 이 표입니다.
        </p>
      </div>

      <PleNgramViz />

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("ngram-embedding", codeRefs["ngram-embedding"])} />
        <span className="text-xs text-muted-foreground">해시와 조회를 수행하는 NGramEmbedding.forward</span>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          중요한 점은 한 토큰이 이 표에서 읽는 양입니다. 표가 95 GiB라도 실제로 필요한 것은 16개 행, 곧 160
          차원짜리 벡터 16개뿐입니다. 나머지는 그 토큰과 무관합니다. 표를 GPU에 올리지 않고 호스트 메모리에
          두었다가 필요한 행만 가져오는 배치가 가능한 이유가 여기에 있습니다.
        </p>

        <p className="leading-7">
          조회한 값을 그대로 더하지는 않습니다. 현재 stream 상태를 질의로, n-gram 임베딩을 키와 값으로 보고
          갈래마다 게이트를 계산한 뒤 통과시킵니다. 어휘 조합 신호가 문맥과 무관하게 항상 같은 세기로 들어오는
          것을 막는 장치입니다.
        </p>

        <p className="leading-7">
          마지막으로 확장 depthwise convolution이 국소 문맥을 더합니다. 커널 4에 확장 간격 3이므로 상태 길이는
          9 토큰이고, 이 값은 요청마다 따로 보관해야 합니다. n-gram 조회용 직전 토큰 2개까지 합치면 이 층 하나가
          요청당 두 종류의 짧은 상태를 더 만듭니다.
        </p>
      </div>

      <div className="not-prose mt-6 flex flex-wrap items-center gap-2">
        <CodeViewButton onClick={() => onCodeRef("ple-layer", codeRefs["ple-layer"])} />
        <span className="text-xs text-muted-foreground">게이팅과 확장 convolution을 수행하는 PLELayer.forward</span>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="해시 충돌은 왜 문제로 취급하지 않나요"
          preview="서로 다른 조합이 같은 행을 가리키는 일은 실제로 일어납니다. 대신 head를 16개 두어 한 번의 충돌이 전체 신호를 지배하지 않게 만듭니다."
        >
          <p className="leading-7">
            가능한 3-gram 조합은 어휘 248,320개를 세 번 곱한 수라 2천만 행에 넣을 수 없습니다. 나머지 연산이
            서로 다른 조합을 같은 행으로 보내는 것은 설계상 예정된 일입니다.
          </p>
          <p className="leading-7">
            완화 장치는 독립된 해시를 여러 개 쓰는 것입니다. head마다 다른 소수와 다른 곱수를 쓰므로 두 조합이
            16개 head에서 동시에 충돌할 확률은 매우 낮습니다. 한 head에서 섞인 신호는 나머지 head가 구분해 줍니다.
          </p>
          <p className="leading-7">
            경계도 분명합니다. 이 구조는 충돌 확률을 줄일 뿐 없애지 못하며, 어떤 조합이 실제로 섞였는지는
            체크포인트 없이 알 수 없습니다. 또 n-gram 문맥은 문장 경계에서 끊깁니다. 구현이 문서 끝 토큰을 만나면
            그 이전을 잇지 않도록 shift를 막아 두었습니다.
          </p>
        </ProgressiveDetail>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          config는 이 층을 아무 데나 붙이지 못하게 막습니다. PLE는 선형 attention 층에만 허용되고, 문장 경계를
          판정할 종료 토큰 id가 반드시 있어야 하며, 지정한 층 번호는 1부터 세어 층 수 안에 있어야 합니다. 공개
          체크포인트는 그중 2번 한 곳만 지정했고, 왜 한 곳인지에 대한 설명은 공개돼 있지 않습니다.
        </p>
      </div>
    </section>
  );
}
