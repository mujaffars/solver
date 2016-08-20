function createDb() {
    var incDb = eval(parseInt(localStorage.getItem("incDb")) + 1);
    var incDb = 47;
    localStorage.setItem("incDb", incDb);
//    var incDb = parseInt(localStorage.getItem("incDb"));
//    console.log(incDb);

    dbShell = window.openDatabase("dbw1" + incDb, 2, "dbw1", 1000000);
    //run transaction to create initial tables
    dbShell.transaction(setupTable, dbErrorHandler);

//    gSoundMatch.id = "soundMatch";
//    gSoundMatch.appendChild(setSoundSource("sound_match"));
//    gSoundMatch.preload = "auto";
//
//    gSoundTarget.id = "soundTarget";
//    gSoundTarget.appendChild(setSoundSource("sound_target"));
//    gSoundTarget.preload = "auto";
}

//I just create our initial table - all one of em
function setupTable(tx) {
//    dbShell.transaction(function (tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS setting(id INTEGER PRIMARY KEY, theme, coins INTEGER, hints INTEGER, adWacthedOn)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS package(id INTEGER PRIMARY KEY, name, complete, key)");

    tx.executeSql("CREATE TABLE IF NOT EXISTS levelBasic(id INTEGER PRIMARY KEY, package_id INTEGER, alphas, grid, theme, key, stars, hint_alpha, complete INTEGER, approved INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS levelBeginer(id INTEGER PRIMARY KEY, package_id INTEGER, alphas, grid, theme, key, stars, hint_alpha, complete INTEGER, approved INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS levelIntermediate(id INTEGER PRIMARY KEY, package_id INTEGER, alphas, grid, theme, key, stars, hint_alpha, complete INTEGER, approved INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS levelExpert(id INTEGER PRIMARY KEY, package_id INTEGER, alphas, grid, theme, key, stars, hint_alpha, complete INTEGER, approved INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS levelMaster(id INTEGER PRIMARY KEY, package_id INTEGER, alphas, grid, theme, key, stars, hint_alpha, complete INTEGER, approved INTEGER)");

    tx.executeSql("CREATE TABLE IF NOT EXISTS answerBasic(id INTEGER PRIMARY KEY, lvl_id INTEGER, answer, identity_key, complete INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS answerBeginer(id INTEGER PRIMARY KEY, lvl_id INTEGER, answer, identity_key, complete INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS answerIntermediate(id INTEGER PRIMARY KEY, lvl_id INTEGER, answer, identity_key, complete INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS answerExpert(id INTEGER PRIMARY KEY, lvl_id INTEGER, answer, identity_key, complete INTEGER)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS answerMaster(id INTEGER PRIMARY KEY, lvl_id INTEGER, answer, identity_key, complete INTEGER)");

    tx.executeSql("CREATE TABLE IF NOT EXISTS prelevels(id INTEGER PRIMARY KEY, package_id INTEGER, alphas, key, words, grid)");

    createSetting();

//    }, dbErrorHandler);

}

function createSetting() {
    dbShell.transaction(function (tx) {
        tx.executeSql("SELECT id, theme FROM setting WHERE id = ?", [1], function (tx, results) {
            if (results.rows.length == 0) {
                dbShell.transaction(function (tx) {
                    tx.executeSql("INSERT INTO setting(id,theme,coins, hints) values(?,?,?,?)", [1, 'basic', 0, 20]);
                }, dbErrorHandler);
                
                createPzls();
            }
            //createPzls();
        })
    }, dbErrorHandler);
}

function dbErrorHandler(err) {
    console.log("DB Error: " + err.message + "\nCode=" + err.code);
}

