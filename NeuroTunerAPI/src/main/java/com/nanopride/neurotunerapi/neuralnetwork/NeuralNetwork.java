package com.nanopride.neurotunerapi.neuralnetwork;

import com.nanopride.neurotunerapi.models.DatasetRow;
import com.nanopride.neurotunerapi.models.EpochErrorSize;
import com.nanopride.neurotunerapi.models.TestResult;
import com.nanopride.neurotunerapi.models.TrainParams;

import java.util.Arrays;
import java.util.Random;
import java.util.stream.Stream;

public class NeuralNetwork {
    private Neuron[][] neuralLayers;
    private int[] layers;
    private TrainParams trainParams;

    private DatasetRow[] testDataset;

    public NeuralNetwork() {
    }

    public void setLayers(int[] layers) {
        this.layers = layers;
    }

    public void setTrainParams(TrainParams trainParams) {
        this.trainParams = trainParams;
    }

    public void setTestDataset(DatasetRow[] testDataset) {
        this.testDataset = testDataset;
    }

    public void buildNeuralLayers() {
        neuralLayers = new Neuron[layers.length][0];
        for (int i = 0; i < layers.length; i++) {
            neuralLayers[i] = new Neuron[layers[i]];
            for (int j = 0; j < layers[i]; j++) {
                Neuron neuron = new Neuron();
                int inputsNum = i > 0 ? layers[i-1] : layers[i];
                float[] initialWeights = genInitialWeights(inputsNum + 1);
                neuron.setWeights(initialWeights);
                neuron.setInputSignals(new double[inputsNum + 1]);
                neuron.setInputSignalWithIndex(0, 1.0);
                neuralLayers[i][j] = neuron;
            }
        }
    }

    public EpochErrorSize[] train() {
        buildNeuralLayers();
        testDataset = trainParams.getDataset();
        int datasetLength = trainParams.getDataset().length;
        int epochsNum = trainParams.getEpochsNum();
        EpochErrorSize[] epochsErrorSizes = new EpochErrorSize[epochsNum];

        for (int epoch = 0; epoch < epochsNum; epoch++) {
            double maxErrorSize = 0;
            for (int j = 0; j < datasetLength; j++) {
                double errorSize = trainForDatasetRow(j, datasetLength);
                if(errorSize > maxErrorSize)
                    maxErrorSize = errorSize;
            }
            epochsErrorSizes[epoch] = new EpochErrorSize(epoch, maxErrorSize);
        }
        return epochsErrorSizes;
    }

    private double trainForDatasetRow(int datasetRowIndex, int datasetLength) {
        DatasetRow datasetRow = trainParams.getDataset()[datasetRowIndex];
        double[] inputSignals = datasetRow.getSignals();
        double[] desiredSignals = datasetRow.getDesired();

        double totalError = forwardPropagation(desiredSignals, inputSignals, new Double[datasetLength]);
        backPropagation(desiredSignals);
        
        return totalError;
    }

    private double forwardPropagation(double[] currentlyDesired, double[] inputSignalsParam, Double[] finalPredictions) {
        double[] inputSignals = inputSignalsParam.clone();
        inputSignals = addElementToBegin(1.0, inputSignals);

        double currentError = 0;
        for (int l = 0; l < layers.length; l++) {
            Neuron[] currentLayer = neuralLayers[l];
            for(int n = 0; n < currentLayer.length; n++) {
                Neuron currentNeuron = currentLayer[n];
                if(l == 0) {
                    currentNeuron.setInputSignals(inputSignals);
                }
                double prediction = currentNeuron.calculateResult();
                if (l == layers.length - 1) {
                    finalPredictions[n] = prediction;
                    currentError += Math.pow(currentlyDesired[n] - prediction, 2) / 2;
                    continue;
                }
                Neuron[] nextLayer = neuralLayers[l+1];
                for (Neuron neuron : nextLayer) {
                    neuron.setInputSignalWithIndex(n + 1, prediction);
                }
            }
        }
        return currentError;
    }

    private void backPropagation(double[] currentlyDesired) {
        int datasetLength = trainParams.getDataset().length;
        float trainingSpeed = trainParams.getTrainingSpeed();
        double[] previousDeltas = new double[datasetLength];

        for (int l = layers.length - 1; l >= 0; l--) {
            Neuron[] currentLayer = neuralLayers[l];
            double[] tempPrevDelta = new double[currentLayer.length];
            for (int n = 0; n < currentLayer.length; n++) {
                Neuron currentNeuron = currentLayer[n];
                double prediction = currentNeuron.calculateResult();
                double delta;
                if(l == layers.length - 1) {
                    delta = (currentlyDesired[n] - prediction);
                } else {
                    double errorsSum = 0;
                    Neuron[] previousLayer = neuralLayers[l+1];
                    for(int i = 0; i<previousLayer.length; i++) {
                        Neuron previousNeuron = previousLayer[i];
                        errorsSum = errorsSum + (previousDeltas[i] * previousNeuron.getWeights()[n + 1]);
                    }
                    delta = errorsSum;
                }
                tempPrevDelta[n] = delta;
                var currentWeights = currentNeuron.getWeights();
                var inputSignals = currentNeuron.getInputSignals();
                for(int i = 0; i<currentWeights.length; i++) {
                    double deltaWeight = trainingSpeed * delta * inputSignals[i];
                    currentWeights[i] = currentWeights[i] + (float) deltaWeight;
                }
                //currentNeuron.setWeights(currentWeights);
            }
            previousDeltas = tempPrevDelta;
        }
    }

    private double[] addElementToBegin(double newElem, double[] array) {
        double[] newArray = new double[array.length + 1];
        newArray[0] = newElem;
        System.arraycopy(array, 0, newArray, 1, newArray.length - 1);
        return newArray;
    }

    private float[] genInitialWeights(int length) {
        var newVector = new float[length];
        float min = -0.5f, max = 0.5f;
        Random r = new Random();
        for (int i = 0; i < newVector.length; i++) {
            newVector[i] = min + r.nextFloat() * (max - min);
        }
        //Arrays.fill(newVector, 0);
        return newVector;
    }

    public TestResult[] test() {
        DatasetRow[] dataset = testDataset;
        int datasetLength = dataset.length;
        TestResult[] results = new TestResult[datasetLength];

        for (int j = 0; j < datasetLength; j++) {
            DatasetRow datasetRow = dataset[j];
            double[] testSignals = datasetRow.getSignals();
            int outNeuronsNum = layers[layers.length - 1];

            Double[] predictions = new Double[outNeuronsNum];
            var desired = new double[outNeuronsNum];
            Arrays.fill(desired, 0.0d);

            forwardPropagation(desired, testSignals, predictions);
            double[] predictionsPrimitive = Stream.of(predictions).mapToDouble(Double::doubleValue).toArray();
            results[j] = new TestResult(datasetRow.getDesired(), testSignals, predictionsPrimitive, 0, 0);
        }
        return results;
    }
}
