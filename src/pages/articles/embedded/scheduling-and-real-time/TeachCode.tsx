import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs, fileTrees } from "./teachCodeRefs";
export default function TeachCode({ codeKey, label }: { codeKey: string; label: string }) {
  const sidebar = useCodeSidebar();
  return <><CodeViewButton label={label} onClick={() => sidebar.open(codeKey, codeRefs[codeKey])} /><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ "freertos-kernel": { id: "freertos-kernel", label: "FreeRTOS V11.2.0 · 0adc196d", badgeClass: "border-sky-500 text-sky-700" } }} /></>;
}
