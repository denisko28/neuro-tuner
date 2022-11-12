import React from "react";
import { PlusCircleFill } from 'react-bootstrap-icons';
import { Button, Form } from "react-bootstrap";
import NeuronsVisual from "./NeuronsVisual";
import NumberPicker from "./NumberPicker";

class SettingsTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = { layers: [1, 1] };
    }

    setLayers(layersVal) {
        this.setState({
            layers: layersVal
        });
        this.props.setLayers(layersVal);
    }

    addLayer() {
        var tempLayers = this.state.layers;
        tempLayers.splice(tempLayers.length - 1, 0, 1);
        this.setLayers(tempLayers);
    }

    onValueChange(index, newValue) {
        var tempLayers = this.state.layers;
        tempLayers[index] = newValue;
        this.setLayers(tempLayers);
    }

    onPickerRemove(index) {
        var tempLayers = this.state.layers;
        tempLayers.splice(index, 1);
        this.setLayers(tempLayers);
    }

    onInputOutputChange(index, newValue, input) {
        this.onValueChange(index, newValue);
        input ? this.props.setInputNum(newValue) : this.props.setOutputNum(newValue);
    }

    render() {
        var layers = this.state.layers;

        return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <Form.Label htmlFor="basic-url">Вхідний шар</Form.Label>
                    <NumberPicker text="Число нейронів шару 1:" value={layers[0]}
                        onChange={(newValue) => this.onInputOutputChange(0, newValue, true)} />
                    <Form.Label htmlFor="basic-url">Приховані шари</Form.Label>
                    {
                        layers.map((_, index) => {
                            if (index !== 0 && index !== layers.length - 1)
                                return <NumberPicker key={index} text={`Число нейронів шару ${index + 1}:`}
                                    onRemove={() => this.onPickerRemove(index)} value={layers[index]}
                                    onChange={(newValue) => this.onValueChange(index, newValue)} />
                            else return null;
                        })
                    }
                    <Button variant="light" style={{ marginLeft: "40%", marginRight: "40%" }}
                        onClick={() => this.addLayer()}>
                        <PlusCircleFill color="#0d6efd" size={24} />
                    </Button>
                    <br />
                    <Form.Label htmlFor="basic-url">Вихідний шар</Form.Label>
                    <NumberPicker text={`Число нейронів шару ${layers.length}:`} value={layers[layers.length-1]}
                        onChange={(newValue) => this.onInputOutputChange(layers.length - 1, newValue, false)} />
                </div>
                <div>
                    <div>
                        <NeuronsVisual data={layers} dimensions={{
                            width: 800,
                            height: 500
                        }} />
                    </div>
                </div>
            </div>
        )
    }
}

export default SettingsTab;