import React , {Component} from 'react';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';
import PrimeReact from 'primereact/utils';
import HomePage from "./Pages/HomePage/HomePage";

PrimeReact.ripple = true;

class App extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
        <div>
           <HomePage/>
        </div>
    );
  }


}

export default App;
