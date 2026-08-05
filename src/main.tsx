import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.tsx'

// 메인 번들이 로드돼 여기까지 왔다는 건 앞선 reload 가 성공했다는 뜻 — 플래그 해제해
// 다음 재배포 때도 한 번의 자동 reload 기회를 다시 얻게 한다.
sessionStorage.removeItem('blog:reloaded-for-stale-chunk')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
