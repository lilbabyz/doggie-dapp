// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}



contract DoggieStore {
 
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;


    uint internal dogsLength = 0;
    // This structure contains all the properties of a dog
    struct Dog {
        address payable owner;
        string url;
        string description;
        string location;
        uint price;
        uint totalDogs;
        uint sold;

    }


    mapping(uint256 => Dog) internal dogs;
    
 // This function will add a new dog to the listing
 function addDog(
        string memory _url,
        string memory _description,
        string memory _location,
        uint _price,
        uint _totalDogs
    ) public {
        uint _sold = 0;
        
        dogs[dogsLength] = Dog(
            payable(msg.sender),
            _url,
            _description,
            _location,
            _price,
            _totalDogs,
            _sold
        );
       
        dogsLength++;
    }


    /* This function will automatically calculate the
     total number of dogs available by subtracting
      the total number of dogs sold from the total available dogs.*/
    function calculateTotalAvailableDogs(uint _index) internal {
        uint availableDogs = dogs[_index].totalDogs - dogs[_index].sold;
        dogs[_index].totalDogs = availableDogs;
    }


     // This function will change the image url of the listing
     function changeImageurl(uint _index, string memory _url) public {
        require(msg.sender == dogs[_index].owner, "Only creator can change image");
        dogs[_index].url = _url;
    }

    // This function will change the price of dogs in a listing
     function changeDogPrice(uint _index, uint _newPrice) public {
        require(msg.sender == dogs[_index].owner, "Only creator can change the price");
        dogs[_index].price = _newPrice;
    }
// This function will edit the listing with the new given parameters
    function editDogInformation(
        uint256 _index,
        string memory _url,
        string memory _description,
        string memory _location
    ) public {
        require(msg.sender == dogs[_index].owner, "Only owner can change dog information");

        uint _price = dogs[_index].price;
        uint _totalDogs = dogs[_index].totalDogs;
        uint _sold = dogs[_index].sold;
        dogs[_index] = Dog(
            payable(msg.sender),
            _url,
            _description,
            _location,
            _price,
            _totalDogs,
            _sold
        );
    }




// this function will get a dog listing by taking in an index parameter of the listing 
    function getDogs(uint _index) public view returns (
        address payable,
        string memory, 
        string memory,
        string memory,
        uint,
        uint,
        uint
    ) {
        return (
            dogs[_index].owner,
            dogs[_index].url,
            dogs[_index].description,
            dogs[_index].location,
            dogs[_index].price,
            dogs[_index].totalDogs,
            dogs[_index].sold
        );
    }




/* This function will facilitate the purchase of a dog 
and increase the number of sold dogs and then calculate the total available dogs 
by calling the calculateTotalAvailableDogs() function everytime a dog is bought from a listing*/
    function BuyDog(uint _index) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            dogs[_index].owner,
            dogs[_index].price
          ),
          "Transfer failed."
        );
        dogs[_index].sold++; 
        calculateTotalAvailableDogs(_index);
    }


     // this function will get the total length of dog listings available
    function getdogsLength() public view returns (uint) {
        return (dogsLength);
    }
  
}