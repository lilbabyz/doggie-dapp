import React from 'react';
import { useState } from "react";

export const NewDogs = (props) => {

const [url, setUrl] = useState('');
const [description, setDescription] = useState('');
const [location, setLocation] = useState('');
const [price, setPrice] = useState('');
const [totaldogs, setTotalDogs] = useState('');

  return <div>
      <form>
  <div class="form-row">
    
      <input type="text" class="form-control" value={url}
           onChange={(e) => setUrl(e.target.value)} placeholder="image link"/>
           
      <input type="text" class="form-control mt-2" value={description}
           onChange={(e) => setDescription(e.target.value)} placeholder="Description"/>

      <input type="text" class="form-control mt-2" value={location}
           onChange={(e) => setLocation(e.target.value)} placeholder="Location"/>

      <input type="text" class="form-control mt-2" value={price}
           onChange={(e) => setPrice(e.target.value)} placeholder="Price"/>

      <input type="text" class="form-control mt-2" value={totaldogs}
           onChange={(e) => setTotalDogs(e.target.value)} placeholder="Total Dogs"/>


      <button type="button" onClick={()=>props.addDog(url, description, location, price, totaldogs)} class="btn btn-primary mt-2">Add new Dog</button>

  </div>
</form>
  </div>;
};
