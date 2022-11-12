import './App.css';
import { useRef, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import SettingsTab from './components/SettingsTab';
import TrainTab from './components/TrainTab';
import axios from 'axios';
import TestTab from './components/TestTab';

function App() {
  const [inputNum, setInputNum] = useState(1);
  const [outputNum, setOutputNum] = useState(1);
  const [layers, setLayers] = useState([]);
  const [rows, setRows] = useState([]);
  const currentKey = useRef("settings");

  const sendSetLayersRequest = (request) => {
    console.log(JSON.stringify(request));
    axios.post(`http://localhost:8000/api/v1/setNeuralLayers`, request)
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }

  const handleTabSelect = (newKey) => {
    console.log(currentKey.current);
    if(currentKey.current === "settings" && newKey != currentKey.current) {
      var layersNumb = layers.map((layer) => Number(layer));
      sendSetLayersRequest(layersNumb);
    }
    currentKey.current = newKey;
  }

  return (
    <div className="tabsParent">
      <Tabs
        defaultActiveKey="settings"
        id="uncontrolled-tab-example"
        onSelect={handleTabSelect}
        className="mb-3"
      >
        <Tab eventKey="settings" title="Проектування мережі">
          <SettingsTab setInputNum={setInputNum} setOutputNum={setOutputNum} setLayers={setLayers} />
        </Tab>
        <Tab eventKey="training" title="Навчання">
          <TrainTab inputNum={inputNum} outputNum={outputNum} onRowsChange={setRows}/>
        </Tab>
        <Tab eventKey="testing" title="Перевірка">
          <TestTab inputNum={inputNum} outputNum={outputNum} rows={rows} onRowsChange={setRows}/>
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
