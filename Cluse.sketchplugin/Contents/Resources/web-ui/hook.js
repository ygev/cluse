// Set initial values.
var initFg, initBg, initFAlpha, initBAlpha, initFgLightness, initBgLightness, swapped = false;

// Get values from Sketch.
function setSketchData(bg, fg, txtSize) {
	fColor = fg.substring(0,7);
    fAlphaHex = fg.substring(7,9);
	fHSL = RGBtoHSL(hexToDec(fColor.substr(1, 2)), hexToDec(fColor.substr(3, 2)), hexToDec(fColor.substr(-2)));
	initFgLightness = fHSL[2];
	bColor = bg.substring(0,7);
    bAlphaHex = bg.substring(7,9);
	bHSL = RGBtoHSL(hexToDec(bColor.substr(1, 2)), hexToDec(bColor.substr(3, 2)), hexToDec(bColor.substr(-2)));
	initBgLightness = bHSL[2];
	initFg = fg;
	initBg = bg;
    initFAlpha = fAlphaHex;
    initBAlpha = bAlphaHex;

    fAlphaDec = parseInt(initFAlpha, 16) / 255;
    fAlphaPercentage = Math.round(fAlphaDec * 100);
    console.log('fAlphaHex: ' + fAlphaHex)
    console.log('fAlphaDec: ' + fAlphaDec)
    console.log('fAlphaPercentage: ' + fAlphaPercentage)

	// Set value of inputs to the correct color hex value
	document.getElementById("fHex").value = fg.substring(0,7);
	document.getElementById("bHex").value = bg.substring(0,7);
    // document.getElementById("fAlpha").value = fAlphaPercentage + "%";
    // if (fAlphaPercentage == "100") {
    //     document.getElementById('fAlpha').style = "display: none";
    // } else {
    //     document.getElementById('fAlpha').style = "display: initial";
    // }

	if (txtSize == "large") {
		document.getElementById("js-txtSize").innerHTML = "Large Text";
		document.getElementsByClassName("text-size")[0].style = "display: intiial";
		document.getElementsByClassName("aaa")[0].style= "display: flex";
	} else if (txtSize == "normal") {
		document.getElementById("js-txtSize").innerHTML = "Normal Text";
		document.getElementsByClassName("text-size")[0].style = "display: initial";
		document.getElementsByClassName("aaa")[0].style= "display: flex";
	} else {
		document.getElementsByClassName("text-size")[0].style = "display: none";
		document.getElementsByClassName("aaa")[0].style= "display: none";
	}

	update();
}

// Apply slider hexes to the canvas.
function apply() {
	var message = {
		background: document.getElementById("bHex").value + initBAlpha,
		foreground: document.getElementById("fHex").value + initFAlpha
	};

	postMessage(JSON.stringify(message));
};

// Reset button appears if you change the value.
function resetButtonState() {
	if (fColor != initFg.substring(0,7)) {
		document.getElementById("js-reset-fg").style.display = "block";
	} else {
		document.getElementById("js-reset-fg").style.display = "none";
	}

	if (bColor != initBg.substring(0,7)) {
		document.getElementById("js-reset-bg").style.display = "block";
	} else {
		document.getElementById("js-reset-bg").style.display = "none";
	}
}

// Reset BG to Original
function resetBg() {
	bColor = initBg.substring(0,7);
	bHSL = RGBtoHSL(hexToDec(bColor.substr(1, 2)), hexToDec(bColor.substr(3, 2)), hexToDec(bColor.substr(-2)));
	document.getElementById("bHex").value = initBg.substring(0,7);
	document.getElementById("bColorLightness").value = initBg;
	document.getElementById("bCircle").style.backgroundColor = initBg;

	var message = {
		background: initBg,
	};

	postMessage(JSON.stringify(message));
	checkContrast();
	resetButtonState();
}

// Reset FG to Original
function resetFg() {
	fColor = initFg.substring(0,7);
	fHSL = RGBtoHSL(hexToDec(fColor.substr(1, 2)), hexToDec(fColor.substr(3, 2)), hexToDec(fColor.substr(-2)));
	document.getElementById("fHex").value = initFg.substring(0,7);
	document.getElementById("fColorLightness").value = initFgLightness;
	document.getElementById("fCircle").style.backgroundColor = initFg;

	var message = {
		foreground: initFg,
	};

	postMessage(JSON.stringify(message));
	checkContrast();
	resetButtonState();
}


// Reset FG & BG to Original (For Cancel Button)
function resetToInitial() {
	if (swapped) {
		swapHTML();
		swapIds();
		swapVars();
		constructResetEventListeners();
		swapped = false;
	}

	var messageCancel = {
		cancel: true
	};

	postMessage(JSON.stringify(messageCancel));
}

// Close the Window
function closeWindow() {
	var messageCancel = {
		close: true
	};

	postMessage(JSON.stringify(messageCancel));
}

function postMessage(messageString) {
    console.log('postMessage: ' + messageString)
    window.webkit.messageHandlers.sketchPlugin.postMessage(messageString);
}

