import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import lottery from "./lottery";
import web3 from "./web3";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getManager = async () => {
      const manager = await lottery.methods.manager().call();
      setManager(manager);
    };

    const getPlayers = async () => {
      const players = await lottery.methods.getPlayers().call();
      setPlayers(players);
    };

    const getBalance = async () => {
      const balance = await web3.eth.getBalance(lottery.options.address);
      setBalance(web3.utils.fromWei(balance));
    };

    getManager();
    getPlayers();
    getBalance();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction to complete...");

    await lottery.methods
      .enter()
      .send({ value: web3.utils.toWei(value, "ether"), from: accounts[0] });

    setMessage("You have been entered!");
  };

  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Picking winner...");

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    setMessage("Winner picked");
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>

      <p>
        There are currently {players.length} players competing to win {balance}{" "}
        ether!
      </p>

      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={onPickWinner}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;
