import type { JourneyPlace, Stay } from "./journey";
import { Context } from "./workspace-context";
import { useContext, useState, useRef, useEffect, type ReactNode } from "react";
import type { Alert, Translation, Verification, UrgencyAssessment, Guidance } from "../types";
import {readJourney,writeJourney} from "./workspace-storage";
function useStore() {
  const [initial]=useState(readJourney);
  const [storageAvailable,setStorageAvailable]=useState(true);
  const [place, savePlace] = useState<JourneyPlace|null>(initial.place);
  const [stay, setStay] = useState<Stay|null>(initial.stay);
  const [messageCountry,setMessageCountry]=useState<"US"|"JP"|"unknown">("unknown");
  function setPlace(value:JourneyPlace|null) {
    const changed=place?.country!==value?.country||place?.lat!==value?.lat||place?.lon!==value?.lon;
    savePlace(value);
    if(value)setMessageCountry(value.country);
    // A selected official message belongs to the previous lookup. Invalidate pending
    // translations too; the new point must fetch its own current official list.
    if(changed&&alert)update("");
  }
  function clearJourney(){savePlace(null);setStay(null);}
  useEffect(()=>{setStorageAvailable(writeJourney(place,stay));},[place,stay]);
  const [text, setText] = useState("");
  const [alert, setAlert] = useState<Alert | null>(null);
  const [guidance, saveGuidance] = useState<Guidance | null>(null);
  const [urgency, saveUrgency] = useState<UrgencyAssessment | null>(null);
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
    saveGuidance(null);
    saveUrgency(null);
    saveTranslation(null);
    saveVerification(null);
    setVerifyText("");
  }
  function setGuidance(value:Guidance|null,rev=current.current){if(rev===current.current)saveGuidance(value)}
  function setUrgency(value:UrgencyAssessment|null,rev=current.current){if(rev===current.current)saveUrgency(value)}
  function refreshAlert(value:Alert){setAlert(previous=>previous?.id===value.id&&previous.text===value.text?value:previous)}
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
    place, setPlace, stay, setStay, messageCountry,setMessageCountry,storageAvailable,clearJourney,
    text,
    alert,
    demo,
    translation,
    urgency,setUrgency,guidance,setGuidance,
    verification,
    verifyText,
    setVerifyText,
    revision,
    update,
    refreshAlert,
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
