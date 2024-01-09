import './App.css';
import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Home from './pages/pages';

function App() { 
  return (
    <Router > 
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />  
        </Switch>
      <Footer />
    </Router>
  );
}

export default App;