function apply(){
        window.webkit.messageHandlers.sketchPlugin.postMessage(
                JSON.stringify({"testMessage": "hello from hook.js!"})
        );
};

function setColorInit(b, f) {
	document.getElementById("normal").style.backgroundColor = b;
	document.getElementById("normal").style.color = f;
}

document.addEventListener("DOMContentLoaded", () => {
	//	Set up apply to trigger on button press

	document.getElementById("js-ok").addEventListener("click", () => {
		apply();
	});

	//	Add ENTER key shortcut

	document.body.addEventListener("js-ok", e => {
		if(e.keyCode !== 13) return;

		apply();
	});
});
