import Game from "../../src/game_engine/game";
import Dungeon from "../../src/game_engine/dungeon";
import Entity from "../../src/game_engine/base_classes/entity";

class TestEntity extends Entity {
  public ticks: number[] = [];
  TurnClockStep(current_turn: number) {
    this.ticks.push(current_turn);
  }
}

function addEntity(game: Game) {
  // @ts-ignore access private
  const entities = game.data.entities as any[];
  const e = new TestEntity(game);
  // entity auto-added to game.data in constructor
  return e;
}

describe("Dungeon.AdvanceTurnClock", () => {
  test("increments turn and calls TurnClockStep on entities", () => {
    const game = new Game();
    const dungeon = game.dungeon;

    const e1 = addEntity(game);
    const e2 = addEntity(game);

    const startTurn = game.data.turn;
    dungeon.AdvanceTurnClock(3);

    expect(game.data.turn).toBe(startTurn + 3);
    expect(e1.ticks.length).toBe(3);
    expect(e2.ticks.length).toBe(3);
    expect(e1.ticks[0]).toBe(startTurn);
  });
});