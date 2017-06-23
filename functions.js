
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
    document.body.appendChild(form)
    form.submit();
}

//Set form action
function SetData(){
   var select = document.getElementById('layer_select');
   var layer = select.options[select.selectedIndex].value;
   document.upload_form.action = "/upload/"+layer;
   upload_form.submit();
}