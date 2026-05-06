/**
 * Minimal env loader
 */
// Fail fast
if (!process.env.WATSONX_API_KEY) {
  throw new Error("Missing WATSONX_API_KEY");
}

if (!process.env.WATSONX_URL) {
  throw new Error("Missing WATSONX_URL");
}

if (!process.env.WATSONX_PROJECT_ID) {
  throw new Error("Missing WATSONX_PROJECT_ID");
}

console.log("Env loaded");