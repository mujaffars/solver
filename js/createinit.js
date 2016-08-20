var divQueue = [];
var tblRows = 3;
var tblCols = 3;
var lastValidCol = '';
var lastValidRow = '';
var fontVW = 17;

var autoCreate = 'true';

(function () {
    createDb();
    // Your base, I'm in it!
    var originalAddClassMethod = jQuery.fn.addClass;

    jQuery.fn.addClass = function () {
        // Execute the original method.
        var result = originalAddClassMethod.apply(this, arguments);
        // trigger a custom event
        jQuery(this).trigger('cssClassChanged');
        // return the original result
        return result;
    }
})();

$(function () {
    if (autoCreate === 'true')
        createCustomTables(tblRows, tblCols);
});

function preCreateTbl() {
    createCustomTables(parseInt($('.tblrows').val()), parseInt($('.tblcolmns').val()));
}
function createCustomTables(tblRows, tblCols) {
    $('#solveArea').html('');
    switch (tblCols) {
        case 2:
            fontVW = 27;
            break;
        case 3:
            fontVW = 18;
            break;
        case 4:
            fontVW = 15;
            break;
        case 5:
            fontVW = 13;
            break;
        case 6:
            fontVW = 10;
            break;
    }
    //$(window).resize(on_resize);
    //init_game();
    createTable(tblRows, tblCols);
    createTableDragger(tblRows, tblCols);
    var fontSize = [
        {
            locator: '.row',
            initialSize: 44,
            changeFor: 'height',
            changeValue: eval(parseInt($('.board').find('.firstRow').innerWidth()) / tblCols) + 'px;'
        },
        {
            locator: '.cell',
            initialSize: 17,
            changeFor: 'font-size'
        },
        {
            locator: '#solveArea',
            changeFor: 'height',
            changeValue: eval($(window).height() * 50 / 100) + 'px;'
        },
        {
            locator: '#headerArea',
            changeFor: 'height',
            changeValue: eval($(window).height() * 10 / 100) + 'px;'
        }
    ]
    $.each(fontSize, function (index, val) {
        if (val.locator === '.cell') {
            changeCss(val.locator, val.changeFor + ':' + fontVW + 'vw;');
        } else if (val.locator === '#solveArea') {
            changeCss(val.locator, val.changeFor + ':' + val.changeValue);
        } else {
            changeCss(val.locator, val.changeFor + ':' + val.changeValue);
        }
    })
    if (tblRows > 4) {
        changeCss('.board', 'width:90%; margin-left:5%;');
        changeCss('.cell', 'font-size:10vw;');
        changeCss('#solveArea', 'height:' + eval($(window).height() * 60 / 100) + 'px;');
    }

    createAnswerTable(tblRows, 6);
}

function createTable(rows, column) {
    var board = jQuery("<div>", {
        id: 'board',
        class: 'board'
    });
    for (i = 0; i < rows; i++) {
        var widthCheckClass = '';
        if (i === 0) {
            widthCheckClass = 'firstRow';
        }
        var row = jQuery("<div>", {
            class: 'row ' + widthCheckClass
        });
        for (j = 0; j < column; j++) {
            var col = jQuery("<div>", {
                class: 'cell prdrag_' + i + '_' + j,
                text: '#',
                row: i,
                col: j
            });
            var dragger = jQuery("<div>", {
                class: 'dragger'
            });
            //col.append(dragger);
            row.append(col);
        }
        board.append(row);
    }
    $('#solveArea').append(board);
}

function createTableDragger(rows, column) {
    var board = jQuery("<div>", {
        id: 'boardDragger',
        class: 'board'
    });
    for (i = 0; i < rows; i++) {
        var row = jQuery("<div>", {
            class: 'row'
        });
        for (j = 0; j < column; j++) {
            var col = jQuery("<div>", {
                id: 'cell_' + i + '_' + j,
                class: 'cell',
                row: i,
                col: j
            });
            var dragger = jQuery("<div>", {
                id: 'drag_' + i + '_' + j,
                class: 'dragger',
                text: '',
                row: i,
                col: j
            });
            col.append(dragger);
            row.append(col);
        }
        board.append(row);
    }
    $('#solveArea').append(board);
    bindEvents();
}

