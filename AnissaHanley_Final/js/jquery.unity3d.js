//
// File: 		jquery.unity3d.js
// Author: 		Scott Mitting
// Project: 	Unity Essentials (http://www.unityessentials.com/)
// Copyright: 	Copyright 2009 GSD Software (http://www.gsdsoftware.com/)
//
// Version 1.0.0 - December 10, 2009
//
// Licensed under GPL license (http://www.opensource.org/licenses/gpl-license.php).
//
// Abstract:
//
// This is an implementation of the plugin scripts for using 
// Unity3D (http://www.unity3d.com/) web controls on a webpage.  
// This is mainly a port from the code auto-generate by the Unity
// Editor during publishing, but this format allows for much cleaner
// HTML for the page containing the controls, since much of the code
// below was included directly on the page.
//
// 
// Quick Examples:
//
// Example using option hash:
//	<div id="my-unity"></div>
//	$('#my-unity').unity3d('myscene.unity3d', {width:400, height: 300});
//
// Example using div attributes:
//	<div class="unity" src="myscene.unity3d" width="400" height="300"></div>
//	$('.unity').unity3d();
//
//
(function($) { 
	//
	// plugin definition
	//
	$.fn.unity3d = function(url, options) {		
		// load vbscript on first pass, and give javascript a moment to recognize it
		if (CheckVBLoaded(this, url, options) == true) {
			return this;
		}
		// otherwise immediately process unity controls
		else {
			return ProcessUnityObjects(this, url, options);
		}				
	};	
	$.fn.SendMessage = function(objectName, methodName, arg) {
		return this.each(function() {
			GetUnity(null).SendMessage(objectName, methodName, arg);				
		});
	};
	//
	// plugin default values
	//
	$.fn.unity3d.defaults = {
		objectID: 				'UnityObject',
		embedID: 				'UnityEmbed',
		
		width: 					'600',
		height: 				'400',
		
		backgroundcolor: 		null,
		bordercolor: 			null,
		textcolor: 				null,
		
		logoimage: 				null, 
		progressbarimage: 		null,
		progressframeimage: 	null,

		disableContextMenu: 	null,
		disableExternalCall: 	null,
		disableFullscreen: 		null
	};
	//
	// settings for the installer
	//
	$.fn.unity3d.installer = {
		classid: 				'444785F1-DE89-4295-863A-D46C3A781394',
		codebase: 				'http://webplayer.unity3d.com/download_webplayer-2.x/'
		 						+ 'UnityWebPlayer.cab#version=2,0,0,0',
		pluginspage: 			'http://www.unity3d.com/unity-web-player-2.x',
		embedtype: 				'application/vnd.unity',
		installerid: 			'UnityPrompt',
		restartimage: 			'http://webplayer.unity3d.com/installation/getunityrestart.png',
		installimage: 			'http://webplayer.unity3d.com/installation/getunity.png',
		popupjs: 				'javascript: window.open("http://www.unity3d.com/unity-web-player-2.x")', 
		useXpi: 				false 
	};
	//
	// Global variable for vb init check
	//
	$.fn.unity3d.state = {
		vbloaded: 				false 
	};
	//
	// Returns true iff the required VB script was just loaded, and will automatically
	// launch the process methode in a moment.
	//
	function CheckVBLoaded(jq, url, options) {
		if ($.fn.unity3d.state.vbloaded == false) {	
			$.fn.unity3d.state.vbloaded = true;			
			$('head').append(GetVBScriptTemplate());
			setTimeout(function() { ProcessUnityObjects(jq, url, options); }, 1);
			return true;
		}
		return false;						
	};	
	//
	// Configures unity <embed> and <object> tags from either attributes
	// or arguments, depending on if a url is passed.ç
	//
	function ProcessUnityObjects(jq, url, options) {
		// pull options from attributes for null arguments
		if (url == null) { 
			return jq.each(function() {
				$this = $(this);
				url = $this.attr('src');
				var opts = $.extend({}, $.fn.unity3d.defaults, GetAttrOptions($this));		
				InsertContent($this, url, opts);
			});			
		}
		// pull options from method arguments if url supplied
		else { 
			var opts = $.extend({}, $.fn.unity3d.defaults, options);		
			return jq.each(function() {
				$this = $(this);
				InsertContent($this, url, opts);
			});			
		}		
	};	
	// 
	// detects if the plugin is installed either inserts the tour,
	// a link to the installer, or a link to the product page, as
	// appropriate.
	//
	function InsertContent(jq, url, options) {
		
		// save reference for later
		jq.options = options;
		
		// detect plugin
		var hasUnity = DetectUnityWebPlayer();
		var brokenUnity = false;
		
		if (options == null) options = $.fn.defaults;
		
		// attempt to add content if unity player detected
		if (hasUnity) {
			
			// add option arguments
			var objectExtras = '', embedExtras = '';
			var extras = [
				'logoimage', 'progressbarimage', 'progressframeimage', 
				'disableContextMenu', 'disableExternalCall', 'disableFullscreen',
				'backgroundcolor', 'bordercolor', 'textcolor'
				];
			for (var i in extras) {
				var arg = extras[i];
				if (options[arg] != null) {
					objectExtras += '  <param name="' + arg + '" value="' + options[arg] + '" /> \n';
					embedExtras += ' ' + arg + '="' + options[arg] + '" \n';
				}				
			}	
			
			// .replace() only replaces the first instance in 
			// string, hence the repeated replacemnts.
			jq.append(GetObjectTemplate()
				.replace('%%OBJECTID%%', 	options.objectID)
				.replace('%%CLASSID%%', 	$.fn.unity3d.installer.classid)
				.replace('%%WIDTH%%', 		options.width)
				.replace('%%HEIGHT%%', 		options.height)
				.replace('%%URL%%', 		url)
				.replace('%%EMBEDID%%', 	options.embedID)
				.replace('%%URL%%', 		url)
				.replace('%%WIDTH%%', 		options.width)
				.replace('%%HEIGHT%%', 		options.height)
				.replace('%%EMBEDTYPE%%', 	$.fn.unity3d.installer.embedtype)
				.replace('%%PLUGINSPAGE%%', $.fn.unity3d.installer.pluginspage)
				.replace('%%OBJECTEXTRAS%%',objectExtras)
				.replace('%%EMBEDEXTRAS%%',	embedExtras)
						);		
					
			// if Unity does not define to GetPluginVersion on Safari on 10.6, we presume the plugin
			// failed to load because it is not compatible with 64-bit Safari.
			if (navigator.appVersion.indexOf("Safari") != -1
				&& navigator.appVersion.indexOf("Mac OS X 10_6") != -1
				&& document.getElementById(options.embedID).GetPluginVersion == undefined)
				brokenUnity = true;
		}
		
		// load installer if missing or broken
		if (!hasUnity || brokenUnity) {		
			var installerPath = GetInstallerPath();
			var installerImage = $.fn.unity3d.installer[brokenUnity ? 'restartimage' : 'installimage']
			if (installerPath != "") {
				// Place a link to the right installer depending on the platform we are on. 
				// The iframe is very important! Our goals are:
				// 1. Don't have to popup new page
				// 2. This page still remains active, so our automatic reload script will 
				//		refresh the page when the plugin is installed		
				jq.append(GetInstallerTemplate()
					.replace('%%INSTALLERID%%', 	$.fn.unity3d.installer.installerid)
					.replace('%%INSTALLERURL%%', 	installerPath)
					.replace('%%INSTALLERIMAGE%%', 	installerImage)
					);
			}
			else {
				jq.append(GetPopupTemplate()
					.replace('%%INSTALLERID%%', 	$.fn.unity3d.installer.installerid)
					.replace('%%INSTALLERURL%%', 	installerPath)
					.replace('%%INSTALLERIMAGE%%', 	installerImage)
					);
			}
			
			// hide broken player
			if (brokenUnity)
				document.getElementById(options.embedID).height = 0;
				
			// Reload when detected unity plugin - but only if no previous plugin is installed 
			// - in that case a browser restart is needed.
			if (!brokenUnity)
				AutomaticReload();
		}
				
	};
	// 
	// loads the unity player from the appropriate object for the current
	// browser, which is the object tag on IE and Safari, and the embed
	// tag on all others.
	//
	function GetUnity(options) {
		if (options == null) options = $.fn.unity3d.defaults;
		if (navigator.appVersion.indexOf("MSIE") != -1 && navigator.appVersion.toLowerCase().indexOf("win") != -1)
			return document.getElementById(options.objectID);
		else if (navigator.appVersion.toLowerCase().indexOf("safari") != -1)
			return document.getElementById(options.objectID);
		else
			return document.getElementById(options.objectID);
	}
	//
	// returns true iff the unity player is installed
	//
	function DetectUnityWebPlayer() {
		var tInstalled = false;
		if (navigator.appVersion.indexOf("MSIE") != -1 && navigator.appVersion.toLowerCase().indexOf("win") != -1) {
			tInstalled = DetectUnityWebPlayerActiveX();
		}
		else {
    		if (navigator.mimeTypes && navigator.mimeTypes["application/vnd.unity"]) {
        		if (navigator.mimeTypes["application/vnd.unity"].enabledPlugin 
				&& navigator.plugins && navigator.plugins["Unity Player"]) {
         			tInstalled = true;	
    			}
 			}	
		}
		return tInstalled;	
	}
	//
	// returns the path to the installer for the current platform
	//
	function GetInstallerPath() {
		var tDownloadURL = "";
		var hasXpi = navigator.userAgent.toLowerCase().indexOf( "firefox" ) != -1;		
		// Use standalone installer
		if (hasXpi && $.fn.installer.useXpi) {
			if (navigator.platform == "MacIntel")
				tDownloadURL = "http://webplayer.unity3d.com/download_webplayer-2.x/webplayer-i386.dmg";
			else if (navigator.platform == "MacPPC")
				tDownloadURL = "http://webplayer.unity3d.com/download_webplayer-2.x/webplayer-ppc.dmg";
			else if (navigator.platform.toLowerCase().indexOf("win") != -1)
				tDownloadURL = "http://webplayer.unity3d.com/download_webplayer-2.x/UnityWebPlayer.exe";
			return tDownloadURL;
		}
		// Use XPI installer
		else {
			if (navigator.platform == "MacIntel")
				tDownloadURL = "http://webplayer.unity3d.com/download_webplayer-2.x/UnityWebPlayerOSX.xpi";
			else if (navigator.platform == "MacPPC")
				tDownloadURL = "http://webplayer.unity3d.com/download_webplayer-2.x/UnityWebPlayerOSX.xpi";
			else if (navigator.platform.toLowerCase().indexOf("win") != -1)
				tDownloadURL = "http://webplayer.unity3d.com/download_webplayer-2.x/UnityWebPlayerWin32.xpi";
			return tDownloadURL;
		}    			
	}
	//
	// refreshes the page automatically within 0.5 seconds of the 
	// time the plugin is detected to be installed
	// 
	function AutomaticReload() {
		navigator.plugins.refresh();
		if (DetectUnityWebPlayer())
			window.location.reload();
		setTimeout('AutomaticReload()', 500)
	};
	//
	// returns a hash of all of the attributes of a tag to be used
	// as options for the unity jquery plugin
	//
	function GetAttrOptions(jq) {
		var opts = {};
		for (var i in $.fn.unity3d.defaults) {
			var v = jq.attr(i);
			if (v) opts[i] = v;
		}
		return opts;
	};
	//
	// javascript's best debugger
	//
	function dump(o) {
		var s = '';
		for (var k in o) {
			s += '' + k + ': ' + o[k] + '\n';
		}
		alert(s);
	};	
	// 
	// template for object/embed tags
	//
	function GetObjectTemplate() {
		return 	  '<object id="%%OBJECTID%%" classid="clsid:%%CLASSID%%" width="%%WIDTH%%" height="%%HEIGHT%%"> \n'
				+ '  <param name="src" value="%%URL%%" /> \n%%OBJECTEXTRAS%%'				
				+ '  <embed id="%%EMBEDID%%" src="%%URL%%" width="%%WIDTH%%" height="%%HEIGHT%%" \n'
				+ '		type="%%EMBEDTYPE%%" pluginspage="%%PLUGINSPAGE%%" \n%%EMBEDEXTRAS%%\n'
				+ '		/> \n'
				+ '</object>\n';		
	};
	//
	// template for the installer div and frame
	//
	function GetInstallerTemplate() {
		return 	'<div align="center" id="%%INSTALLERID%%"> \n' +
				'	<a href="%%INSTALLERURL%%"><img src="%%INSTALLIMAGE%%" border="0"/></a> \n' +
				'</div>\n' +
				'<iframe name="InstallerFrame" height="0" width="0" frameborder="0"></iframe>\n';	
	};
	//
	// template to open launch unity website when we can automatically launch an installer
	//	
	function GetPopupTemplate() {
		return 	'<div align="center" id="%%INSTALLERID%%"> \n' +
				'	<a href="%%POPUPJS%%"><img src="%%INSTALLIMAGE%%" border="0"/></a> \n' +
				'</div> \n';
	};		
	//
	// vbscript code used for activex plugin detection.  sigh.
	//
	function GetVBScriptTemplate() {
		return '<script language=\'VBScript\'>\n' +
				'function DetectUnityWebPlayerActiveX\n'+
				'	on error resume next\n'+
				'	dim tControl, res, ua, re, matches, major\n'+
				'	res = 0\n'+
				'	set tControl = CreateObject("UnityWebPlayer.UnityWebPlayer.1")\n' +
				'	if IsObject(tControl) then\n' +
				'		if tControl.GetPluginVersion() = "2.5.0f5" then\n' +  
				'			ua = Navigator.UserAgent\n' +
				'			set re = new RegExp\n' +
				'			re.Pattern = "Windows NT (\\d+)\\."\n' +
				'			set matches = re.Execute(ua)\n' +
				'			if matches.Count = 1 then\n' +
				'				major = CInt(matches(0).SubMatches(0))\n' +
				'				if major < 6 then\n' +
				'					res = 1\n' +
				'				end if\n' +
				'			end if\n' +
				'		else\n' +
				'			res = 1\n' +
				'		end if\n' +  
				'	end if\n' +
				'	DetectUnityWebPlayerActiveX = res\n' +
				'end function\n' 
				'</script>\n';
	};
	//		
})(jQuery);
