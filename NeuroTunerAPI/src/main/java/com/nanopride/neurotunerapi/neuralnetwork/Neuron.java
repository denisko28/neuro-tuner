package com.nanopride.neurotunerapi.neuralnetwork;

import java.util.Arrays;

public class Neuron {
    private double[] inputSignals;
    private float[] weights;

    public Neuron() { }

    public Neuron(double[] inputSignals, float[] weights) {
        this.inputSignals = inputSignals;
        this.weights = weights;
    }

    public double[] getInputSignals() {
        return inputSignals;
    }

    public void setInputSignals(double[] inputSignals) {
        this.inputSignals = inputSignals;
    }

    public void setInputSignalWithIndex(int index, double signal) {
        this.inputSignals[index] = signal;
    }

    public float[] getWeights() {
        return weights;
    }

    public void setWeights(float[] weights) {
        this.weights = weights;
    }

    public double calculateResult() {
        float sum = 0;
        for (int i = 0; i < inputSignals.length; i++) {
            sum += inputSignals[i] * weights[i];
        }
        if(sum > 0)
            return sum;
        return 0;
    }
}
