
//=================================================================================================================
//※ 함수 - 하위 브라우저 호환
//=================================================================================================================
//Nodelist foreach (대상: IE11)
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

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
//※ 함수 - CANVAS
//=================================================================================================================
//캔버스 HIDPI 적용(context, 규격까지 정의 후 사용하기)
function scaleCanvas(canvas, context, width, height) {
  // assume the device pixel ratio is 1 if the browser doesn't specify it
  const devicePixelRatio = window.devicePixelRatio || 1;

  // determine the 'backing store ratio' of the canvas context
  const backingStoreRatio = (
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1
  );

  // determine the actual ratio we want to draw at
  ratio = 2;
  //const ratio = devicePixelRatio / backingStoreRatio;

  if (ratio !== 1) {
  //if (devicePixelRatio !== backingStoreRatio) {
    // set the 'real' canvas size to the higher width/height
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    // ...then scale it back down with CSS
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }
  else {
    // this is a normal 1:1 device; just scale it simply
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = '';
    canvas.style.height = '';
  }

  // scale the drawing context so everything will work at the higher ratio
  context.scale(ratio, ratio);
}

//캔버스 텍스트 ellipsis 적용
function fittingString(c, str, maxWidth) {
    var width = c.measureText(str).width;
    var ellipsis = '…';
    var ellipsisWidth = c.measureText(ellipsis).width;
    if (width<=maxWidth || width<=ellipsisWidth) {
        return str;
    } else {
        var len = str.length;
        while (width>=maxWidth-ellipsisWidth && len-->0) {
            str = str.substring(0, len);
            width = c.measureText(str).width;
        }
        return str+ellipsis;
    }
}
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
//※ 수, 날짜 관련
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

//날짜 출력
function thisdate() {//현재 날짜 출력
    let time = new Date();
    return (time.getFullYear()).toString() + "-" +
        (time.getMonth() + 1).toString() + "-" +
        (time.getDate()).toString();
}
function thisTime() {//현재 시간 출력
    let time = new Date();
    return (time.getFullYear()).toString() + "." +
        (time.getMonth() + 1).toString() + "." +
        (time.getDate()).toString() + "/" +
        (time.getHours()).toString() + ":" +
        (time.getMinutes()).toString();
}
function remaindate(a, b) {
    let dateA = parseInt(a.replaceAll("-",""));
    let dateB = parseInt(b.replaceAll("-",""));
    return (dateB - dateA);
}

//모바일 체크
function mobilecheck() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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
