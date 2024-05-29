// const tf = require('@tensorflow/tfjs-node');
// const path = require('path');

// // Load the TensorFlow model
// const loadModel = async () => {
//     const modelPath = path.resolve(__dirname, '../models/model/model_per_class.h5');
//     const model = await tf.loadLayersModel(`file://${modelPath}`);
//     return model;
// };

// // Apply the model to the image
// const applyModel = async (model, imageBuffer) => {
//     const imageTensor = tf.node.decodeImage(imageBuffer, 3).toFloat().expandDims();
//     const prediction = model.predict(imageTensor);
//     return prediction;
// };

// module.exports = { loadModel, applyModel };
// tensorflow.dll
