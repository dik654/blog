import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import VideoPathLocator, {
  VideoMapReturn,
} from "../video-understanding/VideoPathLocator";
import {
  SpaceTimeAttentionViz,
  TubeletGeometryViz,
  VideoMaeTubeMaskViz,
  VideoTransformerOverviewViz,
} from "./viz/VideoTransformersViz";

const TUBELET_CODE = `function makeTubeletGrid(frames, height, width, depth, patch) {
  // Sampled frame을 depth장씩 묶어 시간 위치 수를 구합니다.
  const time = frames / depth;

  // 높이와 너비를 patch 크기로 나눠 공간 격자를 구합니다.
  const rows = height / patch;
  const columns = width / patch;

  // 시간·행·열의 모든 위치 조합이 transformer token이 됩니다.
  return { time, rows, columns, tokens: time * rows * columns };
}`;

const MASK_CODE = `function videoMaeVisibleTokens(time, space, maskRatio) {
  // 공식 Python int와 같이 공간 위치별 mask 수를 먼저 버림합니다.
  const maskedPerTime = Math.trunc(maskRatio * space);

  // 같은 공간 mask를 모든 시간 위치에 반복합니다.
  const visiblePerTime = space - maskedPerTime;

  // 큰 encoder가 실제로 읽는 token 수를 계산합니다.
  return time * visiblePerTime;
}`;

