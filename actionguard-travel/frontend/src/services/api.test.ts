import { afterEach, describe, expect, it, vi } from "vitest";
import { api, upload } from "./api";

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
function respond(body: string, status = 200) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(body, { status })));
}
describe("API response handling", () => {
  it.each([["", 500], ["<html>gateway error</html>", 502]])("handles non-JSON server failure", async (body, status) => {
    respond(body as string, status as number);
    await expect(api("health")).rejects.toThrow("분석 서버");
  });
  it.each(["", '{"partial":', "<html>index</html>"])("handles invalid successful response", async body => {
    respond(body);
    await expect(api("health")).rejects.toThrow("서버 응답이 비어 있거나 손상");
  });
  it("keeps a valid server explanation", async () => {
    respond('{"detail":"키 설정이 필요합니다."}', 503);
    await expect(api("translate", {})).rejects.toThrow("키 설정이 필요합니다.");
  });
  it("reads JSON even without a JSON content-type", async () => {
    respond('{"ok":true}');
    await expect(api("health")).resolves.toEqual({ ok: true });
  });
  it("rejects null success", async () => {
    respond("null");
    await expect(api("health")).rejects.toThrow("응답 형식");
  });
  it("handles an empty OCR failure", async () => {
    respond("", 500);
    await expect(upload(new File(["image"], "alert.png"))).rejects.toThrow("분석 서버");
  });
  it("handles a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(api("health")).rejects.toThrow("서버에 연결하지 못했습니다");
  });
  it("handles timeout for uploads too", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
    })));
    const check = expect(upload(new File(["image"], "alert.png"))).rejects.toThrow("응답 시간이 초과");
    await vi.advanceTimersByTimeAsync(360000);
    await check;
  });
});

it('rejects missing analysis fields before the UI renders them',async()=>{respond('{}');await expect(api('translate',{})).rejects.toThrow('필요한 내용');});
it('does not leave a map request waiting for six minutes',async()=>{
 vi.useFakeTimers();vi.stubGlobal('fetch',vi.fn((_url,options)=>new Promise((_resolve,reject)=>{options.signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')));})));const check=expect(api('shelters?lat=35&lon=139')).rejects.toThrow('응답 시간이 초과');await vi.advanceTimersByTimeAsync(45000);await check;
});
