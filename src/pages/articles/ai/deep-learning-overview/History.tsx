import DLTimelineViz from './viz/DLTimelineViz';
import DLHistoryViz from './viz/DLHistoryViz';

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

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 이정표 + AI Winters</h3>
      </div>
      <div className="not-prose mt-4 mb-4">
        <DLHistoryViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

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
