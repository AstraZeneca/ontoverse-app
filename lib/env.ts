// Runtime config can be injected via window._env_ (from env-config.js) or process.env
// CONFIG_ID is used for both client and server side

// Function to get runtime config
const getConfigId = (): string => {
  // Client-side: check window._env_ first (injected at runtime by Docker)
  if (typeof window !== 'undefined' && (window as any)._env_) {
    const env = (window as any)._env_;
    if (env.CONFIG_ID) return env.CONFIG_ID;
  }
  
  // Server-side or fallback: check process.env
  if (process.env.CONFIG_ID) return process.env.CONFIG_ID;
  
  return 'MEDIUM';
};

// Export CONFIG_ID (evaluated at module load, but will use runtime values when available)
export const CONFIG_ID = getConfigId();

console.log('CONFIG_ID:', CONFIG_ID);

