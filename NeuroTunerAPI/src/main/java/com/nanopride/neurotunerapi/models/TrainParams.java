package com.nanopride.neurotunerapi.models;

public class TrainParams {
    private DatasetRow[] dataset;
    private float trainingSpeed;
    private int epochsNum;

    public TrainParams(DatasetRow[] dataset, float trainingSpeed, int epochsNum) {
        this.dataset = dataset;
        this.trainingSpeed = trainingSpeed;
        this.epochsNum = epochsNum;
    }

    public DatasetRow[] getDataset() {
        return dataset;
    }

    public void setDataset(DatasetRow[] dataset) {
        this.dataset = dataset;
    }

    public float getTrainingSpeed() {
        return trainingSpeed;
    }

    public void setTrainingSpeed(float trainingSpeed) {
        this.trainingSpeed = trainingSpeed;
    }

    public int getEpochsNum() {
        return epochsNum;
    }

    public void setEpochsNum(int epochsNum) {
        this.epochsNum = epochsNum;
    }
}
