import type { CodeRef } from "@/components/code/types";
import { officialCometBFTConsensusCodeRefs } from "./officialCodeRefs";

export const codeRefs: Record<string, CodeRef> = {
  ...officialCometBFTConsensusCodeRefs,
};
