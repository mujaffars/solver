var divQueue = [];
var tblRows = 3;
var tblCols = 3;
var lastValidCol = '';
var lastValidRow = '';
var fontVW = 17;
var pzlDtl = {};
var pzlAnswers = '';
var autoCreate = 'true';
var selectTblName = 'Intermediate';

(function () {
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
    createDb();
    if (autoCreate === 'true') {

        //createCustomTables(tblRows, tblCols);
    }
    getPuzzleDtl(selectTblName);
    $('#headerArea').click(function(){
        $('.cracks').show();
    })
    $('.btnApprove').click(function(){
        approvePzl();
    })
    $('.btnAbsolute').click(function(){
        $('body').addClass('bodyAbsolute');
    })
});
function startGame() {
    $('.cracks').html('');
    console.log(pzlDtl);
    for(a=0; a<pzlDtl['answers'].length; a++){
        $('.cracks').append(pzlDtl['answers'][a]+" ");
    }
    $('.cracks').hide();
    $('#themeDiv').html(pzlDtl['theme']);
    var arrGrid = pzlDtl.grid.split(" ");
    createCustomTables(arrGrid[0], arrGrid[1]);
}
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
    createAnswerTable();

    var draggerWidth = parseInt($('.prdrag_0_0').width());
    var ansWidth = parseInt($('#ans_0_0').width());
    var themeDivHeight = parseInt($('#headerArea').height());
    var fontSize = [
        {
            locator: '.row',
            initialSize: 44,
            changeFor: ['height'],
            changeValue: [eval(parseInt($('.board').find('.firstRow').innerWidth()) / tblCols) + 'px;']
        },
        {
            locator: '.cell',
            changeFor: ['height', 'font-size', 'line-height'],
            changeValue: [draggerWidth + 'px;', eval(eval(draggerWidth * 60)) / 100 + 'px;', draggerWidth + 'px;']
        },
        {
            locator: '#solveArea',
            changeFor: ['height'],
            changeValue: [eval($('#board').height() + 10) + 'px;']
        },
        {
            locator: '#headerArea',
            changeFor: ['height'],
            changeValue: [eval($(window).height() * 10 / 100) + 'px;']
        },
        {
            locator: '#selectionArea',
            changeFor: ['height', 'line-height', 'font-size'],
            changeValue: [eval($(window).height() * 5 / 100) + 'px;', eval($(window).height() * 5 / 100) + 'px;', eval($(window).height() * 5 / 100) + 'px;']
        },
        {
            locator: '#boardAnswer .cell',
            changeFor: ['height', 'font-size', 'line-height'],
            changeValue: [ansWidth + 'px;', eval(eval(ansWidth * 60)) / 100 + 'px;', ansWidth + 'px;']
        },
        {
            locator: '#themeDiv',
            changeFor: ['height', 'line-height'],
            changeValue: [themeDivHeight + 'px;', themeDivHeight + 'px;']
        },
    ]
    $.each(fontSize, function (index, val) {
        var cssString = '';
        for (c = 0; c < val.changeFor.length; c++) {
            cssString += val.changeFor[c] + ':' + val.changeValue[c] + ' ';
        }
        changeCss(val.locator, cssString);
    })
    if (tblRows > 4) {
        changeCss('.board', 'width:90%; margin-left:5%;');
    }
    changeCss('#solveArea', 'height:' + eval($('#board').outerHeight(true) + 10) + 'px;');

    //changeCss(".cell", 'height:' + draggerWidth + 'px; line-height:' + draggerWidth + 'px; font-size :' + eval(eval(draggerWidth * 78)) / 100 + 'px;');
//    var ansWidth = parseInt($('#ans_0_0').width());
//    changeCss('#boardAnswer .cell', 'height:' + ansWidth + 'px; line-height:' + ansWidth + 'px; font-size :' + eval(eval(ansWidth * 78)) / 100 + 'px;');
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
                text: pzlDtl['alphas'][i + "_" + j].letter,
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

