import React from 'react';
import './App.css';
import Die from './components/Die';
import { nanoid } from 'nanoid'; //unique string ID generator for JavaScript

// Confetti package
import Confetti from 'react-confetti';

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);

  // state how many times "Roll" btn was clicked
  const [counter, setCounter] = React.useState(0);

  const [scoreArray, setScoreArray] = React.useState([]);

  // CHECK IF ALL DICE ARE HOLD AND VALUES ARE THE SAME
  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld); // if ALL dice are held (green) - return truth
    const allEqual = dice.every((die) => die.value === dice[0].value); // if ALL dice are equall - return truth
    // if ALL dice are held (green) and has the same value,
    if (allEqual && allHeld) {
      setScoreArray((prevValue) => [...prevValue, counter]);

      setTenzies(true);
    }
  }, [dice]);

  // helper function creating an obj of each die with random value
  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 6),
      isHeld: false,
      id: nanoid(), //unique string ID generator for JavaScript
    };
  }

  // creating array of objects with value:random number 1-6
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  // rolling the dice to REgenerate random numbers
  function rollDice() {
    if (!tenzies) {
      setCounter((prevState) => prevState + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          // if the die is held (green) it value wont change
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      // to restart the game, reset tenzies state to initial value
      setTenzies(false);
      // to restart the game, recreate array with random values
      setDice(allNewDice());
      // to reser the counter of Roll btn
      setCounter(0);
      console.log(scoreArray);
    }
  }

  // flip the `isHeld` property on the object in the array
  // that was clicked, based on the `id`
  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      value={die.value}
      key={die.id}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {/* confetti package */}
      {tenzies && <Confetti />}
      <h1 className="app--name">Tenzies</h1>
      <p className="app--description">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="app--dice-container">{diceElements}</div>
      <div className="app-rollWrapper">
        <div className="app-score">{Math.min(...scoreArray)}</div>
        <button className="app--roll" onClick={rollDice}>
          {tenzies ? 'New Game' : 'Roll'}
        </button>
        <div className="app--counter">{counter}</div>
      </div>
    </main>
  );
}
