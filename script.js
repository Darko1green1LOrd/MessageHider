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

function copytext(elemid) { //https://masteringjs.io/tutorials/fundamentals/copy-to-clipboard
    const element = document.querySelector('#'+elemid);
    element.disabled = false;

    element.select();
    element.setSelectionRange(0, element.value.length);
    document.execCommand('copy');
    element.disabled = true;
}

function runonload(){
    disableSpellcheck();
}

function text2Binary(byte_length,text) { //https://stackoverflow.com/questions/14430633/how-to-convert-text-to-binary-code-in-javascript
    var length = text.length,
        output = [];
    for (var i = 0;i < length; i++) {
        var bin = text[i].charCodeAt().toString(2);
        output.push(Array(byte_length-bin.length+1).join("0") + bin);
    }
    return output.join("");
}

function binary2Text(byte_length,text) { //https://stackoverflow.com/questions/14430633/how-to-convert-text-to-binary-code-in-javascript https://stackoverflow.com/questions/3172985/javascript-use-variable-in-string-match
    var checkre = new RegExp('[10]{'+byte_length+'}', 'g');
    var runre = new RegExp('([10]{'+byte_length+'}|\s+)', 'g');
    if(text.match(checkre)){
        var wordFromBinary = text.match(runre).map(function(fromBinary){
            return String.fromCharCode(parseInt(fromBinary, 2) );
        }).join('');
        return wordFromBinary;//console.log(wordFromBinary);
    }
}

function encrypt(){
    const bytelength = document.querySelector('#byte_length').valueAsNumber;
    const zero_elem = document.querySelector('#zero_var');
    const one_elem = document.querySelector('#one_var');
    const zero = String.fromCharCode(parseInt(zero_elem.value, 16));
    const one = String.fromCharCode(parseInt(one_elem.value, 16));
    const password = document.querySelector('#pwd_var').value;
    const decoymsg = document.querySelector('#DecoyMsg_encr').value;
    if(password.length > 0){var hiddenmsg = XXTEA.encryptToBase64(document.querySelector('#HideMsg_encr').value,btoa(password));}
    else{var hiddenmsg = document.querySelector('#HideMsg_encr').value;}
    const output = document.querySelector('#HiddenMsg_encr');
    const copybtn = document.querySelector('#copy_encr')

    if(hiddenmsg.length > 0 && zero != one && zero_elem.value.length > 0 && one_elem.value.length > 0 && isNaN(bytelength) == false){
        try{
            var bin_encoded = text2Binary(bytelength,hiddenmsg);
            var btn_hidden = bin_encoded.replaceAll("0",zero).replaceAll("1",one)
            var i = decoymsg.indexOf(' ');
            var decoy_splits = [decoymsg.slice(0,i), decoymsg.slice(i+1)];
            copybtn.disabled = false;
            if(decoymsg.length == 0){output.value = btn_hidden;}
            else if(decoymsg.split(" ").length > 1){output.value = decoy_splits[0]+btn_hidden+" "+decoy_splits[1];}
            else {
                output.value = "";
                copybtn.disabled = true;
                showmsg("Decoy msg has to be either empty or contain atleast one space");
            }
        }
        catch (e){
            copybtn.disabled = true;
            output.value = "";
            if (e instanceof RangeError){showmsg("Hiding error, characters like ľščťžýáíéđŧø can cause this");}
            else{showmsg("Hiding error, reason unknown   "+e);}
        }
    }
    else if(one == zero){
        copybtn.disabled = true;
        output.value = "";
        showmsg("Zero and one cannot be the same unicode");
    }
    else if(isNaN(bytelength)){
        copybtn.disabled = true;
        output.value = "";
        showmsg("Byte Length Cannot be nothing");
    }
    else if(zero_elem.value.length == 0){
        copybtn.disabled = true;
        output.value = "";
        showmsg("Zero cannot be nothing");
    }
    else if(one_elem.value.length == 0){
        copybtn.disabled = true;
        output.value = "";
        showmsg("One cannot be nothing");
    }
    else{
        copybtn.disabled = true;
        output.value = "";
        showmsg("You havent set any hidden message");
    }
}

