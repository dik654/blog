import type { CodeRef } from "@/components/code/types";
import { beaconStateCodeRefs } from "./codeRefsBeaconState";

export const codeRefs: Record<string, CodeRef> = {
  ...beaconStateCodeRefs,
};
