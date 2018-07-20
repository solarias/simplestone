
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
        //메인 창
        case "init":
            //창 전환
            window_clear();
            $("#main_init").classList.add("show");
            $("#footer_init").classList.add("show");

            //공지사항 출력
            fetch("./notice.json")
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                let notice = myJson.notice;
                let noticeFrag = document.createDocumentFragment();
                notice.forEach(function(each) {
                    let date = document.createElement("p[date]");
                        date.innerHTML = each.date;
                    let content = document.createElement("p[content]");
                        content.innerHTML = "- " + each.content;
                    noticeFrag.appendChild(date);
                    noticeFrag.appendChild(content);
                })

                $("#init_notice").appendChild(noticeFrag);
            })

            //상호작용
            $("#button_update").onclick = function() {
                //의사 물어보기
                swal({
                    type:"warning",
                    title:"데이터 경고",
                    text:"카드정보를 불러오는 데 약 1MB의 데이터가 소모됩니다.",
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
                        session.offline = false;
                        process_update_former();
                    }
                })
            }
            $("#button_offline").onclick = function() {
                //의사 물어보기
                swal({
                    type:"info",
                    title:"오프라인 모드",
                    text:"가장 최근에 불러온 카드 정보를 활용하고, 카드 이미지를 불러오지 않습니다.",
                    showCancelButton:true,
                    confirmButtonText: '시작하기',
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33',
                    showCloseButton:true
                }).then(function(isConfirm){
                    if (!isConfirm) {
                        //거부 시 불러오기 취소
                        return false;
                    } else {
                        session.offline = true;
                        process_update_former();
                    }
                })
            }

            //1차: DB 업데이트 or 불러오기
            function process_update_former() {
                //업데이트: JSON 불러온 후 로컬에 저장
                if (session.offline === false) {
                    //시작버튼 비활성화
                    $("#button_update").disabled = true;
                    $("#button_offline").disabled = true;
                    //카드 정보 불러오기
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
                        })
                        //카드 정보 저장
                        localforage.setItem("sist_db",session.db)
                        .then(function() {
                            //카드정보 구축 시작
                            process_update_latter();
                        }).catch(function() {
                            //저장 못해도 '아무튼' 구축 시작
                            process_update_latter();
                        });
                    });
                //오프라인: 로컬 불러오기
                } else if (session.offline === true) {
                    localforage.getItem("sist_db")
                    .then(function(db) {
                        //저장된 DB가 없으면 의사확인 후 업데이트 실시
                        if (!db) {
                            swal({
                                type:"warning",
                                title:"저장된 카드정보 없음",
                                text:"업데이트를 1회 실행해야 오프라인 모드를 이용할 수 있습니다.\n(약 1MB 데이터 소모)",
                                showCancelButton:true,
                                confirmButtonText: '업데이트',
                                cancelButtonText: '취소',
                                cancelButtonColor: '#d33',
                                showCloseButton:true
                            }).then(function(isConfirm){
                                if (!isConfirm) {
                                    //거부 시 불러오기 취소
                                    return false;
                                } else {
                                    session.offline = false;
                                    process_update_former();
                                }
                            })
                        //있으면 불러오기
                        } else {
                            //시작버튼 비활성화
                            $("#button_update").disabled = true;
                            $("#button_offline").disabled = true;
                            //불러온 정보 적용
                            session.db = deepCopy(db);
                            //카드정보 구축 시작
                            process_update_latter();
                        }
                    })
                    .catch(function(err) {
                        nativeToast({
                            message: '오류 발생: 저장된 카드 정보를 불러올 수 없습니다.',
                            position: 'center',
                            timeout: 2000,
                            type: 'error',
                            closeOnClick: 'true'
                        });

                        return false;
                    });
                }
            }

            //2차: 카드 정보 구축
            function process_update_latter() {
                //인덱스 정보 구축
                session.index = {};
                session.db.forEach(function(x,index) {
                    session.index[x.dbfid] = index;
                })
                //마스터 노드, 마스터 인포 생성
                session.masterNode = card_generateMaster();
                session.masterInfo = cardinfo_generateMaster();
                //Fragment 생성
                session.fragment = [];
                session.db.forEach(function(info, index) {
                    session.fragment[index] = card_generateFragment(info);
                })

                //화면 전환
                window_shift("titlescreen");
            }

            break;

        //*메인 창
        case "titlescreen":
            //공용 함수
            function process_titlescreen() {
                //진행정보 초기화
                process = {};
                //진행상태 표시, 기억
                process.state = "titlescreen";
                $("#header_status").innerHTML = "심플 스톤";
                //창 전환
                window_clear();
                $("#main_titlescreen").classList.add("show");
                $("#header_home").classList.add("show");

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
                    process_titlescreen();
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
                            process_titlescreen();
                        } else {
                            //취소
                            return;
                        }
                    })
                }
            } else {
                //화면 전환
                process_titlescreen();
            }

            break;

        //*덱 목록
        case "decklist":
            //진행상태 표시, 기억
            process.state = "decklist";
            $("#header_status").innerHTML = "덱 관리";
            //창 전환
            window_clear();
            $("#main_decklist").classList.add("show");
            $("#footer_decklist").classList.add("show");
            //덱 설정 초기화
            process.deck = {};
            process.deck.deckcode = "";
            //==================
            //※ 메인 버튼: 덱 목록
            //==================
            //최근 작업 덱
                //최근 작업 덱 파악
                localforage.getItem("sist_tempdeck")
                .then(function(tempdeck) {
                    //비어있으면
                    if (!tempdeck) {
                        //비었다고 표시
                        $("#decklist_temp").innerHTML = "최근 작업 덱 : 없음";
                        $("#decklist_temp").onclick = "";
                    //불러올 게 있으면
                    } else {
                        //덱 이름 표기
                        let name = tempdeck.name + " (" + DATA.CLASS.KR[tempdeck.class] + ", " + tempdeck.format + ")";
                        $("#decklist_temp").innerHTML = "최근 작업 덱 : <b>" + name + "</b>";
                        //클릭하면 불러오기
                        $("#decklist_temp").onclick = function() {
                            //의사 물어보기
                            let html = "";
                            html +=  "<b>" + tempdeck.name + "</b><br>";
                            html += "(" + DATA.CLASS.KR[tempdeck.class] + ", " + tempdeck.format + ")" + "<br>";
                            html += "완성도: " + tempdeck.quantity.toString() + " / " + DATA.DECK_LIMIT.toString() + "<br>";
                            html += "작업일시: " + tempdeck.date;
                            swal({
                                imageUrl:HEROURL + DATA.CLASS.ID[tempdeck.class] + ".jpg",
                                //imageHeight:88,
                                title:"최근 작업 덱을 불러옵니다.",
                                html:html,
                                showCancelButton:true,
                                confirmButtonText: '확인',
                                cancelButtonText: '취소',
                                cancelButtonColor: '#d33'
                            }).then(function(isConfirm){
                                if (isConfirm) {
                                    //덱 정보 적용
                                    process.deck = deepCopy(tempdeck);
                                    //로딩 개시
                                    window_shift("loading","deckbuilding");
                                } else {
                                    //취소
                                    return;
                                }
                            })
                        }
                    }

                })
            //==================
            //※ 상단 버튼: 덱 정렬
            //==================
            //==================
            //※ 하단 버튼: 덱코드 & 덱생성
            //==================
            //덱코드 입력
            $("#button_readcode").onclick = function() {
                //팝업창 열기
                swal({
                    title: '덱코드 입력',
                    input: 'text',
                    text: '덱코드를 분석하여 카드목록을 불러옵니다.',
                    inputPlaceholder: '입력란',
                    allowOutsideClick:false,
                    showCancelButton:true,
                    confirmButtonText: '덱코드 적용',
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33',
                    showCloseButton:true,
                    onOpen: function() {
                        if (process.deck.deckcode)
                            $(".swal2-input").value = process.deck.deckcode;
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
                                    //직업 세팅
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
                                reject('직업을 설정해주세요.');
                            } else if (!process.deck.format) {
                                reject('대전 방식을 설정해주세요.');
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
            //덱코드가 있다면 덱코드 해석
            if (process.deck !== undefined && process.deck.deckcode !== undefined && process.deck.deckcode !== "") {
                loading_deckcode();
            //없으면 덱 포맷 검증
            } else {
                loading_formatvalidate();
            }

            //덱코드 해석
            function loading_deckcode() {
                //덱코드 분석, 저장
                decoded = deckcode_decode(process.deck.deckcode);
                process.deck.cards = decoded.cards;
                process.deck.class = decoded.class;
                process.deck.format = decoded.format;

                //있으면 덱 포맷 검증
                loading_formatvalidate();
            }

            //불러올 덱 포맷 검증
            function loading_formatvalidate() {
                if (process.deck !== undefined && process.deck.cards !== undefined && process.deck.cards.length > 0) {
                    for (let i = 0;i < process.deck.cards.length;i++) {
                        if (DATA.SET.FORMAT[session.db[session.index[process.deck.cards[i][0]]].set] === "야생") {
                            process.deck.format = "야생";
                            break;
                        }
                    }
                }
                //Fragment 불러오기
                window_shift(keyword2);
            }

            break;

        //*카드 검색
        case "cardinfo":
            //상태 기억
            process.state = "cardinfo";
            $("#header_status").innerHTML = "카드 정보";
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
            $("#footer_collectionNdeck").classList.add("show");
            $("#footer_collectionNdeck_cardinfo").classList.add("show");

            //==================
            //※ 필터 구성
            //==================
            //검색 초기치 강제 설정, 필터 활성화
            process.deck = [];
                process.deck.class = undefined;
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
            clearAllEvent();//이전 등록된 이벤트 제거
            eventObj.collection_list_content.click = function(e) {
                e = e || event;
                let target = e.target || e.srcElement;
                if (target.classList.contains("card")) {
                    let info = session.db[session.index[target.dataset.dbfid]];
                    cardinfo_show("main_cardinfo",info);
                }
            }
            $("#collection_list_content").addEventListener("click",eventObj.collection_list_content.click);
            eventObj.collection_list_content.scroll = function(e) {
                e = e || event;
                e.preventDefault();
            }
            $("#collection_list_content").addEventListener("scroll",eventObj.collection_list_content.scroll);

            break;

        //*덱 제작
        case "deckbuilding":
            //상태 기억
            process.state = "deckbuilding";
            $("#header_status").innerHTML = "덱 편집기";
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
            $("#footer_collectionNdeck").classList.add("show");
            $("#footer_collectionNdeck_deckbuilding").classList.add("show");
            //로그 초기화
            if (process.log !== undefined)
                $("#undo_num").innerHTML = process.log.length;
            else
                $("#undo_num").innerHTML = "0";
            $("#undo_num").classList.remove("show");
            if (process.redo !== undefined)
                $("#redo_num").innerHTML = process.redo.length;
            else
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

            //덱 임시저장
            deck_tempsave();

            //==================
            //※ 카드정보 구성
            //==================
            //카드모니터 설치
            $("#frame_cardmonitor").classList.add("show");
            //카드정보 노드 설치
                cardinfo_setup("cardcover_top", false);
                cardinfo_setup("frame_cardmonitor", false);

            //==================
            //※ 카드정보 안내
            //==================
            $("#bottom_info").onclick = function() {
                swal({
                    type:"info",
                    title:"덱 편집기 사용방법",
                    html:"<h1>덱에 카드 추가/제거하기</h1>"+
                        "<p>카드 목록에서 카드를 클릭하세요.</p><br>"+
                        "<h1>카드정보 보기</h1>"+
                        "<p>카드 목록에서 카드를 우클릭 또는 " + parseFloat(AUTOINFOTIME/1000).toString() + "초간 터치하세요.</p><br>"+
                        "<h1>취소, 복귀 기능</h1>"+
                        "<p>'취소'를 누르면 이전에 추가/제거한 카드를 되돌립니다.</p>"+
                        "<p>'복귀'를 누르면 취소한 작업을 다시 실행합니다.</p>",
                    confirmButtonText:"확인"
                })
            }

            //==================
            //※ 상호작용
            //==================
            //카드 보기 상호작용
            let interact_target;

            //카드 목록 상호작용
            clearAllEvent();//이전 등록된 이벤트 제거
            eventObj.collection_list_content.mouseover = function(e) {
                interact_infoMonitor(e);
            }
            $("#collection_list_content").addEventListener("mouseover",eventObj.collection_list_content.mouseover);
            eventObj.collection_list_content.mousedown = function(e) {
                interact_infoCoverWait(e, true);
                return false;
            }
            $("#collection_list_content").addEventListener("mousedown",eventObj.collection_list_content.mousedown);
            eventObj.collection_list_content.mouseout = function(e) {
                interact_stopAuto(e);
                return false;
            }
            $("#collection_list_content").addEventListener("mouseout",eventObj.collection_list_content.mouseout);
            eventObj.collection_list_content.mouseup = function(e) {
                interact_addCard(e, true);
                return false;
            }
            $("#collection_list_content").addEventListener("mouseup",eventObj.collection_list_content.mouseup);
            eventObj.collection_list_content.contextmenu = function(e) {
                interact_infoCoverNow(e);
                e.preventDefault();
                return false;
            }
            $("#collection_list_content").addEventListener("contextmenu",eventObj.collection_list_content.contextmenu);
                //터치 기반
                eventObj.collection_list_content.touchstart = function(e) {
                    interact_infoCoverWait(e);
                }
                $("#collection_list_content").addEventListener("touchstart",eventObj.collection_list_content.touchstart);
                eventObj.collection_list_content.touchcancel = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
                $("#collection_list_content").addEventListener("touchcancel",eventObj.collection_list_content.touchcancel);
                eventObj.collection_list.scroll = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
                $("#collection_list").addEventListener("scroll",eventObj.collection_list.scroll);
                eventObj.collection_list_content.touchend = function(e) {
                    interact_addCard(e);
                    return false;
                }
                $("#collection_list_content").addEventListener("touchend",eventObj.collection_list_content.touchend);
            //덱 목록 상호작용
            eventObj.deck_list_content.mouseover = function(e) {
                interact_infoMonitor(e);
            }
            $("#deck_list_content").addEventListener("mouseover",eventObj.deck_list_content.mouseover);
            eventObj.deck_list_content.mousedown = function(e) {
                interact_infoCoverWait(e, true);
                return false;
            }
            $("#deck_list_content").addEventListener("mousedown",eventObj.deck_list_content.mousedown);
            eventObj.deck_list_content.mouseout = function(e) {
                interact_stopAuto(e);
                return false;
            }
            $("#deck_list_content").addEventListener("mouseout",eventObj.deck_list_content.mouseout);
            eventObj.deck_list_content.mouseup = function(e) {
                interact_removeCard(e, true);
                return false;
            }
            $("#deck_list_content").addEventListener("mouseup",eventObj.deck_list_content.mouseup);
            eventObj.deck_list_content.contextmenu = function(e) {
                interact_infoCoverNow(e);
                e.preventDefault();
                return false;
            }
            $("#deck_list_content").addEventListener("contextmenu",eventObj.deck_list_content.contextmenu);
                //터치 기반
                eventObj.deck_list_content.touchstart = function(e) {
                    interact_infoCoverWait(e);
                }
                $("#deck_list_content").addEventListener("touchstart",eventObj.deck_list_content.touchstart);
                eventObj.deck_list_content.touchcancel = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
                $("#deck_list_content").addEventListener("touchcancel",eventObj.deck_list_content.touchcancel);
                eventObj.deck_list.touchstart = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
                $("#deck_list").addEventListener("scroll",eventObj.deck_list.touchstart);
                eventObj.deck_list_content.touchend = function(e) {
                    interact_removeCard(e);
                    return false;
                }
                $("#deck_list_content").addEventListener("touchend",eventObj.deck_list_content.touchend);
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
            $("#header_status").innerHTML = "덱 설정";
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

            //덱 임시저장
            deck_tempsave();
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
                        //덱이름 기억
                        process.deck.name = name;
                        $("#deck_name").innerHTML = process.deck.name;

                        //덱 임시저장
                        deck_tempsave();
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
                //사용불가 카드가 있다면 경고
                } else if (process.deck.unusable > 0) {
                    nativeToast({
                        message: '대전 방식과 맞지 않는 카드가 있습니다.',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                //아니라면 덱코드 출력
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
                //사용불가 카드가 있다면 경고
                } else if (process.deck.unusable > 0) {
                    nativeToast({
                        message: '대전 방식과 맞지 않는 카드가 있습니다.',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                //아니라면 덱설명 출력
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
                $("#button_format").innerHTML = "\"야생\"으로<br>전환";
            } else {
                $("#button_format").innerHTML = "\"정규\"로<br>전환";
            }
            $("#button_format").onclick = function() {
                if (process.deck.format === "정규") {
                    //덱 포맷 전환
                    process.deck.format = "야생";
                    deck_refresh("init");
                    //버튼 문구 변경
                    $("#button_format").innerHTML = "\"정규\"로<br>전환";
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
                    deck_refresh("init");
                    //버튼 문구 변경
                    $("#button_format").innerHTML = "\"야생\"으로<br>전환";
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

            //이벤트 등록
            clearAllEvent();//이전 등록된 이벤트 제거
            eventObj.deck_list_content.mouseover = function(e) {
                interact_infoMonitor(e);
            }
            $("#deck_list_content").addEventListener("mouseover",eventObj.deck_list_content.mouseover);
            eventObj.deck_list_content.mousedown = function(e) {
                interact_infoCoverWait(e, true);
                return false;
            }
            $("#deck_list_content").addEventListener("mousedown",eventObj.deck_list_content.mousedown);
            eventObj.deck_list_content.mouseout = function(e) {
                interact_stopAuto(e);
                return false;
            }
            $("#deck_list_content").addEventListener("mouseout",eventObj.deck_list_content.mouseout);
            eventObj.deck_list_content.mouseup = function(e) {
                interact_removeCard(e, true);
                return false;
            }
            $("#deck_list_content").addEventListener("mouseup",eventObj.deck_list_content.mouseup);
            eventObj.deck_list_content.contextmenu = function(e) {
                interact_infoCoverNow(e);
                e.preventDefault();
                return false;
            }
            $("#deck_list_content").addEventListener("contextmenu",eventObj.deck_list_content.contextmenu);
                //터치 기반
                eventObj.deck_list_content.touchstart = function(e) {
                    interact_infoCoverWait(e);
                }
                $("#deck_list_content").addEventListener("touchstart",eventObj.deck_list_content.touchstart);
                eventObj.deck_list_content.touchcancel = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
                $("#deck_list_content").addEventListener("touchcancel",eventObj.deck_list_content.touchcancel);
                eventObj.deck_list.touchstart = function(e) {
                    interact_stopAuto(e);
                    return false;
                }
                $("#deck_list").addEventListener("scroll",eventObj.deck_list.touchstart);
                eventObj.deck_list_content.touchend = function(e) {
                    interact_removeCard(e);
                    return false;
                }
                $("#deck_list_content").addEventListener("touchend",eventObj.deck_list_content.touchend);
            //카드 정보창 닫기
            $("#frame_cardcover").onclick = function() {
                $("#frame_cardcover").classList.remove("show");
            }
    }
}

//상호작용 함수 모음
let clearAllEvent = function() {
    Object.keys(eventObj).map(function(key1, index) {
        let value1 = eventObj[key1];
        Object.keys(value1).map(function(key2, index) {
            let value2 = value1[key2];
            $("#" + key1).removeEventListener(key2,value2);
        });
    });
}
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
        card_move("add " + target.dataset.dbfid, true);
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
        card_move("remove " + target.dataset.dbfid, true);
        e.preventDefault();
    }
}
let interact_infoMonitor = function(e) {
    e = e || event;
    let target = e.target || e.srcElement;
    if (target.classList.contains("card")) {
        let info = session.db[session.index[target.dataset.dbfid]];
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
        let info = session.db[session.index[target.dataset.dbfid]];
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
            let info = session.db[session.index[target.dataset.dbfid]];
            $("#frame_cardcover").classList.add("show");
            cardinfo_setScale($(".cardinfo.wrapper",$("#frame_cardcover")), false);
            cardinfo_show("cardcover_top",info);
            //창이 뜨면 상호작용 대상 비우기
            interact_target = "";
            e.preventDefault();
        },AUTOINFOTIME);
    }
}
let interact_stopAuto = function(e) {
    //카드 정보 auto 제거
    clearTimeout(autoInfo);
    //상호작용 대상 비우기
    interact_target = "";
}
