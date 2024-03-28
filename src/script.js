// variables nécessaires
// équipes
const white = 'white';
const black = 'black';
// Les types des pieces
const left = '-left';
const right = '-right';
const p = 'pawn';
const n = 'knight';
const b = 'bishop';
const r = 'rook';
const q = 'queen';
const k = 'king';
// Les valeurs des pieces
const pValue = 1;
const nValue = 3;
const bValue = 3;
const rValue = 5;
const qValue = 9;
const kValue = 1000;
// les img des pieces
const wPImg = 'img/pawn_white.png';
const wRImg = 'img/rook_white.png';
const wQImg = 'img/queen_white.png';
const wKImg = 'img/king_white.png';
const wBImg = 'img/bishop_white.png';
const wNImg = 'img/knight_white.png';
const bPImg = 'img/pawn_black.png';
const bRImg = 'img/rook_black.png';
const bQImg = 'img/queen_black.png';
const bKImg = 'img/king_black.png';
const bBImg = 'img/bishop_black.png';
const bNImg = 'img/knight_black.png';
// Les pieces
// blanches
var wP = { 'type': p, 'color': white, 'value': pValue, 'img': wPImg, 'startedEP': false };
var wN = { 'type': n, 'color': white, 'value': nValue, 'img': wNImg };
var wR = { 'type': r, 'color': white, 'value': rValue, 'img': wRImg };
var wRLeft = { 'type': r + left, 'color': white, 'value': rValue, 'img': wRImg };
var wRRight = { 'type': r + right, 'color': white, 'value': rValue, 'img': wRImg };
var wB = { 'type': b, 'color': white, 'value': bValue, 'img': wBImg };
var wQ = { 'type': q, 'color': white, 'value': qValue, 'img': wQImg };
var wK = { 'type': k, 'color': white, 'value': kValue, 'img': wKImg };
// noires
var bP = { 'type': p, 'color': black, 'value': pValue, 'img': bPImg, 'startedEP': false };
var bN = { 'type': n, 'color': black, 'value': nValue, 'img': bNImg };
var bR = { 'type': r, 'color': black, 'value': rValue, 'img': bRImg };
var bRLeft = { 'type': r + left, 'color': black, 'value': rValue, 'img': bRImg };
var bRRight = { 'type': r + right, 'color': black, 'value': rValue, 'img': bRImg };
var bB = { 'type': b, 'color': black, 'value': bValue, 'img': bBImg };
var bQ = { 'type': q, 'color': black, 'value': qValue, 'img': bQImg };
var bK = { 'type': k, 'color': black, 'value': kValue, 'img': bKImg };
// le board
var board = [
    { ...bRLeft }, { ...bN }, { ...bB }, { ...bQ }, { ...bK }, { ...bB }, { ...bN }, { ...bRRight },
    { ...bP }, { ...bP }, { ...bP }, { ...bP }, { ...bP }, { ...bP }, { ...bP }, { ...bP },
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    { ...wP }, { ...wP }, { ...wP }, { ...wP }, { ...wP }, { ...wP }, { ...wP }, { ...wP },
    { ...wRLeft }, { ...wN }, { ...wB }, { ...wQ }, { ...wK }, { ...wB }, { ...wN }, { ...wRRight },
];
/*
// test echec et maths
var board = [
    { ...bRLeft }, '', '', '', '', { ...bRRight }, { ...bK }, '',
    { ...bP }, { ...bP }, { ...bP }, '', '', { ...bP }, '', { ...bP },
    '', '', '', '', '', { ...wB }, { ...bP }, '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', { ...wN }, '',
    '', { ...wP }, '', '', '', '', '', '',
    { ...wP }, '', '', '', '', { ...wP }, { ...wP }, { ...wP },
    '', '', '', '', '', { ...wRRight }, { ...wK }, '',
];
// test draw
var board = [
    { ...bK}, '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', { ...wQ}, '', { ...wK}, '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
];
*/
// le tour actuel
var turn = 'white';
// Les pieces mortes
var whiteDeadPieces = [];
var blackDeadPieces = [];
// si game fini
var gameOver = false;
// historique des coups joués
var history = [];
var boardHistory = [];
// var pour castle
var wCastleRight = true;
var wCastleLeft = true;
var bCastleRight = true;
var bCastleLeft = true;
// var pour accessible pos // sinon bug // pour affichage
var accessiblePos = [];
var movingPiece;

