import { Suspense } from "react";
import LegacyAssessRedirectClient from "./redirect-client";

export default function LegacyAssessRedirect() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-500">Opening assessment…</p>}>
      <LegacyAssessRedirectClient />
    </Suspense>
  );
}
