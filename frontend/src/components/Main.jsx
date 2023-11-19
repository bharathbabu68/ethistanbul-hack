import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";
import Home from "./Home";
import Platform from "./Platform";
import MyBets from "./MyBets";


const Main = () => {
  return (
    <>
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/platform" exact component={Platform}/>
            <Route path="/my-bets" exact component={MyBets}/>
        </Switch>
    </BrowserRouter>
    </>
  )
}

export default Main