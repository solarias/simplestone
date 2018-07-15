
//===============================================================
//※ 카드 필터링, 검색 관련 함수
//===============================================================

//카드 정렬 - 배열(비용, 이름 순)
function sort_arr(arr) {
    arr.sort(function(x,y) {
        if (x.cost > y.cost) {
            return 1;
        } else if (x.cost < y.cost) {
            return -1;
        } else {
            let order = [x.name,y.name];
            let order2 = [x.name,y.name];
            order.sort();
            if (order[0] === order2[0]) {
                return -1;
            } else {
                return 1;
            }
        };
    })

    return arr;
}

//키워드 검색 가능하도록 정리
function searchable(keyword) {
    let text = keyword;
    //분류 한글화
    Object.keys(DATA.TYPE_KR).forEach(function(x) {
        text = text.replaceAll(x,DATA.TYPE_KR[x]);
    })
    //종족명 한글화
    Object.keys(DATA.RACE_KR).forEach(function(x) {
        text = text.replaceAll(x,DATA.RACE_KR[x]);
    })
    //불필요 기호 제거
    //text = text.replace(/\s|<b>|<\/b>|\n|\[x\]|\$|#|<i>|<\/i>|@|\.|,|(|)|:/g,"");
    let unseable = [" ", "<b>", "</b>", "\n", "[x]", "$", "#", "<i>", "</i>", "@", ".", ",", "/", "(", ")", ":"];
    unseable.forEach(function(x) {
        text = text.replaceAll(x,"");
    })
    //반환
    return text;
}
//키워드 읽을 수 있도록 정리
function readable(text) {
    let unseable = ["[x]", "$", "#", "@"];
    let replacable = ["\n"];
    unseable.forEach(function(x) {
        text = text.replaceAll(x,"");
    })
    replacable.forEach(function(x) {
        text = text.replaceAll(x,"<br>");
    })
    //반환
    return text;
}

//카드 마나 맞춰보기
function card_matchMana(target, mana) {
    switch (mana) {
        case "all"://전체: 무조건 통과
            return true;
            break;
            case "0"://마나 = 0
            case "1"://마나 = 1
            case "2"://마나 = 2
            case "3"://마나 = 3
            case "4"://마나 = 4
            case "5"://마나 = 5
            case "6"://마나 = 6
            if (target.cost === parseInt(mana)) return true;
            break;
        case "7"://마나 = 7 이상
            if (target.cost > 7) return true;
            break;
        case "odd"://홀수
            if (target.cost % 2 === 1) return true;
            break;
        case "even"://짝수
            if (target.cost % 2 === 0) return true;
            break;
        default://오류 방지 - 통과
            return true;
            break;
    }

    //통과 못하면 제외
    return false;
}

//카드 키워드 맞춰보기
function card_matchKeyword(target, keyword) {
    //필터가 비었으면 통과
    if (!keyword || keyword === "") return true;
    //필터 분류(공백)
    let list = ["name","text","race","type"];
    for (let i = 0;i<list.length;i++) {
        if (target[list[i]] !== undefined) {
            let temptext = searchable(target[list[i]]);
                keyword = searchable(keyword);
            if (temptext.indexOf(keyword) >= 0) {
                return true;
            }
        }
    }
    //true가 나오지 않으면 false
    return false;
}

