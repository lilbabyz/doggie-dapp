import React from 'react';

export const Dogs = (props) => {



  return <div className="dog_con">
    {props.dogss.map((dog) => (
      <div className="col-3">
     <div className="card" >
     <img src= {dog.url} className="card-img-top" alt="..." />
     <div className="card-body">
       <h5 className="card-title">{dog.location}</h5>
       <p className="card-text">{dog.description}</p>
       <p class="card-text"><small>Price: {dog.price} cUSD</small></p>
       <a href="#" class="btn btn-outline-primary">{dog.totalDogs} Dogs Available</a>
       <button onClick={ ()=> props.buyDog(dog.index)} class="btn btn-primary">Buy Dog</button>
     </div>
   </div>
   </div>
))};
</div>
};
