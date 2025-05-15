// src/app/auth/callback/facebook/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useZkLogin, UserZkLoginData } from '@/hooks/useZkLogin'; // Ajusta la ruta

function FacebookCallbackContent() {
  const router = useRouter();
  const [hashFragment, setHashFragment] = useState<string | null>(null);
  const { processCallback, fetchZkProof, zkLoginData, error, isLoading } = useZkLogin();
  const [statusMessage, setStatusMessage] = useState('Processing Facebook login...');
  const [finalZkLoginData, setFinalZkLoginData] = useState<UserZkLoginData | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHashFragment(window.location.hash);
    }
  }, []);

  useEffect(() => {
    if (hashFragment && processCallback && fetchZkProof) {
      setStatusMessage('Verifying Facebook authentication...');
      processCallback(hashFragment) // La misma función genérica del hook
        .then(async (partialData) => {
          if (partialData) {
            setStatusMessage('Authentication successful, fetching ZK proof...');
            const dataWithProof = await fetchZkProof(partialData);
            if (dataWithProof && dataWithProof.processedZkProofData) {
              setStatusMessage('ZK Proof obtained! Login successful. Redirecting...');
              setFinalZkLoginData(dataWithProof);
              console.log("zkLogin Completo en Frontend (Facebook):", dataWithProof);
              // TODO: Enviar datos al backend, etc.
              setTimeout(() => router.push('/'), 2000);
            } else if(!dataWithProof?.processedZkProofData) {
               setStatusMessage('Failed to obtain ZK proof from Facebook flow. Please try again.');
            }
          } else {
             if (!error) {
                setStatusMessage('Failed to process Facebook login. Please check console and try again.');
            }
          }
        })
        .catch((err) => {
          console.error("Error in Facebook callback flow:", err);
          setStatusMessage(`Error: ${err instanceof Error ? err.message : String(err)}. Redirecting to login...`);
          // setTimeout(() => router.push('/login'), 3000);
        });
    }
  }, [hashFragment, processCallback, fetchZkProof, router, error]);

  if (isLoading) {
    return <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-white p-4 text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div><p>{statusMessage}</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-slate-950 text-red-400 p-4 text-center"><p>Error: {error}. <br/> {statusMessage}</p></div>;
  }

  if (finalZkLoginData?.processedZkProofData) {
     return <div className="flex justify-center items-center h-screen bg-slate-950 text-green-400 p-4 text-center"><p>{statusMessage}</p></div>;
  }

  return <div className="flex justify-center items-center h-screen bg-slate-950 text-white p-4 text-center"><p>{statusMessage || "Initializing Facebook callback..."}</p></div>;
}

export default function FacebookCallbackPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen bg-slate-950 text-white"><p>Loading Facebook callback...</p></div>}>
      <FacebookCallbackContent />
    </Suspense>
  );
}