function createAnswerTable() {
    $('.tblAnswerArea').html('');
    var boardAnswer = jQuery("<div>", {
        id: 'boardAnswer'
    });
    var answers = pzlDtl['answers'];
    console.log(pzlDtl['answerKeys']);
    for (a = 0; a < answers.length; a++) {
        var row = jQuery("<div>", {
            ansRow: a,
            class: 'row ansRow' + a,
            ansKey: pzlDtl['answerKeys'][answers[a]],
            style: "width:" + answers[a].length + "0%",
            wdth: answers[a].length + "0"
        });
        for (b = 0; b < answers[a].length; b++) {
            var col = jQuery("<div>", {
                id: 'ans_' + a + '_' + b,
                class: 'cell alert-select',
                row: i,
                col: j,
                style: "width:" + eval(100 / answers[a].length) + "%"
            });
            row.append(col);
        }
        boardAnswer.append(row);
    }
    $('.tblAnswerArea').append(boardAnswer);

    var fontSize = [
        {
            locator: '#boardAnswer .row',
            changeFor: 'height',
            changeValue: eval(parseInt($('#boardAnswer').innerWidth()) / 10) + 'px;'
        },
        {
            locator: '#boardAnswers .cell',
            changeFor: 'height',
            changeValue: eval(parseInt($('#boardAnswer').innerWidth()) / 10) + 'px;'
        },
        {
            locator: '#boardAnswers .cells',
            changeFor: 'font-size'
        }
    ]
    $.each(fontSize, function (index, val) {
        if (val.locator === '#boardAnswers .cells') {
            changeCss(val.locator, val.changeFor + ': 7vw;');
        } else {
            changeCss(val.locator, val.changeFor + ':' + val.changeValue);
        }
    })

//    $('.tblAnswerArea').find('.row').each(function () {
//        var rowWdth = parseInt($(this).attr('wdth'));
//        
//    })
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
            if ($('.pr' + $(this).attr('id')).hasClass('alert alert-select')) {

            } else {
                if (isValidMove(dragRow, dragCol) === 'true' && !$('.pr' + $(this).attr('id')).hasClass('hideDiv')) {
                    $('.pr' + $(this).attr('id')).addClass('alert alert-select');
                    //$('#selectionArea').append($('.pr' + $(this).attr('id')).text());
                    divQueue.push($(this).attr('id'));
                    showSelection();
                }
            }
        } else {
            // Get the second last element of array
            var second_last_elem = divQueue[divQueue.length - 2]

            if (second_last_elem === $(this).attr('id')) {
                lastValidRow = parseInt($('.pr' + second_last_elem).attr('row'));
                lastValidCol = parseInt($('.pr' + second_last_elem).attr('col'));
                var last_elem = divQueue[divQueue.length - 1];

                $('.pr' + last_elem).removeClass('alert alert-select');
                divQueue.pop();
                showSelection();
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
                $('.pr' + last_elem).removeClass('alert alert-select');
                divQueue.pop();
                showSelection();
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

    $('#boardDragger').bind('touchstart', function (e) {
        $('#selectionArea').text('');
        divQueue = [];
        lastValidCol = '';
        lastValidRow = '';
        $('#board').find('div').removeClass('alert alert-select');
        console.log('Touch start');
    });

    $('#boardDragger').bind('touchend', function (e) {
        console.log('Touch end');
        var selectedAns = $('#selectionArea').text();
//        console.log(pzlDtl['answers']);
        if ($.inArray(selectedAns, pzlDtl['answers']) !== -1) {
            console.log('found');
            var ansKey = pzlDtl.answerKeys[selectedAns];
            var arrSltAns = selectedAns.split("");
            console.log(arrSltAns);
            console.log(ansKey);
            $('#boardAnswer').find('.row').each(function () {
                var attrKey = $(this).attr('anskey');
                var keyFound = false;
                if (attrKey === ansKey) {
                    console.log('FOUND KEY');
                    for (a = 0; a < arrSltAns.length; a++) {
                        var childDiv = $(this).find("div:eq(" + a + ")")
                        console.log("aaa " + a);
                        $('.pr' + divQueue[a]).addClass('hideDiv');
                        $('.pr' + divQueue[a]).effect("transfer", {to: $(childDiv)}, 500, function () {

                        });
                        $(childDiv).text(arrSltAns[a]);
                    }
                    pzlDtl.answerComplete = eval(pzlDtl.answerComplete + 1);
                    //ansMarkComplete(ansKey);
                }
            })
            if(pzlDtl.answers.length === pzlDtl.answerComplete){
                pzlMarkComplete();
            }
        }
        $('#board').find('.alert-select').each(function () {
            $(this).removeClass('alert-select').addClass('alert-wrong');
            setTimeout(function () {
                $('#board').find('.alert-wrong').removeClass('alert alert-wrong');
            }, 300);
        })
    });

    $('#board').find('div').removeClass('alert alert-select');
    $('#selectionArea').text('');
}

function showSelection() {
    console.log(divQueue);
    $('#selectionArea').html('');
    for (i = 0; i < divQueue.length; i++) {
        $('#selectionArea').append($('.pr' + divQueue[i]).text());
    }
}

function isValidMove(dragRow, dragCol) {
    var validMoves = [];
    if (lastValidRow === '' && lastValidCol === '') {
        lastValidRow = parseInt(dragRow);
        lastValidCol = parseInt(dragCol);
        return 'true';
    } else {
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