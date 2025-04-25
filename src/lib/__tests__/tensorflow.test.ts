import * as tf from '@tensorflow/tfjs';
import {
  createModel,
  preprocessData,
  makePrediction,
  trainModel,
} from '../tensorflow';

// Mock do console
const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
};

// Substituir console global
Object.defineProperty(window, 'console', { value: mockConsole });

describe('TensorFlow System', () => {
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    tf.disposeVariables();
  });

  // Testar criação do modelo
  test('should create a model', () => {
    const model = createModel();
    
    expect(model).toBeDefined();
    expect(model.layers.length).toBeGreaterThan(0);
    expect(model.optimizer).toBeDefined();
    expect(model.loss).toBeDefined();
  });

  // Testar pré-processamento de dados
  test('should preprocess data', () => {
    const inputData = tf.tensor2d([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    
    const processed = preprocessData(inputData);
    
    expect(processed).toBeDefined();
    expect(processed.shape).toEqual(inputData.shape);
    
    // Verificar se os dados foram normalizados
    const stats = tf.moments(processed);
    expect(stats.mean.dataSync()[0]).toBeCloseTo(0, 1);
    expect(stats.variance.dataSync()[0]).toBeCloseTo(1, 1);
    
    // Limpar tensores
    inputData.dispose();
    processed.dispose();
    stats.mean.dispose();
    stats.variance.dispose();
  });

  // Testar previsão
  test('should make prediction', async () => {
    const model = createModel();
    const inputData = tf.tensor2d([[1, 2, 3]]);
    
    const prediction = await makePrediction(model, inputData);
    
    expect(prediction).toBeDefined();
    expect(prediction.shape[0]).toBe(1);
    
    // Limpar tensores
    inputData.dispose();
    prediction.dispose();
    model.dispose();
  });

  // Testar treinamento do modelo
  test('should train model', async () => {
    const model = createModel();
    const trainData = tf.tensor2d([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    const trainLabels = tf.tensor2d([
      [1],
      [0],
    ]);
    
    const history = await trainModel(model, trainData, trainLabels);
    
    expect(history).toBeDefined();
    expect(history.loss).toBeDefined();
    expect(history.epochs).toBeGreaterThan(0);
    
    // Limpar tensores
    trainData.dispose();
    trainLabels.dispose();
    model.dispose();
  });

  // Testar tratamento de erros
  test('should handle errors gracefully', async () => {
    const model = createModel();
    const invalidData = tf.tensor2d([]);
    
    await expect(makePrediction(model, invalidData)).rejects.toThrow();
    
    // Limpar tensores
    invalidData.dispose();
    model.dispose();
  });

  // Testar limpeza de memória
  test('should clean up memory', async () => {
    const initialMemory = tf.memory();
    
    const model = createModel();
    const data = tf.tensor2d([[1, 2, 3]]);
    const prediction = await makePrediction(model, data);
    
    // Limpar tensores
    data.dispose();
    prediction.dispose();
    model.dispose();
    
    const finalMemory = tf.memory();
    expect(finalMemory.numBytes).toBeLessThanOrEqual(initialMemory.numBytes);
  });
}); 