var fColor = '#FFFFFF', bColor = '#006CF4', fHSL = [0, 0, 100], bHSL = [213, 100, 47.8], fAlphaDec = 1.0;

$(function() {

    var $textInputs = $('#fHex, #bHex'),
        $colorInputs = $textInputs.add('#fPick, #bPick'),
        $colorSliders = $('#fColorLightness, #bColorLightness');

    $textInputs.focus(function() {
        $(this).select();
    });

    $colorSliders.mousedown(function() {
        $(this).mousemove(function() {
            changeHue($(this).attr('id').substr(0, 1) + 'Color');
        });
    }).on('mouseup mouseout', function() {
        $(this).unbind('mousemove');
    });

    $colorSliders.change(function() {
        changeHue($(this).attr('id').substr(0, 1) + 'Color');
    });

    $colorInputs.change(function() {
        var $this = $(this),
            color = $this.val(),
            context = $this.attr('id').substr(0, 1) + 'Color';

        $('#' + context + 'Error').slideUp();
        if (color.substr(0, 1) !== '#') color = '#' + color;
        if (color.length == 4) color = '#' + color.substr(1, 1).repeat(2) + color.substr(2, 1).repeat(2) + color.substr(-1).repeat(2);
        $this.val(color);

        // Validations
        if (color.length !== 7 || isNaN(hexToDec(color.substr(1)))) {
            $this.attr({
                'aria-invalid': true,
                'aria-describedby': context + 'Error'
            });
            $('#' + context + 'Error').slideDown('fast', function() {
                $this.focus();
            });
        } else {
            $this.removeAttr('aria-invalid aria-describedby');
            $('#' + context + 'Error').slideUp('fast');
            eval(context + '= color.toUpperCase()');
            update();
        }
    });

    // Intercept form submit
    $('#contrastForm').submit(function(e) {
        e.preventDefault();
    });
});

// Update all when one is changed
function update() {
    $('#fHex, #fPick').val(fColor);
    $('#bHex, #bPick').val(bColor);
    $('#bCircle').css({
        'background-color': bColor
    })
    $('#fCircle').css({
        'background-color': fColor
    })

    // Update lightness sliders
    $('#fColorLightness').val(Math.round(fHSL[2])).css('background', 'linear-gradient(to right,hsl(' + fHSL[0] + ',' + fHSL[1] + '%,0%), hsl(' + fHSL[0] + ',' + fHSL[1] + '%,50%), hsl(' + fHSL[0] + ',' + fHSL[1] + '%,100%))')
    $('#bColorLightness').val(Math.round(bHSL[2])).css('background', 'linear-gradient(to right,hsl(' + bHSL[0] + ',' + bHSL[1] + '%,0%), hsl(' + bHSL[0] + ',' + bHSL[1] + '%,50%), hsl(' + bHSL[0] + ',' + bHSL[1] + '%,100%))');

    // Update contrast ratio
    checkContrast();

    apply();

    resetButtonState();
}

// Calculation Functions
function changeHue(context) {
    var newLightness = parseInt($('#' + context + 'Lightness').val());
    HSL = [eval(context.substr(0, 1) + "HSL")[0], eval(context.substr(0, 1) + "HSL")[1], newLightness]
    eval(context.substr(0, 1) + "HSL = " + JSON.stringify(HSL))
    RGB = HSLtoRGB(HSL[0], HSL[1], HSL[2])
    for (var i = 0; i < 3; i++) {
        RGB[i] = (RGB[i] >= 16) ? RGB[i].toString(16) : '0' + RGB[i].toString(16);
    }
    eval(context + '= "#" + (RGB[0] + RGB[1] + RGB[2]).toUpperCase()');
    update();
}

function checkContrast() {
    var L1 = getLWithAlpha(fColor, bColor, fAlphaDec),
        L2 = getL(bColor),
        ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    $('#ratio').html('<b>' + Dec2((ratio * 100) / 100) + '</b>:1');

    if (document.getElementById("js-txtSize").innerHTML == "Normal Text") {
        if (ratio >= 7) {
            // normal AAA pass
            $('#AAA').attr("src","img/yes.svg");
        } else {
            // normal AAA fail
            $('#AAA').attr("src","img/no.svg");
        }

        if (ratio >= 4.5) {
            // normal-size AA pass
            $('#AA').attr("src","img/yes.svg");
        } else {
            // normal-size AA fail
            $('#AA').attr("src","img/no.svg");
        }
    } else {
        if (ratio >= 3) {
            // big AA pass
            $('#AA').attr("src","img/yes.svg");
        } else {
            // big AA fail
            $('#AA').attr("src","img/no.svg");
        }

        if (ratio >= 4.5) {
            // big AAA pass
            $('#AAA').attr("src","img/yes.svg");
        } else {
            // big AAA fail
            $('#AAA').attr("src","img/no.svg");
        }
    }
}

