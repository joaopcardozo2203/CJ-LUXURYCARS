// JS/car-api.js
// API pública oficial da NHTSA (gratuita e sem necessidade de API Key)
const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

/**
 * Consulta especificações e validação de modelo em tempo real na API.
 * @param {string} make Marca do veículo (ex: Porsche, BMW, Mercedes-Benz)
 * @param {string} model Nome do modelo (ex: 911, RS5, Huracan)
 */
async function buscarDadosCarroAPI(make, model) {
  try {
    const endpoint = `${NHTSA_BASE_URL}/GetModelsForMake/${encodeURIComponent(
      make
    )}?format=json`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Erro na API HTTP: ${response.status}`);
    }

    const data = await response.json();
    const modelos = data.Results || [];

    // Filtra o modelo correspondente retornado pela API
    const modeloEncontrado = modelos.find((item) =>
      item.Model_Name.toLowerCase().includes(model.toLowerCase())
    );

    return {
      sucesso: true,
      marca: make,
      modeloOficial: modeloEncontrado ? modeloEncontrado.Model_Name : model,
      makeId: modeloEncontrado ? modeloEncontrado.Make_ID : "N/A",
      modelId: modeloEncontrado ? modeloEncontrado.Model_ID : "N/A",
    };
  } catch (error) {
    console.warn(
      "Erro ao consultar a API de veículos (usando fallback local):",
      error
    );
    return { sucesso: false, erro: error.message };
  }
}
