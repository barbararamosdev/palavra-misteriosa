//CSS
import "./App.css";

// React 
import { useCallback, useEffect, useState } from "react";

//data
import { wordsList } from "./data/Words";

//componentes
import StartScreen from "./componentes/StartScreen";
import Game from "./componentes/Game";
import GameOver from "./componentes/GameOver";

const stages = [
  { id: 1, name: "start" }, //0
  { id: 2, name: "game" }, //1
  { id: 3, name: "end" }, //2
];

const guessesQty = 10;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //pick a rondom category
    const categories = Object.keys(words);

    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pick a radom word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];


    return { word, category };
  }, [words]);

  //Starts the palavra secreta game
  const StartGame = useCallback(() => {
    //clear all letters
    clearLetterStates();
    // pick word and pick category
    const { word, category } = pickWordAndCategory();

    //create an array of letters
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());


    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //Process the letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()

    //check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
      ])
    } else {
      setWrongLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);

    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }
  useEffect(() => {

    if (guesses <= 0) {
      //reset all state
      clearLetterStates()
      setGameStage(stages[2].name)
    }

  }, [guesses]);

  //check win condition
  useEffect(() => {

    const uniqueLetters = [... new Set(letters)]
    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => (actualScore + - 100));
      //restart game with new word
      StartGame();

    }


  }, [guessedLetters, letters, StartGame])

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen StartGame={StartGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
};
export default App;
