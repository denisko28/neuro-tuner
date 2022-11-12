package com.nanopride.neurotunerapi.models;

public class EpochErrorSize {
    int epochNum;
    double errorSize;

    public EpochErrorSize(int epochNum, double errorSize) {
        this.epochNum = epochNum;
        this.errorSize = errorSize;
    }

    public int getEpochNum() {
        return epochNum;
    }

    public void setEpochNum(int epochNum) {
        this.epochNum = epochNum;
    }

    public double getErrorSize() {
        return errorSize;
    }

    public void setErrorSize(double errorSize) {
        this.errorSize = errorSize;
    }
}
