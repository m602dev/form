
//◆◆◆◆　値の整形

//数値化処理
function conv_num(val){
  return (isEmpty(val)) ? 0 : (Number.isFinite(val)) ? Number(val) : Number(val.replace(/[^0-9]/g, '')) * ((val.indexOf("-") == 0) ? -1 : 1);
}

//整数化処理
function conv_int(val){
  return (isEmpty(val)) ? 0 : ((Number.isFinite(val)) ? parseInt(val) : parseInt(val.replace(/[^0-9]/g, '')));
}

//足し算
function sum_array(array){
  var val = 0;
  for(let i=0;i<array.length;i++) val += conv_int($('#' + array[i]).prop("value"));
  return val;
}

//0埋め
function zeroPadding(NUM, LEN){
	return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

function onlyNUM(val){
  return (isEmpty(val)) ? "" : val.replace(/[^0-9]/g, '');
}

//空値のとき0を返す（それ以外はそのまま返す）
function isEmptytoZero(val){
  return (isEmpty(val)) ? 0 : val;
}

function isEmptytoZeroKin(val){
  return (isEmpty(val)) ? 0 : val.toLocaleString();
}

function isEmptytoBlank(val){
  return (isEmpty(val)) ? "" : val;
}

function isEmptytoVal(taisval,isEmptyval){
  return (isEmpty(taisval)) ? isEmptyval : taisval;
}

function isfalseEmpty(bool,val,isfalseVal){
  return (bool) ? val : isfalseVal;
}

function isfalseBlank(bool,val){
  return (bool) ? val : "";
}

function expectZero(val){
  return (val == 0) ? "" : val;
}

function expectZero2Comma(val){
  return (val == 0) ? "" : val.toLocaleString();
}

function postno_fmt(no){
  return ((no == "")||(no === null)) ? "" : no.substring(0,3) + "-" + no.substring(3);
}

function concat_txt(val,s_txt,e_txt){
  return ((val == "")||(val === null)) ? "" : s_txt + val + e_txt;
}

//◆◆◆◆　値の判定

//空値判定（空のときtrue）
function isEmpty(val){
  return ((val === null)||(val == undefined)||(val == "undefined")||(val.length == 0)||(val == "")||(val == "null"));
}

//数字かどうか(数字ならtrue)
function isNumber(val){
  return (isNaN(conv_int(val))||(isEmpty(val))) ? false : (((conv_int(val).toString()).replace(/[^0-9]/g, '').length == val.toString().length) ? true : false);
}

//id名のオブジェクトの存在判定（存在するtrue）
function isExistObject(id){
  return !(document.getElementById(id) === null);
}

//◆◆◆◆　オブジェクト（値）
function taisObject(id){
  if($('#'+id).prop("tagName") == "INPUT") return "value";
  if($('#'+id).prop("tagName") == "SELECT") return "value";
  if($('#'+id).prop("tagName") == "LABEL") return "innerText";
  if($('#'+id).prop("tagName") == "BUTTON") return "textContent";
}

function Obj_Val(id){
  return (isExistObject(id)) ? $('#'+id).prop(taisObject(id)) : "";
}

function Obj_Set(id,val){
  if((isExistObject(id))&&(!(isEmpty(val)))) $('#'+id).prop(taisObject(id),val);
}

function Obj_Set_bool(id,val,bool){
  if((isExistObject(id))&&(!(isEmpty(val)))) $('#'+id).prop(taisObject(id),(bool) ? val : "");
}

function Obj_SetLocaleString(id){
  if(((isExistObject(id))||(Obj_Val(id) != ""))&&(conv_num(Obj_Val(id)) > 0)) Obj_Set(id,conv_num(Obj_Val(id)).toLocaleString());  
}

function Obj_Sum(array){
  var sum = 0;
  for(var i=0; i<array.length; i++) sum += conv_num(Obj_Val(array[i])); 
  return sum;
}

function Obj_Set_blank(array){
  for(var i=0; i<array.length; i++) if(isExistObject(array[i])) $('#'+array[i]).prop(taisObject(array[i]),"")
}

function Obj_focus(id){
  if(window.event.keyCode == 13) $('#'+id).focus();
}  

function SetObj_onlyNUM(id){
  if(isExistObject(id)) $('#'+id).prop(taisObject(id),onlyNUM(Obj_Val(id)));
}

//◆◆◆◆　一時保存（ローカルストレージ）

//JSONによる格納
function temp_sync(type,array,d_nm){
	if(type == "save"){d = {}; for(var i=0; i<array.length; i++) d[array[i]] = Obj_Val(array[i]); localStorage.setItem(d_nm,JSON.stringify(d));} 
	if((type == "load")&&(localStorage.getItem(d_nm) !== null)){d = JSON.parse(localStorage.getItem(d_nm));	for(var i=0; i<array.length; i++) Obj_Set(array[i], d[array[i]]);}	  
}

//JSONによる格納（接頭句つき）
function temp_sync_prefix(type,array,d_nm,prefix){
	if(type == "save"){d = {}; for(var i=0; i<array.length; i++) d[array[i]] = Obj_Val(prefix + array[i]); localStorage.setItem(d_nm,JSON.stringify(d));} 
	if((type == "load")&&(localStorage.getItem(d_nm) !== null)){d = JSON.parse(localStorage.getItem(d_nm));	for(var i=0; i<array.length; i++) Obj_Set(prefix + array[i], d[array[i]]);}	  
}

function temp_sync_kin(type,array,d_nm,not_comma){
	if(type == "save"){d = {}; for(var i=0; i<array.length; i++) d[array[i]] = (not_comma.includes(array[i])) ? Obj_Val(array[i]) : conv_num(Obj_Val(array[i])); localStorage.setItem(d_nm,JSON.stringify(d));} 
	if((type == "load")&&(localStorage.getItem(d_nm) !== null)){d = JSON.parse(localStorage.getItem(d_nm));	for(var i=0; i<array.length; i++) Obj_Set(array[i], (not_comma.includes(array[i])) ? d[array[i]] : expectZero2Comma(Number(d[array[i]])));}	  
}

function temp_array_update(d_nm,array){
  //array = [["1","aaa"],["2","bbb"]]

  const j1 = JSON.parse(localStorage.getItem(d_nm));
  const keyList = Object.keys(j1);
  
  var a = {};
  for(let k1 in keyList) a[keyList[k1]] = j1[keyList[k1]];
  for(var i = 0; i < array.length; i++) a[array[i][0]] = array[i][1];

  localStorage.setItem(d_nm,JSON.stringify(a));
}

//キーごとに格納
function temp_byone(type,array){
  if(type == "save"){for(var i=0; i<array.length; i++) localStorage.setItem(array[i],Obj_Val(array[i]));}
  if(type == "load"){for(var i=0; i<array.length; i++) Obj_Set(array[i],localStorage.getItem(array[i]));}
}

function temp_remove_array(array){
  for(var i=0; i<array.length; i++) localStorage.removeItem(array[i]);
}

function save_temp(id){
  localStorage.setItem(id,Obj_Val(id));
}


//◆◆◆◆　バリデーション
function setValidation(id,div){
  const tais = document.getElementById(id);
  const tais_div = document.getElementById(div);
  tais.addEventListener('focus', function(){tais_div.classList.remove('was-validated');});
  tais.addEventListener('blur', function(){if(tais.value != "") tais_div.classList.add('was-validated'); if(elValid(id)&&(!(isEmpty(tais.value)))) localStorage.setItem(id, tais.value);});
}

//array: ["id1","id2"] *div: id + "_div"
function setValidation_array(d){ 
  for(var i=0; i<d.length; i++) setValidation(d[i], d[i]+"_div");
}

function elValid(id){
  return document.querySelectorAll('#'+id)[0].validity.valid; //boolean
}

function reportValidity(id){
  document.getElementById(id).reportValidity();
}

function checkValidity(id){
  document.getElementById(id).checkValidity();
}
