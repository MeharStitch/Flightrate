export async function register() {
  // Node.js 22+ defines localStorage as a built-in global, but it throws
  // during Next.js SSR. Neutralize it so the server renders cleanly.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const ls = (globalThis as Record<string, unknown>).localStorage
    if (ls && typeof (ls as Record<string, unknown>).getItem !== 'function') {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true,
      })
    }
  }
}
