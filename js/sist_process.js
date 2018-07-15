
//===========================================================
//※ 함수 - 창 설정
//===========================================================
//모든 창 & 명칭 닫기
function window_clear() {
    //커서 블러
    document.activeElement.blur();
    //화면 닫기
    $$(".mainscreen").forEach(function(target) {
        target.classList.remove("show");
    })
    $$(".subscreen").forEach(function(target) {
        target.classList.remove("show");
    })
    $$(".footer_desc").forEach(function(target) {
        target.style.display = "none";
    })
}

//개별 창 설정
function window_shift(keyword, keyword2) {
    switch(keyword) {
        //*메인 창
        case "titlescreen":
            //공용 함수
            function open() {
                //진행정보 초기화
                process = {};
                //진행상태 기억
                process.state = "titlescreen";
                //창 전환
                window_clear();
                $("#main_titlescreen").classList.add("show");
                $("#header_bottom").classList.remove("show");
                $("#footer_bottom").classList.remove("show");
                //명칭 출력
                $("#footer_notice").style.display = "block";

                //시작 버튼
                $("#start_card").onclick = function() {
                    window_shift("loading","cardinfo");
                }
                $("#start_deck").onclick = function() {
                    window_shift("decklist");
                }
            }

            //진행정보 초기화 의사 물어보기
            if (process.state && process.state !== "titlescreen") {
                if (keyword2 === "always") {
                    //강제 화면 전환
                    open();
                } else {
                    swal({
                        type:"warning",
                        title:"첫 화면으로 돌아가시겠습니까?",
                        text:"진행된 정보는 모두 초기화됩니다.",
                        showCancelButton:true,
                        confirmButtonText: '확인',
                        cancelButtonText: '취소',
                        cancelButtonColor: '#d33'
                    }).then(function(isConfirm){
                        if (isConfirm) {
                            //화면 전환
                            open();
                        } else {
                            //취소
                            return;
                        }
                    })
                }
            } else {
                //화면 전환
                open();
            }

            break;

        //*덱 목록
        case "decklist":
            //진행상태 기억
            process.state = "decklist";
            //창 전환
            window_clear();
            $("#main_decklist").classList.add("show");
            $("#footer_decklist").classList.add("show");
            //덱 설정 초기화
            process.deck = {};
            process.deck.deckcode = "";

            //덱코드 입력
            $("#button_readcode").onclick = function() {
                //팝업창 열기
                swal({
                    title: '덱코드 입력',
                    input: 'text',
                    inputValue: process.deck.deckcode,
                    text: '덱코드를 분석하여 카드목록을 불러옵니다.',
                    inputPlaceholder: '입력란',
                    allowOutsideClick:false,
                    showCancelButton:true,
                    confirmButtonText: '덱코드 적용',
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33',
                    showCloseButton:true,
                    onOpen: function() {
                        $(".swal2-input").select();
                    },
                    inputValidator: function(deckcode) {
                        return new Promise(function(resolve, reject) {
                            try {
                                resolve(deckstrings.decode(deckcode));
                            } catch(e) {
                                reject("올바르지 않은 덱코드입니다.");
                            }
                        })
                    }
                }).then(function(deckcode) {
                    if (deckcode) {
                        //덱코드 기억
                        process.deck.deckcode = deckcode;
                        //다음 진행
                        window_shift("loading","deckconfig")
                    }
                })
            }
            //새로운 덱 생성
            $("#botton_newdeck").onclick = function() {
                //덱 설정 초기화
                process.deck = {};
                //팝업창 열기
                swal({
                    html:
                      '<span class="popup_title">새로운 덱 설정</span>'+
                      '<span class="popup_subtitle">직업 선택</span>'+
                      '<button id="popup_class_WARRIOR" class="popup_button trisection newdeck_button newdeck_class" data-class="WARRIOR">전사</button>' +
                      '<button id="popup_class_SHAMAN" class="popup_button trisection newdeck_button newdeck_class" data-class="SHAMAN">주술사</button>' +
                      '<button id="popup_class_ROGUE" class="popup_button trisection newdeck_button newdeck_class" data-class="ROGUE">도적</button>' +
                      '<button id="popup_class_PALADIN" class="popup_button trisection newdeck_button newdeck_class" data-class="PALADIN">성기사</button>' +
                      '<button id="popup_class_HUNTER" class="popup_button trisection newdeck_button newdeck_class" data-class="HUNTER">사냥꾼</button>' +
                      '<button id="popup_class_DRUID" class="popup_button trisection newdeck_button newdeck_class" data-class="DRUID">드루이드</button>' +
                      '<button id="popup_class_WARLOCK" class="popup_button trisection newdeck_button newdeck_class" data-class="WARLOCK">흑마법사</button>' +
                      '<button id="popup_class_MAGE" class="popup_button trisection newdeck_button newdeck_class" data-class="MAGE">마법사</button>' +
                      '<button id="popup_class_PRIEST" class="popup_button trisection newdeck_button newdeck_class" data-class="PRIEST">사제</button>'+
                      '<span class="popup_subtitle">대전방식 선택</span>'+
                      '<button id="popup_format_standard" class="popup_button newdeck_button newdeck_format" data-format="정규">정규</button>' +
                      '<button id="popup_format_wild" class="popup_button newdeck_button newdeck_format" data-format="야생">야생</button>',
                    onOpen:function() {
                        $$(".newdeck_button").forEach(function(target) {
                            target.onclick = function() {
                                if (target.dataset.class) {
                                    //직업 세
                                    if (!process.deck) process.deck = {};
                                    process.deck.class = target.dataset.class;
                                    //버튼 세팅
                                    $$(".newdeck_class").forEach(function(x) {
                                        x.classList.remove("selected");
                                    })
                                    target.classList.add("selected");
                                } else if (target.dataset.format) {
                                    //대전 방식 세팅
                                    if (!process.deck) process.deck = {};
                                    process.deck.format = target.dataset.format;
                                    //버튼 세팅
                                    $$(".newdeck_format").forEach(function(x) {
                                        x.classList.remove("selected");
                                    })
                                    target.classList.add("selected");
                                }
                            }
                        })
                    },
                    preConfirm: function() {
                        return new Promise(function(resolve, reject) {
                            if (!process.deck || !process.deck.class) {
                                //swal.showValidationError('직업을 설정해주세요.');
                                reject('직업을 설정해주세요.');
                            } else if (!process.deck.format) {
                                reject('대전 방식을 설정해주세요.');
                                //swal.showValidationError('대전 방식을 설정해주세요.');
                            } else {
                                resolve();
                            }
                        })
                    },
                    allowOutsideClick:false,
                    showCancelButton:true,
                    confirmButtonText: '덱 생성',
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33',
                    showCloseButton:true
                }).then(function(isConfirm) {
                    if (isConfirm) {
                        window_shift("loading","deckbuilding");
                    }
                })
            }

            break;

        //카드정보 불러오기
        case "loading":
            //카드 정보가 없으면 불러올지 확인
            if (!session.db) {
                //의사 물어보기
                swal({
                    type:"warning",
                    title:"데이터 경고",
                    text:"카드정보를 불러오는 데 약 1MB의 데이터가 소모됩니다.",
                    allowOutsideClick:false,
                    showCancelButton:true,
                    confirmButtonText: '불러오기',
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33',
                    showCloseButton:true
                }).then(function(isConfirm){
                    if (!isConfirm) {
                        //거부 시 불러오기 취소
                        return false;
                    } else {
                        loading_pre();
                    }
                })
            } else {
                loading_pre();
            }

            //불러오기 세팅
            function loading_pre() {
                //진행상태 기억
                process.state = "loading";
                //화면 전환
                window_clear();
                $("#main_loading").classList.add("show");

                setTimeout(function() {
                    if (!session.db) {
                        loading_DB();
                    } else  {
                        //덱코드가 있다면 덱코드 해석
                        if (process.deck !== undefined && process.deck.deckcode !== undefined && process.deck.deckcode !== "") {
                            loading_deckcode();
                        //없으면 덱 포맷 검증
                        } else {
                            loading_formatvalidate();
                        }
                    }
                },1);
            }
            //DB 세팅
            function loading_DB() {
            //카드정보 로딩 개시
                try {
                    fetch("./js/cards_collectible.json")
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(myJson) {
                        //카드정보 입력
                        session.db = myJson;
                        //카드정보 정렬
                        sort_arr(session.db);
                        //카드정보 정제
                        session.db.forEach(function(x, index) {
                            x.dbfid = x.dbfId.toString();//dbfId대문자 제거 및 문자열로 변환
                            x.ssi = index.toString();//index 정보 추가
                        })
                        //덱코드가 있다면 덱코드 해석
                        if (process.deck !== undefined && process.deck.deckcode !== undefined && process.deck.deckcode !== "") {
                            loading_deckcode();
                        //없으면 화면 전환
                        } else {
                            loading_master();
                        }
                    });
                } catch(e) {
                    swal({
                        type:"error",
                        title:"카드정보 불러오기 실패",
                        text:"첫 화면으로 돌아갑니다."
                    }).then(function() {
                        window_shift("titlescreen","always");
                    })
                }
            }

            //덱코드 해석
            function loading_deckcode() {
                //덱코드 분석, 저장
                decoded = deckcode_decode(process.deck.deckcode);
                process.deck.cards = decoded.cards;
                process.deck.class = decoded.class;
                process.deck.format = decoded.format;
                //마스터가 있다면 마스터 생성
                if (!session.masterNode) {
                    loading_master();
                //있으면 덱 포맷 검증
                } else {
                    loading_formatvalidate();
                }
            }
            //Master Node, Master Info 작성
            function loading_master() {
                //Master Node 생성
                if (!session.masterNodeInfo) session.masterNode = card_generateMaster();
                //Master Info 생성
                if (!session.masterInfo) session.masterInfo = cardinfo_generateMaster();

                //덱 포맷 검증
                loading_formatvalidate();
            }
            //불러올 덱 포맷 검증
            function loading_formatvalidate() {
                if (process.deck !== undefined && process.deck.cards !== undefined && process.deck.cards.length > 0) {
                    for (let i = 0;i < process.deck.cards.length;i++) {
                        if (DATA.SET_FORMAT[session.db[parseInt(process.deck.cards[i].ssi)].set] === "야생") {
                            process.deck.format = "야생";
                            break;
                        }
                    }
                }
                //Fragment 불러오기
                loading_fragment();
            }
            //Fragment 작성 : 직업, 포맷에 따라 Fragment (없는 거) 생성
            function loading_fragment() {
                //fragment가 없으면 생성
                if (!session.fragment) session.fragment = [];
                //필요한 카드 정보 생성, Fragment에 부착
                session.db.forEach(function(info, index) {
                    if (!session.fragment[index]) {
                        if (keyword2 === "cardinfo" ||//카드 정보: 모든 카드 요소 생성
                        (info.cardClass === "NEUTRAL" || info.cardClass === process.deck.class) &&//직업 & 중립
                        (info.rarity !== "FREE" || info.type !== "HERO") &&//기본 영웅 제외
                        (info.rarity !== "HERO_SKIN" || info.type !== "HERO")) {//스킨 영웅 제외
                        //포맷: 모든 포맷 불러오기(정규/야생 전환을 위해)
                            //카드 정보 생성
                            session.fragment[index] = card_generateFragment(info);
                        }
                    }
                })

                //화면 전환
                window_shift(keyword2);
            }

            break;

        //*카드 검색
        case "cardinfo":
            //상태 기억
            process.state = "cardinfo";
            //==================
            //※ 화면 구성
            //==================
            //화면 출력
            window_clear();
            $("#main_collection").classList.add("show");
            $("#main_cardinfo").classList.add("show");
            $("#footer_name_left").style.display = "block";
                $("#footer_name_left").innerHTML = "카드 목록";
            $("#footer_name_right").style.display = "block";
                $("#footer_name_right").innerHTML = "카드 정보";
            $("#header_bottom").classList.add("show");

            //==================
            //※ 필터 구성
            //==================
            //검색 초기치 강제 설정, 필터 활성화
            process.deck = [];
                process.deck.class = "WARRIOR";
                process.deck.format = "야생";
            card_setFilter("init");//필터 활성화

            //검색 초기치에 따라 검색결과 출력(최초 검색)
            card_search();

            //==================
            //※ 카드정보 구성
            //==================
            //카드정보 노드 설치
            cardinfo_setup("main_cardinfo");

            //카드 보기 상호작용
            $("#collection_list_content").onclick = function(e) {
                e = e || event;
                let target = e.target || e.srcElement;
                if (target.classList.contains("card")) {
                    let info = session.db[target.dataset.ssi];
                    cardinfo_show("main_cardinfo",info);
                }
            }
            $("#collection_list_content").ontouchend = function(e) {
                e = e || event;
                let target = e.target || e.srcElement;
                if (target.classList.contains("card")) {
                    let info = session.db[target.dataset.ssi];
                    cardinfo_show("main_cardinfo",info);
                }
            }

            break;

        //*덱 제작
        case "deckbuilding":
            //상태 기억
            process.state = "deckbuilding";
            //==================
            //※ 화면 구성
            //==================
            //화면 출력
            window_clear();
            $("#main_collection").classList.add("show");
            $("#main_deck").classList.add("show");
            $("#footer_name_left").style.display = "block";
                $("#footer_name_left").innerHTML = "카드 목록";
            $("#footer_name_right").style.display = "block";
                $("#footer_name_right").innerHTML = "덱 구성";
            $("#header_bottom").classList.add("show");
            $("#footer_bottom").classList.add("show");
            //로그 초기화
            $("#undo_num").innerHTML = "0";
            $("#undo_num").classList.remove("show");
            $("#redo_num").innerHTML = "0";
            $("#redo_num").classList.remove("show");

            //==================
            //※ 덱 & 필터 구성
            //==================
            //검색 초기치 설정, 필터 활성화
            card_setFilter("init");//필터 활성화

            //검색 초기치에 따라 검색결과 출력(최초 검색)
            card_search();

            //덱 초기화
            deck_refresh("init");

            //==================
            //※ 카드정보 구성
            //==================
            //카드모니터 설치
            $("#frame_cardmonitor").classList.add("show");
            //카드정보 노드 설치
                cardinfo_setup("cardcover_top", false);
                cardinfo_setup("frame_cardmonitor", false);

            //==================
            //※ 상호작용
            //==================
            //카드 보기 상호작용
            let interact_target;

                //카드 목록 상호작용
                $("#collection_list_content").onmouseover = function(e) {
                    interact_infoMonitor(e);
                }
                $("#collection_list_content").onmousedown = function(e) {
                    interact_infoCoverWait(e, true);
                    return false;
                }
                $("#collection_list_content").onmouseout = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
                $("#collection_list_content").onmouseup = function(e) {
                    interact_addCard(e, true);
                    return false;
                }
                $("#collection_list_content").oncontextmenu = function(e) {
                    interact_infoCoverNow(e);
                    return false;
                }
                    //터치 기반
                    $("#collection_list_content").ontouchstart = function(e) {
                        interact_infoCoverWait(e);
                    }
                    $("#collection_list_content").ontouchcancel = function(e) {
                        interact_stopAuto(e);
                        return false;
                    }
                    $("#collection_list").onscroll = function(e) {
                        interact_stopAuto(e);
                        return false;
                    }
                    $("#collection_list_content").ontouchend = function(e) {
                        interact_addCard(e);
                        return false;
                    }
                //덱 목록 상호작용
                $("#deck_list_content").onmouseover = function(e) {
                    interact_infoMonitor(e);
                }
                $("#deck_list_content").onmousedown = function(e) {
                    interact_infoCoverWait(e, true);
                    return false;
                }
                $("#deck_list_content").onmouseout = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
                $("#deck_list_content").onmouseup = function(e) {
                    interact_removeCard(e, true);
                    return false;
                }
                $("#deck_list_content").oncontextmenu = function(e) {
                    interact_infoCoverNow(e);
                    return false;
                }
                    //터치 기반
                    $("#deck_list_content").ontouchstart = function(e) {
                        interact_infoCoverWait(e);
                    }
                    $("#deck_list_content").ontouchcancel = function(e) {
                        interact_stopAuto(e);
                        return false;
                    }
                    $("#deck_list").onscroll = function(e) {
                        interact_stopAuto(e);
                        return false;
                    }
                    $("#deck_list_content").ontouchend = function(e) {
                        interact_removeCard(e);
                        return false;
                    }
                //카드 정보창 닫기
                $("#frame_cardcover").onclick = function() {
                    $("#frame_cardcover").classList.remove("show");
                }

            //덱 완료
            $("#bottom_done").onclick = function() {
                //다음 진행
                window_shift("deckconfig")
            }

            break;

        //*덱 관리
        case "deckconfig":
            //상태 기억
            process.state = "deckconfig";
            //==================
            //※ 화면 구성
            //==================
            //화면 출력
            window_clear();
            $("#main_deckconfig").classList.add("show");
            $("#main_deck").classList.add("show");
            $("#footer_deckconfig").classList.add("show");

            //==================
            //※ 덱 구성
            //==================
            //덱 초기화
            deck_refresh("init");

            //==================
            //※ 주 버튼
            //==================
            //덱 이름 변경
            $("#deckconfig_name").onclick = function() {
                //팝업창 열기
                swal({
                    title: '덱 이름 입력',
                    input: 'text',
                    inputValue: process.deck.name,
                    inputPlaceholder: '입력란',
                    allowOutsideClick:false,
                    showCancelButton:true,
                    confirmButtonText: '이름 변경',
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33',
                    showCloseButton:true,
                    onOpen: function() {
                        $(".swal2-input").select();
                    },
                    inputValidator: function(name) {
                        return new Promise(function(resolve, reject) {
                            if (name.length > 0) {
                                resolve();
                            } else {
                                reject("덱 이름이 없습니다!");
                            }
                        })
                    }
                }).then(function(name) {
                    if (name) {
                        //덱코드 기억
                        process.deck.name = name;
                        $("#deck_name").innerHTML = process.deck.name;
                    }
                })
            }
            //덱코드 출력
            $("#deckconfig_deckstring").onclick = function() {
                //미완성 시 경고창
                if (process.deck.quantity < DATA.DECK_LIMIT) {
                    let deckquantity = "(" + process.deck.quantity.toString() + " / " + DATA.DECK_LIMIT.toString() + ")";
                    nativeToast({
                        message: '덱이 완성되지 않았습니다.<br>' + deckquantity,
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                } else {
                    //덱코드 얻기
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
                }
            }
            //덱설명 출력
            $("#deckconfig_text").onclick = function() {
                //미완성 시 경고창
                if (process.deck.quantity < DATA.DECK_LIMIT) {
                    let deckquantity = "(" + process.deck.quantity.toString() + " / " + DATA.DECK_LIMIT.toString() + ")";
                    nativeToast({
                        message: '덱이 완성되지 않았습니다.<br>' + deckquantity,
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                } else {
                    //덱코드 얻기
                    let decktext = deckcode_text();
                    //팝업창 열기
                    swal({
                        title: '덱설명 출력',
                        text: '덱설명이 복사되었습니다!',
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
                }
            }
            //포맷 전환
            if (process.deck.format === "정규") {
                $("#deckconfig_format").innerHTML = "\"야생\" 덱으로<br>전환하기";
            } else {
                $("#deckconfig_format").innerHTML = "\"정규\" 덱으로<br>전환하기";
            }
            $("#deckconfig_format").onclick = function() {
                //의사 물어보기
                swal({
                    type:"warning",
                    title:"포맷 변경 경고",
                    text:"대전방식과 맞지 않은 카드는 덱에서 제외될 수 있습니다.",
                    allowOutsideClick:false,
                    showCancelButton:true,
                    confirmButtonText: '불러오기',
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33',
                    showCloseButton:true
                }).then(function(isConfirm){
                    if (isConfirm) {
                        if (process.deck.format === "정규") {
                            //덱 포맷 전환
                            process.deck.format = "야생";
                            deck_refresh("init");
                            //버튼 문구 변경
                            $("#deckconfig_format").innerHTML = "\"정규\" 덱으로<br>전환하기";
                            //문구 출력
                            nativeToast({
                                message: '대전방식이 변경되었습니다.<br>(정규 -> 야생)',
                                position: 'center',
                                timeout: 2000,
                                type: 'success',
                                closeOnClick: 'true'
                            });
                        } else if (process.deck.format === "야생") {
                            //덱 포맷 전환
                            process.deck.format = "정규";
                            //정규 카드 제외
                            process.deck.cards.forEach(function(card, i) {
                                if (DATA.SET_FORMAT[session.db[parseInt(card.ssi)].set] === "야생") {
                                    process.deck.cards.splice(i,1);
                                }
                            })
                            console.log(process.deck.cards);
                            deck_refresh("init");
                            //버튼 문구 변경
                            $("#deckconfig_format").innerHTML = "\"야생\" 덱으로<br>전환하기";
                            //문구 출력
                            nativeToast({
                                message: '대전방식이 변경되었습니다.<br>(야생 -> 정규)',
                                position: 'center',
                                timeout: 2000,
                                type: 'success',
                                closeOnClick: 'true'
                            });
                        }
                    }
                })
            }

            //덱 편집
            $("#button_edit").onclick = function() {
                //덱 편집창으로 전환
                window_shift("deckbuilding");
            }

            //==================
            //※ 카드정보 구성
            //==================
            //카드모니터 설치
            $("#frame_cardmonitor").classList.add("show");
            //카드정보 노드 설치
                cardinfo_setup("cardcover_top");
                cardinfo_setup("frame_cardmonitor");

            $("#deck_list_content").onmouseover = function(e) {
                interact_infoMonitor(e);
            }
            $("#deck_list_content").onmousedown = function(e) {
                interact_infoCoverWait(e, true);
                return false;
            }
            $("#deck_list_content").onmouseout = function(e) {
                interact_stopAuto(e);
                return false;
            }
            $("#deck_list_content").onmouseup = function(e) {
                interact_stopAuto(e);
                return false;
            }
            $("#deck_list_content").oncontextmenu = function(e) {
                interact_infoCoverNow(e);
                return false;
            }
                //터치 기반
                $("#deck_list_content").ontouchstart = function(e) {
                    interact_infoCoverWait(e);
                }
                $("#deck_list_content").ontouchcancel = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
                $("#deck_list").onscroll = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
                $("#deck_list_content").ontouchend = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
            //카드 정보창 닫기
            $("#frame_cardcover").onclick = function() {
                $("#frame_cardcover").classList.remove("show");
            }
    }
}

//상호작용 모음
let interact_addCard = function(e, ismouse) {
    e = e || event;
        if (ismouse === true && e.button !== 0) return false;//우클릭 배제
    let target = e.target || e.srcElemnt;
    //카드 정보 auto 제거
    clearTimeout(autoInfo);
    //카드 추가
    if (target.classList.contains("card") && target === interact_target) {
        //상호작용 대상 비우기
        interact_target = "";
        card_move("add " + target.dataset.ssi, true);
        e.preventDefault();
    }
}
let interact_removeCard = function(e, ismouse) {
    e = e || event;
        if (ismouse === true && e.button !== 0) return false;//우클릭 배제
    let target = e.target || e.srcElement;
    //카드 정보 auto 제거
    clearTimeout(autoInfo);
    if (target.classList.contains("card") && target === interact_target) {
        //상호작용 대상 비우기
        interact_target = "";
        card_move("remove " + target.dataset.ssi, true);
        e.preventDefault();
    }
}
let interact_infoMonitor = function(e) {
    e = e || event;
    let target = e.target || e.srcElement;
    if (target.classList.contains("card")) {
        let info = session.db[target.dataset.ssi];
        cardinfo_setScale($(".cardinfo.wrapper",$("#frame_cardmonitor")), false);
        cardinfo_show("frame_cardmonitor",info);
    }
}
let interact_infoCoverNow = function(e) {//우클릭 전용
    e = e || event;
    let target = e.target || e.srcElement;
    if (target.classList.contains("card")) {
        //상호작용 대상 비우기
        interact_target = "";
        let info = session.db[target.dataset.ssi];
        $("#frame_cardcover").classList.add("show");
        cardinfo_setScale($(".cardinfo.wrapper",$("#frame_cardcover")), false);
        cardinfo_show("cardcover_top",info);
        return false;
    }
    return false;
}
let interact_infoCoverWait = function(e, ismouse) {
    e = e || event;
        if (ismouse === true && e.button !== 0) return false;//우클릭 배제
    let target = e.target || e.srcElement;
    if (target.classList.contains("card")) {
        //상호작용 대상 등록
        interact_target = target;
        //0.5초 지속 : 카드 정보
        autoInfo = setTimeout(function() {
            let info = session.db[target.dataset.ssi];
            $("#frame_cardcover").classList.add("show");
            cardinfo_setScale($(".cardinfo.wrapper",$("#frame_cardcover")), false);
            cardinfo_show("cardcover_top",info);
            //창이 뜨면 상호작용 대상 비우기
            interact_target = "";
            e.preventDefault();
        },autoInfoTime);
    }
}
let interact_stopAuto = function(e) {
    //카드 정보 auto 제거
    clearTimeout(autoInfo);
    //상호작용 대상 비우기
    interact_target = "";
}

//===========================================================
//※ 함수
//===========================================================
//카드 마스터 노드 생성
function card_generateMaster() {
    //요소 생성
    let elm_card = document.createElement("div.card.selectable");
        elm_card.classList.add("card_$index");//$index: 카드 인덱스 스트링
        elm_card.dataset.ssi = "$index";//$index
        elm_card.classList.add("flash_hidden");//flash 대상은 이 클래스 제거
        elm_card.style.backgroundImage = "url(" + TILEURL + "$id.jpg)";//$id: 카드 ID
    let elm_card_cost = document.createElement("div.card_cost");
        elm_card_cost.classList.add("rarity_$rarity");//$rarity: 카드 희귀도
        elm_card_cost.innerHTML = "$cost";//$cost: 카드 비용
    let elm_card_name = document.createElement("div.card_name");
        let elm_card_name_text = document.createElement("p");
            elm_card_name_text.innerHTML = "$name";//$name: 카드 이름
        elm_card_name.appendChild(elm_card_name_text);
    let elm_card_quantity = document.createElement("div.card_quantity");
        elm_card_quantity.innerHTML = "$quantity";//$quantity: 카드 수량
        elm_card_quantity.classList.add("quantity_hidden");//$hidden: 수량 표기여부
    //요소 합치기
    elm_card.appendChild(elm_card_cost);
    elm_card.appendChild(elm_card_name);
    elm_card.appendChild(elm_card_quantity);
    //출력
    return elm_card.outerHTML;
}
//카드 개별 정보 생성
function card_generateFragment(info) {
    //마스터 노드 복사
    let fragment = session.masterNode;
    //필요한 정보 설정(수량 제외)
    fragment = fragment.replaceAll("$index",info.ssi);//인덱스 설정
    fragment = fragment.replace("$id",info.id);//ID 설정
    fragment = fragment.replace("$cost",info.cost);//비용 설정
    fragment = fragment.replace("$name",info.name);//이름 설정
    fragment = fragment.replace("$rarity",info.rarity);//등급 설정
    //반환
    return fragment;
}


//카드 수량 찾기(by index)
function card_getQuantity(index) {
    //덱에 카드 정보가 없으면 0 출력
    if (!process.deck || !process.deck.cards) return 0;
    else {
        //카드 정보를 찾으면 quantity 출력
        for (let i = 0;i < process.deck.cards.length;i++) {
            if (process.deck.cards[i].ssi === index)
                return process.deck.cards[i].quantity;
        }
        //못찾았으면 0 출력
        return 0;
    }
}

//카드 추가 & 제거 & 적용
function card_move(cmd, log) {
    //커맨드 쪼개기
    let cmdarr = cmd.split(" ");
    let movement = cmdarr[0];
    let deckarr = [];
    //명령 구분
    switch (movement) {
        //카드 추가
        case "add":
            //움직인 카드 수 기억
            let movednum = 0;
            //카드 분류
            for (let i = 1;i < cmdarr.length;i++) {
                deckarr.push(cmdarr[i]);
            }
            //카드 추가
            deckarr.forEach(function(index) {
                let quantity = card_getQuantity(index);
                //덱이 30장 미만이고, 카드 없거나 카드가 1장일 때 전설이 아니면 카드 추가
                if (process.deck.quantity < DATA.DECK_LIMIT &&
                    (quantity <= 0 || (quantity === 1 && session.db[index].rarity !== "LEGENDARY"))) {
                    //로그 기록
                    if (log === true) log_record(cmd);
                    //수량이 0이면
                    if (quantity === 0) {
                        //카드정보 추가
                        let obj = {
                            "ssi":index,
                            "quantity":1
                        }
                        process.deck.cards.push(obj);
                        //카드정보 정렬
                        process.deck.cards.sort(function(a,b) {
                            return (parseInt(a.ssi) < parseInt(b.ssi)) ? -1 : 1;
                        })
                    //수량이 1이면 카드정보 찾아서 수량 추가
                    } else {
                        //1) 카드정보 변경
                        for (let i = 0;i < process.deck.cards.length;i++) {
                            let card = process.deck.cards[i];
                            if (card.ssi === index) {
                                card.quantity += 1;
                                break;
                            }
                        }
                    }
                    movednum += 1;
                }
            })
            //카드 목록에 따라 노드 불러오기
            if (movednum > 0) cluster_update("deck",deckarr);

            break;
        //카드 제거
        case "remove":
            //로그 기록(제거는 예외사항 없으니 바로 실시)
            if (log === true) log_record(cmd);
            //카드 분류
            for (let i = 1;i < cmdarr.length;i++) {
                deckarr.push(cmdarr[i]);
            }
            //카드 제거
            deckarr.forEach(function(index) {
                let quantity = card_getQuantity(index);
                for (let i = 0;i < process.deck.cards.length;i++) {
                    let card = process.deck.cards[i];
                    if (card.ssi === index) {
                        //수량이 2 이상이면 수량 감소
                        if (card.quantity >= 2) {
                            //수량 감소
                            card.quantity -= 1;
                        //아니라면 카드 정보 제거
                        } else {
                            process.deck.cards.splice(i,1);
                        }

                        break;
                    }
                }
            })
            //카드 목록에 따라 노드 불러오기
            cluster_update("deck",deckarr);

            break;
        //카드 적용
        case "set":
            //로그 기록
            if (log === true) log_record(cmd);
            //카드 분류
            for (let i = 1;i < cmdarr.length;i++) {
                if (i % 2 === 0) {
                    let obj = {
                        deckarr:parseInt(cmdarr[i])
                    }
                    deckobj.push(obj);
                } else if (i % 2 === 1) {
                    deckarr[Math.ceil((i + 1) % 2)].quantity = parseInt(cmdarr[i]);
                }
                deckarr.push(cmdarr[i]);
            }
            //기존 카드목록 기억, 비우기
            let lastdeck = deepCopy(process.deck.cards.length);
            process.deck.cards = [];
            //카드 적용
            deckarr.forEach(function(x) {
                process.deck.cards.push(x);
            })
            //카드 목록에 따라 노드 불러오기
            cluster_update("deck",deckarr);

            break;
        //공통
        default:
            break;
    }
}

//카드 최종 정보 생성
function card_addFragment(index, quantity, show1, flasharr) {
    //요소 불러오기
    let fragment = session.fragment[index];

    //플래시 정보 입력
    if (flasharr !== false && flasharr.indexOf(index) >= 0) {
        fragment = fragment.replace(" flash_hidden","");
    }
    //수량 정보 입력
    let numtext = "";
        //수량이 1 이상
        if (quantity >= 1) {
            //전설이면 "별" 표기
            if (session.db[index].rarity === "LEGENDARY") {
                numtext = "★";
                fragment = fragment.replace(" quantity_hidden","");
            //전설이 아니면 수량 표기
            } else if (show1 === true || (show1 === false && quantity >= 2)) {
                numtext = quantity.toString();
                fragment = fragment.replace(" quantity_hidden","");
            }
        }//카드 수령이 0이면: 숨기기
    fragment = fragment.replace("$quantity",numtext);

    //요소 출력
    return fragment;
}
//클러스터 업데이트
function cluster_update(position, latest, updateCollection) {
    let arr = [];
    let nodearr = [];
    switch (position) {
        case "collection":
            arr = process.search.result;
            //클러스터 입력정보 준비
            arr.forEach(function(x) {
                nodearr.push(card_addFragment(x,card_getQuantity(x),true,latest));
            })
            //클러스터 업데이트
            clusterize.collection.update(nodearr);

            break;
        case "deck":
            arr = process.deck.cards;
            //클러스터 입력정보 준비
            arr.forEach(function(x) {
                nodearr.push(card_addFragment(x.ssi,x.quantity,false,latest));
            })
            //클러스터 업데이트
            clusterize.deck.update(nodearr);

            //카드 추가 스크롤 이동(차후 구현)
            /*
            let firstcard = $$("#deck_list_content .card_" + latest[0])[0];
            if (firstcard !== undefined) {
                $("#deck_list").scrollTop = firstcard.offsetTop;
            */

            //덱 상태 최신화
            deck_refresh();

            //카드목록 (해당되면) 클러스터 업데이트
            if (updateCollection  !== false) {
                cluster_update("collection", latest);
            }


            break;
    }
}

//로그 생성
function log_record(cmd) {
    //로그 공간 생성 및 입력, 표시
    if (!process.log) process.log = [];//로그 공간 생성
    process.log.push(cmd);//로그 입력
    $("#undo_num").innerHTML = thousand(process.log.length);//로그 횟수 표기
    //취소버튼 활성화
    $("#bottom_undo").onclick = log_undo;
    $("#bottom_undo").classList.remove("disabled");
    //복구 로그 비우기
    process.redo = [];
    $("#redo_num").innerHTML = thousand(process.redo.length);
    //복구버튼 비활성화
    $("#bottom_redo").onclick = "";
    $("#bottom_redo").classList.add("disabled");
}
//실행 취소
function log_undo() {
    //마지막 로그 분석
    let log = process.log[process.log.length-1];
        process.log.pop();//마지막 로그 지우기
        $("#undo_num").innerHTML = thousand(process.log.length);//로그 횟수 표기
    let movement = log.split(" ")[0];
    switch (movement) {
        case "add":
            log = log.replace("add","remove");
            break;
        case "remove":
            log = log.replace("remove","add")
            break;
        case "set":
            break;
    }
    //취소 실행
    card_move(log,false);
    //복구 로그에 취소사항 기록
    if (!process.redo) process.redo = [];
    process.redo.push(log);
    $("#redo_num").innerHTML = thousand(process.redo.length);
    //이제 로그가 없으면 취소버튼 비활성화
    if (process.log.length <= 0) {
        $("#bottom_undo").onclick = "";
        $("#bottom_undo").classList.add("disabled");
    }
    //복구 버튼 활성화
    $("#bottom_redo").onclick = log_redo;
    $("#bottom_redo").classList.remove("disabled");
}
//취소 복구
function log_redo() {
    //마지막 복구로그 분석
    let redo = process.redo[process.redo.length-1];
        process.redo.pop();//마지막 로그 지우기
        $("#redo_num").innerHTML = thousand(process.redo.length);//로그 횟수 표기
    let movement = redo.split(" ")[0];
    switch (movement) {
        case "add":
            redo = redo.replace("add","remove");
            break;
        case "remove":
            redo = redo.replace("remove","add")
            break;
        case "set":
            break;
    }
    //복구 실행
    card_move(redo,false);
    //취소 로그에 복구사항 기록
    process.log.push(redo);
    $("#undo_num").innerHTML = thousand(process.log.length);
    //이제 로그가 없으면 취소버튼 비활성화
    if (process.redo.length <= 0) {
        $("#bottom_redo").onclick = "";
        $("#bottom_redo").classList.add("disabled");
    }
    //복구 버튼 활성화
    $("#bottom_undo").onclick = log_undo;
    $("#bottom_undo").classList.remove("disabled");
}

//덱 리프레시
function deck_refresh(cmd) {
    //최초 시동
    if (cmd === "init") {
        //덱에 예전 카드 있으면 비우기
        clusterize.deck.clear();
        //덱 공간 추가
        if (!process.deck) process.deck = {};
        //덱 카드 공간 추가
        if (!process.deck.cards) {
            process.deck.cards = [];
            process.deck.quantity = 0;
            process.deck.dust = 0;
        }
        //영웅 이미지 출력
        $("#deck_hero").style.backgroundImage = "url(" + TILEURL + DATA.CLASS_ID[process.deck.class] + ".jpg)";
        //덱 이름 출력
        if (process.deck.name) {
            $("#deck_name").innerHTML = process.deck.name
        } else {
            let deckname = "나만의 " + DATA.CLASS_KR[process.deck.class] + " 덱";
            process.deck.name = deckname;
            $("#deck_name").innerHTML = deckname;
        }
        //덱 출력
        cluster_update("deck", false, false);
    }
    //정규/야생 출력
    $("#deck_format").className = DATA.FORMAT_EN[process.deck.format];
    $("#deck_format").innerHTML = process.deck.format + "전";

    //덱 가루, 수량 확인 및 출력
    let quantity = 0;
    let dust = 0;
    process.deck.cards.forEach(function(x) {
        quantity += x.quantity;
        dust += DATA.RARITY_DUST[session.db[x.ssi].rarity] * x.quantity;
    })
        //덱 수량 저장, 출력
        process.deck.quantity = quantity;
        $("#deck_bottom").innerHTML = "카드 " + quantity + " / 30";
        //덱 가루 저장, 출력
        process.deck.dust = dust;
        $("#dust_quantity").innerHTML = thousand(dust);
    //덱이 완성되었으면 배경 변경
    if (process.deck.quantity >= DATA.DECK_LIMIT) {
        $("#deck_list_cover_overlay").classList.add("complete");
    } else {
        $("#deck_list_cover_overlay").classList.remove("complete");
    }
}

//덱 임시저장
function deck_tempsave() {
    let temp = {};
    temp.cards = deepCopy(process.deck.cards);
    temp.class = process.deck.class;
    temp.format = process.deck.format;
    temp.quantity = process.deck.quantity;

    let deck = {
        "temp":temp
    }
    //저장
    localforage.setItem("sist",deck);
    //문구 출력
    nativeToast({
        message: '덱이 저장되었습니다.',
        position: 'center',
        timeout: 2000,
        type: 'success',
        closeOnClick: 'true'
    });
}

//덱 불러오기
function deck_load() {

}

//===========================================================
//※ 실행
//===========================================================
document.addEventListener("DOMContentLoaded", function(e) {
    //첫 화면 상호작용
        //첫 화면 공개
        window_shift("titlescreen");

        //홈 버튼
        $("#header_home").onclick = function() {
            window_shift("titlescreen");
        }
        //인포 버튼
        $("#header_info").onclick = function() {
            swal({
                title:"INFORMATION",
                html:"제작자: 솔라이어스<br>"+
                    "피드백: ansewo@naver.com<br><br>"+
                    '카드정보 & 카드이미지 출처: <a href="https://hearthstonejson.com/" target="_blank">HearthstoneJSON</a><br>'+
                    '각종 아이콘 출처: <a href="https://ko.icons8.com/icon" target="_blank">https://ko.icons8.com/icon</a>',
                type:"info"
            })
        }

        //카드 클러스터 생성해두기
        clusterize.collection = new Clusterize({
            tag: 'div',
            scrollId: 'collection_list',
            contentId: 'collection_list_content',
            rows_in_block:10,
            no_data_text: '결과 없음',
            no_data_class: 'clusterize-no-data'
        });
        //덱 클러스터 생성해두기
        clusterize.deck = new Clusterize({
            tag: 'div',
            scrollId: 'deck_list',
            contentId: 'deck_list_content',
            rows_in_block:10,
            no_data_text: ''
        });

        //종료 경고 메시지
        window.onbeforeunload = function() {
           return "사이트에서 나가시겠습니까?";
        };
});
//오류 취급 (출처 : http://stackoverflow.com/questions/951791/javascript-global-error-handling)
/*
window.onerror = function(msg, url, line, col, error) {
    var extra = !col ? '' : ', Column : ' + col;
    extra += !error ? '' : '\n * 에러 : ' + error;
    var notice = " * 내용 : " + msg + "\n * Line : " + line + extra;
    if (swal) {
        swal({
            title:"오류 발생",
            type:"error",
            html:"아래의 내용을 제보해주시면 감사하겠습니다.<br>" +
            "(<a href='http://blog.naver.com/ansewo/220924971980' target='_blank'>클릭하면 블로그로 이동합니다</a>)<br/>" +
            notice.replaceAll("\n","<br>")
        });
    } else alert("아래의 내용을 제보해주시면 감사하겠습니다.(http://blog.naver.com/ansewo/220924971980)\n" + notice);
    var suppressErrorAlert = true;
    return suppressErrorAlert;
};
*/
