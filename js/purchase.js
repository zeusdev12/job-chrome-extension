console.log("Hello");
const BT_HOST = "http://130.211.117.118/braintree/"; // Sandbox
var IS_PREMIUM_CHECK = 0;

/*
google.payments.inapp.getSkuDetails({
  'parameters': {'env': 'prod'},
  'success': onSkuDetails,
  'failure': onSkuDetailsFail
});
*/

$('.tablinks').click(function () {

	var tabName = $(this).attr('data');

	//alert(tabName);

	var event = $(this).attr('id');

	openTab(event, tabName);

});

function openTab(evt, tabName) {

	//alert(tabName);

	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	//evt.currentTarget.className += " active";

	$('#' + evt).addClass("active");

}

// setInterval(() => {
// 	console.log('test interval running every 500 ms')
// 	BROWSER.runtime.sendMessage({
// 		cmd: 'TEST_MESSAGE'
// 	}, function (response) {
// 		console.log('TEST RESPONSE IS: ', response)
// 	})
// }, 500)

$('#renewTab').click();

function updateReferralInfo() {

	var url = HOST + "api/auth/user/getReferralStatus";

	console.log(url);

	chrome.storage.local.get('recruiterID', function (result) {

		if (result.recruiterID) {

			var params = JSON.stringify({ "token": result.recruiterID });

			console.log(params);
			BROWSER.runtime.sendMessage({
				cmd: 'GET_REFERRAL_STATUS',
				params: params
			}, function (json) {
				if (json.data) {
					console.log(json.data);

					var obj = {};
					var key = 'referralObject';
					obj[key] = json.data;
					chrome.storage.local.set(obj);

					var d = new Date();

					var isoDateString = d.toISOString();

					//alert(isoDateString);

					chrome.storage.local.set({ 'MembershipCheckDate': isoDateString });

					if (json.data.package) {
						$('#userType').text(json.data.package.replace("Trail", "Trial"));

					}
					else {
						$('#userType').text("Not Found");

					}

					if (json.data.credits) {
						$('#creditsLeft').text(json.data.credits + " days");

					}
					else {
						$('#creditsLeft').text("Not Found");

					}

					if (json.data.referral) {
						$('#refCode').text(json.data.referral);

					}
					else {
						$('#refCode').text("Not Found");

					}

				}
			})

			// callAjaxPOST(url, params, function (json) {

			// 	if (json.data) {
			// 		console.log(json.data);

			// 		var obj = {};
			// 		var key = 'referralObject';
			// 		obj[key] = json.data;
			// 		chrome.storage.local.set(obj);

			// 		var d = new Date();

			// 		var isoDateString = d.toISOString();

			// 		//alert(isoDateString);

			// 		chrome.storage.local.set({ 'MembershipCheckDate': isoDateString });

			// 		if (json.data.package) {
			// 			$('#userType').text(json.data.package.replace("Trail", "Trial"));

			// 		}
			// 		else {
			// 			$('#userType').text("Not Found");

			// 		}

			// 		if (json.data.credits) {
			// 			$('#creditsLeft').text(json.data.credits + " days");

			// 		}
			// 		else {
			// 			$('#creditsLeft').text("Not Found");

			// 		}

			// 		if (json.data.referral) {
			// 			$('#refCode').text(json.data.referral);

			// 		}
			// 		else {
			// 			$('#refCode').text("Not Found");

			// 		}

			// 	}

			// });

		}

	});

}

updateReferralInfo();

$('#copyCode').click(function () {

	var reference_element = document.querySelector('#refCode');

	var range = document.createRange();
	range.selectNodeContents(reference_element);

	window.getSelection().addRange(range);

	var success = document.execCommand('copy');

	if (success)
		alert('Code successfully copied to clipboard.');
	else
		console.log('Unable to copy to clipboard.');

	window.getSelection().removeRange(range);


});

/*
var localProducts = [
        {
          "kind": "",
          "sku": "dnnae_premium_01_monthly",
          "item_id": "",
          "type": "",
          "state": "",
          "localPrice": "29.00",
          "prices": [
            {
              "valueMicros": "",
              "currencyCode": "",
              "regionCode": ""
            }
          ],
          "localeData": [
            {
              "title": "DNNae Premium Plan Monthly (USD 29.00 Monthly)",
              "description": "",
              "languageCode": ""
            }
          ]
        },
        {
          "kind": "",
          "sku": "dnnae_premium_01_annual",
          "item_id": "",
          "type": "",
          "state": "",
          "localPrice": "29.00",
          "prices": [
            {
              "valueMicros": "",
              "currencyCode": "",
              "regionCode": ""
            }
          ],
          "localeData": [
            {
              "title": "DNNae Premium Annual (USD 19.00 Monthly)",
              "description": "",
              "languageCode": ""
            }
          ]
        },
        {
          "kind": "",
          "sku": "dnnae_premium_01_annual_one_time",
          "item_id": "",
          "type": "",
          "state": "",
          "localPrice": "29.00",
          "prices": [
            {
              "valueMicros": "",
              "currencyCode": "",
              "regionCode": ""
            }
          ],
          "localeData": [
            {
              "title": "DNNae Premium Annual (One Time) (USD 219.00 Annual)",
              "description": "",
              "languageCode": ""
            }
          ]
        }
      ];
*/

