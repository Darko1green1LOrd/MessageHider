function disableSpellcheck(){
    var elements = document.getElementsByTagName("textarea");
    var ElemArrayLength = elements.length;
    for (var Elemi = 0; Elemi < ElemArrayLength; Elemi++) {
        elements[Elemi].spellcheck=false
    }
}

function changeicon(icon){
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = icon;
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

var sources = ["DecoyMsg_encr","HideMsg_encr","secretmsg_decr","sourcetext_inp"];
var outputs = ["DHiddenMsg_decr","HiddenMsg_encr","shares_text","pginfo"];

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
    run_customselect();
    disableSpellcheck();
    try{get_saved_data();}
    catch (e){console.log("Failed to load saved data from url  "+e);}
    changeicon("favicon.ico");
    udpdateLabels();
    setup_ChangeDetectors();
    changetheme();
    settingChanged(ge("huer_s"));
    settingChanged(ge("huer_t"));
    settingChanged(ge("stegc_t"));
    ge("encrypt","geba").style.display = "inline-block";
    if (ge("shares_text").value != ""){ge("copy_shares").disabled = false;}
}

var save_data;
function setup_savedata(){
    save_data = {
        "uid":{
            "value_type": "str",
            "elem": genstr(10),
            "type": "checkvar",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": null
        },
        "msgd":{
            "value_type": "num",
            "elem": ge("msgdura_v"),
            "type": "inputbox",
            "t_settingChanged": true,
            "min": ge("msgdura_v").min,
            "max": ge("msgdura_v").max,
            "default": ge("msgdura_v").dataset.defvalue
        },
        "hueai":{
            "value_type": "num",
            "elem": ge("huer_vi"),
            "type": "inputbox",
            "t_settingChanged": true,
            "min": ge("huer_vi").min,
            "max": ge("huer_vi").max,
            "default": ge("huer_vi").dataset.defvalue
        },
        "mtord":{
            "value_type": "bool",
            "elem": "moveto_right",
            "type": "var",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": "true"
        },
        "hueat":{
            "value_type": "bool",
            "elem": ge("huer_t"),
            "type": "toggle",
            "t_settingChanged": true,
            "min": null,
            "max": null,
            "default": ge("huer_t").dataset.defvalue
        },
        "huer":{
            "value_type": "num",
            "elem": ge("huer_s"),
            "type": "slider",
            "t_settingChanged": true,
            "min": ge("huer_s").min,
            "max": ge("huer_s").max,
            "default": ge("huer_s").dataset.defvalue
        },
        "theme":{
            "value_type": "num",
            "elem": ge("stylesel-db"),
            "type": "dropdown",
            "t_settingChanged": true,
            "min": 0,
            "max": ge("stylesel-db").childElementCount-1,
            "default": ge("stylesel-db").dataset.defvalue
        },
        "themets":{
            "value_type": "bool",
            "elem": ge("stylesel_t"),
            "type": "toggle",
            "t_settingChanged": true,
            "min": null,
            "max": null,
            "default": ge("stylesel_t").dataset.defvalue
        },
        "ares":{
            "value_type": "bool",
            "elem": ge("autores_t"),
            "type": "toggle",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": ge("autores_t").dataset.defvalue
        },
        "lcalc":{
            "value_type": "bool",
            "elem": ge("lengthc_t"),
            "type": "toggle",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": ge("lengthc_t").dataset.defvalue
        },
        "schmact":{
            "value_type": "bool",
            "elem": ge("stegc_hmac_t"),
            "type": "toggle",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": ge("stegc_hmac_t").dataset.defvalue
        },
        "sct":{
            "value_type": "bool",
            "elem": ge("stegc_t"),
            "type": "toggle",
            "t_settingChanged": true,
            "min": null,
            "max": null,
            "default": ge("stegc_t").dataset.defvalue
        },
        "bl":{
            "value_type": "str",
            "elem": ge("byte_length"),
            "type": "pwinputbox",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": ge("byte_length").dataset.defvalue
        },
        "zv":{
            "value_type": "str",
            "elem": ge("zero_var"),
            "type": "pwinputbox",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": ge("zero_var").dataset.defvalue
        },
        "zt":{
            "value_type": "bool",
            "elem": ge("zero_char_t"),
            "type": "toggle",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": ge("zero_char_t").dataset.defvalue
        },
        "ov":{
            "value_type": "str",
            "elem": ge("one_var"),
            "type": "pwinputbox",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": ge("one_var").dataset.defvalue
        },
        "ot":{
            "value_type": "bool",
            "elem": ge("one_char_t"),
            "type": "toggle",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": ge("one_char_t").dataset.defvalue
        },
        "pw":{
            "value_type": "str",
            "elem": ge("pwd_var"),
            "type": "pwinputbox",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": ge("pwd_var").dataset.defvalue
        },
        "comp":{
            "value_type": "bool",
            "elem": ge("compr_t"),
            "type": "toggle",
            "t_settingChanged": false,
            "min": null,
            "max": null,
            "default": ge("compr_t").dataset.defvalue
        },
        "ctheme":{
            "value_type": "str",
            "elem": ge("stylesel_t"),
            "type": "customtheme",
            "t_settingChanged": true,
            "min": null,
            "max": null,
            "default": null
        }
    }
}

