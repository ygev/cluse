var sketch = require('sketch/dom');
var async = require('sketch/async');
var DataSupplier = require('sketch/data-supplier');
var UI = require('sketch/ui');
var Settings = require('sketch/settings');

var initBgSketch, initFgSketch;


function onLoad(webView) {
        if (layerChecker()) {
                var doc = sketch.getSelectedDocument();
                var selection = doc.selectedLayers;       
                var bgSketch = selection.layers[0].style.fills[0].color;
                var fgSketch = selection.layers[1].style.textColor;
                initBgSketch = bgSketch;
                initFgSketch = fgSketch;
                console.log("selected #: " + selection.length);
                console.log("layer 0: " + bgSketch);
                console.log("layer 1: " + fgSketch);
                var isLrgSketch = findTxtSize();

                console.log("calling " + `setSketchData('${bgSketch}', '${fgSketch}', ${isLrgSketch})`);
                webView.evaluateJavaScript_completionHandler(`setSketchData('${bgSketch}', '${fgSketch}', ${isLrgSketch})`, null);

                return true;
        } else {
                return false;
        }
}

// Apply Color to Button
function onApply(options) {
        var doc = sketch.getSelectedDocument();
        var selection = doc.selectedLayers;

        if (options.background != null) {
                selection.layers[0].style.fills[0].color = options.background;
        }

        if (options.foreground != null) {
                selection.layers[1].style.textColor = options.foreground;
        }

        if (options.cancel) {
            selection.layers[0].style.fills[0].color = initBgSketch;
            selection.layers[1].style.textColor = initFgSketch;
        }
};

// Determine Text Size
// Large text is defined as 14 point (typically 18.66px) and bold or larger, or 18 point (typically 24px) or larger. --WCAG

function findTxtSize(){
        var doc = sketch.getSelectedDocument();
        var selection = doc.selectedLayers;
        var txtSize = selection.layers[1].style.fontSize;
        var txtWeight = selection.layers[1].style.fontWeight;

        // If font weight is above Sketch level 5, then bold=true, else bold=false.
        var bold;
        if (txtWeight > 5) {
                bold = true;
        }
        else {
             bold = false;
        }

        // If font size is above 18px AND bold or above 24px and NOT bold, it is Large Text, else normal text.
        if ((txtSize >= 18 && bold == true) || txtSize >= 24) {
               return true;
        }
        else if (txtSize < 18) {
                return false;
        }
}


function layerChecker() {
        console.error("Entering layerChecker()");
        var doc = sketch.getSelectedDocument();
        var selection = doc.selectedLayers;    
        const selectedLayer = doc.selectedLayers.layers[0];

        if(!selectedLayer){ // if user selected no layers, display error.
                UI.message('⚠️ No layers are selected.');
                return false;
        } else if(selection.length < 2){ // if user selected 2- layers, display error.
                UI.message('⚠️ Fewer than 2 layers are selected.');
                return false;
        } else if(selection.length > 2){ // if user selected 2+ layers, display error.
                UI.message('⚠️ More than 2 layers are selected.');
                return false;
        }
        return true;
}

module.exports = { onApply, onLoad};    
