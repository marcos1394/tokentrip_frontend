// src/app/auth/callback/google/page.tsx
"use client";

import { useEffect, useState, Suspense } from 'react'; // Añadido Suspense
import { useRouter } from 'next/navigation';
import { useZkLogin, UserZkLoginData } from '@/hooks/useZkLogin'; // Ajusta la ruta si es diferente

// Envolver el componente con Suspense para leer los parámetros de búsqueda del cliente
function GoogleCallbackContent() {
  const router = useRouter();
  const [hashFragment, setHashFragment] = useState<string | null>(null);
  // Renombrado processGoogleCallback a processCallback en el hook
  const { processCallback, fetchZkProof, zkLoginData, error, isLoading } = useZkLogin();
  const [statusMessage, setStatusMessage] = useState('Processing Google login...');
  const [finalZkLoginData, setFinalZkLoginData] = useState<UserZkLoginData | null>(null);


  useEffect(() => {
    // El fragmento hash solo está disponible en el lado del cliente
    if (typeof window !== 'undefined') {
      setHashFragment(window.location.hash);
    }
  }, []);

  useEffect(() => {
    if (hashFragment && processCallback && fetchZkProof) { // Asegurarse que las funciones estén definidas
      setStatusMessage('Verifying Google authentication...');
      processCallback(hashFragment)
        .then(async (partialData) => {
          if (partialData) {
            setStatusMessage('Authentication successful, fetching ZK proof...');
            const dataWithProof = await fetchZkProof(partialData);
            if (dataWithProof && dataWithProof.processedZkProofData) { // Verificamos processedZkProofData
              setStatusMessage('ZK Proof obtained! Login successful.');
              setFinalZkLoginData(dataWithProof); // Guardar los datos finales
              console.log("zkLogin Completo en Frontend (Google):", dataWithProof);
              
              // TODO: Enviar `dataWithProof` (o las partes relevantes como jwt, userSuiAddress, y la prueba ZK serializada)
              // a tu endpoint de backend `/auth/zklogin-sui` para crear una sesión de TokenTrip.
              // Ejemplo:
              // const backendResponse = await fetch('/api/auth/zklogin-sui', { // Asumiendo una ruta API de Next.js
              //   method: 'POST',
              //   headers: { 'Content-Type': 'application/json' },
              //   body: JSON.stringify({ 
              //     provider: dataWithProof.provider,
              //     jwt: dataWithProof.jwt,
              //     userSuiAddress: dataWithProof.userSuiAddress,
              //     // Necesitarás la prueba ZK y la firma efímera para getZkLoginSignature y luego para el backend
              //     // Esto es más complejo y depende de cómo tu backend verifique/use estos datos.
              //     // Por ahora, nos enfocamos en el flujo del frontend.
              //   }),
              // });
              // if (backendResponse.ok) {
              //   const { tokenTripToken } = await backendResponse.json();
              //   // Guardar tokenTripToken y redirigir
              //   setStatusMessage('TokenTrip session created! Redirecting...');
              //   setTimeout(() => router.push('/dashboard'), 2000); 
              // } else {
              //   setStatusMessage('Failed to create TokenTrip session.');
              // }

              // Redirección de ejemplo simple por ahora
               setTimeout(() => router.push('/'), 2000); // Redirigir a la home o dashboard

            } else if (!dataWithProof?.processedZkProofData) {
               setStatusMessage('Failed to obtain ZK proof. Please try again or contact support.');
            }
          } else {
            // Si processCallback devuelve null, probablemente hubo un error manejado en el hook
            if (!error) { // Si el hook no puso un error, lo ponemos nosotros
                setStatusMessage('Failed to process Google login. Please check console and try again.');
            }
          }
        })
        .catch((err) => { // Este catch es por si processCallback o fetchZkProof lanzan un error no capturado
          console.error("Error in Google callback flow:", err);
          setStatusMessage(`Error: ${err instanceof Error ? err.message : String(err)}. Redirecting to login...`);
          // setTimeout(() => router.push('/login'), 3000); 
        });
    }
  }, [hashFragment, processCallback, fetchZkProof, router, error]); // Añadido error a las dependencias

  // Mostrar mensajes de estado, carga y error
  if (isLoading) {
    return <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-white p-4 text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div><p>{statusMessage}</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-slate-950 text-red-400 p-4 text-center"><p>Error: {error}. <br/> {statusMessage}</p></div>;
  }
  
  if (finalZkLoginData?.processedZkProofData) {
     return <div className="flex justify-center items-center h-screen bg-slate-950 text-green-400 p-4 text-center"><p>{statusMessage}</p></div>;
  }

  return <div className="flex justify-center items-center h-screen bg-slate-950 text-white p-4 text-center"><p>{statusMessage || "Initializing..."}</p></div>;
}


export default function GoogleCallbackPage() {
  // Suspense es necesario porque usamos useSearchParams (indirectamente a través de window.location.hash)
  // y el renderizado del cliente necesita acceder a esto.
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen bg-slate-950 text-white"><p>Loading callback...</p></div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}