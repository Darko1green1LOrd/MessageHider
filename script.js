function disableSpellcheck(){
    var elements = document.getElementsByTagName("textarea");
    var ElemArrayLength = elements.length;
    for (var Elemi = 0; Elemi < ElemArrayLength; Elemi++) {
        elements[Elemi].spellcheck=false
    }
}

function udpdateLabels(){
    const zero_label = ge('zero_vartext');
    const one_label = ge('one_vartext');
    if (ge('zero_char_t').checked) {zero_label.textContent = zero_label.textContent.replace("Unicode charcode","Text character/s");}
    if (ge('one_char_t').checked) {one_label.textContent = one_label.textContent.replace("Unicode charcode","Text character/s");}
}


function autoresize(elem){
    const auto_resize = ge("autores_t");
    const scroll_pos = document.documentElement.scrollTop || document.body.scrollTop ;
    elem.style.height = 'auto';
    if (auto_resize.checked){
        switch_mode("showall");
        var height = (elem.scrollHeight > 146) ? elem.scrollHeight : 146;
        elem.style.height = height + 'px';
        switch_mode("restore");
        document.documentElement.scrollTop = document.body.scrollTop = scroll_pos; //Clicking encrypt slightly moves the scroll up , this is to prevent that
    }
}

function calcLength(source_elem,grab=false){
    const calc_l = ge("lengthc_t");

    if(grab){source_elem = ge(source_elem);}
    ge(source_elem.id.split("_")[0]+"_l").innerHTML = (calc_l.checked && source_elem.value != 0) ? source_elem.value.length : "";
    autoresize(source_elem);
}

const inputHandler = function(e){calcLength(e.target);} //https://stackoverflow.com/questions/574941/best-way-to-track-onchange-as-you-type-in-input-type-text

var sources = ["DecoyMsg_encr","HideMsg_encr","secretmsg_decr","sourcetext_inp"]
var outputs = ["DHiddenMsg_decr","HiddenMsg_encr"]

function setup_ChangeDetectors(){
    var sources_length = sources.length
    for (var si = 0; si < sources_length; si++){
        var source = ge(sources[si]);
        source.addEventListener('input', inputHandler);
        source.addEventListener('propertychange', inputHandler); // for IE8
        calcLength(source);
    }
    var outputs_length = outputs.length
    for (var oi = 0; oi < outputs_length; oi++){
        var source = ge(outputs[oi]);
        calcLength(source);
    }
}

function runonload(){
    disableSpellcheck();
    udpdateLabels();
    setup_ChangeDetectors();
    run_customselect();
    changetheme();
    ge("encrypt","geba").style.display = "inline-block";
}

function update_textfields(){
    var sando = sources.concat(outputs);
    var sando_length = sando.length;
    for (var so = 0; so < sando_length; so++){
        var source = ge(sando[so]);
        calcLength(source);
    }
}

function changetheme(inp=null,elem=null){
    if(inp == null){inp = ge("stylesel-db").value;}
    let root = document.documentElement;
    ge("stylesel_div").style.display = (inp == "c") ? "block" : "";
    ge("stylesel_emergency_toggle","geba").style.display = (inp == "c") ? "block" : "";
    ge("emergency_sr").style.display = (inp == "c" && ge("stylesel_t").checked) ? "block" : "";

    if (inp == "reset"){
        ge("stylesel-db").selectedIndex = 1
        const selected_itm = ge("stylesel-db");
        ge("select-selected","geba").innerHTML = selected_itm.options[selected_itm.selectedIndex].innerHTML;
    }

    var styles = {
        "dg":{
            "--bodycolor": "#000",
            "--inputcolor": "#171817",
            "--contpanel-colone": "none",
            "--contpanel-coltwo": "none"
        }
    }

    var all_stylevars = ge("stylesel_table").children[0].children;
    var all_stylevars_length = all_stylevars.length;
    for (var asv = 1; asv < all_stylevars_length; asv++) {
        elem = all_stylevars[asv].children[1].children[0];
        if (inp != "c"){elem.value = elem.dataset.defvalue;}
        if (Object.keys(styles).indexOf(inp) != -1){ //Check if the selected input is in styles
            if (Object.keys(styles[inp]).indexOf(elem.dataset.varid) != -1){
                elem.value = styles[inp][elem.dataset.varid];
            }
        }
        var colortile = elem.parentElement.parentElement.children[2];
        colortile.style.backgroundColor = "";colortile.style.backgroundColor = (elem.value != "") ? elem.value : elem.dataset.defvalue;
        root.style.setProperty(elem.dataset.varid, elem.value);
    }
}

