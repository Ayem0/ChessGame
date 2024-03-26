// variables nécessaires
// équipes
var white = 'white';
var black = 'black';
// Les types des pieces
var left = '-left';
var right = '-right';
var p = 'pawn';
var n = 'knight';
var b = 'bishop';
var r = 'rook';
var q = 'queen';
var k = 'king';
// Les valeurs des pieces
var pValue = 1;
var nValue = 3;
var bValue = 3;
var rValue = 5;
var qValue = 9;
var kValue = 1000;
// les img des pieces
var wPImg = 'img/pawn_white.png';
var wRImg = 'img/rook_white.png';
var wQImg = 'img/queen_white.png';
var wKImg = 'img/king_white.png';
var wBImg = 'img/bishop_white.png';
var wNImg = 'img/knight_white.png';
var bPImg = 'img/pawn_black.png';
var bRImg = 'img/rook_black.png';
var bQImg = 'img/queen_black.png';
var bKImg = 'img/king_black.png';
var bBImg = 'img/bishop_black.png';
var bNImg = 'img/knight_black.png';
// Les pieces
// blanches
var wP = [p, white, pValue, wPImg];
var wR = [r, white, rValue, wRImg];
var wRRight = [r + right, white, rValue, wRImg];
var wRLeft = [r + left, white, rValue, wRImg];
var wN = [n, white, nValue, wNImg];
var wQ = [q, white, qValue, wQImg];
var wK = [k, white, kValue, wKImg];
var wB = [b, white, bValue, wBImg];
// noirs
var bP = [p, black, pValue, bPImg];
var bR = [r, black, rValue, bRImg];
var bRRight = [r + right, black, rValue, bRImg];
var bRLeft = [r + left, black, rValue, bRImg];
var bN = [n, black, nValue, bNImg];
var bQ = [q, black, qValue, bQImg];
var bK = [k, black, kValue, bKImg];
var bB = [b, black, bValue, bBImg];
// le board

var board = [
    bRLeft, bN, bB, bQ, bK, bB, bN, bRRight,
    bP, bP, bP, bP, bP, bP, bP, bP,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    wP, wP, wP, wP, wP, wP, wP, wP,
    wRLeft, wN, wB, wQ, wK, wB, wN, wRRight,
];
/*
// test echec et maths
var board = [
    bRLeft, '', '', '', '', bRRight, bK, '',
    bP, bP, bP, '', '', bP, '', bP, 
    '', '', '', '', '', wB, bP, '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', wN, '', 
    '', wP, '', '', '', '', '', '', 
    wP, '', '', '', '', wP, wP, wP,
    '', '', '', '', '', wRRight, wK, '', 
];
*/
// le tour actuel
var turn = 'white';
// Les pieces mortes
var whiteDeadPieces = [];
var blackDeadPieces = [];
// si game fini
var gameOver = false;
// mouvements joués et historique
var lastMovePlayed = [];
var history = [];
// var pour castle
var wKMoved = false;
var wRLeftMoved = false;
var wRRightMoved = false;
var bKMoved = false;
var bRLeftMoved = false;
var bRRightMoved = false;
// positions accessibles par équipe pour échecs 
var wAccessiblePositions = [];
var bAccessiblePositions = [];
// variable pour pat
var canwKMove = true;
var canbKMove = true;
// var pour accessible pos // sinon bug // pour affichage
var accessiblePos = [];
var movingPiece;

createBoard(board);
addPiecesToBoard(board);

function createBoard(boardType) {
    const boardDiv = document.getElementById('board');
    let n = 0;
    for ( let i = 0; i < boardType.length; i++) {
        const div = document.createElement('div');
        div.setAttribute('id', i);
        div.addEventListener('drop', dropPiece);
        div.addEventListener('dragover', dragOver);
        if ( i%8 == 0 && i != 0) {
           n++;
        } 
        if ( n%2 == 0 ){
            if ( i%2 == 0) {
                div.classList.add('beige');
            } else {
                div.classList.add('green');
            }
            
            
        } else {
            if ( i%2 == 0) {
                div.classList.add('green');
            } else {
                div.classList.add('beige');
            }
        }
        boardDiv.appendChild(div);
    }
}

