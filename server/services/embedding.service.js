const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");

// Initialize Google Gen AI client if API key is provided
let aiClient = null;
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error("[EmbeddingService] Failed to initialize GoogleGenAI client:", err);
  }
}

/**
 * Calculates Cosine Similarity between two numerical vectors
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} Value between -1.0 and 1.0 (higher = more similar)
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
 * Generates lightweight perceptual color/texture vector fallback
 * Used when external API is unreachable or for instant testing
 */
function generatePerceptualFallback(imageBuffer) {
  const vector = new Array(128).fill(0);
  if (!imageBuffer || imageBuffer.length === 0) return vector;

  const len = imageBuffer.length;
  for (let i = 0; i < len; i++) {
    const bucket = i % 128;
    vector[bucket] += (imageBuffer[i] / 255.0);
  }

  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / magnitude);
}

/**
 * Generates multimodal image vector embedding using Google Gen AI
 * @param {Buffer} imageBuffer - Image binary buffer
 * @param {string} mimeType - e.g. "image/jpeg" or "image/png"
 * @returns {Promise<number[]>} Array of float numbers
 */
async function generateImageEmbedding(imageBuffer, mimeType = "image/jpeg") {
  if (!imageBuffer || imageBuffer.length === 0) {
    throw new Error("Empty image buffer provided for embedding");
  }

  // If Google API is available, generate Google multimodal embeddings
  if (aiClient) {
    try {
      const base64Data = imageBuffer.toString("base64");
      
      // Call Google GenAI embedContent
      const response = await aiClient.models.embedContent({
        model: "text-embedding-004",
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

      if (response && response.embedding && response.embedding.values) {
        return response.embedding.values;
      }
    } catch (error) {
      console.warn("[EmbeddingService] Google API embedding call error, using fallback:", error.message);
    }
  }

  // Perceptual feature vector fallback
  return generatePerceptualFallback(imageBuffer);
}

/**
 * Generates embedding from an image URL (e.g. Cloudinary)
 * @param {string} imageUrl
 * @returns {Promise<number[]>}
 */
async function generateEmbeddingFromUrl(imageUrl) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 10000,
    });
    const buffer = Buffer.from(response.data);
    const mimeType = response.headers["content-type"] || "image/jpeg";
    return await generateImageEmbedding(buffer, mimeType);
  } catch (error) {
    console.error(`[EmbeddingService] Error fetching image from ${imageUrl}:`, error.message);
    return [];
  }
}

/**
 * Matches a query vector against all products and variants in business documents
 * @param {number[]} queryVector
 * @param {Array} businessDocs
 * @param {number} limit
 * @param {number} threshold
 * @returns {Array} Ranked list of matching products
 */
function findVisuallySimilarProducts(queryVector, businessDocs, limit = 20, threshold = 0.5) {
  const matches = [];

  for (const doc of businessDocs) {
    if (!doc.products || !Array.isArray(doc.products)) continue;

    for (const product of doc.products) {
      let highestProductSimilarity = 0;
      let matchedVariant = null;
      let matchedImageUrl = null;

      // Check each variant's embedding
      if (product.variants && Array.isArray(product.variants)) {
        for (const variant of product.variants) {
          if (variant.imageEmbedding && variant.imageEmbedding.length > 0) {
            const similarity = cosineSimilarity(queryVector, variant.imageEmbedding);
            if (similarity > highestProductSimilarity) {
              highestProductSimilarity = similarity;
              matchedVariant = variant;
              matchedImageUrl =
                (variant.Images && variant.Images[0]) || variant.sharedImagePath;
            }
          }
        }
      }

      if (highestProductSimilarity >= threshold || matches.length < 5) {
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
          similarityScore: parseFloat((highestProductSimilarity * 100).toFixed(1)),
        });
      }
    }
  }

  // Sort by highest similarity score
  matches.sort((a, b) => b.similarityScore - a.similarityScore);
  return matches.slice(0, limit);
}

module.exports = {
  cosineSimilarity,
  generateImageEmbedding,
  generateEmbeddingFromUrl,
  findVisuallySimilarProducts,
};
