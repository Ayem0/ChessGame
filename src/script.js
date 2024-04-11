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
/*
// test materiel insuffisant
const defaultBoard = [
    { ...bK}, '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', { ...wK}, '', '', '',
    '', { ...bB}, { ...wB}, '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
];
// test draw
const defaultBoard = [
    { ...bK}, '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', { ...wQ}, '', '', { ...wK}, '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
];
*/
var board = [...defaultBoard];
// le tour actuel
var turn = 'white';
// Les pieces mortes
const whiteDeadPieces = [];
const blackDeadPieces = [];
// si game fini
let gameOver = false;
// historique des coups joués
const moveHistory = [];
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
    boardDiv.textContent = '';
    const aToH = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let n = 0;
    for (let i = 8; i > 0; i--) { 
        for (let j = 0; j < 8; j++) {
            const text = document.createElement("p");
            const text2 = document.createElement("p");
            const div = document.createElement('div');
            div.setAttribute('id', n);
            div.classList.add(aToH[j] + i)
            if ( boardHistory.length == 0 || isArrayEqual(board, boardType)) {
                div.addEventListener('drop', drop);
                div.addEventListener('dragover', dragOver);
            }
            if (boardType[n] != '' ) {
                const divPiece = document.createElement('div');
                const img = document.createElement('img');
                if ( boardHistory.length == 0 || isArrayEqual(board, boardType)) {
                    divPiece.setAttribute('draggable', true);
                    divPiece.addEventListener('dragstart', dragStart);
                    divPiece.addEventListener('dragend', dragEnd);
                }
                divPiece.classList.add(boardType[n]['type'], boardType[n]['color'], 'piece');
                img.src = boardType[n]['img'];
                img.classList.add('piece-img');
                divPiece.appendChild(img);
                div.appendChild(divPiece);
            }
            if ((j + i) % 2 == 0) {
                div.classList.add('beige');
                text.classList.add("start-0");
                text2.classList.add("end-0");
            } else {
                div.classList.add('green');
                text.classList.add("start-1");
                text2.classList.add("end-1");
            }
            if (j == 0 ) {
                text.innerText = i;
                div.appendChild(text);
            }
            if (i == 1) {
                text2.innerText = aToH[j];
                div.appendChild(text2);
            }
            n++;
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

function isArrayEqual(boardType, boardType2) {
    for (let i = 0; i < boardType.length; i++) {
        const element = boardType[i];
        const element2 = boardType2[i];
        if (element != element2) {
            return false;
        }
    }
    return true;
}

function updateBoardInfo(whiteGrave, blackGrave) {
    let whiteCount = 0;
    let blackCount = 0;
    const blackPlus = document.getElementById('black-plus').querySelector('span');
    const whitePlus = document.getElementById('white-plus').querySelector('span');
    const elements = [
        'black-pawn-icon', 'black-bishop-icon', 'black-queen-icon', 'black-rook-icon', 'black-knight-icon',
        'white-pawn-icon', 'white-bishop-icon', 'white-queen-icon', 'white-rook-icon', 'white-knight-icon'
    ];
    blackPlus.textContent = '';
    whitePlus.textContent = '';
    for (let i = 0; i < elements.length; i++) {
        const div = document.getElementById(elements[i]);
        div.textContent = '';
    }
    for (let i = 0; i < whiteGrave.length; i++) {
        const img = document.createElement('img');
        let type = whiteGrave[i]['type'];
        (type.includes('pawn')) ? type = 'pawn' : null;
        (type.includes('knight')) ? type = 'knight' : null;
        (type.includes('bishop')) ? type = 'bishop' : null;
        (type.includes('rook')) ? type = 'rook' : null;
        (type.includes('queen')) ? type = 'queen' : null;
        img.src = whiteGrave[i]['img'];
        img.classList.add('hud-img');
        const div = document.getElementById('white-' + type + '-icon')
        div.appendChild(img);
        blackCount+= whiteGrave[i]['value'];
    }
    for (let i = 0; i < blackGrave.length; i++) {
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
    if (whiteCount - blackCount != 0) {
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
    const elements = document.querySelectorAll('.accessible-beige, .accessible-green');
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('accessible-green', 'accessible-beige');
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
            possibleMoves = pawnMoves(pieceStartPosition, pieceColor, board);
        }
        if (pieceType.includes('knight')) {
            possibleMoves = knightMoves(pieceStartPosition, pieceColor, board);
        }
        if (pieceType.includes('bishop')) {
            possibleMoves = bishopMoves(pieceStartPosition, pieceColor, board);
        }
        if (pieceType.includes('rook')) {
            possibleMoves = rookMoves(pieceStartPosition, pieceColor, board);
        }
        if (pieceType.includes('queen')) {
            possibleMoves = possibleMoves.concat(bishopMoves(pieceStartPosition, pieceColor, board), rookMoves(pieceStartPosition, pieceColor, board));
        }
        if (pieceType.includes('king')) {
            possibleMoves = kingMoves(pieceStartPosition, pieceColor, board);
        }
        for (let i = 0; i < possibleMoves.length; i++) {
            if (isMoveLegal(pieceStartPosition, possibleMoves[i], board)) {
                legalMoves.push(possibleMoves[i]);
                const element = document.getElementById(possibleMoves[i]);
                if ( element.classList.contains('beige')) {
                    element.classList.add('accessible-beige');
                } else {
                    element.classList.add('accessible-green');
                }
                
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
                    const boardCopy = [...board];
                    movePiece(board, posEnd, startPosition);
                    createTurn(boardCopy, posEnd, startPosition);
                    updateBoardInfo(whiteDeadPieces, blackDeadPieces);
                    if (isCheck(oppositeColor, board)) {
                        if (isCheckMate(oppositeColor, board)) {
                            gameOver = true;
                            console.log('echec et maths');
                            break;
                        } else {
                            console.log('echec');
                        }
                    } else {
                        if (isCheckMate(oppositeColor, board)) {
                            console.log('stalemate');
                            gameOver = true;
                            break;
                        }
                    }
                    let nb = 1;
                    if (boardHistory.length !== 0) {
                        const lastBoard = boardHistory[boardHistory.length - 1];
                        for (let i = 0; i < boardHistory.length - 1; i++) {
                            const element = boardHistory[i];
                            if (isArrayEqual(lastBoard, element)) {
                                nb++;
                                if (nb === 3) {
                                    console.log('Threefold Repetition');
                                    gameOver = true;
                                    break;
                                }
                            }
                        }
                    }
                    if ( countTo50 == 50) {
                        gameOver = true;
                        console.log('50 moves rule')
                        break;
                    }
                    if (!isCheckMatePossible(board)) {
                        console.log('Insuffisance matérielle');
                        gameOver = true;
                        break;
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
    if (piece['type'].includes('king') && (endingPos == startingPos + 2 || endingPos == startingPos - 2)) {
        let direction = [];
        if ( endingPos == startingPos + 2) {
            direction.push(3, 1);
        } else {
            direction.push(-4, -1);
        }
        const rook = boardType[startingPos + direction[0]];
        boardType[startingPos + direction[0]] = '';
        boardType[startingPos + direction[1]] = rook;
        const rookMoving = document.getElementById(startingPos + direction[0]).querySelector('div');
        const rookEnd = document.getElementById(startingPos + direction[1]);
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
    // supprime la piece si existe et bouge la piece dans le board
    boardType[startingPos] = '';
    boardType[endingPos] = piece;
    // console.log(boardType);
    // supprime la piece si existe et bouge la piece dans le board affiché
    const pieceMoving = document.getElementById(startingPos).querySelector('div');
    const tileSelected = document.getElementById(endingPos);
    if (tileSelected.querySelector('div')) {
        tileSelected.removeChild(tileSelected.querySelector('div'));
    }
    tileSelected.appendChild(pieceMoving);
    // PROMOTION DE PION // A MODIFIER AVEC UN POPUP ET TRANSFORMER EN FONCTION DU POP UP // en attendant la selection empecher les mouvements 
    if ( piece['type'].includes('pawn') && (endingPos >= 0 && endingPos < 8 || endingPos <= 63 && endingPos > 55)) {
        const pawnMoving = tileSelected.querySelector('div');
        pawnMoving.className = '';
        if ( piece['color'] == 'white') {
            pawnMoving.classList.add('queen-transformed', 'white', 'piece');
            pawnMoving.firstChild.src = wQImg;
            boardType[endingPos] = {...wQ};
        } else {
            pawnMoving.classList.add('queen-transformed', 'black', 'piece');
            pawnMoving.firstChild.src = bQImg;
            boardType[endingPos] = {...bQ};
        }
    }
    // EN PASSANT
    // si en passant supprime la piece started en passant
    const started = getStartedEP(boardType);
    if (piece['type'].includes('pawn') && (piece['color'] == 'white' && endingPos == started - 8 || piece['color'] == 'black' && endingPos == started + 8 )) {
        if ( piece['color'] == 'white') {
            blackDeadPieces.push(boardType[started]); 
        } else {
            whiteDeadPieces.push(boardType[started]); 
        }
        boardType[started] = '';
        const deadStartedEP = document.getElementById(started);
        deadStartedEP.removeChild(deadStartedEP.querySelector('div'));
    }
    // reset en passant ici
    resetEnPassant(boardType);
    // si en passant mets started en passant a true
    if (piece['type'].includes('pawn') && (endingPos == startingPos + 16 || endingPos == startingPos - 16 )) {
        boardType[endingPos]['startedEP'] = true;
    }
}

function isCheckMatePossible(boardType) {
    const nbBB = [];
    const nbWB = [];
    const nbBN = [];
    const nbWN = [];
    const nbBK = [];
    const nbWK = [];
    for (let i = 0; i < boardType.length; i++) {
        if (boardType[i] != '') {
            if (boardType[i]['type'].includes('pawn')) {
                return true;
            }
            if (boardType[i]['type'].includes('queen')) {
                return true;
            }
            if (boardType[i]['type'].includes('rook')) {
                return true;
            }
            if (boardType[i]['type'].includes('bishop')) {
                if (boardType[i]['color'] == 'white') {
                    nbWB.push(i);
                } else {
                    nbBB.push(i);
                }
            }
            if (boardType[i]['type'].includes('knight')) {
                if (boardType[i]['color'] == 'white') {
                    nbWN.push(i);
                } else {
                    nbBN.push(i);
                }
            }
            if (boardType[i]['type'].includes('king')) {
                if (boardType[i]['color'] == 'white') {
                    nbWK.push(i);
                } else {
                    nbBK.push(i);
                }
            }
        }
    }
    if (nbBB.length == 0 && nbBN.length == 0 && nbWB.length == 0 && nbWN.length == 0) {
        return false;
    }
    if ((nbBB.length == 1 && nbBN.length == 0 && nbWB.length == 0 && nbWN.length == 0)||(nbBB.length == 0 && nbBN.length == 0 && nbWB.length == 1 && nbWN.length == 0)) {
        return false;
    }
    if ((nbBB.length == 0 && nbBN.length == 1 && nbWB.length == 0 && nbWN.length == 0)||(nbBB.length == 0 && nbBN.length == 0 && nbWB.length == 0 && nbWN.length == 1)) {
        return false;
    }
    if (nbBB.length == 1 && nbBN.length == 0 && nbWB.length == 1 && nbWN.length == 0) {
        if (((round(nbBB[0]/8)+nbBB[0]%8)%2 != (round(nbWK[0]/8)+nbWK[0]%8)%2 )||((round(nbWB[0]/8)+nbWB[0]%8)%2 != (round(nbBK[0]/8)+nbBK[0]%8)%2)) {
            return false;
        }
    }
    return true;
}
// arrondi a l'entier le plus petit
function round(x) {
    const nb = parseFloat(x).toString();
    const res = parseInt(nb[0]);
    return res;
}

function createTurn(boardType, endPos, startPos) {
    let move = '';
    const startingPos = parseInt(startPos);
    const piece = boardType[startingPos];
    const history = document.getElementById('history');
    const newDiv = document.createElement('div');
    newDiv.classList.add('padding-left');
    const span = document.createElement('span');
    let div;
    const moveName = document.getElementById(endPos);
    move = moveName.classList[0];
    let samePiecesMoves = [];
    if ( moveHistory.length != 0 && moveHistory.length %2 != 0) {
        let text;
        if (moveHistory.length != 1) {
            text = 'turn-' + (moveHistory.length-1);
        } else {
            text = 'turn-' + moveHistory.length;
        }
        span.classList.add('black');
        div = document.getElementById(text);
    } else {
        div = document.createElement('div');
        const index = document.createElement('span');
        index.classList.add('padding-left');
        if ( moveHistory.length == 0) {
            div.setAttribute('id', 'turn-' + (moveHistory.length+1));
            index.textContent = (moveHistory.length+1) + '.';
        } else {
            div.setAttribute('id', 'turn-' + (moveHistory.length));
            index.textContent = (moveHistory.length / 2 + 1) + '.';
        }
        div.classList.add('container-inline');
        history.appendChild(div);
        div.appendChild(index);
        span.classList.add('white');
    }
    div.appendChild(newDiv);
    if ( boardType[endPos] != '') {
        move = 'x' + move;
    }
    if ( piece['type'] == 'pawn') {
        for (let i = 0; i < boardType.length; i++) {
            const element = boardType[i];
            if ( element['type'] && element['type'] == piece['type'] && element['color'] == piece['color'] && startingPos != i) {
                samePiecesMoves = samePiecesMoves.concat(pawnMoves(i, piece['color'], boardType));
            }
        }
        
        const posEnpassant = getStartedEP(boardType);
        if ( piece['color'] == 'white') {
            if ( endPos == posEnpassant - 8) {
                move = 'x' + move + ' ep';
            }
        } else {
            if ( endPos == posEnpassant + 8) {
                move = 'x' + move + ' ep';
            }
        }
    }
    if ( piece['type'].includes('rook')) {
        const img = document.createElement('img');
        ( piece['color'] == 'white') ? img.src = wRImg : img.src = bRImg;
        img.classList.add('history-img');
        newDiv.appendChild(img);
        for (let i = 0; i < boardType.length; i++) {
            const element = boardType[i];
            if (element['type'] && element['type'].includes('rook') && element['color'] == piece['color'] && startingPos != i) {
                samePiecesMoves = samePiecesMoves.concat(rookMoves(i, piece['color'], boardType));
            }
        }
    }
    if ( piece['type'].includes('bishop'))  {
        const img = document.createElement('img');
        ( piece['color'] == 'white') ? img.src = wBImg : img.src = bBImg;
        img.classList.add('history-img');
        newDiv.appendChild(img);
        for (let i = 0; i < boardType.length; i++) {
            const element = boardType[i];
            if (element['type'] && element['type'].includes('bishop') && element['color'] == piece['color'] && startingPos != i) {
                samePiecesMoves = samePiecesMoves.concat(bishopMoves(i, piece['color'], boardType));
            }
        }
    }
    if ( piece['type'] == 'king') {
        const img = document.createElement('img');
        ( piece['color'] == 'white') ? img.src = wKImg : img.src = bKImg;
        img.classList.add('history-img');
        newDiv.appendChild(img);
        if ( parseInt(endPos) == parseInt(startingPos) + 2) {
            move = '0-0';
        }
        if ( parseInt(endPos) == parseInt(startingPos) - 2) {
            move = '0-0-0';
        }
    }
    if ( piece['type'].includes('queen'))  {
        const img = document.createElement('img');
        ( piece['color'] == 'white') ? img.src = wQImg : img.src = bQImg;
        img.classList.add('history-img');
        newDiv.appendChild(img);
        for (let i = 0; i < boardType.length; i++) {
            const element = boardType[i];
            if (element['type'] && element['type'].includes('queen') && element['color'] == piece['color'] && startingPos != i) {
                samePiecesMoves = samePiecesMoves.concat(rookMoves(i, piece['color'], boardType), bishopMoves(i, piece['color'], boardType));
            }
        }
    }
    if ( piece['type'].includes('knight'))  {
        const img = document.createElement('img');
        ( piece['color'] == 'white') ? img.src = wNImg : img.src = bNImg;
        img.classList.add('history-img');
        newDiv.appendChild(img);
        for (let i = 0; i < boardType.length; i++) {
            const element = boardType[i];
            if (element['type'] && element['type'].includes('knight') && element['color'] == piece['color'] && startingPos != i) {
                samePiecesMoves = samePiecesMoves.concat(knightMoves(i, piece['color'], boardType));
            }
        }
    }
    if ( samePiecesMoves.includes(endPos)) {
        const tile = document.getElementById(startPos);
        const pos = tile.classList[0];
        move = pos + move;
    }
    if ( piece['type'] == 'king' && parseInt(endPos) == parseInt(startingPos) + 2) {
        move = '0-0';
    }
    if ( piece['type'] == 'king' && parseInt(endPos) == parseInt(startingPos) - 2) {
        move = '0-0-0';
    }
    if ( piece['type'] == 'pawn' && (endPos >= 0 && endPos < 8 || endPos <= 63 && endPos > 55)) {
        const transformedPiece = board[endPos];
        if ( transformedPiece['type'] == 'knight' || transformedPiece['type'] == 'knight-transformed' ) {
            move = move + 'n';
        } else {
            move = move + board[endPos]['type'][0];
        }
    }
    boardType[startingPos] = '';
    boardType[endPos] = piece;
    const oppositeColor = getOppositeColor(piece['color']);
    if ( isCheck(oppositeColor, boardType)) {
        if ( isCheckMate(oppositeColor, boardType)) {
            move = move + '#';
        } else {
            move = move + '+';
        }
    }
    span.textContent = move;
    newDiv.appendChild(span);
    moveHistory.push(move);
    boardHistory.push(boardType);
    const boardIndex = boardHistory.length-1;
    newDiv.onclick= () => {
        createBoard(boardHistory[boardIndex]);
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
    if (startPos / 8 < startingRank[1] && startPos / 8 >= startingRank[0] && boardType[startPos + 8 * moveDirection] == '' && boardType[startPos + 16 * moveDirection] == '') {
        possibleMoves.push(startPos + 16 * moveDirection);
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
        if (startPos % 8 < 7 && startPos / 8 >= 1 && boardType[startPos + 7 * moveDirection] != '' && boardType[startPos + 7 * moveDirection]['color'] == oppositeColor) {
            possibleMoves.push(startPos + 7 * moveDirection);
        }
        // 1 case en diagonale gauche blanc
        if (startPos % 8 > 0 && startPos / 8 >= 1 && boardType[startPos + 9 * moveDirection] != '' && boardType[startPos + 9 * moveDirection]['color'] == oppositeColor) {
            possibleMoves.push(startPos + 9 * moveDirection);
        }
    } else {
        // 1 case en diagonale droite noir
        if (startPos % 8 < 7 && startPos / 8 < 7 && boardType[startPos + 9 * moveDirection] != '' && boardType[startPos + 9 * moveDirection]['color'] == oppositeColor) {
            possibleMoves.push(startPos + 9 * moveDirection);
        }
        // 1 case en diagonale gauche noir
        if (startPos % 8 > 0 && startPos / 8 < 7 && boardType[startPos + 7 * moveDirection] != '' && boardType[startPos + 7 * moveDirection]['color'] == oppositeColor) {
            possibleMoves.push(startPos + 7 * moveDirection);
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
    if (startPos % 8 > 0) {
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
            if (startPos - 9 * count < 0 || boardType[startPos - 9 * count] != '' && boardType[startPos - 9 * count]['color'] != oppositeColor) {
                break;
            } else {
                possibleMoves.push(startPos - 9 * count);
                if (boardType[startPos - 9 * count] != '') {
                    break;
                }
            }
        }
    }
    // deplacement en haut a droite
    if (startPos / 8 >= 1 && startPos % 8 < 7) {
        let count = 0;
        for (let i = startPos % 8; i < 7; i++) {
            count++;
            if (startPos - 7 * count < 0 || boardType[startPos - 7 * count] != '' && boardType[startPos - 7 * count]['color'] != oppositeColor) {
                break;
            } else {
                possibleMoves.push(startPos - 7 * count);
                if (boardType[startPos - 7 * count] != '') {
                    break;
                }
            }
        }
    }
    // deplacement en bas a droite
    if (startPos / 8 < 7 && startPos % 8 < 7) {
        let count = 0;
        for (let i = startPos % 8; i < 7; i++) {
            count++;
            if (startPos + 9 * count > 63 || boardType[startPos + 9 * count] != '' && boardType[startPos + 9 * count]['color'] != oppositeColor) {
                break;
            } else {
                possibleMoves.push(startPos + 9 * count);
                if (boardType[startPos + 9 * count] != '') {
                    break;
                }
            }
        }
    }
    // deplacement en bas a gauche
    if (startPos / 8 < 7 && startPos % 8 > 0) {
        let count = 0;
        for (let i = startPos % 8; i > 0; i--) {
            count++;
            if (startPos + 7 * count > 63 || boardType[startPos + 7 * count] != '' && boardType[startPos + 7 * count]['color'] != oppositeColor) {
                break;
            } else {
                possibleMoves.push(startPos + 7 * count);
                if (boardType[startPos + 7 * count] != '') {
                    break;
                }
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
    // 2 case vers le haut
    if (startPos / 8 >= 2 && startPos % 8 < 7 && (boardType[startPos - 15]['color'] == oppositeColor || boardType[startPos - 15] == '')) {
        possibleMoves.push(startPos - 15);
    }
    // 2 case vers le haut
    if (startPos / 8 >= 2 && startPos % 8 > 0 && (boardType[startPos - 17]['color'] == oppositeColor || boardType[startPos - 17] == '')) {
        possibleMoves.push(startPos - 17);
    }
    // 2 case vers le bas 
    if (startPos / 8 < 6 && startPos % 8 > 0 && (boardType[startPos + 15]['color'] == oppositeColor || boardType[startPos + 15] == '')) {
        possibleMoves.push(startPos + 15);
    }
    // 2 case vers le haut
    if (startPos / 8 < 6 && startPos % 8 < 7 && (boardType[startPos + 17]['color'] == oppositeColor || boardType[startPos + 17] == '')) {
        possibleMoves.push(startPos + 17);
    }
    // 1 case vers le haut
    if (startPos / 8 >= 1 && startPos % 8 < 6 && (boardType[startPos - 6]['color'] == oppositeColor || boardType[startPos - 6] == '')) {
        possibleMoves.push(startPos - 6);
    }
    // 2 case vers le haut
    if (startPos / 8 >= 1 && startPos % 8 > 1 && (boardType[startPos - 10]['color'] == oppositeColor || boardType[startPos - 10] == '')) {
        possibleMoves.push(startPos - 10);
    }
    // 1 case vers le bas
    if (startPos / 8 < 7 && startPos % 8 < 6 && (boardType[startPos + 10]['color'] == oppositeColor || boardType[startPos + 10] == '')) {
        possibleMoves.push(startPos + 10);
    }
    // 2 case vers le haut
    if (startPos / 8 < 7 && startPos % 8 > 1 && (boardType[startPos + 6]['color'] == oppositeColor || boardType[startPos + 6] == '')) {
        possibleMoves.push(startPos + 6);
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
    // castle 
    // droite
    if (boardType[startPos + 1] == '' && boardType[startPos + 2] == '' && boardType[startPos + 3]['type'] == 'rook-right' && boardType[startPos + 3]['color'] == color) {
        if ( color == 'white' && wCastleRight) {
            possibleMoves.push(startPos + 2);
        }
        if ( color == 'black' && bCastleRight) {
            possibleMoves.push(startPos + 2);
        }
    }
    // gauche
    if (boardType[startPos - 1] == '' && boardType[startPos - 2] == '' && boardType[startPos - 3] == '' && boardType[startPos - 4]['type'] == 'rook-left' && boardType[startPos - 4]['color'] == color) {
        if ( color == 'white' && wCastleLeft) {
            possibleMoves.push(startPos - 2);
        }
        if ( color == 'black' && bCastleLeft) {
            possibleMoves.push(startPos - 2);
        }
    }
    // calcule de la case du bas
    if (startPos / 8 < 7 && (boardType[startPos + 8]['color'] == oppositeColor || boardType[startPos + 8] == '')) {
        possibleMoves.push(startPos + 8);
    }
    // calcule de la case du haut
    if (startPos / 8 >= 1 && (boardType[startPos - 8]['color'] == oppositeColor || boardType[startPos - 8] == '')) {
        possibleMoves.push(startPos - 8);
    }
    // calcule de la case de droite
    if (startPos % 8 < 7 && (boardType[startPos + 1]['color'] == oppositeColor || boardType[startPos + 1] == '')) {
        possibleMoves.push(startPos + 1);
    }
    // calcule de la case de gauche
    if (startPos % 8 > 0 && (boardType[startPos - 1]['color'] == oppositeColor || boardType[startPos - 1] == '')) {
        possibleMoves.push(startPos - 1);
    }
    // calcule de la case en haut a droite
    if (startPos / 8 >= 1 && startPos % 8 < 7 && (boardType[startPos - 7]['color'] == oppositeColor || boardType[startPos - 7] == '')) {
        possibleMoves.push(startPos - 7);
    }
    // calcule de la case en haut a gauche
    if (startPos / 8 >= 1 && startPos % 8 > 0 && (boardType[startPos - 9]['color'] == oppositeColor || boardType[startPos - 9] == '')) {
        possibleMoves.push(startPos - 9);
    }
    // calcule de la case en bas a droite
    if (startPos / 8 < 7 && startPos % 8 < 7 && (boardType[startPos + 9]['color'] == oppositeColor || boardType[startPos + 9] == '')) {
        possibleMoves.push(startPos + 9);
    }
    // calcule de la case en bas a gauche
    if (startPos / 8 < 7 && startPos % 8 > 0 && (boardType[startPos + 7]['color'] == oppositeColor || boardType[startPos + 7] == '')) {
        possibleMoves.push(startPos + 7);
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
    if ( piece['type'].includes('king') && (endingPos == startingPos - 2 || endingPos == startingPos + 2 )) {
        let direction = [];
        if ( endingPos == startingPos + 2 ) {
            direction.push(1, 2, 3);
        } else {
            direction.push(-1, -2, -4);
        }
        if ( isCheck(pieceColor, boardCopy)) {
            return false;
        } else {
            boardCopy[startingPos] = '';
            boardCopy[startingPos + direction[0]] = piece;
            if ( isCheck(pieceColor, boardCopy)) {
                return false;
            } else {
                boardCopy[startingPos + direction[0]] = '';
                boardCopy[startingPos + direction[1]] = piece;
                const rook = boardCopy[startingPos + direction[2]];
                boardCopy[startingPos + direction[2]] = '';
                boardCopy[startingPos + direction[0]] = rook;
                // maybe a modif si doit ne pas etre en echec avant le mouv de la tour
            }  
        }
    }
    // SI EN PASSANT 
    if (piece['type'].includes('pawn') && pieceColor == 'white' && boardCopy[endingPos] == '' && (endingPos == startingPos - 9 || endingPos == startingPos - 7)) {
        boardCopy[endingPos + 8] = '';
    }
    if (piece['type'].includes('pawn') && pieceColor == 'black' && boardCopy[endingPos] == '' && (endingPos == startingPos + 9 || endingPos == startingPos + 7)) {
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
        if (boardType[i] != '' && boardType[i]['color'] == oppositeColor) {
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
                ennemyAccessiblePos = ennemyAccessiblePos.concat(rookMoves(i, oppositeColor, boardType),bishopMoves(i, oppositeColor, boardType));
            }
            if (boardType[i]['type'].includes('king')) {
                ennemyAccessiblePos = ennemyAccessiblePos.concat(kingMoves(i, oppositeColor, boardType));
            }   
        }
        if (boardType[i] != '' && boardType[i]['color'] == color && boardType[i]['type'].includes('king')) {
            kingPos = i;
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
    for (let i = 0; i < boardType.length; i++) {
        if (boardType[i] != '' && boardType[i]['color'] == color) {
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
    if (colorAccessiblePos.length == 0) {
        return true;
    } else {
        return false;
    }
}
/* A FAIRE
- historique :
    - uniquement le a au lieu de a1 mais bon
- egalite : 
    - Threefold Repetition // a modifier
- systeme de gameOver :
    - affichage de fin
- promotion : 
    - pop up qui permet de choisir en quoi se transformer
- bouton nouvelle game et bouton ff
EGALITE :
- Stalemate / fait
- Mutual Agreement / a faire - facile
- Threefold Repetition / a faire
- 50-Move Rule / fait
*/