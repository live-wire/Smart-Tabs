document.addEventListener('DOMContentLoaded',function(){
	chrome.tabs.query({
	windowId: chrome.windows.WINDOW_ID_CURRENT}, function(array_of_tabs){
		//var mainParent = document.getElementById("main");
		//var list = document.getElementById('tabList');
		var totalTabs = array_of_tabs.length;
		var itemCreated = 0;
		for(i=0;i<totalTabs;i++){
		//while(itemCreated != totalTabs){
			//var tabInfo = localStorage.getItem('tab'+array_of_tabs[i].id.toString());
			//if(tabInfo)	
			createContentItem(array_of_tabs[i]);
			itemCreated++;
		}
		
	});
},false);

function createContentItem(tabObj){
			var titleString = tabObj.title;
			var contentItem = document.createElement('DIV');
			contentItem.addEventListener('click',function(){switchToTab(tabObj.id);});
			contentItem.setAttribute('class','contentItem');
			contentItem.setAttribute('title',titleString);
			contentItem.setAttribute('id',tabObj.id.toString())
			var titleDiv = document.createElement('DIV');
			titleDiv.setAttribute('class','titleDiv');
			var closeImage = document.createElement('IMG');
			closeImage.setAttribute('title','Close Tab');
			closeImage.setAttribute('class','closeImage');
			closeImage.setAttribute('src','close.png');
			closeImage.addEventListener('click',function(){closeTab(tabObj.id);});
			titleDiv.appendChild(closeImage);
			var reloadImage = document.createElement('IMG');
			reloadImage.setAttribute('title','Reload Tab');
			reloadImage.setAttribute('class','reloadImage');
			reloadImage.setAttribute('src','reload.png');
			reloadImage.addEventListener('click',function(){reloadTab(tabObj.id);});
			titleDiv.appendChild(reloadImage);
			var urlImage = document.createElement('IMG');
			urlImage.setAttribute('title','Copy Url');
			urlImage.setAttribute('class','urlImage');
			urlImage.setAttribute('src','url.png');
			urlImage.addEventListener('click',function(){copyUrl(tabObj.id);});
			titleDiv.appendChild(urlImage);
			var favIconImage = document.createElement('IMG');
			favIconImage.setAttribute('class','favIconImage');
			favIconImage.src = tabObj.favIconUrl;
			titleDiv.appendChild(favIconImage);
			var tabTitle = document.createElement('P');
			tabTitle.setAttribute('class','tabTitle');
			tabTitle.innerHTML = titleString;
			titleDiv.appendChild(tabTitle);
			contentItem.appendChild(titleDiv);
			var descDiv = document.createElement('DIV');
			descDiv.setAttribute('class','descDiv');
			var desc = document.createElement('LABEL');
			desc.setAttribute('class','desc');
			desc.innerHTML = getDescription(tabObj.id);
			descDiv.appendChild(desc);
			contentItem.appendChild(descDiv);

			document.getElementById('main').appendChild(contentItem);
}
function getDescription(tabId){
	if(localStorage.getItem('tab'+tabId) === null){
		return "Unable to fetch timestamp.";
	}
	else{
		var currentTime = new Date();
		var tabInfo = JSON.parse(localStorage.getItem('tab'+tabId));
		var tabTimeStamp = new Date(tabInfo.timeStamp);
		var daysElapsed = currentTime.getDate() - tabTimeStamp.getDate();
		var hoursElapsed = currentTime.getHours() - tabTimeStamp.getHours();
		var minutesElapsed = currentTime.getMinutes() - tabTimeStamp.getMinutes();
		if(daysElapsed>0 && hoursElapsed > 23){
			if(daysElapsed == 1)
				return daysElapsed+' day ago.';
			else
				return daysElapsed+' days ago.';
		}
		else if(hoursElapsed>0){
			if(hoursElapsed == 1)
				return hoursElapsed+' hour ago.';
			else
				return hoursElapsed+' hours ago.';
		}
		else if(minutesElapsed>0){
			if(minutesElapsed == 1)
				return minutesElapsed+' minute ago.';
			else
				return minutesElapsed+' minutes ago.'
		}
		else 
			return 'few seconds ago.'
	}
}
function switchToTab(tabId){
	chrome.tabs.update(tabId,{
			active:true
		});
	//chrome.tabs.reload(Number(obj.getAttribute('id')));
}
function reloadTab(tabId){
	window.event.stopPropagation();
	chrome.tabs.reload(tabId);
}
function closeTab(tabId,item){
	window.event.stopPropagation();
	chrome.tabs.remove(tabId);
	document.getElementById(tabId.toString()).style.height = "0px";
	window.setTimeout(function(){document.getElementById('main').removeChild(document.getElementById(tabId.toString()));},300);
	//
}
function copyUrl(tabId){
	window.event.stopPropagation();
	chrome.tabs.get(tabId,function(tab){
		//console.log(tab.url.toString());
		var text = document.createElement('textarea');
		text.innerHTML = tab.url.toString();
		text.select();
		//copied = text.createTextRange();
		//copied = tab.url.toString();
		var t={
			link: tab.url.toString()
		};
		chrome.extension.sendRequest(t);
		//document.execCommand("copy");
	});
}