function addPiecesToBoard(boardType) {
    for ( let i = 0; i < boardType.length; i++) {
        if ( boardType[i] != '') {
            const boardDiv = document.getElementById(i);
            const div = document.createElement('div');
            div.setAttribute('draggable', true);
            div.addEventListener('dragstart', dragStart);
            div.addEventListener('dragend', dragEnd);
            div.addEventListener('dragover', dragOver);
            const img = document.createElement('img');
            img.src = boardType[i][3];
            img.classList.add('piece-img')
            div.classList.add(boardType[i][0], boardType[i][1], 'piece');
            div.appendChild(img);
            boardDiv.appendChild(div);
        }
    }
}

function swapTurn() {
    if (turn == "white") {
        turn = "black";
    } else {
        turn = "white";
    }
}

/////////////////////////////////////////////////////////////////////
////////////////                                 ////////////////////
////////////////     FONCTIONS DRAG AND DROP     ////////////////////
////////////////                                 ////////////////////
/////////////////////////////////////////////////////////////////////

function dragOver(event) {
    event.preventDefault();
}

function dragEnd(event) {
    event.preventDefault();
    for (let i = 0; i < accessiblePos.length; i++) {
        let element = document.getElementById(accessiblePos[i]);
        element.classList.remove('accessible');
    }
    accessiblePos = [];
}

function dragStart(event) {
    const pieceStartPosition = event.srcElement.parentNode.parentNode.id;
    const pieceType = event.srcElement.parentNode.classList[0];
    const pieceColor = event.srcElement.parentNode.classList[1];
    movingPiece = pieceStartPosition;
    let possibleMoves = [];
    console.log(pieceStartPosition);

    if ( pieceType == 'pawn') {
        possibleMoves = possibleMoves.concat(pawnMoves(pieceStartPosition, pieceColor, board));
    }
    if ( pieceType == 'knight') {
        possibleMoves = possibleMoves.concat(knightMoves(pieceStartPosition, pieceColor, board));
    }
    if ( pieceType == 'bishop') {
        possibleMoves = possibleMoves.concat(bishopMoves(pieceStartPosition, pieceColor, board));
    }
    if ( pieceType.includes('rook')) {
        possibleMoves = possibleMoves.concat(rookMoves(pieceStartPosition, pieceColor, board));
    }
    if ( pieceType == 'queen') {
        possibleMoves = possibleMoves.concat(bishopMoves(pieceStartPosition, pieceColor, board));
        possibleMoves = possibleMoves.concat(rookMoves(pieceStartPosition, pieceColor, board));
    }
    if ( pieceType == 'king') {
        possibleMoves = possibleMoves.concat(kingMoves(pieceStartPosition, pieceColor, board));
    }
    console.log(possibleMoves);
    let legalMoves = [];
    for (let i = 0; i < possibleMoves.length; i++) {
        let test = isMoveLegal(pieceStartPosition, possibleMoves[i]);
        if ( test == true) {
            legalMoves.push(possibleMoves[i]);
            const element = document.getElementById(possibleMoves[i]);
            element.classList.add('accessible');
        }
    }
    accessiblePos = legalMoves;
    console.log(legalMoves);
}

