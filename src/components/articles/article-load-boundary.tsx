import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error?: Error;
}

/** Article lazy module 실패가 전체 app shell을 무너뜨리지 않게 막습니다. */
export default class ArticleLoadBoundary extends Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <section
        role="alert"
        className="my-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5"
      >
        <h2 className="text-lg font-bold text-foreground">
          글 본문을 불러오지 못했습니다
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          배포 파일이 바뀌었거나 연결이 잠시 끊겼습니다. 페이지를 다시 불러와
          주세요.
        </p>
        <button
          type="button"
          className="mt-4 min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          onClick={() => window.location.reload()}
        >
          다시 불러오기
        </button>
      </section>
    );
  }
}
