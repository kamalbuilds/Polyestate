import superjson from "superjson";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const apiConfig = {
  baseUrl: `${getBaseUrl()}/api`,
  transformer: superjson,
};

export const api = {
  async request(endpoint, body) {
    const response = await fetch(`${apiConfig.baseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    return response.json();
  },
};

export default api;
