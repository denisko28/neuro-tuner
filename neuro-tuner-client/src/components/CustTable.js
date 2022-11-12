import React from "react";
import { Button, Table } from "react-bootstrap";
import { DashCircleFill, PlusCircleFill } from "react-bootstrap-icons";
import Editable from "./Editable";

class CustomTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputNum: this.props.inputNum,
      outputNum: this.props.outputNum,
      rows: this.props.rows,
      columns: this.props.columns,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.columns !== this.props.columns) {
      this.setState({ columns: this.props.columns });
      this.syncRowsWithColumns(this.state.rows);
    }
    if (prevProps.rows !== this.props.rows) {
      //this.setState({ rows: this.props.rows });
      console.log(this.state.columns);
    console.log(this.props.rows);
      this.syncRowsWithColumns(this.props.rows);
    }
  }

  syncRowsWithColumns(rows) {
    var tempRows = rows;
    tempRows.map((row) =>
      Object.keys(row).map((keyVal) => {
        if (!this.state.columns.includes(keyVal)) delete row[keyVal];
      })
    );
    this.setState({
      rows: tempRows,
    });
  }

  setRows(newRows) {
    this.setState({
      rows: newRows,
    });
    if(this.props.onRowsChange)
      this.props.onRowsChange(newRows);
  }

  handleDeleteRow(index) {
    var rowsTemp = [...this.state.rows];
    rowsTemp.splice(index, 1);
    this.setRows(rowsTemp);
  }

  handleAddRow = () => {
    var rowsTemp = this.state.rows;
    rowsTemp = [...rowsTemp, {}];
    this.setRows(rowsTemp);
  };

  handelCellChange(rowIndex, keyVal, newValue) {
    var rowsTemp = [...this.state.rows];
    rowsTemp[rowIndex][keyVal] = newValue;
    this.setRows(rowsTemp);
  }

  render() {
    var { rows, columns } = this.state;

    if (!rows || !columns) return <></>;

    return (
      <div className="w-100" style={this.props.style}>
        <Table striped bordered hover style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              {columns.map((value, index) => (
                <th key={"c" + index}>{value}</th>
              ))}
              <th style={{ width: 50 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIndex) => (
              <tr key={"r" + rIndex}>
                {columns.map((keyVal, cIndex) => {
                  var text = row[keyVal];
                  if (!text) text = " ";
                  return (
                    <td key={"c" + cIndex}>
                      <Editable text={text}>
                        <input
                          style={{
                            width: "100%",
                            height: 30,
                          }}
                          autoFocus
                          type={"number"}
                          value={text}
                          onChange={(e) =>
                            this.handelCellChange(
                              rIndex,
                              keyVal,
                              e.target.value
                            )
                          }
                        />
                      </Editable>
                    </td>
                  );
                })}
                <td
                  style={{ textAlign: "center" }}
                  onClick={() => this.handleDeleteRow(rIndex)}
                >
                  <DashCircleFill color="#dc3a3a" size={20} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="light" onClick={() => this.handleAddRow()}>
          <PlusCircleFill color="#0d6efd" size={24} />
        </Button>
      </div>
    );
  }
}

export default CustomTable;
