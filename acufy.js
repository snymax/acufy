function SVG(options) {
    this.svgns = 'http://www.w3.org/2000/svg';
    this.encodeHeader = "data:image/svg+xml;charset=utf-8,";
    this.xmls = new XMLSerializer;
    this.handleProperties = function (properties) {
        properties = this.standardizeOptions(options);
        this.elem = this.elem || document.createElementNS(this.svgns, options.tag || 'svg');
        if (properties.tag === 'svg') {
            this.setProperties(properties, ['width', 'height']);
        } else {
            this.setProperties(properties, ['width', 'height', 'x', 'y', 'fill', 'stroke', 'stroke-width', ''])
        }
    }

    this.setProperties = function (properties, keys) {
        keys = keys || Object.keys(properties);
        for (var i = 0, ln = keys.length; i < ln; i++) {
            if (keys[i] === '') continue;
            this.elem.setAttribute(keys[i], properties[keys[i]]);
        }
    }

    this.standardizeOptions = function (options) {
        var options = options || {};
        options.tag = options.tag || 'svg';
        options.tag = options.shape || options.tag;
        options.width = options.width || '100%';
        options.height = options.height || '100%';
        options.charset = 'utf8';
        options.x = options.x || 0;
        options.y = options.y || 0;
        options.fill = options.fill || '#000000';
        options['stroke-width'] = options['stroke-width'] || 0;
        options.stroke = options.stroke || '#000000';
        //this is setting a seed limit which will allow how the randomizer picks its colors
        options.seed = options.seed || {};
        options.seed.x = options.seed.x || 1;
        options.seed.y = options.seed.y || 1;
        return options
    }
    this.addShape = function (options) {
        options = options ? this.standardizeOptions(options) : {};
        var shape = new SVG(options);
        this.elem.appendChild(shape.elem);
        return shape;
    }
    this.encodeElem = function (background) {
        var str = this.encodeHeader + this.xmls.serializeToString(this.elem);
        str = background ? "url('" + str + "')" : str;
        console.log(str, str.replace('/\"/g', "'"));
        str = str.replace(/\#/g, '%23');

        return str.replace('/\"/g', "'");
    }
    this.setSrc = function (selector) {
        var elems = this.getElem(selector);
        console.log(elems);
        for (var i = 0, ln = elems.length; i < ln; i++) {
            elems[i].setAttribute('src', this.encodeElem());
        }
    }
    this.getElem = function (selector) {
        var elems = [];
        switch (typeof selector) {
        case 'string':
            console.log('getting elements');
            elems = document.querySelectorAll(selector);
            break;
        case 'object':
            if (selector.nodeType === 1) {
                elems.push(selector);
            } else if (selector.isArray && selector.isArray()) {
                elems = selector;
            }
            break;
        default:
        }
        return elems;
    }
    this.setBg = function (selector) {
        var elems = this.getElem(selector);
        console.log(elems);
        for (var i = 0, ln = elems.length; i < ln; i++) {
            var str = this.encodeElem();
            elems[i].style.backgroundImage = this.encodeElem(true);
        }
    }
    this.handleProperties(options);
}

function _type(v) {
    return ({}).toString.call(v).match(/\[[^\[\]\s]*\s([^\[\]\s]*)\]/)[1].toLowerCase();
}
(function ($) {
    $.fn.acufy = function (options) {
        if (this.length > 1) {
            this.each(function (index, elem) {
                $(elem).acufy(options);
            });
        } else {

            var del = options.del || 10;
            var height = this.outerHeight();
            var width = this.outerWidth();
            var hcount = Math.ceil(height / del);
            var wcount = Math.ceil(width / del);
            var svgns = 'http://www.w3.org/2000/svg';
            var colors = options.colors || ['#1D1A13', '#806C3A', '#4D5B38'];
            var svg = new SVG({
                width: width,
                height: height,
            });
            options = svg.standardizeOptions(options); //make sure we have everything we need for later //need to remove this function from svg will do later
            var rects = fillarrwitharr(new Array(hcount), wcount);
            var indexList = getIndexList(rects);
            shuffle(indexList);
            for (var i = 0, ln = indexList.length; i < ln; i++) {
                console.log(options.seed);
                rects[indexList[i].i][indexList[i].j] = pickColor(rects, colors, indexList[i], options.seed);
            }
            mkrects(rects, del, svgns, svg);
            svg.setBg(this[0]);
        }
    }
})(jQuery);

function mkrects(colors, del, svgns, svg) {
    for (var i = 0, ln = colors.length; i < ln; i++) {
        for (var j = 0, jln = colors[i].length; j < jln; j++) {
            svg.addShape({
                shape: 'rect',
                width: del,
                height: del,
                fill: colors[i][j],
                x: j * del,
                y: i * del,
            });
        }
    }
}

function shuffle(a) {
    var x, j;
    for (var i = 0, ln = a.length; i < ln; i++) {
        j = Math.floor(Math.random() * a.length);
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a
}

function getIndexList(arr) {
    var indices = [];
    for (var i = 0, ln = arr.length; i < ln; i++) {
        for (var j = 0, jln = arr[i].length; j < jln; j++) {
            indices.push({
                i: i,
                j: j
            });
        }
    }
    return indices;
}

function pickColor(arr, colors, indices, seed) {
    console.log(seed);
    var cs = makecountobject(colors);
    var y = indices.i,
        x = indices.j;
    for (var i = 0; i < seed.y; i++) {
        if (y >= i && arr[y - i][x] != null) cs[arr[y - i][x]]++;
        if (y < arr.length - (i + 1) && arr[y + i][x] != null) cs[arr[y + i][x]]++;
        for (var j = 0; j < seed.x; j++) {
            if (x >= j && arr[y][x - j] != null) cs[arr[y][x - j]]++;
            if (y < arr[y].length - (j+1) && arr[y][x+j] != null) cs[arr[y][x+j]]++;

        }
    }
    var color = getGreatestKey(cs);
    if (color == null) {
        color = colors[Math.floor(Math.random() * colors.length)];
    }
    return color;
}

function addslashes(str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function findrandomEmpty(arr) {
    var i = null;
    var j = null;
    while (i == null) {
        i = Math.floor(Math.random() * arr.length);
        //if(!~arr[i].indexOf(null)) i = null;
    }
    while (j == null) {
        j = Math.floor(Math.random() * arr[i].length);
    }
    return {
        i: i,
        j: j
    };
}

function fillarrwitharr(arr, l) {
    for (var i = 0, ln = arr.length; i < ln; i++) {
        arr[i] = new Array(l);
    }
    return arr;
}

function makecountobject(arr) {
    var o = {};
    for (var i = 0, ln = arr.length; i < ln; i++) {
        o[arr[i]] = 0;
    }
    return o;
}

function getGreatestKey(obj) {
    var g = null;
    for (var i in obj) {
        if (obj[i] === 0) continue;
        if (g == null || obj[i] > obj[g]) {
            g = i;
        }
    }
    return g;
}