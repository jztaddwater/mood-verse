document.addEventListener("DOMContentLoaded", function() {
    chrome.management.getAll(verseCallback);
});

var apiKey = 'Nism4wChMEVRVUobXFGxS3UWGtDUP2gKRe8xVq6z',
    topics = [],
    topic;

var verseCallback = function() {
    $.getJSON('../data.json', function(json, textStatus) {
        init(json);
    });

    // Compile all topics available from data
    function init(data){
        topics = $.map(data, function(item, index) {
            var topic = data[index].topic;
            $('#select').append('<li rel="'+topic+'">'+topic+'</li>');
        });
        styleSelect(data);

        if (localStorage.verseMood) {
            getVerseByTopic(data);
        }
    }

    function getVerseByTopic(library){
        var topic = localStorage.verseMood;

        library.forEach(function(type){
            if (type.topic == topic) {
                var verses = type.verses;
                chooseRandomVerse(verses);
            }
        });
    }

    // Choose random verse from available verses pertaining to topic
    function chooseRandomVerse(array){
        var randomVerse = array[Math.floor(Math.random() * array.length)];
        getPassage(randomVerse);
    }

    function getPassage(passage){
        $.ajax({
            url: 'https://bibles.org/v2/passages.js?q[]='+passage+'&version=eng-ESV',
            dataType: 'json',
            success: function(json) {
                var script = json.response.search.result.passages[0].text;
                formatPassage(script,passage);
            }
        });
    }

    function formatPassage(passage,cite){
        console.log('change');
        $('#scripture,cite').fadeTo('slow', 0.1, function() {
            changeColor(function(){
                var elem = $(passage);
                elem.find('sup, h3, h1, h2').remove();
                var formatted = elem.text();
                $('#scripture').html(formatted);
                $('cite').html(cite.replace(/\+/g," "));
                $('#scripture,cite').fadeTo('400', 1);
            });
        });
        
    }

    function changeColor(callback){
        $('body').removeClass();
        var num = Math.floor((Math.random() * 5) + 1);
        $('body').addClass('color'+num);
        callback();
    }

    // Styling select menu
    function styleSelect(data){

        var $styledSelect = $('div.select-styled')
            $list = $('ul.select-options'),
            $listItems = $list.children('li');

        $styledSelect.text(localStorage.verseMood);
      
        $styledSelect.click(function(e) {
            e.stopPropagation();
            $(this).toggleClass('active').next('ul.select-options').toggle();
        });
      
        $listItems.click(function(e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            $(this).val($(this).attr('rel'));
            $list.hide();
            localStorage.verseMood = $(this).attr('rel');

            getVerseByTopic(data);
        });
      
        $(document).click(function() {
            $styledSelect.removeClass('active');
            $list.hide();
        });

    }

};