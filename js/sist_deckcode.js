
//===============================================================
//※ 덱코드 디코더, 인코드 / 덱 URL 생성
//===============================================================
//디코드
function deckcode_decode(deckcode) {
    return new Promise((res, rej) => {
        //(검증된) 덱코드 해석
        let input = deckstrings.decode(deckcode)
        let output = {}
        //카드
        output.cards = []
        input.cards.forEach(card => {
            let arr = []
            arr[0] = card[0]
            arr[1] = card[1]
            output.cards.push(arr)
        })
        output.cards.sort((a, b) => {
            let aIndex = session.dbIndex[a[0].toString()]
            let bIndex = session.dbIndex[b[0].toString()]
            return (aIndex < bIndex) ? -1 : 1
        })
        //포맷(향후 덱 포맷 검증 별도로 함)
        output.format = "정규"
        for (let i = 0;i < output.cards.length;i++) {
            if (session.db[session.dbIndex[output.cards[i][0].toString()]].cardSet.format === "야생") {
                output.format = "야생"
                break
            }
        }
        //직업
        output.class = ""
        for (let key in session.classInfo) {
            if (session.classInfo.hasOwnProperty(key)) {
                if (session.classInfo[key].cardId === input.heroes[0]) {
                    output.class = session.classInfo[key].slug
                    break
                }
            }
        }
        if (output.class !== "") {
            res(output)
        } else {
            //카드 DB에 영웅 정보 있으면 해당 직업으로 설정
            if (session.db[session.dbIndex[input.heroes[0].toString()]] !== undefined &&
                session.db[session.dbIndex[input.heroes[0].toString()]].class !== undefined) {
                output.class = session.db[session.dbIndex[input.heroes[0].toString()]].class.slug
                res(output)
            //카드 DB에 영웅 정보 없으면 - 보유 카드로 직업 추적
            } else {
                for (let i = 0;i < output.cards.length;i++) {
                    if (session.db[session.dbIndex[output.cards[i][0].toString()]].class.slug !== "NEUTRAL" &&
                        (session.db[session.dbIndex[output.cards[i][0].toString()]].multiClass === undefined ||
                            (session.db[session.dbIndex[output.cards[i][0].toString()]].multiClass !== undefined &&
                            session.db[session.dbIndex[output.cards[i][0].toString()]].multiClass <= 0)
                        )) {
                        output.class = session.db[session.dbIndex[output.cards[i][0].toString()]].class.slug
                        res(output)
                        break
                    }
                }
                //그것조차 못 찾겠으면(중립덱) - '중립 영웅 취급' -> 오류 방지
                if (output.class === "") {
                    //직업을 분석하여 버튼 추가 준비
                    let htmlText = '$classBtns'
                    let btnText = ""
                    let classArr = []
                    Object.keys(session.classInfo).forEach(key => {
                        let c = session.classInfo[key]
                        if (c.slug !== "ALL" && c.slug !== "NEUTRAL") classArr.push({slug:c.slug, name:c.name})
                    })
                    classArr.sort((a,b) => {
                        let order = [a.name,b.name]
                        order.sort()
                        if (a.name === order[0]) {
                            return -1
                        } else {
                            return 1
                        }
                    })
                    classArr.forEach((c, i) => {
                        let btn = document.createElement("button")
                            btn.id = "popup_class_" + c.slug
                            btn.classList.add("popup_button","halfsection")
                            btn.dataset.class = c.slug
                            btn.innerHTML = c.name
                            if (i === classArr.length - 1 && classArr.length % 2 === 1) {
                                btn.classList.remove("halfsection")
                                btn.classList.add("full")
                            }
                        btnText += btn.outerHTML
                    })
                    htmlText = htmlText.replace("$classBtns",btnText)
                    //팝업창 열기
                    function swalClass() {
                        return new Promise((resolve, reject) => {
                            swal({
                                title: '덱 직업 확인 불가!<br>직업을 직접 선택하세요',
                                html:htmlText,
                                onOpen:function() {
                                    //버튼 상호작용
                                    $$(".popup_button").forEach(x => {
                                        x.onclick = function() {
                                            //직업 선정
                                            output.class = x.dataset.class
                                            //창 닫기
                                            swal.close()
                                            resolve()
                                        }
                                    })
                                },
                                showConfirmButton:false,
                                showCancelButton:true,
                                cancelButtonText: '취소',
                                cancelButtonColor: '#d33'
                            })
                        })
                    }
                    swalClass().then(() => {
                        res(output)
                    }).catch(() => {
                        rej()
                    })
                }
            }
        }
    })
}
//인코드
function deckcode_encode(deckObj) {
    let output = {}
    let obj = {}
    if (!deckObj) obj = process.deck
        else obj = deckObj
    //포맷
    output.format = DATA.FORMAT.CODE[obj.format]
    //직업
    output.heroes = []
    output.heroes.push(session.classInfo[obj.class].cardId)
    //카드
    output.cards = []
    obj.cards.forEach(card => {
        let arr = []
        arr[0] = parseInt(card[0])
        arr[1] = card[1]
        output.cards.push(arr)
    })

    //출력
    console.log(typeof output)
    console.log(output)
    let deckcode = deckstrings.encode(output)
    return deckcode
}
//URL 생성
function deckcode_toURL() {
    let deckcode = encodeURIComponent(deckcode_encode())
    let deckurl = "https://solarias.github.io/simplestone?deckcode=" + deckcode
    return deckurl
}