//카드 필터 구성
function card_setFilter(cmd) {
    //초기 작업: 검색치 초기화
    if (cmd === "init") {
        //검색 초기치 설정, 필터 활성화
        if (!process.search) process.search = {};
        process.search.class = process.deck.class;//직업
        process.search.mana = "all";//마나
        process.search.rarity = "all";//등급
        process.search.set = "all";//세트
        process.search.format = process.deck.format;//포맷
        process.search.keyword = "";//키워드
    }

    //직업
    function filter_class(text) {
        //초기"글자" 설정
        if (text === "init") {
            //검색버튼 키워드 변경
            $("#search_class").innerHTML = DATA.CLASS_KR[process.search.class];
        //버튼 클릭
        } else {
            //카드 정보
            if (process.state === "cardinfo") {
                //팝업창 열기
                swal({
                    title: '카드 직업 검색',
                    html:
                      '<button id="popup_class_WARRIOR" class="popup_button trisection" data-class="WARRIOR">전사</button>' +
                      '<button id="popup_class_SHAMAN" class="popup_button trisection" data-class="SHAMAN">주술사</button>' +
                      '<button id="popup_class_ROGUE" class="popup_button trisection" data-class="ROGUE">도적</button>' +
                      '<button id="popup_class_PALADIN" class="popup_button trisection" data-class="PALADIN">성기사</button>' +
                      '<button id="popup_class_HUNTER" class="popup_button trisection" data-class="HUNTER">사냥꾼</button>' +
                      '<button id="popup_class_DRUID" class="popup_button trisection" data-class="DRUID">드루이드</button>' +
                      '<button id="popup_class_WARLOCK" class="popup_button trisection" data-class="WARLOCK">흑마법사</button>' +
                      '<button id="popup_class_MAGE" class="popup_button trisection" data-class="MAGE">마법사</button>' +
                      '<button id="popup_class_PRIEST" class="popup_button trisection" data-class="PRIEST">사제</button>' +
                      '<button id="popup_class_NEUTRAL" class="popup_button full" data-class="NEUTRAL">중립</button>',
                    onOpen:function() {
                        //현재 등급 검색필터 보여주기
                        $("#popup_class_" + process.search.class).classList.add("selected");
                        //버튼 상호작용
                        $$(".popup_button").forEach(function(x) {
                            x.onclick = function() {
                                //직업 필터 변경
                                let classtext = x.dataset.class;
                                process.search.class = classtext;
                                //키워드 변경
                                let krtext = DATA.CLASS_KR[classtext];
                                $("#search_class").innerHTML = krtext;
                                $("#mobilefilter_rarity").innerHTML = krtext;
                                //창 닫기
                                swal.close();
                                //검색 개시
                                card_search();
                            }
                        })
                    },
                    showConfirmButton:false,
                    showCancelButton:true,
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33'
                })
            //덱 만들기
            } else if (process.state === "deckbuilding") {
                //검색 직업 변경
                process.search.class = (process.search.class === "NEUTRAL" ? process.deck.class : "NEUTRAL")
                //검색버튼 키워드 변경
                $("#search_class").innerHTML = DATA.CLASS_KR[process.search.class];
                //재검색
                card_search();
            }

        }
    }
        //직업 필터 작동
        filter_class("init");
        //직업 필터 상호작용
        $("#search_class").onclick = function() {
            filter_class();
        }

    //마나
    function filter_mana(text) {
        //초기"글자" 설정
        if (text === "init") {
            //"전체" 키워드
            let text = "마나 : 전체";
            $("#search_mana").innerHTML = text;
            $("#mobilefilter_mana").innerHTML = text;
        } else {
            //팝업창 열기
            swal({
                title: '카드 마나 검색',
                html:
                  '<button id="popup_mana_all" class="popup_button full" data-mana="전체">전체</button>' +
                  '<button id="popup_mana_0" class="popup_button" data-mana="0"><span style="color:blue;font-size:20px;">&#11042;</span> 0</button>' +
                  '<button id="popup_mana_1" class="popup_button" data-mana="1"><span style="color:blue;font-size:20px;">&#11042;</span> 1</button>' +
                  '<button id="popup_mana_2" class="popup_button" data-mana="2"><span style="color:blue;font-size:20px;">&#11042;</span> 2</button>' +
                  '<button id="popup_mana_3" class="popup_button" data-mana="3"><span style="color:blue;font-size:20px;">&#11042;</span> 3</button>' +
                  '<button id="popup_mana_4" class="popup_button" data-mana="4"><span style="color:blue;font-size:20px;">&#11042;</span> 4</button>' +
                  '<button id="popup_mana_5" class="popup_button" data-mana="5"><span style="color:blue;font-size:20px;">&#11042;</span> 5</button>' +
                  '<button id="popup_mana_6" class="popup_button" data-mana="6"><span style="color:blue;font-size:20px;">&#11042;</span> 6</button>' +
                  '<button id="popup_mana_7" class="popup_button" data-mana="7"><span style="color:blue;font-size:20px;">&#11042;</span> 7+</button>' +
                  '<button id="popup_mana_odd" class="popup_button" data-mana="홀수">홀수</button>' +
                  '<button id="popup_mana_even" class="popup_button" data-mana="짝수">짝수</button>',
                onOpen:function() {
                    //현재 마나 검색필터 보여주기
                    $("#popup_mana_" + process.search.mana).classList.add("selected");
                    //버튼 상호작용
                    $$(".popup_button").forEach(function(x) {
                        x.onclick = function() {
                            //마나 필터 변경
                            process.search.mana = x.id.replace("popup_mana_","");
                            //키워드 변경
                            let text = "마나 : " + x.dataset.mana;
                            $("#search_mana").innerHTML = text;
                            $("#mobilefilter_mana").innerHTML = text;
                            //창 닫기
                            swal.close();
                            //검색 개시
                            card_search();
                        }
                    })
                },
                showConfirmButton:false,
                showCancelButton:true,
                cancelButtonText: '취소',
                cancelButtonColor: '#d33'
            })
        }
    }
        //직업 필터 작동
        filter_mana("init");
        //직업 필터 상호작용
        $("#search_mana").onclick = filter_mana;
        $("#mobilefilter_mana").onclick = filter_mana;

    //등급
    function filter_rarity(text) {
        //초기"글자" 설정
        if (text === "init") {
            //"전체" 키워드
            let text = "등급 : 전체";
            $("#search_rarity").innerHTML = text;
            $("#mobilefilter_rarity").innerHTML = text;
        } else {
            //팝업창 열기
            swal({
                title: '카드 등급 검색',
                html:
                  '<button id="popup_rarity_all" class="popup_button full" data-rarity="전체">전체</button>' +
                  '<button id="popup_rarity_FREE" class="popup_button full" data-rarity="기본"><span class="COMMON">&#11042;</span> 기본 카드</button>' +
                  '<button id="popup_rarity_COMMON" class="popup_button full" data-rarity="일반"><span class="FREE">&#11042;</span> 일반 카드</button>' +
                  '<button id="popup_rarity_RARE" class="popup_button full" data-rarity="희귀"><span class="RARE">&#11042;</span> 희귀 카드</button>' +
                  '<button id="popup_rarity_EPIC" class="popup_button full" data-rarity="영웅"><span class="EPIC">&#11042;</span> 영웅 카드</button>' +
                  '<button id="popup_rarity_LEGENDARY" class="popup_button full" data-rarity="전설"><span class="LEGENDARY">&#11042;</span> 전설 카드</button>',
                onOpen:function() {
                    //현재 등급 검색필터 보여주기
                    $("#popup_rarity_" + process.search.rarity).classList.add("selected");
                    //버튼 상호작용
                    $$(".popup_button").forEach(function(x) {
                        x.onclick = function() {
                            //등급 필터 변경
                            process.search.rarity = x.id.replace("popup_rarity_","");
                            //키워드 변경
                            let text = "등급 : " + x.dataset.rarity;
                            $("#search_rarity").innerHTML = text;
                            $("#mobilefilter_rarity").innerHTML = text;
                            //창 닫기
                            swal.close();
                            //검색 개시
                            card_search();
                        }
                    })
                },
                showConfirmButton:false,
                showCancelButton:true,
                cancelButtonText: '취소',
                cancelButtonColor: '#d33'
            })
        }
    }
        //직업 필터 작동
        filter_rarity("init");
        //직업 필터 상호작용
        $("#search_rarity").onclick = filter_rarity;
        $("#mobilefilter_rarity").onclick = filter_rarity;

    //세트
    function filter_set(text) {
        //초기"글자" 설정
        if (text === "init") {
            //"전체" 키워드
            let formattext = "";
            switch (process.deck.format) {
                case "정규":
                    formattext = "세트 : 전체";
                    break;
                case "야생":
                    formattext = "세트／포맷";
                    break;
            }
            $("#search_set").innerHTML = formattext;
            $("#mobilefilter_set").innerHTML = formattext;
        } else {
            //정규전: button형, 야생전: select형
            switch (process.deck.format) {
                case "정규":
                    //세트 버튼 구성
                    let text = "";
                    let setarr = Object.keys(DATA.SET_KR);
                    setarr.unshift("all");
                    setarr.forEach(function(x,i) {
                        if (x === "all" ||
                        DATA.SET_FORMAT[x] === "정규" ||
                        process.deck.format === DATA.SET_FORMAT[x]) {
                            let btn = document.createElement("button");
                                btn.id = "popup_set_" + x;
                                btn.classList.add("popup_button","small");
                                btn.dataset.set = (DATA.SET_KR[x]) ? DATA.SET_KR[x] : "전체";
                                btn.innerHTML = (DATA.SET_KR[x]) ? DATA.SET_KR[x] : "전체";
                            text += btn.outerHTML;
                        }
                    });
                    //팝업창 열기
                    swal({
                        title: '카드 세트 검색',
                        html:text,
                        onOpen:function() {
                            //현재 세트 검색필터 보여주기
                            $("#popup_set_" + process.search.set).classList.add("selected");
                            //버튼 상호작용
                            $$(".popup_button").forEach(function(x) {
                                x.onclick = function() {
                                    //세트 필터 변경
                                    process.search.set = x.id.replace("popup_set_","");
                                    //키워드 변경
                                    let text = x.dataset.set;
                                    $("#search_set").innerHTML = text;
                                    $("#mobilefilter_set").innerHTML = text;
                                    //창 닫기
                                    swal.close();
                                    //검색 개시
                                    card_search();
                                }
                            })
                        },
                        showConfirmButton:false,
                        showCancelButton:true,
                        cancelButtonText: '취소',
                        cancelButtonColor: '#d33'
                    })

                    break;

                case "야생":
                //팝업창 열기
                swal({
                    title: '세트／포맷 검색',
                    html:
                      '<button id="popup_standrad" class="popup_button" data-rarity="정규">정규 전체</button>' +
                      '<button id="popup_wild" class="popup_button" data-rarity="야생">야생 전체</button>'+
                      '<select id="popup_select_standard" class="popup_select swal2-select" style="display: block;"></select>'+
                      '<select id="popup_select_wild" class="popup_select swal2-select" style="display: block;"></select>',
                    onOpen:function() {
                        //선택창 구성
                        let select_standard = $("#popup_select_standard");
                        let select_wild = $("#popup_select_wild")
                        //정규 세트
                            //"타이틀" 추가
                            select_standard.options[0] = new Option("개별 세트(정규)");
                            select_standard.options[0].disabled = true;
                            //개별 세트
                            Object.keys(DATA.SET_KR).forEach(function(x,i) {
                                if (DATA.SET_FORMAT[x] === "정규") {
                                    select_standard.options[select_standard.options.length] = new Option(DATA.SET_KR[x],x);
                                    //현재 검색필터 세트이면 강조
                                    if (x === process.search.set) {
                                        select_standard.options[select_standard.options.length-1].selected = true;
                                    }
                                }
                            });
                        //야생 세트
                            //"타이틀" 추가
                            select_wild.options[0] = new Option("개별 세트(야생)");
                            select_wild.options[0].disabled = true;
                            //개별 세트
                            Object.keys(DATA.SET_KR).forEach(function(x,i) {
                                if (DATA.SET_FORMAT[x] === "야생") {
                                    select_wild.options[select_wild.options.length] = new Option(DATA.SET_KR[x],x);
                                    //현재 검색필터 세트이면 강조
                                    if (x === process.search.set) {
                                        select_wild.options[select_wild.options.length-1].selected = true;
                                    }
                                }
                            });
                        //버튼 상호작용
                        if (process.search.format === "정규" && process.search.set === "all") {
                            $("#popup_standrad").classList.add("selected");
                        } else if (process.search.format === "야생" && process.search.set === "all") {
                            $("#popup_wild").classList.add("selected");
                        }
                        $("#popup_standrad").onclick = function() {
                            //세트, 포맷 필터 변경
                            process.search.format = "정규";
                            process.search.set = "all";
                            //키워드 변경
                            let text = "정규 전체";
                            $("#search_set").innerHTML = text;
                            $("#mobilefilter_set").innerHTML = text;
                            //창 닫기
                            swal.close();
                            //검색 개시
                            card_search();
                        }
                        $("#popup_wild").onclick = function() {
                            //세트, 포맷 필터 변경
                            process.search.format = "야생";
                            process.search.set = "all";
                            //키워드 변경
                            let text = "야생 전체";
                            $("#search_set").innerHTML = text;
                            $("#mobilefilter_set").innerHTML = text;
                            //창 닫기
                            swal.close();
                            //검색 개시
                            card_search();
                        }
                        //선택창 상호작용
                        select_standard.onchange = function() {
                            //세트, 포맷 필터 변경
                            process.search.format = "정규";
                            process.search.set = select_standard.value;
                            //키워드 변경
                            let text = select_standard.options[select_standard.selectedIndex].text;
                            $("#search_set").innerHTML = text;
                            $("#mobilefilter_set").innerHTML = text;
                            //창 닫기
                            swal.close();
                            //검색 개시
                            card_search();
                        }
                        select_wild.onchange = function() {
                            //세트, 포맷 필터 변경
                            process.search.format = "야생";
                            process.search.set = select_wild.value;
                            //키워드 변경
                            let text = select_wild.options[select_wild.selectedIndex].text;
                            $("#search_set").innerHTML = text;
                            $("#mobilefilter_set").innerHTML = text;
                            //창 닫기
                            swal.close();
                            //검색 개시
                            card_search();
                        }
                    },
                    showConfirmButton:false,
                    showCancelButton:true,
                    cancelButtonText: '취소',
                    cancelButtonColor: '#d33'
                })
                    break;
                default:
                    break;
            }
        }
    }
        //직업 필터 작동
        filter_set("init");
        //직업 필터 상호작용
        $("#search_set").onclick = filter_set;
        $("#mobilefilter_set").onclick = filter_set;

    //검색어
    function filter_keyword(text) {
        //초기"글자" 설정
        if (text === "init") {
            //키워드 초기화
            process.search.keyword = "";
            //형광색 초기화
            $("#search_keyword").classList.remove("activate");
            $("#mobilefilter_keyword").classList.remove("activate");
            //"기본" 키워드
            let text = "검색어";
            $("#keyword_text").innerHTML = text;
            $("#keyword_text2").innerHTML = text;
        } else {
            //팝업창 열기
            swal({
                title: '검색어 설정',
                input: 'text',
                text: '카드의 이름, 텍스트, 종족, 종류를 검색합니다',
                inputPlaceholder: '검색어를 입력하세요',
                showCancelButton:true,
                confirmButtonText: '적용',
                cancelButtonText: '취소',
                cancelButtonColor: '#d33'
            }).then(function(result) {
                if (result) {
                    //검색 필터 변경
                    process.search.keyword = result;
                    //형광색 표시
                    $("#search_keyword").classList.add("activate");
                    $("#mobilefilter_keyword").classList.add("activate");
                    //키워드 변경
                    let text = result;
                    $("#keyword_text").innerHTML = text;
                    $("#keyword_text2").innerHTML = text;
                    //검색 개시
                    card_search();
                }
            })
        }
    }
        //직업 필터 작동
        filter_keyword("init");
        //직업 필터 상호작용
        function searchclick() {
            if (process.search.keyword === "") {
                filter_keyword();
            } else {
                filter_keyword("init");
                card_search();
            }
        }
        $("#search_keyword").onclick = searchclick;
        $("#mobilefilter_keyword").onclick = searchclick;

    //필터 리셋
    function filter_reset() {
        //검색 초기치 설정, 필터 활성화
        if (!process.search) process.search = {};
        //process.search.class = process.deck.class; //직업은 초기화하지 않음
        process.search.mana = "all";//마나
        process.search.rarity = "all";//등급
        process.search.set = "all";//세트
        process.search.format = process.deck.format;//포맷
        process.search.keyword = "";//키워드
        card_setFilter();//필터 다시 활성화

        //검색 초기치에 따라 검색결과 출력(최초 검색)
        card_search();
    }
    $("#search_reset").onclick = filter_reset;
    $("#mobilefilter_reset").onclick = filter_reset;

    //모바일 필터 열기
    $("#search_mobilefilter").onclick = function() {
        $("#frame_mobilefilter").classList.add("show");
        $("#frame_mobilefilter_reset").classList.add("show");
    }
        //모바일 필터 닫기
        $$(".mobilefilter_close").forEach(function(x) {
            x.onclick = function() {
                $("#frame_mobilefilter").classList.remove("show");
                $("#frame_mobilefilter_reset").classList.remove("show");
            }
        })
}

