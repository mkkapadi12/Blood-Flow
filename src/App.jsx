import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { appRoutes } from "./routes";

const renderRoutes = (routes) =>
  routes.map((route, index) => {
    if (route.children) {
      return (
        <Route
          key={index}
          path={route.path}
          index={route.index}
          element={route.element}
        >
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return (
      <Route
        key={index}
        path={route.path}
        index={route.index}
        element={route.element}
      />
    );
  });

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {renderRoutes(appRoutes)}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
