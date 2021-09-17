class CreatePositions < ActiveRecord::Migration[6.1]
  def change
    create_table :positions do |t|
      t.string :starting_position
      t.string :pgn
      t.timestamps
    end
  end
end