function dropPiece(event) {
    let selectedTile = event.target;
    if (selectedTile.nodeName.toUpperCase() === 'IMG') {
        selectedTile = selectedTile.parentNode.parentNode;
    } 
    console.log(selectedTile.id);
    const posEnd = parseInt(selectedTile.id);

    if ( turn == board[movingPiece][1]) {
        for (let i= 0; i < accessiblePos.length; i++) {
            if (accessiblePos[i] == posEnd) {
                // piece qui bouge
                const piece = board[movingPiece];
                // si roi ou tour bouge, modifie a true
                if (piece[0] == 'king' && piece[1] == 'white' ) {
                    wKMoved = true;
                }
                if (piece[0] == 'rook-right' && piece[1] == 'white' ) {
                    wRRightMoved = true;
                }
                if (piece[0] == 'rook-left' && piece[1] == 'white' ) {
                    wRLeftMoved = true;
                }
                if (piece[0] == 'king' && piece[1] == 'black' ) {
                    bKMoved = true;
                }
                if (piece[0] == 'rook-right' && piece[1] == 'black' ) {
                    bRRightMoved = true;
                }
                if (piece[0] == 'rook-left' && piece[1] == 'black' ) {
                    bRLeftMoved = true;
                }
                // code deplacement
                // si castle, bouge la tour
                if ( piece[0] == 'king' && posEnd == parseInt(movingPiece) + 2) {
                    const rook = board[parseInt(movingPiece)+3];
                    board[parseInt(movingPiece)+3] = '';
                    board[parseInt(movingPiece)+1] = rook;
                }

                if ( piece[0] == 'king' && posEnd == parseInt(movingPiece) - 2) {
                    const rook = board[parseInt(movingPiece)-4];
                    board[parseInt(movingPiece)-4] = '';
                    board[parseInt(movingPiece)-1] = rook;
                }

                board[movingPiece] = '';
                board[posEnd] = piece;
                // modifier le board affiché
                // FAIRE DE TOUT CE CODE UNE FONCTION updateBoard();
                if ( piece[0] == 'king' && posEnd == parseInt(movingPiece) + 2) {
                    const rookMoving = document.getElementById(parseInt(movingPiece) + 3).firstChild;
                    const rookEnd = document.getElementById(parseInt(movingPiece) + 1);          
                    rookEnd.appendChild(rookMoving);
                }

                if ( piece[0] == 'king' && posEnd == parseInt(parseInt(movingPiece) - 2) ) {
                    const rookMoving = document.getElementById(parseInt(movingPiece) - 4).firstChild;
                    const rookEnd = document.getElementById(parseInt(movingPiece) - 1);          
                    rookEnd.appendChild(rookMoving);
                }

                const pieceMoving = document.getElementById(parseInt(movingPiece)).firstChild;
                const tileSelected = document.getElementById(posEnd);
                if (tileSelected.firstChild) {
                    // ajouter un update des info black ou white
                    tileSelected.removeChild(tileSelected.firstChild);
                }            
                tileSelected.appendChild(pieceMoving);
                swapTurn();
                // MODIFIER ICI POUR LEGALITE BIZARRE

                if ( isCheck(turn, board)) {
                    console.log('echec')
                    if ( isCheckMate(turn, board)) {
                        console.log('echec et maths');
                    }
                } else {
                    if ( isCheckMate(turn, board)) {
                        console.log('egalite bizarre');
                    }
                }
                break;
            }
        }
    }
}

//////////////////////////////////////////////////////////////////////
//////////////                                        ////////////////
//////////////  FONCTIONS CALCUL DES MOVES DES PAWNS  ////////////////
//////////////                                        ////////////////
//////////////////////////////////////////////////////////////////////

/////////////////////// /!\ AJOUTER EN PASSANT /!\ \\\\\\\\\\\\\\\\\\\\\\\

function pawnMoves(startId, color, boardType) {
    const startPos = parseInt(startId);
    let possibleMoves = [];
    if ( color == 'white') {
        oppositeColor = 'black';
        // 2 case vers le haut si n'as pas bougé
        if ( startPos/8 < 7 && startPos/8 >= 6 ) {
            if (boardType[startPos-8] == '' && boardType[startPos-16] == '') {
                possibleMoves.push(startPos-16);
            }
        }
        // 1 case vers le haut
        if (boardType[startPos-8] == '') {
            possibleMoves.push(startPos-8);
        }
        // 1 case vers le haut a droite si il y a un ennemi
        if ( startPos%8 < 7 && startPos/ 8 >= 1) {
            if ( boardType[startPos-7] != '' && boardType[startPos-7][1] == oppositeColor) {
                possibleMoves.push(startPos-7);
            }
        }
        // 1 case vers le haut a gauche si il y a un ennemi
        if ( startPos%8 > 0 && startPos/ 8 >= 1) {
            if ( boardType[startPos-9] != '' && boardType[startPos-9][1] == oppositeColor) {
                possibleMoves.push(startPos-9);
            }
        }
        
    } else {
        oppositeColor = 'white';
        // 2 case vers le bas si n'as pas bougé
        if ( startPos/8 < 2 && startPos/8 >= 1 ) {
            if (boardType[startPos+8] == '' && boardType[startPos+16] == '') {
                possibleMoves.push(startPos+16);
            }
        }
        // 1 case vers le bas
        if (boardType[startPos+8] == '') {
            possibleMoves.push(startPos+8);
        }
        // 1 case vers le bas a gauche si il y a un ennemi
        if ( startPos%8 > 0 && startPos/ 8 < 7) {
            if ( boardType[startPos+7] != '' && boardType[startPos+7][1] == oppositeColor) {
                possibleMoves.push(startPos+7);
            }
        }
        // 1 case vers le bas a droite si il y a un ennemi
        if ( startPos%8 < 7 && startPos/ 8 < 7) {
            if ( boardType[startPos+9] != '' && boardType[startPos+9][1] == oppositeColor) {
                possibleMoves.push(startPos+9);
            }
        }
    }
    return possibleMoves;
}

