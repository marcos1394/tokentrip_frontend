import { useState, useEffect } from 'react';
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui/keypairs/ed25519';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { toB64, fromB64 } from '@mysten/sui/utils';
import {
  generateNonce,
  jwtToAddress,
  getZkLoginSignature,
} from '@mysten/sui/zklogin';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { jwtDecode } from 'jwt-decode';

// --- TIPOS ---
export type SupportedProvider = 'google' | 'facebook' | 'twitch';

interface ProofPoints {
  pi_a: string[];
  pi_b: string[][];
  pi_c: string[];
}

interface ZkProverResponse {
  inputs: any;
  zkp: ProofPoints;
  maxEpoch: number;
}

interface ZkLoginSignatureFormattedInputs {
  proof: ProofPoints;
  addressSeed: string;
  iss: string;
  aud?: string;
}

interface ProcessedZkProofData {
  proverResponse: ZkProverResponse;
  originalJwt: string;
  userSalt: string;
}

export interface UserZkLoginData {
  userSuiAddress: string;
  jwt: string;
  ephemeralKeyPair: Ed25519Keypair;
  userSalt: string;
  processedZkProofData: ProcessedZkProofData | null;
  nonce: string;
  maxEpoch: number;
  jwtRandomness: string;
  provider: SupportedProvider;
}

// --- CONFIGURACIÓN ---
const SUI_NETWORK = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'devnet' | 'mainnet';
const ZK_PROVER_URL = process.env.NEXT_PUBLIC_ZK_PROVER_URL ||
                     (SUI_NETWORK === 'mainnet' ? 'https://prover.api.sui.io/v1' : 'https://prover.api.testnet.sui.io/v1');
// No hay servicio público de salt, usamos un valor simulado temporalmente
const SIMULATED_SALT = "1234567890"; // Reemplazar con tu servicio de salt real
const MAX_EPOCH_DIFF = 2;

const OAuthConfig = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback/google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: 'openid email profile',
    responseType: 'id_token',
  },
  facebook: {
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
    redirectUri: process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/callback/facebook',
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    scopes: 'email public_profile',
    responseType: 'token,id_token',
  },
  twitch: {
    clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '',
    redirectUri: process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI || 'http://localhost:3000/auth/callback/twitch',
    authUrl: 'https://id.twitch.tv/oauth2/authorize',
    scopes: 'openid user:read:email',
    responseType: 'id_token',
  },
};

interface DecodedJwt {
  iss: string;
  aud: string | string[];
  sub: string;
  nonce?: string;
  exp?: number;
  iat?: number;
  email?: string;
  name?: string;
  [key: string]: any;
}

