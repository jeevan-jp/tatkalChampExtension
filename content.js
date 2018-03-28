var anchorTagOfLink;
var bookNowLink;
var date = new Date();
var h = date.getHours();
var m = date.getMinutes();
var s = date.getSeconds();

var tatkalTime = false;

var linkList = {
  "0": "https://securepayments.fssnet.co.in/pgwayb/paymentpage.htm",
  "1": "https://securepayments.fssnet.co.in/pgwayc/paymentpage.htm#d",
  "2": "https://securepayments.fssnet.co.in/pgwayf/paymentpage.htm#d",
  "4": "https://securepayments.fssnet.co.in/ipay/paymentpage.htm#d"
};

$('body').prepend('<div id="theClock" style="position: fixed; background:black; color: yellow; z-index: 1000;"><h1></h1></div>');
startTime();

if( h < 12 && h >= 9 ) {
  tatkalTime = true;
}
// WAITS UNTIL BOOK NOW APPEARS
function waitForElementToDisplay(time) {
  if($('td a#' + bookNowLink)[0]) {
      document.getElementById(bookNowLink).click();
      return;
  } else {
      setTimeout(function() { waitForElementToDisplay(time); }, time);
  }
}

function startTime()
{
    var d = new Date();
    var h= d.getHours();
    var m=d.getMinutes();
    var s=d.getSeconds();
    h=checkTime(h);
    m=checkTime(m);
    s=checkTime(s);
    $('#theClock h1').html( h + ' : ' + m + ' : ' + s);    
    setTimeout(startTime, 500);
}

function checkTime(i)
{
  if(i<10)
    {i = "0" + i;}
  return i;
}

chrome.storage.sync.get('poorijaankari1', (data) => {
  var myData = JSON.parse(data['poorijaankari1']);

  // PAYMENT SBI, canara, IOB, Axis
  if(document.URL === linkList[myData['paymentBank']] && $('input[name="debitCardNumber"]')) {
    form0=document.forms[0];
    form0['debitCardNumber'].value = myData['cardNo']-100; 
    form0['debiMonth'].value = myData['expMonth'];
    form0['debiYear'].value = jadooBack(myData['expYear'], myData['r']); 
    form0['debitCardholderName'].value = myData['cardName'];
    form0['cardPin'].value = jadooBack(myData['pin'], myData['r']);
    form0['passline'].focus();
  }

  // UBI payment- Not working
  // else if($('input[name="txtboxCardNum"]') && document.URL === "https://irctc.unitedbankofindia.com/IRCTC_WebApp/Payment.aspx") {
  //   form0=document.forms[0];
  //   form0['txtboxCardNum'].value = myData['cardNo']-100;
  //   form0['dropdownMonth'].value = myData['expMonth'];
  //   form0['dropdownYear'].value = jadooBack(myData['expYear'], myData['r']);
  //   form0['txtOTP'].focus();
  // }

  // not working HDFC
  // else if($('input[name="Ecom_Payment_Card_Number"]') && document.URL === "https://securepg.fssnet.co.in/pgwaya/gateway/payment/payment.jsp") {
  // console.log('y');  
  // form0=document.forms[0];
  //   form0['Ecom_Payment_Card_Number'].value = myData['cardNo']-100; 
  //   form0['Ecom_Payment_Card_ExpDate_Month'].value = myData['expMonth'];
  //   form0['Ecom_Payment_Card_ExpDate_Year'].value = jadooBack(myData['expYear'], myData['r']); 
  //   form0['Ecom_Payment_Card_Name'].value = myData['cardName'];
  //   form0['Ecom_Payment_Pin'].value = jadooBack(myData['pin'], myData['r']);
  //   form0['Ecom_Captcha_Value'].focus();
  // }

  
  // PAYMENT PREFERENCES
  else if($('#DEBIT_CARD')[0] && myData['paymentBank'] > -1 ) {
    setTimeout(()=>{
      var index = parseInt(myData['paymentBank']);
      $('td#DEBIT_CARD').click();
      $('input[tabindex="4"]#DEBIT_CARD')[index].click(); // SBI(0), Canara, HDFC, AXIS, UBI
      if(!$('div.error_div')[0]) {
        $('input[type="button"]#validate').click();
      }
    },1000);
  }
  
  // PASSENGER DETAILS FILLING
  else if( $('.input-style1.psgn-name')[0] ) {
    var theVariable;
    tatkalTime ? theVariable = 5 : theVariable = 4;
    for(var i=0; i<4; i++) {
      var num = i+1;
      if(myData['p' + num + 'Name']) {
        $('input.input-style1.psgn-name')[i].value = myData['p' + num + 'Name'];
        $('input.input-style1.psgn-age.only-numeric')[i].value = myData['p' + num +'Age'];
        $('td.rf-dt-c select')[theVariable*i + 1].value = myData['p' + num +'prefBirth'];
        $('td.rf-dt-c select')[theVariable*i].value = myData['p' + num + 'gender'];
        if(myData['p'+ num +'bedRoll'] == "on") {
          try {
            $('input.psgn-bedRollChoice')[i].checked = true;
          }
          catch(err) {
            console.log('No bed-roll option available for this ticket');
          }
        }
      }
    }
    if(myData['autoUp'] == 'on')
      $('input[name="addPassengerForm:autoUpgrade"]')[0].checked = true;    
    $('input[name="addPassengerForm:mobileNo"]').val(myData['mobileNo']);
    $('input[name="j_captcha"]').focus();
  }
  
  // CLICKS ON CLASS AND BOOK NOW
  else if($('input[value="TQ"]')[0]) {
    $('input[value="'+ myData['selectedQuota'] +'"]').click();
    var trainNum = new RegExp(myData['trainNo'].split(' ')[0] + '-' + myData['selectedClass']);
    for(var i=0; i<$('td a').length; i++) {
      if(trainNum.test($('td a')[i].id)) 
        { 
          $('td a')[i].click(); 
          var id = $('td a')[i].id;
          $('td a#' + id).css({ 'font-size': '50px', 'color': 'blue', 'font-weight':'bold'});
          $('td a#' + id).parents("tr").css( "background-color", "#fca758" );
          anchorTagLink = $('td a')[i];   // for future use ( used in auto click at 10AM and 11 AM )

          //GENERATES BOOK NOW LINK
          bookNowLink = myData['trainNo'].split(' ')[0] + '-' + myData['selectedClass'] + '-' + myData['selectedQuota'] + '-0'
          break;
        } 
    }
    waitForElementToDisplay(1);
  }
  
  // FILLS JOURNEY DETAILS
  else if ($("input[name='jpform:fromStation']")[0] && document.URL == 'https://www.irctc.co.in/eticketing/home') {
    $('input[name="jpform:fromStation"]').val(myData['jpform_fromStation']);
    $('input[name="jpform:toStation"]').val(myData['jpform_toStation']);
    $('input[name="jpform:journeyDateInputDate"]').val(myData['jpform:journeyDateInputDate']);
    $('input[name="jpform:jpsubmit"]').click();
  }
  
  // LOGIN
  else if ($('input[name="j_username"]')[0]) {
    $('input[name="j_username"]').val(myData['userName']);
    $('input[name="j_password"]').val(myData['irctcPassword']);
    $('input.loginCaptcha').css({"height":"50px","width":"250px","font-size":"30px"})
    $('img#cimage').css({"height":"80px","width":"290px"});
    $('input[name="j_captcha"]').focus();
    // Code listening to 'enter key press' event
    $("input.loginCaptcha").keypress((e) => {
      if(e.keyCode === 13)
        $('input#loginbutton').click();
    });
  }
});