////////////////////////////////////////////////////////////////////////
//////////////                                          ////////////////
//////////////   FONCTIONS CALCUL DES MOVES DES ROOKS   ////////////////
//////////////                                          ////////////////
////////////////////////////////////////////////////////////////////////

function rookMoves(startId, color, boardType) {
    const startPos = parseInt(startId);
    let oppositeColor = '';
    if ( color == 'white') {
        oppositeColor = 'black';
    } else {
        oppositeColor = 'white';
    }
    let possibleMoves = [];
    // deplacement vers le haut
    if (startPos/8 >= 1) {
        let count = 0;
        for ( let i = startPos/8; i >= 1; i-- ) {
            count++;
            if ( boardType[startPos-8 * count] != '') {
                if (boardType[startPos-8 * count][1] == oppositeColor) {
                    possibleMoves.push(startPos - 8 * count);
                    break;
                } else {
                    break;
                }
            } else {
                possibleMoves.push(startPos - 8 * count);
            }
        }
    }
    // deplacement vers le bas
    if (startPos/8 < 7) {
        let count = 0;
        for ( let i = startPos/8; i < 7; i++ ) {
            count++;
            if ( boardType[startPos+8 * count] != '') {
                if (boardType[startPos+8 * count][1] == oppositeColor) {
                    possibleMoves.push(startPos + 8 * count);
                    break;
                } else {
                    break;
                }
            } else {
                possibleMoves.push(startPos + 8 * count);
            }
        }
    }
    // deplacement vers la droite
    if (startPos%8 < 7) {
        let count = 0;
        for ( let i = startPos%8; i < 7; i++ ) {
            count++;
            if ( boardType[startPos+1 * count] != '') {
                if (boardType[startPos+1 * count][1] == oppositeColor) {
                    possibleMoves.push(startPos + 1 * count);
                    break;
                } else {
                    break;
                }
            } else {
                possibleMoves.push(startPos + 1 * count);
            }
        }
    }
    // deplacement vers la gauche
    if (startPos%8 >= 1) {
        let count = 0;
        for ( let i = startPos%8; i > 0; i-- ) {
            count++;
            if ( boardType[startPos-1 * count] != '') {
                if (boardType[startPos-1 * count][1] == oppositeColor) {
                    possibleMoves.push(startPos - 1 * count);
                    break;
                } else {
                    break;
                }
            } else {
                possibleMoves.push(startPos - 1 * count);
            }
        }
    }
    return possibleMoves;
}

////////////////////////////////////////////////////////////////////////
//////////////                                          ////////////////
//////////////  FONCTIONS CALCUL DES MOVES DES BISHOPS  ////////////////
//////////////                                          ////////////////
////////////////////////////////////////////////////////////////////////

