const axios = require("axios");

/**
 * Get IAM access token
 */
async function getAccessToken() {
  const response = await axios.post(
    "https://iam.cloud.ibm.com/identity/token",
    new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: process.env.WATSONX_API_KEY,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

/**
 * Get AI recommendations (NAMES ONLY)
 */
async function getAIRecommendations(medicine) {
  const token = await getAccessToken();

  const response = await axios.post(
    `${process.env.WATSONX_URL}/ml/v1/text/chat?version=2024-05-01`,
    {
      model_id: "meta-llama/llama-3-3-70b-instruct",

      messages: [
        {
          role: "user",
          content: `
You are a pharmaceutical recommendation engine.

STRICT RULES:
- ONLY suggest pharmaceutical drug alternatives
- ONLY drugs with similar therapeutic use
- DO NOT suggest therapies (no Ayurveda, Homeopathy, Acupuncture, Yoga, etc.)
- DO NOT suggest supplements or general wellness treatments
- DO NOT explain anything
- Output ONLY JSON array of 3 drug names

FORMAT:
["drug1", "drug2", "drug3"]

MEDICINE: ${medicine}
`
        }
      ],

      project_id: process.env.WATSONX_PROJECT_ID,

      parameters: {
        max_tokens: 100,
        temperature: 0.2
      }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  let text = response.data.choices[0].message.content;

  //  Clean possible markdown (VERY IMPORTANT)
  text = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Raw AI output:", text);
    throw new Error("AI returned invalid JSON");
  }
}

module.exports = { getAIRecommendations };