//use JSON.stringify and JSON.parse
var myTabInfo={
	tabId:null,
	openerTabId:null,
	timeStamp:null
}
var totalTabs=0;
console.log('Dhruv1234');
// chrome.windows.onCreated(function(){
// console.log('window created');
chrome.tabs.query({
	windowId: chrome.windows.WINDOW_ID_CURRENT},function(array_of_tabs){
		console.log('Dhruv '+array_of_tabs.length);
		for(i=0;i<array_of_tabs.length;i++){
		myTabInfo.tabId=array_of_tabs[i].id;
		myTabInfo.openerTabId = array_of_tabs[i].openerTabId;
		var dateObj = new Date();
		myTabInfo.timeStamp = dateObj.getTime();        // instead pass complete dateObj
		localStorage.setItem('tab'+array_of_tabs[i].id.toString(),JSON.stringify(myTabInfo));      //'tab'+t.id.toString(),JSON.stringify(myTabInfo));   
		//console.log(t.openerTabId);
		totalTabs+=1;
		chrome.browserAction.setBadgeText({text:totalTabs.toString()});
		}
	});
// });
chrome.tabs.onCreated.addListener(function(t){
	myTabInfo.tabId=t.id;
	myTabInfo.openerTabId = t.openerTabId;
	var dateObj = new Date();
	myTabInfo.timeStamp = dateObj.getTime();        // instead pass complete dateObj
	localStorage.setItem('tab'+t.id.toString(),JSON.stringify(myTabInfo));      //'tab'+t.id.toString(),JSON.stringify(myTabInfo));   
	//console.log(t.openerTabId);
	totalTabs+=1;
	chrome.browserAction.setBadgeText({text:totalTabs.toString()});
	//console.log("sessionItemValue = "+localStorage.getItem('sumit'));
});
chrome.tabs.onRemoved.addListener(function(tid){
	localStorage.removeItem('tab'+tid.toString());
	totalTabs-=1;
	chrome.browserAction.setBadgeText({text:totalTabs.toString()});
});
chrome.extension.onRequest.addListener(function(obj){
	console.log(obj.link);
	var buffer= document.getElementById('buffer');
	buffer.value = obj.link;
	buffer.focus();
	buffer.select();
	if(!document.execCommand('copy'))
		console.log("copy failed");
});
