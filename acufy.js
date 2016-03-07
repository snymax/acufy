(function($){
    $.fn.acufy = function(options){
        options = options || {};
        if(this.length > 1){
            this.each(function(index, elem){
                $(elem).acufy(options);
            });
        }else{
            var del = options.del || 10;
            var height = this.outerHeight();
            var width = this.outerWidth();
            var hcount = Math.ceil(height/del);
            var wcount = Math.ceil(width/del);
            var svgns = 'http://www.w3.org/2000/svg';
            var colors = options.colors || ['#1D1A13', '#806C3A', '#4D5B38'];
            var svg = document.createElementNS(svgns, 'svg');
            svg.setAttribute('width', width + 'px');
            svg.setAttribute('height', height + 'px');
            var rects = fillarrwitharr(new Array(hcount), wcount);
            var indexList = getIndexList(rects);
            shuffle(indexList);
            for(var i = 0, ln = indexList.length; i< ln;i++){
                rects[indexList[i].i][indexList[i].j] = pickColor(rects, colors, indexList[i]);
            }
            mkrects(rects, del, svgns, svg);
            var xmls = new XMLSerializer();
            svg = "url('data:image/svg+xml;utf8," + xmls.serializeToString(svg) + "')";
            this.css('background-image', svg);
        }
    }
})(jQuery);
function mkrects(colors, del, svgns, svg){
    for(var i = 0, ln = colors.length; i < ln; i++){
        for(var j = 0, jln = colors[i].length; j < jln;j++){
            var r = document.createElementNS(svgns, 'rect');
            r.setAttribute('width', del);
            r.setAttribute('height', del);
            r.setAttribute('fill', colors[i][j]);
            r.setAttribute('x', j * del);
            r.setAttribute('y', i * del);
            svg.appendChild(r);
        }
    }
}
function shuffle(a){
    var x, j;
    for(var i = 0, ln = a.length; i < ln; i++){
        j = Math.floor(Math.random() * a.length);
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a
}
function getIndexList(arr){
    var indices = [];
    for(var i = 0, ln = arr.length; i< ln;i++){
        for(var j = 0, jln = arr[i].length; j < jln;j++){
            indices.push({i:i, j:j});
        }
    }
    return indices;
}
function pickColor(arr, colors, indices){
    var cs = makecountobject(colors);
    var i = indices.i,
        j = indices.j;
    if(i > 0){
        if(arr[i-1][j] != null)
            cs[arr[i-1][j]]++;
    }
    if(j > 0){
        if(arr[i][j-1] != null)
            cs[arr[i][j-1]]++;
    }
    var color = getGreatestKey(cs);
    if(color == null){
        color = colors[Math.floor(Math.random()*colors.length)];
    }
    return color;
}
function addslashes( str ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}
function findrandomEmpty(arr){
    var i = null;
    var j = null;
    while(i == null){
        i = Math.floor(Math.random()*arr.length);
        //if(!~arr[i].indexOf(null)) i = null;
    }
    while(j == null){
        j = Math.floor(Math.random()*arr[i].length);
    }
    return {i:i, j:j};
}
function fillarrwitharr(arr, l){
    for(var i = 0, ln = arr.length; i< ln; i++){
        arr[i] = new Array(l);
    }
    return arr;
}
function makecountobject(arr){
    var o = {};
    for(var i = 0, ln = arr.length; i< ln; i++){
        o[arr[i]] = 0;
    }
    return o;
}
function getGreatestKey(obj){
    var g = null;
    for(var i in obj){
        if(obj[i] === 0) continue;
        if(g == null || obj[i] > obj[g]){
            g = i;
        }
    }
    return g;
}
