import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../src/artifacts/contracts/Greeter.sol/Greeter.json';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {

  // store greeting in local state
  const [data, setData] = useState()

  // request access to user's metamask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call contract to read
  const readContract = async () => {
    if (typeof window.ethereum !== 'undefined') {
      // this is the provider for METAMASK
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // this "contract" only can read
      const readyOnlyContract = new ethers.Contract(contractAddress, contractABI.abi, provider)
      try {
        const data = await readyOnlyContract.greet();
        console.log("data: ", data);
      } catch (error) {
        console.log("ERROR: ", error);
      }
    }
  }

  // call contract to write
  const writeContract = async () => {
    if (!data) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      // this is the provider for METAMASK
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // signer needed for transaction
      const signer = provider.getSigner();
      // this "contract" can read and send transactions
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer)
      const transaction = await contract.setGreeting(data)
      await transaction.wait();
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={readContract}>read!</button>
        <button onClick={writeContract}>write</button>
        <input onChange={e => setData(e.target.value)} placeholder="text" />
      </header>
    </div>
  );
}

export default App;