function save_data_in_url(url=document.URL){
    setup_savedata();
    var data_to_save = "";

    var data_keys = Object.keys(save_data);
    for (i = 0; i < data_keys.length; i++) {
        var curr_item = save_data[data_keys[i]];
        var to_add = "";

        if (curr_item["type"] == "checkvar" && (curr_item["elem"] != curr_item["default"] || curr_item["default"] == null)){to_add += data_keys[i]+"="+curr_item["elem"];}
        else if ((curr_item["type"] == "inputbox" || curr_item["type"] == "slider") && (curr_item["elem"].value != curr_item["default"] || curr_item["default"] == null)){
            to_add += data_keys[i]+"="+curr_item["elem"].value;
            if (curr_item["value_type"] == "num"){
                if (curr_item["min"] != null){to_add = (curr_item["elem"].value >= Number(curr_item["min"])) ? to_add : "";}
                if (curr_item["max"] != null){to_add = (curr_item["elem"].value <= Number(curr_item["max"])) ? to_add : "";}
            }
        }
        else if (curr_item["type"] == "var" && (eval(curr_item["elem"]) != curr_item["default"] || curr_item["default"] == null)){
            to_add += data_keys[i]+"="+eval(curr_item["elem"]);
            if (curr_item["value_type"] == "bool" && (eval(curr_item["elem"]) == (curr_item["default"] === 'true'))){
                to_add = "";
            }
        }
        else if (curr_item["type"] == "toggle" && (curr_item["elem"].checked != (curr_item["default"] === 'true') || curr_item["default"] == null)){
            to_add += data_keys[i]+"="+curr_item["elem"].checked;
        }
        else if (curr_item["type"] == "dropdown" && (curr_item["elem"].selectedIndex != curr_item["default"] || curr_item["default"] == null)){
            to_add += data_keys[i]+"="+curr_item["elem"].selectedIndex;
            if (curr_item["value_type"] == "num"){
                if (curr_item["min"] != null){to_add = (curr_item["elem"].selectedIndex >= Number(curr_item["min"])) ? to_add : "";}
                if (curr_item["max"] != null){to_add = (curr_item["elem"].selectedIndex <= Number(curr_item["max"])) ? to_add : "";}
            }
        }
        else if (curr_item["type"] == "pwinputbox" && (curr_item["elem"].value != curr_item["default"] || curr_item["default"] == null)){
            to_add += data_keys[i]+"="+encodeURIComponent(XXTEA.encryptToBase64(curr_item["elem"].value,save_data["uid"]["elem"]));
        }
        else if (curr_item["type"] == "htmlvar" && (curr_item["elem"].innerHTML != curr_item["default"] || curr_item["default"] == null)){
            to_add += data_keys[i]+"="+curr_item["elem"].innerHTML;
            if (curr_item["value_type"] == "num"){
                if (curr_item["min"] != null){to_add = (curr_item["elem"].innerHTML >= Number(curr_item["min"])) ? to_add : "";}
                if (curr_item["max"] != null){to_add = (curr_item["elem"].innerHTML <= Number(curr_item["max"])) ? to_add : "";}
            }
        }
        else if (curr_item["type"] == "customtheme"){
            var theme_sel = save_data["theme"]["elem"];
            var ctheme = "";
            if (theme_sel.options[theme_sel.selectedIndex].value == "c"){
                styles["loaded"] = {};

                var all_stylevars = ge("stylesel_table").children[0].children;
                var all_stylevars_length = all_stylevars.length;
                for (var asv = 1; asv < all_stylevars_length; asv++) {
                    var elem = all_stylevars[asv].children[1].children[0];
                    if (elem.value != elem.dataset.defvalue){
                        styles["loaded"][elem.dataset.varid] = elem.value;
                    }
                }
            if (Object.keys(styles["loaded"]).length > 0){to_add += "ctheme="+btoa(encodeURIComponent(JSON.stringify(styles["loaded"])));}
            }
        }

        if (data_to_save.length >= 1 && to_add.length >= 1){to_add = "&"+to_add;}
        data_to_save += to_add;
    }

    var encodedParam = url.split("?")[0]+"?"+encodeURIComponent(data_to_save);
    return (Object.keys(parseURLParams(decodeURIComponent(encodedParam))).length >= 2) ? encodedParam : url.split("?")[0];
}