// Swap HTML between Foreground slider and Background slider
function swapHTML() {
	// Swap titles and make flex into column-reverse.
	if (document.getElementById("contrastForm").style.flexDirection == "column") {
		document.getElementById("contrastForm").style.flexDirection = "column-reverse";
		document.getElementsByClassName("color-background")[0].style.borderTop = "1px #d7d7d7 solid";
		document.getElementsByClassName("color-background")[0].style.marginTop = "20px";
		document.getElementsByClassName("color-background")[0].style.paddingTop = "20px";
		document.getElementsByClassName("color-foreground")[0].style.borderTop = "0px #d7d7d7 solid";
		document.getElementsByClassName("col-left")[0].style.marginTop = "20px";
		document.getElementsByClassName("col-left")[0].style.paddingTop = "20px";
		document.getElementsByClassName("col-left")[0].style.paddingBottom = "0";
		document.getElementsByClassName("col-left")[0].style.borderBottom = "0";
		document.getElementById("bTitle").innerHTML = "Foreground Color";
		document.getElementById("fTitle").innerHTML = "Background Color";
	} else {
		document.getElementById("contrastForm").style.flexDirection = "column";
		document.getElementsByClassName("color-background")[0].style.borderTop = "0";
		document.getElementsByClassName("color-background")[0].style.marginTop = "0px";
		document.getElementsByClassName("color-background")[0].style.paddingTop = "0px";
		document.getElementsByClassName("color-foreground")[0].style.borderTop = "1px #d7d7d7 solid";
		document.getElementsByClassName("col-left")[0].style.marginTop = "0px";
		document.getElementsByClassName("col-left")[0].style.paddingTop = "20px";
		document.getElementsByClassName("col-left")[0].style.paddingBottom = "20px";
		document.getElementsByClassName("col-left")[0].style.borderBottom = "0px #d7d7d7 solid";
		document.getElementById("fTitle").innerHTML = "Foreground Color";
		document.getElementById("bTitle").innerHTML = "Background Color";
	}
}

// Swap Ids of Foreground and Background elements
function swapIds() {
	// Swap bColorLightness & fColorLightness
	var firstColorLightness = document.getElementById("fColorLightness"),
		secondColorLightness = document.getElementById("bColorLightness");
	firstColorLightness.id = "bColorLightness";
	secondColorLightness.id ="fColorLightness";

	// Swap bHex & fHex
	var firstHex = document.getElementById("fHex"),
		secondHex = document.getElementById("bHex");
	firstHex.id = "bHex";
	secondHex.id ="fHex";

	// Swap bHex & fHex
	var firstCircle = document.getElementById("fCircle"),
		secondCircle = document.getElementById("bCircle");
	firstCircle.id = "bCircle";
	secondCircle.id ="fCircle";

	// Swap Reset Buttons (apply() works when this is commented out)
	var firstReset = document.getElementById("js-reset-fg"),
		secondReset = document.getElementById("js-reset-bg");
	firstReset.id = "js-reset-bg";
	secondReset.id ="js-reset-fg";
}

// Swap variables of Foreground and Background elements
function swapVars() {
	// Swap bColor & fColor
	var tempColor = bColor;
	bColor = fColor;
	fColor = tempColor;

	// Swap bHSL & fHSL
	var tempHSL = bHSL;
	bHSL = fHSL;
	fHSL = tempHSL;

	// Swap initFg & initBg
	var tempInit = initBg;
	initBg = initFg;
	initFg = tempInit;

	// Swap initFgLightness & initBgLightness
	var tempInitL = initBgLightness;
	initBgLightness = initFgLightness;
	initFgLightness = tempInitL;
}


function constructResetEventListeners() {
	// remove any existing event listeners
	document.getElementById("js-reset-fg").removeEventListener("click", resetBg);
	document.getElementById("js-reset-fg").removeEventListener("click", resetFg);
	document.getElementById("js-reset-bg").removeEventListener("click", resetFg);
	document.getElementById("js-reset-bg").removeEventListener("click", resetBg);

	// When you press undo on BG, reset the BG to the original color.
	document.getElementById("js-reset-bg").addEventListener("click", resetBg);

	// When you press undo on FG, reset the FG to the original color.
	document.getElementById("js-reset-fg").addEventListener("click", resetFg);
}

document.addEventListener("DOMContentLoaded", () => {
	// When you press undo, reset the BG or FG to the original color.
	constructResetEventListeners();

	// When you press cancel, reset everything to original and close window.
	document.getElementById("js-cancel").addEventListener("click", () => {
		resetToInitial();
		closeWindow();
	});

	// When you press OK, apply the new colors and close the window.
	document.getElementById("js-ok").addEventListener("click", () => {
		apply();
		closeWindow();
	});

	// When you press swap, swap foreground and background.
	document.getElementById("js-swap").addEventListener("click", () => {
		if (!swapped) {
			swapped = true;
		} else {
			swapped = false;
		}

		swapHTML();
		swapIds();
		swapVars();
		constructResetEventListeners();
		apply();
	});
});

// Add enter + esc key shortcuts
document.body.addEventListener("keydown", e => {
	if (e.keyCode == 13) {
		apply();
		closeWindow();
	} else if (e.keyCode == 27) {
		resetToInitial();
		closeWindow();
	}
});
