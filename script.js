function disableSpellcheck(){
    var elements = document.getElementsByTagName("textarea");
    var ElemArrayLength = elements.length;
    for (var Elemi = 0; Elemi < ElemArrayLength; Elemi++) {
        elements[Elemi].spellcheck=false
    }
}

function udpdateLabels(){
    const zero_label = document.querySelector('#zero_vartext');
    const one_label = document.querySelector('#one_vartext');
    if (document.querySelector('#zero_char_t').checked) {zero_label.textContent = zero_label.textContent.replace("Unicode charcode","Text character/s");}
    if (document.querySelector('#one_char_t').checked) {one_label.textContent = one_label.textContent.replace("Unicode charcode","Text character/s");}
}

function runonload(){
    disableSpellcheck();
    udpdateLabels();
    document.getElementsByClassName("encrypt")[0].style.display = "inline-block";
}


function ontoggled(checkboxElem,textid) {
    const text_var = document.querySelector('#'+textid)
    if (checkboxElem.checked) {
        text_var.textContent = text_var.textContent.replace("Unicode charcode","Text character/s");
    }
    else {
        text_var.textContent = text_var.textContent.replace("Text character/s","Unicode charcode");
    }
}

function hidemsg(){
    const trigger = document.querySelector('#infobox-t');
    trigger.checked = false;
}

function showmsg(titlevar,text1var,text2var="",duration=6000){
    const trigger = document.querySelector('#infobox-t');
    const title = document.querySelector('#infobox-title');
    const text_1 = document.querySelector('#infobox-first');
    const text_2 = document.querySelector('#infobox-second');
    const ib_button = document.querySelector('#infobox-btn');

    title.innerHTML = titlevar;
    text_1.innerHTML = text1var;
    text_2.innerHTML = text2var;
    trigger.checked = true;

    if(duration == 0){ib_button.style.display = "block";}
    else{
        ib_button.style.display = "none";
        setTimeout(hidemsg, duration);
    }
}

function copytext(elemid) { //https://masteringjs.io/tutorials/fundamentals/copy-to-clipboard
    const element = document.querySelector('#'+elemid);
    element.disabled = false;

    element.select();
    element.setSelectionRange(0, element.value.length);
    document.execCommand('copy');
    element.disabled = true;
}

function text2Binary(byte_length,text) { //https://stackoverflow.com/questions/14430633/how-to-convert-text-to-binary-code-in-javascript
    var saved_bn = ""
    if(isNaN(byte_length)){
        var minimal_bl = 0
        for (var i = 0; i < text.length; i++) {
            var curr_bl = text[i].charCodeAt(0).toString(2).length;
            if(minimal_bl < curr_bl){minimal_bl = curr_bl;}
        }
        byte_length = minimal_bl
        saved_bn = Number(byte_length).toString(2);
    }
    var return_var = text.split('').map((char) => char.charCodeAt(0).toString(2).padStart(byte_length,'0')).join('');
    return [return_var,saved_bn];

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
    const zero = (document.querySelector('#zero_char_t').checked) ? zero_elem.value : String.fromCharCode(parseInt(zero_elem.value, 16));
    const one = (document.querySelector('#one_char_t').checked) ? one_elem.value : String.fromCharCode(parseInt(one_elem.value, 16));
    const password = document.querySelector('#pwd_var').value;
    const decoymsg = document.querySelector('#DecoyMsg_encr').value;
    const compression = document.querySelector('#compr_t').checked;
    var input_var = document.querySelector('#HideMsg_encr').value;
    if(compression){input_var = LZString.compress(input_var);}
    if(password.length > 0){var hiddenmsg = XXTEA.encryptToBase64(input_var,btoa(password));}
    else{var hiddenmsg = input_var;}
    const output = document.querySelector('#HiddenMsg_encr');
    const copybtn = document.querySelector('#copy_encr');

    if(hiddenmsg.length > 0 && zero != one && zero_elem.value.length > 0 && one_elem.value.length > 0){
        try{
            var bin_encoded = text2Binary(bytelength,hiddenmsg);
            var bin_hidden = bin_encoded[0].replaceAll("0",zero).replaceAll("1",one)
            var bin_bl = bin_encoded[1].replaceAll("0",zero).replaceAll("1",one)
            var i = decoymsg.indexOf(' ');
            var decoy_splits = [decoymsg.slice(0,i), decoymsg.slice(i+1)];
            copybtn.disabled = false;
            if(decoymsg.length == 0 && bin_bl.length >= 1){output.value = bin_hidden+" "+bin_bl+decoy_splits[1];;}
            else if(decoymsg.length == 0 && bin_bl.length <= 0){output.value = bin_hidden}
            else if(decoymsg.split(" ").length > 1){output.value = decoy_splits[0]+bin_hidden+" "+bin_bl+decoy_splits[1];}
            else {
                output.value = "";
                copybtn.disabled = true;
                showmsg("Info!","Decoy msg has to be either empty or contain atleast one space");
            }
        }
        catch (e){
            copybtn.disabled = true;
            output.value = "";
            showmsg("Error","Hiding error, reason unknown",e,0);
        }
    }
    else if(one == zero){
        copybtn.disabled = true;
        output.value = "";
        showmsg("Info!","Zero and one cannot be the same unicode");
    }
    else if(zero_elem.value.length == 0){
        copybtn.disabled = true;
        output.value = "";
        showmsg("Info!","Zero cannot be nothing");
    }
    else if(one_elem.value.length == 0){
        copybtn.disabled = true;
        output.value = "";
        showmsg("Info!","One cannot be nothing");
    }
    else{
        copybtn.disabled = true;
        output.value = "";
        showmsg("Info!","You havent set any hidden message");
    }
}

