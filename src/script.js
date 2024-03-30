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
const kValue = 10000;
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
const wP = { 'type': p, 'color': white, 'value': pValue, 'img': wPImg, 'startedEP': false };
const wN = { 'type': n, 'color': white, 'value': nValue, 'img': wNImg };
const wR = { 'type': r, 'color': white, 'value': rValue, 'img': wRImg };
const wRLeft = { 'type': r + left, 'color': white, 'value': rValue, 'img': wRImg };
const wRRight = { 'type': r + right, 'color': white, 'value': rValue, 'img': wRImg };
const wB = { 'type': b, 'color': white, 'value': bValue, 'img': wBImg };
const wQ = { 'type': q, 'color': white, 'value': qValue, 'img': wQImg };
const wK = { 'type': k, 'color': white, 'value': kValue, 'img': wKImg };
// noires
const bP = { 'type': p, 'color': black, 'value': pValue, 'img': bPImg, 'startedEP': false };
const bN = { 'type': n, 'color': black, 'value': nValue, 'img': bNImg };
const bR = { 'type': r, 'color': black, 'value': rValue, 'img': bRImg };
const bRLeft = { 'type': r + left, 'color': black, 'value': rValue, 'img': bRImg };
const bRRight = { 'type': r + right, 'color': black, 'value': rValue, 'img': bRImg };
const bB = { 'type': b, 'color': black, 'value': bValue, 'img': bBImg };
const bQ = { 'type': q, 'color': black, 'value': qValue, 'img': bQImg };
const bK = { 'type': k, 'color': black, 'value': kValue, 'img': bKImg };
// le board
const defaultBoard = [
    { ...bRLeft }, { ...bN }, { ...bB }, { ...bQ }, { ...bK }, { ...bB }, { ...bN }, { ...bRRight },
    { ...bP }, { ...bP }, { ...bP }, { ...bP }, { ...bP }, { ...bP }, { ...bP }, { ...bP },
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    { ...wP }, { ...wP }, { ...wP }, { ...wP }, { ...wP }, { ...wP }, { ...wP }, { ...wP },
    { ...wRLeft }, { ...wN }, { ...wB }, { ...wQ }, { ...wK }, { ...wB }, { ...wN }, { ...wRRight },
];
var board = [...defaultBoard];
/*
// test echec et maths
var defaultBoard = [
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
var defaultBoard = [
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
const whiteDeadPieces = [];
const blackDeadPieces = [];
// si game fini
let gameOver = false;
// historique des coups joués
const history = [];
const boardHistory = [];
// var pour castle
let wCastleRight = true;
let wCastleLeft = true;
let bCastleRight = true;
let bCastleLeft = true;
// var pour 50 moves rules
let countTo50 = 0;
// var pour enlever les cases en surbrillance 
let accessiblePos = [];

createBoard(board);

function createBoard(boardType) {
    const boardDiv = document.getElementById('board');
    const aToH = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let n = 0;
    for (let i = 8; i > -2; i--) { 
        for (let j = 0; j < 10; j++) {
            const div = document.createElement('div');
            if (i == -1 || i == 8) {
                if ( j != 0 && j != 9) {
                div.textContent = aToH[j-1];
                div.classList.add('horizontal');
                } else {
                    div.classList.add('vertical-horizontal');
                }
            } else {
                if (j == 0 || j == 9) {
                    div.textContent = i+1;
                    div.classList.add('vertical');
                } else {
                    div.setAttribute('id', n);
                    div.addEventListener('drop', drop);
                    div.addEventListener('dragover', dragOver);
                    if (boardType[n] != '') {
                        const divPiece = document.createElement('div');
                        const img = document.createElement('img');
                        divPiece.setAttribute('draggable', true);
                        divPiece.addEventListener('dragstart', dragStart);
                        divPiece.addEventListener('dragend', dragEnd);
                        divPiece.addEventListener('dragover', dragOver);
                        divPiece.classList.add(boardType[n]['type'], boardType[n]['color'], 'piece');
                        img.src = boardType[n]['img'];
                        img.classList.add('piece-img');
                        divPiece.appendChild(img);
                        div.appendChild(divPiece);
                    }
                    if ((j + i) % 2 == 0) {
                        div.classList.add('beige');
                    } else {
                        div.classList.add('green');
                    }
                    n++;
                }
            }
            boardDiv.appendChild(div);
        }
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
        if ( boardType[i]['type'] == 'pawn'){
            boardType[i]['startedEP'] = false;
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

function updateBoardInfo(whiteGrave, blackGrave) {
    let whiteCount = 0;
    let blackCount = 0;
    const elements = [
        'black-pawn-icon', 'black-bishop-icon', 'black-queen-icon', 'black-rook-icon', 'black-knight-icon',
        'white-pawn-icon', 'white-bishop-icon', 'white-queen-icon', 'white-rook-icon', 'white-knight-icon'
    ];
    for ( let i = 0; i < elements.length; i++) {
        const div = document.getElementById(elements[i]);
        div.textContent = '';
    }
    for ( let i = 0; i < whiteGrave.length; i++) {
        const img = document.createElement('img');
        let type = whiteGrave[i]['type'];
        (type.includes('pawn')) ? type = 'pawn' : null;
        (type.includes('knight')) ? type = 'knight' : null;
        (type.includes('bishop')) ? type = 'bishop' : null;
        (type.includes('rook')) ? type = 'rook' : null;
        (type.includes('queen')) ? type = 'queen' : null;
        // meme chose avec transforme type pawn si besoin
        img.src = whiteGrave[i]['img'];
        img.classList.add('hud-img');
        const div = document.getElementById('white-' + type + '-icon')
        div.appendChild(img);
        blackCount+= whiteGrave[i]['value'];
    }
    for ( let i = 0; i < blackGrave.length; i++) {
        const img = document.createElement('img');
        let type = blackGrave[i]['type'];
        (type.includes('pawn')) ? type = 'pawn' : null;
        (type.includes('knight')) ? type = 'knight' : null;
        (type.includes('bishop')) ? type = 'bishop' : null;
        (type.includes('rook')) ? type = 'rook' : null;
        (type.includes('queen')) ? type = 'queen' : null;
        img.src = blackGrave[i]['img'];
        img.classList.add('hud-img');
        const div = document.getElementById('black-' + type + '-icon')
        div.appendChild(img);
        whiteCount+= blackGrave[i]['value'];
    }
    const blackPlus = document.getElementById('black-plus').querySelector('span');
    blackPlus.textContent = '';
    const whitePlus = document.getElementById('white-plus').querySelector('span');
    whitePlus.textContent = '';
    if ( whiteCount - blackCount != 0) {
        if ( whiteCount > blackCount) {
            whitePlus.textContent = '+ ' + (whiteCount - blackCount);
        } else {
            blackPlus.textContent = '+ ' + (blackCount - whiteCount);
        }
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
}

function dragStart(event) {
    if (!gameOver) {
        const pieceStartPosition = event.srcElement.parentNode.parentNode.id;
        const pieceType = event.srcElement.parentNode.classList[0];
        const pieceColor = event.srcElement.parentNode.classList[1];
        let possibleMoves = [];
        let legalMoves = [];
        if (pieceType.includes('pawn')) {
            possibleMoves = possibleMoves.concat(pawnMoves(pieceStartPosition, pieceColor, board));
        }
        if (pieceType.includes('knight')) {
            possibleMoves = possibleMoves.concat(knightMoves(pieceStartPosition, pieceColor, board));
        }
        if (pieceType.includes('bishop')) {
            possibleMoves = possibleMoves.concat(bishopMoves(pieceStartPosition, pieceColor, board));
        }
        if (pieceType.includes('rook')) {
            possibleMoves = possibleMoves.concat(rookMoves(pieceStartPosition, pieceColor, board));
        }
        if (pieceType.includes('queen')) {
            possibleMoves = possibleMoves.concat(bishopMoves(pieceStartPosition, pieceColor, board), rookMoves(pieceStartPosition, pieceColor, board) );
        }
        if (pieceType.includes('king')) {
            possibleMoves = possibleMoves.concat(kingMoves(pieceStartPosition, pieceColor, board));
        }
        for (let i = 0; i < possibleMoves.length; i++) {
            if (isMoveLegal(pieceStartPosition, possibleMoves[i], board)) {
                legalMoves.push(possibleMoves[i]);
                const element = document.getElementById(possibleMoves[i]);
                element.classList.add('accessible');
            }
        }
        accessiblePos = legalMoves;
        event.dataTransfer.setData("legalMoves", JSON.stringify(legalMoves));
        event.dataTransfer.setData("startPosition", pieceStartPosition);
    }
}

function drop(event) {
    event.stopPropagation();
    if (!gameOver) {
        let selectedTile = event.target;
        if (selectedTile.nodeName.toUpperCase() === 'IMG') {
            selectedTile = selectedTile.parentNode.parentNode;
        }
        if (selectedTile.nodeName.toUpperCase() === 'P') {
            selectedTile = selectedTile.parentNode;
        }
        const startPosition = event.dataTransfer.getData("startPosition");
        const retrievedArray = event.dataTransfer.getData("legalMoves");
        const legalMoves = JSON.parse(retrievedArray);
        const posEnd = parseInt(selectedTile.id);
        const color = board[startPosition]['color'];
        const oppositeColor = getOppositeColor(color);
        if (turn == color && !gameOver) {
            for (let i = 0; i < legalMoves.length; i++) {
                if (legalMoves[i] == posEnd) {
                    movePiece(board, posEnd, startPosition);
                    updateBoardInfo(whiteDeadPieces, blackDeadPieces);
                    if (isCheck(oppositeColor, board)) {
                        if (isCheckMate(oppositeColor, board)) {
                            gameOver = true;
                            console.log('echec et maths');
                        } else {
                            if ( countTo50 == 50) {
                                gameOver = true;
                                console.log('50 moves rule')
                            } else {
                                console.log('echec');
                            }
                        }
                    } else {
                        if (isCheckMate(oppositeColor, board)) {
                            console.log('stalemate');
                            gameOver = true;
                        }
                        if ( countTo50 == 50) {
                            gameOver = true;
                            console.log('50 moves rule')
                        }
                        // ajouter if ici pour autre egalité
                    }
                    turn = getOppositeColor(turn);
                    break;
                }
            }
        }
    }
}

function movePiece(boardType, endPos, startPos) {
    // piece qui bouge
    const endingPos = parseInt(endPos);
    const startingPos = parseInt(startPos);
    const piece = boardType[startingPos];
    // 50 move rule
    if ( piece['type'].includes('pawn') && boardType[endingPos] != '') {
        countTo50 = 0;
    } else {
        countTo50++;
    }
    // si roi ou tour bouge, modifie a true
    (piece['type'].includes('king') && piece['color'] === 'white') ? (wCastleLeft = false, wCastleRight = false) : null;
    (piece['type'] === 'rook-right' && piece['color'] === 'white') ? (wCastleRight = false) : null;
    (piece['type'] === 'rook-left' && piece['color'] === 'white') ? (wCastleLeft = false) : null;
    (piece['type'].includes('king') && piece['color'] === 'black') ? (bCastleLeft = false, bCastleRight = false) : null;
    (piece['type'] === 'rook-right' && piece['color'] === 'black') ? (bCastleRight = false) : null;
    (piece['type'] === 'rook-left' && piece['color'] === 'black') ? (bCastleLeft = false) : null;
    // si castle, bouge la tour
    if (piece['type'].includes('king') && endingPos == startingPos + 2) {
        const rook = boardType[startingPos + 3];
        boardType[startingPos + 3] = '';
        boardType[startingPos + 1] = rook;
        const rookMoving = document.getElementById(startingPos + 3).firstChild;
        const rookEnd = document.getElementById(startingPos + 1);
        rookEnd.appendChild(rookMoving);
    }
    if (piece['type'].includes('king') && endingPos == startingPos - 2) {
        const rook = boardType[startingPos - 4];
        boardType[startingPos - 4] = '';
        boardType[startingPos - 1] = rook;
        const rookMoving = document.getElementById(startingPos - 4).firstChild;
        const rookEnd = document.getElementById(startingPos - 1);
        rookEnd.appendChild(rookMoving);
    }
    // ajoute les pieces mortes dans les tableaux
    if (boardType[endingPos] != '') {
        if (boardType[endingPos]['color'] == 'white') {
            whiteDeadPieces.push(boardType[endingPos]);
        } else {
            blackDeadPieces.push(boardType[endingPos]);
        }
    } 
    // supprime la piece
    boardType[startingPos] = '';
    boardType[endingPos] = piece;
    console.log(boardType);
    // modifier le board affiché
    const pieceMoving = document.getElementById(startingPos);
    const tileSelected = document.getElementById(endingPos);
    // A MODIFIER ICI
    if ( tileSelected.firstChild) {
        tileSelected.removeChild(tileSelected.firstChild);
    }
    tileSelected.appendChild(pieceMoving.firstChild);

    // PROMOTION DE PION // A MODIFIER AVEC UN POPUP ET TRANSFORMER EN FONCTION DU POP UP // en attendant la selection empecher les mouvements 
    if ( piece['type'].includes('pawn') && piece['color'] == 'white' && endingPos >= 0 && endingPos < 8) {
        boardType[endingPos] = {...wQ};
        tileSelected.firstChild.className = "";
        tileSelected.firstChild.classList.add('transformed-queen', 'white', 'piece');
        tileSelected.firstChild.firstChild.src = wQImg;
    }
    if ( piece['type'].includes('pawn') && piece['color'] == 'black' && endingPos <= 63 && endingPos > 55) {
        boardType[endingPos] = {...bQ};
        tileSelected.firstChild.className = "";
        tileSelected.firstChild.classList.add('transformed-queen', 'black', 'piece');
        tileSelected.firstChild.firstChild.src = bQImg;
    }
    // EN PASSANT
    // si en passant supprime la piece started en passant
    const started = getStartedEP(boardType);
    if (piece['type'].includes('pawn') && piece['color'] == 'white' && endingPos == started - 8) {
        blackDeadPieces.push(boardType[started]); 
        console.log(blackDeadPieces);
        boardType[started] = '';
        const deadStartedEP = document.getElementById(started);
        if (deadStartedEP.firstChild) {
            // ajouter un update des info black ou white
            deadStartedEP.removeChild(deadStartedEP.firstChild);
        }
    }
    if (piece['type'].includes('pawn') && piece['color'] == 'black' && endingPos == started + 8) {
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
    if (piece['type'].includes('pawn') && piece['color'] == 'black' && endingPos == startingPos + 16) {
        boardType[endingPos]['startedEP'] = true;
    }
    if (piece['type'].includes('pawn') && piece['color'] == 'white' && endingPos == startingPos - 16) {
        boardType[endingPos]['startedEP'] = true;
    }
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

function isMoveLegal(startPos, endPos, boardType) {
    // copier le tableau
    const startingPos = parseInt(startPos); 
    const endingPos = parseInt(endPos); 
    const boardCopy = [...boardType];
    // recupere le type de piece
    const piece = boardCopy[startingPos];
    const pieceColor = piece['color'];
    // SI CASTLE
    if ( piece['type'].includes('king') && endingPos == startingPos - 2) {
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
    if ( piece['type'].includes('king') && endingPos == startingPos + 2) {
        if ( isCheck(pieceColor, boardCopy)) {
            return false;
        } else {
            boardCopy[startingPos] = '';
            boardCopy[startingPos + 1] = piece;
            if ( isCheck(pieceColor, boardCopy)) {
                return false;
            } else {
                boardCopy[startingPos + 1] = '';
                boardCopy[startingPos + 2] = piece;
                const rook = boardCopy[startingPos + 3];
                boardCopy[startingPos + 3] = '';
                boardCopy[startingPos + 1] = rook;
                if ( isCheck(pieceColor, boardCopy)) {
                    return false;
                } else {
                    return true;
                }
            }  
        }
    }
    // SI EN PASSANT 
    if ( piece['type'].includes('pawn') && piece['color'] == 'white' && endingPos == startingPos - 9 && boardCopy[endingPos] == '') {
        boardCopy[endingPos + 8] = '';
    }
    if ( piece['type'].includes('pawn') && piece['color'] == 'white' && endingPos == startingPos - 7 && boardCopy[endingPos] == '') {
        boardCopy[endingPos + 8] = '';
    }
    if ( piece['type'].includes('pawn') && piece['color'] == 'white' && endingPos == startingPos + 9 && boardCopy[endingPos] == '') {
        boardCopy[endingPos - 8] = '';
    }
    if ( piece['type'].includes('pawn') && piece['color'] == 'white' && endingPos == startingPos + 7 && boardCopy[endingPos] == '') {
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
                if (boardType[i]['type'].includes('pawn')) {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(pawnMoves(i, oppositeColor, boardType));
                }
                if (boardType[i]['type'].includes('bishop')) {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(bishopMoves(i, oppositeColor, boardType));
                }
                if (boardType[i]['type'].includes('rook')) {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(rookMoves(i, oppositeColor, boardType));
                }
                if (boardType[i]['type'].includes('knight')) {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(knightMoves(i, oppositeColor, boardType));
                }
                if (boardType[i]['type'].includes('queen')) {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(rookMoves(i, oppositeColor, boardType));
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(bishopMoves(i, oppositeColor, boardType));
                }
                if (boardType[i]['type'].includes('king')) {
                    ennemyAccessiblePos = ennemyAccessiblePos.concat(kingMoves(i, oppositeColor, boardType));
                }
            }
            if (boardType[i]['color'] == color) {
                if (boardType[i]['type'].includes('king')) {
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
                if (boardType[i]['type'].includes('pawn')) {
                    const pawnPossibleMoves = pawnMoves(i, color, boardType);
                    for (let j = 0; j < pawnPossibleMoves.length; j++) {
                        if (isMoveLegal(i, pawnPossibleMoves[j], boardType)) {
                            colorAccessiblePos.push(pawnPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i]['type'].includes('bishop')) {
                    const bishopPossibleMoves = bishopMoves(i, color, boardType);
                    for (let j = 0; j < bishopPossibleMoves.length; j++) {
                        if (isMoveLegal(i, bishopPossibleMoves[j], boardType)) {
                            colorAccessiblePos.push(bishopPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i]['type'].includes('rook')) {
                    const rookPossibleMoves = rookMoves(i, color, boardType);
                    for (let j = 0; j < rookPossibleMoves.length; j++) {
                        if (isMoveLegal(i, rookPossibleMoves[j], boardType)) {
                            colorAccessiblePos.push(rookPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i]['type'].includes('knight')) {
                    const knightPossibleMoves = knightMoves(i, color, boardType);
                    for (let j = 0; j < knightPossibleMoves.length; j++) {
                        if (isMoveLegal(i, knightPossibleMoves[j], boardType)) {
                            colorAccessiblePos.push(knightPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i]['type'].includes('queen')) {
                    let queenPossibleMoves = rookMoves(i, color, boardType).concat(bishopMoves(i, color, boardType));
                    for (let j = 0; j < queenPossibleMoves.length; j++) {
                        if (isMoveLegal(i, queenPossibleMoves[j], boardType)) {
                            colorAccessiblePos.push(queenPossibleMoves[j]);
                        }
                    }
                }
                if (boardType[i]['type'].includes('king')) {
                    const kingPossibleMoves = kingMoves(i, color, boardType);
                    for (let j = 0; j < kingPossibleMoves.length; j++) {
                        if (isMoveLegal(i, kingPossibleMoves[j], boardType)) {
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

- historique : 
    - affichage des coups
    - lien sur l'autre les anciens board // dur
- egalite : 
    - Dead Position // dur
    - Mutual Agreement
    - Threefold Repetition // peut etre dur
- systeme de gameOver :
    - affichage de fin
- promotion : 
    - pop up qui permet de choisir en quoi se transformer

EGALITE :
- Stalemate / fait
- Dead Position / a faire
- Mutual Agreement / a faire - facile
- Threefold Repetition / a faire
- 50-Move Rule / fait
*/