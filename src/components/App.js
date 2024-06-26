import React, { useState } from "react";
import Header from "./Header";
import Layout from "./Layout";
import LoadNetwork from "./LoadNetwork";


export default function App() {
  const initialState = {
    network: null,
    filename: ""
  };

  const [state, setState] = useState(initialState);

  if (!state.network) {
    return <React.Fragment>
      <Header/>
      <LoadNetwork onLoad={setState}/>
    </React.Fragment>;
  }

  return <Layout {...state}/>;
}
