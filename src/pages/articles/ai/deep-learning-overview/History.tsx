import DLTimelineViz from './viz/DLTimelineViz';

export default function History() {
  return (
    <section id="history" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥러닝의 초기 역사</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        80년에 걸친 연구, 좌절, 재발견의 반복.<br />
        1943 인공 뉴런 → 1986 역전파 → 2012 AlexNet → 2017 Transformer.
      </p>
      <DLTimelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 이정표 상세 연표</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// ===== 태동기 (1940-1960) =====

// 1943: McCulloch-Pitts Neuron
// - 최초의 인공 뉴런 수학 모델
// - 이진 입력, 이진 출력 (threshold)
// - 불 논리(AND, OR, NOT) 구현 가능

// 1949: Hebbian Learning
// - "Cells that fire together, wire together"
// - 시냅스 강화 원리 (unsupervised)

// 1958: Perceptron (Rosenblatt)
// - 최초의 학습 가능한 인공 뉴런
// - 선형 분류기
// - 언론: "스스로 학습하는 기계"

// 1969: "Perceptrons" 책 (Minsky & Papert)
// - XOR 문제 해결 불가 증명
// - Single-layer의 한계
// - → First AI Winter

// ===== 부활 (1980-1990) =====

// 1986: Backpropagation (Rumelhart, Hinton, Williams)
// - 다층 네트워크 학습 알고리즘
// - Chain rule + gradient descent
// - XOR 문제 해결 가능

// 1989: Universal Approximation (Cybenko)
// - 1-hidden layer + nonlinearity = 임의 함수 근사
// - 이론적 기반

// 1989: LeNet (LeCun)
// - 최초의 CNN
// - 손글씨 우편번호 인식
// - 초기 practical application

// 1997: LSTM (Hochreiter & Schmidhuber)
// - Vanishing gradient 해결
// - 장기 의존성 모델링 가능

// ===== 딥러닝 혁명 (2012-) =====

// 2006: Deep Belief Networks (Hinton)
// - Greedy layer-wise pretraining
// - "Deep Learning" 용어 정립

// 2010: ReLU (Nair & Hinton)
// - 학습 가속, vanishing 해결
// - Deep network 가능

// 2012: AlexNet (Krizhevsky)
// - ImageNet 16.4% error (이전 26.2%)
// - GPU 훈련 (CUDA)
// - 딥러닝 혁명 시작

// 2014: GAN (Goodfellow)
// - Generative model 혁신
// - Two-player minimax game

// 2015: ResNet (He et al.)
// - Residual connections
// - 152-layer 가능
// - Human-level ImageNet

// 2017: Transformer (Vaswani)
// - "Attention Is All You Need"
// - Self-attention + parallel training
// - Modern LLM의 기반

// 2018: BERT (Google), GPT (OpenAI)
// - Pre-training + fine-tuning
// - NLP 혁명

// 2020: GPT-3 (175B)
// - Few-shot learning emergence
// - Scaling law 입증

// 2022: ChatGPT
// - RLHF로 alignment
// - AI의 대중화

// 2023-2024: GPT-4, Claude, Gemini, LLaMA
// - Multimodal (vision + text)
// - Tool use, reasoning
// - Open source competition`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">"AI Winters" — 침체기</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// First AI Winter (1974-1980)
// 계기: Perceptron 한계, Lighthill Report
// 결과: DARPA 연구비 삭감
// 영향: 10년간 AI 연구 침체

// Second AI Winter (1987-1993)
// 계기: Expert system의 한계
// 결과: AI 스타트업 대거 몰락
// Backprop 존재했지만 컴퓨팅 부족

// 왜 오래 걸렸나
// 1) 컴퓨팅 파워 부족
//    - AlexNet은 2012 GPU 덕분
//    - 훈련에 2개 GTX 580 필요
//    - 1990년 컴퓨터로는 불가능

// 2) 데이터셋 부족
//    - ImageNet: 2009 (1.4M labeled images)
//    - 이전: MNIST 60K가 최대
//    - Big data 시대 필요

// 3) 알고리즘 혁신 필요
//    - ReLU, Dropout, BN, Adam
//    - 초기화 방법 (He, Xavier)
//    - Residual connections

// 4) 이론적 이해 부족
//    - Overparameterization이 왜 작동?
//    - Generalization 이론 미비
//    - Loss landscape 분석`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 연구자들</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">인물</th>
                <th className="border border-border px-3 py-2 text-left">주요 기여</th>
                <th className="border border-border px-3 py-2 text-left">기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Geoffrey Hinton</td>
                <td className="border border-border px-3 py-2">Backprop, DBN, Dropout, Capsule</td>
                <td className="border border-border px-3 py-2">1986~</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Yann LeCun</td>
                <td className="border border-border px-3 py-2">CNN, LeNet, MNIST</td>
                <td className="border border-border px-3 py-2">1989~</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Yoshua Bengio</td>
                <td className="border border-border px-3 py-2">Deep learning theory, attention</td>
                <td className="border border-border px-3 py-2">1990s~</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Jürgen Schmidhuber</td>
                <td className="border border-border px-3 py-2">LSTM, highway network</td>
                <td className="border border-border px-3 py-2">1991~</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Ian Goodfellow</td>
                <td className="border border-border px-3 py-2">GAN</td>
                <td className="border border-border px-3 py-2">2014~</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Ilya Sutskever</td>
                <td className="border border-border px-3 py-2">Seq2Seq, GPT, o1</td>
                <td className="border border-border px-3 py-2">2014~</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Andrej Karpathy</td>
                <td className="border border-border px-3 py-2">CNN viz, Tesla AP, nanoGPT</td>
                <td className="border border-border px-3 py-2">2014~</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 2012년 AlexNet의 3가지 혁명</p>
          <p>
            <strong>1. 하드웨어</strong>:<br />
            - GPU 훈련 (CUDA)<br />
            - CPU 대비 50x 빠름<br />
            - "Deep learning = parallelizable math"
          </p>
          <p className="mt-2">
            <strong>2. 데이터</strong>:<br />
            - ImageNet 1.4M labeled images<br />
            - Fei-Fei Li의 비전<br />
            - "Data is the new oil"
          </p>
          <p className="mt-2">
            <strong>3. 알고리즘</strong>:<br />
            - ReLU (vanishing gradient 해결)<br />
            - Dropout (regularization)<br />
            - Data augmentation<br />
            - Weight initialization
          </p>
          <p className="mt-2">
            <strong>결과</strong>: 이론 50% + 엔지니어링 50%<br />
            Hinton 그룹이 ImageNet 우승 → 전 산업 전환
          </p>
        </div>

      </div>
    </section>
  );
}
