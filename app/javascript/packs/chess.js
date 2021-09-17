$(document).ready(function(){
	$('#startBtn').on('click', function() {
		send_ajax(game.fen(), null)
		game.reset()
		board.start()
	})

		var board = Chessboard('board', {
	  draggable: true,
	  dropOffBoard: 'trash',
	  sparePieces: true,
	  pieceTheme: pieceTheme,
	  onDragStart: onDragStart,
	  onDrop: onDrop,
	  onMouseoutSquare: onMouseoutSquare,
  	onMouseoverSquare: onMouseoverSquare,
	  onSnapEnd: onSnapEnd
	})
	function pieceTheme (piece) {
	  // wikipedia theme for white pieces
	  if (piece.search(/w/) !== -1) {
	    return '/assets/img/chesspieces/wikipedia/' + piece + '.png'
	  }

	  // alpha theme for black pieces
	  return '/assets/img/chesspieces/wikipedia/' + piece + '.png'
	}

	
	// NOTE: this example uses the chess.js library:
	// https://github.com/jhlywa/chess.js
	// var board = null
	var game = new Chess()
	var $status = $('#status')
	var $fen = $('#fen')
	var $pgn = $('#pgn')
	var whiteSquareGrey = '#a9a9a9'
	var blackSquareGrey = '#696969'

	function removeGreySquares () {
	  $('#board .square-55d63').css('background', '')
	}

	function greySquare (square) {
		var check = $('[class^="board-"], [class*=" board-"] img')[0]
		if($(check).find('img').length > 0){

		  var $square = $('#board .square-' + square)

		  var background = whiteSquareGrey
		  if ($square.hasClass('black-3c85d')) {
		    background = blackSquareGrey
		  }

		  $square.css('background', background)
		}
	}

	function onMouseoverSquare (square, piece) {
	  // get list of possible moves for this square
	  var moves = game.moves({
	    square: square,
	    verbose: true
	  })

	  // exit if there are no moves available for this square
	  if (moves.length === 0) return

	  // highlight the square they moused over
	  greySquare(square)

	  // highlight the possible squares for this piece
	  for (var i = 0; i < moves.length; i++) {
	    greySquare(moves[i].to)
	  }
	}

	function onMouseoutSquare (square, piece) {
	  removeGreySquares()
	}



	function onDragStart (source, piece, position, orientation) {
	  // do not pick up pieces if the game is over
	  if (game.game_over()) return false

	  // only pick up pieces for the side to move
	  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
	      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
	    return false
	  }
	}

	function onDrop (source, target) {
	  // see if the move is legal
	  var move = game.move({
	    from: source,
	    to: target,
	    promotion: 'q' // NOTE: always promote to a queen for example simplicity
	  })

	  // illegal move
	  if (move === null) return 'snapback'

	  updateStatus()
		removeGreySquares()
		update_ajax(game.fen(), game.pgn())
	}

	// update the board position after the piece snap
	// for castling, en passant, pawn promotion
	function onSnapEnd () {
	  board.position(game.fen())
	}

	function updateStatus () {
	  var status = ''
	  var moveColor = 'White'
	  if (game.turn() === 'b') {
	    moveColor = 'Black'
	  }

	  // checkmate?
	  if (game.in_checkmate()) {
	    status = 'Game over, ' + moveColor + ' is in checkmate.'
	  }

	  // draw?
	  else if (game.in_draw()) {
	    status = 'Game over, drawn position'
	  }

	  // game still on
	  else {
	    status = moveColor + ' to move'

	    // check?
	    if (game.in_check()) {
	      status += ', ' + moveColor + ' is in check'
	    }
	  }

	  $status.html(status)
	  $fen.html(game.fen())
	  $pgn.html(game.pgn())
	}

	updateStatus()

});

function send_ajax(fen, pgn){
	var post_data = { starting_position: fen, pgn: pgn }
	$.ajax({
    type: "POST",
    url: "/chess",
    data: post_data,
    success: function(data) {
        $('#board').attr("data-id", data.id) 
      }
   })
}

function update_ajax(fen, pgn){
	var post_data = { starting_position: fen, pgn: pgn }
	var id = $('#board').attr("data-id")
	$.ajax({
    type: "PUT",
    url: "/chess/" + id,
    data: post_data,
   });
}