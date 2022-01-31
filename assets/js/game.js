/** 
 * 2C = two of clubs ( tréboles )
 * 2D = two of diamonds ( diamantes )
 * 2C = two of hearts  ( corazones )
 * 2C = two of spades ( spadas ) 
 * 
 * La meta es llegar a 21 puntos sin pasarnos
 */
// funcion anónima auto-invocada
  //console.log('Hola, soy una funcion anonima auntoinvocada');

(() => {  
    let deckOfCards = [];
    // C = Tréboles, D= Diamantes, H = Corazones, S = Espades
    const types = ['C', 'D', 'H', 'S'];
    const specials = ['A', 'J', 'Q', 'K'];

    // Score de jugadores
    let scorePlayers = [];

    /**---  REFERNCIAS AL DOM --- */

    //  Botones de acciones
    const getBtnCard = document.querySelector("#btnGetCard");
    const stopBtnTurn = document.querySelector("#btnStopTurn");
    const newBtnGame = document.querySelector("#btnNewGame");

    //  Referencias al Area de juego 
    const divCardPlayers = document.querySelectorAll('.divCards'); 
    const scoreHtml = document.querySelectorAll('small')

    /*-- Fin de referencias al DOM  --*/

    // Funciones
    // Iniciar el juego
    const startGame = (numPlayer = 2) => {
        // Crear baraja
        deckOfCards = createDeck();
        
        //  el puntaje de los jugadores
        scorePlayers = [];
        for ( let i =0; i < numPlayer; i++) {
            scorePlayers.push(0);
        }      

        // Resetear los puntajes de os jugadores
        // LIMPIAR EL AREA DEL JUEGO
        scoreHtml.forEach(element => element.innerText = 0);
        divCardPlayers.forEach(element => element.innerHTML = '');

        // Habilitar los botones 
        getBtnCard.disabled = false;
        stopBtnTurn.disabled = false;
    };

    //  Crear la baraja 
    const createDeck = () =>  {
        let deckOfCards = [];
        for (let i = 2; i <= 10; i++) {
            for (let type of types)  {
                deckOfCards.push(i + type)
            }
        }
        for (let type of types) {
            for (let special of specials) {
                deckOfCards.push(special + type);
            }
        }
      
        return _.shuffle(deckOfCards);
    };

    // Obtener una carta (tarjeta)
    const getOneCard = () => {
        if(deckOfCards.length === 0) {
            throw  'The deck is empty';
        }
        // el pop elimina el ultimo elemento y devuleve el elemnento eliminado
        return deckOfCards.pop();
    };

    // Valor de la carta
    // En Js los strings se pueden acceder como sifueran un arreglo
    // ejemplo: 2D se puede accder así [2,D] ndices: 2 = 0; D = 1


    // El ultimo indice lo quiero ignorar
    // 2D  [2,D] ==> lengh = 2, longitud = 2  
    // 10D [1,0,D] ==> length 3, longitud = 3

    /**
     * 10D tiene una longitud de 3 y sus indices son 0, 1, 2 
     * 
     * 
     */
    const valueCard = (card) => {
        const value = card.substring(0, card.length - 1);
        return (isNaN(value) ? (value === 'A') ? 11 : 10: value * 1);       
    };
    
    // Contador de puntaje
    const countScore = (card, turn) => {
        scorePlayers[turn] += valueCard(card);

        scoreHtml[turn].innerText = scorePlayers[turn];
        return scorePlayers[turn];       
    } 

        // Crear carta para mostrarla en DOM
        // obtener la carta a crear  y necesitamos el turno del jugador 0, 1
        // nosotros somos el 0 y el computador el 1
    const createCard = (card, turn) => {
        const imgCard = document.createElement('img');
        // <img src="assets/img/cartas/2c.png" alt=""></img>
        imgCard.src = `assets/img/cartas/${card}.png`;
        imgCard.classList.add('img-card', 'animate__animated', 'animate__fadeInRight');
        divCardPlayers[turn].append(imgCard);
    }
    

    // Determinar al ganador
    const winnerPlayer = () => { 
        // scoreplayer puntajes del jugador y de la computadora.
        const [scorePlayer, scoreComputer] = scorePlayers;
        if (scoreComputer === scorePlayer) {
            Swal.fire({
                title: 'Empate',
            });
        } else if (scorePlayer > 21) {
            Swal.fire({
                icon: 'Error',
                title: 'Derrota',
                texto: 'Perdiste, el computador Gana'
            });
        } else if(scoreComputer > 21){
            Swal.fire({
                title: 'Victoria',
            });
        } else {
            Swal.fire({
                icon: 'Error',
                title: 'Derrota',
                texto: 'Perdiste, el computador gana'
            });
        }
    }

    // Turno de la computadora
    // minScore el puntaje que obtuvo el player 0 ( de nosotros )
    const turnComputer = (minScore) => {
        let scoreComputer = 0;
        do {
            const card = getOneCard();
            scoreComputer = countScore(card, scorePlayers.length - 1);
            createCard(card, scorePlayers.length - 1);
        } while((scoreComputer < minScore) && (minScore <= 21))
        winnerPlayer();
    }

    /*  LOS EVENTOS DE LOS BOTONES */ 

    newBtnGame.addEvenListener('click', () => {
        startGame();
    });

    // Obtenemos carta
    getBtnCard.addEvenListener('click', () =>{
        const card = getOneCard();
        // Vamos a enviar el jugador y la carta 
        const scorePlayer = countScore(card, 0);
        createCard(card, 0);       

        if(scorePlayer > 21) {
            getBtnCard.disabled = true;
            stopBtnTurn.disabled = true;  
            turnComputer(scorePlayer);
                  
            // turno de la maquina

        } else if (scorePlayer === 21) {
            getBtnCard.disabled = true;
            stopBtnTurn.disabled = true;
            turnComputer(scorePlayer);
            // turno de la maquina
        }  
    });

    // stop turno de la cpomputadora

    stopBtnTurn.addEventListener('click', () => {
        getBtnCard.disabled = true;
        stopBtnTurn.disabled = true;
        turnComputer(scorePlayers[0])
    })   
     

})();










