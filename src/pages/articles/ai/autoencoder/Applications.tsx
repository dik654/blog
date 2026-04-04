import ApplicationsViz from './viz/ApplicationsViz';

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활용 사례</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        이미지 노이즈 제거, 이상 탐지(복원 오차 급증), 데이터 압축, 흑백→컬러 복원.
      </p>
      <ApplicationsViz />
    </section>
  );
}
