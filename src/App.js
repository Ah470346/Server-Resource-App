import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from './Components/LoginComponent/login.jsx';
import Home from './Components/BodyComponent/main.jsx';
import {useSelector} from 'react-redux';

function App() {
  const permission = useSelector((state)=> state.permission);
  return (
    <Router>
      <div className="App">
        <Switch>
            <ProtectLoginRouter path="/" exact protect={permission.permission}>
              <Login></Login> 
            </ProtectLoginRouter>
            <ProtectHomeRouter path="/home" exact protect={permission.permission}>
              <Home></Home>
            </ProtectHomeRouter>
          </Switch>
      </div>
    </Router>
  );
}

const ProtectLoginRouter = ({protect,children,...rest})=>{
  return(
    <Route 
      {...rest}
      render = {()=> protect === "login" ? (
        children
      ):
      (
        <Redirect to="/home"></Redirect>
      )} 
    />
  )
}

const ProtectHomeRouter = ({protect,children,...rest})=>{
  return(
    <Route 
      {...rest}
      render = {()=> protect === "home" ? (
        children
      ):
      (
        <Redirect to="/"></Redirect>
      )} 
    />
  )
}

export default App;
