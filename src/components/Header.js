import React from "react";
import "./Header.css";
import Logo from "../images/ashokalogo.png"

const Header = () => (
  <header className="documentation">
    <div className="ui container">
      <div className="menu">
        <div>
          <h1 className="ui header">
            <a href="http://www.mapequation.org">
              <img className="ashoka-icon"
                   src={Logo}
                   style={{objectFit:"contain"}}
                   alt="ashoka-icon"/>
            </a>
            <div className="content">
                            <span className="brand">
                                <span className="brand-infomap">ISM</span> <span className="brand-nn">Graphic Visualizer</span>
                            </span>
              <div className="sub header">Under Guidance of Professor Rintu Kutum</div>
            </div>
          </h1>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
