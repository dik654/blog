import { CodeSidebar, useCodeSidebar } from "@/components/code";
import Overview from "./multi-component-finetuning-vram/Overview";
import ResidencySet from "./multi-component-finetuning-vram/ResidencySet";
import ComponentBudget from "./multi-component-finetuning-vram/ComponentBudget";
import AdapterScope from "./multi-component-finetuning-vram/AdapterScope";
import PrecomputeOffload from "./multi-component-finetuning-vram/PrecomputeOffload";
import BudgetGate from "./multi-component-finetuning-vram/BudgetGate";
import { codeRefs } from "./multi-component-finetuning-vram/codeRefs";
import { diffusersTree } from "./multi-component-finetuning-vram/fileTree";

const PROJECT_META = {
  diffusers: {
    id: "diffusers",
    label: "Diffusers · 학습 예제",
    badgeClass: "bg-rose-500/10 border-rose-500 text-rose-700",
  },
};

/**
 * 학습 때는 배우지 않는 부품까지 VRAM에 올라갑니다
 *
 * 코드 인용은 huggingface/diffusers @ 82f175e0 스냅샷을 가리킨다.
 */
export default function MultiComponentFinetuningVramArticle() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-16">
      <Overview />
      <ResidencySet onCodeRef={sidebar.open} />
      <ComponentBudget />
      <AdapterScope />
      <PrecomputeOffload />
      <BudgetGate />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ diffusers: diffusersTree }}
        projectMetas={PROJECT_META}
      />
    </div>
  );
}
