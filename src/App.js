
import './App.css';
import { NewDogs } from './comps/NewDogs';
import { Dogs } from './comps/Dogs';
import { TopBar } from './comps/TopBar';
import { useState, useEffect, useCallback } from "react";


import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";


import dogs from "./contracts/dogs.abi.json";
import IERC from "./contracts/IERC.abi.json";


const ERC20_DECIMALS = 18;


const contractAddress = "0xB9Eb98a86e0a1a26FC22c8827932EE9ffF1140C4";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [dogss, setDogss] = useState([]);
 


  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("⚠️ Please install the CeloExtensionWallet.");
    }
  };






  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(dogs, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
     console.log(error);
    }
  }, [address, kit]);


  


  const getDogs = useCallback(async () => {
    const dogsLength = await contract.methods.getdogsLength().call();
    const dogs = [];
    for (let index = 0; index < dogsLength; index++) {
      let _dogs = new Promise(async (resolve, reject) => {
      let dog = await contract.methods.getDogs(index).call();

        resolve({
          index: index,
          owner: dog[0],
          url: dog[1],
          description: dog[2],
          location: dog[3],
          price: dog[4],
          totalDogs: dog[5], 
          sold: dog[6]    
        });
      });
      dogs.push(_dogs);
    }


    const _dogs = await Promise.all(dogs);
    setDogss(_dogs);
  }, [contract]);



  const addDog = async (
    _url,
    _description,
    _location,
    _price,
    _totalDogs
  ) => {
    try {
      await contract.methods.addDog(_url, _description, _location, _price, _totalDogs).send({ from: address });
      
    } catch (error) {
     console.log(error);
    }
   alert("🎉 You successfully added a new dog.");
      getDogs();
  };


    const changeImage = async (_index) => {
      try {
        await contract.methods.changeImage(_index).send({ from: address });
        getDogs();
        getBalance();
      } catch (error) {
       console.log("error");
       alert("You have successfully changed the image")
      }};


        const buyDog = async (_index) => {
          try {
            const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
            const cost = new BigNumber(dogss[_index].price)
              .shiftedBy(ERC20_DECIMALS).toString();
            await cUSDContract.methods.approve(contractAddress, cost)
              .send({ from: address });
            await contract.methods.BuyDog(_index, cost).send({ from: address });
            getDogs();
            getBalance();
          } catch (error) {
           console.log(error);
           alert("Purchase Successfull");
          }};

  useEffect(() => {
    connectToWallet();
  }, []);


  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getDogs();
      
    }
  }, [contract, getDogs]);


  return (
    <div className="App">
      <TopBar cUSDBalance={cUSDBalance} />
      <Dogs buyDog={buyDog} dogss={dogss} changeImage={changeImage} />
      <NewDogs addDog={addDog} />
    </div>
  );
  }

export default App;