//===============================================================
//※ 정규 검증
//===============================================================
function isStandard(deckinput) {
    let result = true;
    for (let i = 0;i < deckinput.length;i++) {
        if (session.db[session.dbIndex[deckinput[i][0].toString()]].cardSet.format === "야생") {
            result = false;
            break
        }
    }
    return result;
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
        console.log(e)
        nativeToast({
            message: '오류 발생 - 덱코드를 출력할 수 없습니다.<br>(' + e + ')',
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
    outputtext += "# 직업 : " + session.classInfo[process.deck.class].name + "\n";
    //포맷
    outputtext += "# 대전방식 : " + process.deck.format + "\n";
    //연도
    outputtext += "# " + session.metadata.year + "\n";
    //가루
    outputtext += "# 가루 : " + thousand(process.deck.dust) + "\n";
    outputtext += "#\n";
    //카드
    process.deck.cards.forEach(function(card) {
        let info = session.db[session.dbIndex[card[0].toString()]];
        outputtext += "# " + card[1].toString()
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
    outputtext += "# Created at 심플스톤(https://solarias.github.io/simplestone)";

    //출력
    return outputtext;
}
//텍스트 출력
function export_text() {
    try {
        //텍스트 얻기
        let decktext = deckcode_text();
        //팝업창 열기
        if (navigator.share) {
            swal({
                title: '텍스트 출력',
                text: '텍스트가 복사되었습니다!',
                input: 'textarea',
                inputValue: decktext,
                allowOutsideClick:false,
                showConfirmButton:true,
                showCancelButton:true,
                confirmButtonText: '&#x1f517; 공유',
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
            }).then(async (isConfirm) => {
                navigator.share({
                    title: '심플스톤 덱 공유',
                    text: decktext
                }).then(() => {
                    nativeToast({
                        message: '텍스트 공유 완료!',
                        position: 'center',
                        timeout: 2000,
                        type: 'success',
                        closeOnClick: 'true'
                    })
                }).catch((e) => {
                    nativeToast({
                        message: '텍스트 공유 취소!.<br>(' + e + ')',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    })
                })
            })
        } else {
            swal({
                title: '텍스트 출력',
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
        }
    } catch(e) {
        //오류창 열기
        nativeToast({
            message: '오류 발생 - 텍스트를 출력할 수 없습니다.<br>(' + e + ')',
            position: 'center',
            timeout: 2000,
            type: 'error',
            closeOnClick: 'true'
        })
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
            message: '오류 발생 - 텍스트를 출력할 수 없습니다.<br>(' + e + ')',
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
        if (session.db[session.dbIndex[card[0].toString()]].class.slug !== "NEUTRAL") {
            outputCards.class.push(card);
        } else {
            outputCards.neutral.push(card);
        }
    })

    //출력물 제작
    let _wrapper= document.createElement("div")
        //상단 공백
        let p = document.createElement("p")
            p.innerHTML = "<br>"
        _wrapper.appendChild(p);
        let _header = document.createElement("div.simplestone_header")
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
        _wrapper.appendChild(_header)
            let _icon = document.createElement("img.simplestone_icon")
                _icon.src = ICONDATA[deck.class]
                _icon.alt = session.classInfo[deck.class].name
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
                let _dusticon = document.createElement("img.simplestone_dusticon")
                    _dusticon.src = ICONDATA.DUST
                    _dusticon.alt = "가루"
                    _dusticon.setAttribute("style",
                        "CLEAR:both;FLOAT:left;"+
                        "MARGIN-TOP:0.2em;"+
                        "WIDTH:1em;"+
                        "HEIGHT:1em;"
                    )
                _headercenter.appendChild(_dusticon);
                let _dust = document.createElement("div.simplestone_dust")
                    _dust.innerHTML = thousand(deck.dust)
                    _dust.setAttribute("style",
                        "FLOAT:left;"+
                        "MARGIN:0.2em 0 0 0.2em;"+
                        "HEIGHT:1em;"+
                        "COLOR:skyblue;"+
                        "TEXT-SHADOW:0 -1px black,1px -1px black,1px 0 black,1px 1px black,0 1px black,-1px 1px black,-1px 0 black,-1px -1px black;"+
                        "LINE-HEIGHT:1em;"
                    )
                _headercenter.appendChild(_dust)
            let _headerlight = document.createElement("div.simplestone_headerlight")
                _headerlight.setAttribute("style",
                    "FLOAT:right;"+
                    "WIDTH:5em;"+
                    "HEIGHT:3em;"
                )
            _header.appendChild(_headerlight);
                let _classname = document.createElement("div.simplestone_classname")
                    _classname.innerHTML = session.classInfo[deck.class].name
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
                    _classheader.innerHTML = session.classInfo[deck.class].name + " 카드 (" + classCount.toString() + "장)";
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
                _classcard.appendChild(_classheader)
                //직업카드 목록
                outputCards.class.forEach(function(card) {
                    let info = session.db[session.dbIndex[card[0].toString()]]
                    let elm_card = document.createElement("details.card")
                        elm_card.setAttribute("style",
                            "DISPLAY:block;"+
                            "MARGIN-BOTTOM:0.2em;"+
                            "WIDTH:100%;"+
                            "HEIGHT:auto;"+
                            "BACKGROUND:#444;"+
                            "COLOR:transparent;"
                        )
                    _classcard.appendChild(elm_card)
                        let elm_cardsummary = document.createElement("summary.cardinfo")
                            elm_cardsummary.title = "카드를 클릭하면 세부정보를 볼 수 있습니다."
                            elm_cardsummary.setAttribute("style",
                                "DISPLAY:block;"+
                                "WIDTH:100%;"+
                                "HEIGHT:2em;"+
                                "CURSOR:help;"
                            )
                        elm_card.appendChild(elm_cardsummary)
                            let elm_card_cost = document.createElement("div.card_cost")
                                elm_card_cost.innerHTML = info.cost
                                elm_card_cost.setAttribute("style",
                                    "FLOAT:left;"+
                                    "WIDTH:2em;"+
                                    "HEIGHT:2em;"+
                                    "BACKGROUND:blue;"+
                                    "COLOR:white;"+
                                    "LINE-HEIGHT:2em;"+
                                    "TEXT-ALIGN:center;"
                                )
                            elm_cardsummary.appendChild(elm_card_cost)
                            let elm_card_name = document.createElement("div.card_name")
                                let raritycolor = DATA.RARITY.COLOR[info.rarity.slug]
                                elm_card_name.innerHTML = info.name
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
                            elm_cardsummary.appendChild(elm_card_name)
                            let elm_card_quantity = document.createElement("div.card_quantity")
                                elm_card_quantity.innerHTML = "× " + card[1].toString()
                                elm_card_quantity.setAttribute("style",
                                    "FLOAT:left;"+
                                    "WIDTH:2.5em;"+
                                    "HEIGHT:2em;"+
                                    "COLOR:yellow;"+
                                    "LINE-HEIGHT:2em;"+
                                    "TEXT-ALIGN:center;"
                                )
                            elm_cardsummary.appendChild(elm_card_quantity)
                        let elm_cardinfo = document.createElement("div.cardinfo")
                            //title 생성
                            let classinfo = ""
                            classinfo += "(" + info.cardType.name + ")";
                            switch (info.cardType.slug) {
                                case "MINION":
                                    classinfo += " " + info.attack.toString() + "/" + info.health.toString()
                                    if (info.minionType !== undefined) classinfo += ", " + info.minionType.name
                                    break
                                case "WEAPON":
                                    classinfo += " " + info.attack.toString() + "/" + info.durability.toString()
                                    break
                                case "HERO":
                                    classinfo += " 방어도 " + info.armor.toString()
                                    break
                            }
                            classinfo += "<br>"
                            if (info.text && info.text.length > 0) classinfo += titletext(info.text) + "<br>"
                            classinfo += "[" + info.cardSet.name + "]"
                            elm_cardinfo.innerHTML = classinfo
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
                    let info = session.db[session.dbIndex[card[0].toString()]];
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
                                let raritycolor = DATA.RARITY.COLOR[info.rarity.slug];
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
                            elm_cardsummary.appendChild(elm_card_name)
                            let elm_card_quantity = document.createElement("div.card_quantity")
                                elm_card_quantity.innerHTML = "× " + card[1].toString()
                                elm_card_quantity.setAttribute("style",
                                    "FLOAT:left;"+
                                    "WIDTH:2.5em;"+
                                    "HEIGHT:2em;"+
                                    "COLOR:yellow;"+
                                    "LINE-HEIGHT:2em;"+
                                    "TEXT-ALIGN:center;"
                                )
                            elm_cardsummary.appendChild(elm_card_quantity)
                        let elm_cardinfo = document.createElement("div.cardinfo")
                            //title 생성
                            let classinfo = ""
                            classinfo += "(" + info.cardType.name + ")"
                            switch (info.cardType.slug) {
                                case "MINION":
                                    classinfo += " " + info.attack.toString() + "/" + info.health.toString()
                                    if (info.minionType !== undefined) classinfo += ", " + info.minionType.name
                                    break
                                case "WEAPON":
                                    classinfo += " " + info.attack.toString() + "/" + info.durability.toString()
                                    break
                                case "HERO":
                                    classinfo += " 방어도 " + info.armor.toString()
                                    break
                            }
                            classinfo += "<br>"
                            if (info.text && info.text.length > 0) classinfo += titletext(info.text) + "<br>"
                            classinfo += "[" + info.cardSet.name + "]"
                            elm_cardinfo.innerHTML = classinfo
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
            _domain.innerHTML = "Created at 심플스톤(https://solarias.github.io/simplestone)";
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
            p2.innerHTML = "<br>"
        _wrapper.appendChild(p2);

    return _wrapper.innerHTML;
}

//덱 이미지 출력
async function export_image() {
    //공유 버튼 초기화
    $("#button_shareimage").classList.remove("show")
    $("#button_download").classList.remove("short")

    $("#button_closeimage").onclick = function() {
        $("#frame_deckimage").classList.remove("show");
    }
    try {
        //이미지 제작 중 - 대기 이미지
        $("#frame_deckimage").classList.add("show");
        $("#deckimage_top").scrollTop = 0;

        $("#deckimage_img").src = "./images/loading_white.svg";
        $("#button_download").classList.add("wait");

        //이미지 제작 완료 - 출력
        let deckimage = await deckcode_image()//텍스트 출력
        if (deckimage !== false) {
            $("#deckimage_img").src = deckimage

            $("#button_download").classList.remove("wait")
            $("#button_download").href = deckimage
            $("#button_download").download = process.deck.name + ".png"
            //덱 이미지 공유
            if (navigator.canShare) {
                let imageRes = await fetch(deckimage)
                let imageBuf = await imageRes.arrayBuffer()
                let imageFile = new File([imageBuf], process.deck.name + ".png", {type:"image/png"});
                let imageFiles = [imageFile]
                if (navigator.canShare({ files: imageFiles })) {
                    $("#button_shareimage").classList.add("show")
                    $("#button_download").classList.add("short")
                    let deckcode = ""
                    //공유용 덱코드 생성 시도
                    try {
                        deckcode = deckcode_encode()
                    } catch(e) {
                        deckcode = ""
                    }
                    //덱 이미지 공유 버튼 클릭
                    $("#button_shareimage").onclick = async () => {
                        navigator.share({
                            title: '심플스톤 덱 이미지 : ' + process.deck.name,
                            files: imageFiles,
                            text: deckcode,
                        }).then(() => {
                            nativeToast({
                                message: '덱 이미지 공유 완료!',
                                position: 'center',
                                timeout: 2000,
                                type: 'success',
                                closeOnClick: 'true'
                            })
                        }).catch((e) => {
                            //오류창 열기
                            nativeToast({
                                message: '덱 이미지 공유 취소!<br>(' + e + ')',
                                position: 'center',
                                timeout: 2000,
                                type: 'error',
                                closeOnClick: 'true'
                            });
                        })
                    }
                }
            } else {
                $("#button_shareimage").classList.remove("show")
                $("#button_download").classList.remove("short")
            }
        }
    } catch (e) {
        //오류창 열기
        nativeToast({
            message: '오류 발생 - 이미지를 출력할 수 없습니다.<br>(' + e + ')',
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
                imageArr.push(HEROURL + session.classInfo[process.deck.class].slug + ".jpg")//헤더 이미지
                imageArr.push("./images/icon_dust.png")//가루
                //if (session.offline === false) {
                    process.deck.cards.forEach(function(card) {
                        imageArr.push(TILEURL + session.db[session.dbIndex[card[0].toString()]].id + ".jpg")//덱에 있는 카드 이미지
                    })
                //}
                imageArr.forEach((url, i) => {
                    imageLoaded[i] = new Image()
                    imageLoaded[i].onload = () => {
                        count += 1
                        if (count === imageArr.length) {
                            resolve2()
                        }
                    }
                    imageLoaded[i].onerror = () => {//실패해도 진행
                        count += 1
                        if (count === imageArr.length) {
                            resolve2()
                        }
                    }
                    imageLoaded[i].src = imageArr[i]
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
                width:280
              },
              header:{
                border:1,
                padding:5,
                width:300,
                height:50,
                gradient_start:90,
                gradient_end:240,
                dust:16,
                format:18,
                deckname:22
              },
              date:{
                padding:4,
                height:27,
                font:16
              },
              card:{
                width:300,
                height:30,
                padding:5,
                border:1,
                gap:3,
                gradient_start:180,
                gradient_end:280,
                cost:{
                  padding:-1,
                  width:36,
                  font:26,
                  font_position:18
                },
                name:{
                  padding:4,
                  position:6,
                  maxwidth:230,
                  font:18,
                },
                quantity:{
                  width:20,
                  padding:5,
                  font:16
                }
              },
              footer:{
                border:1,
                padding:5,
                width:300,
                height:22,
                font:16
              }
            }

            //캔버스 크기 계산
            deckcanvas.width = imagesize.wrapper.width.toString()
            deckcanvas.height = (imagesize.header.height
              + imagesize.date.height
              + (imagesize.card.gap * (process.deck.cards.length + 1))
              + (imagesize.card.height * process.deck.cards.length)
              + imagesize.footer.height).toString()
            imagesize.wrapper.height = deckcanvas.height;
            scaleCanvas(deckcanvas, ctx, deckcanvas.width, deckcanvas.height);

            //캔버스 그리기
            //배경색 - 그리지 않음(투명 처리)
            /*
            ctx.fillStyle = "yellow";
            ctx.fillRect(0, 0, deckcanvas.width, deckcanvas.height);
            */

        //헤더
            //헤더 이미지
            let heroimg = new Image()
            heroimg.src = HEROURL + session.classInfo[process.deck.class].slug + ".jpg"
            heroimg.height = imagesize.header.height
            heroimg.width = imagesize.header.height * heroimg.naturalWidth / heroimg.naturalHeight
            ctx.drawImage(heroimg, imagesize.wrapper.width - heroimg.width, 0, heroimg.width, heroimg.height)

            //헤더 그라디언트
            let grd = ctx.createLinearGradient(imagesize.header.gradient_start, 0, imagesize.header.gradient_end, 0)
            grd.addColorStop(0, "rgb(34,34,34)")
            grd.addColorStop(1, "transparent")
            ctx.fillStyle = grd
            ctx.fillRect(imagesize.header.gradient_start, 0,imagesize.header.gradient_end, imagesize.header.height)
            ctx.fillStyle = "rgb(34,34,34)"
            ctx.fillRect(0, 0, imagesize.header.gradient_start, imagesize.header.height)

            //테두리
            ctx.strokeStyle = "black"
            ctx.lineWidth = imagesize.header.border
            ctx.strokeRect(imagesize.header.border/2, imagesize.header.border/2, imagesize.wrapper.width - imagesize.header.border, imagesize.header.height - imagesize.header.border)

            //가루 아이콘
            let dust = new Image(imagesize.header.dust,imagesize.header.dust)
            dust.src = "./images/icon_dust.png"
            ctx.drawImage(dust, imagesize.header.padding, imagesize.header.padding, imagesize.header.dust, imagesize.header.dust)
            //가루
            ctx.fillStyle = 'skyblue'
            ctx.lineWidth = 0.5
            ctx.font = imagesize.header.dust + 'px SpoqaHanSans'
            ctx.fillText(thousand(process.deck.dust), imagesize.header.padding + imagesize.header.dust + 4, imagesize.header.padding + imagesize.header.dust - 2)

            //덱 이름
            ctx.fillStyle = 'white';
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
            ctx.fillText(session.metadata.year, imagesize.date.padding, imagesize.header.height + imagesize.date.padding + imagesize.date.font);
            ctx.fill();

            //포맷
            if (process.deck.format === "정규") {
                ctx.fillStyle = 'lime';
            } else {
                ctx.fillStyle = 'orange';
            }

            ctx.font = imagesize.header.format + 'px SpoqaHanSans';
            ctx.textAlign = "right";
            ctx.fillText(process.deck.format + "전", imagesize.wrapper.width - imagesize.date.padding, imagesize.header.height + imagesize.date.padding + imagesize.date.font);
            ctx.fill();

          //하단 테두리
            ctx.strokeStyle = "black";
            ctx.lineWidth = imagesize.header.border;
            ctx.beginPath();
            ctx.moveTo(0, imagesize.header.height + imagesize.date.height);
            ctx.lineTo(imagesize.header.width, imagesize.header.height + imagesize.date.height);
            ctx.stroke();

            //카드
            process.deck.cards.forEach(function(card, i) {
                //카드정보
                let info = session.db[session.dbIndex[card[0].toString()]]
                //Y축 시작점
                let ystart = imagesize.header.height
                 + imagesize.date.height
                 + imagesize.card.gap * (i+1)
                 + imagesize.card.height * i
                //이미지 변수
                let cardimg = new Image()

                //이미지
                /*
                if (session.offline === false) {
                    cardimg.src = TILEURL + info.id + ".jpg"
                } else {
                    cardimg.src = ""
                }
                */
                cardimg.src = TILEURL + info.id + ".jpg"
                //cardimg.height = imagesize.card.height;
                //cardimg.width = imagesize.card.height * heroimg.naturalWidth / heroimg.naturalHeight;
                let imageWidth = cardimg.width * imagesize.card.height / cardimg.height
                let imagePadding = cardimg.height * imagesize.card.padding / imagesize.card.height
                ctx.drawImage(cardimg,
                    0,imagePadding,
                    cardimg.width,cardimg.height-(imagePadding*2),
                    imagesize.wrapper.width - imageWidth, ystart,
                    imageWidth, imagesize.card.height);

                //그라디언트
                grd = ctx.createLinearGradient(imagesize.card.gradient_start, 0, imagesize.card.gradient_end, 0);
                let nameLen = info.name.replaceAll(" ","").replaceAll(".","").length;
                grd.addColorStop(0, "rgb(34,34,34)");
                grd.addColorStop(1, "rgba(34,34,34,0)");
                /*if (nameLen < 10) {
                    grd.addColorStop(0, "rgb(34,34,34)");
                    grd.addColorStop(1, "rgba(34,34,34,0)");
                } else {
                    grd.addColorStop(0, "rgb(34,34,34)");
                    grd.addColorStop(0.7, "rgba(34,34,34,0.8)");
                    grd.addColorStop(1, "rgba(34,34,34,0)");
                }*/
                ctx.fillStyle = grd;
                ctx.fillRect(imagesize.card.gradient_start - 5, ystart, imagesize.card.gradient_end, imagesize.card.height);
                ctx.fillStyle = "rgb(34,34,34)";
                ctx.fillRect(0, ystart, imagesize.card.gradient_start, imagesize.card.height);

                //비용
                ctx.fillStyle = "#256BB0";
                ctx.fillRect(0, ystart, imagesize.card.cost.width, imagesize.card.height);

                ctx.fillStyle = 'white';
                ctx.lineWidth = 1;
                ctx.texAlign = 'left';

                ctx.font = 'bold ' + imagesize.card.cost.font + 'px SpoqaHanSans';
                ctx.textAlign = "center";
                ctx.fillText(info.cost.toString(), imagesize.card.cost.font_position, ystart + imagesize.card.cost.padding + imagesize.card.cost.font);

                //이름
                ctx.fillStyle = DATA.RARITY.COLOR_DECKIMAGE[info.rarity.slug];
                ctx.lineWidth = 1;
                ctx.font = imagesize.card.name.font + "px SpoqaHanSans";
                ctx.textAlign = "left";
                ctx.fillText(fittingString(ctx, info.name, imagesize.card.name.maxwidth), imagesize.card.cost.width + imagesize.card.name.position, ystart + imagesize.card.name.padding + imagesize.card.name.font);

                //수량
                if (card[1] > 1 || info.rarity.slug === "LEGENDARY") {
                    ctx.fillStyle = "black";
                    ctx.fillRect(imagesize.wrapper.width - imagesize.card.quantity.width, ystart, imagesize.card.quantity.width, imagesize.card.height);

                    ctx.fillStyle = 'gold';
                    ctx.font = 'bold ' + imagesize.card.quantity.font + 'px SpoqaHanSans';
                    ctx.textAlign = "center";
                    let quantitytext = (info.rarity.slug === "LEGENDARY") ? "★" : card[1].toString()
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

            //상단단 테두리
            ctx.strokeStyle = "black";
            ctx.lineWidth = imagesize.footer.border;
            ctx.beginPath();
            ctx.moveTo(0, imagesize.wrapper.height - imagesize.footer.height);
            ctx.lineTo(imagesize.header.width, imagesize.wrapper.height - imagesize.footer.height);
            ctx.stroke();

            //"심플스톤"
            ctx.fillStyle = 'white';
            ctx.font = imagesize.footer.font + 'px SpoqaHanSans';
            ctx.textAlign = "right";
            ctx.fillText("Created at 심플스톤", imagesize.wrapper.width - imagesize.footer.padding, imagesize.wrapper.height - imagesize.footer.padding);
            ctx.fill();

            //덱 이미지 출력
            try {
                let result = deckcanvas.toDataURL("image/png");
                resolve1(result)
            } catch(e) {
                nativeToast({
                    message: '오류 발생 - 덱 이미지를 생성할 수 없습니다.<br>(' + e + ')',
                    position: 'center',
                    timeout: 3000,
                    type: 'error',
                    closeOnClick: 'true'
                })
                resolve1(false)
            }
        })
    })
}

//===============================================================
//※ URL 출력
//===============================================================
function export_url() {
    try {
        let deckurl = deckcode_toURL();
        //팝업창 열기 (공유기능 지원 시 공유 버튼 열기)
        if (navigator.share) {
            swal({
                title: '덱 URL 출력',
                text: 'URL이 복사되었습니다!',
                input: 'text',
                inputValue: deckurl,
                allowOutsideClick:false,
                showConfirmButton:true,
                showCancelButton:true,
                confirmButtonText: '&#x1f517; 공유',
                cancelButtonText: '닫기',
                cancelButtonColor: '#d33',
                showCloseButton:true,
                onOpen: function() {
                    $(".swal2-input").select();
                    document.execCommand("copy");
                }
            }).then(async (isConfirm) => {
                navigator.share({
                    title: '심플스톤 덱 공유',
                    url: deckurl
                }).then(() => {
                    nativeToast({
                        message: '덱 URL 공유 완료!',
                        position: 'center',
                        timeout: 2000,
                        type: 'success',
                        closeOnClick: 'true'
                    })
                }).catch((e) => {
                    nativeToast({
                        message: '덱 URL 공유 취소!.<br>(' + e + ')',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    })
                })
            })
        } else {
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
        }
    } catch(e) {
        //오류창 열기
        nativeToast({
            message: '오류 발생 - URL을 출력할 수 없습니다.<br>(' + e + ')',
            position: 'center',
            timeout: 2000,
            type: 'error',
            closeOnClick: 'true'
        })
    }
}
