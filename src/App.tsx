import React, { FC, Fragment } from 'react';
import Routes from './Routes';
import './Style/global.css';
import './Style/Login.css';
import './Style/Header.css';

const App: FC = () => {

  return (
    <Fragment>
      <div className="body">
        <Routes />
      </div>
    </Fragment>
  )

};

export default App;
