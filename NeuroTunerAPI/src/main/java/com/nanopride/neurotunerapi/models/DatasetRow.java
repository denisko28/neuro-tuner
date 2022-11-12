package com.nanopride.neurotunerapi.models;

public class DatasetRow {
    private final double[] desired;
    private final double[] signals;

    public DatasetRow(double[] desired, double[] symptoms) {
        this.desired = desired;
        this.signals = symptoms;
    }

    public double[] getDesired() {
        return desired;
    }

    public double[] getSignals() {
        return signals;
    }
}