function get_saved_data(){
    setup_savedata();
    const unique_id = ge("uid_storage");

    var url = document.URL;
    var params = parseURLParams(decodeURIComponent(url));
    if (params != null){
        if(unique_id.value != params["uid"][0]){
            var params_keys = Object.keys(params);
            for (i = 0; i < params_keys.length; i++) {
                if (Object.keys(save_data).indexOf(params_keys[i]) != -1){
                    var data_sel = save_data[params_keys[i]];
                    var params_obtained = params[params_keys[i]]
                    if (data_sel["value_type"] == "num" && !isNaN(Number(params_obtained[0]))){
                        load_data(data_sel["elem"],Number(params_obtained[0]),data_sel["type"],data_sel["t_settingChanged"],data_sel["min"],data_sel["max"],params["uid"][0],data_sel["default"]);
                    }
                    else if (data_sel["value_type"] == "bool" && (params_obtained[0] === 'true' || params_obtained[0] === 'false')){
                        load_data(data_sel["elem"],params_obtained[0] === 'true',data_sel["type"],data_sel["t_settingChanged"],data_sel["min"],data_sel["max"],params["uid"][0],data_sel["default"]);
                    }
                    else if (data_sel["value_type"] == "str" && params_obtained[0] != ""){
                        load_data(data_sel["elem"],params_obtained[0],data_sel["type"],data_sel["t_settingChanged"],data_sel["min"],data_sel["max"],params["uid"][0],data_sel["default"]);
                    }
                }
            }
            unique_id.value = params["uid"][0];
        }
    }
}

function load_data(elem,value,type,tsc,min,max,uique_id,defaultvar){
    if (min != null){
        var varto_replace = (defaultvar != null) ? defaultvar : min;
        value = (value >= Number(min)) ? value : Number(varto_replace);
    }
    if (max != null){
        var varto_replace = (defaultvar != null) ? defaultvar : max;
        value = (value <= Number(max)) ? value : Number(varto_replace);
    }

    if (type == "dropdown"){dropdown_change(elem,value);}
    else if (type == "inputbox"){elem.value = value;}
    else if (type == "pwinputbox"){elem.value = XXTEA.decryptFromBase64(decodeURIComponent(value),uique_id);}
    else if (type == "htmlvar"){elem.innerHTML = value;}
    else if (type == "slider"){slider_change(elem,value);}
    else if (type == "toggle"){elem.checked = value;}
    else if (type == "var"){eval(elem + " = " + value);}
    else if (type == "customtheme"){
        styles["loaded"] = JSON.parse(decodeURIComponent(atob(value)));
        changetheme("loaded");
    }

    if (tsc){settingChanged(elem);}
}