//카드 검색 및 출력
function card_search() {
    //로딩 이미지 출력
    $("#collection_loading").style.display = "block";

    setTimeout(function() {
        //0) 로딩 이미지 닫기
        $("#collection_loading").style.display = "none";
    },10);

    //1) 출력할 카드 목록 정리
    let arr = [];
    session.db.forEach(function(x) {
        if (x.cardClass === process.search.class &&//직업
        (x.rarity !== "FREE" || x.type !== "HERO") &&//기본 영웅 제외
        (x.rarity !== "HERO_SKIN" || x.type !== "HERO") &&//스킨 영웅 제외
        (DATA.SET_FORMAT[x.set] === "정규" || DATA.SET_FORMAT[x.set] === process.search.format) &&//포맷(정규는 무조건 포함)
        (process.search.mana === "all" || card_matchMana(x, process.search.mana) === true) &&//마나
        (process.search.rarity === "all" || x.rarity === process.search.rarity) &&//등급
        (process.search.set === "all" || x.set === process.search.set) &&//세트
        card_matchKeyword(x, process.search.keyword) === true) {
            arr.push(x.ssi);
        }
    })
        //카드 목록 저장
        process.search.result = arr;

    //2) 카드 목록에 따라 노드 불러오기
    cluster_update("collection",false);

    //검색된 카드 수량 표시
    $("#footer_name_left").innerHTML = "카드 목록(" + arr.length + ")";
}
