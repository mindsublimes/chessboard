class ChessController < ApplicationController
	def index
		
	end

	def create
		position = Position.create(starting_position: params[:starting_position], pgn: params[:pgn])
		render json: position
	end

	def update
		position = Position.find_by(id: params[:id])
		position.update(starting_position: params[:starting_position], pgn: params[:pgn])
	end

end
