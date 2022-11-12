package com.nanopride.neurotunerapi.controllers;

import com.nanopride.neurotunerapi.models.DatasetRow;
import com.nanopride.neurotunerapi.models.EpochErrorSize;
import com.nanopride.neurotunerapi.models.TestResult;
import com.nanopride.neurotunerapi.models.TrainParams;
import com.nanopride.neurotunerapi.neuralnetwork.NeuralNetwork;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/")
public class TunerController {

    private final NeuralNetwork neuronNetwork;

    public TunerController() {
        this.neuronNetwork = new NeuralNetwork();
    }

    @PostMapping("/setNeuralLayers")
    public void setNeuralLayers(@RequestBody int[] layersData) {
        neuronNetwork.setLayers(layersData);
    }

    @PostMapping("/setTestDataset")
    public void setTestDataset(@RequestBody DatasetRow[] dataset) {
        neuronNetwork.setTestDataset(dataset);
    }

    @PostMapping("/trainNetwork")
    public ResponseEntity<EpochErrorSize[]> trainNetwork(@RequestBody TrainParams trainParams) {
        neuronNetwork.setTrainParams(trainParams);
        return ResponseEntity.ok(neuronNetwork.train());
    }

    @GetMapping("/testNetwork")
    public ResponseEntity<TestResult[]> testNetwork() {
        return ResponseEntity.ok(neuronNetwork.test());
    }
}