function decrypt(){
    var bytelength = document.querySelector('#byte_length').valueAsNumber;
    const zero_elem = document.querySelector('#zero_var');
    const one_elem = document.querySelector('#one_var');
    const zero = (document.querySelector('#zero_char_t').checked) ? zero_elem.value : String.fromCharCode(parseInt(zero_elem.value, 16));
    const one = (document.querySelector('#one_char_t').checked) ? one_elem.value : String.fromCharCode(parseInt(one_elem.value, 16));
    const password = document.querySelector('#pwd_var').value;
    var hiddenmsg = document.querySelector('#secretmsg_decr').value.split(" ")[0];
    var saved_bl = document.querySelector('#secretmsg_decr').value.split(" ")[1];
    const compression = document.querySelector('#compr_t').checked
    const output = document.querySelector('#HiddenMsg_decr');
    const copybtn = document.querySelector('#copy_decr')
    copybtn.disabled = false;

    if(hiddenmsg.length > 0 && zero != one && zero_elem.value.length > 0 && one_elem.value.length > 0){
        if(hiddenmsg.includes(zero) ||hiddenmsg.includes(one)){
            var regrem = new RegExp('[^'+zero+one+']', 'g');
            hiddenmsg = hiddenmsg.replace(regrem,"");
            hiddenmsg = hiddenmsg.replaceAll(zero,"0").replaceAll(one,"1");
            if(saved_bl == null){
                output.value = "";
                copybtn.disabled = true;
                showmsg("Info!","This Message Wasnt encrypted in Auto Mode, Byte Length Cannot be auto");
            }
            else{
                saved_bl = saved_bl.replace(regrem,"");
                saved_bl = saved_bl.replaceAll(zero,"0").replaceAll(one,"1");
                if(saved_bl.length <= 0 && isNaN(bytelength)){
                    output.value = "";
                    copybtn.disabled = true;
                    showmsg("Info!","This Message Wasnt encrypted in Auto Mode, Byte Length Cannot be auto");
                }
                else{
                    if(isNaN(bytelength)){bytelength = parseInt(saved_bl, 2);}
                    if(password.length > 0){
                        try{var decrypted_text = XXTEA.decryptFromBase64(binary2Text(bytelength,hiddenmsg),btoa(password));}
                        catch (e){showmsg("Info!","The message you are trying to decrypt is not password locked or the password is incorrect");}
                    }
                    else{var decrypted_text = binary2Text(bytelength,hiddenmsg);}
                    output.value = (compression) ? LZString.decompress(decrypted_text) : decrypted_text;
                }
            }
        }
        else{
            output.value = "";
            copybtn.disabled = true;
            showmsg("Info!","This Message Doesnt contain any hidden message","or characters you set for 0 and 1");
        }
    }
    else if(one == zero){
        output.value = "";
        copybtn.disabled = true;
        showmsg("Info!","Zero and one cannot be the same unicode");
    }
    else if(zero_elem.value.length == 0){
        output.value = "";
        copybtn.disabled = true;
        showmsg("Info!","Zero cannot be nothing");
    }
    else if(one_elem.value.length == 0){
        output.value = "";
        copybtn.disabled = true;
        showmsg("Info!","One cannot be nothing");
    }
    else{
        output.value = "";
        copybtn.disabled = true;
        showmsg("Info!","First field cannot be empty");
    }
}

