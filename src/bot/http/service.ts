import axios from "axios";
import { logApiError } from "../../config/logger/logger";
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://45.76.191.138:9099';
console.log(`API Endpoint: ${API_ENDPOINT}`);
const baseAxios =axios.create({
  baseURL: API_ENDPOINT,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000, // 5 giây
});
// ─── API Sender ────────────────────────────────────────────
export const sendHL7ToApi = async (
  rawMessage: string,
  chatId: string,
  msgType: string
): Promise<void> => {
  let status: number | undefined;
  try {
    const response = await baseAxios.post('/integration/processEvent', { message: rawMessage });
    status = response.status;
    if (!response.data || response.data.status != '200') {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    logApiError({
      timestamp: new Date().toISOString(),
      chatId,
      msgType,
      endpoint: API_ENDPOINT,
      status,
      error: errMsg,
      rawMessage,
    });
    throw error;
  }
};
 