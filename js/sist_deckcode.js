
//===============================================================
//※ 덱코드 디코더, 인코드 / 덱 URL 생성
//===============================================================
//디코드
function deckcode_decode(deckcode) {
    //(검증된) 덱코드 해석
    let input = deckstrings.decode(deckcode);
    let output = {};
    //카드
    output.cards = [];
    input.cards.forEach(function(card) {
        let arr = [];
        arr[0] = card[0].toString();
        arr[1] = card[1];
        output.cards.push(arr);
    })
    output.cards.sort(function(a, b) {
        return (parseInt(session.index[a[0]]) < parseInt(session.index[b[0]])) ? -1 : 1;
    });
    //직업
    for (let i = 0;i < session.db.length;i++) {
        if (session.db[i].dbfid === input.heroes[0].toString()) {
            output.class = session.db[i].cardClass;
            break;
        }
    }
    //포맷(향후 덱 포맷 검증 별도로 함)
    output.format = "정규";
    for (let i = 0;i < output.cards.length;i++) {
        if (DATA.SET[session.db[session.index[output.cards[i][0]]].set].FORMAT === "야생") {
            output.format = "야생";
            break;
        }
    }
    //output.format = DATA.FORMAT.DECODE[input.format.toString()];
    //출력
    return output;
}
//인코드
function deckcode_encode(deckObj) {
    let output = {};
    let obj = {}
    if (!deckObj) obj = process.deck
        else obj = deckObj;
    //포맷
    output.format = DATA.FORMAT.CODE[obj.format];
    //직업
    output.heroes = [DATA.CLASS.DBFID[obj.class]];
    //카드
    output.cards = [];
    obj.cards.forEach(function(card) {
        let arr = [];
        arr[0] = parseInt(card[0]);
        arr[1] = card[1];
        output.cards.push(arr);
    })

    //출력
    let deckcode = deckstrings.encode(output);
    return deckcode;
}
//URL 생성
function deckcode_toURL() {
    let deckcode = encodeURIComponent(deckcode_encode());
    let deckurl = "https://solarias.github.io/simplestone?deckcode=" + deckcode;
    return deckurl;
}
//===============================================================
//※ 덱코드 출력
//===============================================================
function export_deckcode() {
    try {
        let deckcode = deckcode_encode();
        //팝업창 열기
        swal({
            title: '덱코드 출력',
            text: '덱코드가 복사되었습니다!',
            input: 'text',
            inputValue: deckcode,
            allowOutsideClick:false,
            showConfirmButton:false,
            showCancelButton:true,
            cancelButtonText: '닫기',
            cancelButtonColor: '#d33',
            showCloseButton:true,
            onOpen: function() {
                $(".swal2-input").select();
                document.execCommand("copy");
            }
        })
    } catch(e) {
        //오류창 열기
        nativeToast({
            message: '오류 발생 - 덱코드를 출력할 수 없습니다.',
            position: 'center',
            timeout: 2000,
            type: 'error',
            closeOnClick: 'true'
        });
    }
}

//===============================================================
//※ 텍스트 출력
//===============================================================
//텍스트 제작
function deckcode_text() {
    //(확장팩이 아니라면)덱코드 획득
    let deckcode = deckcode_encode();
    let deckurl = deckcode_toURL();

    //텍스트 작성
    let outputtext = "";
    //덱 이름
    outputtext += "### " + process.deck.name + "\n";
    //직업
    outputtext += "# 직업 : " + DATA.CLASS.KR[process.deck.class] + "\n";
    //포맷
    outputtext += "# 대전방식 : " + process.deck.format + "\n";
    //연도
    outputtext += "# " + DATA.YEAR + "\n";
    //가루
    outputtext += "# 가루 : " + thousand(process.deck.dust) + "\n";
    outputtext += "#\n";
    //카드
    process.deck.cards.forEach(function(card) {
        let info = session.db[session.index[card[0]]];
        outputtext += "# " + card[1].toString();
        outputtext += "x (" + info.cost.toString() + ") ";
        outputtext += info.name + "\n";
    });
    outputtext += "#\n";
    //덱코드 & 설명
    if (deckcode) {
        outputtext += deckcode + "\n";
        outputtext += "#\n";
        outputtext += "# 이 덱을 사용하려면 클립보드에 복사한 후 하스스톤에서 새로운 덱을 만드세요." + "\n";
    }
    //기타 문구
    outputtext += "# Created at Simplestone(https://solarias.github.io/simplestone)";

    //출력
    return outputtext;
}
//텍스트 출력
function export_text() {
    try {
        //텍스트 얻기
        let decktext = deckcode_text();
        //팝업창 열기
        swal({
            title: '텍스트 공유',
            text: '텍스트가 복사되었습니다!',
            input: 'textarea',
            inputValue: decktext,
            allowOutsideClick:false,
            showConfirmButton:false,
            showCancelButton:true,
            cancelButtonText: '닫기',
            cancelButtonColor: '#d33',
            showCloseButton:true,
            onOpen: function() {
                $(".swal2-textarea").style.fontSize = "12px";
                $(".swal2-textarea").style.height = ($(".swal2-textarea").offsetHeight * 2).toString() + "px";
                $(".swal2-textarea").scrollTop = 0;
                $(".swal2-textarea").select();
                document.execCommand("copy");
            }
        })
    } catch(e) {
        //오류창 열기
        nativeToast({
            message: '오류 발생 - 텍스트를 출력할 수 없습니다.',
            position: 'center',
            timeout: 2000,
            type: 'error',
            closeOnClick: 'true'
        });
    }
}