function parseURLParams(url) { //https://stackoverflow.com/questions/814613/how-to-read-get-data-from-a-url-using-javascript
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

function dropdown_change(elem,value){
    elem.selectedIndex = value
    const selected_itm = elem;
    elem.parentElement.children[1].innerHTML = selected_itm.options[selected_itm.selectedIndex].innerHTML;
}

function slider_change(elem,value){
    const elem_id = elem.id;
    elem.value = value;
    ge(elem_id.split("_")[0]+"_v").value = value;
}

function genstr(length) { //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function update_textfields(){
    var sando = sources.concat(outputs);
    var sando_length = sando.length;
    for (var so = 0; so < sando_length; so++){
        var source = ge(sando[so]);
        calcLength(source);
    }
}


var styles = {
    "dg":{
        "--bodycolor": "#000",
        "--inputcolor": "#171817",
        "--contpanel-colone": "none",
        "--contpanel-coltwo": "none"
    }
}
function changetheme(inp=null,elem=null){
    if(inp == null){inp = ge("stylesel-db").value;}
    let root = document.documentElement;
    ge("stylesel_div").style.display = (inp == "c") ? "block" : "";
    ge("stylesel_emergency_toggle","geba").style.display = (inp == "c") ? "block" : "";
    ge("emergency_sr").style.display = (inp == "c" && ge("stylesel_t").checked) ? "block" : "";

    if (inp == "reset"){
        dropdown_change(ge("stylesel-db"),1);
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

var moveto_right = true;
var IntervalLoop;
function settingChanged(elem){
    const elem_id = elem.id;
    if (elem_id == "autores_t"){update_textfields();}
    else if (elem_id == "lengthc_t"){update_textfields();}
    else if (elem_id == "msgdura_v"){
        if (elem.value == ""){
            elem.value = (elem.oldvalue >= 0 && elem.oldvalue <= 100 && elem.oldvalue != null) ? elem.oldvalue : 6;
            showmsg("Error","This field cannot be empty","Restoring previous value");
        }
    }
    else if (elem_id == "stylesel-db"){changetheme(elem.value);}
    else if (elem.classList[0] == "customstyle" && elem_id == ""){
        let root = document.documentElement;
        var colortile = elem.parentElement.parentElement.children[2];
        colortile.style.backgroundColor = "";colortile.style.backgroundColor = (elem.value != "") ? elem.value : elem.dataset.defvalue;
        root.style.setProperty(elem.dataset.varid, elem.value);
    }
    else if (elem_id == "stylesel_t"){ge("emergency_sr").style.display = (ge("stylesel-db").value == "c" && ge("stylesel_t").checked) ? "block" : "";}
    else if (elem_id == "huer_s"){
        ge("huer_v").value = elem.value;
        document.body.style.filter = `hue-rotate(${elem.value}deg)`;
    }
    else if (elem_id == "huer_v"){
        var h_value = elem.value;
        if (elem.value == ""){
            if (elem.oldvalue == ""  || elem.oldvalue == null){h_value = 0;}
            else {h_value = elem.oldvalue;}
        }
        ge("huer_s").value = h_value;
        elem.value = h_value;
        document.body.style.filter = `hue-rotate(${h_value}deg)`;
    }
    else if (elem_id == "huer_vi"){
        var h_value = elem.value;
        if (elem.value == ""){
            if (elem.oldvalue == ""  || elem.oldvalue == null){h_value = 0;}
            else {h_value = elem.oldvalue;}
        }
        elem.value = h_value;
        if (elem.oldvalue != elem.value){
            ge("huer_t").checked = false;
        }
    }
    else if (elem_id == "huer_t"){
        if(elem.checked){
            clearInterval(IntervalLoop);
            IntervalLoop = setInterval(function() {
                var slider_elem = ge("huer_s");
                var value_elem = ge("huer_v");
                if (slider_elem.value == 360){moveto_right = false;}
                else if (slider_elem.value == 0){moveto_right = true;}
                if (moveto_right){slider_elem.value = Number(slider_elem.value)+1;}
                else{slider_elem.value = Number(slider_elem.value)-1;}
                value_elem.value = slider_elem.value;
                document.body.style.filter = `hue-rotate(${value_elem.value}deg)`;
                if (elem.checked != true){clearInterval(IntervalLoop);}
            }, Number(ge("huer_vi").value));
        }
    }
    else if (elem_id == "shares_b"){
        ge(elem.id.split('_')[0]+'_text').value = save_data_in_url();
        if (ge("shares_text").value != ""){ge("copy_shares").disabled = false;}
        calcLength(ge("shares_text"));
    }
    else if (elem_id == "stegc_t"){
        ge("charc_mode").style.display = (elem.checked) ? "None" : "";
        ge("bl","geba").style.display = (elem.checked) ? "None" : "";
        ge("zero","geba").style.display = (elem.checked) ? "None" : "";
        ge("one","geba").style.display = (elem.checked) ? "None" : "";
        ge("compr","geba").style.display = (elem.checked) ? "None" : "";
        ge("stegc_hmac","geba").style.display = (elem.checked) ? "" : "None";
        ge("steg_pwd_tip").style.display = (elem.checked) ? "" : "None";
        switch_mode(null,null,3);
    }
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
    var decoymsg = ge('DecoyMsg_encr').value;
    const compression = ge('compr_t').checked;
    var input_var = ge('HideMsg_encr').value;
    const stegcloak_hmac = ge('stegc_hmac_t').checked;
    const stegcloak_on = ge('stegc_t').checked;
    const stegcloak = new StegCloak(true, false);
    if(compression && !stegcloak_on){input_var = LZString.compress(input_var);}
    if(password.length > 0){var hiddenmsg = XXTEA.encryptToBase64(input_var,btoa(encodeURIComponent(password)));}
    else{var hiddenmsg = input_var;}
    const output = ge('HiddenMsg_encr');
    const copybtn = ge('copy_encr');

    if (stegcloak_on){
        copybtn.disabled = false;
        stegcloak.encrypt = (password.length == 0) ? false : true;
        stegcloak.integrity = stegcloak_hmac;
        if (decoymsg.length == 0){decoymsg = "  ";}
        if (decoymsg.split(" ").length <= 1){
            disable(output,copybtn);
            showmsg("Info!","Decoy msg has to be either empty or contain atleast one space");
        }
        else{
            try{output.value = stegcloak.hide(input_var,password,decoymsg);}
            catch (e){
                disable(output,copybtn);
                showmsg("Error","Hiding error, reason unknown",e,0);
            }
        }
    }
    else{
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
    var fullmsg = ge('secretmsg_decr').value
    var hiddenmsg = fullmsg.split(" ")[0];
    var saved_bl = fullmsg.split(" ")[1];
    const compression = ge('compr_t').checked
    const output = ge('DHiddenMsg_decr');
    const copybtn = ge('copy_decr')
    copybtn.disabled = false;
    const stegcloak_hmac = ge('stegc_hmac_t').checked;
    const stegcloak_on = ge('stegc_t').checked;
    const stegcloak = new StegCloak(true, false);

    if (stegcloak_on){
        stegcloak.encrypt = (password.length == 0) ? false : true;
        if(fullmsg.length == 0){
            disable(output,copybtn);
            showmsg("Info!","First field cannot be empty");
        }
        try{output.value = stegcloak.reveal(fullmsg,password);}
        catch (e){
            disable(output,copybtn);
            if (e instanceof TypeError) {showmsg("Error","Revealing error","Its possible you are trying to decrypt mmessage that wasnt made in stegcloak with stegcloak");}
            else {showmsg("Error","Revealing error, reason unknown",e,0);}
        }
    }
    else{
        if(fullmsg.length == 0){
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
                            try{var decrypted_text = XXTEA.decryptFromBase64(binary2Text(bytelength,hiddenmsg),btoa(encodeURIComponent(password)));}
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

function switch_mode(ind,oper=null,desel=null){
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

    var all_btns = [encbtn,decrbtn,lcharcbtn,charcbtn,pinfobtn,settingsmbtn];
    var sel_all = [];
    var all_btns_length = all_btns.length;
    for (var abi = 0; abi < all_btns_length; abi++) {sel_all.push(all_btns[abi].classList[0]);}
    var sel_mode = sel_all.indexOf("selected");
    var all_tabs = [enc,decr,lchar,char,pinfo,settingsm];
    var all_tabs_length = all_tabs.length;

    if (desel == sel_mode){oper = "-";}
    if (oper == "+"){
        sel_mode = (sel_mode + 1 <= all_tabs_length-1) ? sel_mode + 1 : 0;
        ind = sel_mode;
    }
    else if (oper == "-"){
        sel_mode = (sel_mode - 1 >= 0) ? sel_mode - 1 : all_tabs_length-1;
        ind = sel_mode;
    }

    for (var ati = 0; ati < all_tabs_length; ati++) {
        if (typeof(ind) == "number"){
            if (ati == ind){
                all_tabs[ati].style.display = "inline-block";
                all_btns[ati].classList = "selected";
            }
            else {
                all_tabs[ati].style.display = "";
                all_btns[ati].classList = "";
            }
        }
        else if (ind == "showall"){
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
        else if (ind == "restore"){
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

function vist_page(link){
    window.location.href = link;
}
