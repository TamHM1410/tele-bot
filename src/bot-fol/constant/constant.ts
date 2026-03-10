// ─── Constants ─────────────────────────────────────────────
export const HL7_STEPS :any = [
  { key: 'pasId',      label: '🆔 *PAS ID* (mã bệnh nhân):' },
  { key: 'familyName', label: '👤 *Họ* (family name):' },
  { key: 'givenName',  label: '👤 *Tên* (given name):' },
  { key: 'dob',        label: '🎂 *Ngày sinh* (YYYYMMDD, vd: 19900101):' },
  { key: 'gender',     label: '⚧ *Giới tính* (M/F):' },
  { key: 'address',    label: '🏠 *Địa chỉ*:' },
  { key: 'ward',       label: '🏥 *Hospital* (phòng/khoa):' },
  { key: 'consultant', label: '👨‍⚕️ *Ward*:' },
  { key: 'episodeId',  label: '🔢 *Episode ID*:' },
];

// Flow chỉ cần nhập thông tin bệnh nhân (ward tự lấy từ step label)
export const FLOW_PATIENT_STEPS :any = [
  { key: 'pasId',      label: '🆔 *PAS ID*:' },
  { key: 'familyName', label: '👤 *Họ*:' },
  { key: 'givenName',  label: '👤 *Tên*:' },
  { key: 'dob',        label: '🎂 *Ngày sinh* (YYYYMMDD):' },
  { key: 'gender',     label: '⚧ *Giới tính* (M/F):' },
  { key: 'address',    label: '🏠 *Địa chỉ*:' },
  { key: 'consultant', label: '👨‍⚕️ *ward:' },
  { key: 'episodeId',  label: '🔢 *Episode ID*:' },
];