export default function VideoTransformersArticle() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section
        id="overview"
        data-teach-level="1"
        data-assumed-case="30fps-source-stride-2-16frames"
        className="scroll-mt-20"
      >
        <VideoPathLocator current="transformers" />
        <h2 className="mb-6 text-2xl font-bold">
          같은 16장도 token으로 바꾸면 계산 경계가 달라집니다
        </h2>
        <VideoTransformerOverviewViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글과 같은 30 fps 원본을 사용하겠습니다. Source frame을 두 칸마다
            읽어 index 0·2·4부터 30까지 16장을 만들면 첫 장과 마지막 장 사이는
            1초입니다. 이 sampled clip을 고정한 뒤에만 convolution과
            transformer의 차이를 모델 구조의 차이로 읽을 수 있습니다.
          </p>
          <p>
            이 글에서는 sampled frame 두 장과 같은 <code>16×16</code> 공간을
            tubelet 하나로 묶습니다. 그러면 <code>16×224×224</code> 입력은
            <code> 8×14×14=1,568</code>개 token이 됩니다. 이후 선택은 두
            갈래입니다. TimeSformer의 divided attention은 token 사이 연결 순서를
            바꾸고, VideoMAE의 tube masking은 pretraining encoder에 들어갈 token
            집합을 줄입니다.
          </p>
        </div>
        <ContentBoundary article="video-transformers" />
        <TermBreakdown
          title="이 글에서 구분할 네 용어"
          items={[
            {
              term: "Sampled frame",
              description:
                "원본 영상에서 정한 timestamp 또는 source index에 따라 model input으로 고른 한 장입니다.",
            },
            {
              term: "Tubelet token",
              description:
                "인접한 sampled frames의 같은 공간 patch를 묶어 하나의 embedding으로 투영한 입력 단위입니다.",
            },
            {
              term: "Attention pair",
              description:
                "Query token 하나가 key token 하나와 score를 계산하는 연결 한 쌍입니다.",
            },
            {
              term: "Tube mask",
              description:
                "같은 공간 mask를 모든 시간 위치에 반복해 해당 공간의 tube 전체를 가리는 규칙입니다.",
            },
          ]}
        />
      </section>

      <section id="tubelets" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Tubelet geometry</h2>
        <TubeletGeometryViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            시간 위치 하나는 원본 영상의 연속 두 frame이 아니라, 이미 sampling된
            model input에서 인접한 두 장을 묶습니다. 첫 tubelet의 시간축은
            source frame 0과 2이고, 둘째는 4와 6입니다. 따라서 tubelet
            geometry만 기록하고 source timestamp를 버리면 실제로 어느 시간
            구간을 묶었는지 알 수 없습니다.
          </p>
          <p>
            VideoMAE 공식 구현은 <code>Conv3d</code>의 kernel과 stride를 모두
            <code> (2,16,16)</code>으로 두어 겹치지 않는 cube를 만듭니다. 이
            글의 1,568이라는 수는 그 cube들의 개수, 즉 attention에 들어가기 전
            sequence length입니다. Channel 또는 embedding dimension의 크기가
            아닙니다.
          </p>
        </div>

        <ExplainedFormula
          question="16×224×224 clip에서 tubelet token은 몇 개입니까?"
          idea={
            <p>
              시간·높이·너비를 각 block 크기로 나눈 뒤 세 위치 수를 곱합니다.
            </p>
          }
          formula={String.raw`N=(F/\tau)(H/P)(W/P)`}
          annotatedFormula={String.raw`\begin{aligned}T&=\underbrace{16/2}_{\text{sampled frames / tubelet depth}}=8\\S&=\underbrace{(224/16)(224/16)}_{\text{row positions × column positions}}=196\\N&=\underbrace{T\times S}_{\text{time-space 위치 조합}}=8\times196=1{,}568\end{aligned}`}
          operations={[
            {
              expression: String.raw`16/2=8`,
              annotation: [
                "sampled frame 16장을",
                "두 장씩 묶어 시간 위치 8개 생성",
              ],
            },
            {
              expression: String.raw`224/16=14`,
              annotation: [
                "높이와 너비 각각을",
                "16-pixel patch 14칸으로 분할",
              ],
            },
            {
              expression: String.raw`14\times14=196`,
              annotation: [
                "한 시간 위치의 행·열을 곱해",
                "공간 위치 196개 생성",
              ],
            },
            {
              expression: String.raw`8\times196=1{,}568`,
              annotation: [
                "시간과 공간 위치를 곱해",
                "전체 transformer sequence 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "F,H,W",
              name: "Input axes",
              description: "Sampled frame 수·높이·너비입니다.",
            },
            {
              symbol: String.raw`\tau`,
              name: "Tubelet depth",
              description: "Token 하나가 묶는 sampled frame 수입니다.",
            },
            {
              symbol: "P",
              name: "Patch size",
              description: "정사각형 공간 patch의 한 변입니다.",
            },
            {
              symbol: "N",
              name: "Sequence length",
              description: "Special token을 제외한 tubelet token 수입니다.",
            },
          ]}
          assumptions={[
            "16은 2로, 224는 16으로 나누어떨어집니다.",
            "Kernel과 stride가 같은 non-overlapping tubelet을 사용합니다.",
            "Position embedding과 special token은 이 개수에서 제외합니다.",
          ]}
          interpretation="시간 위치 8개마다 공간 위치 196개가 있으므로 transformer가 받는 tubelet sequence는 1,568개입니다."
        />

        <div className="not-prose my-6 border-y border-border py-4">
          <p className="mb-3 text-xs font-bold text-muted-foreground">
            그림과 수식이 함께 사용하는 TypeScript 계산
          </p>
          <pre className="overflow-x-auto bg-muted/25 p-4 text-[12px] leading-6">
            <code>{TUBELET_CODE}</code>
          </pre>
        </div>

        <div
          id="code-videomae-patch-embed"
          className="not-prose mt-8 scroll-mt-24"
        >
          <CitationBlock
            type="code"
            citeKey={1}
            source="VideoMAE 공식 코드 — PatchEmbed"
            href="https://github.com/MCG-NJU/VideoMAE/blob/14ef8d856287c94ef1f985fe30f958eb4ec2c55d/modeling_finetune.py#L134-L156"
          >
            <div className="space-y-2 font-sans text-sm leading-6">
              <p>
                <strong>확인한 코드.</strong>{" "}
                <code>num_frames // tubelet_size</code>와 두 공간축 몫을 곱해
                token 수를 정하고, <code>Conv3d</code>의 kernel과 stride를 같은{" "}
                <code>(tubelet, patch, patch)</code>로 둡니다.
              </p>
              <p>
                <strong>이 글의 대입.</strong> 16 frames, tubelet 2, image 224,
                patch 16을 넣어 <code>8×14×14</code>를 복원합니다.
              </p>
              <p>
                <strong>버전 경계.</strong> Commit
                <code> 14ef8d856287c94ef1f985fe30f958eb4ec2c55d</code>의 공식
                PyTorch 구현에 한정합니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section
        id="attention-cost"
        data-teach-level="3"
        className="scroll-mt-20"
      >
        <h2 className="mb-5 text-2xl font-bold">Space-time attention</h2>
        <SpaceTimeAttentionViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Joint attention은 각 token이 모든 시간·공간 token과 같은 score
            matrix에서 직접 비교되도록 합니다. 반면 TimeSformer의 divided
            block은 먼저 같은 공간 위치의 token들을 시간축으로 모아 temporal
            attention을 수행하고, 그 결과를 같은 시간의 공간 격자로 다시 모아
            spatial attention을 수행합니다.
          </p>
          <p>
            두 단계를 지나면 먼 시간·공간 정보가 전달될 수 있지만, joint의 모든
            space-time pair를 한 번에 계산한 것은 아닙니다. 아래 pair 수는 이
            연결 구조를 비교하기 위한 proxy입니다. Attention head 수, embedding
            dimension, QKV projection, MLP, memory traffic과 실제 kernel
            latency는 별도로 측정해야 합니다.
          </p>
          <p>
            또 하나의 경계가 있습니다. TimeSformer 원형은 frame마다 2D patch를
            만들므로 temporal depth가 1입니다. 이 글은 VideoMAE의 depth-2 cube
            embedding으로 시간 위치 8개를 만든 뒤, 같은 <code>T=8,S=196</code>
            에서 연결 수를 비교합니다. Token 수가 같아도 token 하나가 담은 raw
            input은 같지 않습니다.
          </p>
        </div>

        <ExplainedFormula
          question="T=8,S=196에서 joint와 divided attention은 몇 pair를 계산합니까?"
          idea={
            <p>
              Joint는 전체 <code>TS</code>를 제곱하고, divided는 시간별 공간
              pair와 공간별 시간 pair를 따로 계산해 더합니다.
            </p>
          }
          formula={String.raw`C_{joint}=(TS)^2,\quad C_{div}=TS^2+ST^2`}
          annotatedFormula={String.raw`\begin{aligned}C_{joint}&=\underbrace{(8\times196)^2}_{\text{모든 time-space token pair}}=2{,}458{,}624\\C_{space}&=\underbrace{8\times196^2}_{\text{시간 위치마다 공간 pair}}=307{,}328\\C_{time}&=\underbrace{196\times8^2}_{\text{공간 위치마다 시간 pair}}=12{,}544\\C_{div}&=\underbrace{C_{space}+C_{time}}_{\text{두 attention stage의 pair 합}}=319{,}872\end{aligned}`}
          operations={[
            {
              expression: String.raw`8\times196=1{,}568`,
              annotation: [
                "시간과 공간 위치를 펴서",
                "전체 token sequence 계산",
              ],
            },
            {
              expression: String.raw`1{,}568^2=2{,}458{,}624`,
              annotation: [
                "모든 query와 key 조합을 세어",
                "joint pair proxy 계산",
              ],
            },
            {
              expression: String.raw`8\times196^2=307{,}328`,
              annotation: ["각 시간의 공간 pair를", "시간 위치 8개에서 반복"],
            },
            {
              expression: String.raw`196\times8^2=12{,}544`,
              annotation: ["각 공간의 시간 pair를", "공간 위치 196개에서 반복"],
            },
            {
              expression: String.raw`307{,}328+12{,}544=319{,}872`,
              annotation: [
                "Temporal과 spatial stage를 더해",
                "divided pair proxy 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "T",
              name: "Temporal positions",
              description: "Tubelet embedding 뒤 시간 위치 수입니다.",
            },
            {
              symbol: "S",
              name: "Spatial positions",
              description: "시간 위치 하나의 공간 token 수입니다.",
            },
            {
              symbol: String.raw`C_{joint}`,
              name: "Joint pair proxy",
              description:
                "모든 time-space token의 직접 query-key 조합 수입니다.",
            },
            {
              symbol: String.raw`C_{div}`,
              name: "Divided pair proxy",
              description:
                "Temporal과 spatial attention stage의 query-key 조합 합입니다.",
            },
          ]}
          assumptions={[
            "Classification token과 special-token 연결은 제외합니다.",
            "각 attention stage는 dense score matrix를 만든다고 가정합니다.",
            "Pair 수가 실제 FLOPs·메모리 사용량·응답 시간과 같다는 뜻은 아닙니다.",
          ]}
          interpretation="이 fixture의 pair proxy는 joint 2,458,624개, divided 319,872개입니다. 계산량 차이와 정보 경로 차이를 함께 봐야 합니다."
        />

        <div id="paper-timesformer" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Bertasius et al. — TimeSformer"
            href="https://proceedings.mlr.press/v139/bertasius21a.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Frame-level patch token에 어떤 space-time
                self-attention 구조를 적용할지 비교합니다.
              </p>
              <p>
                <strong>이 글의 사용.</strong> Joint와 divided attention의 직접
                연결 경계, divided block의 temporal→spatial 순서를 사용합니다.
              </p>
              <p>
                <strong>논문의 관찰.</strong> 논문이 비교한 video-classification
                설정에서는 divided attention이 가장 높은 정확도를 보였습니다.
              </p>
              <p>
                <strong>근거 범위.</strong> ICML 2021 논문의 architecture,
                datasets, clip·resolution, pretraining 조건입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 모든 sequence
                길이·hardware·task에서 같은 품질이나 latency 우위를 보장하지
                않습니다.
              </p>
            </div>
          </CitationBlock>
          <CitationBlock
            type="code"
            citeKey={3}
            source="TimeSformer 공식 코드 — divided_space_time Block"
            href="https://github.com/facebookresearch/TimeSformer/blob/a5ef29a7b7264baff199a30b3306ac27de901133/timesformer/models/vit.py#L115-L140"
          >
            <div className="space-y-2 font-sans text-sm leading-6">
              <p>
                <strong>확인한 코드.</strong> Patch tensor를 spatial position별
                temporal sequence로 재배열한 뒤 temporal attention을 수행하고,
                다시 time별 spatial sequence로 바꿔 spatial attention을
                수행합니다.
              </p>
              <p>
                <strong>버전 경계.</strong> Archive된 공식 저장소 commit{" "}
                <code>a5ef29a7b7264baff199a30b3306ac27de901133</code>의
                구현입니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section
        id="masked-pretraining"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <h2 className="mb-5 text-2xl font-bold">VideoMAE tube masking</h2>
        <VideoMaeTubeMaskViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            기존 글의 <code>(1−0.9)×1,568≈157</code>은 전체 token에 비율을 한 번
            적용한 근삿값이었습니다. 그러나 VideoMAE 공식 구현은 공간 위치
            196개에서 먼저 <code>int(0.9×196)=176</code>개를 가리고, 남은 20개
            위치의 mask pattern을 시간축 8곳에 반복합니다. 따라서 encoder가 받는
            token은
            <code> 20×8=160</code>개입니다.
          </p>
          <p>
            Encoder는 <code>~mask</code>인 visible token만 처리합니다. 그 출력은
            작은 decoder 차원으로 옮겨지고, mask token과 position embedding이
            더해져 다시 full sequence가 됩니다. Decoder가 최종적으로 예측하는
            대상은 가려졌던 1,408개 cube의 pixel 값입니다. 그래서 encoder pair가
            크게 줄어도 decoder, projection, data I/O와 reconstruction loss
            비용은 남습니다.
          </p>
        </div>

        <ExplainedFormula
          question="공식 tube mask 구현에서 90% masking 뒤 encoder가 읽는 token은 몇 개입니까?"
          idea={
            <p>
              전체 1,568개에 10%를 바로 곱하지 않고, 공간축 mask 수를 먼저
              정수화한 뒤 같은 결과를 시간축에 반복합니다.
            </p>
          }
          formula={String.raw`M_s=\lfloor mS\rfloor,\quad N_{vis}=T(S-M_s)`}
          annotatedFormula={String.raw`\begin{aligned}M_s&=\underbrace{\lfloor0.9\times196\rfloor}_{\text{시간 위치 하나에서 가릴 공간 token}}=176\\V_s&=\underbrace{196-176}_{\text{시간 위치 하나에 남는 token}}=20\\N_{vis}&=\underbrace{8\times20}_{\text{같은 visible 위치를 시간축에 반복}}=160\\N_{mask}&=\underbrace{8\times176}_{\text{decoder가 복원할 masked token}}=1{,}408\end{aligned}`}
          operations={[
            {
              expression: String.raw`\lfloor0.9\times196\rfloor=176`,
              annotation: [
                "공간 위치 196개에 mask ratio를 적용하고",
                "공식 Python int처럼 양수 값을 버림",
              ],
            },
            {
              expression: String.raw`196-176=20`,
              annotation: [
                "가리지 않은 공간 위치를 세어",
                "시간 위치 하나의 visible token 계산",
              ],
            },
            {
              expression: String.raw`8\times20=160`,
              annotation: [
                "같은 공간 mask를 시간 위치 8개에 반복해",
                "encoder input token 계산",
              ],
            },
            {
              expression: String.raw`8\times176=1{,}408`,
              annotation: [
                "가린 공간 위치도 시간축에 반복해",
                "decoder reconstruction target 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "m",
              name: "Mask ratio",
              description: "공간 mask map에서 가릴 비율입니다.",
            },
            {
              symbol: "S",
              name: "Spatial positions",
              description: "시간 위치 하나의 공간 token 수 196입니다.",
            },
            {
              symbol: "T",
              name: "Temporal positions",
              description: "Tubelet embedding 뒤 시간 위치 수 8입니다.",
            },
            {
              symbol: String.raw`N_{vis}`,
              name: "Encoder tokens",
              description:
                "큰 encoder가 실제로 처리하는 visible token 수입니다.",
            },
          ]}
          assumptions={[
            "VideoMAE 공식 TubeMaskingGenerator의 per-spatial-frame int와 temporal tiling을 따릅니다.",
            "Mask ratio는 0.9, 공간 위치는 196, 시간 위치는 8입니다.",
            "다른 구현이 전체 token에서 exact-k를 뽑으면 visible 수가 달라질 수 있습니다.",
          ]}
          interpretation="이 공식 구현과 fixture에서는 약 157개가 아니라 정확히 160개가 encoder에 들어갑니다. 1,408개 masked token은 decoder의 복원 대상입니다."
        />

        <div className="not-prose my-6 border-y border-border py-4">
          <p className="mb-3 text-xs font-bold text-muted-foreground">
            공식 구현의 순서를 같은 수치로 옮긴 TypeScript 계산
          </p>
          <pre className="overflow-x-auto bg-muted/25 p-4 text-[12px] leading-6">
            <code>{MASK_CODE}</code>
          </pre>
        </div>

        <div id="paper-videomae" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={4}
            source="Tong et al. — VideoMAE"
            href="https://arxiv.org/abs/2203.12602v3"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> 인접 frame의 시간 중복과 같은 공간 내용의
                재등장 때문에 masked video reconstruction이 너무 쉬워지는 문제를
                다룹니다.
              </p>
              <p>
                <strong>이 글의 사용.</strong> 2×16×16 cube embedding, 시간축
                전체에 같은 mask map을 쓰는 tube masking, visible-only encoder와
                decoder 복원 경계를 사용합니다.
              </p>
              <p>
                <strong>논문의 관찰.</strong> 논문이 실험한 video datasets와
                pretraining 조건에서는 90~95%의 높은 masking ratio도 유효한
                결과를 보였습니다.
              </p>
              <p>
                <strong>근거 범위.</strong> ArXiv v3/NeurIPS 2022의
                self-supervised pretraining과 downstream transfer 실험입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 90%가 모든 motion domain·clip
                geometry·implementation에서 최적이라는 뜻은 아닙니다.
              </p>
            </div>
          </CitationBlock>
          <CitationBlock
            type="code"
            citeKey={5}
            source="VideoMAE 공식 코드 — TubeMaskingGenerator와 visible-only encoder"
            href="https://github.com/MCG-NJU/VideoMAE/blob/14ef8d856287c94ef1f985fe30f958eb4ec2c55d/masking_generator.py#L3-L20"
          >
            <div className="space-y-2 font-sans text-sm leading-6">
              <p>
                <strong>Mask 생성.</strong> 공간 위치별 mask 수를{" "}
                <code>int</code>로 정하고 한 mask 배열을 시간 위치 수만큼{" "}
                <code>tile</code>합니다.
              </p>
              <p>
                <strong>Encoder 선택.</strong> 같은 commit의{" "}
                <code>modeling_pretrain.py</code> 88~104행은{" "}
                <code>x[~mask]</code>만 encoder block에 전달합니다.
              </p>
              <p>
                <strong>Decoder 경계.</strong> 271~284행은 visible output과 mask
                token을 합친 뒤 masked token prediction만 반환합니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>

      <section id="return-map" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">부모 지도에 되돌리기</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            [
              "입력",
              "source timestamp → sampled frames → tubelets",
              "16×224×224 → 8×14×14",
            ],
            [
              "연결",
              "joint 또는 temporal→spatial",
              "2,458,624 ↔ 319,872 pairs",
            ],
            [
              "학습 입력",
              "tube mask → visible-only encoder",
              "1,568 → 160 tokens",
            ],
          ].map(([label, path, result]) => (
            <div key={label} className="min-w-0 bg-background px-4 py-4">
              <span className="text-[10px] font-bold text-primary">
                {label}
              </span>
              <strong className="mt-2 block break-keep text-sm leading-6">
                {path}
              </strong>
              <code className="mt-3 block break-words font-mono text-[10px] leading-5 text-muted-foreground">
                {result}
              </code>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            Video transformer의 계산은 transformer라는 이름 하나로 정해지지
            않습니다. 먼저 어떤 source timestamp를 골랐는지, sampled frame을
            어떤 tubelet로 묶었는지, 어느 token끼리 attention score를
            계산하는지, pretraining에서 어느 token을 encoder에서 제외했는지를
            차례로 기록해야 합니다.
          </p>
          <p>
            이제 부모 지도의 네 갈래가 연결됩니다. 시간 관측은 실제 seconds를
            고정하고, clip sampling은 재현할 입력을 고르며, convolution은 국소
            kernel과 pathway로 시간을 섞고, transformer는 token geometry와
            attention graph로 정보 경로를 만듭니다.
          </p>
        </div>
        <VideoMapReturn current="transformers" />
      </section>
    </div>
  );
}
