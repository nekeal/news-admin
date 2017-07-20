
var formToDo = $('form[name="todo"]');
var addBtn = formToDo.find('input[type=submit]');
var aLinks = $('a');
var ul = $('.todo ul');
var doneELem = $('.done ul');
var apiUrl = 'http://localhost:4000/';

function getToDo(url) {

    $.ajax({
        url: url + 'tasks/?status=0',
        method: 'GET'
    })
        .done(function (data) {
            data.forEach(function (task) {
                console.log(task);
                addToList(task);
            });

        })
        .fail(function (error) {
            console.log(error);
        });
    // ---------------------------------------------
    $.ajax({
        url: url + 'tasks/?status=1',
        method: 'GET'
    })
        .done(function (data) {
            data.forEach(function (task) {
                console.log(task);
                addToComplitedList(task);
            });

        })
        .fail(function (error) {
            console.log(error);
        });
}

getToDo(apiUrl);



formToDo.on('submit', function (event) {
    event.preventDefault();

    var taskElem = $(this).find('input[name=task]');

    if (taskElem.val().length == 0) {
        taskElem.addClass('error');
        setTimeout(function () {
            taskElem.removeClass('error');
        }, 2000);
    } else {
        $.ajax({
            url: apiUrl + 'tasks',
            data: {
                "id": null,
                "status": 0,
                "task": taskElem.val()
            },
            method: 'POST'
        })
            .done(function (resp) {
                addToList(resp);
            })
            .fail(function () {

            });

    }
})

aLinks.on('click', function (event) {
    event.preventDefault();
    console.log('Zblokowane');
});

// Dodawanie elementu do struktury DOM

function addToList(task) {
    var newElem = $('<li data-id=' + task.id + '>');
    var text = $('<span>').text(task.task);

    var acceptBtn = $('<a>', { 'class': 'btn btn-success btn-xs', 'href': '#' })
        .text('Wykonane');

    var removeBtn = $('<a>', { 'class': 'btn btn-danger btn-xs', 'href': '#' })
        .text('Usuń');

    newElem.append(text).append(acceptBtn).append(removeBtn);

    ul.prepend(newElem);
}
function addToComplitedList(task) {
    var newElem = $('<li data-id=' + task.id + '>');
    var text = $('<span>').text(task.task);

    var acceptBtn = $('<a>', { 'class': 'btn btn-success btn-xs', 'href': '#' })
        .text('Wykonane');

    var removeBtn = $('<a>', { 'class': 'btn btn-danger btn-xs', 'href': '#' })
        .text('Usuń');

    newElem.append(text).append(acceptBtn).append(removeBtn);

    doneELem.prepend(newElem);
}
//Usuwanie elementów ze struktury DOM
$('ul').on('click', 'li a.btn-danger', function () {
    $(this).parent().remove();
})

//Modyfikacja
$('ul').on('click', 'li a.btn-success', function () {
    var self = $(this);
    var id = $(this).parent().data('id');
    console.log(id);
    var data = {
        "id": id,
        "status": 1,
        "task": $(this).prev().text()
    };

    $.ajax({
        url: apiUrl + 'tasks/' + id,
        data: data,
        method: 'PUT'

    })
        .done(function (task) {
            console.log(this);
            self.parent().addClass('done');
            doneELem.append($(self).parent());

        })

    $(this).parent().addClass('done');
    doneELem.append($(this).parent()); //przeniesienie do drugiej listy
})






