function showCharcodes(){
    var input = document.querySelector('#sourcetext_inp').value;
    const output = document.querySelector('#listedcc_table');
    const output_label = document.querySelector('#listedcc_label');

    if(input.length > 0){
        var all_chars = {};
        var inputLength = input.length;
        for (var Inpi = 0; Inpi < inputLength; Inpi++) {
            var curr_char = input.charAt(Inpi);
            var curr_charc = input.charCodeAt(Inpi).toString(16);
            if (curr_char in all_chars){all_chars[curr_char][1]++;}
            else{all_chars[curr_char] = [curr_charc,1];}
        }

        var old_tbody = output.childNodes[1];
        var new_tbody = document.createElement('tbody');
        old_tbody.parentNode.replaceChild(new_tbody, old_tbody) //https://stackoverflow.com/a/7271547
        var row = output.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = "Character";
        cell2.innerHTML = "Charcode";
        cell3.innerHTML = "Amount";
        var all_chars_length = Object.keys(all_chars).length;
        for (var aci = 0; aci < all_chars_length; aci++) {
            var curr_char = Object.keys(all_chars)[aci];
            var curr_charc = all_chars[curr_char][0];
            var curr_count = all_chars[curr_char][1];
            var row = output.insertRow(aci+1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = curr_char;
            cell2.innerHTML = curr_charc;
            cell3.innerHTML = curr_count;
        }

        output.style.display = "inline-block";
        output.style.display = "inline-block";
    }
    else{
        output.style.display = "";
        output.style.display = "";
        showmsg("Info!","First field cannot be empty");
    }
}

function switch_mode(ind){
    const encbtn = document.querySelector('#encr_mode');
    const decrbtn = document.querySelector('#decr_mode');
    const lcharcbtn = document.querySelector('#lcharc_mode');
    const charcbtn = document.querySelector('#charc_mode');
    const pinfobtn = document.querySelector('#info_mode');
    const enc = document.getElementsByClassName("encrypt")[0];
    const decr = document.getElementsByClassName("decrypt")[0];
    const lchar = document.getElementsByClassName("listcharcodes")[0];
    const char = document.getElementsByClassName("charcodes")[0];
    const pinfo = document.getElementsByClassName("pageinfo")[0];
    encbtn.classList = (ind == 0) ? "selected" : "";
    decrbtn.classList = (ind == 1) ? "selected" : "";
    lcharcbtn.classList = (ind == 2) ? "selected" : "";
    charcbtn.classList = (ind == 3) ? "selected" : "";
    pinfobtn.classList = (ind == 4) ? "selected" : "";
    enc.style.display = (ind == 0) ? "inline-block" : "";
    decr.style.display = (ind == 1) ? "inline-block" : "";
    lchar.style.display = (ind == 2) ? "inline-block" : "";
    char.style.display = (ind == 3) ? "inline-block" : "";
    pinfo.style.display = (ind == 4) ? "inline-block" : "";
}
