import AIRConstraintViz from './viz/AIRConstraintViz';

export default function AIRConstraints() {
  return (
    <section id="air-constraints" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AIR 제약 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          실행 추적의 무결성을 다항식 등식으로 표현 &mdash; 전이 제약 + 경계 제약.
        </p>
      </div>
      <div className="not-prose"><AIRConstraintViz /></div>
    </section>
  );
}
