import React, { useState, useEffect } from "react";
import "./style.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import * as ROUTES from "./routes";
import { useTranslation } from "react-i18next";
import Environment from "components/Environment";
import { HEARTBEAT } from "./api";
import BmiForm from "components/BmiForm";

const BackendConnectionTest = () => {
  const [response, setResponse] = useState<any>(undefined);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    fetch(HEARTBEAT)
      .then((res) => res.json())
      .then(
        (res) => setResponse(res),
        (err) => setResponse(err)
      )
      .finally(() => setIsFetching(false));
  }, []);

  return (
    <>
      <h3>Backend connection test:</h3>
      {isFetching ? (
        <p>Trying to reach backend...</p>
      ) : (
        <>
          <p>Backend responded with:</p>
          <pre>
            <code>{JSON.stringify(response, null, 2)}</code>
          </pre>
        </>
      )}
    </>
  );
};

const App: React.FC = () => {
  const isLoggedIn = false;

  return (
    <Router>
      {!isLoggedIn && (
        <Switch>
          <>
            <Redirect from={"*"} to={ROUTES.ROOT} />
            <Route path={ROUTES.ROOT}>
              <>
                <Environment />
                <hr className="dotted" />
                <BackendConnectionTest />
                <hr className="dotted" />
                <BmiForm />
              </>
            </Route>
          </>
        </Switch>
      )}
    </Router>
  );
};

export default App;
