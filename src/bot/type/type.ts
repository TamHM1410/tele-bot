import { Flow } from "../constant/constant";

export type ManualSession = {
  mode: "manual";
  step: string;
  msgType: string;
  data: Record<string, string>;
};

export type FlowSession = {
  mode: "flow";
  flow: Flow;
  currentStep: number;
  step: string;
  data: Record<string, string>;
};
