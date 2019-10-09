
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
    $$(".mobilescreen").forEach(function(target) {
        target.classList.remove("show");
    })
    $$(".footer_desc").forEach(function(target) {
        target.classList.remove("show");
    })
    $$(".extrascreen").forEach(function(target) {
        target.classList.remove("show");
    })
}
//뒤로 가기 버튼 - 메뉴마다 별도로 설정
function window_goback() {};

//개별 창 설정
async function window_shift(keyword, keyword2, keyword3) {
    switch(keyword) {
        //===========================================================
        //※ 공지사항 창
        //===========================================================
        case "notice":
            //창 전환
            window_clear();
            $("#main_notice").classList.add("show");
            $("#header_notice").classList.add("show");
            $("#footer_notice").classList.add("show");

            //공지사항 출력
            let notice = keyword2.notice;
            let noticeFrag = document.createDocumentFragment();
            for (let i = 0;i < Math.min(30,notice.length);i++) {//공지는 최대 30개만
                let each = notice[i];
                //날짜
                let date = document.createElement("p[date]");
                    date.innerHTML = each.date;
                noticeFrag.appendChild(date);
                //내용
                if (typeof each.content === "string") {
                    let content = document.createElement("p.last[content]");
                        content.innerHTML = "- " + each.content;
                    noticeFrag.appendChild(content);
                } else {
                    each.content.forEach(function(p, index) {
                        let paragraph = document.createElement("p[content]");
                        if (index == each.content.length - 1)
                            paragraph.classList.add("last");
                        paragraph.innerHTML = "- " + p;
                        noticeFrag.appendChild(paragraph);
                    })
                }
            }
            $("#notice_content").appendChild(noticeFrag);

            //상호작용
            $("#button_start").onclick = function() {
                //오프라인 모드 비활성화
                session.offline = false;
                //업데이트 확인
                window_shift("update", keyword2);
            }
            $("#button_offline").onclick = function() {
                //오프라인 모드 의사 물어보기
                swal({
                    type:"info",
                    title:"데이터 절약 모드",
                    text:"카드 이미지를 불러오지 않아 데이터를 절약할 수 있습니다.",
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
                        //오프라인 모드 활성화
                        session.offline = true;
                        //업데이트 확인
                        window_shift("update", keyword2);
                    }
                })
            }

            break;

        //===========================================================
        //※ 업데이트 창
        //===========================================================
        case "update":
            //최신 DB 버전 확인
            let dbinfo = keyword2.dbinfo;
            //저장된 DB 버전 확인
            localforage.getItem("sist_db_version")
            .then(function(version) {
                //DB 버전이 없거나 불일치 : 업데이트 실시
                if (!version || version !== dbinfo.version) {
                    process_update_window()
                //DB 버전 일치 : 저장된 DB 불러오기
                } else {
                    process_load()
                }
            }).catch(function() {
                //DB 버전 확인 불가 : 업데이트 실시
                process_update_window()
            })

            function process_update_window() {
                //창 전환
                window_clear();
                $("#main_update").classList.add("show");
                $("#footer_update").classList.add("show");

                //업데이트 창 작성
                let updateFrag = document.createDocumentFragment();
                //버전
                let ver = document.createElement("p");
                    ver.innerHTML = 'DB 버전 : ' + dbinfo.version;
                updateFrag.appendChild(ver);
                //날짜
                let date = document.createElement("p");
                    date.innerHTML = 'DB 업데이트 일시 : ' + dbinfo.date;
                updateFrag.appendChild(date);
                //내용
                let desc = document.createElement("p");
                    desc.innerHTML = '업데이트 내용 : ' + dbinfo.description;
                updateFrag.appendChild(desc);
                $("#update_content").appendChild(updateFrag);

                //(1초 후) 업데이트 실시
                setTimeout(function() {
                    process_update();
                }, 500);
            }
            //1-1차 / DB버전 불일치 : DB 업데이트
            function process_update() {
                //카드 정보 불러오기
                fetch("./js/cards.collectible.json")
                .then(function(response) {
                    return response.json();
                })
                .catch(function(e) {
                    nativeToast({
                        message: '카드 정보를 불러올 수 없습니다. 제작자에게 문의해주세요.<br>(https://blog.naver.com/ansewo/221319675157)<br>('+e+')',
                        position: 'center',
                        timeout: 3000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                })
                .then(function(myJson) {
                    //카드정보 입력
                    session.db = myJson;
                    //카드정보 정렬
                    sort_arr(session.db);
                    //카드정보 정제
                    session.db.forEach(function(x, index) {
                        //dbfId대문자 제거 및 문자열로 변환
                        x.dbfid = x.dbfId.toString();
                        //collectionText가 있는 카드들은 텍스트 대체
                        if (x.collectionText !== undefined) {
                            x.text = x.collectionText;
                        }
                        //이벤트 세트일 경우 이름 앞에 "*" 표시
                        if (DATA.SET[x.set] !== undefined && DATA.SET[x.set].EVENT === true) {
                            x.name = "*" + x.name + "*";
                        }
                        //검색용 키워드 입력
                        x.keywords = {};
                        let wordbook = x.keywords;
                        let list = ["name","text","race","type"];
                        for (let i = 0;i<list.length;i++) {
                            if (x[list[i]]) wordbook[list[i]] = searchable(x[list[i]]);
                        }
                    })

                    //DB 저장
                    localforage.setItem("sist_db",session.db)
                    .then(function() {
                        //DB 버전 저장
                        localforage.setItem("sist_db_version",dbinfo.version)
                        .then(function() {
                            //카드정보 구축 시작
                            process_update_finish();
                        }).catch(function() {
                            //버전 저장 못해도 '아무튼' 구축 시작
                            process_update_finish();
                        })
                    }).catch(function() {
                        //DB 저장 못해도 '아무튼' 구축 시작
                        process_update_finish();
                    });
                })
                .catch(function(e) {
                    nativeToast({
                        message: '카드 정보를 처리할 수 없습니다. 제작자에게 문의해주세요.<br>(https://blog.naver.com/ansewo/221319675157)<br>('+e+')',
                        position: 'center',
                        timeout: 3000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                })
            }

            //1-2차 / DB버전 일치 : 저장된 DB 불러오기
            function process_load() {
                //DB 불러오기
                localforage.getItem("sist_db")
                .then(function(db) {
                    //불러온 정보 적용
                    session.db = deepCopy(db);
                    //카드정보 구축 시작
                    process_update_finish();
                })
                .catch(function(err) {
                    //불러올 수 없다고 알리기
                    nativeToast({
                        message: '저장된 카드 정보를 불러올 수 없습니다. DB 업데이트를 실시합니다.',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                    //강제 업데이트
                    process_update_window()

                    return false;
                });
            }

            //2차: 카드 정보 구축
            function process_update_finish() {
                //인덱스 정보 구축
                session.index = {};
                session.db.forEach(function(x,index) {
                    session.index[x.dbfid] = index;
                })
                //마스터 노드, 마스터 인포, 마스터 슬롯, 마스터 메타덱 생성
                session.masterNode = card_generateMaster();
                session.masterInfo = cardinfo_generateMaster();
                session.masterSlot = deckslot_generateMaster();
                session.masterMetaSlot = metadeckslot_generateMaster();
                //카드 Fragment 생성
                session.fragment = [];
                session.db.forEach(function(info, index) {
                    session.fragment[index] = card_generateFragment(info);
                })

                //URL 패러미터에 덱코드가 있으면
                if (Object.keys(session.urlParams).length > 0 && session.urlParams.deckcode !== undefined) {
                    try {
                        //덱코드 해석
                        let deckcode = decodeURIComponent(session.urlParams.deckcode);
                        let test = deckstrings.decode(deckcode);
                        //덱코드 기억
                        process.deck = {};
                        process.deck.deckcode = deckcode;
                        //덱코드 인식했다고 알리기
                        nativeToast({
                            message: 'URL에서 덱코드가 인식되었습니다.',
                            position: 'center',
                            timeout: 2000,
                            type: 'success',
                            closeOnClick: 'true'
                        });
                        //덱 공개
                        window_shift("loading","deckconfig");
                    } catch(e) {
                        console.log(e);
                        //불러올 수 없다고 알리기
                        nativeToast({
                            message: 'URL에 포함된 덱코드가 올바르지 않습니다.',
                            position: 'center',
                            timeout: 2000,
                            type: 'error',
                            closeOnClick: 'true'
                        });
                        window_shift("titlescreen");
                    }
                //없으면 : 화면 전환
                } else {
                    window_shift("titlescreen");
                }
            }

            break;

        //===========================================================
        //※ 메인화면 창
        //===========================================================
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
                $("#header_back").classList.remove("show");
                    //모바일 한정 - 히스토리 뒤로 가기 시 종료여부 결정
                    window.onpopstate = () => {
                        if (blockBack > 0) {
                            if (swal.isVisible()) {
                                swal.close();
                                window.history.pushState({ noBackExitsApp: true }, 'DEF');
                            } else {
                                nativeToast({
                                    message: '심플스톤을 종료하려면 뒤로 버튼을 한 번 더 눌려주세요.',
                                    position: 'center',
                                    timeout: 2000,
                                    type: 'close',
                                    closeOnClick: 'true'
                                });
                                clearTimeout(autoPopstate);
                                autoPopstate = setTimeout(() => {
                                    window.history.pushState({ noBackExitsApp: true }, 'DEF')
                                },2000);
                            }
                        }
                    }
                //이용 정보 표시안함
                $("#header_info").classList.remove("show");
                $("#header_sort").classList.remove("show");

                //최신 확장팩 문구 표기
                $("#titlescreen_latest_name").innerHTML = DATA.SET[DATA.SET_LATEST].KR;

                //시작 버튼
                $("#start_card").onclick = function() {
                    window_shift("loading","cardinfo");
                }
                $("#start_deck").onclick = function() {
                    window_shift("decklist");
                }
                $("#start_metadeck").onclick = function() {
                    window_shift("metadeck");
                }
                $("#start_information").onclick = function() {
                    swal({
                        title:"심플스톤",
                        imageUrl:"./images/logo.png",
                        imageHeight:88,
                        html:'<b>제작자</b>: 솔라리어스<br>'+
                            '<b>의견 남기기</b>: ansewo@naver.com,<br>'+
                            '<a href="https://blog.naver.com/ansewo/221319675157" target="_blank">https://blog.naver.com/ansewo/221319675157</a><br><br>'+
                            '<b>카드정보 & 카드이미지 출처</b>: <a href="https://hearthstonejson.com/" target="_blank">HearthstoneJSON</a><br>'+
                            '<b>각종 아이콘 출처</b>: <a href="https://ko.icons8.com/icon" target="_blank">https://ko.icons8.com/icon</a><br><br>'+
                            '<b>로고 아이콘 정보</b><br>'+
                            '<div>Icons made by <a href="http://www.freepik.com" target="_blank" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div><br>'+
                            '<b>폰트 정보</b><br>'+
                            '<div>Spoqa Han Sans<br>'
                    })
                }
            }

            //진행정보 초기화 의사 물어보기
            if (process.state && process.state !== "titlescreen") {
                if (keyword2 === "always") {
                    //강제 화면 전환
                    process_titlescreen();
                } else {
                    //덱 (있으면)
                    if (process.deck) {
                        if (process.deck.class && process.deck.format) {
                            //덱 저장 후 화면전환
                            deck_save().then(() => {
                                process_titlescreen();
                            });
                        } else {
                            //없으면 그냥 화면전환
                            process_titlescreen();
                        }
                    } else {
                        //없으면 그냥 화면전환
                        process_titlescreen();
                    }
                }
            } else {
                //화면 전환
                process_titlescreen();
            }

            break;

        //===========================================================
        //※ 덱목록 창
        //===========================================================
        case "decklist":
            //진행상태 표시, 기억
            process.state = "decklist";
                process.prestate = undefined;
            $("#header_status").innerHTML = "덱 목록";
            //창 전환
            window_clear();
            $("#main_decklist").classList.add("show");
            $("#footer_decklist").classList.add("show");
            //뒤로 버튼
            $("#header_back").classList.add("show");
                window_goback = () => {
                    window_shift("titlescreen");
                }
                $("#header_back").onclick = window_goback;
                //모바일 한정 - 히스토리 뒤로 가기 시에도 작동
                window.onpopstate = () => {
                    if (blockBack > 0) {
                        if (swal.isVisible()) swal.close();
                            else window_goback();
                        window.history.pushState({ noBackExitsApp: true }, 'DEF');
                    }
                }
            //이용 정보 표시안함
            $("#header_info").classList.remove("show");
            $("#header_sort").classList.remove("show");

            //덱 설정 초기화
            process.deck = {};
            process.deck.deckcode = "";
            //==================
            //※ 메인 버튼: 덱 목록
            //==================
            //최근 작업 덱
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
                    let name = tempdeck.name + "<br>(" + DATA.CLASS.KR[tempdeck.class] + ", " + tempdeck.format + ")";
                    $("#decklist_temp").innerHTML = "최근 작업 덱 : <b>" + name + "</b>";
                    //클릭하면 불러오기
                    $("#decklist_temp").onclick = function() {
                        //덱 정보 적용
                        process.deck = deepCopy(tempdeck);
                        //로딩 개시
                        window_shift("loading","deckconfig");
                    }
                }

            })
            //==================
            //※ 저장된 덱 목록 불러오기, 클릭
            //==================
            deckslot_refresh();

            $("#decklist_slot").onclick = function(e) {
                e = e || event;
                let target = e.target || e.srcElement;
                //덱 편집
                if (target.classList.contains("slot_button_main")) {
                    localforage.getItem("sist_decks")
                    .then(function(decks) {
                        process.deck = deepCopy(decks[target.dataset.id]);
                        window_shift("loading","deckconfig");
                    })
                    .catch(function() {
                        console.log("덱 불러오기 실패!");
                    })
                }
                //덱 삭제
                if (target.classList.contains("slot_button_delete")) {
                    let number = target.dataset.number;
                    //경고창
                    swal({
                        imageUrl:"./images/icon_delete.png",
                        imageHeight:88,
                        title: number + "번 덱을 삭제하시겠습니까?",
                        text:"저정된 덱 정보가 사라집니다.",
                        showCancelButton:true,
                        confirmButtonColor: '#d33',
                        confirmButtonText: '삭제',
                        cancelButtonText: '취소'
                    }).then(function(result) {
                        if (result) {
                            //덱 삭제
                            deck_favorite("off", target.dataset.id)
                            .then(function() {
                                //안내문구
                                nativeToast({
                                    message: '덱 삭제 완료',
                                    position: 'center',
                                    timeout: 2000,
                                    type: 'success',
                                    closeOnClick: 'true'
                                });
                                //덱 목록 다시 불러오기에
                                deckslot_refresh();
                            })
                        }
                    })
                }
            }
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
                    input: 'textarea',
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
                            $(".swal2-textarea").value = process.deck.deckcode;
                        $(".swal2-textarea").select();
                    },
                    inputValidator: function(deckcode) {
                        return new Promise(function(resolve, reject) {
                            try {
                                let codelist = deckcode.split("\n");
                                let code = "";
                                codelist.forEach(function(line) {
                                    if (line.startsWith("###")) {
                                        //지금은 아무것도 하지 않음
                                    } else if (line.startsWith("#")) {
                                        //아무것도 하지 않음
                                    } else {
                                        code = line;
                                    }
                                })
                                resolve(deckstrings.decode(code));
                            } catch(e) {
                                reject("올바르지 않은 덱코드입니다.");
                            }
                        })
                    }
                }).then(function(deckcode) {
                    if (deckcode) {
                        //덱코드 기억
                        process.deck.deckcode = deckcode;
                        //덱 사전 등록
                        deck_favorite("on")
                        .then(() => {
                            //다음 진행
                            window_shift("loading","deckconfig")
                        });
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
                        //덱 사전 등록
                        deck_favorite("on")
                        .then(() => {
                            //다음 진행
                            window_shift("loading","deckbuilding");
                        });
                    }
                })
            }

            break;

        //===========================================================
        //※ 카드정보 불러오기
        //===========================================================
        case "loading":
            //덱코드가 있다면 덱코드 해석
            if (process.deck !== undefined && process.deck.deckcode !== undefined && process.deck.deckcode !== "") {
                loading_deckcode();
            //없으면 덱 검증
            } else {
                loading_deckvalidate();
            }

            //덱코드 해석
            function loading_deckcode() {
                //덱코드 분석, 저장
                let codelist = process.deck.deckcode.split("\n");
                let code = "";
                codelist.forEach(function(line) {
                    if (line.startsWith("###")) {
                        process.deck.name = line.replace("###","").trim();
                    } else if (line.startsWith("#")) {
                        //아무것도 하지 않음
                    } else {
                        code = line;
                    }
                })
                decoded = deckcode_decode(code);
                process.deck.cards = decoded.cards;
                process.deck.class = decoded.class;
                //기존 포맷 정보가 없으면 덱코드에서 해석한 걸 사용
                if (!process.deck.format) {
                    process.deck.format = decoded.format;
                }

                //저장된 덱코드 제거(향후 덱코드 동기화 방지)
                delete process.deck.deckcode;

                //있으면 덱 검증
                loading_deckvalidate();
            }

            //불러올 덱 포맷 검증
            function loading_deckvalidate() {
                //덱이 있으면 검증
                if (process.deck) {
                    //포맷 검증
                    if (process.deck !== undefined && process.deck.cards !== undefined && process.deck.cards.length > 0) {
                        let standard = isStandard(process.deck.cards);
                        if (!standard) {
                            process.deck.format = "야생";
                        }
                    }
                }

                //Fragment 불러오기
                window_shift(keyword2, keyword3);
            }

            break;

        //===========================================================
        //※ 카드검색 창
        //===========================================================
        case "cardinfo":
            //상태 기억
            process.state = "cardinfo";
            //제목 표시
            $("#header_status").innerHTML = "카드 정보";
            //==================
            //※ 화면 구성
            //==================
            //화면 출력
            window_clear();
            $("#header_search").classList.add("show");
            $("#main_collection").classList.add("show","below_footer");
                $("#main_collection").classList.remove("below_chart","below_none");
            $("#main_cardinfo").classList.add("show","below_footer");
                $("#main_cardinfo").classList.remove("below_chart","below_none");

            $("#footer_cardinfo").classList.add("show");
            //뒤로 버튼
            $("#header_back").classList.add("show");
                window_goback = () => {
                    window_shift("titlescreen");
                }
                $("#header_back").onclick = window_goback;
                //모바일 한정 - 히스토리 뒤로 가기 시에도 작동
                window.onpopstate = () => {
                    if (blockBack > 0) {
                        if (swal.isVisible()) swal.close();
                            else window_goback();
                        window.history.pushState({ noBackExitsApp: true }, 'DEF');
                    }
                }
            //이용 정보 표시안함
            $("#header_info").classList.remove("show");
            $("#header_sort").classList.remove("show");

            //==================
            //※ 필터 구성
            //==================
            //검색 초기치 강제 설정, 필터 활성화
            if (!process.deck) process.deck = {};
                process.deck.class = undefined;
                process.deck.format = "야생";
            //필터 활성화
            card_setFilter("init");

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
                }}
                    $("#collection_list_content").addEventListener("click",eventObj.collection_list_content.click);
            eventObj.collection_list_content.scroll = function(e) {
                e = e || event;
                e.preventDefault();}
                    $("#collection_list_content").addEventListener("scroll",eventObj.collection_list_content.scroll);

            break;

        //===========================================================
        //※ 덱 제작 창
        //===========================================================
        case "deckbuilding":
            //상태 기억
            process.state = "deckbuilding";
            //제목 표시
            $("#header_status").innerHTML = "덱 편집기";
            //==================
            //※ 화면 구성
            //==================
            //화면 출력
            window_clear();
            $("#header_search").classList.add("show");
            $("#main_collection").classList.add("show");
            $("#main_deck").classList.add("show");
            $("#footer_deckbuilding").classList.add("show");
            $("#main_deckchart").classList.add("show");

            //뒤로 버튼
            $("#header_back").classList.add("show");
                window_goback = () => {
                    //로그 삭제
                    process.log = undefined;
                    process.redo = undefined;
                    //뒤로가기 전 덱 저장
                    deck_save().then(() => {
                        if (process.prestate) {
                            window_shift(process.prestate);
                        } else {
                            window_shift("decklist");
                        }
                    })
                }
                $("#header_back").onclick = window_goback;
                //모바일 한정 - 히스토리 뒤로 갈 시에도 작동
                window.onpopstate = () => {
                    if (blockBack > 0) {
                        if (swal.isVisible()) swal.close();
                            else window_goback();
                        window.history.pushState({ noBackExitsApp: true }, 'DEF');
                    }
                }
            //이용 정보 표시
            $("#header_info").classList.add("show");
            $("#header_sort").classList.remove("show");

            //차트 준비
            setChart("init");
            $("#deckbuilding_chart").onclick = function() {
                setChart("toggle");
            }
            //덱 차트 모니터 설치
            $("#frame_deckchartmonitor").classList.add("show");

            //==================
            //※ 카드정보 안내
            //==================
            $("#header_info").onclick = function() {
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

            //로그 초기화
            if (process.log !== undefined)
                $("#undo_num").innerHTML = process.log.length;
            else {
                $("#undo_num").innerHTML = "0";
                $("#deckbuilding_undo").classList.add("disabled");
            }
            if (process.redo !== undefined)
                $("#redo_num").innerHTML = process.redo.length;
            else {
                $("#redo_num").innerHTML = "0";
                $("#deckbuilding_redo").classList.add("disabled");
            }

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
            await deck_save();

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
            clearAllEvent();//이전 등록된 이벤트 제거
            eventObj.collection_list_content.mouseover = function(e) {
                interact_infoMonitor(e);}
                    $("#collection_list_content").addEventListener("mouseover",eventObj.collection_list_content.mouseover);
            eventObj.collection_list_content.mousedown = function(e) {
                interact_infoCoverWait(e, true);
                return false;}
                    $("#collection_list_content").addEventListener("mousedown",eventObj.collection_list_content.mousedown);
            eventObj.collection_list_content.mouseout = function(e) {
                interact_stopAuto(e);
                return false;}
                    $("#collection_list_content").addEventListener("mouseout",eventObj.collection_list_content.mouseout);
            eventObj.collection_list_content.mouseup = function(e) {
                interact_addCard(e, true);
                return false;}
                    $("#collection_list_content").addEventListener("mouseup",eventObj.collection_list_content.mouseup);
            eventObj.collection_list_content.contextmenu = function(e) {
                interact_infoCoverNow(e);
                e.preventDefault();
                return false;}
                    $("#collection_list_content").addEventListener("contextmenu",eventObj.collection_list_content.contextmenu);
                //터치 기반
                eventObj.collection_list_content.touchstart = function(e) {
                    interact_infoCoverWait(e);}
                        $("#collection_list_content").addEventListener("touchstart",eventObj.collection_list_content.touchstart);
                eventObj.collection_list_content.touchcancel = function(e) {
                    interact_stopAuto(e);
                    return false;}
                        $("#collection_list_content").addEventListener("touchcancel",eventObj.collection_list_content.touchcancel);
                eventObj.collection_list_content.touchmove = function(e) {
                    interact_stopAuto(e);
                    return false;}
                        $("#collection_list_content").addEventListener("touchmove",eventObj.collection_list_content.touchmove);
                eventObj.collection_list.scroll = function(e) {
                    interact_stopAuto(e);
                    return false;}
                        $("#collection_list").addEventListener("scroll",eventObj.collection_list.scroll);
                eventObj.collection_list_content.touchend = function(e) {
                    interact_addCard(e);
                    return false;}
                        $("#collection_list_content").addEventListener("touchend",eventObj.collection_list_content.touchend);
            //덱 목록 상호작용
            eventObj.deck_list_content.mouseover = function(e) {
                interact_infoMonitor(e);}
                    $("#deck_list_content").addEventListener("mouseover",eventObj.deck_list_content.mouseover);
            eventObj.deck_list_content.mousedown = function(e) {
                interact_infoCoverWait(e, true);
                return false;}
                    $("#deck_list_content").addEventListener("mousedown",eventObj.deck_list_content.mousedown);
            eventObj.deck_list_content.mouseout = function(e) {
                interact_stopAuto(e);
                return false;}
                    $("#deck_list_content").addEventListener("mouseout",eventObj.deck_list_content.mouseout);
            eventObj.deck_list_content.mouseup = function(e) {
                interact_removeCard(e, true);
                return false;}
                    $("#deck_list_content").addEventListener("mouseup",eventObj.deck_list_content.mouseup);
            eventObj.deck_list_content.contextmenu = function(e) {
                interact_infoCoverNow(e);
                e.preventDefault();
                return false;}
                    $("#deck_list_content").addEventListener("contextmenu",eventObj.deck_list_content.contextmenu);
                //터치 기반
                eventObj.deck_list_content.touchstart = function(e) {
                    interact_infoCoverWait(e);}
                        $("#deck_list_content").addEventListener("touchstart",eventObj.deck_list_content.touchstart);
                eventObj.deck_list_content.touchcancel = function(e) {
                    interact_stopAuto(e);
                    return false;}
                        $("#deck_list_content").addEventListener("touchcancel",eventObj.deck_list_content.touchcancel);
                eventObj.deck_list_content.touchmove = function(e) {
                    interact_stopAuto(e);
                    return false;}
                        $("#deck_list_content").addEventListener("touchmove",eventObj.deck_list_content.touchmove);
                eventObj.deck_list.scroll = function(e) {
                    interact_stopAuto(e);
                    return false;}
                        $("#deck_list").addEventListener("scroll",eventObj.deck_list.scroll);
                eventObj.deck_list_content.touchend = function(e) {
                    interact_removeCard(e);
                    return false;}
                        $("#deck_list_content").addEventListener("touchend",eventObj.deck_list_content.touchend);
                //카드 정보창 닫기
                $("#frame_cardcover").onclick = function() {
                    $("#frame_cardcover").classList.remove("show");
                }

            //덱 완료
            $("#deckbuilding_done").onclick = function() {
                //다음 진행
                window_shift("deckconfig")
                //저장은 deckconfig 진입하면서 실시
            }

            break;

        //===========================================================
        //※ 덱 목록 창
        //===========================================================
        case "deckconfig":
            //상태 기억
            process.state = "deckconfig";
            $("#header_status").innerHTML = "덱 정보";
                //이전 상태 기억
                if (keyword2 !== undefined) process.prestate = keyword2;
            //==================
            //※ 화면 구성
            //==================
            //화면 출력
            window_clear();
            $("#header_deckconfig").classList.add("show");
            $("#main_deckconfig").classList.add("show");
            $("#main_deck").classList.add("show");
            $("#footer_deckconfig").classList.add("show");
            //뒤로 버튼
            $("#header_back").classList.add("show");
                window_goback = () => {
                    //로그 삭제
                    process.log = undefined;
                    process.redo = undefined;
                    if (process.prestate) {
                        window_shift(process.prestate);
                    } else {
                        window_shift("decklist");
                    }
                }
                $("#header_back").onclick = window_goback;
                //모바일 한정 - 히스토리 뒤로 가기 시에도 작동
                window.onpopstate = () => {
                    if (blockBack > 0) {
                        if (swal.isVisible()) swal.close();
                            else window_goback();
                        window.history.pushState({ noBackExitsApp: true }, 'DEF');
                    }
                }
            //이용 정보 표시안함
            $("#header_info").classList.remove("show");
            $("#header_sort").classList.remove("show");

            //차트 준비
            setChart("init");
            $("#deckconfig_chart").onclick = function() {
                setChart("toggle");
            }
            //덱 차트 모니터 설치
            $("#frame_deckchartmonitor").classList.add("show");

            //==================
            //※ 덱 구성
            //==================
            //덱 초기화
            deck_refresh("init");

            //덱 임시저장
            await deck_save();
            //==================
            //※ 주 버튼
            //==================
            //덱 저장
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
                }).then(async function(name) {
                    if (name) {
                        //덱이름 기억
                        process.deck.name = name;
                        $("#deck_name").innerHTML = process.deck.name;

                        //덱 임시저장
                        await deck_save();
                    }
                })
            }
            //덱코드 출력
            $("#deckconfig_deckstring").onclick = function() {
                //사용불가 카드가 있다면 경고
                if (process.deck.unusable > 0) {
                    nativeToast({
                        message: '대전 방식과 맞지 않는 카드가 있습니다.',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                //미완성 시 경고창(허용 시 출력)
                } else if (process.deck.quantity < DATA.DECK_LIMIT) {
                    swal({
                        type:"warning",
                        title:"덱이 " + DATA.DECK_LIMIT.toString() + "장을 채우지 못했습니다.",
                        text:"정말로 덱코드를 출력하시겠습니까?",
                        showCancelButton:true,
                        confirmButtonText: '확인',
                        cancelButtonText: '취소'
                    }).then(function(result) {
                        if (result) {
                            export_deckcode();//덱코드 출력
                        }
                    })
                //아니면 출력
                } else {
                    export_deckcode();//덱코드 출력
                }
            }
            //텍스트 출력
            $("#deckconfig_text").onclick = function() {
                //사용불가 카드가 있다면 경고
                if (process.deck.unusable > 0) {
                    nativeToast({
                        message: '대전 방식과 맞지 않는 카드가 있습니다.',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                //미완성 시 경고창
                } else if (process.deck.quantity < DATA.DECK_LIMIT) {
                    swal({
                        type:"warning",
                        title:"덱이 " + DATA.DECK_LIMIT.toString() + "장을 채우지 못했습니다.",
                        text:"정말로 텍스트를 출력하시겠습니까?",
                        showCancelButton:true,
                        confirmButtonText: '확인',
                        cancelButtonText: '취소'
                    }).then(function(result) {
                        if (result) {
                            export_text();//텍스트 출력
                        }
                    })
                } else {
                    export_text();//텍스트 출력
                }
            }
            //HTML 태그 출력
            $("#deckconfig_tag").onclick = function() {
                //사용불가 카드가 있다면 경고
                if (process.deck.unusable > 0) {
                    nativeToast({
                        message: '대전 방식과 맞지 않는 카드가 있습니다.',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                //미완성 시 경고창
                } else if (process.deck.quantity < DATA.DECK_LIMIT) {
                    swal({
                        type:"warning",
                        title:"덱이 " + DATA.DECK_LIMIT.toString() + "장을 채우지 못했습니다.",
                        text:"정말로 HTML 태그를 출력하시겠습니까?",
                        showCancelButton:true,
                        confirmButtonText: '확인',
                        cancelButtonText: '취소'
                    }).then(function(result) {
                        if (result) {
                            export_tag();//텍스트 출력
                        }
                    })
                } else {
                    export_tag();//텍스트 출력
                }
            }
            //이미지 출력
            $("#deckconfig_image").onclick = function() {
                //사용불가 카드가 있다면 경고
                if (process.deck.unusable > 0) {
                    nativeToast({
                        message: '대전 방식과 맞지 않는 카드가 있습니다.',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                //미완성 시 경고창
                } else if (process.deck.quantity < DATA.DECK_LIMIT) {
                    swal({
                        type:"warning",
                        title:"덱이 " + DATA.DECK_LIMIT.toString() + "장을 채우지 못했습니다.",
                        text:"정말로 이미지를 출력하시겠습니까?",
                        showCancelButton:true,
                        confirmButtonText: '확인',
                        cancelButtonText: '취소'
                    }).then(function(result) {
                        if (result) {
                            export_image();//이미지 출력
                        }
                    })
                } else {
                    export_image();//이미지 출력
                }
            }
            //URL 출력
            $("#deckconfig_url").onclick = function() {
                //사용불가 카드가 있다면 경고
                if (process.deck.unusable > 0) {
                    nativeToast({
                        message: '대전 방식과 맞지 않는 카드가 있습니다.',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });
                //미완성 시 경고창(허용 시 출력)
                } else if (process.deck.quantity < DATA.DECK_LIMIT) {
                    swal({
                        type:"warning",
                        title:"덱이 " + DATA.DECK_LIMIT.toString() + "장을 채우지 못했습니다.",
                        text:"정말로 덱코드를 출력하시겠습니까?",
                        showCancelButton:true,
                        confirmButtonText: '확인',
                        cancelButtonText: '취소'
                    }).then(function(result) {
                        if (result) {
                            export_url();//덱코드 출력
                        }
                    })
                //아니면 출력
                } else {
                    export_url();//덱코드 출력
                }
            }
            //포맷 전환
            if (process.deck.format === "정규") {
                $("#deckconfig_format").innerHTML = "\"야생\"으로 전환";
            } else {
                $("#deckconfig_format").innerHTML = "\"정규\"로 전환";
            }
            $("#deckconfig_format").onclick = async () => {
                if (process.deck.format === "정규") {
                    //덱 포맷 전환
                    process.deck.format = "야생";
                    deck_refresh("init");
                    //버튼 문구 변경
                    $("#deckconfig_format").innerHTML = "\"정규\"로 전환";
                    //문구 출력
                    nativeToast({
                        message: '대전방식이 변경되었습니다.<br>(정규 -> 야생)',
                        position: 'center',
                        timeout: 2000,
                        type: 'success',
                        closeOnClick: 'true'
                    });
                    //저장
                    await deck_save();
                } else if (process.deck.format === "야생") {
                    //덱 포맷 전환
                    process.deck.format = "정규";
                    deck_refresh("init");
                    //버튼 문구 변경
                    $("#deckconfig_format").innerHTML = "\"야생\"으로 전환";
                    //문구 출력
                    nativeToast({
                        message: '대전방식이 변경되었습니다.<br>(야생 -> 정규)',
                        position: 'center',
                        timeout: 2000,
                        type: 'success',
                        closeOnClick: 'true'
                    });
                    //저장
                    await deck_save();
                }
            }

            //덱 편집
            $("#deckconfig_edit").onclick = function() {
                //덱 편집창으로 전환
                window_shift("deckbuilding");
            }
            //==================
            //※ 덱 등록
            //==================
            if (!process.deck.favorite) {
                //덱 등록 표시
                $("#deckconfig_favoritestate").classList.remove("show");
                $("#deckconfig_favorite").classList.add("favorite");
                $("#deckconfig_favorite").classList.remove("delete");
                $("#deckconfig_favorite_text").innerHTML = "덱 등록";
            } else {
                //덱 삭제 표시
                $("#deckconfig_favoritestate").classList.add("show");
                $("#deckconfig_favorite").classList.remove("favorite");
                $("#deckconfig_favorite").classList.add("delete");
                $("#deckconfig_favorite_text").innerHTML = "덱 삭제";
            }
            //버튼 클릭
            $("#deckconfig_favorite").onclick = function() {
                if (!process.deck.favorite) {
                    //덱 등록
                    deck_favorite("on")
                    .then(function() {
                        //덱 등록여부 저장
                        deck_save()
                    }).then(function() {
                        //안내문구
                        nativeToast({
                            message: '덱 등록 완료<br>(이제 덱 목록에서 언제든지 불러올 수 있습니다.)',
                            position: 'center',
                            timeout: 2000,
                            type: 'success',
                            closeOnClick: 'true'
                        });
                        //버튼 변경
                        $("#deckconfig_favoritestate").classList.add("show");
                        $("#deckconfig_favorite").classList.remove("favorite");
                        $("#deckconfig_favorite").classList.add("delete");
                        $("#deckconfig_favorite_text").innerHTML = "덱 삭제";
                    })
                } else {
                    //경고창
                    swal({
                        imageUrl:"./images/icon_delete.png",
                        imageHeight:88,
                        title:"덱을 삭제하시겠습니까?",
                        text:"저장된 덱 정보가 사라집니다.",
                        showCancelButton:true,
                        confirmButtonColor: '#d33',
                        confirmButtonText: '삭제',
                        cancelButtonText: '취소'
                    }).then(function(result) {
                        if (result) {
                            //덱 삭제
                            deck_favorite("off")
                            .then(function() {
                                //덱 삭제여부 저장
                                deck_save()
                            }).then(function() {
                                //안내문구
                                nativeToast({
                                    message: '덱 삭제 완료',
                                    position: 'center',
                                    timeout: 2000,
                                    type: 'success',
                                    closeOnClick: 'true'
                                });
                                //버튼 변경
                                $("#deckconfig_favoritestate").classList.remove("show");
                                $("#deckconfig_favorite").classList.add("favorite");
                                $("#deckconfig_favorite").classList.remove("delete");
                                $("#deckconfig_favorite_text").innerHTML = "덱 등록";
                            })
                        }
                    })
                }
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
                interact_infoMonitor(e);}
                    $("#deck_list_content").addEventListener("mouseover",eventObj.deck_list_content.mouseover);
            eventObj.deck_list_content.click = function(e) {
                interact_infoCoverNow(e);
                e.preventDefault();
                return false;}
                    $("#deck_list_content").addEventListener("click",eventObj.deck_list_content.click);
            eventObj.deck_list_content.contextmenu = function(e) {
                interact_infoCoverNow(e);
                e.preventDefault();
                return false;}
                    $("#deck_list_content").addEventListener("contextmenu",eventObj.deck_list_content.contextmenu);
            //카드 정보창 닫기
            $("#frame_cardcover").onclick = function() {
                $("#frame_cardcover").classList.remove("show");
            }

            break;

        //===========================================================
        //※ 메타 덱 정보 창
        //===========================================================
        case "metadeck":
            //창 전환
            window_clear();
            $("#main_metadeck").classList.add("show");
            $("#header_metadeck").classList.add("show");
                $("#header_metadeck").innerHTML = "";
            $("#footer_metadeck").classList.add("show");
            //뒤로 버튼
            $("#header_back").classList.add("show");
                window_goback = () => {
                    window_shift("titlescreen");
                }
                $("#header_back").onclick = window_goback;
                //모바일 한정 - 히스토리 뒤로 가기 시에도 작동
                window.onpopstate = () => {
                    if (blockBack > 0) {
                        if (swal.isVisible()) swal.close();
                            else window_goback();
                        window.history.pushState({ noBackExitsApp: true }, 'DEF');
                    }
                }
            //메타 덱 정렬 버튼 비활성화
            $("#header_sort").classList.add("disabled");

            //상태 기억
            process.state = "metadeck";
                process.prestate = undefined;//이전 상태를 기억 안해도 됨
            //제목 표시
            $("#header_status").innerHTML = "메타 덱 정보";
            //덱 설정 초기화
            process.deck = {};
            process.deck.deckcode = "";

            //디폴트 필터링 세팅
            if (!session.metadeck) {
                session.metadeck = {
                    hot:{},winrate:{},
                    filter:{}
                }
                //인기있는 덱 필터링
                let filter_hot = await localforage.getItem("sist_metadeck_filter_hot")
                if (!filter_hot) {
                    session.metadeck.filter.hot = {
                        class:"ALL",
                        format:"standard",
                        totalgame:0
                    }
                } else {
                    session.metadeck.filter.hot = {
                        class:filter_hot.class,
                        format:filter_hot.format,
                        totalgame:filter_hot.totalgame
                    }
                }
                //승률높은 덱 필터링
                let filter_winrate = await localforage.getItem("sist_metadeck_filter_winrate")
                if (!filter_winrate) {
                    session.metadeck.filter.winrate = {
                        class:"ALL",
                        format:"standard",
                        totalgame:0
                    }
                } else {
                    session.metadeck.filter.winrate = {
                        class:filter_winrate.class,
                        format:filter_winrate.format,
                        totalgame:filter_winrate.totalgame
                    }
                }
                //덱 정렬
                let filter_sort = await localforage.getItem("sist_metadeck_filter_sort")
                if (!filter_sort) {
                    session.metadeck.filter.sort = {
                        category:"winrate",
                        order:"asc"
                    }
                } else {
                    session.metadeck.filter.sort = {
                        category:filter_sort.category,
                        order:filter_sort.order
                    }
                }
            }

            //첫 화면 구성
            //session에 저장된 거 있으면 그거 불러오기
            if (session.metadeck.recent) {
                //설명문 제거
                $("#metadeck_description").classList.remove("show");
                $("#metadeck_loading").classList.remove("show");
                //메타덱 출력(로컬로)
                metadeck_show(session.metadeck.recent);
            } else {
                //없으면 최근 열람한 메타덱 타입 불러오기
                let metadeck_recent = await localforage.getItem("sist_metadeck_recent")
                //그것도 없으면 메타덱 정보 설명문 표시
                if (!metadeck_recent) {
                    $("#metadeck_description").classList.add("show");
                    $("#metadeck_loading").classList.remove("show");
                //있으면 그걸로 불러오기
                } else {
                    //설명문 제거
                    $("#metadeck_description").classList.remove("show");
                    $("#metadeck_loading").classList.remove("show");
                    //메타덱 불러오기
                    metadeck_load(metadeck_recent);
                }
            }

            //직업 및 포맷 설정
            //인기있는 덱
            $("#button_metadeck_hot").onclick = function() {
                //설정 팝업창 열기
                swal({
                    html:
                      '<span class="popup_subtitle">직업 선택</span>'+
                      '<button id="popup_class_ALL" class="popup_button full metadeck_button metadeck_class" data-class="ALL">모든 직업</button>'+
                      '<button id="popup_class_WARRIOR" class="popup_button trisection metadeck_button metadeck_class" data-class="WARRIOR">전사</button>' +
                      '<button id="popup_class_SHAMAN" class="popup_button trisection metadeck_button metadeck_class" data-class="SHAMAN">주술사</button>' +
                      '<button id="popup_class_ROGUE" class="popup_button trisection metadeck_button metadeck_class" data-class="ROGUE">도적</button>' +
                      '<button id="popup_class_PALADIN" class="popup_button trisection metadeck_button metadeck_class" data-class="PALADIN">성기사</button>' +
                      '<button id="popup_class_HUNTER" class="popup_button trisection metadeck_button metadeck_class" data-class="HUNTER">사냥꾼</button>' +
                      '<button id="popup_class_DRUID" class="popup_button trisection metadeck_button metadeck_class" data-class="DRUID">드루이드</button>' +
                      '<button id="popup_class_WARLOCK" class="popup_button trisection metadeck_button metadeck_class" data-class="WARLOCK">흑마법사</button>' +
                      '<button id="popup_class_MAGE" class="popup_button trisection metadeck_button metadeck_class" data-class="MAGE">마법사</button>' +
                      '<button id="popup_class_PRIEST" class="popup_button trisection metadeck_button metadeck_class" data-class="PRIEST">사제</button>'+
                      '<span class="popup_subtitle">대전방식 선택</span>'+
                      '<button id="popup_format_standard" class="popup_button metadeck_button metadeck_format" data-format="standard">정규</button>' +
                      '<button id="popup_format_wild" class="popup_button metadeck_button metadeck_format" data-format="wild">야생</button>',
                    onOpen:function() {
                        //버튼 디폴트 세팅
                        if (process.state === "metadeck") {
                            //직업
                            $("#popup_class_" + session.metadeck.filter.hot.class).classList.add("selected")
                            //포맷 디폴트
                            $("#popup_format_" + session.metadeck.filter.hot.format).classList.add("selected")
                        }

                        //버튼 클릭 시
                        $$(".metadeck_button").forEach(function(target) {
                            target.onclick = function() {
                                if (target.dataset.class) {
                                    //직업 세팅
                                    session.metadeck.filter.hot.class = target.dataset.class;
                                    //버튼 세팅
                                    $$(".metadeck_class").forEach(function(x) {
                                        x.classList.remove("selected");
                                    })
                                    target.classList.add("selected");
                                } else if (target.dataset.format) {
                                    //대전 방식 세팅
                                    session.metadeck.filter.hot.format = target.dataset.format;
                                    //버튼 세팅
                                    $$(".metadeck_format").forEach(function(x) {
                                        x.classList.remove("selected");
                                    })
                                    target.classList.add("selected");
                                }
                            }
                        })
                    },
                    preConfirm: function() {
                        return new Promise(function(resolve, reject) {
                            if (!session.metadeck.filter.hot.class) {
                                reject('직업을 설정해주세요.');
                            } else if (!session.metadeck.filter.hot.format) {
                                reject('대전 방식을 설정해주세요.');
                            } else {
                                resolve();
                            }
                        })
                    },
                    allowOutsideClick:false,
                    showCancelButton:true,
                    confirmButtonText: '설정 완료',
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33',
                    showCloseButton:true
                }).then(async (isConfirm) => {
                    if (isConfirm) {
                        //필터 기억
                        await localforage.setItem("sist_metadeck_filter_hot",session.metadeck.filter.hot);
                        //메타덱 불러오기
                        metadeck_load("hot");
                    }
                })
            }
            //승률높은 덱
            $("#button_metadeck_winrate").onclick = function() {
                //설정 팝업창 열기
                swal({
                    html:
                      '<span class="popup_subtitle">직업 선택</span>'+
                      '<button id="popup_class_ALL" class="popup_button full metadeck_button metadeck_class" data-class="ALL">모든 직업</button>'+
                      '<button id="popup_class_WARRIOR" class="popup_button trisection metadeck_button metadeck_class" data-class="WARRIOR">전사</button>' +
                      '<button id="popup_class_SHAMAN" class="popup_button trisection metadeck_button metadeck_class" data-class="SHAMAN">주술사</button>' +
                      '<button id="popup_class_ROGUE" class="popup_button trisection metadeck_button metadeck_class" data-class="ROGUE">도적</button>' +
                      '<button id="popup_class_PALADIN" class="popup_button trisection metadeck_button metadeck_class" data-class="PALADIN">성기사</button>' +
                      '<button id="popup_class_HUNTER" class="popup_button trisection metadeck_button metadeck_class" data-class="HUNTER">사냥꾼</button>' +
                      '<button id="popup_class_DRUID" class="popup_button trisection metadeck_button metadeck_class" data-class="DRUID">드루이드</button>' +
                      '<button id="popup_class_WARLOCK" class="popup_button trisection metadeck_button metadeck_class" data-class="WARLOCK">흑마법사</button>' +
                      '<button id="popup_class_MAGE" class="popup_button trisection metadeck_button metadeck_class" data-class="MAGE">마법사</button>' +
                      '<button id="popup_class_PRIEST" class="popup_button trisection metadeck_button metadeck_class" data-class="PRIEST">사제</button>'+
                      '<span class="popup_subtitle">대전방식 선택</span>'+
                      '<button id="popup_format_standard" class="popup_button metadeck_button metadeck_format" data-format="standard">정규</button>' +
                      '<button id="popup_format_wild" class="popup_button metadeck_button metadeck_format" data-format="wild">야생</button>'+
                      '<span class="popup_subtitle">최소 게임횟수</span>'+
                      '<button id="popup_totalgame_0" class="popup_button metadeck_button metadeck_totalgame" data-totalgame="0">제한없음</button>' +
                      '<button id="popup_totalgame_1000" class="popup_button metadeck_button metadeck_totalgame" data-totalgame="1000">1,000판 이상</button>',
                    onOpen:function() {
                        //버튼 디폴트 세팅
                        if (process.state === "metadeck") {
                            //직업
                            $("#popup_class_" + session.metadeck.filter.winrate.class).classList.add("selected")
                            //포맷 디폴트
                            $("#popup_format_" + session.metadeck.filter.winrate.format).classList.add("selected")
                            //게임횟수 디폴트 : 제한없음
                            $("#popup_totalgame_" + session.metadeck.filter.winrate.totalgame).classList.add("selected")
                        }

                        //버튼 클릭 시
                        $$(".metadeck_button").forEach(function(target) {
                            target.onclick = function() {
                                if (target.dataset.class) {
                                    //직업 세팅
                                    session.metadeck.filter.winrate.class = target.dataset.class;
                                    //버튼 세팅
                                    $$(".metadeck_class").forEach(function(x) {
                                        x.classList.remove("selected");
                                    })
                                    target.classList.add("selected");
                                } else if (target.dataset.format) {
                                    //대전 방식 세팅
                                    session.metadeck.filter.winrate.format = target.dataset.format;
                                    //버튼 세팅
                                    $$(".metadeck_format").forEach(function(x) {
                                        x.classList.remove("selected");
                                    })
                                    target.classList.add("selected");
                                } else if (target.dataset.totalgame) {
                                    //게임 횟수 세팅
                                    session.metadeck.filter.winrate.totalgame = parseInt(target.dataset.totalgame);
                                    //버튼 세팅
                                    $$(".metadeck_totalgame").forEach(function(x) {
                                        x.classList.remove("selected");
                                    })
                                    target.classList.add("selected");
                                }
                            }
                        })
                    },
                    preConfirm: function() {
                        return new Promise(function(resolve, reject) {
                            if (!session.metadeck.filter.winrate.class) {
                                reject('직업을 설정해주세요.');
                            } else if (!session.metadeck.filter.winrate.format) {
                                reject('대전 방식을 설정해주세요.');
                            } else {
                                resolve();
                            }
                        })
                    },
                    allowOutsideClick:false,
                    showCancelButton:true,
                    confirmButtonText: '설정 완료',
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33',
                    showCloseButton:true
                }).then(async (isConfirm) => {
                    if (isConfirm) {
                        //필터 기억
                        await localforage.setItem("sist_metadeck_filter_winrate",session.metadeck.filter.winrate);
                        //메타덱 불러오기
                        metadeck_load("winrate");
                    }
                })
            }

            //메타 덱 정렬 기능
            $("#header_sort").classList.add("show");
            $("#header_sort").onclick = function() {
                swal({
                    title:"메타 덱 정렬",
                    html:'<div id="modalContentId" class="swal2-content" style="display: block;margin-bottom:10px;">조건을 충족하는 상위 100개의 덱 출력</div>'+
                        '<button id="popup_metadeck_filter_sort_winrate_asc" class="popup_button sort_button" data-sort="winrate_asc"><img src="./images/icon_sort_1.png">승률 높은순</button>'+
                        '<button id="popup_metadeck_filter_sort_winrate_desc" class="popup_button sort_button" data-sort="winrate_desc"><img src="./images/icon_sort_2.png">승률 낮은순</button>'+
                        '<button id="popup_metadeck_filter_sort_dust_asc" class="popup_button sort_button" data-sort="dust_asc"><img src="./images/icon_sort_3.png">가루 높은순</button>'+
                        '<button id="popup_metadeck_filter_sort_dust_desc" class="popup_button sort_button" data-sort="dust_desc"><img src="./images/icon_sort_4.png">가루 낮은순</button>'+
                        '<button id="popup_metadeck_filter_sort_totalgame_asc" class="popup_button sort_button" data-sort="totalgame_asc"><img src="./images/icon_sort_5.png">횟수 높은순</button>'+
                        '<button id="popup_metadeck_filter_sort_totalgame_desc" class="popup_button sort_button" data-sort="totalgame_desc"><img src="./images/icon_sort_6.png">횟수 낮은순</button>',
                    confirmButtonText:"취소",
                    onOpen:function() {
                        //버튼 디폴트 세팅
                        if (process.state === "metadeck") {
                            //직업
                            $("#popup_metadeck_filter_sort_" + session.metadeck.filter.sort.category + "_" + session.metadeck.filter.sort.order).classList.add("selected")
                        }

                        //버튼 클릭 시
                        $$(".sort_button").forEach(function(target) {
                            target.onclick = function() {
                                //카테고리 세팅
                                session.metadeck.filter.sort.category = target.dataset.sort.split("_")[0];
                                //오름/내림 세팅
                                session.metadeck.filter.sort.order = target.dataset.sort.split("_")[1];
                                //버튼 세팅
                                $$(".sort_button").forEach(function(x) {
                                    x.classList.remove("selected");
                                })
                                target.classList.add("selected");

                                //창 닫기
                                swal.close();
                                //출력 개시
                                metadeck_load(session.metadeck.recent);
                            }
                        })
                    },
                    allowOutsideClick:false,
                    confirmButtonText: '취소',
                    confirmButtonColor: '#d33',
                })
            }

            //메타 덱 목록 불러오기
            async function metadeck_load(metadeck_type) {
                //공통 : API 호출
                async function callAPI(cmd) {
                    let desc = {
                        metadeck_archetype:"덱 유형",
                        metadeck_hot_standard:"인기있는 덱(정규전)",
                        metadeck_hot_wild:"인기있는 덱(야생전)",
                        metadeck_winrate_standard:"승률높은 덱(정규전)",
                        metadeck_winrate_wild:"승률높은 덱(야생전)",
                        metadeck_update:"업데이트 기록"
                    }
                    //로딩 화면
                    $("#metadeck_loading_desc").innerHTML = desc[cmd] + "<br>불러오는 중...";
                    //API 호출
                    try {
                        let response = await fetch(METADECKAPI[window.location.hostname] + cmd + ".json",{'pragma':'no-cache','cache-control':'no-cache'});
                        //성공 시
                        let resJson = await response.json();
                        //데이터 정제 후 저장
                        let output = {}
                        switch (cmd) {
                            case "metadeck_archetype"://아키타입
                                resJson.forEach((x) => {
                                    output[x.id.toString()] = x.name;
                                })
                                await localforage.setItem("sist_metadecks_archetype", output);

                                break;
                            case "metadeck_update"://아키타입
                                Object.keys(resJson).forEach(key => {
                                    output[key] = resJson[key];
                                })

                                await localforage.setItem("sist_metadecks_update", output);

                                break;
                            default://정규전, 야생전
                                output = {};
                                output.ALL = [];//전 직업 카테고리
                                Object.keys(resJson.series.data).forEach((x) => {
                                    output[x] = [];
                                    resJson.series.data[x].forEach((deck) => {
                                        //정규전이면 덱의 정규여부 체크
                                        if (session.metadeck.filter[metadeck_type].format === "wild" ||
                                        isStandard(JSON.parse(deck.deck_list)) === true) {
                                            deck.class = x;//직업
                                            deck.format = session.metadeck.filter[metadeck_type].format;//포맷(덱코드 계산용)
                                            deck.cards = JSON.parse(deck.deck_list);//덱리스트(문자열이 아닌 배열)
                                            deck.dust = 0;//가루 계산
                                            deck.cards.forEach((cardInfo) => {
                                                deck.dust += DATA.RARITY.DUST[session.db[session.index[cardInfo[0]]].rarity] * cardInfo[1];
                                            })
                                            //덱코드 분석
                                            deck.deckcode = deckcode_encode(deck);
                                            //저장
                                            output[x].push(deck);
                                            output.ALL.push(deck);
                                        }
                                    })
                                    output[x].sort((a,b) => {//각 직업 카테고리 정렬
                                        //설정된 조건에 따라 정렬
                                        switch (session.metadeck.filter.sort.category) {
                                            case "winrate":
                                                if (session.metadeck.filter.sort.order === "asc")
                                                    return (a.win_rate > b.win_rate) ? -1 : 1;
                                                else
                                                    return (a.win_rate < b.win_rate) ? -1 : 1;
                                                break;
                                            case "dust":
                                                if (session.metadeck.filter.sort.order === "asc")
                                                    return (a.dust > b.dust) ? -1 : 1;
                                                else
                                                    return (a.dust < b.dust) ? -1 : 1;
                                                break;
                                            case "totalgame":
                                                if (session.metadeck.filter.sort.order === "asc")
                                                    return (a.total_games > b.total_games) ? -1 : 1;
                                                else
                                                    return (a.total_games < b.total_games) ? -1 : 1;
                                                break;
                                        }
                                    })
                                })
                                output.ALL.sort((a,b) => {//전 직업 카테고리 정렬
                                    //설정된 조건에 따라 정렬
                                    switch (session.metadeck.filter.sort.category) {
                                        case "winrate":
                                            if (session.metadeck.filter.sort.order === "asc")
                                                return (a.win_rate > b.win_rate) ? -1 : 1;
                                            else
                                                return (a.win_rate < b.win_rate) ? -1 : 1;
                                            break;
                                        case "dust":
                                            if (session.metadeck.filter.sort.order === "asc")
                                                return (a.dust > b.dust) ? -1 : 1;
                                            else
                                                return (a.dust < b.dust) ? -1 : 1;
                                            break;
                                        case "totalgame":
                                            if (session.metadeck.filter.sort.order === "asc")
                                                return (a.total_games > b.total_games) ? -1 : 1;
                                            else
                                                return (a.total_games < b.total_games) ? -1 : 1;
                                            break;
                                    }
                                })
                                await localforage.setItem("sist_" + cmd, output);

                                break;
                        }
                        console.log("API 호출됨 - " + cmd);

                        return output;
                    //실패 시
                    } catch(e) {
                        //실패 메시지
                        throw(e);

                        return false;
                    }
                }

                //로딩 화면 출력
                $("#metadeck_description").classList.remove("show");
                $("#metadeck_loading").classList.add("show");

                //덱 목록 세팅
                try {
                    //업데이트 날짜 기록
                    try {
                        let response = await fetch(METADECKAPI[window.location.hostname] + "metadeck_update.json",{'pragma':'no-cache','cache-control':'no-cache'});
                        //성공 시
                        let resJson = await response.json();
                        let time = resJson["metadeck_" + metadeck_type + "_" + session.metadeck.filter[metadeck_type].format];
                        //상단 문구 기억
                        session.metadeck[metadeck_type].update = time;
                    } catch(e) {
                        session.metadeck[metadeck_type].update = "";
                    }

                    //메타덱 API 호출
                    inputInfo = await callAPI("metadeck_" + metadeck_type + "_" + session.metadeck.filter[metadeck_type].format);
                    //정보 반영
                    session.metadeck[metadeck_type][session.metadeck.filter[metadeck_type].format] = inputInfo;

                    //아키타입 세팅
                    return new Promise(async resolve1 => {
                        //로컬에 아키타입 불러오기
                        let inputInfo = {};
                        let setArchetype = () => {
                            return new Promise(async resolve2 => {
                                //아키타입 반드시 호출
                                inputInfo = await callAPI("metadeck_archetype");
                                //아키타입 대조 및 적용
                                for (x of Object.keys(session.metadeck[metadeck_type][session.metadeck.filter[metadeck_type].format])) {
                                    if (x === "ALL" || DATA.CLASS.KR[x] !== undefined) {
                                        for (deck of session.metadeck[metadeck_type][session.metadeck.filter[metadeck_type].format][x]) {
                                            //맞는 아키타입 없으면 직업명 표시
                                            if (!inputInfo[deck.archetype_id]) {
                                                deck.archetype_name = deck.class;
                                            } else {
                                                deck.archetype_name = inputInfo[deck.archetype_id];
                                            }
                                        }
                                    }
                                }
                                resolve2();
                            })
                        }
                        setArchetype().then(() => {
                            resolve1();
                        })
                    }).then(async () => {
                        //메타덱 정보 로컬저장
                        await localforage.setItem("sist_metadeck_" + metadeck_type + "_" + session.metadeck.filter[metadeck_type].format, session.metadeck[metadeck_type][session.metadeck.filter[metadeck_type].format]);
                        //클러스터 구성 및 출력
                        metadeck_show(metadeck_type);
                    })
                } catch (e) {
                    console.log(e);
                    //메타덱 데이터를 불러오는 데 실패했다면
                    //최근 데이터가 있으면 해당 데이터 사용
                    localforage.getItem("sist_metadecks_" + session.metadeck.filter[metadeck_type].format)
                    .then(async (deckInfo) => {
                        if (!deckInfo) {
                            //불러올 해당 대전유형 정보 없으면 로딩 실패 출력
                            nativeToast({
                                message: '메타 덱 정보를 불러올 수 없습니다. 잠시 후에 다시 시도해보거나 제작자 블로그에 문의해주세요.',
                                position: 'center',
                                timeout: 2000,
                                type: 'error',
                                closeOnClick: 'true'
                            });
                            $("#metadeck_loading").classList.remove("show");
                            $("#metadeck_description").classList.add("show");
                        } else {
                            localforage.getItem("sist_metadecks_archetype")
                            .then(async (archetype) => {
                                if (!archetype) {
                                    //불러올 아키타입 정보 없으면 로딩 실패 출력
                                    nativeToast({
                                        message: '메타 덱 정보를 불러올 수 없습니다. 잠시 후에 다시 시도해보거나 제작자 블로그에 문의해주세요.',
                                        position: 'center',
                                        timeout: 2000,
                                        type: 'error',
                                        closeOnClick: 'true'
                                    });
                                    $("#metadeck_loading").classList.remove("show");
                                    $("#metadeck_description").classList.add("show");
                                } else {
                                    session.metadeck[metadeck_type][session.metadeck.filter[metadeck_type].format] = inputInfo;
                                    Object.keys(session.metadeck[metadeck_type][session.metadeck.filter[metadeck_type].format]).forEach(x => {
                                        if (x === "ALL" || DATA.CLASS.KR[x] !== undefined) {
                                            session.metadeck[metadeck_type][session.metadeck.filter[metadeck_type].format][x].forEach(async (deck) => {
                                                //맞는 아키타입 없으면 직업명 표시
                                                if (!inputInfo[deck.archetype_id]) {
                                                    deck.archetype_name = deck.class;
                                                } else {
                                                    deck.archetype_name = inputInfo[deck.archetype_id];
                                                }
                                            })
                                        }
                                    })
                                    nativeToast({
                                        message: '메타 덱 정보를 불러올 수 없습니다. 가장 최근에 저장된 정보를 불러옵니다.',
                                        position: 'center',
                                        timeout: 2000,
                                        type: 'error',
                                        closeOnClick: 'true'
                                    });
                                    metadeck_show(metadeck_type);
                                }
                            })
                        }
                    })
                }
            }

            //메타 덱 출력
            async function metadeck_show(metadeck_type) {
                //메타 덱 목록 구축
                let metadeckslotArr = []
                let decks = session.metadeck[metadeck_type][session.metadeck.filter[metadeck_type].format][session.metadeck.filter[metadeck_type].class];
                let deckRank = 1;
                for (let i = 0;i < decks.length;i++) {
                    let oneDeck = decks[i];
                    if (oneDeck.total_games >= session.metadeck.filter[metadeck_type].totalgame) {
                        metadeckslotArr.push(metadeckslot_generateFragment(oneDeck, deckRank));
                        deckRank += 1;
                    }
                    if (deckRank > METADECKMAX) break;
                }
                //클러스터 업데이트
                clusterize.metadeck.update(metadeckslotArr);
                //클러스터 스크롤(기억해둔 거 있으면 거기로, 아니면 0 / 이후 초기화)
                $("#metadeck_slot").scrollTop = session.metadeck[metadeck_type].scroll || 0;
                    session.metadeck[metadeck_type].scroll = 0;

                //업데이트 날짜 출력
                $("#header_metadeck").innerHTML = "업데이트 날짜 : " + session.metadeck[metadeck_type].update;
                //최근에 불러온 타입 기억
                session.metadeck.recent = metadeck_type;
                try {
                    await localforage.setItem("sist_metadeck_recent", session.metadeck.recent);
                    //메타 덱 정렬 조건 기억
                    await localforage.setItem("sist_metadeck_filter_sort", session.metadeck.filter.sort);
                } catch(e) {
                    //오류가 나도 무시하고 진행
                }

                //로딩 화면 제거
                $("#metadeck_loading").classList.remove("show");
                //제목 변경
                switch (metadeck_type) {
                    case "hot":
                        $("#header_status").innerHTML = "인기 덱 정보";
                        break;
                    case "winrate":
                        $("#header_status").innerHTML = "고승률 덱 정보";
                        break;
                }

                //메타 덱 정렬 버튼 활성화
                $("#header_sort").classList.remove("disabled");

                //메타 덱 열람
                $("#metadeck_slot").onclick = function(e) {
                    e = e || event;
                    let target = e.target || e.srcElement;
                    //현재 스크롤 기억
                    session.metadeck[metadeck_type].scroll = $("#metadeck_slot").scrollTop;
                    //덱 편집창 열기
                    if (target.classList.contains("metadeckslot_button_main")) {
                        if (!process.deck) process.deck = {};
                        process.deck.name = "[" + DATA.FORMAT.KR[target.dataset.format] + target.dataset.number + "]" + target.dataset.name;
                        process.deck.deckcode = target.dataset.deckcode;
                        process.deck.format = DATA.FORMAT.KR[target.dataset.format];
                        window_shift("loading","deckconfig","metadeck");
                    }
                }
            }

            break;
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
        if (cardReady === 1) {//카드 이동 대기중이라면
            //상호작용 대상 비우기
            interact_target = "";
            card_move("add " + target.dataset.dbfid, true);
            cardReady = 0;//카드 이동 대기 취소
            e.preventDefault();
        }
    }
}
let interact_removeCard = function(e, ismouse) {
    e = e || event;
        if (ismouse === true && e.button !== 0) return false;//우클릭 배제
    let target = e.target || e.srcElement;
    //카드 정보 auto 제거
    clearTimeout(autoInfo);
    if (target.classList.contains("card") && target === interact_target) {
        if (cardReady === 1) {//카드 이동 대기중이라면
            //상호작용 대상 비우기
            interact_target = "";
            card_move("remove " + target.dataset.dbfid, true);
            cardReady = 0;//카드 이동 대기 취소
            e.preventDefault();
        }
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
        //카드 이동 대기
        cardReady = 1;
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
    //카드 이동 대기 취소
    cardReady = 0;
    //상호작용 대상 비우기
    interact_target = "";
}
