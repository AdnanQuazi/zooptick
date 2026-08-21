const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Calculates Cosine Similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generates visual embedding directly using gemini-embedding-2
 * @param {Buffer} imageBuffer
 * @param {string} mimeType
 * @returns {Promise<number[]>}
 */
async function generateImageEmbedding(imageBuffer, mimeType = "image/jpeg") {
  if (!imageBuffer) return [];

  if (!aiClient) {
    console.error("❌ [EmbeddingService] GEMINI_API_KEY is missing in .env");
    return [];
  }

  try {
    const base64Data = imageBuffer.toString("base64");
    const response = await aiClient.models.embedContent({
      model: "gemini-embedding-2",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
    });

    const values = response?.embeddings?.[0]?.values || response?.embedding?.values || [];
    console.log(`✅ [EmbeddingService] Generated gemini-embedding-2 vector (dim: ${values.length})`);
    return values;
  } catch (error) {
    console.error("❌ [EmbeddingService] gemini-embedding-2 error:", error.message);
    return [];
  }
}

/**
 * Generates embedding directly from an image URL (e.g. Cloudinary)
 * @param {string} imageUrl
 * @returns {Promise<number[]>}
 */
async function generateEmbeddingFromUrl(imageUrl) {
  try {
    console.log(`🌐 [EmbeddingService] Fetching image from URL: ${imageUrl}`);
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
    });
    const buffer = Buffer.from(response.data);
    const mimeType = response.headers["content-type"] || "image/jpeg";
    return await generateImageEmbedding(buffer, mimeType);
  } catch (error) {
    console.error(`❌ [EmbeddingService] Error fetching image from ${imageUrl}:`, error.message);
    return [];
  }
}

/**
 * Matches query vector against products in MongoDB
 */
function findVisuallySimilarProducts(queryVector, businessDocs, limit = 20) {
  const matches = [];

  for (const doc of businessDocs) {
    if (!doc.products || !Array.isArray(doc.products)) continue;

    for (const product of doc.products) {
      let highestSimilarity = 0;
      let matchedVariant = null;
      let matchedImageUrl = null;

      if (product.variants && Array.isArray(product.variants)) {
        for (const variant of product.variants) {
          if (variant.imageEmbedding && variant.imageEmbedding.length > 0) {
            const similarity = cosineSimilarity(queryVector, variant.imageEmbedding);
            if (similarity > highestSimilarity) {
              highestSimilarity = similarity;
              matchedVariant = variant;
              matchedImageUrl =
                (variant.Images && variant.Images[0]) || variant.sharedImagePath;
            }
          }
        }
      }

      if (highestSimilarity > 0) {
        matches.push({
          shopId: doc._id,
          shopName: doc.shopName,
          shopLogo: doc.shopLogo,
          address: doc.address,
          contactNumber: doc.contactNumber,
          productId: product._id,
          productName: product.productName,
          brand: product.brand,
          desc: product.desc,
          category: product.category,
          subCategory: product.subCategory,
          MRP: product.MRP,
          sellingPrice: product.sellingPrice,
          matchedVariant,
          matchedImageUrl: matchedImageUrl || (product.variants && product.variants[0] && product.variants[0].sharedImagePath),
          similarityScore: parseFloat((highestSimilarity * 100).toFixed(1)),
        });
      }
    }
  }

  // Sort by highest similarity
  matches.sort((a, b) => b.similarityScore - a.similarityScore);
  return matches.slice(0, limit);
}

module.exports = {
  cosineSimilarity,
  generateImageEmbedding,
  generateEmbeddingFromUrl,
  findVisuallySimilarProducts,
};
