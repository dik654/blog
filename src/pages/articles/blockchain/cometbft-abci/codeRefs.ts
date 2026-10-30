import type { CodeRef } from "@/components/code/types";
import { officialCometBFTAbciCodeRefs } from "./officialCodeRefs";

export const codeRefs: Record<string, CodeRef> = {
  ...officialCometBFTAbciCodeRefs,
};
