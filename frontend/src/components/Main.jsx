import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";
import Home from "./Home";
import Platform from "./Platform";


const Main = () => {
  return (
    <>
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/platform" exact component={Platform}/>
        </Switch>
    </BrowserRouter>
    </>
  )
}

export default Main