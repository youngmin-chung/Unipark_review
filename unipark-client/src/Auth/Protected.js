import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRouter = ({ component, ...rest }) => {
  let RenderComponents = component;

  let hasToken = JSON.parse(localStorage.getItem("token"));
  console.log(RenderComponents);
  return (
    <Route
      {...rest}
      render={(props) => {
        // if the user does not have the token, it will redirect to the login page
        return hasToken !== null ?  (
          <RenderComponents {...props} />
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        );
      }}
    />
  );
};

export default ProtectedRouter;
