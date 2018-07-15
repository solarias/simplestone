
//=================================================================================================================
//※ 함수 - 하위 브라우저 호환
//=================================================================================================================
//indexOf 호환용 (대상 : IE8)
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}
//Nodelist foreach (대상: IE11)
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}


//trim 호환용 (대상 : IE8)
if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

//classList 호환용 (대상 : IE8, IE9)
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */
if("document" in self){if(!("classList" in document.createElement("_"))){(function(j){"use strict";if(!("Element" in j)){return}var a="classList",f="prototype",m=j.Element[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.getAttribute("class")||""),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.setAttribute("class",this.toString())}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(){var s=arguments,r=0,p=s.length,q,o=false;do{q=s[r]+"";if(g(this,q)===-1){this.push(q);o=true}}while(++r<p);if(o){this._updateClassName()}};e.remove=function(){var t=arguments,s=0,p=t.length,r,o=false,q;do{r=t[s]+"";q=g(this,r);while(q!==-1){this.splice(q,1);o=true;q=g(this,r)}}while(++s<p);if(o){this._updateClassName()}};e.toggle=function(p,q){p+="";var o=this.contains(p),r=o?q!==true&&"remove":q!==false&&"add";if(r){this[r](p)}if(q===true||q===false){return q}else{return !o}};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))}else{(function(){var b=document.createElement("_");b.classList.add("c1","c2");if(!b.classList.contains("c2")){var c=function(e){var d=DOMTokenList.prototype[e];DOMTokenList.prototype[e]=function(h){var g,f=arguments.length;for(g=0;g<f;g++){h=arguments[g];d.call(this,h)}}};c("add");c("remove")}b.classList.toggle("c3",false);if(b.classList.contains("c3")){var a=DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(d,e){if(1 in arguments&&!this.contains(d)===!e){return e}else{return a.call(this,d)}}}b=null}())}};

