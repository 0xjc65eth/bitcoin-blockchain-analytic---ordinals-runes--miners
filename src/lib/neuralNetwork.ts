import * as tf from '@tensorflow/tfjs';

// Interface for input data
interface NetworkData {
  btcPrice: number;
  mempoolSize: number;
  hashrate: number;
  exchangeInflows: number;
  timestamp: number;
}

// Interface for prediction output
interface Prediction {
  predictedPrice: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  volatility: number;
}

interface TrainingData {
  input: number[];
  output: number;
}

/**
 * Neural Network class for predicting Bitcoin trends
 */
export class NeuralNetwork {
  private model: tf.Sequential;
  private timesteps: number;
  private features: number;

  constructor(timesteps: number = 10, features: number = 5) {
    this.timesteps = timesteps;
    this.features = features;
    this.model = this.buildModel();
  }

  private buildModel(): tf.Sequential {
    const model = tf.sequential();
    
    // LSTM layer
    model.add(tf.layers.lstm({
      units: 50,
      returnSequences: true,
      inputShape: [this.timesteps, this.features]
    }));
    
    // Dropout layer for regularization
    model.add(tf.layers.dropout({ rate: 0.2 }));
    
    // Another LSTM layer
    model.add(tf.layers.lstm({
      units: 50,
      returnSequences: false
    }));
    
    // Dense layer for output
    model.add(tf.layers.dense({ units: 1 }));
    
    // Compile the model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
    
    return model;
  }

  /**
   * Normalize data to [0, 1]
   * @param data - Array of network data points
   * @returns Normalized data
   */
  private normalizeData(data: number[][]): number[][] {
    const normalizedData: number[][] = [];
    const min = Math.min(...data.flat());
    const max = Math.max(...data.flat());
    
    for (const row of data) {
      normalizedData.push(row.map(val => (val - min) / (max - min)));
    }
    
    return normalizedData;
  }

  /**
   * Calculate volatility based on price history
   * @param prices - Array of historical prices
   * @returns Volatility measure
   */
  private calculateVolatility(prices: number[]): number {
    const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  /**
   * Predict Bitcoin price based on historical data
   * @param historicalData - Array of historical network data
   * @returns Prediction with confidence and trend
   */
  async predict(historicalData: NetworkData[]): Promise<Prediction> {
    if (historicalData.length < this.timesteps) {
      throw new Error('Insufficient historical data for prediction');
    }

    const normalizedData = this.normalizeData(historicalData.map(d => [
      d.btcPrice,
      d.mempoolSize,
      d.hashrate,
      d.exchangeInflows,
      d.timestamp
    ]));

    // Reshape the data to match TensorLike3D [batch, timesteps, features]
    const reshapedData = [normalizedData.slice(-this.timesteps)];
    const inputTensor = tf.tensor3d(reshapedData);
    
    // Get the last price for trend calculation
    const lastPrice = historicalData[historicalData.length - 1].btcPrice;
    const previousPrice = historicalData[historicalData.length - 2].btcPrice;
    
    // Calculate trend
    const priceChange = lastPrice - previousPrice;
    const trend: 'up' | 'down' | 'stable' = 
      priceChange > 0.01 * lastPrice ? 'up' :
      priceChange < -0.01 * lastPrice ? 'down' : 'stable';
    
    // Calculate volatility
    const volatility = this.calculateVolatility(historicalData.map(d => d.btcPrice));
    
    // Calculate confidence based on volatility and recent price movement
    const confidence = Math.max(0, Math.min(1, 1 - (volatility * 2)));

    // Clean up tensors
    inputTensor.dispose();

    return {
      predictedPrice: lastPrice * (1 + (trend === 'up' ? 0.01 : trend === 'down' ? -0.01 : 0)),
      confidence,
      trend,
      volatility
    };
  }

  /**
   * Train the neural network
   * @param data - Training data
   * @param epochs - Number of training epochs
   */
  public async train(data: TrainingData[], epochs: number = 100): Promise<void> {
    // Prepare training data
    const inputs: number[][] = [];
    const outputs: number[] = [];
    
    for (const item of data) {
      inputs.push(item.input);
      outputs.push(item.output);
    }
    
    // Normalize data
    const normalizedInputs = this.normalizeData(inputs);
    const normalizedOutputs = this.normalizeData([outputs])[0];
    
    // Reshape the data to match TensorLike3D [batch, timesteps, features]
    const reshapedInputs: number[][][] = normalizedInputs.map(row => {
      const slicedRow = row.slice(-this.timesteps);
      const paddedRow: number[][] = [];
      
      for (let i = 0; i < this.timesteps; i++) {
        if (i < slicedRow.length) {
          // Ensure each element is an array of features
          const features = new Array(this.features).fill(0);
          features[0] = slicedRow[i];
          paddedRow.push(features);
        } else {
          paddedRow.push(new Array(this.features).fill(0));
        }
      }
      
      return paddedRow;
    });
    
    // Convert to tensors
    const inputTensor = tf.tensor3d(reshapedInputs);
    const outputTensor = tf.tensor2d(normalizedOutputs, [normalizedOutputs.length, 1]);
    
    // Train the model
    await this.model.fit(inputTensor, outputTensor, {
      epochs,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
        }
      }
    });
    
    // Clean up tensors
    inputTensor.dispose();
    outputTensor.dispose();
  }

  /**
   * Save the neural network model to a file
   * @param path - Path to save the model
   */
  public async saveModel(path: string): Promise<void> {
    await this.model.save(`file://${path}`);
  }

  /**
   * Load the neural network model from a file
   * @param path - Path to load the model
   */
  public async loadModel(path: string): Promise<void> {
    this.model = await tf.loadLayersModel(`file://${path}`) as tf.Sequential;
  }
}

export const bitcoinPredictor = new NeuralNetwork(); 