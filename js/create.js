var autoCreate = 'false';
var pzlWordArr = '';
var selectColor = ['#d9534f', '#a94442', '#2e6da4', '#5cb85c', '#8a6d3b', '#8a3b5d', '#f0ad4e'];
var randomClass = ['#d9534f', '#a94442', '#2e6da4', '#5cb85c', '#8a6d3b', '#8a3b5d', '#f0ad4e'];
var gridRows;
var gridCols;
$(function () {

    $(".elemLookAt").keyup(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13) {
            $(".btnLookAt").trigger('click');
        }
    });

    $(".btnLookAt").click(function () {
        $.ajax({ 
            url: 'http://api.onelook.com/words?ml=' + $('.elemLookAt').val() + '&sp=*',
            type: 'GET',
            dataType: 'json',
            async: true,
            error: function () {
            },
            success: function (resp) {
                $('.apiWordsArea .secs').html('');
                $.each(resp, function (index, val) {
                    var theWord = val.word;
                    if (theWord.length === 3)
                        $('.apiWordsArea .threes').append('<div class="divParent"><div class="clsApiWord alert alert-warning">' + val.word + ' </div>' + theWord.length + '</div>');
                    else if (theWord.length === 4)
                        $('.apiWordsArea .fours').append('<div class="divParent"><div class="clsApiWord alert alert-info">' + val.word + ' </div>' + theWord.length + '</div>');
                    else if (theWord.length === 5)
                        $('.apiWordsArea .fives').append('<div class="divParent"><div class="clsApiWord alert alert-warning">' + val.word + ' </div>' + theWord.length + '</div>');
                    else if (theWord.length > 6 && theWord.length <= 20)
                        $('.apiWordsArea .other' + theWord.length).append('<div class="divParent"><div class="clsApiWord alert alert-success">' + val.word + ' </div>' + theWord.length + '</div>');
                    else if (theWord.length > 20)
                        $('.apiWordsArea .other_more').append('<div class="divParent"><div class="clsApiWord alert alert-block">' + val.word + ' </div>' + theWord.length + '</div>');
                })
                $('.apiWordsArea .clsApiWord').click(function () {
                    $(this).toggleClass('alert-selected');
                })
            }
        });
    });

    $(".btnPassOn").click(function () {
        $('#themeDiv').text($('.elemLookAt').val());
        $('#themeDiv, #solveArea, #wordsSelected').show();
        $('.div-lookup').hide();
        $('#wordsSelected').html('');
        $('.clsApiWord').each(function () {
            if ($(this).hasClass('alert-selected')) {
                var selectedDiv = jQuery("<div>", {
                    id: 'selectedDiv',
                    text: $(this).text(),
                    class: 'alert alert-info choosenWords'
                });
                var choosenWord = $(this).text();
                choosenWord = choosenWord.trim();
                var wordTxtCount = jQuery("<div>", {
                    text: choosenWord.length,
                    class: 'alert alert-info wordTxtCount'
                });
                $('#wordsSelected').append(selectedDiv);
                $('#wordsSelected').append(wordTxtCount);
            }
        })
        $('#wordsSelected').find('.choosenWords').click(function () {
            $('#wordsSelected .choosenWords').removeClass('alert-selected');
            $(this).addClass('alert-selected');
            var word = $(this).text();
            word = word.trim();
            pzlWordArr = word.split('');
        })

        gridRows = $("input[name='gridRows']:checked").val();
        gridCols = $("input[name='gridCols']:checked").val();
        createCustomTables(gridRows, gridCols);
    });

    $('.btnBack').click(function () {
        $('#themeDiv, #solveArea, #wordsSelected').hide();
        $('.div-lookup').show();
    })

    $('.btnCreatePzl').click(function () {
        var addStr = '';
        var key = $('#themeDiv').text();
        var words = '';
        $('#wordsSelected').find('.choosenWords').each(function () {
            words += $(this).text();
        })
        key = key.trim();
        words = words.trim();
        $('#board').find('.cell').each(function () {
            if (addStr !== "") {
                addStr += " ";
            }
            addStr += $(this).attr('row') + "_" + $(this).attr('col') + "_" + $(this).text();
            console.log(addStr)
        })
        var grid = gridRows + " " + gridCols;
        dbShell.transaction(function (tx) {
            tx.executeSql("INSERT INTO prelevels(alphas,key,words, grid) values(?,?,?,?)", [addStr, key, words, grid], function (tx, results) {
                alert('Done');
            });
        }, dbErrorHandler);

    })

    $('.btnExport').click(function () {
        dbShell.transaction(function (tx) {
            tx.executeSql("SELECT id, alphas, key, words, grid FROM prelevels", [], function (tx, results) {
                var pzlString = '';
                for (i = 0; i < results.rows.length; i++) {
                    pzlString += results.rows[i].id + " |==| " + results.rows[i].alphas + " |==| " + results.rows[i].key + " |==| " + results.rows[i].words + " |==| " + results.rows[i].grid + " |$$| ";
                }
                $('#txtExport').html(pzlString);
                SelectText('txtExport');
            })
        })
    })

    $('.btnRemove').click(function () {
        $(this).toggleClass('btn-info');
    })

});

function SelectText(element) {
    var doc = document
            , text = doc.getElementById(element)
            , range, selection
            ;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}