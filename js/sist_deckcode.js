
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
        //덱코드 얻기
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
    } else deckcode = DATA.SET.NEW.name + "' 미리 덱 짜보기";
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
    let _wrapper= document.createElement("div.simplestone_wrapper");
        let _header = document.createElement("div.simplestone_header");
            Object.assign(_header.style,{
                padding:"0.5em",
                width:"100%",
                height:"5em",
                background:"#503C23",
                border:"0.5em gold outset",
                boxSizing:"border-box",
                fontFamily:"Gothic",
                fontWeight:"bold"
            });
            let _icon = document.createElement("img.simplestone_icon");
                _icon.src = ICONDATA[deck.class];
                _icon.alt = deck.class;
                Object.assign(_icon.style,{
                    float:"left",
                    display:"block",
                    width:"3em",
                    height:"3em"
                })
            _header.appendChild(_icon);
            let _headercenter = document.createElement("div.simplestone_headercenter");
                Object.assign(_headercenter.style,{
                    float:"left",
                    marginLeft:"0.5em",
                    width:"calc(100% - 8.5em)",
                    height:"3em"
                })
            _header.appendChild(_headercenter);
                let _deckname = document.createElement("div.simplestone_deckname");
                    _deckname.innerHTML = deck.name;
                    Object.assign(_deckname.style,{
                        float:"left",
                        overflow:"hidden",
                        width:"100%",
                        height:"1em",
                        color:"white",
                        fontSize:"1.8em",
                        fontWeight:"bold",
                        lineHeight:"100%",
                        textShadow:"0 -1px black,1px -1px black,1px 0 black,1px 1px black,0 1px black,-1px 1px black,-1px 0 black,-1px -1px black",
                        whiteSpace:"nowrap",
                        textOverflow:"ellipsis"
                    })
                _headercenter.appendChild(_deckname);
                let _dusticon = document.createElement("img.simplestone_dusticon");
                    _dusticon.src = ICONDATA.DUST;
                    Object.assign(_dusticon.style,{
                        clear:"both",float:"left",
                        marginTop:"0.2em",
                        width:"1em",
                        height:"1em",
                    })
                _headercenter.appendChild(_dusticon);
                let _dust = document.createElement("div.simplestone_dust");
                    _dust.innerHTML = thousand(deck.dust);
                    Object.assign(_dust.style,{
                        float:"left",
                        margin:"0.2em 0 0 0.2em",
                        height:"1em",
                        color:"skyblue",
                        textShadow:"0 -1px black,1px -1px black,1px 0 black,1px 1px black,0 1px black,-1px 1px black,-1px 0 black,-1px -1px black",
                        lineHeight:"1em"
                    })
                _headercenter.appendChild(_dust);
            let _headerlight = document.createElement("div.simplestone_headerlight");
                Object.assign(_headerlight.style,{
                    float:"right",
                    width:"5em",
                    height:"3em"
                })
            _header.appendChild(_headerlight);
                let _classname = document.createElement("div.simplestone_classname");
                    _classname.innerHTML = DATA.CLASS.KR[deck.class];
                    Object.assign(_classname.style,{
                        float:"right",
                        height:"1em",
                        fontWeight:"bold",
                        color:"white",
                        textShadow:"0 -1px black,1px -1px black,1px 0 black,1px 1px black,0 1px black,-1px 1px black,-1px 0 black,-1px -1px black",
                        lineHeight:"1em"
                    })
                _headerlight.appendChild(_classname);
                let _format = document.createElement("div.simplestone_format");
                    _format.innerHTML = deck.format;
                    let formatcolor = "";
                    if (deck.format === "정규") formatcolor = "lime";
                        else formatcolor = "orange";
                    Object.assign(_format.style,{
                        clear:"both",float:"right",
                        marginTop:"1em",
                        height:"1em",
                        color:formatcolor,
                        fontWeight:"bold",
                        textShadow:"0 -1px black,1px -1px black,1px 0 black,1px 1px black,0 1px black,-1px 1px black,-1px 0 black,-1px -1px black",
                        lineHeight:"1em"
                    })
                _headerlight.appendChild(_format);
        _wrapper.appendChild(_header);
        let _main = document.createElement("div.simplestone_main");
            Object.assign(_main.style,{
                display:"grid",
                gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))",
                gridGap:"2px",
                padding:"0.1em 0 1em 0",
                width:"100%",
                height:"auto",
                background:"#E7D099",
                boxSizing:"border-box",
                fontFamily:"Gothic",
                fontWeight:"bold"
            })
            let _classcard = document.createElement("div.simplestone_classcard");
                Object.assign(_classcard.style,{
                    height:"auto"
                })
            _main.appendChild(_classcard);
                //헤더
                let _classheader = document.createElement("div.simplestone_classheader");
                    _classheader.innerHTML = "직업카드 (" + outputCards.class.length.toString() + ")";
                    Object.assign(_classheader.style,{
                        width:"100%",
                        padding:"0 0.5em",
                        height:"2em",
                        background:"#212121",
                        boxSizing:"border-box",
                        fontSize:"1em",
                        color:"white",
                        lineHeight:"2em"
                    })
                _classcard.appendChild(_classheader);
                //직업카드 목록
                outputCards.class.forEach(function(card) {
                    let info = session.db[session.index[card[0]]];
                    let elm_card = document.createElement("div.card");
                        Object.assign(elm_card.style,{
                            marginTop:"0.1em",
                            width:"100%",
                            height:"2em",
                            background:"#404040",
                        })
                        let elm_card_cost = document.createElement("div.card_cost");
                            elm_card_cost.innerHTML = info.cost;
                            Object.assign(elm_card_cost.style,{
                                float:"left",
                                width:"2em",
                                height:"2em",
                                background:"blue",
                                color:"white",
                                lineHeight:"2em",
                                textAlign:"center"
                            })
                        let elm_card_name = document.createElement("div.card_name");
                            let raritycolor = DATA.RARITY.COLOR[info.rarity];
                            elm_card_name.innerHTML = info.name;
                            Object.assign(elm_card_name.style,{
                                float:"left",
                                paddingLeft:"0.5em",
                                width:"auto",
                                maxWidth:"calc(100% - 4em)",
                                boxSizing:"border-box",
                                height:"2em",
                                color:raritycolor,
                                lineHeight:"2em"
                            })
                        let elm_card_quantity = document.createElement("div.card_quantity");
                            elm_card_quantity.innerHTML = "× " + card[1].toString();
                            Object.assign(elm_card_quantity.style,{
                                float:"left",
                                width:"calc(2em)",
                                height:"2em",
                                color:"yellow",
                                lineHeight:"2em",
                                textAlign:"center"
                            })
                    //요소 합치기
                    elm_card.appendChild(elm_card_cost);
                    elm_card.appendChild(elm_card_name);
                    elm_card.appendChild(elm_card_quantity);

                    _classcard.appendChild(elm_card);
                })
            let _neutralcard = document.createElement("div.simplestone_neutralcard");
                Object.assign(_neutralcard.style,{
                    height:"auto"
                })
            _main.appendChild(_neutralcard);
                //헤더
                let _neutralheader = document.createElement("div.simplestone_neutralheader");
                _neutralheader.innerHTML = "중립카드 (" + outputCards.class.length.toString() + ")";
                Object.assign(_neutralheader.style,{
                    width:"100%",
                    padding:"0.5em",
                    height:"2em",
                    background:"#212121",
                    boxSizing:"border-box",
                    fontSize:"1em",
                    color:"white",
                    lineHeight:"1em"
                })
                _neutralcard.appendChild(_neutralheader);
                //중립카드 목록
                outputCards.neutral.forEach(function(card) {
                    let info = session.db[session.index[card[0]]];
                    let elm_card = document.createElement("div.card");
                        Object.assign(elm_card.style,{
                            marginTop:"0.1em",
                            width:"100%",
                            height:"2em",
                            background:"#404040",
                        })
                        let elm_card_cost = document.createElement("div.card_cost");
                            elm_card_cost.innerHTML = info.cost;
                            Object.assign(elm_card_cost.style,{
                                float:"left",
                                width:"2em",
                                height:"2em",
                                background:"blue",
                                color:"white",
                                lineHeight:"2em",
                                textAlign:"center"
                            })
                        let elm_card_name = document.createElement("div.card_name");
                            let raritycolor = DATA.RARITY.COLOR[info.rarity];
                            elm_card_name.innerHTML = info.name;
                            Object.assign(elm_card_name.style,{
                                float:"left",
                                paddingLeft:"0.5em",
                                width:"auto",
                                maxWidth:"calc(100% - 4em)",
                                boxSizing:"border-box",
                                height:"2em",
                                color:raritycolor,
                                lineHeight:"2em"
                            })
                        let elm_card_quantity = document.createElement("div.card_quantity");
                            elm_card_quantity.innerHTML = "× " + card[1].toString();
                            Object.assign(elm_card_quantity.style,{
                                float:"left",
                                width:"calc(2em)",
                                height:"2em",
                                color:"yellow",
                                lineHeight:"2em",
                                textAlign:"center"
                            })
                    //요소 합치기
                    elm_card.appendChild(elm_card_cost);
                    elm_card.appendChild(elm_card_name);
                    elm_card.appendChild(elm_card_quantity);

                    _neutralcard.appendChild(elm_card);
                })
        _wrapper.appendChild(_main);
        let _deckcode = document.createElement("div.simplestone_deckcode");
            _deckcode.innerHTML = deckcode;
            Object.assign(_deckcode.style,{
                paddingLeft:"0.5em",
                width:"100%",
                height:"2em",
                background:"#392C4A",
                boxSizing:"border-box",
                color:"white",
                fontFamily:"Gothic",
                lineHeight:"2em"
            })
        _wrapper.appendChild(_deckcode);
        let _domain = document.createElement("div.simplestone_domain");
            _domain.innerHTML = "Created at SimpleStone(https://solarias.github.io/simplestone)";
            Object.assign(_domain.style,{
                paddingRight:"0.5em",
                width:"100%",
                height:"2em",
                background:"#7B573F",
                boxSizing:"border-box",
                color:"white",
                fontFamily:"Gothic",
                fontSize:"0.8em",
                lineHeight:"2em",
                fontStyle:"italic",
                textAlign:"right"
            })
        _wrapper.appendChild(_domain);


    return _wrapper.outerHTML;
}
