import React from "react";
import { Button, Table } from "react-bootstrap";
import NumberPicker from "./NumberPicker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import CustomTable from "./CustTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

class TrainTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputNum: this.props.inputNum,
      outputNum: this.props.outputNum,
      showChart: false,
      rows: [],
      columns: [],
      chartData: null,
      trainingSpeed: 0.005,
      epochsNum: 300,
    };

    this.handleRowsChange = this.handleRowsChange.bind(this);
  }

  options = {
    responsive: true,
    elements: {
      point: {
        radius: 0,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Результат навчання",
      },
    },
  };

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
  }

  handleRowsChange(rows) {
    this.setState({ rows: rows});
    console.log(rows);
    this.props.onRowsChange(rows);
  }

  handleSpeedChange(newValue) {
    this.setState({
      trainingSpeed: newValue,
    });
  }

  handleEpochsChange(newValue) {
    this.setState({
      epochsNum: newValue,
    });
  }

  showChartWithData(response) {
    var labels = Array.from(
      { length: response.length },
      (_, index) => index + 1
    );
    var datasets = [
      {
        label: "Розмір помилки",
        data: response.map((resp) => resp.errorSize),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ];
    var data = { datasets: datasets, labels: labels };
    this.setState({
      chartData: data,
      showChart: true,
    });
  }

  sendTrainRequest(request) {
    axios
      .post(`http://localhost:8000/api/v1/trainNetwork`, request)
      .then((res) => {
        this.showChartWithData(res.data);
      });
  }

  handleTrainClick = () => {
    var dataset = [];
    this.state.rows.forEach((row) => {
      var signals = [];
      for (var i = 0; i < this.props.inputNum; i++) {
        signals.push(row["x" + (i + 1)]);
      }
      var desired = [];
      for (var i = 0; i < this.props.outputNum; i++) {
        desired.push(row["d" + (i + 1)]);
      }
      dataset.push({ signals: signals, desired: desired });
    });
    var request = {
      dataset: dataset,
      trainingSpeed: this.state.trainingSpeed,
      epochsNum: this.state.epochsNum,
    };
    this.sendTrainRequest(request);
  };

  render() {
    var showChart = this.state.showChart;

    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <CustomTable
          style={{ display: showChart ? "none" : "grid" }}
          onRowsChange={this.handleRowsChange}
          rows={this.state.rows}
          columns={this.state.columns}
          inputNum={this.props.inputNum}
          outputNum={this.props.outputNum}
        />
        {showChart ? (
          <div className="w-100 d-grid">
            <Line
              options={this.options}
              data={this.state.chartData ? this.state.chartData : null}
            />
            <br />
            <Button
              variant="danger"
              onClick={() => this.setState({ showChart: false })}
            >
              Приховати графік
            </Button>
          </div>
        ) : null}
        <div className="border p-3" style={{ width: "35%", marginLeft: "1em" }}>
          <h5 className="mb-3">Пераметри:</h5>
          <NumberPicker
            text="Швидкість навчання:"
            value={this.state.trainingSpeed}
            step="0.001"
            min="0"
            onChange={(newValue) => {
              this.handleSpeedChange(newValue);
            }}
          />
          <NumberPicker
            text="Кількість епох:"
            value={this.state.epochsNum}
            step="10"
            min="0"
            max="5000"
            onChange={(newValue) => {
              this.handleEpochsChange(newValue);
            }}
          />
          <Button
            variant="primary"
            className="w-100"
            onClick={this.handleTrainClick}
          >
            Навчити
          </Button>
        </div>
      </div>
    );
  }
}

export default TrainTab;
