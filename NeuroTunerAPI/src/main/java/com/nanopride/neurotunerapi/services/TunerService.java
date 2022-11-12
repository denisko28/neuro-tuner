package com.nanopride.neurotunerapi.services;

import com.nanopride.neurotunerapi.models.DatasetRow;
import com.nanopride.neurotunerapi.models.EpochErrorSize;
import com.nanopride.neurotunerapi.models.TestResult;
import com.nanopride.neurotunerapi.models.TrainParams;
import com.nanopride.neurotunerapi.neuralnetwork.NeuralNetwork;
import org.springframework.stereotype.Service;

@Service
public class TunerService {
    private final NeuralNetwork neuronNetwork;

    public TunerService() {
        this.neuronNetwork = new NeuralNetwork();
    }

    public void setNeuralLayers(int[] layersData) {
        neuronNetwork.setLayers(layersData);
    }

    public void setTestDataset(DatasetRow[] dataset) {
        neuronNetwork.setTestDataset(dataset);
    }

    public EpochErrorSize[] trainNetwork(TrainParams trainParams) {
        neuronNetwork.setTrainParams(trainParams);
        return neuronNetwork.train();
    }

    public TestResult[] testNetwork() {
        return neuronNetwork.test();
    }
}