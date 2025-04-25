import * as tf from "@tensorflow/tfjs";

// Configurações do modelo
const MODEL_CONFIG = {
  inputShape: [3],
  hiddenUnits: 64,
  dropoutRate: 0.2,
  learningRate: 0.001,
  epochs: 100,
  batchSize: 32,
};

// Criar modelo sequencial
export function createModel(): tf.Sequential {
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    units: MODEL_CONFIG.hiddenUnits,
    activation: 'relu',
    inputShape: MODEL_CONFIG.inputShape,
  }));
  
  model.add(tf.layers.dropout({ rate: MODEL_CONFIG.dropoutRate }));
  
  model.add(tf.layers.dense({
    units: MODEL_CONFIG.hiddenUnits,
    activation: 'relu',
  }));
  
  model.add(tf.layers.dense({ units: 1 }));
  
  model.compile({
    optimizer: tf.train.adam(MODEL_CONFIG.learningRate),
    loss: 'meanSquaredError',
  });
  
  return model;
}

// Pré-processar dados
export function preprocessData(tensor: tf.Tensor2D): tf.Tensor2D {
  const { mean, variance } = tf.moments(tensor);
  const std = tf.sqrt(tf.add(variance, tf.scalar(1e-7)));
  return tf.div(tf.sub(tensor, mean), std);
}

// Fazer previsão
export async function makePrediction(
  model: tf.Sequential,
  input: tf.Tensor2D
): Promise<tf.Tensor2D> {
  const processedInput = preprocessData(input);
  const prediction = model.predict(processedInput) as tf.Tensor2D;
  processedInput.dispose();
  return prediction;
}

// Treinar modelo
export async function trainModel(
  model: tf.Sequential,
  trainData: tf.Tensor2D,
  trainLabels: tf.Tensor2D
): Promise<{ loss: number; epochs: number }> {
  const processedData = preprocessData(trainData);
  
  const history = await model.fit(processedData, trainLabels, {
    epochs: MODEL_CONFIG.epochs,
    batchSize: MODEL_CONFIG.batchSize,
    callbacks: {
      onEpochEnd: (epoch: number, logs?: tf.Logs) => {
        if (logs) {
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
        }
      },
    },
  });
  
  processedData.dispose();
  trainData.dispose();
  trainLabels.dispose();
  
  const finalLoss = history.history.loss[history.history.loss.length - 1];
  return {
    loss: typeof finalLoss === 'number' ? finalLoss : Number(finalLoss),
    epochs: MODEL_CONFIG.epochs,
  };
} 