function hexToDec(c) {
    // parse c as hex number
    try {
        var c = parseInt(c, 16);
    } catch (err) {
        var c = false;
    }
    return c;
}

function HSLtoRGB(H, S, L) {
    var p1, p2;
    L /= 100;
    S /= 100;
    if (L <= 0.5) p2 = L * (1 + S);
    else p2 = L + S - (L * S);
    p1 = 2 * L - p2;
    if (S == 0) {
        R = G = B = L;
    } else {
        R = findRGB(p1, p2, H + 120);
        G = findRGB(p1, p2, H);
        B = findRGB(p1, p2, H - 120);
    }
    return [Math.round(R *= 255), Math.round(G *= 255), Math.round(B *= 255)];
};

function RGBtoHSL(r, g, b) {
    var Min, Max;
    r = (r / 51) * 0.2;
    g = (g / 51) * 0.2;
    b = (b / 51) * 0.2;
    if (r >= g) {
        Max = r;
    } else {
        Max = g;
    }
    if (b > Max) {
        Max = b;
    }
    if (r <= g) {
        Min = r;
    } else {
        Min = g;
    }
    if (b < Min) {
        Min = b;
    }
    L = (Max + Min) / 2;
    if (Max == Min) {
        S = H = 0;
    } else {
        if (L < 0.5) {
            S = (Max - Min) / (Max + Min);
        } else {
            S = (Max - Min) / (2 - Max - Min);
        }
        if (r == Max) {
            H = (g - b) / (Max - Min);
        }
        if (g == Max) {
            H = 2 + ((b - r) / (Max - Min));
        }
        if (b == Max) {
            H = 4 + ((r - g) / (Max - Min));
        }
    }
    H = Math.round(H * 60);
    if (H < 0) {
        H += 360;
    }
    if (H >= 360) {
        H -= 360;
    }
    return [H, Math.round(S * 100), Math.round(L * 100)];
}

function findRGB(q1, q2, hue) {
    if (hue > 360) hue -= 360;
    if (hue < 0) hue += 360;
    if (hue < 60) return (q1 + (q2 - q1) * hue / 60);
    else if (hue < 180) return (q2);
    else if (hue < 240) return (q1 + (q2 - q1) * (240 - hue) / 60);
    else return (q1);
}

function calculateLuminance(c) {
    c = (c <= 0.03928) ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4);
    return c;
}

function getL(c) {
	r_color = hexToDec(c.substr(1, 2)) / 255;
	g_color = hexToDec(c.substr(3, 2)) / 255;
	b_color = hexToDec(c.substr(-2)) / 255;

    r_lum = calculateLuminance(r_color);
    g_lum = calculateLuminance(g_color);
    b_lum = calculateLuminance(b_color);

    return (0.2126 * r_lum) + (0.7152 * g_lum) + (0.0722 * b_lum);
}

function getLWithAlpha(foreground_c, background_c, alpha) {
    fg_r_color = hexToDec(foreground_c.substr(1, 2)) / 255;
    fg_g_color = hexToDec(foreground_c.substr(3, 2)) / 255;
    fg_b_color = hexToDec(foreground_c.substr(-2)) / 255;

    bg_r_color = hexToDec(background_c.substr(1, 2)) / 255;
    bg_g_color = hexToDec(background_c.substr(3, 2)) / 255;
    bg_b_color = hexToDec(background_c.substr(-2)) / 255;

    // now, use the alpha to combine foreground+background...
    fg_r_color_combined = (alpha * fg_r_color) + ((1 - alpha) * bg_r_color);
    fg_g_color_combined = (alpha * fg_g_color) + ((1 - alpha) * bg_g_color);
    fg_b_color_combined = (alpha * fg_b_color) + ((1 - alpha) * bg_b_color);

    // and convert to luminance
    r_lum = calculateLuminance(fg_r_color_combined);
    g_lum = calculateLuminance(fg_g_color_combined);
    b_lum = calculateLuminance(fg_b_color_combined);

    return (0.2126 * r_lum) + (0.7152 * g_lum) + (0.0722 * b_lum);
}

function Dec2(num) {
    num = String(num);
    if (num.indexOf('.') !== -1) {
        var numarr = num.split(".");
        if (numarr.length == 1) {
            return Number(num);
        } else {
            return Number(numarr[0] + "." + numarr[1].charAt(0) + numarr[1].charAt(1));
        }
    } else {
        return Number(num);
    }
}
