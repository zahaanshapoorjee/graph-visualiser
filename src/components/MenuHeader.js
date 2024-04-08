import React from "react";
import { Header, Image } from "semantic-ui-react";
import Logo from "../images/ashokalogo.png"


export default function MenuHeader() {
  return <Header>
    <Image
      size="mini"
      verticalAlign="middle"
      src={Logo}
    />
    <div className="content">
            <span className="brand">
                <span className="brand-infomap">Infomap</span> <span className="brand-nn">Graph Visualizer</span>
            </span>
    </div>
  </Header>;
}
