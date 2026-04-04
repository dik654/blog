import MNISTViz from './viz/MNISTViz';

export default function MNIST() {
  return (
    <section id="mnist" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손글씨 숫자 인식</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        MNIST — 28×28 흑백 이미지, 0~9 숫자 10클래스 분류.<br />
        784→50→100→10 구조의 3층 신경망으로 정확도 ~97% 달성.
      </p>
      <MNISTViz />
    </section>
  );
}