//===============================================================
//※ HTML 태그 출력
//===============================================================
function export_tag() {
    try {
        //HTML 태그 얻기
        let decktag = deckcode_tag();
        //팝업창 열기
        swal({
            title: 'HTML 태그 공유',
            text: 'HTML 태그가 복사되었습니다!',
            input: 'textarea',
            inputValue: decktag,
            allowOutsideClick:false,
            showConfirmButton:false,
            showCancelButton:true,
            cancelButtonText: '닫기',
            cancelButtonColor: '#d33',
            showCloseButton:true,
            onOpen: function() {
                $(".swal2-textarea").style.fontSize = "12px";
                $(".swal2-textarea").style.height = ($(".swal2-textarea").offsetHeight * 2).toString() + "px";
                $(".swal2-textarea").select();
                document.execCommand("copy");
            }
        })
    } catch(e) {
        //오류창 열기
        nativeToast({
            message: '오류 발생 - 텍스트를 출력할 수 없습니다.',
            position: 'center',
            timeout: 2000,
            type: 'error',
            closeOnClick: 'true'
        });
    }
}
//HTML 태그 제작
function deckcode_tag() {
    //정보 준비
    let deck = process.deck;
    let deckcode;
    try {
        deckcode = deckcode_encode();
    } catch(e) {
        deckcode = ""
    }
    //직업별 카드 구분
    let outputCards = {
        class:[],
        neutral:[]
    };
    process.deck.cards.forEach(function(card) {
        if (session.db[session.index[card[0]]].cardClass !== "NEUTRAL") {
            outputCards.class.push(card);
        } else {
            outputCards.neutral.push(card);
        }
    })

    //출력물 제작
    let _wrapper= document.createElement("div");
        //상단 공백
        let p = document.createElement("p");
            p.innerHTML = "<br>";
        _wrapper.appendChild(p);
        let _header = document.createElement("div.simplestone_header");
            _header.setAttribute("style",
                "PADDING:0.5em;"+
                "WIDTH:100%;"+
                "HEIGHT:5em;"+
                "BACKGROUND:#542;"+
                "BORDER:0.5em #FD0 outset;"+
                "BOX-SIZING:border-box;"+
                "FONT-FAMILY:Gothic;"+
                "FONT-WEIGHT:bold;"
            )
        _wrapper.appendChild(_header);
            let _icon = document.createElement("img.simplestone_icon");
                _icon.src = ICONDATA[deck.class];
                _icon.alt = DATA.CLASS.KR[deck.class];
                _icon.setAttribute("style",
                    "FLOAT:left;"+
                    "DISPLAY:block;"+
                    "WIDTH:3em;"+
                    "HEIGHT:3em;"
                )
            _header.appendChild(_icon);
            let _headercenter = document.createElement("div.simplestone_headercenter");
                _headercenter.setAttribute("style",
                    "FLOAT:left;"+
                    "MARGIN-LEFT:0.5em;"+
                    "WIDTH:calc(100% - 8.5em);"+
                    "HEIGHT:3em;"
                )
            _header.appendChild(_headercenter);
                let _deckname = document.createElement("div.simplestone_deckname");
                    _deckname.innerHTML = deck.name;
                    _deckname.setAttribute("style",
                        "FLOAT:left;"+
                        "WIDTH:100%;"+
                        "HEIGHT:1em;"+
                        "COLOR:white;"+
                        "FONT-SIZE:1.8em;"+
                        "FONT-WEIGHT:bold;"+
                        "LINE-HEIGHT:100%;"+
                        "TEXT-SHADOW:0 -1px black,1px -1px black,1px 0 black,1px 1px black,0 1px black,-1px 1px black,-1px 0 black,-1px -1px black;"+
                        "OVERFLOW:hidden;"+
                        "WHITE-SPACE:nowrap;"+
                        "TEXT-OVERFLOW:ellipsis;"
                    )
                _headercenter.appendChild(_deckname);
                let _dusticon = document.createElement("img.simplestone_dusticon");
                    _dusticon.src = ICONDATA.DUST;
                    _dusticon.alt = "가루";
                    _dusticon.setAttribute("style",
                        "CLEAR:both;FLOAT:left;"+
                        "MARGIN-TOP:0.2em;"+
                        "WIDTH:1em;"+
                        "HEIGHT:1em;"
                    )
                _headercenter.appendChild(_dusticon);
                let _dust = document.createElement("div.simplestone_dust");
                    _dust.innerHTML = thousand(deck.dust);
                    _dust.setAttribute("style",
                        "FLOAT:left;"+
                        "MARGIN:0.2em 0 0 0.2em;"+
                        "HEIGHT:1em;"+
                        "COLOR:skyblue;"+
                        "TEXT-SHADOW:0 -1px black,1px -1px black,1px 0 black,1px 1px black,0 1px black,-1px 1px black,-1px 0 black,-1px -1px black;"+
                        "LINE-HEIGHT:1em;"
                    )
                _headercenter.appendChild(_dust);
            let _headerlight = document.createElement("div.simplestone_headerlight");
                _headerlight.setAttribute("style",
                    "FLOAT:right;"+
                    "WIDTH:5em;"+
                    "HEIGHT:3em;"
                )
            _header.appendChild(_headerlight);
                let _classname = document.createElement("div.simplestone_classname");
                    _classname.innerHTML = DATA.CLASS.KR[deck.class];
                    _classname.setAttribute("style",
                        "FLOAT:right;"+
                        "HEIGHT:1em;"+
                        "COLOR:white;"+
                        "LINE-HEIGHT:1em;"
                    )
                _headerlight.appendChild(_classname);
                let _format = document.createElement("div.simplestone_format");
                    _format.innerHTML = deck.format;
                    let formatcolor = "";
                    if (deck.format === "정규") formatcolor = "lime";
                        else formatcolor = "orange";
                    _format.setAttribute("style",
                        "CLEAR:both;FLOAT:right;"+
                        "MARGIN-TOP:0.5em;"+
                        "HEIGHT:1em;"+
                        "FONT-SIZE:1.5em;"+
                        "COLOR:" + formatcolor + ";"+
                        "TEXT-SHADOW:0 -1px black,1px -1px black,1px 0 black,1px 1px black,0 1px black,-1px 1px black,-1px 0 black,-1px -1px black;"+
                        "LINE-HEIGHT:1em;"
                    )
                _headerlight.appendChild(_format);
        let _main = document.createElement("div.simplestone_main");
            _main.setAttribute("style",
                "COLUMNS:2 260px;"+
                "COLUMN-GAP:0.2em;"+
                "PADDING-BOTTOM:1em;"+
                "WIDTH:100%;"+
                "HEIGHT:auto;"+
                "BACKGROUND:#FFF0A5;"+
                "BOX-SIZING:border-box;"+
                "FONT-FAMILY:Gothic;"+
                "FONT-WEIGHT:bold;"
            )
            let _classcard = document.createElement("div.simplestone_classcard");
                _classcard.setAttribute("style",
                    "HEIGHT:auto;"+
                    "PAGE-BREAK-INSIDE: avoid;"+
                    "BREAK-INSIDE: avoid;"
                )
            _main.appendChild(_classcard);
                //헤더
                let _classheader = document.createElement("div.simplestone_classheader");
                    let classCount = 0;
                    outputCards.class.forEach(function(card) {
                        classCount += card[1];
                    })
                    _classheader.innerHTML = DATA.CLASS.KR[deck.class] + " 카드 (" + classCount.toString() + "장)";
                    _classheader.setAttribute("style",
                        "MARGIN-BOTTOM:0.2em;"+
                        "WIDTH:100%;"+
                        "PADDING:0 0.5em;"+
                        "HEIGHT:2em;"+
                        "BACKGROUND:#222;"+
                        "BOX-SIZING:border-box;"+
                        "FONT-SIZE:1em;"+
                        "COLOR:white;"+
                        "LINE-HEIGHT:2em;"
                    )
                _classcard.appendChild(_classheader);
                //직업카드 목록
                outputCards.class.forEach(function(card) {
                    let info = session.db[session.index[card[0]]];
                    let elm_card = document.createElement("details.card");
                        elm_card.setAttribute("style",
                            "DISPLAY:block;"+
                            "MARGIN-BOTTOM:0.2em;"+
                            "WIDTH:100%;"+
                            "HEIGHT:auto;"+
                            "BACKGROUND:#444;"+
                            "COLOR:transparent;"
                        )
                    _classcard.appendChild(elm_card);
                        let elm_cardsummary = document.createElement("summary.cardinfo");
                            elm_cardsummary.title = "카드를 클릭하면 세부정보를 볼 수 있습니다.";
                            elm_cardsummary.setAttribute("style",
                                "DISPLAY:block;"+
                                "WIDTH:100%;"+
                                "HEIGHT:2em;"+
                                "CURSOR:help;"
                            )
                        elm_card.appendChild(elm_cardsummary);
                            let elm_card_cost = document.createElement("div.card_cost");
                                elm_card_cost.innerHTML = info.cost;
                                elm_card_cost.setAttribute("style",
                                    "FLOAT:left;"+
                                    "WIDTH:2em;"+
                                    "HEIGHT:2em;"+
                                    "BACKGROUND:blue;"+
                                    "COLOR:white;"+
                                    "LINE-HEIGHT:2em;"+
                                    "TEXT-ALIGN:center;"
                                )
                            elm_cardsummary.appendChild(elm_card_cost);
                            let elm_card_name = document.createElement("div.card_name");
                                let raritycolor = DATA.RARITY.COLOR[info.rarity];
                                elm_card_name.innerHTML = info.name;
                                elm_card_name.setAttribute("style",
                                    "FLOAT:left;"+
                                    "PADDING-LEFT:0.5em;"+
                                    "WIDTH:auto;"+
                                    "MAX-WIDTH:calc(100% - 4.5em);"+
                                    "BOX-SIZING:border-box;"+
                                    "HEIGHT:2em;"+
                                    "COLOR:" + raritycolor + ";"+
                                    "LINE-HEIGHT:2em;"+
                                    "OVERFLOW:hidden;"+
                                    "WHITE-SPACE:nowrap;"+
                                    "TEXT-OVERFLOW:ellipsis;"
                                )
                            elm_cardsummary.appendChild(elm_card_name);
                            let elm_card_quantity = document.createElement("div.card_quantity");
                                elm_card_quantity.innerHTML = "× " + card[1].toString();
                                elm_card_quantity.setAttribute("style",
                                    "FLOAT:left;"+
                                    "WIDTH:2.5em;"+
                                    "HEIGHT:2em;"+
                                    "COLOR:yellow;"+
                                    "LINE-HEIGHT:2em;"+
                                    "TEXT-ALIGN:center;"
                                )
                            elm_cardsummary.appendChild(elm_card_quantity);
                        let elm_cardinfo = document.createElement("div.cardinfo");
                            //title 생성
                            let classinfo = "";
                            classinfo += "(" + DATA.TYPE.KR[info.type] + ")";
                            switch (info.type) {
                                case "MINION":
                                    classinfo += " " + info.attack.toString() + "/" + info.health.toString();
                                    if (info.race) classinfo += ", " + DATA.RACE.KR[info.race];
                                    break;
                                case "WEAPON":
                                    classinfo += " " + info.attack.toString() + "/" + info.durability.toString();
                                    break;
                                case "HERO":
                                    classinfo += " 방어도 " + info.armor.toString();
                                    break;
                            }
                            classinfo += "<br>";
                            if (info.text && info.text.length > 0) classinfo += titletext(info.text) + "<br>";
                            classinfo += "[" + DATA.SET[info.set].KR + "]";
                            elm_cardinfo.innerHTML = classinfo;
                            elm_cardinfo.setAttribute("style",
                                "PADDING:0.2em;"+
                                "WIDTH:100%;"+
                                "BACKGROUND:#DC9;"+
                                "BORDER:2px #542 outset;"+
                                "BORDER-TOP:0;"+
                                "BOX-SIZING:border-box;"+
                                "COLOR:black;"+
                                "FONT-WEIGHT:normal;"+
                                "FONT-SIZE:0.8em;"+
                                "LINE-HEIGHT:160%;"+
                                "WORD-BREAK:keep-all;"
                            )
                        elm_card.appendChild(elm_cardinfo);
                })
            let _neutralcard = document.createElement("div.simplestone_neutralcard");
                _neutralcard.setAttribute("style",
                    "HEIGHT:auto;"+
                    "-WEBKIT-COLUMN-BREAK-INSIDE: avoid;"+
                    "PAGE-BREAK-INSIDE: avoid;"+
                    "BREAK-INSIDE: avoid;"
                )
            _main.appendChild(_neutralcard);
                //헤더
                let _neutralheader = document.createElement("div.simplestone_neutralheader");
                let neutralCount = 0;
                    outputCards.neutral.forEach(function(card) {
                        neutralCount += card[1];
                    })
                    _neutralheader.innerHTML = "중립 카드 (" + neutralCount.toString() + "장)";
                    _neutralheader.setAttribute("style",
                        "MARGIN-BOTTOM:0.2em;"+
                        "WIDTH:100%;"+
                        "PADDING:0 0.5em;"+
                        "HEIGHT:2em;"+
                        "BACKGROUND:#222;"+
                        "BOX-SIZING:border-box;"+
                        "FONT-SIZE:1em;"+
                        "COLOR:white;"+
                        "LINE-HEIGHT:2em;"
                    )
                _neutralcard.appendChild(_neutralheader);
                //중립카드 목록
                outputCards.neutral.forEach(function(card) {
                    let info = session.db[session.index[card[0]]];
                    let elm_card = document.createElement("details.card");
                        elm_card.setAttribute("style",
                            "DISPLAY:block;"+
                            "MARGIN-BOTTOM:0.2em;"+
                            "WIDTH:100%;"+
                            "HEIGHT:auto;"+
                            "BACKGROUND:#444;"+
                            "COLOR:transparent;"
                        )
                    _neutralcard.appendChild(elm_card);
                        let elm_cardsummary = document.createElement("summary.cardinfo");
                            elm_cardsummary.title = "카드를 클릭하면 세부정보를 볼 수 있습니다.";
                            elm_cardsummary.setAttribute("style",
                                "DISPLAY:block;"+
                                "WIDTH:100%;"+
                                "HEIGHT:2em;"+
                                "CURSOR:help;"
                            )
                        elm_card.appendChild(elm_cardsummary);
                            let elm_card_cost = document.createElement("div.card_cost");
                                elm_card_cost.innerHTML = info.cost;
                                elm_card_cost.setAttribute("style",
                                    "FLOAT:left;"+
                                    "WIDTH:2em;"+
                                    "HEIGHT:2em;"+
                                    "BACKGROUND:blue;"+
                                    "COLOR:white;"+
                                    "LINE-HEIGHT:2em;"+
                                    "TEXT-ALIGN:center;"
                                )
                            elm_cardsummary.appendChild(elm_card_cost);
                            let elm_card_name = document.createElement("div.card_name");
                                let raritycolor = DATA.RARITY.COLOR[info.rarity];
                                elm_card_name.innerHTML = info.name;
                                elm_card_name.setAttribute("style",
                                    "FLOAT:left;"+
                                    "PADDING-LEFT:0.5em;"+
                                    "WIDTH:auto;"+
                                    "MAX-WIDTH:calc(100% - 4.5em);"+
                                    "BOX-SIZING:border-box;"+
                                    "HEIGHT:2em;"+
                                    "COLOR:" + raritycolor + ";"+
                                    "LINE-HEIGHT:2em;"+
                                    "OVERFLOW:hidden;"+
                                    "WHITE-SPACE:nowrap;"+
                                    "TEXT-OVERFLOW:ellipsis;"
                                )
                            elm_cardsummary.appendChild(elm_card_name);
                            let elm_card_quantity = document.createElement("div.card_quantity");
                                elm_card_quantity.innerHTML = "× " + card[1].toString();
                                elm_card_quantity.setAttribute("style",
                                    "FLOAT:left;"+
                                    "WIDTH:2.5em;"+
                                    "HEIGHT:2em;"+
                                    "COLOR:yellow;"+
                                    "LINE-HEIGHT:2em;"+
                                    "TEXT-ALIGN:center;"
                                )
                            elm_cardsummary.appendChild(elm_card_quantity);
                        let elm_cardinfo = document.createElement("div.cardinfo");
                            //title 생성
                            let classinfo = "";
                            classinfo += "(" + DATA.TYPE.KR[info.type] + ")";
                            switch (info.type) {
                                case "MINION":
                                    classinfo += " " + info.attack.toString() + "/" + info.health.toString();
                                    if (info.race) classinfo += ", " + DATA.RACE.KR[info.race];
                                    break;
                                case "WEAPON":
                                    classinfo += " " + info.attack.toString() + "/" + info.durability.toString();
                                    break;
                                case "HERO":
                                    classinfo += " 방어도 " + info.armor.toString();
                                    break;
                            }
                            classinfo += "<br>";
                            if (info.text && info.text.length > 0) classinfo += titletext(info.text) + "<br>";
                            classinfo += "[" + DATA.SET[info.set].KR + "]";
                            elm_cardinfo.innerHTML = classinfo;
                            elm_cardinfo.setAttribute("style",
                                "PADDING:0.2em;"+
                                "WIDTH:100%;"+
                                "BACKGROUND:#DC9;"+
                                "BORDER:2px #542 outset;"+
                                "BORDER-TOP:0;"+
                                "BOX-SIZING:border-box;"+
                                "COLOR:black;"+
                                "LINE-HEIGHT:160%;"+
                                "FONT-WEIGHT:normal;"+
                                "FONT-SIZE:0.8em;"+
                                "WORD-BREAK:keep-all;"
                            )
                        elm_card.appendChild(elm_cardinfo);
                })
        _wrapper.appendChild(_main);
        let _titleguide = document.createElement("div.simplestone_titleguide");
            _titleguide.innerHTML = "카드를 클릭하면 세부정보를 볼 수 있습니다.";
            _titleguide.setAttribute("style",
                "PADDING:0.2em 0.5em;"+
                "WIDTH:100%;"+
                "HEIGHT:auto;"+
                "BACKGROUND:#754;"+
                "BOX-SIZING:border-box;"+
                "FONT-SIZE:0.8em;"+
                "LINE-HEIGHT:1em;"+
                "COLOR:white;"+
                "FONT-FAMILY:Gothic;"+
                "WORD-BREAK:break-all;"
            )
        _wrapper.appendChild(_titleguide);
        let _deckcode = document.createElement("div.simplestone_deckcode");
            _deckcode.innerHTML = deckcode;
            _deckcode.setAttribute("style",
                "PADDING:0.2em 0.5em;"+
                "WIDTH:100%;"+
                "HEIGHT:auto;"+
                "BACKGROUND:#392C4A;"+
                "BOX-SIZING:border-box;"+
                "COLOR:white;"+
                "FONT-FAMILY:Gothic;"+
                "WORD-BREAK:break-all;"
            )
        _wrapper.appendChild(_deckcode);
        let _domain = document.createElement("div.simplestone_domain");
            _domain.innerHTML = "Created at SimpleStone(https://solarias.github.io/simplestone)";
            _domain.setAttribute("style",
                "PADDING:0.2em 0.5em;"+
                "WIDTH:100%;"+
                "HEIGHT:auto;"+
                "BACKGROUND:#754;"+
                "BOX-SIZING:border-box;"+
                "COLOR:white;"+
                "FONT-FAMILY:Gothic;"+
                "FONT-SIZE:0.8em;"+
                "LINE-HEIGHT:1em;"+
                "FONT-STYLE:italic;"+
                "TEXT-ALIGN:right;"+
                "WORD-BREAK:break-all;"
            )
        _wrapper.appendChild(_domain);
        //하단 공백
        let p2 = document.createElement("p");
            p2.innerHTML = "<br>";
        _wrapper.appendChild(p2);

    return _wrapper.innerHTML;
}

