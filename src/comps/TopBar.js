import React from 'react';

export const TopBar = (props) => {
  return <div>



    <nav className="navbar"> 
    <h1 className="brand-name">Doggie</h1>
    <nav>
            <span> 
            <button type="button" class="btn btn-outline-primary"><span>{props.cUSDBalance}</span>cUSD</button>
            
            </span>
            </nav>
         
    </nav>
  </div>;
};