var localProducts = [
	{
		"kind": "",
		"sku": "dnnae_premium_annual_one_time",
		"item_id": "",
		"type": "",
		"state": "",
		"localPrice": "359.88",
		"prices": [
			{
				"valueMicros": "",
				"currencyCode": "",
				"regionCode": ""
			}
		],
		"localeData": [
			{
				"title": "Pay with Credit Card to get Premium membership",
				"description": "$29.99/month<br/>(Billed for 12 months - $359.88)",
				"languageCode": ""
			}
		]
	}
];

addtoUI(localProducts);

function onSkuDetails(skus) {
	console.log("SKUs");

	var products = skus.response.details.inAppProducts;
	var count = products.length;

	if (products.length > 0) {
		console.log(products);
		addtoUI(products);

	}
}

function onSkuDetailsFail(skus) {
	console.log("Failed to get SKUs");
	console.log(skus.response);

	var html = `<br><center><h3 style="color:gray";>Failed to get SKUs</h3></center>`;

	$('#purchaseTable').empty();
	$('#purchaseTable').html(html);

}

function addtoUI(products) {

	(function (products) {

		var html = `<table style="width:1000px;">`;

		BROWSER.storage.local.get('paymentArray', function (result) {
			var pmA = [];

			if (result['paymentArray']) {
				pmA = result['paymentArray'];

				for (var a = 0; a < products.length; a++) {
					/*
					html += `<tr style='height:50px;'>
								<td width='5%'>&nbsp;&nbsp;`+(a+1)+`.</td>
								<td width='70%'>`+products[a].localeData[0].title+`</td>`;
				
					var temp = 0;
				
					for (var x = 0; x < pmA.length; x++)
					{
						if (products[a].sku == pmA[x].sku)
						{
							html += `<td width='25%' style='text-align:right;'><button class='imperfectThin btn PanelBtn purchasedBtn' id='buyButton`+(a+1)+`' json_no='`+(a+1)+`' json_data='`+JSON.stringify(products[a])+`' style='background-color: #aaaaaa;'>Purchased</button>&nbsp;&nbsp;<!--<button class='imperfectThin btn PanelBtn cancelBtn' id='cancelButton`+(a+1)+`' json_no='`+(a+1)+`' json_data='`+JSON.stringify(products[a])+`' json_subs_data='`+JSON.stringify(pmA[x])+`' style='background-color: #f00f00;'>Cancel</button>-->&nbsp;&nbsp;</td>`;
							temp = 1;
							IS_PREMIUM_CHECK = 1;
						}
					
					}
					
					if (temp == 0)
						html += `<td width='25%' style='text-align:right;'><button class='imperfectThin btn PanelBtn buyBtn' id='buyButton`+(a+1)+`' json_no='`+(a+1)+`' json_data='`+JSON.stringify(products[a])+`'>&nbsp;&nbsp;Buy&nbsp;&nbsp;</button>&nbsp;&nbsp;</td>`;
				
					html +=  `</tr>`;
					*/

					html += `<tr>
							`+ products[a].localeData[0].title + `<br/>
							`+ products[a].localeData[0].description;

					var temp = 0;

					for (var x = 0; x < pmA.length; x++) {
						if (products[a].sku == pmA[x].sku) {
							html += `&nbsp;&nbsp;&nbsp;<button style="width:120px; margin-top:-20px; background-color: #aaaaaa;" class='imperfectThin PanelBtn purchasedBtn' id='buyButton` + (a + 1) + `' json_no='` + (a + 1) + `' json_data='` + JSON.stringify(products[a]) + `'>Purchased</button>`;
							temp = 1;
							IS_PREMIUM_CHECK = 1;
						}

					}

					if (temp == 0)
						html += `&nbsp;&nbsp;&nbsp;<button style="width:120px; margin-top:-20px;" class='imperfectThin btn PanelBtn buyBtn' id='buyButton` + (a + 1) + `' json_no='` + (a + 1) + `' json_data='` + JSON.stringify(products[a]) + `'>&nbsp;&nbsp;Buy&nbsp;&nbsp;</button>`;


					html += `<br/><br/>
							</tr>`;


				}


			}
			else {
				for (var a = 0; a < products.length; a++) {
					/*
					html += `<tr style='height:50px; border: 1px solid black;'>
								<td width='5%'>&nbsp;&nbsp;`+(a+1)+`.</td>
								<td width='70%'>`+products[a].localeData[0].title+`</td>
								<td width='25%' style='text-align:right;'><button class='imperfectThin btn PanelBtn buyBtn' id='buyButton`+(a+1)+`' json_no='`+(a+1)+`' json_data='`+JSON.stringify(products[a])+`'>&nbsp;&nbsp;Buy&nbsp;&nbsp;</button>&nbsp;&nbsp;</td>
								</tr>`;
					*/
					html += `<tr>
							`+ products[a].localeData[0].title + `<br/>
							`+ products[a].localeData[0].description +
						`&nbsp;&nbsp;&nbsp;<button style="width:120px; margin-top:-20px;" class='imperfectThin btn PanelBtn buyBtn' id='buyButton` + (a + 1) + `' json_no='` + (a + 1) + `' json_data='` + JSON.stringify(products[a]) + `'>&nbsp;&nbsp;Buy&nbsp;&nbsp;</button>
							<br/><br/>
							</tr>`;

				}
			}

			html += `</table>`;

			$('#purchaseTable').empty();
			$('#purchaseTable').html(html);

			$('.buyBtn').click(function () {

				if (IS_PREMIUM_CHECK == 1) {
					alert("You already have an active membership.");
					return;

				}

				$('#pageContent').hide();

				var btnID = $(this).attr("json_no");

				var data = JSON.parse($(this).attr("json_data"));

				//alert(data.sku);

				var sku = data.sku;
				var price = data.localPrice;
				var buttonID = "buyButton" + btnID;

				/*
				google.payments.inapp.buy({
				  'parameters': {'env': 'prod'},
				  'sku': sku,
				  'success': onPurchase,
				  'failure': onPurchaseFail
				});
				*/

				$('#dropin-status').html('<br><center><h3 style="color:gray";>Loading..</h3></center>');

				getPayment(sku, price, buttonID);

			});

			$('.cancelBtn').click(function () {

				var btnID = $(this).attr("json_no");

				var data = JSON.parse($(this).attr("json_subs_data"));
				var data2 = JSON.parse($(this).attr("json_data"));

				var subsID = data.bt_payload.subscription.id;
				var buttonID = "cancelButton" + btnID;
				var sku = data2.sku;

				var r = confirm("Are you sure you want to cancel this subscription? You will immediately lose access to all premium features in this subscription.");

				if (r == true) {
					//alert(subsID);

					cancelPayment(sku, subsID, buttonID);
				}

			});

		});


	}).call(this, products);

}

