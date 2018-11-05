import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import CanvasSlider from './CanvasSlider';

const App = () => (
  <div className="App">
    <CanvasSlider></CanvasSlider>
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}