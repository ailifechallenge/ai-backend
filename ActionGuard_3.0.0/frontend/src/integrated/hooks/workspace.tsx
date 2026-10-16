import type { JourneyPlace, Stay } from "./journey";
import { Context } from "./workspace-context";
import { useContext, useState, useRef, type ReactNode } from "react";
import type { Alert, Translation, Verification } from "../types";
function useStore() {
  const [place, savePlace] = useState<JourneyPlace|null>(null);
  const [stay, setStay] = useState<Stay|null>(null);
  const [messageCountry,setMessageCountry]=useState<"US"|"JP"|"unknown">("unknown");
  function setPlace(value:JourneyPlace|null) { if(value?.lat===place?.lat&&value?.lon===place?.lon&&value?.country===place?.country&&value?.name===place?.name)return; savePlace(value); setStay(null); }
  const [text, setText] = useState("");
  const [alert, setAlert] = useState<Alert | null>(null);
  const [demo, setDemo] = useState(false);
  const [translation, saveTranslation] = useState<Translation | null>(null);
  const [verification, saveVerification] = useState<Verification | null>(null);
  const [verifyText, setVerifyText] = useState("");
  const [revision, setRevision] = useState(0);
  const current = useRef(0);
  function update(
    text: string,
    a: Alert | null = null,
    isDemo = false,
    expectedRevision = current.current,
  ) {
    if (expectedRevision !== current.current) return;
    current.current++;
    setRevision(current.current);
    setText(text);
    setAlert(a);
    setDemo(isDemo);
    saveTranslation(null);
    saveVerification(null);
    setVerifyText("");
  }
  function setTranslation(value: Translation | null, rev = current.current) {
    if (rev !== current.current) return;
    saveTranslation(value);
    setVerifyText(value?.translation ?? "");
    saveVerification(null);
  }
  function setVerification(value: Verification | null, rev = current.current) {
    if (rev === current.current) saveVerification(value);
  }
  return {
    place, setPlace, stay, setStay, messageCountry,setMessageCountry,
    text,
    alert,
    demo,
    translation,
    verification,
    verifyText,
    setVerifyText,
    revision,
    update,
    setTranslation,
    setVerification,
  };
}
export type WorkspaceState = ReturnType<typeof useStore>;
export function Workspace({ children }: { children: ReactNode }) {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useWorkspace() {
  const v = useContext(Context);
  if (!v) throw new Error("Workspace missing");
  return v;
}
