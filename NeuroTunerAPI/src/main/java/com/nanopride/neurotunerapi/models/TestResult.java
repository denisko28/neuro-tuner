package com.nanopride.neurotunerapi.models;

public class TestResult {
    private final double[] desired;
    private final double[] signals;
    private final double[] predicted;
    private final double maxError;
    private final double maxRelError;

    public TestResult(double[] desired, double[] signals, double[] predicted, double maxError, double maxRelError) {
        this.desired = desired;
        this.signals = signals;
        this.predicted = predicted;
        this.maxError = maxError;
        this.maxRelError = maxRelError;
    }

    public double[] getDesired() {
        return desired;
    }

    public double[] getSignals() {
        return signals;
    }

    public double[] getPredicted() {
        return predicted;
    }

    public double getMaxError() {
        return maxError;
    }

    public double getMaxRelError() {
        return maxRelError;
    }
}