function onPurchase(response) {

	// alert("Order ID: " + response.response.orderID);

}

function onPurchaseFail(response) {

	alert("Purchase Failed");

}

var next = 0;

var custID = "";

function getPayment(sku, price, buttonID) {
	chrome.storage.local.get('BTcustomerID', function (result) {

		if (result.BTcustomerID) {
			custID = result.BTcustomerID;
		}

		var clientToken = "";

		var http = new XMLHttpRequest();
		var url = BT_HOST;
		var params = JSON.stringify({ "action": "GET_CLIENT_TOKEN", "customerID": custID });

		callAjax(url, params, function (json) {

			console.log(json);

			if (json.isSuccess == "TRUE") {
				$('#dropin-status').empty();
				$('#dropin-status').html('<br><center><p style="color:gray";>Payments by Braintree (A PayPal Company)</p></center>');
				$('#paymentButton').show();
				$('#paymentButton').text("Next");

				clientToken = json.clientToken;

				custID = json.customerID;

				console.log(custID);

				chrome.storage.local.set({ 'BTcustomerID': custID });

				chrome.storage.local.get('recruiterID', function (result2) {

					if (result2.recruiterID) {
						var url = HOST + "api/auth/setbid/";

						console.log(url);

						var params = JSON.stringify({ "token": result2.recruiterID, "BTcustomerID": custID });

						console.log(params);

						callAjax(url, params, function (json2) {

							console.log(json2);

						});

					}

				});

				console.log(clientToken);

				var button = document.querySelector('#paymentButton');

				braintree.dropin.create({
					authorization: clientToken,
					container: '#dropin-container'
				}, function (createErr, instance) {
					button.addEventListener('click', function () {

						if (next != 0) {
							$('#dropin-status').empty();
							$('#dropin-status').html('<br><center><p style="color:gray";>Processing..</p></center>');

						}

						instance.requestPaymentMethod(function (err, payload) {

							if (next == 0) {
								console.log(next);
								next = 1;
								$('#paymentButton').text("Pay");
								return;

							}

							console.log(payload);
							console.log(parseFloat(price));

							var http = new XMLHttpRequest();
							var url = BT_HOST;
							var params = JSON.stringify({ "action": "NONCE", "nonceFromClient": payload.nonce, "localPrice": price, "sku": sku });

							callAjax(url, params, function (json2) {

								console.log(json2);

								if (json2.result.success == true) {
									var d = new Date();
									var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();

									var payObj = { "sku": sku, "price": price, "date": date, "bt_payload": json2.result }
									console.log(payObj);

									BROWSER.storage.local.get('paymentArray', function (result) {
										var pmA = [];

										if (result['paymentArray']) {
											pmA = result['paymentArray'];

										}

										pmA.push(payObj);

										console.log("pmA");
										console.log(JSON.stringify(pmA));

										var obj = {};
										var key = 'paymentArray';
										obj[key] = pmA;
										chrome.storage.local.set(obj);

										chrome.storage.local.get('recruiterID', function (result3) {

											if (result3.recruiterID) {
												// var url = HOST + "api/addtransaction";

												// console.log(url);

												var params = JSON.stringify({ "token": result3.recruiterID, "sku": sku, "price": price, "date": date, "bt_payload": json2.result });

												console.log(params);

												BROWSER.runtime.sendMessage({
													'cmd': 'ADD_TRANSACTION',
													params: params
												}, function (json3) {
													console.log('ADD TRANSACTION RESPONSE: ', json3)
												})

												// callAjax(url, params, function (json3) {

												// 	console.log(json3);

												// });


											}

										});

										chrome.storage.local.set({ 'isPremium': '1' });
										chrome.storage.local.set({ 'premiumCheckDate': d.getDate() });

									});

									$('#' + buttonID).text("Purchased");
									$('#' + buttonID).css("background-color", "gray");
									$('#' + buttonID).attr("disabled", true);

									$('#dropin-container').empty();
									$('#dropin-status').empty();
									$('#paymentButton').hide();
									$('#pageContent').show();

									next = 0;

									alert("Membership Purchased.");

									location.reload();

									updateReferralInfo()

								}
								else {
									alert("Some Error Occurred.");

								}

							});

						});
					});
				});

			}
			else {

			}



		});

	});
}

