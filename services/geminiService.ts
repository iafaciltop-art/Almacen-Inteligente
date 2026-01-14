
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Strategy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processSalesInput = async (input: string, inventory: Product[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Sos un asistente para un almacén en Uruguay. Analizá este mensaje de venta y extraé los productos y cantidades.
    
    Inventario disponible:
    ${inventory.map(p => `${p.name} (ID: ${p.id})`).join(', ')}
    
    Mensaje del usuario: "${input}"
    
    Respondé solo con un JSON que sea un array de objetos: [{ "productId": string, "quantity": number }]. 
    Si no encontrás el producto exacto, intentá matchear con el más parecido del inventario.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            productId: { type: Type.STRING },
            quantity: { type: Type.NUMBER }
          },
          required: ["productId", "quantity"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

export const getSmartInsights = async (sales: any[], inventory: Product[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Sos un asesor experto en almacenes uruguayos. 
    Analizá estos datos y dame 3 consejos cortos en español rioplatense (usá "che", "tenés", "viste").
    Stock actual: ${JSON.stringify(inventory.map(i => ({ name: i.name, stock: i.stock })))}
    Respondé solo un array JSON de strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return ["¡Seguí así!", "Revisá el stock.", "Anotá todo."];
  }
};

export const getSalesStrategies = async (inventory: Product[], sales: any[]): Promise<Strategy[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Sos un estratega de ventas para almacenes de barrio en Uruguay. 
    Tu objetivo es ayudar al almacenero a ganar más plata y mover el stock que no se vende.
    
    Datos de inventario: ${JSON.stringify(inventory.map(p => ({ name: p.name, stock: p.stock, price: p.sellingPrice })))}
    
    Identificá productos con mucho stock y sugerí 3 estrategias claras (combos, ofertas, liquidación).
    Usá lenguaje uruguayo ("¡Meté un combo!", "Liquidá esto").
    
    Respondé un array JSON de objetos con: title, description, type (offer|liquidation|bundle), impact (high|medium).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING },
            impact: { type: Type.STRING }
          },
          required: ["title", "description", "type", "impact"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};

export const processImageSale = async (base64Image: string, inventory: Product[]) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: `Extraé ventas basándote en este inventario: ${inventory.map(p => `${p.name} (ID: ${p.id})`).join(', ')}. JSON: [{ "productId": string, "quantity": number }]`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            productId: { type: Type.STRING },
            quantity: { type: Type.NUMBER }
          },
          required: ["productId", "quantity"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [];
  }
};
