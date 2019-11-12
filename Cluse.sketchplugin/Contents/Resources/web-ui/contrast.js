var f, b;

$(function() {

    var $textInputs = $('#fHex, #bHex'),
        $colorInputs = $textInputs.add('#fPick, #bPick'),
        $colorSliders = $('#fLightness, #bLightness');

    initialize();

    $textInputs.focus(function() {
        $(this).select();
    });

    $colorSliders.mousedown(function() {
        $(this).mousemove(function() {
            changeHue($(this).attr('id').substr(0, 1));
        });
    }).on('mouseup mouseout', function() {
        $(this).unbind('mousemove');
    });

    $colorSliders.change(function() {
        changeHue($(this).attr('id').substr(0, 1));
    });

    $colorInputs.change(function() {
        var $this = $(this),
            color = $this.val(),
            context = $this.attr('id').substr(0, 1);

        $('#' + context + 'Error').slideUp();
        if (color.substr(0, 1) !== '#') color = '#' + color;
        if (color.length == 4) color = '#' + color.substr(1, 1).repeat(2) + color.substr(2, 1).repeat(2) + color.substr(-1).repeat(2);
        $this.val(color);

        // Validation
        if (color.length !== 7 || isNaN(getRGB(color.substr(1)))) {
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
    $('#fHex, #fPick').val(f);
    $('#bHex, #bPick').val(b);
    $('#normal, #big, #ui').css({
        'color': f,
        'background-color': b
    });
    $('#uibox').css({
        'border-color': f
    });
    $('#layer1 path').css({
        'fill': f
    });

    // Update lightness sliders
    var fHSL = RGBtoHSL(getRGB(f.substr(1, 2)), getRGB(f.substr(3, 2)), getRGB(f.substr(-2)));
    var bHSL = RGBtoHSL(getRGB(b.substr(1, 2)), getRGB(b.substr(3, 2)), getRGB(b.substr(-2)));
    $('#fLightness').val(Math.round(fHSL[2]))
        .next('div.gradient').css('background', 'linear-gradient(to right,hsl(' + fHSL[0] + ',' + fHSL[1] + '%,0%), hsl(' + fHSL[0] + ',' + fHSL[1] + '%,50%), hsl(' + fHSL[0] + ',' + fHSL[1] + '%,100%))')
    $('#bLightness').val(Math.round(bHSL[2]))
        .next('div.gradient').css('background', 'linear-gradient(to right,hsl(' + bHSL[0] + ',' + bHSL[1] + '%,0%), hsl(' + bHSL[0] + ',' + bHSL[1] + '%,50%), hsl(' + bHSL[0] + ',' + bHSL[1] + '%,100%))');

    // Update contrast ratio
    checkContrast();
}

// Calculation Functions

function changeHue(context) {
    HSL = RGBtoHSL(getRGB(eval(context).substr(1, 2)), getRGB(eval(context).substr(3, 2)), getRGB(eval(context).substr(-2)));
    RGB = HSLtoRGB(HSL[0], HSL[1], $('#' + context + 'Lightness').val());
    for (var i = 0; i < 3; i++) {
        RGB[i] = (RGB[i] >= 16) ? RGB[i].toString(16) : '0' + RGB[i].toString(16);
    }
    eval(context + '= "#" + (RGB[0] + RGB[1] + RGB[2]).toUpperCase()');
    update();
}

function checkContrast() {
    var L1 = getL(f),
        L2 = getL(b),
        ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    // Dec2() truncates the number to 2 decimal places without rounding.
    $('#ratio').html('<b>' + Dec2((ratio * 100) / 100) + '</b>:1');
    //$('#ratio').html('<b>' + (Math.round(ratio * 100) / 100).toFixed(2) + '</b>:1');
    if (ratio >= 4.5) {
        $('#normalAA, #bigAAA').attr('class', 'pass').text('Pass');
        $('#ratio').attr('class', 'pass');
    } else {
        $('#normalAA, #bigAAA').attr('class', 'fail').text('Fail');
        $('#ratio').removeClass('pass');
        $('#ratio').attr('class', 'contrast');
    }
    if (ratio >= 3) {
        $('#bigAA').attr('class', 'pass').text('Pass');
        $('#uiAA').attr('class', 'pass').text('Pass');
    } else {
        $('#bigAA').attr('class', 'fail').text('Fail');
        $('#uiAA').attr('class', 'fail').text('Fail');
    }
    if (ratio >= 7) {
        $('#normalAAA').attr('class', 'pass').text('Pass');
    } else {
        $('#normalAAA').attr('class', 'fail').text('Fail');
    }
}

function getRGB(c) {
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

function getsRGB(c) {
    c = getRGB(c) / 255;
    c = (c <= 0.03928) ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4);
    return c;
}

function getL(c) {
    return (0.2126 * getsRGB(c.substr(1, 2)) + 0.7152 * getsRGB(c.substr(3, 2)) + 0.0722 * getsRGB(c.substr(-2)));
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