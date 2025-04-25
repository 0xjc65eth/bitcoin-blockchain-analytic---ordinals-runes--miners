# API Documentation

## Overview
This document provides detailed information about the APIs used in the CYPHER ORDI FUTURE project, including endpoints, response formats, and error handling.

## API Configuration

### Ordiscan API
- **Base URL**: `https://ordiscan.com/api/v1`
- **Endpoints**:
  - `/collections`: Get collections data
  - `/runes`: Get runes data
  - `/address/{address}/inscriptions`: Get inscriptions by address

### Mempool.space API
- **Base URL**: `https://mempool.space/api`
- **Endpoints**:
  - `/v1/mining/hashrate/1d`: Get mining data
  - `/blocks`: Get recent blocks
  - `/v1/fees/recommended`: Get recommended fees
  - `/v1/mempool/recent`: Get recent mempool transactions

### Blockstream API
- **Base URL**: `https://blockstream.info/api`
- **Endpoints**:
  - `/price`: Get Bitcoin price
  - `/address/{address}/txs`: Get transactions by address

### Sentiment Analysis 2 API
- **Base URL**: `https://sentiment-analysis2.p.rapidapi.com/sentiment`
- **Headers**:
  - `X-RapidAPI-Key`
  - `X-RapidAPI-Host`

## Response Formats

### Collections
```typescript
interface CollectionItem {
  id: string;
  name: string;
  floorPrice: number;
  volume: number;
  rareSats?: string;
  content_url?: string;
}
```

### Runes
```typescript
interface RuneItem {
  id: string;
  name: string;
  floorPrice: number;
  volume: number;
}
```

### Transactions
```typescript
interface Transaction {
  txid: string;
  value: number;
  fee: number;
  timestamp: string;
}
```

### Mining Data
```typescript
interface MinerData {
  id: string;
  name: string;
  supply: number;
  holders: number;
  hashrate: number;
  networkPercentage: number;
  lastBlock: number;
  decentralizationIndex?: number;
}
```

## Error Handling

### API Error Structure
```typescript
interface ApiError {
  message: string;
  status?: number;
  code?: string;
  retryAfter?: number;
}
```

### Common Error Codes
- `NETWORK_ERROR`: No response received
- `REQUEST_ERROR`: Error in request setup
- `RATE_LIMIT`: Rate limit exceeded

## Caching

### Cache Configuration
- Default TTL: 5 minutes
- Maximum cache size: 100 items
- Cache keys are prefixed with data type

### Cache Functions
- `getCachedData(key: string): any`
- `setCachedData(key: string, data: any, ttl: number): void`
- `clearCache(): void`
- `hasCachedData(key: string): boolean`

## Best Practices

1. **Rate Limiting**
   - Respect API rate limits
   - Implement exponential backoff for retries
   - Use caching to minimize API calls

2. **Error Handling**
   - Always handle API errors gracefully
   - Provide fallback data when available
   - Log errors for debugging

3. **Data Validation**
   - Validate API responses before use
   - Handle missing or invalid data
   - Sanitize user inputs

4. **Performance**
   - Use caching for frequently accessed data
   - Implement request debouncing
   - Optimize payload size

## Security

1. **API Keys**
   - Store API keys in environment variables
   - Never expose keys in client-side code
   - Rotate keys regularly

2. **Input Sanitization**
   - Sanitize all user inputs
   - Use DOMPurify for HTML content
   - Validate data types

3. **CORS**
   - Configure CORS properly
   - Limit allowed origins
   - Use secure headers

## Testing

### API Testing
- Use mock responses for testing
- Test error scenarios
- Verify rate limiting behavior

### Integration Testing
- Test API integration points
- Verify data transformation
- Check error handling

## Monitoring

### Logging
- Log API requests and responses
- Track error rates
- Monitor performance metrics

### Alerts
- Set up alerts for API failures
- Monitor rate limit usage
- Track response times 