function bishopMoves(startId, color, boardType) {
    const startPos = parseInt(startId);
    let oppositeColor = '';
    if ( color == 'white') {
        oppositeColor = 'black';
    } else {
        oppositeColor = 'white';
    }
    let possibleMoves = [];
    // deplacement en haut a gauche
    if (startPos / 8 >= 1 && startPos % 8 > 0) {
        let count = 0;
        for (let i = startPos % 8; i > 0; i--) { 
            count++;
            if (startPos - 9 * count < 0) {
                break;
            }
            if (boardType[startPos - 9 * count] != '') {
                if (boardType[startPos - 9 * count][1] == oppositeColor) {
                    possibleMoves.push(startPos - 9 * count);
                    break;
                } else {
                    break;
                }
            } else {
                possibleMoves.push(startPos - 9 * count);
            }
        }
    }
    // deplacement en haut a droite
    if (startPos / 8 >= 1 && startPos % 8 < 7 ) {
        let count = 0;
        for (let i = startPos % 8; i < 7; i++) {
            count++;
            if (startPos - 7 * count < 0) {
                break;
            }
            if (boardType[startPos - 7 * count] != '') {
                if (boardType[startPos - 7 * count][1] == oppositeColor) {
                    possibleMoves.push(startPos - 7 * count);
                    break;
                } else {
                    break;
                }
            } else {
                possibleMoves.push(startPos - 7 * count);
            }
        }
    }
    // deplacement en bas a droite
    if (startPos / 8 < 7 && startPos % 8 < 7) {
        let count = 0;
        for (let i = startPos % 8; i < 7; i++) {
            count++;
            if (startPos + 9 * count > 63) {
                break;
            }
            if (boardType[startPos + 9 * count] != '') {
                if (boardType[startPos + 9 * count][1] == oppositeColor) {
                    possibleMoves.push(startPos + 9 * count);
                    break;
                } else {
                    break;
                }
            } else {
                possibleMoves.push(startPos + 9 * count);
            }
        }
    }
    // deplacement en bas a gauche
    if (startPos / 8 < 7 && startPos % 8 > 0) {
        let count = 0;
        for (let i = startPos % 8; i > 0 ; i--) {
            count++;
            if (startPos + 7 * count > 63) {
                break;
            }
            if (boardType[startPos + 7 * count] != '') {
                if (boardType[startPos + 7 * count][1] == oppositeColor) {
                    possibleMoves.push(startPos + 7 * count);
                    break;
                } else {
                    break;
                }
            } else {
                possibleMoves.push(startPos + 7 * count);
            }
        }
    }
    return possibleMoves;
}

////////////////////////////////////////////////////////////////////////
//////////////                                          ////////////////
//////////////  FONCTIONS CALCUL DES MOVES DES KNIGHTS  ////////////////
//////////////                                          ////////////////
////////////////////////////////////////////////////////////////////////

