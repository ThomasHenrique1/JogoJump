const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('gameOverMessage');
const nicknameInput = document.getElementById('nicknameInput');
const startGameBtn = document.getElementById('startGameBtn');
const highScoresSection = document.getElementById('highScores');
const highScoreList = document.getElementById('highScoreList');

let score = 0;
let gameActive = false;
let gameLoop;
let pipeSpeed = 1500; // Velocidade inicial do cano
let highScores = []; // Array para armazenar high scores

const jump = () => {
    if (!gameActive) return; // Impede o pulo se o jogo não estiver ativo

    mario.classList.add('jump');
    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
};

const increaseScore = () => {
    if (!gameActive) return; // Não incrementa a pontuação se o jogo não estiver ativo

    score++;
    scoreDisplay.textContent = `Score: ${score}`;

    // Aumenta a velocidade do cano a cada 350 pontos
    if (score % 350 === 0) {
        pipeSpeed *= 0.9; // Aumenta a velocidade do cano
        pipe.style.animationDuration = `${pipeSpeed}ms`; // Atualiza a animação
    }
};

const loop = () => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        // Colisão detectada
        endGame();
    } else {
        increaseScore(); // Incrementa a pontuação
    }
};

const startGame = () => {
    const nickname = nicknameInput.value.trim();
    if (nickname === '') {
        alert("Coloque seu nick antes de jogar."); // Alerta se o nickname não for inserido
        return;
    }

    gameActive = true;
    score = 0;
    scoreDisplay.textContent = `Score: 0`;
    pipe.style.animationDuration = `${pipeSpeed}ms`; // Reseta a velocidade do cano
    gameOverMessage.style.display = 'none'; // Esconde a mensagem de Game Over
    startGameBtn.style.display = 'none'; // Esconde o botão de iniciar
    nicknameInput.style.display = 'none'; // Esconde o campo de nickname
    mario.src = 'imagens/mario.gif'; // Reseta a imagem do Mario

    gameLoop = setInterval(loop, 100); // Inicia o loop do jogo
};

const endGame = () => {
    gameActive = false;
    clearInterval(gameLoop);
    mario.src = 'imagens/game-over.png'; // Troca a imagem do Mario
    mario.style.width = '75px';
    mario.style.marginLeft = '50px';
    gameOverMessage.style.display = 'block'; // Exibe a mensagem de Game Over

    // Adiciona o score à lista de high scores
    highScores.push({ nickname: nicknameInput.value, score: score });
    highScores.sort((a, b) => b.score - a.score); // Ordena do maior para o menor
    displayHighScores();

    startGameBtn.style.display = 'block'; // Exibe o botão de reiniciar
    nicknameInput.style.display = 'block'; // Exibe o campo de nickname após o game over
    nicknameInput.value = ''; // Limpa o campo para o próximo nickname
    nicknameInput.focus(); // Foca no campo para que o usuário possa inserir o nickname novamente
};

// Função para exibir high scores
const displayHighScores = () => {
    highScoreList.innerHTML = ''; // Limpa a lista anterior
    highScores.slice(0, 5).forEach(entry => { // Mostra apenas os 5 melhores scores
        const li = document.createElement('li');
        li.textContent = `${entry.nickname}: ${entry.score}`;
        highScoreList.appendChild(li);
    });
    highScoresSection.style.display = 'block'; // Mostra a seção de high scores
};

// Evento de clique para iniciar o jogo
startGameBtn.addEventListener('click', startGame);

// Evento de tecla para pular
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') { // Pula apenas se a tecla pressionada for 'W'
        jump();
    }
});