function createAnswerTable(rows, column, ansCount) {

    var boardAnswer = jQuery("<div>", {
        id: 'boardAnswer',
        class: 'table'
    });
    for (i = 0; i < rows; i++) {
        var row = jQuery("<div>", {
            class: 'row'
        });
        for (j = 0; j < column; j++) {
            var col = jQuery("<div>", {
                id: 'cell_' + i + '_' + j,
                class: 'cell alert-select',
                row: i,
                col: j
            });
            var ansHolder = jQuery("<div>", {
                id: 'drag_' + i + '_' + j,
                class: 'ansHolder',
                text: '',
                row: i,
                col: j
            });
            col.append(ansHolder);
            row.append(col);
        }
        boardAnswer.append(row);
    }
    $('.tblAnswerArea').append(boardAnswer);

    var fontSize = [
        {
            locator: '#boardAnswer .row',
            changeFor: 'height',
            changeValue: eval(parseInt($('#boardAnswer').find('.row').innerWidth()) / parseInt(column)) + 'px;'
        },
        {
            locator: '#boardAnswer .cell',
            changeFor: 'font-size'
        }
    ]
    $.each(fontSize, function (index, val) {
        if (val.locator === '#boardAnswer .cell') {
            changeCss(val.locator, val.changeFor + ': 7vw;');
        } else {
            changeCss(val.locator, val.changeFor + ':' + val.changeValue);
        }
    })
//    var colWidth = 
}

function bindEvents() {
    $("#boardDragger").find('.dragger').bind('cssClassChanged', function () {
        //console.log('we are in changed class');
        var foundId = 'false';

        if ($.inArray($(this).attr('id'), divQueue) === -1) {
            var dragRow = $(this).attr('row');
            var dragCol = $(this).attr('col');
            //console.log(divQueue);
            //do stuff here
            if ($('.pr' + $(this).attr('id')).hasClass('alert-select')) {

            } else {
                console.log('changeddd')
                if (isValidMove(dragRow, dragCol) === 'true') {
                    $('.pr' + $(this).attr('id')).addClass('alert-select');
                    if (pzlWordArr !== '') {
                        $('.pr' + $(this).attr('id')).text(pzlWordArr[0]);
                        pzlWordArr.shift();
                    }
                    divQueue.push($(this).attr('id'));
                }
            }
        } else {
            // Get the second last element of array
            var second_last_elem = divQueue[divQueue.length - 2]

            if (second_last_elem === $(this).attr('id')) {
                lastValidRow = parseInt($('.pr' + second_last_elem).attr('row'));
                lastValidCol = parseInt($('.pr' + second_last_elem).attr('col'));
                var last_elem = divQueue[divQueue.length - 1];

                if (pzlWordArr !== '') {
                    var prevChar = $('.pr' + last_elem).text();
                    pzlWordArr.unshift(prevChar);
                }

                $('.pr' + last_elem).removeClass('alert-select');
                $('.pr' + last_elem).text('#');
                divQueue.pop();
                console.log(divQueue);
            }
        }
    });

    $("#boardDragger").find('.cell').bind('cssClassChanged', function () {

        if (divQueue.length === 2) {
            var cellRow = $(this).attr('row');
            var cellCol = $(this).attr('col');
            if (divQueue[0] === 'drag_' + cellRow + '_' + cellCol) {
                lastValidRow = parseInt(cellRow);
                lastValidCol = parseInt(cellCol);
                var last_elem = divQueue[divQueue.length - 1];

                if (pzlWordArr !== '') {
                    var prevChar = $('.pr' + last_elem).text();
                    pzlWordArr.unshift(prevChar);
                }

                $('.pr' + last_elem).removeClass('alert-select');
                $('.pr' + last_elem).text('#');
                divQueue.pop();
                console.log('Changed the cell css class');
            }
        }
    })

    $("#boardDragger").find(".dragger").draggable({
        revert: true,
        containment: '#boardDragger',
        start: function (event, ui) {
            $(this).draggable("option", "cursorAt", {
                left: Math.floor(this.clientWidth / 2),
                top: Math.floor(this.clientHeight / 2)
            });
        },
        dragstart: function (event, ui) {
            console.log('drag start');
//            event.preventDefault(event);
            return true;
        }
    });

    $("#boardDragger").find('.dragger').droppable({
        hoverClass: "ui-state-hover",
        drop: function (event, ui) {
            return false;
            $(this)
                    .addClass("ui-state-highlight")
                    .find("p")
                    .html("Dropped!");
        }
    });

    $("#boardDragger").find('.cell').droppable({
        hoverClass: "ui-state-hover",
        drop: function (event, ui) {

        }
    });

    $('body').bind('touchstart', function (e) {
        console.log('touchstart');
        divQueue = [];
        lastValidCol = '';
        lastValidRow = '';
        console.log('Touch start');
    });

    $('body').bind('touchend', function (e) {
        console.log('Touch end');
        var randomNo = Math.floor(Math.random() * 10) + 0;
        $('#board').find('.alert-select').each(function () {
            if (!$(this).hasClass('random')) {
                $(this).addClass('random');
                $(this).addClass('random' + randomNo);
            }
        })
    });

    $('#board').find('div').removeClass('alert-select');
}