function settingChanged(elem){
    const elem_id = elem.id;
    if (elem_id == "autores_t"){update_textfields();}
    else if (elem_id == "lengthc_t"){update_textfields();}
    else if (elem_id == "msgdura_v"){
        if (elem.value == ""){
            elem.value = (elem.oldvalue >= 0 && elem.oldvalue <= 100) ? elem.oldvalue : 6;
            showmsg("Error","This field cannot be empty","Restoring previous value");
        }
    }
    else if (elem_id == "stylesel-db"){changetheme(elem.value);}
    else if (elem.classList[0] == "customstyle"){
        let root = document.documentElement;
        var colortile = elem.parentElement.parentElement.children[2];
        colortile.style.backgroundColor = "";colortile.style.backgroundColor = (elem.value != "") ? elem.value : elem.dataset.defvalue;
        root.style.setProperty(elem.dataset.varid, elem.value);
    }
    else if (elem_id == "stylesel_t"){ge("emergency_sr").style.display = (ge("stylesel-db").value == "c" && ge("stylesel_t").checked) ? "block" : "";}

}

function ge(elem,mode="gebi"){
    if (mode == "qs"){return document.querySelector("#"+elem);}
    else if (mode == "gebi"){return document.getElementById(elem);}
    else if (mode == "geba"){return document.getElementsByClassName(elem)[0];}
}

function ontoggled(checkboxElem,textid) {
    const text_var = ge(''+textid)
    if (checkboxElem.checked) {
        text_var.textContent = text_var.textContent.replace("Unicode charcode","Text character/s");
    }
    else {
        text_var.textContent = text_var.textContent.replace("Text character/s","Unicode charcode");
    }
}

function hidemsg(){
    const trigger = ge('infobox-t');
    trigger.checked = false;
}

function showmsg(titlevar,text1var,text2var="",duration=Number(ge("msgdura_v").value)*1000){
    const trigger = ge('infobox-t');
    const title = ge('infobox-title');
    const text_1 = ge('infobox-first');
    const text_2 = ge('infobox-second');
    const ib_button = ge('infobox-btn');

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

function copytext(elemid) { //https://stackoverflow.com/questions/28001722/how-to-catch-uncaught-exception-in-promise
    const element = ge(''+elemid);
    navigator.clipboard.writeText(element.value);
}

window.addEventListener("unhandledrejection", function(promiseRejectionEvent) {
    showmsg("Oops","Failed to copy the text automatically","you will have to copy it manually");
}); 

function disable(textfield,button){
    textfield.value = "";
    button.disabled = true;
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
    const bytelength = ge('byte_length').valueAsNumber;
    const zero_elem = ge('zero_var');
    const one_elem = ge('one_var');
    const zero = (ge('zero_char_t').checked) ? zero_elem.value : String.fromCharCode(parseInt(zero_elem.value, 16));
    const one = (ge('one_char_t').checked) ? one_elem.value : String.fromCharCode(parseInt(one_elem.value, 16));
    const password = ge('pwd_var').value;
    const decoymsg = ge('DecoyMsg_encr').value;
    const compression = ge('compr_t').checked;
    var input_var = ge('HideMsg_encr').value;
    if(compression){input_var = LZString.compress(input_var);}
    if(password.length > 0){var hiddenmsg = XXTEA.encryptToBase64(input_var,btoa(password));}
    else{var hiddenmsg = input_var;}
    const output = ge('HiddenMsg_encr');
    const copybtn = ge('copy_encr');

    if(hiddenmsg.length == 0){
        disable(output,copybtn);
        showmsg("Info!","You havent set any hidden message");
    }
    else if(one == zero){
        disable(output,copybtn);
        showmsg("Info!","Zero and one cannot be the same unicode");
    }
    else if(zero_elem.value.length == 0){
        disable(output,copybtn);
        showmsg("Info!","Zero cannot be nothing");
    }
    else if(one_elem.value.length == 0){
        disable(output,copybtn);
        showmsg("Info!","One cannot be nothing");
    }
    else{
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
                disable(output,copybtn);
                showmsg("Info!","Decoy msg has to be either empty or contain atleast one space");
            }
        }
        catch (e){
            disable(output,copybtn);
            showmsg("Error","Hiding error, reason unknown",e,0);
        }
    }
    calcLength(output);
}

