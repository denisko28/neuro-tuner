import React from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import CustomTable from "./CustTable";

class TestTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputNum: this.props.inputNum,
      outputNum: this.props.outputNum,
      rows: this.props.rows,
      columns: [],
      maxErrors: []
    };
  }

  componentDidMount() {
    this.setColumns(this.props.inputNum, this.props.outputNum);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.inputNum !== this.props.inputNum) {
      this.setState({ inputNum: this.props.inputNum });
      this.setColumns(this.props.inputNum, this.props.outputNum);
    }
    if (prevProps.outputNum !== this.props.outputNum) {
      this.setState({ outputNum: this.props.outputNum });
      this.setColumns(this.props.inputNum, this.props.outputNum);
    }
    if (prevProps.rows !== this.props.rows) {
      this.setState({ rows: this.props.rows });
    }
  }

  setColumns(inputNum, outputNum) {
    var columnsTemp = Array.from({ length: inputNum }, (_, index) => {
      return "x" + (index + 1);
    });
    var columnsDesired = Array.from({ length: outputNum }, (_, index) => {
      return "d" + (index + 1);
    });
    columnsTemp = columnsTemp.concat(columnsDesired);
    this.setState({
      columns: columnsTemp,
    });
    return columnsTemp;
  }

  handleSpeedChange(newValue) {
    this.setState({
      trainingSpeed: newValue,
    });
  }

  setMaxErrors(rows) {
    var maxErrors = [];
    for (var i = 0; i < this.props.outputNum; i++) {
      const dKey = "d" + (i + 1);
      const yKey = "y" + (i + 1);
      var maxErrorSize = 0;
      rows.forEach((row) => {
        var errorSize = Math.abs(row[dKey] - row[yKey]);
        if(errorSize > maxErrorSize)
          maxErrorSize = errorSize;
      });
      maxErrors.push({d: dKey, size: maxErrorSize});
    }

    this.setState({
      maxErrors: maxErrors
    });
  }

  setRowsFromResponse(response) {
    var newColumns = this.setColumns(this.props.inputNum, this.props.outputNum);;
    var yColumns = Array.from({ length: response[0].desired.length }, (_, index) => {
      return "y" + (index + 1);
    });
    newColumns = newColumns.concat(yColumns);
    this.setState({
      columns: newColumns
    });

    var newRows = [];
    response.forEach((resp) => {
      var row = [];
      resp.signals.forEach((x, index) => { 
        var keyVal = "x"+(index+1);
        row[keyVal] = x;
      });
      resp.desired.forEach((d, index) => { 
        var keyVal = "d"+(index+1);
        row[keyVal] = d;
      });
      resp.predicted.forEach((y, index) => { 
        var keyVal = "y"+(index+1);
        row[keyVal] = y;
      });
      newRows.push(row);
    });
    this.props.onRowsChange(newRows);
    this.setMaxErrors(newRows);
  }

  sendTestRequest() {
    axios
      .get(`http://localhost:8000/api/v1/testNetwork`)
      .then((res) => {
        this.setRowsFromResponse(res.data);
      });
  }

  sendSetTestDatasetRequest(datasetRequest) {
    axios
      .post(`http://localhost:8000/api/v1/setTestDataset`, datasetRequest)
      .then((res) => {
        this.sendTestRequest();
      });
  }

  handleTestClick = () => {
    var datasetRequest = [];
    this.state.rows.forEach((row) => {
      var signals = [];
      for (var i = 0; i < this.props.inputNum; i++) {
        signals.push(row["x" + (i + 1)]);
      }
      var desired = [];
      for (var i = 0; i < this.props.outputNum; i++) {
        desired.push(row["d" + (i + 1)]);
      }
      datasetRequest.push({ signals: signals, desired: desired });
    });
    this.sendSetTestDatasetRequest(datasetRequest);
  };

  render() {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <CustomTable
          style={{ display: "grid" }}
          onRowsChange={this.props.onRowsChange}
          rows={this.state.rows}
          columns={this.state.columns}
          inputNum={this.props.inputNum}
          outputNum={this.props.outputNum}
        />
        <div className="border p-3" style={{ width: "35%", marginLeft: "1em" }}>
          <Button
            variant="primary"
            className="w-100"
            onClick={this.handleTestClick}
          >
            Протестувати
          </Button>
          <br/><br/>
          <h5 className="mb-2">Помилки:</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Поле</th>
                <th>Макс. помилка</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.maxErrors.map((error, index) => 
                  <tr key={index}>
                      <td>{error.d}</td>
                      <td>{error.size}</td>
                  </tr>
                )
              }
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default TestTab;