// --- HOOK ---
export function useZkLogin() {
  const [zkLoginData, setZkLoginData] = useState<UserZkLoginData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const suiClient = new SuiClient({ url: getFullnodeUrl(SUI_NETWORK) });

  const generateRandomness = (): bigint => {
    const array = new Uint8Array(16);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) array[i] = Math.floor(Math.random() * 256);
      console.warn("window.crypto no disponible, usando Math.random (menos seguro).");
    }
    const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    return BigInt('0x' + hex);
  };

  const loginWithProvider = async (provider: SupportedProvider) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`1. Iniciando login con ${provider}...`);
      const config = OAuthConfig[provider];
      if (!config || !config.clientId) {
        throw new Error(`Configuración no encontrada o Client ID faltante para ${provider}`);
      }

      const ephemeralKeyPair = new Ed25519Keypair();
      const ephemeralPublicKey: Ed25519PublicKey = ephemeralKeyPair.getPublicKey();

      const { epoch } = await suiClient.getLatestSuiSystemState();
      const maxEpoch = parseInt(epoch) + MAX_EPOCH_DIFF;

      const jwtRandomness = generateRandomness();
      const nonce = generateNonce(ephemeralPublicKey, maxEpoch, jwtRandomness);
      console.log(`Nonce para ${provider}:`, nonce);

      // Guardar datos en sessionStorage
      const ephemeralPrivateKeyBech32: string = ephemeralKeyPair.getSecretKey();
      sessionStorage.setItem('ephemeralPrivateKeyBech32', ephemeralPrivateKeyBech32);
      sessionStorage.setItem('maxEpoch', maxEpoch.toString());
      sessionStorage.setItem('jwtRandomness', jwtRandomness.toString());
      sessionStorage.setItem('loginProvider', provider);
      console.log("Datos guardados en sessionStorage:", {
        ephemeralPrivateKeyBech32,
        maxEpoch,
        jwtRandomness,
        provider,
      });

      // Construir URL de autenticación
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: config.responseType,
        scope: config.scopes,
        nonce: nonce,
      });
      const providerAuthUrl = `${config.authUrl}?${params.toString()}`;
      console.log(`Redirigiendo a ${provider}:`, providerAuthUrl);

      // Redirección en la misma pestaña para preservar sessionStorage
      window.location.href = providerAuthUrl;
    } catch (err) {
      console.error(`Error al iniciar login con ${provider}:`, err);
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
    }
  };

  const processCallback = async (callbackUrlFragment: string): Promise<UserZkLoginData | null> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("2. Procesando callback OAuth...");
      const params = new URLSearchParams(callbackUrlFragment.substring(1));
      let idToken = params.get('id_token');
      const receivedState = params.get('state');

      const loginProvider = sessionStorage.getItem('loginProvider') as SupportedProvider | null;
      if (!loginProvider) throw new Error("Proveedor de login no encontrado en sesión.");

      if (loginProvider === 'facebook') {
        const storedState = sessionStorage.getItem('oauthState');
        if (storedState !== receivedState) {
          throw new Error("Prevención de CSRF: El parámetro 'state' no coincide para Facebook.");
        }
        sessionStorage.removeItem('oauthState');
        if (!idToken && params.get('access_token')) {
          console.warn("Facebook devolvió access_token, falta lógica para obtener id_token.");
        }
      }

      if (!idToken) throw new Error('ID Token no encontrado en el callback.');
      console.log(`ID Token obtenido de ${loginProvider} (primeros 60 chars):`, idToken.substring(0, 60) + "...");

      const ephemeralPrivateKeyBech32Stored = sessionStorage.getItem('ephemeralPrivateKeyBech32');
      const maxEpochStr = sessionStorage.getItem('maxEpoch');
      const jwtRandomnessStored = sessionStorage.getItem('jwtRandomness');

      if (!ephemeralPrivateKeyBech32Stored || !maxEpochStr || !jwtRandomnessStored) {
        throw new Error('Datos de sesión efímera no encontrados. Reinicia el login.');
      }
      const maxEpoch = parseInt(maxEpochStr);

      const { schema, secretKey: ephemeralSecretKeyBytes } = decodeSuiPrivateKey(ephemeralPrivateKeyBech32Stored);
      if (schema !== 'ED25519') {
        throw new Error(`Esquema de clave inesperado: ${schema}. Se esperaba ED25519.`);
      }
      const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(ephemeralSecretKeyBytes);

      // Limpiar sessionStorage después de usar los datos
      sessionStorage.removeItem('ephemeralPrivateKeyBech32');
      sessionStorage.removeItem('maxEpoch');
      sessionStorage.removeItem('jwtRandomness');
      sessionStorage.removeItem('loginProvider');

      console.log("3. Obteniendo salt...");
      // Usar salt simulado temporalmente
      const salt = SIMULATED_SALT; // Reemplazar con fetch a tu servicio de salt real
      console.log("Salt simulado obtenido:", salt);

      const userSuiAddress: string = jwtToAddress(idToken, salt);
      console.log("Dirección Sui zkLogin generada:", userSuiAddress);

      const partialZkLoginData: UserZkLoginData = {
        userSuiAddress,
        jwt: idToken,
        ephemeralKeyPair,
        userSalt: salt,
        maxEpoch,
        jwtRandomness: jwtRandomnessStored,
        nonce: generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, jwtRandomnessStored),
        processedZkProofData: null,
        provider: loginProvider,
      };

      setZkLoginData(partialZkLoginData);
      console.log("Datos parciales de zkLogin establecidos para el proveedor:", loginProvider);
      setIsLoading(false);
      return partialZkLoginData;
    } catch (err) {
      console.error("Error procesando callback OAuth:", err);
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
      sessionStorage.clear(); // Limpiar todo en caso de error
      return null;
    }
  };

  const fetchZkProof = async (currentData: UserZkLoginData): Promise<UserZkLoginData | null> => {
    if (!currentData || !currentData.jwt || currentData.processedZkProofData) {
      console.log("fetchZkProof: No hay datos, JWT, o la prueba ya existe. Saltando.");
      return currentData;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log("5. Solicitando prueba ZK...");
      const { jwt, userSalt, ephemeralKeyPair, maxEpoch, jwtRandomness } = currentData;

      const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();
      const extendedEphemeralPublicKey = ephemeralPublicKey.toSuiPublicKey();

      let decodedJwtForPayload: DecodedJwt;
      try {
        decodedJwtForPayload = jwtDecode<DecodedJwt>(jwt);
      } catch (e) {
        throw new Error("JWT inválido o malformado para ZK Prover.");
      }

      const proofPayload = {
        jwt,
        extendedEphemeralPublicKey,
        maxEpoch,
        jwtRandomness,
        salt: userSalt,
        keyClaimName: 'sub',
      };
      console.log("Payload para ZK Prover:", JSON.stringify(proofPayload, null, 2));

      const zkProofResponse = await fetch(ZK_PROVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proofPayload),
      });

      if (!zkProofResponse.ok) {
        const errorText = await zkProofResponse.text();
        throw new Error(`Error del ZK Prover Service: ${zkProofResponse.statusText} - ${errorText}`);
      }

      const proverResponse = (await zkProofResponse.json()) as ZkProverResponse;
      if (!proverResponse || !proverResponse.zkp || typeof proverResponse.maxEpoch === 'undefined') {
        throw new Error('Respuesta del ZK Prover incompleta o malformada.');
      }
      console.log("Respuesta del ZK Prover obtenida.");

      const processedProofData: ProcessedZkProofData = {
        proverResponse,
        originalJwt: jwt,
        userSalt: userSalt,
      };

      const updatedData = { ...currentData, processedProofData, maxEpoch: proverResponse.maxEpoch };
      setZkLoginData(updatedData);
      setIsLoading(false);
      return updatedData;
    } catch (err) {
      console.error("Error al obtener prueba ZK:", err);
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
      return null;
    }
  };

  const getSignatureInputs = (
    processedProofData: ProcessedZkProofData,
  ): ZkLoginSignatureFormattedInputs => {
    if (!processedProofData) {
      throw new Error("Datos de prueba ZK procesados no disponibles.");
    }

    const { proverResponse, originalJwt } = processedProofData;
    let decodedJwt: DecodedJwt;
    try {
      decodedJwt = jwtDecode<DecodedJwt>(originalJwt);
    } catch (e) {
      throw new Error("No se pudo decodificar el JWT original.");
    }

    if (!proverResponse.inputs || !proverResponse.inputs.addressSeed) {
      console.warn("`addressSeed` no encontrado, necesita cálculo manual o ajuste en el prover.");
      proverResponse.inputs = { ...proverResponse.inputs, addressSeed: "PLACEHOLDER_ADDRESS_SEED" };
    }
    if (!proverResponse.inputs.iss) {
      proverResponse.inputs = { ...proverResponse.inputs, iss: decodedJwt.iss };
    }

    return {
      proof: proverResponse.zkp,
      addressSeed: proverResponse.inputs.addressSeed,
      iss: proverResponse.inputs.iss || decodedJwt.iss,
    };
  };

  return {
    loginWithProvider,
    processCallback,
    fetchZkProof,
    getSignatureInputs,
    zkLoginData,
    error,
    isLoading,
  };
}