function knightMoves(startId, color, boardType) {
    const startPos = parseInt(startId);
    let oppositeColor = '';
    if ( color == 'white') {
        oppositeColor = 'black';
    } else {
        oppositeColor = 'white';
    }
    let possibleMoves = [];
    // deplacement de 2 case vers le haut 1 case vers la droite
    if (startPos / 8 >= 2 && startPos % 8 < 7) {
        if ( boardType[startPos - 15] != '') {
            if (boardType[startPos - 15][1] == oppositeColor) {
                possibleMoves.push(startPos - 15);
            }
        }
        else {
            possibleMoves.push(startPos - 15);
        }
    }
    // deplacement de 2 case vers le haut 1 case vers la gauche
    if (startPos / 8 >= 2 && startPos % 8 > 0) {
        if ( boardType[startPos - 17] != '') {
            if (boardType[startPos - 17][1] == oppositeColor) {
                possibleMoves.push(startPos - 17);
            }
        }
        else {
            possibleMoves.push(startPos - 17);
        }
    }
    // deplacement de 2 case vers le bas 1 case vers la gauche
    if (startPos / 8 < 6 && startPos % 8 > 0) {
        if ( boardType[startPos + 15] != '') {
            if (boardType[startPos + 15][1] == oppositeColor) {
                possibleMoves.push(startPos + 15);
            }
        }
        else {
            possibleMoves.push(startPos + 15);
        }
    }
    // deplacement de 2 case vers le bas 1 case vers la droite
    if (startPos / 8 < 6 && startPos % 8 < 7) {
        if ( boardType[startPos + 17] != '') {
            if (boardType[startPos + 17][1] == oppositeColor) {
                possibleMoves.push(startPos + 17);
            }
        }
        else {
            possibleMoves.push(startPos + 17);
        }
    }
    // deplacement de 2 cases a droite 1 case vers le haut
    if (startPos / 8 >= 1 && startPos % 8 <= 5) {
        if ( boardType[startPos - 6] != '') {
            if (boardType[startPos - 6][1] == oppositeColor ) {
                possibleMoves.push(startPos - 6);
            }
        }
        else {
            possibleMoves.push(startPos - 6);
        }
    }
    // deplacement de 2 case vers la droite 1 case vers le bas
    if (startPos / 8 <= 7 && startPos % 8 <= 5) {
        if ( boardType[startPos + 10] != '') {
            if (boardType[startPos + 10][1] == oppositeColor ) {
                possibleMoves.push(startPos + 10);
            }
        }
        else {
            possibleMoves.push(startPos + 10);
        }
    }
    // deplacement de 2 case vers la gauche 1 case vers le bas
    if (startPos / 8 <= 7 && startPos % 8 >= 2) {
        if ( boardType[startPos + 6] != '') {
            if (boardType[startPos + 6][1] == oppositeColor ) {
                possibleMoves.push(startPos + 6);
            }
        }
        else {
            possibleMoves.push(startPos + 6);
        }
    }
    // deplacement de 2 case vers la gauche 1 case vers le haut
    if (startPos / 8 >= 1 && startPos % 8 >= 2) {
        if ( boardType[startPos - 10] != '') {
            if (boardType[startPos - 10][1] == oppositeColor ) {
                possibleMoves.push(startPos - 10);
            }
        }
        else {
            possibleMoves.push(startPos - 10);
        }
    }
    return possibleMoves;
}

////////////////////////////////////////////////////////////////////////
//////////////                                          ////////////////
//////////////   FONCTIONS CALCUL DES MOVES DES KINGS   ////////////////
//////////////                                          ////////////////
////////////////////////////////////////////////////////////////////////

