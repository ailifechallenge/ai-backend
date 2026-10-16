import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {createHash} from 'node:crypto';
import {readFileSync,realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=realpathSync(fileURLToPath(new URL('..',import.meta.url)));
const revision=createHash('sha256');
for(const name of ['backend/core/app_assistant.py','backend/adapters/local_information.py','frontend/src/components/TravelAssistant.tsx','frontend/src/components/TravelAssistant.css','backend/main.py','backend/local_runtime.py','frontend/vite.config.ts','frontend/src/App.tsx','backend/core/urgency.py','backend/core/urgency_ai.py','backend/models/contracts.py','frontend/src/services/api.ts','frontend/src/types/index.ts','frontend/src/pages/Flow.tsx','frontend/src/components/UrgencyCard.tsx','frontend/src/components/UrgencyCard.css'])revision.update(readFileSync(`${root}/${name}`));
const identity={project_id:createHash('sha256').update(root).digest('hex').slice(0,16),revision:revision.digest('hex'),kind:'frontend'};
const apiTarget=(mode:string)=>{const env=loadEnv(mode,'.','ACTIONGUARD_');return (env.ACTIONGUARD_BACKEND_PORT?'http://127.0.0.1:'+env.ACTIONGUARD_BACKEND_PORT:env.ACTIONGUARD_API_TARGET)||'http://127.0.0.1:8000';};
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(),{name:'actionguard-local-runtime',configureServer(server){server.middlewares.use('/__actionguard/runtime',(_req,res)=>{res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify({...identity,api_target:apiTarget(mode)}));});}}],
  server: { proxy: { "/api": apiTarget(mode) } },
  test: { environment: "jsdom", setupFiles: ["./src/test-setup.ts"] },
}));
