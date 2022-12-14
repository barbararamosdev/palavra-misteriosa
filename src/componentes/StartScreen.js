import "./StartScreen.css"

const StartScreen = ({StartGame}) => {

    return (
        <div className="start">
            <h1>Palavra Secreta</h1>
            <p>Clique no botão para começar a jogar!</p>
            <button onClick={StartGame}>Começar o jogo</button>
        </div>
    );
};
export default StartScreen;