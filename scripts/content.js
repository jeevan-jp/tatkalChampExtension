var anchorTagOfLink;
var bookNowLink;

function waitForElementToDisplay(time) {
  if($('td a#' + bookNowLink)[0]) {
      console.log('hi1');
      console.log(bookNowLink);
      document.getElementById(bookNowLink).click();
      return;
  }
  else {
      console.log('hi2');
      setTimeout(function() {
          waitForElementToDisplay(time);
      }, time);
  }
}

chrome.storage.sync.get('poorijaankari1', (data) => {
  var myData = JSON.parse(data['poorijaankari1']);
  console.log(myData);
  if ($('input[name="j_username"]')[0]) {
    console.log('done1');
    $('input[name="j_username"]').val(myData['userName']);
    $('input[name="j_password"]').val(myData['irctcPassword']);
    $('input.loginCaptcha').focus();
    $('input[name="nlpAnswer"]').focus();
  }

  // Payment Preferences
  else if($('#DEBIT_CARD')[0] && myData['paymentBank']) {
    var index = parseInt(myData['paymentBank']);
    $('td#DEBIT_CARD').click();
    $('input[tabindex="4"]#DEBIT_CARD')[index].click(); // SBI(0), Canara, HDFC, AXIS, UBI
    // $('input[type="button"]#validate').click();
  }
  
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

          //GENERATE BOOK NOW LINK
          bookNowLink = myData['trainNo'].split(' ')[0] + '-' + myData['selectedClass'] + '-' + myData['selectedQuota'] + '-0'
          console.log('b1; ', bookNowLink);
          break;
        } 
    }
    waitForElementToDisplay(1);
    // console.log('booknowlink: ' + bookNowLink);
  } else if( $('.input-style1.psgn-name')[0] ) {
    for(var i=0; i<4; i++) {
      var num = i+1;
      $('input.input-style1.psgn-name')[i].value = myData['p' + num + 'Name'];
      $('input.input-style1.psgn-age.only-numeric')[i].value = myData['p' + num +'Age'];
      $('.input-style1.psgn-gender')[i].value = myData['p' + num +'gender'];
      $('.input-style1.psgn-berth-choice')[i].value = myData['p' + num +'prefBirth'];
    }
    $('input[name="addPassengerForm:mobileNo"]').val(myData['mobileNo']);
    $('#nlpAnswer')[0].focus();
  }
  
  else if ($("input[name='jpform:fromStation']")[0] && document.URL == 'https://www.irctc.co.in/eticketing/home') {
    console.log('done2');
    $('input[name="jpform:fromStation"]').val(myData['jpform_fromStation']);
    $('input[name="jpform:toStation"]').val(myData['jpform_toStation']);
    $('input[name="jpform:journeyDateInputDate"]').val(myData['jpform:journeyDateInputDate']);
    $('input[name="jpform:jpsubmit"]').click();
  } else {
    console.log('done');
  }
});


// javascript: document.getElementsByClassName("input-style1 psgn-name")[0].setAttribute("value","Jeevan"); document.getElementById("addPassengerForm:psdetail:0:psgnAge").setAttribute("value","19"); document.getElementById("addPassengerForm:psdetail:0:psgnGender").options[1].selected = true; document.getElementById("addPassengerForm:psdetail:0:berthChoice").options[1].selected = true; document.getElementById("addPassengerForm:autoUpgrade").click(); document.getElementById("addPassengerForm:mobileNo").setAttribute("value","9968967608"); document.getElementsByClassName("text captcha-answer")[0].focus();