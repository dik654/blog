import Overview from './qwen-korean-consistency/Overview';
import PromptLevel from './qwen-korean-consistency/PromptLevel';
import SmoothieQwen from './qwen-korean-consistency/SmoothieQwen';
import RLApproach from './qwen-korean-consistency/RLApproach';
import RuntimeGuard from './qwen-korean-consistency/RuntimeGuard';
import DecisionMatrix from './qwen-korean-consistency/DecisionMatrix';

export default function QwenKoreanConsistencyArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <PromptLevel />
      <SmoothieQwen />
      <RLApproach />
      <RuntimeGuard />
      <DecisionMatrix />
    </div>
  );
}
