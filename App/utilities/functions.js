//Menu opening
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

//Menu closing
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

//Clear notifications
function clear_notification() {
    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', '/clear_notification');
    form.style.display = 'hidden';
    var element1 = document.createElement("input");
    element1.name="url"
    element1.value = window.location.pathname;
    element1.type = 'hidden'
    form.appendChild(element1);
    document.body.appendChild(form)
    form.submit();
}

//Set form action
function SetData() {
    var select = document.getElementById('layer_select');
    var layer = select.options[select.selectedIndex].value;
    document.upload_form.action = "/upload/" + layer;
    upload_form.submit();
}

// Set the date we're counting down to
var countDownDate = new Date("Oct 8, 2017 11:30:00").getTime();

// Update the count down every 1 second
var x = setInterval(function () {

    // Get todays date and time
    var now = new Date().getTime();

    // Find the distance between now an the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("countdown").innerHTML = days + " giorni " + hours + " ore " +
        minutes + " minuti " + seconds + " secondi";

    // If the count down is finished, write some text 
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "Ci siamo sposati!!!!";
    }
}, 1000);