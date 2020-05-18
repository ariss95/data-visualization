function hideCountryBtn() {
  document.getElementById('countrybtn').style.display= 'none';
};

function processForm(e) {
  if (e.preventDefault) e.preventDefault();

  var alb = {code: document.getElementById("ALB").id, value: document.getElementById("ALB").checked};
  var arg = {code: document.getElementById("ARG").id, value: document.getElementById("ARG").checked};
  var aus = {code: document.getElementById("AUS").id, value: document.getElementById("AUS").checked};
  var bgr = {code: document.getElementById("BGR").id, value: document.getElementById("BGR").checked};
  var bra = {code: document.getElementById("BRA").id, value: document.getElementById("BRA").checked};
  var chl = {code: document.getElementById("CHL").id, value: document.getElementById("CHL").checked};
  var cub = {code: document.getElementById("CUB").id, value: document.getElementById("CUB").checked};
  var cyp = {code: document.getElementById("CYP").id, value: document.getElementById("CYP").checked};
  var cze = {code: document.getElementById("CZE").id, value: document.getElementById("CZE").checked};
  var dnk = {code: document.getElementById("DNK").id, value: document.getElementById("DNK").checked};
  var fra = {code: document.getElementById("FRA").id, value: document.getElementById("FRA").checked};
  var grc = {code: document.getElementById("GRC").id, value: document.getElementById("GRC").checked};
  var forest = {code: document.getElementById("AG.LND.FRST.ZS").id, value: document.getElementById("AG.LND.FRST.ZS").checked};
  var health_expen = {code: document.getElementById("SH.XPD.CHEX.GD.ZS").id, value: document.getElementById("SH.XPD.CHEX.GD.ZS").checked}
  var electricity = {code: document.getElementById("EG.ELC.ACCS.ZS").id, value: document.getElementById("EG.ELC.ACCS.ZS").checked};
  var outschool_male = {code: document.getElementById("SE.PRM.UNER.MA.ZS").id, value: document.getElementById("SE.PRM.UNER.MA.ZS").checked};
  var outschool_female = {code: document.getElementById("SE.PRM.UNER.FE.ZS").id, value: document.getElementById("SE.PRM.UNER.FE.ZS").checked};
  var fuel_im = {code: document.getElementById("TM.VAL.FUEL.ZS.UN").id, value: document.getElementById("TM.VAL.FUEL.ZS.UN").checked};
  var fuel_ex = {code: document.getElementById("TX.VAL.FUEL.ZS.UN").id, value: document.getElementById("TX.VAL.FUEL.ZS.UN").checked};
  var military_expen ={code: document.getElementById("MS.MIL.XPND.GD.ZS").id, value:  document.getElementById("MS.MIL.XPND.GD.ZS").checked};
  var journal = {code: document.getElementById("IP.JRN.ARTC.SC").id, value: document.getElementById("IP.JRN.ARTC.SC").checked};
  var unempl_male = {code: document.getElementById("SL.UEM.1524.MA.NE.ZS").id, value: document.getElementById("SL.UEM.1524.MA.NE.ZS").checked};
  var unempl_female = {code: document.getElementById("SL.UEM.1524.FE.NE.ZS").id, value: document.getElementById("SL.UEM.1524.FE.NE.ZS").checked};
  var tourism = {code: document.getElementById("ST.INT.ARVL").id, value: document.getElementById("ST.INT.ARVL").checked};
  var arr = [alb, arg, aus, bgr, bra, chl, cub, cyp, cze, dnk, fra, grc,
      forest, health_expen, electricity, outschool_male, outschool_female, fuel_im, 
      fuel_ex, military_expen, journal, unempl_male, unempl_female, tourism];

  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    if (element.value) {
      form_content.push(element.code);
    }
  }
  /*
  fetch('/event_creation', {
    method: 'POST',
    body: JSON.stringify(myJson),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => window.alert("Your request has been completed successfully!"))
  .then(response => window.location.replace('/'))
  .catch(error => console.error('Error:', error));
  */
}

var form_content = [];
var form = document.getElementById('form');
if (form.attachEvent) {
  form.attachEvent("submit", processForm);
} else {
  form.addEventListener("submit", processForm);
}