function decrypt(){
    var bytelength = ge('byte_length').valueAsNumber;
    const zero_elem = ge('zero_var');
    const one_elem = ge('one_var');
    const zero = (ge('zero_char_t').checked) ? zero_elem.value : String.fromCharCode(parseInt(zero_elem.value, 16));
    const one = (ge('one_char_t').checked) ? one_elem.value : String.fromCharCode(parseInt(one_elem.value, 16));
    const password = ge('pwd_var').value;
    var hiddenmsg = ge('secretmsg_decr').value.split(" ")[0];
    var saved_bl = ge('secretmsg_decr').value.split(" ")[1];
    const compression = ge('compr_t').checked
    const output = ge('DHiddenMsg_decr');
    const copybtn = ge('copy_decr')
    copybtn.disabled = false;

    if(hiddenmsg.length == 0){
        disable(output,copybtn);
        showmsg("Info!","First field cannot be empty");
    }
    else if(one == zero){
        disable(output,copybtn);
        showmsg("Info!","Zero and one cannot be the same unicode");
    }
    else if(zero_elem.value.length == 0){
        disable(output,copybtn);
        showmsg("Info!","Zero cannot be nothing");
    }
    else if(one_elem.value.length == 0){
        disable(output,copybtn);
        showmsg("Info!","One cannot be nothing");
    }
    else{
        if(hiddenmsg.includes(zero) || hiddenmsg.includes(one)){
            var regrem = new RegExp('[^'+zero+one+']', 'g');
            hiddenmsg = hiddenmsg.replace(regrem,"");
            hiddenmsg = hiddenmsg.replaceAll(zero,"0").replaceAll(one,"1");
            if(saved_bl == null){
                disable(output,copybtn);
                showmsg("Info!","This Message Wasnt encrypted in Auto Mode, Byte Length Cannot be auto");
            }
            else{
                saved_bl = saved_bl.replace(regrem,"");
                saved_bl = saved_bl.replaceAll(zero,"0").replaceAll(one,"1");
                if(saved_bl.length <= 0 && isNaN(bytelength)){
                    disable(output,copybtn);
                    showmsg("Info!","This Message Wasnt encrypted in Auto Mode, Byte Length Cannot be auto");
                }
                else{
                    var cont = true;
                    if(isNaN(bytelength)){bytelength = parseInt(saved_bl, 2);}
                    if(password.length > 0){
                        try{var decrypted_text = XXTEA.decryptFromBase64(binary2Text(bytelength,hiddenmsg),btoa(password));}
                        catch (e){
                            disable(output,copybtn);
                            cont = false;
                            showmsg("Info!","The message you are trying to decrypt is not password locked or the password is incorrect","Or the byte length is incorrect");
                        }
                    }
                    else{var decrypted_text = binary2Text(bytelength,hiddenmsg);}
                    if(cont){output.value = (compression) ? LZString.decompress(decrypted_text) : decrypted_text;}
                }
            }
        }
        else{
            disable(output,copybtn);
            showmsg("Info!","This Message Doesnt contain any hidden message","or characters you set for 0 and 1");
        }
    }
    calcLength(output);
}

function showCharcodes(ignorewarning){
    var input = ge('sourcetext_inp').value;
    const output = ge('listedcc_table');
    const output_label = ge('listedcc_label');

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
        output_label.style.display = "block";
    }
    else{
        output.style.display = "";
        output_label.style.display = "";
        if(!ignorewarning){showmsg("Info!","First field cannot be empty");}
    }
}

function switch_mode(ind){
    const encbtn = ge('encr_mode');
    const decrbtn = ge('decr_mode');
    const lcharcbtn = ge('lcharc_mode');
    const charcbtn = ge('charc_mode');
    const pinfobtn = ge('info_mode');
    const settingsmbtn = ge('settings_mode');
    const enc = ge("encrypt","geba");
    const decr = ge("decrypt","geba");
    const lchar = ge("listcharcodes","geba");
    const char = ge("charcodes","geba");
    const pinfo = ge("pageinfo","geba");
    const settingsm = ge("settingsp","geba");
    if (typeof(ind) == "number"){
        encbtn.classList = (ind == 0) ? "selected" : "";
        decrbtn.classList = (ind == 1) ? "selected" : "";
        lcharcbtn.classList = (ind == 2) ? "selected" : "";
        charcbtn.classList = (ind == 3) ? "selected" : "";
        pinfobtn.classList = (ind == 4) ? "selected" : "";
        settingsmbtn.classList = (ind == 5) ? "selected" : "";
        enc.style.display = (ind == 0) ? "inline-block" : "";
        decr.style.display = (ind == 1) ? "inline-block" : "";
        lchar.style.display = (ind == 2) ? "inline-block" : "";
        char.style.display = (ind == 3) ? "inline-block" : "";
        pinfo.style.display = (ind == 4) ? "inline-block" : "";
        settingsm.style.display = (ind == 5) ? "inline-block" : "";
    }
    else{
        var all_btns = [encbtn.classList[0],decrbtn.classList[0],lcharcbtn.classList[0],charcbtn.classList[0],pinfobtn.classList[0],settingsmbtn.classList[0]];
        var sel_mode = all_btns.indexOf("selected");
        var all_tabs = [enc,decr,lchar,char,pinfo,settingsm]
        var all_tabs_length = all_tabs.length;
        for (var ati = 0; ati < all_tabs_length; ati++) {
            if (ind == "showall"){
                all_tabs[ati].style.display = "inline-block";
                if (ati == sel_mode){
                    all_tabs[ati].style.visibility = "visible";
                }
                else {
                    all_tabs[ati].style.visibility = "hidden";
                    all_tabs[ati].style.position = "absolute";
                    all_tabs[ati].style.left = "-999em";
                }
            }
            else{
                all_tabs[ati].style.visibility = "";
                all_tabs[ati].style.position = "";
                all_tabs[ati].style.left = "";
                if (ati == sel_mode){
                    all_tabs[ati].style.display = "inline-block";
                }
                else {
                    all_tabs[ati].style.display = "";
                }
            }
        }
    }
}
