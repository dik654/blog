import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import type { FileNode } from "@/components/code/types";
import { teachCodeRefs } from "./teachCodeRefs";
const fileTrees: Record<string, FileNode> = {
  "pico-sdk": {
    name: "pico-sdk",
    type: "dir",
    children: [
      { name: "src/rp2_common/hardware_gpio/gpio.c", type: "file", path: "pico-sdk/src/rp2_common/hardware_gpio/gpio.c", codeKey: "init" },
      { name: "src/rp2_common/hardware_gpio/include/hardware/gpio.h", type: "file", path: "pico-sdk/src/rp2_common/hardware_gpio/include/hardware/gpio.h", codeKey: "direction" },
    ],
  },
};
export default function TeachCode({ codeKey, label }: { codeKey: string; label: string }) {
  const sidebar = useCodeSidebar();
  return <><CodeViewButton label={label} onClick={() => sidebar.open(codeKey, teachCodeRefs[codeKey])} /><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={teachCodeRefs} fileTrees={fileTrees} projectMetas={{ "pico-sdk": { id: "pico-sdk", label: "Pico SDK 2.2.0 · a1438dff", badgeClass: "border-sky-500 text-sky-700" } }} /></>;
}
