export interface FlowStep {
  step: number;
  label: string;
  desc: string;
  msg?: string;
}

export type Flow ={
  id: string;
  title: string;
  subtitle: string;
  color: string;
  patient: {
    pasId: string;
    name: string;
    dob: string;
    gender: string;
    nhs: string;
  };
  steps: FlowStep[];
}

export const INITIAL_FLOWS_DEFAULT: Flow[] = [
  {
    id: "E2E-01", title: "Full Patient Journey", subtitle: "Admit → Transfer → Discharge", color: "#3b82f6",
    patient: { pasId: "01128454", name: "CHAZZA RTTW", dob: "19841201", gender: "M", nhs: "" },
    steps: [
      { step: 1, label: "A01 – Admit to AMUA",    desc: "Patient A nhập viện ward AMUA lúc 08:00" },
      { step: 2, label: "A02 – Transfer to OPMF", desc: "Transfer từ AMUA → OPMF lúc 10:30" },
      { step: 3, label: "A03 – Discharge",         desc: "Xuất viện lúc 14:00" },
    ],
  },
  {
    id: "E2E-02", title: "Admit → Transfer → Cancel Transfer", subtitle: "Kiểm tra restore ward sau khi cancel", color: "#8b5cf6",
    patient: { pasId: "01128454", name: "CHAZZA RTTW", dob: "19841201", gender: "M", nhs: "" },
    steps: [
      { step: 1, label: "A01 – Admit to AMUA",      desc: "Patient A nhập viện ward AMUA lúc 09:00" },
      { step: 2, label: "A02 – Transfer to OPMF",   desc: "Transfer AMUA → OPMF lúc 11:15" },
      { step: 3, label: "A12 – Cancel Transfer",     desc: "Hủy transfer, DateTime khớp với transfer 11:15" },
    ],
  },
  {
    id: "E2E-03", title: "Admit → Discharge → Cancel Discharge", subtitle: "Kiểm tra restore sau A13", color: "#22c55e",
    patient: { pasId: "0110003P", name: "MEDICUSTWO RTTW MRS", dob: "20001001", gender: "F", nhs: "9991706208" },
    steps: [
      { step: 1, label: "A01 – Admit to BAS",      desc: "Patient D nhập viện ward BAS lúc 09:00" },
      { step: 2, label: "A03 – Discharge",          desc: "Xuất viện lúc 13:00" },
      { step: 3, label: "A13 – Cancel Discharge",   desc: "Hủy xuất viện lúc 13:30" },
    ],
  },
  {
    id: "E2E-04", title: "Admit → Cancel Admission", subtitle: "Kiểm tra hủy toàn bộ episode", color: "#f97316",
    patient: { pasId: "03017962", name: "BECCA RTTW MRS", dob: "19790103", gender: "F", nhs: "1761281135" },
    steps: [
      { step: 1, label: "A01 – Admit to BAS",      desc: "Patient C nhập viện ward BAS lúc 10:00" },
      { step: 2, label: "A11 – Cancel Admission",  desc: "Hủy admission lúc 10:45" },
    ],
  },
];

// Extract ADT type từ label "A01 – Admit to AMUA" → "A01"
export const extractMsgType = (label: string): string => {
  return label.match(/^(A\d+)/)?.[1] ?? 'A01';
};

// Extract ward từ label "A01 – Admit to AMUA" → "AMUA"
export const extractWard = (label: string): string => {
  return label.match(/to\s+(\w+)/i)?.[1] ?? '';
};