function getPuzzleDtl(selectTbl, lvlId) {
    var answers = [];
    var answerKeys = [];
    var randomId = Math.floor(Math.random() * 15) + 1;
    dbShell.transaction(function (tx) {
        tx.executeSql("SELECT L.id, L.package_id, L.alphas, L.key, L.stars, L.hint_alpha, L.theme, L.grid, A.answer, A.identity_key FROM level" + selectTbl + " AS L LEFT JOIN answer" + selectTbl + " AS A ON L.id = A.lvl_id WHERE L.id = ?", [randomId], function (tx, results) {
            
            if (results.rows.length !== 0) {                
                pzlDtl = {
                    "id": results.rows[0].id,
                    "alphas": $.parseJSON(results.rows[0].alphas),
                    "grid": results.rows[0].grid,
                    "theme": results.rows[0].theme,
                    "answers": {},
                    "answerKeys": {},
                    "answerComplete": 0,
                }
                
                for (i = 0; i < results.rows.length; i++) {
                    answers.push(results.rows[i].answer);
                    answerKeys[results.rows[i].answer] = results.rows[i].identity_key;
                }
                pzlDtl.answers = answers;
                pzlDtl.answerKeys = answerKeys;
                startGame();
            } else {
                return 'complete';
            }
        })
    }, dbErrorHandler);
}

function createPzls() {
    var arrPzls = alphaStr.split("|$$|");
    //console.log(arrPzls);
    for (i = 0; i < arrPzls.length; i++) {
//        console.log('the pzl ' + i);
        var arrPzlDtl = arrPzls[i].split(" |==| ");
        if (arrPzlDtl[0].trim() !== "") {
            insertIntoTbl(arrPzlDtl);
        }
    }
}

function insertIntoTbl(arrPzlDtl) {
    var strAlphas = '{';
    var arrAlphas = arrPzlDtl[1].split(" ");
    var grid = arrPzlDtl[4].trim();
    var theme = arrPzlDtl[2].trim();
    var arrAnswers = arrPzlDtl[3].split(" ");

    //console.log(arrAlphas);
    for (j = 0; j < arrAlphas.length; j++) {
        if (strAlphas !== '{') {
            strAlphas += ", ";
        }
        var arrAlphaDtl = arrAlphas[j].split("_");
        strAlphas += '"' + arrAlphaDtl[0].trim() + '_' + arrAlphaDtl[1].trim() + '":{"row":"' + arrAlphaDtl[0].trim() + '", "col":"' + arrAlphaDtl[1].trim() + '", "letter":"' + arrAlphaDtl[2].trim() + '"}';
    }
    strAlphas += '}';
    var tblName = 'Basic';
    //console.log(arrPzlDtl[4]);

    switch (grid) {
        case '2 2':
            tblName = 'Basic';
            break;
        case '3 3':
            tblName = 'Beginer';
            break;
        case '4 4':
            tblName = 'Intermediate';
            break;
        case '5 5':
            tblName = 'Expert';
            break;
        case '6 6':
            tblName = 'Expert';
            break;
        case '7 7':
            tblName = 'Master';
            break;
    }
    dbShell.transaction(function (tx) {
        tx.executeSql("INSERT INTO level" + tblName + "(alphas, grid, theme, key, hint_alpha, complete) values(?,?,?,?,?,?)", [strAlphas, grid, theme, 'The key', 'hint', '0'], function (tx, result) {
            for (k = 0; k < arrAnswers.length; k++) {
                var randomKey = makeid(5);
                tx.executeSql("INSERT INTO answer" + tblName + "(lvl_id, answer, identity_key) values(?,?,?)", [result.insertId, arrAnswers[k], randomKey], function (tx, result) {

                })
            }
        })
    }, dbErrorHandler);
}

function ansMarkComplete(ansKey){
    dbShell.transaction(function (tx) {
        tx.executeSql("UPDATE answer" + selectTblName + " SET complete = ? WHERE identity_key = ? AND lvl_id = ?", [1, ansKey, pzlDtl['id']], function (tx, result) {
            
        })
    }, dbErrorHandler);
}

function pzlMarkComplete(){
    dbShell.transaction(function (tx) {
        tx.executeSql("UPDATE level" + selectTblName + " SET complete = ? WHERE id = ?", [1, pzlDtl['id']], function (tx, result) {
            getPuzzleDtl(selectTblName);
        })
    }, dbErrorHandler);
}

function dropDb() {
    dbShell.transaction(function (tx) {
        tx.executeSql("DROP database dbw140", [], function (tx, results) {
            //console.log(results);
        })
    }, dbErrorHandler);
}

function makeid(idLenght)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < idLenght; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}