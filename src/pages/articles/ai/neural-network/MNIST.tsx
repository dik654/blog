import ExplainedFormula from "@/components/ui/explained-formula";
import MNISTExperimentViz from "./viz/MNISTExperimentViz";

export default function MNIST() {
  return (
    <section id="mnist" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">MNIST는 MLP의 전체 계약을 검증하는 작은 실험이다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MNIST의 28×28 grayscale 이미지를 펼치면 784차원 vector가 되고 열 개 class를 예측하면 output은 10개 logit이 된다. 이 작은 문제는
          input normalization, batch shape, forward, scalar loss, backward, optimizer, train/eval mode와 split
          경계를 빠르게 점검하기 좋다. 반면 이미지를 펼치는 순간 pixel의 2D locality를 architecture prior로 사용하지 못하므로 현대 vision model의
          성능을 대표하지 않는다.
        </p>
      </div>

      <ExplainedFormula
        question="784→128→10 MLP가 학습해야 하는 parameter는 몇 개인가?"
        idea={<>Dense layer마다 weight 수 Din×Dout과 output bias Dout을 더합니다. Activation은 이 예에서 trainable parameter를 추가하지 않습니다.</>}
        formula={String.raw`\begin{aligned}N_1&=784\times128+128\\N_2&=128\times10+10\\N_\theta&=N_1+N_2=101{,}770\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}N_1&=\underbrace{784\times128+128}_{\text{first-layer weights 계산}}\\N_2&=\underbrace{128\times10+10}_{\text{output layer 계산}}\\N_\theta&=\underbrace{N_1+N_2=101{,}770}_{\text{오른쪽 항으로 결과 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`784\times128+128`, annotation: ["first-layer weights이(가) 식의 결과에","기여하는 방식을 계산합니다.","Dense layer마다"] },
          { expression: String.raw`128\times10+10`, annotation: ["output layer이(가) 식의 결과에 기여하는 방식을","계산합니다.","Dense layer마다"] },
          { expression: String.raw`N_1+N_2=101{,}770`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Dense layer마다"] },
        ]}
        terms={[
          { symbol: "784\\times128", name: "first-layer weights", description: "각 hidden unit이 모든 input pixel과 연결되는 parameter 수입니다." },
          { symbol: "128", name: "first-layer bias", description: "Hidden unit마다 하나씩 갖는 offset입니다." },
          { symbol: "128\\times10+10", name: "output layer", description: "Hidden representation을 열 개 class logit으로 바꾸는 weight와 bias입니다." },
        ]}
        assumptions={["Convolution·normalization·embedding 없이 dense layer 두 개만 사용합니다.", "Batch size는 parameter 수를 바꾸지 않으며 activation memory와 step throughput에 영향을 줍니다."]}
        interpretation="작은 image dataset에서도 dense connectivity는 parameter를 빠르게 늘린다. Parameter 수, activation memory와 compute는 서로 다른 budget이므로 따로 계산해야 합니다."
      />

      <MNISTExperimentViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>점수 하나보다 실패 패턴을 읽는다</h3>
        <p>
          train과 validation이 모두 낮으면 capacity 부족만 의심하지 말고 learning rate, preprocessing, label과 gradient부터 확인한다.
          train만 높고 validation이 낮으면 overfitting뿐 아니라 split leakage, class distribution과 data shift를 점검한다.
          accuracy가 높더라도 confusion matrix와 오분류 이미지를 보면 특정 숫자 쌍, stroke 위치나 배경에 의존하는 shortcut을 찾을 수 있다.
        </p>
        <p>
          MNIST를 포함한 문서 인식에서 end-to-end gradient 학습과 convolutional prior를
          연결한 역사적 맥락은 <a href="https://doi.org/10.1109/5.726791" target="_blank" rel="noreferrer">Gradient-Based Learning Applied to Document Recognition</a>에서
          확인할 수 있다. 교육용 MLP의 높은 점수를 실제 이미지 robustness의 증거로
          일반화해서는 안 된다.
        </p>
      </div>

      <div
        id="paper-document-recognition"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · Document recognition</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          문서 인식 결과는 architecture·data·학습 system을 함께 검증한 사례입니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          LeCun 등은 convolutional network와 gradient 기반 학습을 문서 인식 pipeline에 연결하고 handwritten digit를 포함한 여러 실험을
          정리했습니다. 핵심은 사람이 고정한 feature extractor와 classifier를 따로 최적화하는 대신 task error로 전체 system을 함께 학습한 데 있습니다.
          이 결과는 MNIST를 펼친 dense MLP가 spatial prior를 가진 CNN과 동등하다거나, digit accuracy가 실제 image distribution
          shift의 robustness를 보장한다는 주장은 아닙니다.
        </p>
      </div>
    </section>
  );
}
