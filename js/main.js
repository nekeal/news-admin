
var apiUrl = 'http://lo5.bielsko.pl:3001/';
var elements = [];
var id = 0, size, z = 1, x = 0;

function replace(id,prevId) {
    // content replace 
    $(".title").eq(prevId).removeClass('active',1000);
    $("#content h1").fadeOut(1000, function () {
        $(this).remove();
    });
    $("#content").append("<h1 style='display:none'>" + elements[id].content + "</h1>");
    $('#content h1').eq(1).css("z-index", z).fadeIn(1000, function () { });
    // .animate({
    // background: "#d8ecf3"
    // // borderRight: "2px dotted #58C1E8",
    // // borderLeft: "2px dotted #58C1E8"
    // },3000);
    $(".title").eq(id).addClass('active',1000);
       z++;
    setTimeout(function () {
        if (id == size - 1)
            getNews(apiUrl);
        else replace(id + 1,id);
    }, 5000);

}
function replaceTitle() {
    for (i = 0; i < 10; i++) {
        if(i<elements.length)
        $(".title").eq(i).html("<h2>"+elements[i].title+"</h2>").removeClass('active');
        else
        $(".title").eq(i).html("").removeClass('active');
    }
}

function getNews(url) {
    elements.length = 0;
    $.ajax({
        async: false,
        url: url + 'news/?status=1',
        method: 'GET'
    })
        .done(function (data) {
            data.forEach(function (content) {
                console.log(content.content + " " + elements.length);
                elements.push(content);
                //                  setTimeout(null,100);     
            });
            size = elements.length;
            replace(0,elements.length-1);
        })
        .fail(function (error) {
            console.log(error);
        });
    replaceTitle();
}

getNews(apiUrl);

// console.log(elements);
// elements.forEach(function(element) {
//     replace(element);
//     console.log("currently replacing "+element);
// }, this);
