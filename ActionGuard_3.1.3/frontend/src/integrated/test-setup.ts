import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(()=>{cleanup();localStorage.removeItem('actionguard-journey-v1');localStorage.removeItem('ag-country');});

Object.defineProperty(window,"scrollTo",{value:()=>{},writable:true});
