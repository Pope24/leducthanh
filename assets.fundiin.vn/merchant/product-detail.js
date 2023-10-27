//apply for new version
/**
 * 
 */
var request = new XMLHttpRequest();
var websiteMerchant1 = location.origin;
if (! (/\/$/.test(websiteMerchant1) ) ) {
    websiteMerchant1 = websiteMerchant1 + "/";
}
request.open('GET', "https://merchants.fundiin.vn/wp-json/fundiin/v1/load-product-detail-script?domain=" + websiteMerchant1, true);
request.onload = function() {

    if (typeof(fundiin) == "undefined") {
        var res = request.responseText;
        var res1 = res.substring(1, res.length - 1).replaceAll("\\r\\n", "").replaceAll("\\t", "").replaceAll("\\\"", "\"").replaceAll("\\\/", "\/");
        var scriptTag = document.createElement('script');
    
        scriptTag.defer = true;
        scriptTag.innerText = res1;
        document.body.appendChild(scriptTag);
    }
}
request.send();