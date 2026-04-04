import CooccurrenceViz from './viz/CooccurrenceViz';

export default function Distributional() {
  return (
    <section id="distributional" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">분포 가설과 동시발생</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        분포 가설 — "비슷한 맥락에 등장하는 단어는 비슷한 의미."<br />
        코퍼스를 윈도우로 훑어 동시발생 횟수를 행렬로 기록한다.
      </p>
      <CooccurrenceViz />
    </section>
  );
}
