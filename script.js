function disableSpellcheck(){
    var elements = document.getElementsByTagName("textarea");
    var ElemArrayLength = elements.length;
    for (var Elemi = 0; Elemi < ElemArrayLength; Elemi++) {
        elements[Elemi].spellcheck=false
    }
}

function hidemsg(){
    const popup = document.querySelector('#infobox')
    popup.style.display = "none";
}
function showmsg(text){
    const popup = document.querySelector('#infobox')
    popup.style.display = "block";
    document.getElementById("popup_text").textContent = text;

    setTimeout(hidemsg, 3000);
}

function runonload(){
    disableSpellcheck();
}

function vist_page(link){
    console.log(link);
}
