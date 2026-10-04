import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs, fileTrees } from "./teachCodeRefs";
export default function TeachCode({ codeKey, label }: { codeKey: string; label: string }) {
  const sidebar = useCodeSidebar();
  return <><CodeViewButton label={label} onClick={() => sidebar.open(codeKey, codeRefs[codeKey])} /><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ "pico-sdk": { id: "pico-sdk", label: "Pico SDK 2.2.0 · a1438dff", badgeClass: "border-sky-500 text-sky-700" } }} /></>;
}
