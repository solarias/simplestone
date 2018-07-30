
//===============================================================
//※ 덱코드 디코더
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
        if (DATA.SET.FORMAT[session.db[session.index[output.cards[i][0]]].set] === "야생") {
            output.format = "야생";
            break;
        }
    }
    //output.format = DATA.FORMAT.DECODE[input.format.toString()];
    //출력
    return output;
}

//===============================================================
//※ 덱코드
//===============================================================
//덱코드 인코드
function deckcode_encode() {
    let output = {};
    //포맷
    output.format = DATA.FORMAT.CODE[process.deck.format];
    //직업
    output.heroes = [DATA.CLASS.DBFID[process.deck.class]];
    //카드
    output.cards = [];
    process.deck.cards.forEach(function(card) {
        let arr = [];
        arr[0] = parseInt(card[0]);
        arr[1] = card[1];
        output.cards.push(arr);
    })

    //출력
    let deckcode = deckstrings.encode(output);
    return deckcode;
}
//덱코드 출력
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
//※ 텍스트
//===============================================================
//텍스트 제작
function deckcode_text() {
    //(확장팩이 아니라면)덱코드 획득
    let deckcode;
    if (!process.deck.newset) deckcode = deckcode_encode();
        else deckcode = false;

    //텍스트 작성
    let outputtext = "";
    //덱 이름
    outputtext += "###" + process.deck.name + "\n";
    //직업
    outputtext += "#직업 : " + DATA.CLASS.KR[process.deck.class] + "\n";
    //포맷
    outputtext += "#대전방식 : " + process.deck.format + "\n";
    //연도
    outputtext += "#" + DATA.YEAR + "\n";
    //가루
    outputtext += "#가루 : " + thousand(process.deck.dust) + "\n";
    outputtext += "#\n";
    //카드
    process.deck.cards.forEach(function(card) {
        let info = session.db[session.index[card[0]]];
        outputtext += "# " + card[1].toString();
        outputtext += "x (" + info.cost.toString() + ") ";
        //이름, 확장팩 (신규 확장팩이면 앞에 "*" 표시)
        if (deckcode || info.set !== DATA.SET.NEW.id) {
            outputtext += info.name;
            outputtext += "    [" + DATA.SET.KR[info.set] + "]" + "\n";
        } else {
            outputtext += "*" + info.name;
            outputtext += "    [" + DATA.SET.NEW.name + "]" + "\n";
        }
    });
    outputtext += "#\n";
    //덱코드 & 설명
    if (deckcode) {
        outputtext += deckcode + "\n";
        outputtext += "#\n";
        outputtext += "# 이 덱을 사용하려면 클립보드에 복사한 후 하스스톤에서 새로운 덱을 만드세요." + "\n";
    } else {
        outputtext += "#'" + DATA.SET.NEW.name + "' 미리 덱 짜보기\n";
    }
    //기타
    outputtext += "#Created at SimpleStone(https://solarias.github.io/simplestone)";

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
            title: '텍스트 출력',
            text: '텍스트이 복사되었습니다!',
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
                $(".swal2-textarea").scrollTo(0,0);
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
//※ HTML 태그
//===============================================================
//HTML 태그 출력
function export_tag() {
    try {
        //HTML 태그 얻기
        let decktag = deckcode_tag();
        //팝업창 열기
        swal({
            title: 'HTML 태그 출력',
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
    if (!process.deck.newset) {
        try {
            deckcode = deckcode_encode();
        } catch(e) {
            deckcode = ""
        }
    } else deckcode = "'" + DATA.SET.NEW.name + "' 미리 덱 짜보기";
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
                _icon.alt = deck.class;
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
                                if (DATA.SET.NEW && info.set === DATA.SET.NEW.id) {
                                    elm_card_name.innerHTML = "*" + info.name;
                                } else {
                                    elm_card_name.innerHTML = info.name;
                                }
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
                            if (!DATA.SET.NEW || info.set !== DATA.SET.NEW.id) {
                                classinfo += "[" + DATA.SET.KR[info.set] + "]";
                            } else {
                                classinfo += "[*" + DATA.SET.NEW.name + "]";
                            }
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
                                if (DATA.SET.NEW && info.set === DATA.SET.NEW.id) {
                                    elm_card_name.innerHTML = "*" + info.name;
                                } else {
                                    elm_card_name.innerHTML = info.name;
                                }
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
                            if (!DATA.SET.NEW || info.set !== DATA.SET.NEW.id) {
                                classinfo += "[" + DATA.SET.KR[info.set] + "]";
                            } else {
                                classinfo += "[*" + DATA.SET.NEW.name + "]";
                            }
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
