import {Capacitor} from "@capacitor/core";
import {apiAddress} from "../features/mobile/contracts";
function responseError(status: number): string {
  if (status >= 500) return "분석 서버에 연결할 수 없거나 서버 처리에 실패했습니다. 잠시 후 다시 시도해 주세요. 계속되면 분석 서버가 실행 중인지 확인해 주세요.";
  if (status === 404) return "요청한 기능을 찾을 수 없습니다. 서버 주소와 앱 버전을 확인해 주세요.";
  if (status === 429) return "요청이 많아 잠시 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.";
  return "입력값 또는 서버 상태를 확인해 주세요.";
}

async function readResponse<T>(response: Response): Promise<T> {
  const raw = await response.text();
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(response.ok
      ? "서버 응답이 비어 있거나 손상되었습니다. 다시 시도해 주세요."
      : responseError(response.status));
  }
  if (!response.ok) {
    const detail = data && typeof data === "object" && "detail" in data ? data.detail : undefined;
    throw new Error(typeof detail === "string" && detail.trim() ? detail : responseError(response.status));
  }
  if (data === null || typeof data !== "object") {
    throw new Error("서버 응답 형식이 올바르지 않습니다. 다시 시도해 주세요.");
  }
  return data as T;
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const controller = new AbortController();
  const endpoint=path.split('?')[0];
  const timeoutMs=endpoint==='verify'?300000:['translate','chat','ocr'].includes(endpoint)?120000:45000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const address=apiAddress(path,import.meta.env.VITE_API_BASE_URL,Capacitor.isNativePlatform());
    let response: Response;
    try {
      response = await fetch(address, { ...options, signal: controller.signal });
    } catch (error) {
      if (controller.signal.aborted || (error instanceof Error && error.name === "AbortError")) throw error;
      throw new Error("서버에 연결하지 못했습니다. 인터넷 연결과 분석 서버 실행 상태를 확인해 주세요.");
    }
    const data=await readResponse<T>(response);
    const obj=data as Record<string,unknown>;
    const arrays:Record<string,string[]>={'places/alerts':['alerts'],'places/search':['candidates'],'push/regions':['areas'],'push/hazards':['hazards'],'japan/areas':['areas'],urgency:['actions','evidence','sources'],translate:['summary','glossary'],verify:['issues','unresolved','checks'],guidance:['cards','limitations'],chat:['sources'],shelters:['shelters','warnings']};
    if((arrays[endpoint]||[]).some(key=>!Array.isArray(obj[key])) || (endpoint==='translate'&&typeof obj.translation!=='string') || (endpoint==='chat'&&typeof obj.answer!=='string'))throw new Error('서버 응답에 필요한 내용이 없습니다. 다시 시도해 주세요.');
    if(endpoint==='push/weather'&&(!obj.rows||typeof obj.rows!=='object'||Array.isArray(obj.rows)||typeof obj.checked_at!=='string'))throw new Error('공식 경보 응답 형식이 올바르지 않습니다. 다시 조회하세요.');
    if(endpoint==='urgency'&&(!(obj.level===null||[1,2,3,4].includes(obj.level as number))||!['정보','주의','대비','대피','확인 필요'].includes(obj.label as string)||typeof obj.headline!=='string'||typeof obj.inactive!=='boolean'))throw new Error('대응 단계 응답 형식이 올바르지 않습니다. 원문 지시를 확인하세요.');
    return data;
  } catch (error) {
    if (controller.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
      throw new Error("응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function api<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function upload(file: File) {
  const form = new FormData();
  form.append("file", file);
  return request<{ text: string; note: string }>("ocr", { method: "POST", body: form });
}