function kingMoves(startId, color, boardType) {
    const startPos = parseInt(startId);
    let oppositeColor = '';
    if ( color == 'white') {
        oppositeColor = 'black';
    } else {
        oppositeColor = 'white';
    }
    let possibleMoves = [];
    // castle blanc
    // droite
    if (color == 'white' && !wKMoved && !wRRightMoved && boardType[startPos + 1] == '' && boardType[startPos + 2] == '' && boardType[startPos + 3] == wRRight) {
        possibleMoves.push(startPos + 2);
    }
    // gauche
    if (color == 'white' && !wKMoved && !wRLeftMoved && boardType[startPos - 1] == '' && boardType[startPos - 2] == ''  && boardType[startPos - 3] == '' && boardType[startPos - 4] == wRLeft) {
        possibleMoves.push(startPos - 2);
    }
    // castle noir
    // droite
    if (color == 'black' && !bKMoved && !bRRightMoved && boardType[startPos + 1] == '' && boardType[startPos + 2] == '' && boardType[startPos + 3] == bRRight) {
        possibleMoves.push(startPos + 2);
    }
    // gauche
    if (color == 'black' && !bKMoved && !bRLeftMoved && boardType[startPos - 1] == '' && boardType[startPos - 2] == ''  && boardType[startPos - 3] == '' && boardType[startPos - 4] == bRLeft) {
        possibleMoves.push(startPos - 2);
    }
    // calcule de la case du bas
    if (startPos / 8 < 7) {
        if (boardType[startPos + 8] != '') {
            if (boardType[startPos + 8][1] == oppositeColor) {
                possibleMoves.push(startPos + 8);
            }
        } else {
            possibleMoves.push(startPos + 8);
        }
    }
    // calcule de la case du haut
    if (startPos / 8 >= 1) {
        if (boardType[startPos - 8] != '') {
            if (boardType[startPos - 8][1] == oppositeColor) {
                possibleMoves.push(startPos - 8);
            }
        } else {
            possibleMoves.push(startPos - 8);
        }
    }
    // calcule de la case de droite
    if (startPos% 8 < 7) {
        if (boardType[startPos + 1] != '') {
            if (boardType[startPos + 1][1] == oppositeColor) {
                possibleMoves.push(startPos + 1);
            }
        } else {
            possibleMoves.push(startPos + 1);
        }
    }
    // calcule de la case de gauche
    if (startPos% 8 > 0) {
        if (boardType[startPos - 1] != '') {
            if (boardType[startPos - 1][1] == oppositeColor) {
                possibleMoves.push(startPos - 1);
            }
        } else {  
            possibleMoves.push(startPos - 1);
        }
    }
    // calcule de la case en haut a droite
    if (startPos% 8 < 7 && startPos/ 8 >= 1) {
        if (boardType[startPos - 7] != '') {
            if (boardType[startPos - 7][1] == oppositeColor) {
                possibleMoves.push(startPos - 7);
            }
        } else {
            possibleMoves.push(startPos - 7);
        }
    }
    // calcule de la case en haut a gauche
    if (startPos% 8 > 0 && startPos/ 8 >= 1) {
        if (boardType[startPos - 9] != '') {
            if (boardType[startPos - 9][1] == oppositeColor) {
                possibleMoves.push(startPos - 9);
            }
        } else {
            possibleMoves.push(startPos - 9);
        }
    }
    // calcule de la case en bas a droite
    if (startPos% 8 < 7 && startPos/ 8 < 7) {
        if (boardType[startPos + 9] != '') {
            if (boardType[startPos + 9][1] == oppositeColor) {
                possibleMoves.push(startPos + 9);
            }
        } else {
            possibleMoves.push(startPos + 9);
        }
    }
    // calcule de la case en bas a gauche
    if (startPos% 8 > 0 && startPos/ 8 < 7) {
        if (boardType[startPos + 7] != '') {
            if (boardType[startPos + 7][1] == oppositeColor) {
                possibleMoves.push(startPos + 7);
            }
        } else {
            possibleMoves.push(startPos + 7);
        }
    }
    return possibleMoves;
}

////////////////////////////////////////////////////////////////////////
//////////////                                          ////////////////
//////////////     FONCTIONS VERIFICATION DES COUPS     ////////////////
//////////////                                          ////////////////
////////////////////////////////////////////////////////////////////////

function isMoveLegal(startPos, endPos) {
    // copier le tableau       
    let boardCopy = [...board];
    //console.log(boardCopy);
    // recupere le type de piece
    const piece = boardCopy[startPos];
    const pieceColor = piece[1];
    // fais le déplacement
    boardCopy[startPos] = '';
    boardCopy[endPos] = piece;
    if ( isCheck(pieceColor, boardCopy)) {
        return false;
    } else {
        return true;
    }  
}

////////////////////////////////////////////////////////////////////////
//////////////                                          ////////////////
//////////////       FONCTIONS CHECK ET CHECKMATE       ////////////////
//////////////                                          ////////////////
////////////////////////////////////////////////////////////////////////

function isCheck(color, boardType) {
    let oppositeColor = '';
    if (color == 'white') {
        oppositeColor = 'black';
    } else {
        oppositeColor = 'white';
    }
    let ennemyAccessiblePos = [];
    let kingPos = 0;
    // parcours le board copy
    for ( let i = 0; i < boardType.length; i++) {
        if ( boardType[i] != '') {
            if ( boardType[i][1] == oppositeColor) {
                if (boardType[i][0] == 'pawn') {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(pawnMoves(i, oppositeColor, boardType));
                }
                if (boardType[i][0] == 'bishop') {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(bishopMoves(i, oppositeColor, boardType));
                }
                if (boardType[i][0].includes('rook')) {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(rookMoves(i, oppositeColor, boardType));
                }
                if (boardType[i][0] == 'knight') {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(knightMoves(i, oppositeColor, boardType));
                }
                if (boardType[i][0] == 'queen') {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(rookMoves(i, oppositeColor, boardType));
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(bishopMoves(i, oppositeColor, boardType));
                }
                if (boardType[i][0] == 'king') {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(kingMoves(i, oppositeColor, boardType));
                }
            }
            if (boardType[i][1] == color ) {
                if (boardType[i][0] == 'king') {
                    kingPos = i;
                }
            }
        }
    }
    if ( ennemyAccessiblePos.includes(kingPos)) {
        return true;
    } else {
        return false;
    }
}