//getComputedStyle 호환용 (대상 : IE8)
!('getComputedStyle' in this) && (this.getComputedStyle=(function (){function getPixelSize(element, style, property, fontSize){varsizeWithSuffix=style[property],size=parseFloat(sizeWithSuffix),suffix=sizeWithSuffix.split(/\d/)[0],rootSize;fontSize=fontSize !=null ? fontSize : /%|em/.test(suffix) && element.parentElement ? getPixelSize(element.parentElement, element.parentElement.currentStyle, 'fontSize', null) : 16;rootSize=property=='fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;return (suffix=='em') ? size * fontSize : (suffix=='in') ? size * 96 : (suffix=='pt') ? size * 96 / 72 : (suffix=='%') ? size / 100 * rootSize : size;}function setShortStyleProperty(style, property){varborderSuffix=property=='border' ? 'Width' : '',t=property + 'Top' + borderSuffix,r=property + 'Right' + borderSuffix,b=property + 'Bottom' + borderSuffix,l=property + 'Left' + borderSuffix;style[property]=(style[t]==style[r]==style[b]==style[l] ? [style[t]]: style[t]==style[b] && style[l]==style[r] ? [style[t], style[r]]: style[l]==style[r] ? [style[t], style[r], style[b]]: [style[t], style[r], style[b], style[l]]).join(' ');}function CSSStyleDeclaration(element){varcurrentStyle=element.currentStyle,style=this,fontSize=getPixelSize(element, currentStyle, 'fontSize', null);for (property in currentStyle){if (/width|height|margin.|padding.|border.+W/.test(property) && style[property] !=='auto'){style[property]=getPixelSize(element, currentStyle, property, fontSize) + 'px';}else if (property==='styleFloat'){style['float']=currentStyle[property];}else{style[property]=currentStyle[property];}}setShortStyleProperty(style, 'margin');setShortStyleProperty(style, 'padding');setShortStyleProperty(style, 'border');style.fontSize=fontSize + 'px';return style;}CSSStyleDeclaration.prototype={constructor: CSSStyleDeclaration,getPropertyPriority: function (){},getPropertyValue: function ( prop ){return this[prop] || '';},item: function (){},removeProperty: function (){},setProperty: function (){},getPropertyCSSValue: function (){}};function getComputedStyle(element){return new CSSStyleDeclaration(element);}return getComputedStyle;})(this));

//addEventLister 호환용 (대상 : IE6~8)
!function(e,t){function n(e){var n=t[e];t[e]=function(e){return o(n(e))}}function a(t,n,a){return(a=this).attachEvent("on"+t,function(t){var t=t||e.event;t.preventDefault=t.preventDefault||function(){t.returnValue=!1},t.stopPropagation=t.stopPropagation||function(){t.cancelBubble=!0},n.call(a,t)})}function o(e,t){if(t=e.length)for(;t--;)e[t].addEventListener=a;else e.addEventListener=a;return e}e.addEventListener||(o([t,e]),"Element"in e?e.Element.prototype.addEventListener=a:(t.attachEvent("onreadystatechange",function(){o(t.all)}),n("getElementsByTagName"),n("getElementById"),n("createElement"),o(t.all)))}(window,document);

//isArray 호환용 (대상 : IE8)
if (!Array.isArray){Array.isArray=function(arg){return Object.prototype.toString.call(arg)==='[object Array]';};}

//repeat 호환용 (대상 : IE 전체)
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (;;) {
      if ((count & 1) == 1) {
        rpt += str;
      }
      count >>>= 1;
      if (count == 0) {
        break;
      }
      str += str;
    }
    // Could we try:
    // return Array(count + 1).join(this);
    return rpt;
  }
}

//=================================================================================================================
//※ 함수 - requst시리즈
//=================================================================================================================


//=================================================================================================================
//※ 함수 - 기존 개체에 기능 추가
//=================================================================================================================
//배열 최대치&최소치 함수
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

//=================================================================================================================
//※ 함수 - 마우스 액션
//=================================================================================================================


//=================================================================================================================
//※ 함수 - DOM 관련
//=================================================================================================================
//DOM 선택자
function $(parameter, startNode) {
    if (!startNode)
        return document.querySelector(parameter);
    else
        return startNode.querySelector(parameter);
}
function $$(parameter, startNode) {
    if (!startNode)
        return document.querySelectorAll(parameter);
    else
        return startNode.querySelectorAll(parameter);
}

//DOM 생성
    //사용법 : createElement(문법)
    //# : id, . : class, [abc=def] : attribute, "abc" : text
    (function(e){"use strict";var t="(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)",n="([\"'])((?:(?=(\\\\?))\\",r="[\\W\\w])*?)\\",i="^(?:"+t+")|^#"+t+"|^\\."+t+"|^\\["+t+"(?:([*$|~^]?=)"+n+"8"+r+"6"+")?\\]|^\\s*[\\n\\r]+([\\t]*)\\s*|^(\\s+)|^"+n+"13"+r+"11";document.createElement=function(t){var n=t.replace(/^\s+|\s+$/),r=document.createDocumentFragment(),s=[r,e.call(this,"div")];for(var o=r,u=o.appendChild(s[1]),a=1,f=true,l;n&&(l=n.match(i));){if(l[1]){o.replaceChild(u=e.call(this,l[1]),o.lastChild);if(f)s[a]=u}if(l[2])u.id=l[2];if(l[3])u.className+=(u.className?" ":"")+l[3];if(l[4])u.setAttribute(l[4],l[7]||"");if(l[9]!==undefined){a=l[9].length;o=s[a];u=s[++a]=o.appendChild(e.call(this,"div"))}if(l[10]){o=u;u=o.appendChild(e.call(this,"div"));f=false}if(l[11]){o.replaceChild(u=document.createTextNode(l[12]),o.lastChild);if(f)s[a]=u}n=n.slice(l[0].length)}return r.childNodes.length===1?r.lastChild:r}})(document.createElement)

//=================================================================================================================
//※ 함수 - 배열, 오브젝트, JSON, 로컬스토리지 등
//=================================================================================================================
//URL에서 JSON 불러오시 (GET 방식)
function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}
/*활용밥
loadJSON('my-file.json',
         function(data) { console.log(data); },
         function(xhr) { console.error(xhr); }
);
*/

//로컬스토리지 object처럼 활용
function localStore(key, obj) {
    return window.localStorage.setItem(key, JSON.stringify(obj));
}
function localGet(key) {
    return JSON.parse(window.localStorage.getItem(key));
}

//배열&오브젝트 복제
function deepCopy (dupeObj) {
    //null : 그냥 반환
    if (dupeObj === null) return dupeObj;
    //undefined : 그냥 반환
    if (dupeObj === undefined) return dupeObj;
    //문자열 : 그냥 반환
    if (typeof(dupeObj) === "string") return dupeObj;
    //숫자 : 그냥 반환
    if (typeof(dupeObj) === "number") return dupeObj;
    //불리언 : 그냥 반환
    if (typeof(dupeObj) === "boolean") return dupeObj;
    //나머지 : object로 취급
    var retObj = new Object();
    if (typeof(dupeObj) === 'object') {
        if (typeof(dupeObj.length) !== 'undefined')
            var retObj = new Array();
        for (var objInd in dupeObj) {
            if (typeof(dupeObj[objInd]) === 'object') {
                retObj[objInd] = deepCopy(dupeObj[objInd]);
            } else if (typeof(dupeObj[objInd]) === 'string') {
                retObj[objInd] = dupeObj[objInd];
            } else if (typeof(dupeObj[objInd]) === 'number') {
                retObj[objInd] = dupeObj[objInd];
            } else if (typeof(dupeObj[objInd]) === 'boolean') {
                ((dupeObj[objInd] === true) ? retObj[objInd] = true : retObj[objInd] = false);
            }
        }
    }
    return retObj;
}

//배열 셔플
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//오브젝트 item 수 파악
function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

//'배열 내 오브젝트'에서 "특정 value를 가진 id"를 가진 배열 불러오기
function indexArrKey(arr, key, value) {
    for (var i=0;i<arr.length;i++) {
        if (arr[i][key] === value) {
            return arr[i];
        }
    }
}
//=================================================================================================================
//※ 수 관련
//=================================================================================================================
//천단위 콤마 표시 (출처 : http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript)
function thousand(num) {
    //null, undefined : "0" 리턴
    if (!num) return "0";

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//가중치 적용 랜덤
function rand(target) {//target : 숫자가 들어있는 배열
    var number = 0;
    for (i=0;i<target.length;i++) {
        number += target[i];
    }
    var tmp = Math.random() * number;

    number = 0;
    for (i=0;i<target.length;i++) {
        number += target[i];
        if (tmp < number) {
            return i;
        }
    }
}

//만단위 한글로 전환 (출처 : http://kin.naver.com/qna/detail.nhn?d1id=1&dirId=1040202&docId=159019083&qb=amF2YXNjcmlwdCDsiKvsnpAgNOuLqOychCDtlZzquIA=&enc=utf8&section=kin&rank=2&search_sort=0&spq=0&pid=R6VWNc5Y7vKssb7f6YZsssssssd-312648&sid=UKssqHJvLDEAAC0QENA)
function setWon(pWon) {
    //null, undefined : "0" 리턴
    if (!pWon) return "0";

    var won  = pWon.toString();
    var arrWon  = ["", "만 ", "억 ", "조 ", "경 ", "해 ", "자 ", "양 ", "구 ", "간 ", "정 "];
    var changeWon = "";
    var pattern = /(-?[0-9]+)([0-9]{4})/;
    while(pattern.test(won)) {
        won = won.replace(pattern,"$1,$2");
    }
    won = won + "";
    var arrCnt = won.split(",").length-1;
    for(var ii=0; ii<won.split(",").length; ii++) {
        changeWon += won.split(",")[ii]+arrWon[arrCnt];
        arrCnt--;
    }
    return changeWon;
}

//만단위 한글로 전환 (0000은 표시하지 않기)
function setWon2(pWon) {
    //null, undefined : "0" 리턴
    if (!pWon) return "0";

    var won  = pWon.toString();
    var arrWon  = ["", "만 ", "억 ", "조 ", "경 ", "해 ", "자 ", "양 ", "구 ", "간 ", "정 "];
    var changeWon = "";
    var pattern = /(-?[0-9]+)([0-9]{4})/;
    while(pattern.test(won)) {
        won = won.replace(pattern,"$1,$2");
    }
    won = won + "";
    var arrCnt = won.split(",").length-1;
    for(var ii=0; ii<won.split(",").length; ii++) {
        if (won.split(",")[ii] != "0000") changeWon += won.split(",")[ii]+arrWon[arrCnt];
        arrCnt--;
    }
    return changeWon;
}

//숫자인지 판단 (출처 : http://mwultong.blogspot.com/2007/01/isnum-isnumeric-isnumber-javascript.html)
function isNumber(s) {
    s += ''; // 문자열로 변환
    s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
    if (s === '' || isNaN(s)) return false;
    return true;
}


//=================================================================================================================
//※ 문자열 관련
//=================================================================================================================
//replaceAll prototype 선언
String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}


//=================================================================================================================
//※ input 계열
//=================================================================================================================
//value로 select문 검색
function indexSelectByValue(selectbox, value)	{
    for (var i = selectbox.options.length-1;i>=0;i--) {
        if (selectbox.options[i].value === value) {
            return i;
        }
    }
}

//특정 select 비우기
function clearSelect(selectbox)	{
    for (var i = selectbox.options.length-1;i>=0;i--) {
        selectbox.remove(i);
    }
}


//====================================================================================
//※ 기타 기능
//====================================================================================
//풀스크린
    //켜기
    function launchIntoFullscreen(element, callback) {
        //엘레멘트가 없으면 디폴트값 메꿔주기
        if (!element) element = document.documentElement;
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else {
            alert("현재 브라우저는 전체화면 모드를 지원하지 않습니다.");
            return;
        }
        if (callback) {
            callback;
        }
    }
    //끄기
    function exitFullscreen(callback) {
      if(document.exitFullscreen) {
        document.exitFullscreen();
      } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else {
          alert("현재 브라우저는 전체화면 모드를 지원하지 않습니다.");
          return;
      }
      if (callback) {
          callback;
      }
    }
    //※ 사용법
        //활성화 : launchIntoFullscreen(document.documentElement);
        //비활성화 : exitFullscreen();
    //풀스크린 토글
    function toggleFullScreen() {
      if (!document.fullscreenElement &&    // alternative standard method
          !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    }
