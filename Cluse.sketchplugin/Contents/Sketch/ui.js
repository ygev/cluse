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
					
					if (message.close == true) {
						console.log("closing window");
						_window.close();
					} else {
						onApplyMessage(message);
					}
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
		NSMakeRect(0, 0, 440, 430),
		NSWindowStyleMaskClosable | NSWindowStyleMaskTitled | NSWindowStyleMaskResizable,
		NSBackingStoreBuffered,
		false
	);

	window.becomesKeyOnlyIfNeeded = true;
	window.floatingPanel = true;

	// Increment++ first number of the frameAutosaveName value every time you change NSMakeRect!
	window.frameAutosaveName = "6-cluse-panel-frame";

	window.minSize = window.frame().size;
	window.maxSize = window.frame().size;

	window.releasedWhenClosed = false;

	window.standardWindowButton(NSWindowZoomButton).hidden = true;
	window.standardWindowButton(NSWindowMiniaturizeButton).hidden = true;
	window.standardWindowButton(NSWindowCloseButton).hidden = true;

	window.titlebarAppearsTransparent = true;

	window.backgroundColor = NSColor.colorWithRed_green_blue_alpha(1.0, 1.0, 1.0, 1.0);

	return window;
};

function showWindow(window){
	window.makeKeyAndOrderFront(nil);
};

//	Public

function loadAndShow(baseURL, onApplyMessage, onLoad){
	if(_window && _webView) {
		if (onLoad(_webView)) {
			showWindow(_window);
		}

		return;
	}

	const pageURL = baseURL
		.URLByDeletingLastPathComponent()
		.URLByAppendingPathComponent("../Resources/web-ui/index.html");

	const window = createWindow();
	_webView = createWebView(pageURL, onApplyMessage, webView => {
		if (onLoad(webView)) {
			showWindow(window);
		}
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

//	Export

module.exports = { loadAndShow, cleanup };