//덱 이미지 출력
async function export_image() {
  try {
    //이미지 제작 중 - 대기 이미지
    $("#frame_deckimage").classList.add("show");
    $("#deckimage_top").scrollTop = 0;

    $("#deckimage_img").src = "./images/loading_white.svg";
    $("#button_download").classList.add("wait");

    //이미지 제작 완료 - 출력
    let deckimage = await deckcode_image();//텍스트 출력
    $("#deckimage_img").src = deckimage;

    $("#button_download").classList.remove("wait");
    $("#button_download").href = deckimage;
    $("#button_download").download = process.deck.name + ".jpg";

    $("#button_closeimage").onclick = function() {
        $("#frame_deckimage").classList.remove("show");
    }
  } catch (e) {
      //오류창 열기
      nativeToast({
          message: '오류 발생 - 이미지를 출력할 수 없습니다.',
          position: 'center',
          timeout: 2000,
          type: 'error',
          closeOnClick: 'true'
      });
  }
}

//===============================================================
//※ 이미지 출력
//===============================================================
function deckcode_image() {
    return new Promise((resolve1) => {
        //카드 이미지 미리 불러놓기
        let imageArr = [], imageLoaded = [], count = 0;
        (() => {
            return new Promise((resolve2) => {
                imageArr.push(HEROURL + DATA.CLASS.ID[process.deck.class] + ".jpg");//헤더 이미지
                imageArr.push("./images/icon_dust.png");//가루
                if (session.offline === false) {
                    process.deck.cards.forEach(function(card) {
                        imageArr.push(TILEURL + session.db[session.index[card[0]]].id + ".jpg");//덱에 있는 카드 이미지
                    })
                }
                imageArr.forEach((url, i) => {
                    imageLoaded[i] = new Image();
                    imageLoaded[i].onload = () => {
                        count += 1;
                        if (count === imageArr.length) {
                            resolve2();
                        }
                    }
                    imageLoaded[i].src = imageArr[i];
                })
            })
        //다 불렀으면
        })().then(() => {
            //캔버스 준비
            let deckcanvas = document.createElement("canvas#deckcanvas");
            let ctx = deckcanvas.getContext("2d");

            //캔버스 부위별 규격 계산
            let imagesize = {
              wrapper:{
                width:300
              },
              header:{
                border:2,
                padding:5,
                width:300,
                height:50,
                gradient_start:90,
                gradient_end:240,
                dust:16,
                format:16,
                deckname:22
              },
              date:{
                padding:5,
                height:26,
                font:16
              },
              card:{
                width:300,
                height:40,
                border:1,
                gap:5,
                gradient_start:180,
                gradient_end:280,
                cost:{
                  padding:2,
                  width:40,
                  font:30,
                  font_position:20
                },
                name:{
                  padding:8,
                  position:5,
                  maxwidth:230,
                  font:20,
                },
                quantity:{
                  width:20,
                  padding:10,
                  font:16
                }
              },
              footer:{
                padding:5,
                width:300,
                height:22,
                font:16
              }
            }

            //캔버스 크기 계산
            deckcanvas.width = imagesize.wrapper.width.toString();
            deckcanvas.height = (imagesize.header.height
              + imagesize.date.height
              + (imagesize.card.gap * (process.deck.cards.length + 1))
              + (imagesize.card.height * process.deck.cards.length)
              + imagesize.footer.height).toString();
            imagesize.wrapper.height = deckcanvas.height;
            scaleCanvas(deckcanvas, ctx, deckcanvas.width, deckcanvas.height);

            //캔버스 그리기
            //배경색
            ctx.fillStyle = "#392C4A";
            ctx.fillRect(0, 0, deckcanvas.width, deckcanvas.height);

            //헤더
              //헤더 이미지
              let heroimg = new Image();
              heroimg.src = HEROURL + DATA.CLASS.ID[process.deck.class] + ".jpg";
              heroimg.height = imagesize.header.height;
              heroimg.width = imagesize.header.height * heroimg.naturalWidth / heroimg.naturalHeight;
              ctx.drawImage(heroimg, imagesize.wrapper.width - heroimg.width, 0, heroimg.width, heroimg.height);

              //헤더 그라디언트
              let grd = ctx.createLinearGradient(imagesize.header.gradient_start, 0, imagesize.header.gradient_end, 0);
              grd.addColorStop(0, "rgb(50,50,50)");
              grd.addColorStop(1, "transparent");
              ctx.fillStyle = grd;
              ctx.fillRect(imagesize.header.gradient_start, 0,imagesize.header.gradient_end, imagesize.header.height);
              ctx.fillStyle = "rgb(50,50,50)";
              ctx.fillRect(0, 0, imagesize.header.gradient_start, imagesize.header.height);

              //테두리
              ctx.strokeStyle = "gold";
              ctx.lineWidth = imagesize.header.border;
              ctx.strokeRect(imagesize.header.border/2, imagesize.header.border/2, imagesize.wrapper.width - imagesize.header.border, imagesize.header.height - imagesize.header.border);

              //가루
              let dust = new Image(imagesize.header.dust,imagesize.header.dust);
              dust.src = "./images/icon_dust.png";
              ctx.drawImage(dust, imagesize.header.padding, imagesize.header.padding, imagesize.header.dust, imagesize.header.dust);

              ctx.fillStyle = 'skyblue';
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 0.5;
              ctx.font = 'bold ' + imagesize.header.dust + 'px SpoqaHanSans';
              ctx.fillText(thousand(process.deck.dust), imagesize.header.padding + imagesize.header.dust + 5, imagesize.header.padding + imagesize.header.dust - 3);

              //덱 이름
              ctx.fillStyle = 'white';
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 0.5;
              ctx.font = 'bold ' + imagesize.header.deckname + 'px SpoqaHanSans';
              ctx.textAlign = "left";
              ctx.save();
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
              ctx.shadowColor = "black";
              ctx.shadowBlur = 10;
              ctx.fillText(fittingString(ctx, process.deck.name, imagesize.wrapper.width - imagesize.header.padding*2), imagesize.header.padding, imagesize.header.padding + imagesize.header.dust + imagesize.header.deckname);
              ctx.restore();

            //날짜
              //배경
              ctx.fillStyle = "#222222";
              ctx.fillRect(0, imagesize.header.height, imagesize.wrapper.width, imagesize.date.height);

              //연도
              ctx.fillStyle = 'white';
              ctx.font = imagesize.date.font + 'px SpoqaHanSans';
              ctx.textAlign = "left";
              ctx.fillText(DATA.YEAR, imagesize.date.padding, imagesize.header.height + imagesize.date.padding + imagesize.date.font);
              ctx.fill();

              //포맷
              if (process.deck.format === "정규") {
                ctx.fillStyle = 'lime';
              } else {
                ctx.fillStyle = 'orange';
              }

              ctx.font = 'bold ' + imagesize.header.format + 'px SpoqaHanSans';
              ctx.textAlign = "right";
              ctx.fillText(process.deck.format + "전", imagesize.wrapper.width - imagesize.date.padding, imagesize.header.height + imagesize.date.padding + imagesize.date.font);

              ctx.fill();

            //카드
            process.deck.cards.forEach(function(card, i) {
              //카드정보
              let info = session.db[session.index[card[0]]];
              //Y축 시작점
              let ystart = imagesize.header.height
               + imagesize.date.height
               + imagesize.card.gap * (i+1)
               + imagesize.card.height * i
              //이미지 변수
              let cardimg = new Image();

              //이미지
              if (session.offline === false) {
                  cardimg.src = TILEURL + info.id + ".jpg";
              } else {
                  cardimg.src = "";
              }
              cardimg.height = imagesize.card.height;
              cardimg.width = imagesize.card.height * heroimg.naturalWidth / heroimg.naturalHeight;
              ctx.drawImage(cardimg, imagesize.wrapper.width - cardimg.width, ystart, cardimg.width, cardimg.height);

              //그라디언트
              grd = ctx.createLinearGradient(imagesize.card.gradient_start, 0, imagesize.card.gradient_end, 0);
              grd.addColorStop(0, "rgb(100,100,100)");
              grd.addColorStop(1, "transparent");
              ctx.fillStyle = grd;
              ctx.fillRect(imagesize.card.gradient_start - 5, ystart, imagesize.card.gradient_end, imagesize.card.height);
              ctx.fillStyle = "rgb(100,100,100)";
              ctx.fillRect(0, ystart, imagesize.card.gradient_start, imagesize.card.height);

              //비용
              ctx.fillStyle = DATA.RARITY.COLOR[info.rarity];
              ctx.fillRect(0, ystart, imagesize.card.cost.width, imagesize.card.height);

              ctx.fillStyle = 'white';
              ctx.strokeStyle = "black";
              ctx.lineWidth = 1;
              ctx.texAlign = 'left';

              ctx.font = 'bold ' + imagesize.card.cost.font + 'px SpoqaHanSans';
              ctx.textAlign = "center";
              ctx.fillText(info.cost, imagesize.card.cost.font_position, ystart + imagesize.card.cost.padding + imagesize.card.cost.font);
              ctx.strokeText(info.cost, imagesize.card.cost.font_position, ystart + imagesize.card.cost.padding + imagesize.card.cost.font);

              ctx.fill();
              ctx.stroke();

              //이름
              ctx.fillStyle = 'white';
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 1;
              ctx.font = "800 " + imagesize.card.name.font + "px SpoqaHanSans";
              ctx.textAlign = "left";
              ctx.save();
              ctx.shadowOffsetX = 3;
              ctx.shadowOffsetY = 3;
              ctx.shadowColor = "black";
              ctx.shadowBlur = 4;
              ctx.fillText(fittingString(ctx, info.name, imagesize.card.name.maxwidth), imagesize.card.cost.width + imagesize.card.name.position, ystart + imagesize.card.name.padding + imagesize.card.name.font);
              ctx.restore();

              //수량
              if (card[1] > 1 || info.rarity === "LEGENDARY") {
                ctx.fillStyle = "black";
                ctx.fillRect(imagesize.wrapper.width - imagesize.card.quantity.width, ystart, imagesize.card.quantity.width, imagesize.card.height);

                ctx.fillStyle = 'gold';
                ctx.font = 'bold ' + imagesize.card.quantity.font + 'px SpoqaHanSans';
                ctx.textAlign = "center";
                let quantitytext = (info.rarity === "LEGENDARY") ? "★" : card[1].toString();
                ctx.fillText(quantitytext, imagesize.wrapper.width - imagesize.card.quantity.width / 2, ystart + imagesize.card.quantity.padding + imagesize.card.quantity.font);

                ctx.fill();
              }

              //테두리
              ctx.strokeStyle = "black";
              ctx.lineWidth = imagesize.card.border;
              ctx.strokeRect(0, ystart, imagesize.wrapper.width, imagesize.card.height);

            })

            //푸터
              //배경
              ctx.fillStyle = "#222222";
              ctx.fillRect(0, imagesize.wrapper.height - imagesize.footer.height, imagesize.wrapper.width, imagesize.footer.height);

              //"심플스톤"
              ctx.fillStyle = 'white';
              ctx.font = imagesize.footer.font + 'px SpoqaHanSans';
              ctx.textAlign = "right";
              ctx.fillText("Created at Simplestone", imagesize.wrapper.width - imagesize.footer.padding, imagesize.wrapper.height - imagesize.footer.padding);
              ctx.fill();

          //덱 이미지 출력
          let result = deckcanvas.toDataURL("image/jpeg");
          resolve1(result);
        })
    })
}

//===============================================================
//※ URL 출력
//===============================================================
function export_url() {
    try {
        let deckurl = deckcode_toURL();
        //팝업창 열기
        swal({
            title: '덱 URL 공유',
            text: 'URL이 복사되었습니다!',
            input: 'text',
            inputValue: deckurl,
            allowOutsideClick:false,
            showConfirmButton:false,
            showCancelButton:true,
            cancelButtonText: '닫기',
            cancelButtonColor: '#d33',
            showCloseButton:true,
            onOpen: function() {
                $(".swal2-input").select();
                document.execCommand("copy");
            }
        })
    } catch(e) {
        //오류창 열기
        nativeToast({
            message: '오류 발생 - URL을 출력할 수 없습니다.',
            position: 'center',
            timeout: 2000,
            type: 'error',
            closeOnClick: 'true'
        });
    }
}
