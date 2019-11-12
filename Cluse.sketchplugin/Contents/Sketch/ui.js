const MochaJSDelegate = require("./MochaJSDelegate");
var _window;
var _webView;

//	Private

function createWebView(pageURL, onApplyMessage, onLoadFinish){
	const webView = WKWebView.alloc().init();

	//	Create delegate
	const delegate = new MochaJSDelegate({
		"webView:didFinishNavigation:": (_, navigation) => {
			onLoadFinish(webView);
		},
		"userContentController:didReceiveScriptMessage:": (_, wkMessage) => {
                        console.log("didReceiveScriptMessage: " + wkMessage.body())

                        try {
                                const message = JSON.parse(wkMessage.body());
                                onApplyMessage(message);
                        } catch(error) {
                                console.error(error);
                        }
		}
	}).getClassInstance();

	//	Set load complete handler
	webView.navigationDelegate = delegate;

	//	Set handler for messages from script
	const userContentController = webView.configuration().userContentController();
	userContentController.addScriptMessageHandler_name(delegate, "sketchPlugin");

	//	Load page into web view
	webView.loadFileURL_allowingReadAccessToURL(pageURL, pageURL.URLByDeletingLastPathComponent());

	return webView;
};

function createWindow(){
	const window = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(
		NSMakeRect(0, 0, 440, 490),
		NSWindowStyleMaskClosable | NSWindowStyleMaskTitled | NSWindowStyleMaskResizable,
		NSBackingStoreBuffered,
		false
	);

	window.becomesKeyOnlyIfNeeded = true;
	window.floatingPanel = true;

	window.frameAutosaveName = "cluse-panel-frame";

	window.minSize = window.frame().size;
	window.maxSize = window.frame().size;

	window.releasedWhenClosed = false;

	window.standardWindowButton(NSWindowZoomButton).hidden = true;
	window.standardWindowButton(NSWindowMiniaturizeButton).hidden = true;

	window.titlebarAppearsTransparent = true;

	window.backgroundColor = NSColor.colorWithRed_green_blue_alpha(0.97, 0.96, 0.97, 1.0);

	return window;
};

function showWindow(window){
	window.makeKeyAndOrderFront(nil);
};

//	Public

function loadAndShow(baseURL, onApplyMessage, onLoad){
	if(_window && _webView) {
		onLoad(_webView);
		showWindow(_window);

		return;
	}

	const pageURL = baseURL
		.URLByDeletingLastPathComponent()
		.URLByAppendingPathComponent("../Resources/web-ui/index.html");

	const window = createWindow();
	_webView = createWebView(pageURL, onApplyMessage, webView => {
		onLoad(webView);
		showWindow(window);
	});

	window.contentView = _webView;
	_window = window;
};

function cleanup(){
	if(_window){
		_window.orderOut(nil);
		_window = null;
	}
};



// FAIL AT CANCELLING
// var cancelButton = document.getElementById("js-cancel");
// cancelButton.onclick = function(){
// 	window.close();
// };

//	Export

module.exports = { loadAndShow, cleanup };
