import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { DashCircle, XOctagon } from "react-bootstrap-icons";

class NumberPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.value };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  render() {
    var props = this.props;
    return (
      <>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon3">{props.text}</InputGroup.Text>
          <input
            type="number"
            step={props.step ? props.step : 1}
            min={props.min ? props.min : "1"}
            max={props.max ? props.max : "20"}
            value={this.state.value}
            onChange={(newValue) => props.onChange(newValue.target.value)}
            className="form-control"
          ></input>
          {props.onRemove ? (
            <Button variant="danger" onClick={() => props.onRemove()}>
              <DashCircle />
            </Button>
          ) : null}
        </InputGroup>
      </>
    );
  }
}

export default NumberPicker;
