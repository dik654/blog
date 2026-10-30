import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "./index.css";
import App from "./App.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("App root element was not found");

// 정적 route의 읽기 본문은 React가 실제 DOM을 만든 뒤에만 숨깁니다.
// Script가 차단되거나 첫 render 전에 실패하면 fallback을 그대로 남깁니다.
const revealInteractiveApp = () => {
  if (!rootElement.firstElementChild) return;
  document.documentElement.classList.add("js-enabled");
  observer.disconnect();
};
const observer = new MutationObserver(revealInteractiveApp);
observer.observe(rootElement, { childList: true });

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
revealInteractiveApp();
