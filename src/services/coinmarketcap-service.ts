import axios from 'axios';
import { COINMARKETCAP_API_KEY, API_URLS, CACHE_DURATION, FALLBACK_PRICES } from '@/config/api-keys';

// Interface para os dados de preço
export interface CryptoPrice {
  symbol: string;
  price: number;
  percentChange24h: number;
  lastUpdated: string;
}

// Cache para armazenar os preços e reduzir chamadas à API
let priceCache: { [key: string]: CryptoPrice } = {};
let lastCacheUpdate: number = 0;

/**
 * Busca os preços atuais das criptomoedas da API do CoinMarketCap
 * @param symbols Array de símbolos das criptomoedas (ex: ['BTC', 'ETH'])
 * @returns Um objeto com os preços das criptomoedas
 */
export async function getCryptoPrices(symbols: string[]): Promise<{ [key: string]: CryptoPrice }> {
  const currentTime = Date.now();

  // Verifica se o cache está válido e contém todos os símbolos solicitados
  const cacheIsValid = currentTime - lastCacheUpdate < CACHE_DURATION;
  const allSymbolsInCache = symbols.every(symbol => symbol in priceCache);

  if (cacheIsValid && allSymbolsInCache) {
    console.log('Usando preços em cache');
    return symbols.reduce((result, symbol) => {
      result[symbol] = priceCache[symbol];
      return result;
    }, {} as { [key: string]: CryptoPrice });
  }

  try {
    // Tenta fazer a chamada à API do CoinMarketCap
    try {
      // Faz a chamada à API do CoinMarketCap
      const response = await axios.get(API_URLS.coinmarketcap, {
        headers: {
          'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY
        },
        params: {
          symbol: symbols.join(',')
        },
        timeout: 5000 // Timeout de 5 segundos
      });

      // Processa os dados da resposta
      const result: { [key: string]: CryptoPrice } = {};

      if (response.data && response.data.data) {
        for (const symbol of symbols) {
          if (response.data.data[symbol]) {
            const cryptoData = response.data.data[symbol];
            const priceData: CryptoPrice = {
              symbol,
              price: cryptoData.quote.USD.price,
              percentChange24h: cryptoData.quote.USD.percent_change_24h,
              lastUpdated: cryptoData.quote.USD.last_updated
            };

            result[symbol] = priceData;
            priceCache[symbol] = priceData; // Atualiza o cache
          }
        }

        lastCacheUpdate = currentTime;
        return result;
      }
    } catch (apiError) {
      console.error('Erro na chamada à API do CoinMarketCap:', apiError);
      // Continua para o fallback
    }

    // Se chegou aqui, a API falhou ou retornou dados inválidos

    // Em caso de erro, retorna os dados do cache se disponíveis
    if (allSymbolsInCache) {
      console.log('Usando cache após falha na API');
      return symbols.reduce((result, symbol) => {
        result[symbol] = priceCache[symbol];
        return result;
      }, {} as { [key: string]: CryptoPrice });
    }

    // Se não houver dados em cache, gera preços simulados como fallback
    console.log('Gerando preços de fallback');
    return generateFallbackPrices(symbols);
  } catch (error) {
    console.error('Erro ao buscar preços:', error);

    // Garantir que sempre retornamos algo, mesmo em caso de erro catastrófico
    return generateFallbackPrices(symbols);
  }
}

/**
 * Gera preços simulados como fallback em caso de falha na API
 * @param symbols Array de símbolos das criptomoedas
 * @returns Um objeto com preços simulados
 */
function generateFallbackPrices(symbols: string[]): { [key: string]: CryptoPrice } {
  const result: { [key: string]: CryptoPrice } = {};

  for (const symbol of symbols) {
    const basePrice = FALLBACK_PRICES[symbol] || 100; // Preço padrão se o símbolo não estiver na lista
    const randomVariation = (Math.random() * 0.05) - 0.025; // Variação aleatória de ±2.5%

    result[symbol] = {
      symbol,
      price: basePrice * (1 + randomVariation),
      percentChange24h: (Math.random() * 10) - 5, // Variação de 24h entre -5% e +5%
      lastUpdated: new Date().toISOString()
    };
  }

  return result;
}

/**
 * Busca o preço atual de uma única criptomoeda
 * @param symbol Símbolo da criptomoeda (ex: 'BTC')
 * @returns O preço da criptomoeda ou null em caso de erro
 */
export async function getCryptoPrice(symbol: string): Promise<CryptoPrice | null> {
  try {
    const prices = await getCryptoPrices([symbol]);
    return prices[symbol] || null;
  } catch (error) {
    console.error(`Erro ao buscar preço de ${symbol}:`, error);

    // Gerar um preço de fallback para este símbolo
    const fallbackPrices = generateFallbackPrices([symbol]);
    return fallbackPrices[symbol] || null;
  }
}

/**
 * Formata um preço para exibição
 * @param price Preço a ser formatado
 * @param decimals Número de casas decimais
 * @returns Preço formatado como string
 */
export function formatPrice(price: number, decimals: number = 2): string {
  if (typeof price !== 'number' || isNaN(price)) {
    console.warn('Preço inválido para formatação:', price);
    return '0.00';
  }

  try {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  } catch (error) {
    console.error('Erro ao formatar preço:', error);
    return price.toFixed(decimals);
  }
}