function isValidMove(dragRow, dragCol) {
    var validMoves = [];
    if (lastValidRow === '' && lastValidCol === '') {
        lastValidRow = parseInt(dragRow);
        lastValidCol = parseInt(dragCol);
        return 'true';
    } else {
        console.log("Last details " + lastValidRow + " " + lastValidCol);
        // Check above
        var aboveRow = eval(lastValidRow - 1);
        if (aboveRow >= 0) {
            validMoves.push(aboveRow + "_" + lastValidCol);
            if (eval(lastValidCol - 1) >= 0) {
                validMoves.push(aboveRow + "_" + eval(lastValidCol - 1));
            }
            if (eval(lastValidCol + 1) <= 4) {
                validMoves.push(aboveRow + "_" + eval(lastValidCol + 1));
            }
        }
        // Check below
        var belowRow = eval(lastValidRow + 1);
        if (aboveRow <= 4) {
            validMoves.push(belowRow + "_" + lastValidCol);
            if (eval(lastValidCol - 1) >= 0) {
                validMoves.push(belowRow + "_" + eval(lastValidCol - 1));
            }
            if (eval(lastValidCol + 1) <= 4) {
                validMoves.push(belowRow + "_" + eval(lastValidCol + 1));
            }
        }
        // Check left
        var leftCol = eval(lastValidCol - 1);
        if (leftCol >= 0) {
            validMoves.push(lastValidRow + "_" + leftCol);
        }
        // Check right
        var rightCol = eval(lastValidCol + 1);
        if (rightCol >= 0) {
            validMoves.push(lastValidRow + "_" + rightCol);
        }
        console.log(validMoves + " " + dragRow + "_" + dragCol);
        if ($.inArray(dragRow + "_" + dragCol, validMoves) !== -1) {
            lastValidRow = parseInt(dragRow);
            lastValidCol = parseInt(dragCol);
            return 'true';
        }
    }
}

function changeCss(className, classValue) {
    // we need invisible container to store additional css definitions
    var cssMainContainer = $('#css-modifier-container');
    if (cssMainContainer.length == 0) {
        var cssMainContainer = $('<div id="css-modifier-container"></div>');
        cssMainContainer.hide();
        cssMainContainer.appendTo($('head'));
    }

    // and we need one div for each class
    classContainer = cssMainContainer.find('div[data-class="' + className + '"]');
    if (classContainer.length == 0) {
        classContainer = $('<div data-class="' + className + '"></div>');
        classContainer.appendTo(cssMainContainer);
    }

    // append additional style
    classContainer.html('<style>' + className + ' {' + classValue + '}</style>');
}