function decrypt(){
    const bytelength = document.querySelector('#byte_length').valueAsNumber;
    const zero_elem = document.querySelector('#zero_var');
    const one_elem = document.querySelector('#one_var');
    const zero = String.fromCharCode(parseInt(zero_elem.value, 16));
    const one = String.fromCharCode(parseInt(one_elem.value, 16));
    const password = document.querySelector('#pwd_var').value;
    var hiddenmsg = document.querySelector('#secretmsg_decr').value;
    const output = document.querySelector('#HiddenMsg_decr');
    const copybtn = document.querySelector('#copy_decr')
    copybtn.disabled = false;

    if(hiddenmsg.length > 0 && zero != one && zero_elem.value.length > 0 && one_elem.value.length > 0 && isNaN(bytelength) == false){
        if(hiddenmsg.includes(zero) ||hiddenmsg.includes(one)){
            var regrem = new RegExp('[^'+zero+one+']', 'g');
            hiddenmsg = hiddenmsg.replace(regrem,"");
            hiddenmsg = hiddenmsg.replaceAll(zero,"0").replaceAll(one,"1");
            if(password.length > 0){
                try{var decrypted_text = XXTEA.decryptFromBase64(binary2Text(bytelength,hiddenmsg),btoa(password));}
                catch (e){showmsg("The message you are trying to decrypt is not password locked or the password is incorrect");}
            }
            else{var decrypted_text = binary2Text(bytelength,hiddenmsg);}
            output.value = decrypted_text;
        }
        else{
            output.value = "";
            copybtn.disabled = true;
            showmsg("This Message Doesnt contain any hidden message");
        }
    }
    else if(one == zero){
        output.value = "";
        copybtn.disabled = true;
        showmsg("Zero and one cannot be the same unicode");
    }
    else if(isNaN(bytelength)){
        output.value = "";
        copybtn.disabled = true;
        showmsg("Byte Length Cannot be nothing");
    }
    else if(zero_elem.value.length == 0){
        output.value = "";
        copybtn.disabled = true;
        showmsg("Zero cannot be nothing");
    }
    else if(one_elem.value.length == 0){
        output.value = "";
        copybtn.disabled = true;
        showmsg("One cannot be nothing");
    }
    else{
        output.value = "";
        copybtn.disabled = true;
        showmsg("First field cannot be empty");
    }
}

function encrypt_mode(){
    const encbtn = document.querySelector('#encr_mode');
    const decrbtn = document.querySelector('#decr_mode');
    const charcbtn = document.querySelector('#charc_mode');
    const pinfobtn = document.querySelector('#info_mode');
    const enc = document.getElementsByClassName("encrypt")[0];
    const decr = document.getElementsByClassName("decrypt")[0];
    const char = document.getElementsByClassName("charcodes")[0];
    const pinfo = document.getElementsByClassName("pageinfo")[0];
    encbtn.classList = "selected";
    decrbtn.classList = "";
    charcbtn.classList = "";
    pinfobtn.classList = "";
    enc.style.display = "inline-block";
    decr.style.display = "none";
    char.style.display = "none";
    pinfo.style.display = "none";
}
function decrypt_mode(){
    const encbtn = document.querySelector('#encr_mode');
    const decrbtn = document.querySelector('#decr_mode');
    const charcbtn = document.querySelector('#charc_mode');
    const pinfobtn = document.querySelector('#info_mode');
    const enc = document.getElementsByClassName("encrypt")[0];
    const decr = document.getElementsByClassName("decrypt")[0];
    const char = document.getElementsByClassName("charcodes")[0];
    const pinfo = document.getElementsByClassName("pageinfo")[0];
    decrbtn.classList = "selected";
    encbtn.classList = "";
    charcbtn.classList = "";
    pinfobtn.classList = "";
    decr.style.display = "inline-block";
    enc.style.display = "none";
    char.style.display = "none";
    pinfo.style.display = "none";
}
function charc_mode(){
    const encbtn = document.querySelector('#encr_mode');
    const decrbtn = document.querySelector('#decr_mode');
    const charcbtn = document.querySelector('#charc_mode');
    const pinfobtn = document.querySelector('#info_mode');
    const enc = document.getElementsByClassName("encrypt")[0];
    const decr = document.getElementsByClassName("decrypt")[0];
    const char = document.getElementsByClassName("charcodes")[0];
    const pinfo = document.getElementsByClassName("pageinfo")[0];
    decrbtn.classList = "";
    encbtn.classList = "";
    charcbtn.classList = "selected";
    pinfobtn.classList = "";
    decr.style.display = "none";
    enc.style.display = "none";
    char.style.display = "inline-block";
    pinfo.style.display = "none";
}

function info_mode(){
    const encbtn = document.querySelector('#encr_mode');
    const decrbtn = document.querySelector('#decr_mode');
    const charcbtn = document.querySelector('#charc_mode');
    const pinfobtn = document.querySelector('#info_mode');
    const enc = document.getElementsByClassName("encrypt")[0];
    const decr = document.getElementsByClassName("decrypt")[0];
    const char = document.getElementsByClassName("charcodes")[0];
    const pinfo = document.getElementsByClassName("pageinfo")[0];
    decrbtn.classList = "";
    encbtn.classList = "";
    charcbtn.classList = "";
    pinfobtn.classList = "selected";
    decr.style.display = "none";
    enc.style.display = "none";
    char.style.display = "none";
    pinfo.style.display = "inline-block";
}