createBoard(board);
addPiecesToBoard(board);

function createBoard(boardType) {
    const boardDiv = document.getElementById('board');
    let n = 0;
    for (let i = 0; i < boardType.length; i++) {
        const div = document.createElement('div');
        div.setAttribute('id', i);
        div.addEventListener('drop', drop);
        div.addEventListener('dragover', dragOver);
        if (i % 8 == 0 && i != 0) {
            n++;
        }
        if (n % 2 == 0) {
            if (i % 2 == 0) {
                div.classList.add('beige');
            } else {
                div.classList.add('green');
            }
        } else {
            if (i % 2 == 0) {
                div.classList.add('green');
            } else {
                div.classList.add('beige');
            }
        }
        boardDiv.appendChild(div);
    }
}

function addPiecesToBoard(boardType) {
    for (let i = 0; i < boardType.length; i++) {
        if (boardType[i] != '') {
            const boardDiv = document.getElementById(i);
            const div = document.createElement('div');
            div.setAttribute('draggable', true);
            div.addEventListener('dragstart', dragStart);
            div.addEventListener('dragend', dragEnd);
            div.addEventListener('dragover', dragOver);
            const img = document.createElement('img');
            img.src = boardType[i]['img'];
            img.classList.add('piece-img')
            div.classList.add(boardType[i]['type'], boardType[i]['color'], 'piece');
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

function getStartedEP(boardType) {
    for (let i = 0; i < boardType.length; i++) {
        if (boardType[i]['startedEP'] == true) {
            return i;
        }
    }
    return false;
}

function resetEnPassant(boardType) {
    for (let i = 0; i < boardType.length; i++) {
        if (boardType[i]['type'] == 'pawn') {
            if (boardType[i]['startedEP'] == true) {
                boardType[i]['startedEP'] = false;
                return;
            } else {
                boardType[i]['startedEP'] = false;
            }
        }
    }
}

function getOppositeColor(color) {
    if (color == 'white') {
        return 'black';
    } else {
        return 'white';
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
    movingPiece = '';
}

function dragStart(event) {
    const pieceStartPosition = event.srcElement.parentNode.parentNode.id;
    const pieceType = event.srcElement.parentNode.classList[0];
    const pieceColor = event.srcElement.parentNode.classList[1];
    movingPiece = pieceStartPosition;
    let possibleMoves = [];
    console.log(pieceStartPosition);
    if (pieceType == 'pawn') {
        possibleMoves = possibleMoves.concat(pawnMoves(pieceStartPosition, pieceColor, board));
    }
    if (pieceType == 'knight') {
        possibleMoves = possibleMoves.concat(knightMoves(pieceStartPosition, pieceColor, board));
    }
    if (pieceType == 'bishop') {
        possibleMoves = possibleMoves.concat(bishopMoves(pieceStartPosition, pieceColor, board));
    }
    if (pieceType.includes('rook')) {
        possibleMoves = possibleMoves.concat(rookMoves(pieceStartPosition, pieceColor, board));
    }
    if (pieceType == 'queen') {
        possibleMoves = possibleMoves.concat(bishopMoves(pieceStartPosition, pieceColor, board));
        possibleMoves = possibleMoves.concat(rookMoves(pieceStartPosition, pieceColor, board));
    }
    if (pieceType == 'king') {
        possibleMoves = possibleMoves.concat(kingMoves(pieceStartPosition, pieceColor, board));
    }
    console.log(possibleMoves);
    let legalMoves = [];
    for (let i = 0; i < possibleMoves.length; i++) {
        if (isMoveLegal(pieceStartPosition, possibleMoves[i])) {
            legalMoves.push(possibleMoves[i]);
            const element = document.getElementById(possibleMoves[i]);
            element.classList.add('accessible');
        }
    }
    accessiblePos = legalMoves;
    console.log(legalMoves);
}

function drop(event) {
    let selectedTile = event.target;
    if (selectedTile.nodeName.toUpperCase() === 'IMG') {
        selectedTile = selectedTile.parentNode.parentNode;
    }
    const posEnd = parseInt(selectedTile.id);
    console.log(selectedTile.id);
    if (turn == board[movingPiece]['color']) {
        for (let i = 0; i < accessiblePos.length; i++) {
            if (accessiblePos[i] == posEnd) {
                movePiece(board, posEnd);
                swapTurn();
                if (isCheck(turn, board)) {
                    if (isCheckMate(turn, board)) {
                        console.log('echec et maths');
                    } else {
                        console.log('echec');
                    }
                } else {
                    if (isCheckMate(turn, board)) {
                        console.log('DRAW');
                    }
                    // ajouter if ici pour autre egalité
                }
                // console.log(board);
                break;
            }
        }
    }
}

function movePiece(boardType, endPos) {
    // piece qui bouge
    const endingPos = parseInt(endPos);
    const startingPos = parseInt(movingPiece);
    const piece = boardType[movingPiece];
    // si roi ou tour bouge, modifie a true
    if (piece['type'] == 'king' && piece['color'] == 'white') {
        wCastleLeft = false;
        wCastleRight = false;
    }
    if (piece['type'] == 'rook-right' && piece['color'] == 'white') {
        wCastleRight = false;
    }
    if (piece['type'] == 'rook-left' && piece['color'] == 'white') {
        wCastleLeft = false;
    }
    if (piece['type'] == 'king' && piece['color'] == 'black') {
        bCastleLeft = false;
        bCastleRight = false;
    }
    if (piece['type'] == 'rook-right' && piece['color'] == 'black') {
        bCastleRight = false;
    }
    if (piece['type'] == 'rook-left' && piece['color'] == 'black') {
        bCastleLeft = false;
    }
    // si castle, bouge la tour
    if (piece['type'] == 'king' && endingPos == startingPos + 2) {
        const rook = boardType[startingPos + 3];
        boardType[startingPos + 3] = '';
        boardType[startingPos + 1] = rook;
        const rookMoving = document.getElementById(startingPos + 3).firstChild;
        const rookEnd = document.getElementById(startingPos + 1);
        rookEnd.appendChild(rookMoving);
    }
    if (piece['type'] == 'king' && endingPos == startingPos - 2) {
        const rook = boardType[startingPos - 4];
        boardType[startingPos - 4] = '';
        boardType[startingPos - 1] = rook;
        const rookMoving = document.getElementById(startingPos - 4).firstChild;
        const rookEnd = document.getElementById(startingPos - 1);
        rookEnd.appendChild(rookMoving);
    }
    // EN PASSANT
    // si en passant supprime la piece started en passant
    const started = getStartedEP(boardType);
    if (piece['type'] == 'pawn' && piece['color'] == 'white' && endingPos == started - 8) {
        blackDeadPieces.push(boardType[started]); 
        console.log(blackDeadPieces);
        boardType[started] = '';
        const deadStartedEP = document.getElementById(started);
        if (deadStartedEP.firstChild) {
            // ajouter un update des info black ou white
            deadStartedEP.removeChild(deadStartedEP.firstChild);
        }
    }
    if (piece['type'] == 'pawn' && piece['color'] == 'black' && endingPos == started + 8) {
        whiteDeadPieces.push(boardType[started]); 
        console.log(whiteDeadPieces);
        boardType[started] = ''; 
        const deadStartedEP = document.getElementById(started);
        if (deadStartedEP.firstChild) {
            // ajouter un update des info black ou white
            deadStartedEP.removeChild(deadStartedEP.firstChild);
        }
    }
    // reset en passant ici
    resetEnPassant(boardType);
    // si en started en passant mets started en passant a true
    if (boardType[startingPos]['type'] == 'pawn' && boardType[startingPos]['color'] == 'black' && endingPos == startingPos + 16) {
        boardType[startingPos]['startedEP'] = true;
    }
    if (boardType[movingPiece]['type'] == 'pawn' && boardType[movingPiece]['color'] == 'white' && endingPos == startingPos - 16) {
        boardType[startingPos]['startedEP'] = true;
    }
    // ajoute les pieces mortes dans les tableaux
    if (boardType[endingPos] != '') {
        if (boardType[endingPos]['color'] == 'white') {
            whiteDeadPieces.push(boardType[endingPos]);
            console.log(whiteDeadPieces);
        } else {
            blackDeadPieces.push(boardType[endingPos]);
            console.log(blackDeadPieces);
            // createTurn();
        }
        // updateBoardTypeInfo();
    }
    // supprime la piece
    boardType[movingPiece] = '';
    boardType[endingPos] = piece;
    // modifier le board affiché
    const pieceMoving = document.getElementById(startingPos).firstChild;
    const tileSelected = document.getElementById(endingPos);
    if (tileSelected.firstChild) {
        // ajouter un update des info black ou white
        tileSelected.removeChild(tileSelected.firstChild);
    }
    tileSelected.appendChild(pieceMoving);
}

//////////////////////////////////////////////////////////////////////
//////////////                                        ////////////////
//////////////  FONCTIONS CALCUL DES MOVES DES PAWNS  ////////////////
//////////////                                        ////////////////
//////////////////////////////////////////////////////////////////////

function pawnMoves(startId, color, boardType) {
    const startPos = parseInt(startId);
    const possibleMoves = [];
    const oppositeColor = getOppositeColor(color);
    const moveDirection = color === 'white' ? -1 : 1;
    const startingRank = color === 'white' ? [6,7] : [1,2];
    const indexStartedEP = getStartedEP(boardType);
    // 2 case vers le haut ou bas
    if (startPos / 8 < startingRank[1] && startPos / 8 >= startingRank[0]) {
        if (boardType[startPos + 8 * moveDirection] == '' && boardType[startPos + 16 * moveDirection] == '') {
            possibleMoves.push(startPos + 16 * moveDirection);
        }
    }
    // 1 case vers le haut ou bas
    if (boardType[startPos + 8 * moveDirection] == '') {
        possibleMoves.push(startPos + 8 * moveDirection);
    }
    // EN PASSANT
    if (indexStartedEP == startPos - 1 && startPos % 8 > 0 && boardType[indexStartedEP]['color'] == oppositeColor || indexStartedEP == startPos + 1 && startPos % 8 < 7 && boardType[indexStartedEP]['color'] == oppositeColor ) {
        // ajouter le test ici
        possibleMoves.push(indexStartedEP + 8 * moveDirection);
    }
    if ( color == 'white') {
        // 1 case en diagonale droite blanc
        if (startPos % 8 < 7 && startPos / 8 >= 1) {
            if (boardType[startPos + 7 * moveDirection] != '' && boardType[startPos + 7 * moveDirection]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 7 * moveDirection);
            }
        }
        // 1 case en diagonale gauche blanc
        if (startPos % 8 > 0 && startPos / 8 >= 1) {
            if (boardType[startPos + 9 * moveDirection] != '' && boardType[startPos + 9 * moveDirection]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 9 * moveDirection);
            }
        }
    } else {
        // 1 case en diagonale droite noir
        if (startPos % 8 < 7 && startPos / 8 < 7) {
            if (boardType[startPos + 9 * moveDirection] != '' && boardType[startPos + 9 * moveDirection]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 9 * moveDirection);
            }
        }
        // 1 case en diagonale gauche noir
        if (startPos % 8 > 0 && startPos / 8 < 7) {
            if (boardType[startPos + 7 * moveDirection] != '' && boardType[startPos + 7 * moveDirection]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 7 * moveDirection);
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
    const oppositeColor = getOppositeColor(color);
    const possibleMoves = [];
    // deplacement vers le haut
    if (startPos / 8 >= 1) {
        let count = 0;
        for (let i = startPos / 8; i >= 1; i--) {
            count++;
            if (boardType[startPos - 8 * count] != '') {
                if (boardType[startPos - 8 * count]['color'] == oppositeColor) {
                    possibleMoves.push(startPos - 8 * count);
                }
                break;
            } else {
                possibleMoves.push(startPos - 8 * count);
            }
        }
    }
    // deplacement vers le bas
    if (startPos / 8 < 7) {
        let count = 0;
        for (let i = startPos / 8; i < 7; i++) {
            count++;
            if (boardType[startPos + 8 * count] != '') {
                if (boardType[startPos + 8 * count]['color'] == oppositeColor) {
                    possibleMoves.push(startPos + 8 * count);
                }
                break;
            } else {
                possibleMoves.push(startPos + 8 * count);
            }
        }
    }
    // deplacement vers la droite
    if (startPos % 8 < 7) {
        let count = 0;
        for (let i = startPos % 8; i < 7; i++) {
            count++;
            if (boardType[startPos + 1 * count] != '') {
                if (boardType[startPos + 1 * count]['color'] == oppositeColor) {
                    possibleMoves.push(startPos + 1 * count);
                }
                break;
            } else {
                possibleMoves.push(startPos + 1 * count);
            }
        }
    }
    // deplacement vers la gauche
    if (startPos % 8 >= 1) {
        let count = 0;
        for (let i = startPos % 8; i > 0; i--) {
            count++;
            if (boardType[startPos - 1 * count] != '') {
                if (boardType[startPos - 1 * count]['color'] == oppositeColor) {
                    possibleMoves.push(startPos - 1 * count);
                }
                break;
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
    const oppositeColor = getOppositeColor(color);
    const possibleMoves = [];
    // deplacement en haut a gauche
    if (startPos / 8 >= 1 && startPos % 8 > 0) {
        let count = 0;
        for (let i = startPos % 8; i > 0; i--) {
            count++;
            if (startPos - 9 * count < 0) {
                break;
            }
            if (boardType[startPos - 9 * count] != '') {
                if (boardType[startPos - 9 * count]['color'] == oppositeColor) {
                    possibleMoves.push(startPos - 9 * count);
                }
                break;
            } else {
                possibleMoves.push(startPos - 9 * count);
            }
        }
    }
    // deplacement en haut a droite
    if (startPos / 8 >= 1 && startPos % 8 < 7) {
        let count = 0;
        for (let i = startPos % 8; i < 7; i++) {
            count++;
            if (startPos - 7 * count < 0) {
                break;
            }
            if (boardType[startPos - 7 * count] != '') {
                if (boardType[startPos - 7 * count]['color'] == oppositeColor) {
                    possibleMoves.push(startPos - 7 * count);
                }
                break;
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
                if (boardType[startPos + 9 * count]['color'] == oppositeColor) {
                    possibleMoves.push(startPos + 9 * count);
                }
                break;
            } else {
                possibleMoves.push(startPos + 9 * count);
            }
        }
    }
    // deplacement en bas a gauche
    if (startPos / 8 < 7 && startPos % 8 > 0) {
        let count = 0;
        for (let i = startPos % 8; i > 0; i--) {
            count++;
            if (startPos + 7 * count > 63) {
                break;
            }
            if (boardType[startPos + 7 * count] != '') {
                if (boardType[startPos + 7 * count]['color'] == oppositeColor) {
                    possibleMoves.push(startPos + 7 * count);       
                }
                break;
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
    const oppositeColor = getOppositeColor(color);
    const possibleMoves = [];
    // deplacement de 2 case vers le haut 1 case vers la droite
    if (startPos / 8 >= 2 && startPos % 8 < 7) {
        if (boardType[startPos - 15] != '') {
            if (boardType[startPos - 15]['color'] == oppositeColor) {
                possibleMoves.push(startPos - 15);
            }
        }
        else {
            possibleMoves.push(startPos - 15);
        }
    }
    // deplacement de 2 case vers le haut 1 case vers la gauche
    if (startPos / 8 >= 2 && startPos % 8 > 0) {
        if (boardType[startPos - 17] != '') {
            if (boardType[startPos - 17]['color'] == oppositeColor) {
                possibleMoves.push(startPos - 17);
            }
        }
        else {
            possibleMoves.push(startPos - 17);
        }
    }
    // deplacement de 2 case vers le bas 1 case vers la gauche
    if (startPos / 8 < 6 && startPos % 8 > 0) {
        if (boardType[startPos + 15] != '') {
            if (boardType[startPos + 15]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 15);
            }
        }
        else {
            possibleMoves.push(startPos + 15);
        }
    }
    // deplacement de 2 case vers le bas 1 case vers la droite
    if (startPos / 8 < 6 && startPos % 8 < 7) {
        if (boardType[startPos + 17] != '') {
            if (boardType[startPos + 17]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 17);
            }
        }
        else {
            possibleMoves.push(startPos + 17);
        }
    }
    // deplacement de 2 cases a droite 1 case vers le haut
    if (startPos / 8 >= 1 && startPos % 8 <= 5) {
        if (boardType[startPos - 6] != '') {
            if (boardType[startPos - 6]['color'] == oppositeColor) {
                possibleMoves.push(startPos - 6);
            }
        }
        else {
            possibleMoves.push(startPos - 6);
        }
    }
    // deplacement de 2 case vers la droite 1 case vers le bas
    if (startPos / 8 <= 7 && startPos % 8 <= 5) {
        if (boardType[startPos + 10] != '') {
            if (boardType[startPos + 10]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 10);
            }
        }
        else {
            possibleMoves.push(startPos + 10);
        }
    }
    // deplacement de 2 case vers la gauche 1 case vers le bas
    if (startPos / 8 <= 7 && startPos % 8 >= 2) {
        if (boardType[startPos + 6] != '') {
            if (boardType[startPos + 6]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 6);
            }
        }
        else {
            possibleMoves.push(startPos + 6);
        }
    }
    // deplacement de 2 case vers la gauche 1 case vers le haut
    if (startPos / 8 >= 1 && startPos % 8 >= 2) {
        if (boardType[startPos - 10] != '') {
            if (boardType[startPos - 10]['color'] == oppositeColor) {
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
    const oppositeColor = getOppositeColor(color);
    const possibleMoves = [];
    // castle blanc
    // droite
    if (color == 'white' && wCastleRight && boardType[startPos + 1] == '' && boardType[startPos + 2] == '' && boardType[startPos + 3]['type'] == 'rook-right' && boardType[startPos + 3]['color'] == 'white') {
        possibleMoves.push(startPos + 2);
    }
    // gauche
    if (color == 'white' && wCastleLeft && boardType[startPos - 1] == '' && boardType[startPos - 2] == '' && boardType[startPos - 3] == '' && boardType[startPos - 4]['type'] == 'rook-left' && boardType[startPos - 4]['color'] == 'white') {
        possibleMoves.push(startPos - 2);
    }
    // castle noir
    // droite
    if (color == 'black' && bCastleRight && boardType[startPos + 1] == '' && boardType[startPos + 2] == '' && boardType[startPos + 3]['type'] == 'rook-right' && boardType[startPos + 3]['color'] == 'black') {
        possibleMoves.push(startPos + 2);
    }
    // gauche
    if (color == 'black' && bCastleLeft && boardType[startPos - 1] == '' && boardType[startPos - 2] == '' && boardType[startPos - 3] == '' && boardType[startPos - 4]['type'] == 'rook-left' && boardType[startPos - 4]['color'] == 'black') {
        possibleMoves.push(startPos - 2);
    }
    // calcule de la case du bas
    if (startPos / 8 < 7) {
        if (boardType[startPos + 8] != '') {
            if (boardType[startPos + 8]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 8);
            }
        } else {
            possibleMoves.push(startPos + 8);
        }
    }
    // calcule de la case du haut
    if (startPos / 8 >= 1) {
        if (boardType[startPos - 8] != '') {
            if (boardType[startPos - 8]['color'] == oppositeColor) {
                possibleMoves.push(startPos - 8);
            }
        } else {
            possibleMoves.push(startPos - 8);
        }
    }
    // calcule de la case de droite
    if (startPos % 8 < 7) {
        if (boardType[startPos + 1] != '') {
            if (boardType[startPos + 1]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 1);
            }
        } else {
            possibleMoves.push(startPos + 1);
        }
    }
    // calcule de la case de gauche
    if (startPos % 8 > 0) {
        if (boardType[startPos - 1] != '') {
            if (boardType[startPos - 1]['color'] == oppositeColor) {
                possibleMoves.push(startPos - 1);
            }
        } else {
            possibleMoves.push(startPos - 1);
        }
    }
    // calcule de la case en haut a droite
    if (startPos % 8 < 7 && startPos / 8 >= 1) {
        if (boardType[startPos - 7] != '') {
            if (boardType[startPos - 7]['color'] == oppositeColor) {
                possibleMoves.push(startPos - 7);
            }
        } else {
            possibleMoves.push(startPos - 7);
        }
    }
    // calcule de la case en haut a gauche
    if (startPos % 8 > 0 && startPos / 8 >= 1) {
        if (boardType[startPos - 9] != '') {
            if (boardType[startPos - 9]['color'] == oppositeColor) {
                possibleMoves.push(startPos - 9);
            }
        } else {
            possibleMoves.push(startPos - 9);
        }
    }
    // calcule de la case en bas a droite
    if (startPos % 8 < 7 && startPos / 8 < 7) {
        if (boardType[startPos + 9] != '') {
            if (boardType[startPos + 9]['color'] == oppositeColor) {
                possibleMoves.push(startPos + 9);
            }
        } else {
            possibleMoves.push(startPos + 9);
        }
    }
    // calcule de la case en bas a gauche
    if (startPos % 8 > 0 && startPos / 8 < 7) {
        if (boardType[startPos + 7] != '') {
            if (boardType[startPos + 7]['color'] == oppositeColor) {
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
    const startingPos = parseInt(startPos); 
    const endingPos = parseInt(endPos); 
    let boardCopy = [...board];
    // recupere le type de piece
    const piece = boardCopy[startingPos];
    const pieceColor = piece['color'];
    // SI CASTLE
    if ( piece['type'] == 'king' && endingPos == startingPos - 2) {
        if ( isCheck(pieceColor, boardCopy)) {
            return false;
        } else {
            boardCopy[startingPos] = '';
            boardCopy[parstartingPos - 1] = piece;
            if ( isCheck(pieceColor, boardCopy)) {
                return false;
            } else {
                boardCopy[startingPos - 1] = '';
                boardCopy[startingPos - 2] = piece;
                const rook = boardCopy[startingPos - 4];
                boardCopy[startingPos - 4] = '';
                boardCopy[startingPos - 1] = rook;
                if ( isCheck(pieceColor, boardCopy)) {
                    return false;
                } else {
                    return true;
                }
            }  
        }
    }
    if ( piece['type'] == 'king' && endingPos == startingPos + 2) {
        if ( isCheck(pieceColor, boardCopy)) {
            console.log('premier check');
            return false;
        } else {
            console.log('premier check');
            boardCopy[startingPos] = '';
            boardCopy[startingPos + 1] = piece;
            if ( isCheck(pieceColor, boardCopy)) {
                console.log('deuxieme check');
                return false;
            } else {
                boardCopy[startingPos + 1] = '';
                boardCopy[startingPos + 2] = piece;
                const rook = boardCopy[startingPos + 3];
                boardCopy[startingPos + 3] = '';
                boardCopy[startingPos + 1] = rook;
                console.log('deuxieme check');
                if ( isCheck(pieceColor, boardCopy)) {
                    console.log('troisieme check');
                    return false;
                } else {
                    console.log('troisieme check');
                    return true;
                }
            }  
        }
    }
    // SI EN PASSANT 
    if ( piece['type'] == 'pawn' && piece['color'] == 'white' && endingPos == startingPos - 9 && boardCopy[endingPos] == '') {
        boardCopy[endingPos + 8] = '';
    }
    if ( piece['type'] == 'pawn' && piece['color'] == 'white' && endingPos == startingPos - 7 && boardCopy[endingPos] == '') {
        boardCopy[endingPos + 8] = '';
    }
    if ( piece['type'] == 'pawn' && piece['color'] == 'white' && endingPos == startingPos + 9 && boardCopy[endingPos] == '') {
        boardCopy[endingPos - 8] = '';
    }
    if ( piece['type'] == 'pawn' && piece['color'] == 'white' && endingPos == startingPos + 7 && boardCopy[endingPos] == '') {
        boardCopy[endingPos - 8] = '';
    }
    // fais le déplacement
    boardCopy[startingPos] = '';
    boardCopy[endingPos] = piece;
    if (isCheck(pieceColor, boardCopy)) {
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
    const oppositeColor = getOppositeColor(color);
    let ennemyAccessiblePos = [];
    let kingPos;
    // parcours le board copy
    for (let i = 0; i < boardType.length; i++) {
        if (boardType[i] != '') {
            if (boardType[i]['color'] == oppositeColor) {
                if (boardType[i]['type'] == 'pawn') {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(pawnMoves(i, oppositeColor, boardType));
                }
                if (boardType[i]['type'] == 'bishop') {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(bishopMoves(i, oppositeColor, boardType));
                }
                if (boardType[i]['type'].includes('rook')) {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(rookMoves(i, oppositeColor, boardType));
                }
                if (boardType[i]['type'] == 'knight') {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(knightMoves(i, oppositeColor, boardType));
                }
                if (boardType[i]['type'] == 'queen') {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(rookMoves(i, oppositeColor, boardType));
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(bishopMoves(i, oppositeColor, boardType));
                }
                if (boardType[i]['type'] == 'king') {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(kingMoves(i, oppositeColor, boardType));
                }
            }
            if (boardType[i]['color'] == color) {
                if (boardType[i]['type'] == 'king') {
                    kingPos = i;
                }
            }
        }
    }
    if (ennemyAccessiblePos.includes(kingPos)) {
        return true;
    } else {
        return false;
    }
}

function isCheckMate(color, boardType) {
    const colorAccessiblePos = [];
    // parcours le board copy
    for (let i = 0; i < boardType.length; i++) {
        if (boardType[i] != '') {
            if (boardType[i]['color'] == color) {
                if (boardType[i]['type'] == 'pawn') {
                    let pawnPossibleMoves = pawnMoves(i, color, boardType);
                    for (let j = 0; j < pawnPossibleMoves.length; j++) {
                        if (isMoveLegal(i, pawnPossibleMoves[j])) {
                            colorAccessiblePos.push(pawnPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i]['type'] == 'bishop') {
                    let bishopPossibleMoves = bishopMoves(i, color, boardType);
                    for (let j = 0; j < bishopPossibleMoves.length; j++) {
                        if (isMoveLegal(i, bishopPossibleMoves[j])) {
                            colorAccessiblePos.push(bishopPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i]['type'].includes('rook')) {
                    let rookPossibleMoves = rookMoves(i, color, boardType);
                    for (let j = 0; j < rookPossibleMoves.length; j++) {
                        if (isMoveLegal(i, rookPossibleMoves[j])) {
                            colorAccessiblePos.push(rookPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i]['type'] == 'knight') {
                    let knightPossibleMoves = knightMoves(i, color, boardType);
                    for (let j = 0; j < knightPossibleMoves.length; j++) {
                        if (isMoveLegal(i, knightPossibleMoves[j])) {
                            colorAccessiblePos.push(knightPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i]['type'] == 'queen') {
                    let queenPossibleMoves = rookMoves(i, color, boardType);
                    queenPossibleMoves = queenPossibleMoves.concat(bishopMoves(i, color, boardType));
                    for (let j = 0; j < queenPossibleMoves.length; j++) {
                        if (isMoveLegal(i, queenPossibleMoves[j])) {
                            colorAccessiblePos.push(queenPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i]['type'] == 'king') {
                    let kingPossibleMoves = kingMoves(i, color, boardType);
                    kingPossibleMoves = kingPossibleMoves.concat(kingMoves(i, color, boardType));
                    for (let j = 0; j < kingPossibleMoves.length; j++) {
                        if (isMoveLegal(i, kingPossibleMoves[j])) {
                            colorAccessiblePos.push(kingPossibleMoves[j]);
                        }
                    }
                }
            }
        }
    }
    // console.log(colorAccessiblePos);
    if (colorAccessiblePos.length == 0) {
        return true;
    } else {
        return false;
    }
}
/* A FAIRE

- AFFICHAGE DES PIECES MORTES 
- HISTORIQUES DES COUPS
- SAVE LES BOARD COPY POUR HISTORIQUE TU CONNAIS A VOIR
- EGALITE
- TRANSFORMATION DE PION

- EN TERME DE CODE : 
    - fonction qui update les touches mortes et calcule la diff de points + ajoute un coup dans lhistorique
    - tranformation de pion
    - voir toutes les egalites
    - voir si d'autre trucs a faire
    - fix roc si case +1 ou -1 est menacée et si sous echec pas possible
    - maybe mettre startedEP en var

EGALITE :
- Stalemate / fait
- Dead Position / a faire
- Mutual Agreement / a faire - facile
- Threefold Repetition / a faire
- 50-Move Rule / a faire
*/