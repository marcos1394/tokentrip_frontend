"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useZkLogin, UserZkLoginData } from "@/hooks/useZkLogin";

function TwitchCallbackContent() {
  const router = useRouter();
  const [hashFragment, setHashFragment] = useState<string | null>(null);
  const { processCallback, fetchZkProof, zkLoginData, error, isLoading } = useZkLogin();
  const [statusMessage, setStatusMessage] = useState("Processing Twitch login...");
  const [finalZkLoginData, setFinalZkLoginData] = useState<UserZkLoginData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHashFragment(window.location.hash);
    }
  }, []);

  useEffect(() => {
    if (hashFragment && processCallback && fetchZkProof && !zkLoginData) {
      setStatusMessage("Verifying Twitch authentication...");
      processCallback(hashFragment)
        .then(async (partialData) => {
          if (partialData) {
            setStatusMessage("Authentication successful, fetching ZK proof...");
            const dataWithProof = await fetchZkProof(partialData);
            if (dataWithProof && dataWithProof.processedZkProofData) {
              setStatusMessage("ZK Proof obtained! Login successful. Redirecting...");
              setFinalZkLoginData(dataWithProof);
              console.log("zkLogin Completo en Frontend (Twitch):", dataWithProof);
              setTimeout(() => router.push("/"), 2000);
            } else {
              setStatusMessage("Failed to obtain ZK proof from Twitch flow. Please try again.");
            }
          } else {
            setStatusMessage("Failed to process Twitch login. Please check console and try again.");
          }
        })
        .catch((err) => {
          console.error("Error in Twitch callback flow:", err);
          setStatusMessage(
            `Error: ${err instanceof Error ? err.message : String(err)}. Redirecting to login...`
          );
        });
    }
  }, [hashFragment, processCallback, fetchZkProof, router, zkLoginData]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-white p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p>{statusMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-red-400 p-4 text-center">
        <p>
          Error: {error}. <br /> {statusMessage}
        </p>
      </div>
    );
  }

  if (finalZkLoginData?.processedZkProofData) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-green-400 p-4 text-center">
        <p>{statusMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-slate-950 text-white p-4 text-center">
      <p>{statusMessage || "Initializing Twitch callback..."}</p>
    </div>
  );
}

export default function TwitchCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen bg-slate-950 text-white">
          <p>Loading Twitch callback...</p>
        </div>
      }
    >
      <TwitchCallbackContent />
    </Suspense>
  );
}