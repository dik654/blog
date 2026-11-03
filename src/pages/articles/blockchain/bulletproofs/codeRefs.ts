export type { LineNote, CodeRef } from "@/components/code/types";
import type { CodeRef } from "@/components/code/types";
import { coreCodeRefs } from "./codeRefsCore";

export const codeRefs: Record<string, CodeRef> = {
  ...coreCodeRefs,
};
