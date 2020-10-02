import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";
import Home from "./pages/home";
import React from "react";
import Terms from "./pages/terms";
import Shared from "./pages/shared";
//
import RatePopupModal from "./components/RatePopupModal/RatePopupModal";

const AppRoute = () => {
  return (
    <BrowserRouter>
      <Switch>
      <Route path="/test" component={RatePopupModal} />

        <Route path="/(:engine)" component={Home} />
        <Route path="/shared/:referralID" component={Shared} />
        <Route path="/terms" component={Terms} />
        <Route path="/" component={Home} />
        <Route path="/search" component={Home} />
        {/* <Redirect to="/" /> */}
      </Switch>
    </BrowserRouter>
  );
};

export default AppRoute;
