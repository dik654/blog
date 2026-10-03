interface ReviewPromptsProps {
  questions: readonly string[];
}

/** 본문을 덮기 전 수치 사례와 한계로 돌아가는 짧은 예측 질문. */
export default function ReviewPrompts({ questions }: ReviewPromptsProps) {
  return (
    <aside className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
      <h3 className="text-base font-semibold">읽은 뒤 예측해 보기</h3>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7">
        {questions.map((question) => <li key={question}>{question}</li>)}
      </ol>
    </aside>
  );
}