function isCheckMate(color, boardType) {
    let colorAccessiblePos = [];
    // parcours le board copy
    for ( let i = 0; i < boardType.length; i++) {
        if ( boardType[i] != '') {
            if ( boardType[i][1] == color) {
                if (boardType[i][0] == 'pawn') {
                    let pawnPossibleMoves = pawnMoves(i, color, boardType);
                    for (let j = 0; j < pawnPossibleMoves.length; j++) {
                        if( isMoveLegal(i,pawnPossibleMoves[j])) {
                            colorAccessiblePos.push(pawnPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i][0] == 'bishop') {
                    let bishopPossibleMoves = bishopMoves(i, color, boardType);
                    for (let j = 0; j < bishopPossibleMoves.length; j++) {
                        if( isMoveLegal(i,bishopPossibleMoves[j])) {
                            colorAccessiblePos.push(bishopPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i][0].includes('rook')) {
                    let rookPossibleMoves = rookMoves(i, color, boardType);
                    for (let j = 0; j < rookPossibleMoves.length; j++) {
                        if( isMoveLegal(i,rookPossibleMoves[j])) {
                            colorAccessiblePos.push(rookPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i][0] == 'knight') {
                    let knightPossibleMoves = knightMoves(i, color, boardType);
                    for (let j = 0; j < knightPossibleMoves.length; j++) {
                        if( isMoveLegal(i,knightPossibleMoves[j])) {
                            colorAccessiblePos.push(knightPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i][0] == 'queen') {
                    let queenPossibleMoves = rookMoves(i, color, boardType);
                    queenPossibleMoves = queenPossibleMoves.concat(bishopMoves(i, color, boardType));
                    for (let j = 0; j < queenPossibleMoves.length; j++) {
                        if( isMoveLegal(i,queenPossibleMoves[j])) {
                            colorAccessiblePos.push(queenPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i][0] == 'king') {
                    let kingPossibleMoves = kingMoves(i, color, boardType);
                    kingPossibleMoves = kingPossibleMoves.concat(kingMoves(i, color, boardType));
                    for (let j = 0; j < kingPossibleMoves.length; j++) {
                        if( isMoveLegal(i,kingPossibleMoves[j])) {
                            colorAccessiblePos.push(kingPossibleMoves[j]);
                        }
                    }
                }
            }
        }
    }
    // console.log(colorAccessiblePos);
    if ( colorAccessiblePos.length == 0) {
        return true;
    } else {
        return false;
    }
}

/* A FAIRE

- AFFICHAGE DES PIECES MORTES 
- HISTORIQUES DES COUPS
- SAVE LES BOARD COPY POUR HISTORIQUE TU CONNAIS A VOIR
- EN PASSANT
- EGALITE
- TRANSFORMATION DE PION

- EN TERME DE CODE : 
    - fonction qui update les touches mortes et calcule la diff de points + ajoute un coup dans lhistorique
    - tranformation de pion
    - en passant
    - voir toutes les egalites
    - voir si d'autre trucs a faire
    - fix roc si case +1 est menacée et si sous echec pas possible



pour echec :

quand le joueur joue vérifier si cela le met en échec 
si oui annuler le coup
sinon vérifier si cela met le joueur ennemi en échec 
si oui vérifier si cela le met en échec et maths, 
si échec et maths gameOver;
sinon jouer le coup et mettre le joueur ennemi en échec; 
sinon jouer le coup;

pour echec et maths :

quand le joueur blanc joue et que cela met les noir en échec
pour chaque move possibles des noirs vérifier si il est toujours en échec
si oui échec et maths, gameOver;
sinon return false;

draw :

- stalemate : si le joueur n'est pas en échec mais n'a aucun coup jouable
- Perpetual check & three times repetition
- Theoretical draw (when there are not sufficient pieces on the board to checkmate)

*/