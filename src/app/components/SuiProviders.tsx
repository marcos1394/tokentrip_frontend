// src/app/components/SuiProviders.tsx
"use client";

import React from 'react'; // No es necesario useState aquí si queryClient es a nivel de módulo
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

// Crear una ÚNICA instancia de QueryClient a nivel de módulo.
// Esto asegura que sea la misma instancia para toda la aplicación cliente.
const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  // devnet: { url: getFullnodeUrl('devnet') },
  // mainnet: { url: getFullnodeUrl('mainnet') },
});

export default function SuiProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider 
            autoConnect={false} 
            // Considera añadir otras props si son necesarias, como `storageKey` o `storage`
            // Pero autoConnect={false} es un buen inicio.
        >
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}