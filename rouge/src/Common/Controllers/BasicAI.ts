module Common.Controllers.BasicAI {

    var char: Entities.PlayerChar;
    var lvl: Dungeon.Level;
    var state = States.Inactive;
    var manager: EntityManager;
    var con: IConsole;
    var callback;
} 