$("#login").on('click', function () {
    var req = {};
    req.user = $('form>input').eq(0).val();
    req.pass = $('form>input').eq(1).val();
    console.log(req);

    $.ajax(
        {
            url: window.location.href,
            method: "POST",
            dataType: "JSON",
            data: req,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(req.user + ":" + req.pass));
            }
        })
        .done(function (data) {
            console.log(data);
            if (data.error == false) {
                console.log(window.location);
                window.location.replace("http://localhost:3000/api/management");
            }
        })
});