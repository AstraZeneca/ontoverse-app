// Runtime config: window._env_ (Docker / env-config.js) or process.env (Next.js)

type RuntimeEnv = { CONFIG_ID?: string };

function readWindowEnv(): RuntimeEnv | undefined {
  if (typeof globalThis.window === 'undefined') return undefined;
  return (globalThis.window as Window & { _env_?: RuntimeEnv })._env_;
}

export function getConfigId(): string {
  const windowConfigId = readWindowEnv()?.CONFIG_ID;
  if (windowConfigId) return windowConfigId;

  // Inlined into the client bundle by Next.js when set in .env.local
  if (process.env.NEXT_PUBLIC_CONFIG_ID) return process.env.NEXT_PUBLIC_CONFIG_ID;

  // Server-side only (not available in the browser bundle)
  if (process.env.CONFIG_ID) return process.env.CONFIG_ID;

  return 'MEDIUM';
}

/** @deprecated Prefer getConfigId() — resolved once at import time. */
export const CONFIG_ID = getConfigId();