function cancelPayment(sku, subsID, buttonID) {

	var http = new XMLHttpRequest();
	var url = BT_HOST;
	var params = JSON.stringify({ "action": "CANCEL", "subsID": subsID });

	callAjax(url, params, function (json) {

		console.log(json);

		if (json.result.success == true) {

			BROWSER.storage.local.get('paymentArray', function (result) {
				var pmA = [];

				if (result['paymentArray']) {
					pmA = result['paymentArray'];

					for (var x = 0; x < pmA.length; x++) {
						if (sku == pmA[x].sku) {
							pmA.splice(x, 1);
						}

					}

					var obj = {};
					var key = 'paymentArray';
					obj[key] = pmA;
					chrome.storage.local.set(obj);

					var d = new Date();
					chrome.storage.local.set({ 'isPremium': '0' });
					chrome.storage.local.set({ 'premiumCheckDate': d.getDate() });

				}

				alert("Subscription Cancelled.");

				location.reload();

			});

		}
		else {
			// alert(json.result.message);

		}

	});

}

function callAjax(url, params, callback, type = "POST") {
	var http = new XMLHttpRequest();
	http.open(type, url, true);
	http.setRequestHeader("Content-type", "application/json");
	
	var paramsArray = JSON.parse(params);
	if (paramsArray.token)
	{
		http.setRequestHeader("Authorization", paramsArray.token);
	
	}
	
	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {
			var json = JSON.parse(http.responseText);
			callback(json);
		}
	};
	http.send(params);
}


function getPaymentInfo(recrID) {

	var url = HOST + "api/auth/getTransactions";

	console.log(url);

	var params = JSON.stringify({ "token": recrID });

	console.log(params);

	callAjax(url, params, function (json) {

		if (json.results && json.results.length > 0) {
			console.log(json.results);

			var x = json.results.length - 1;

			var BTcustomerID = json.results[x].recruiter.BTcustomerID;

			chrome.storage.local.set({ 'BTcustomerID': BTcustomerID });

			// TO DO - Check Valid Subscription Here

			var obj = {};
			var key = 'paymentArray';
			obj[key] = json.results;
			chrome.storage.local.set(obj);

			chrome.storage.local.set({ 'isPremium': '1' });

			var d = new Date();

			chrome.storage.local.set({ 'premiumCheckDate': d.getDate() });

			alert("Membership Restored.");

			location.reload();

			updateReferralInfo()

		}

	});

}


$('#restoreS').click(function () {

	chrome.storage.local.get('recruiterID', function (result) {

		if (result.recruiterID) {
			getPaymentInfo(result.recruiterID);

		}

	});

});

