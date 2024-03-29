
//===============================================================
//※ 카드 필터링, 검색 관련 함수
//===============================================================

//카드 정렬 - 배열(비용, 이름 순)
function sort_arr(arr) {
    let setZero = [NaN, null, undefined, Infinity]
    arr.sort(function(x,y) {
        if (setZero.indexOf(x.cost) >= 0 ) x.cost = -1
        if (setZero.indexOf(y.cost) >= 0 ) y.cost = -1
        if (x.cost !== y.cost) {
            return x.cost - y.cost
        } else {
            let order = [x.name,y.name]
            order.sort()
            if (x.name === order[0]) {
                return -1
            } else {
                return 1
            }
        }
    })

    return arr
}

//키워드 검색 가능하도록 정리
function searchable(keyword) {
    let text = keyword
    //불필요 기호 제거
    //text = text.replace(/\s|<b>|<\/b>|\n|\[x\]|\$|#|<i>|<\/i>|@|\.|,|(|)|:/g,"");
    let unseable = ["&nbsp;", " ", "<b>", "</b>", "\n", "<i>", "</i>", ".", ",", "/", "(", ")", ":", "( 남음!)", "(달성!)"]
    unseable.forEach(function(x) {
        text = text.replaceAll(x,"")
    })
    //소문자화
    text = text.toLowerCase()
    //반환
    return text
}
//텍스트 읽을 수 있도록 정리
function readable(text) {
    let replacable = ["\n"]
    replacable.forEach(x => {
        text = text.replaceAll(x,"<br>")
    })
    let unusable = ["( 남음!)", "(달성!)"]
    unusable.forEach(x => {
        text = text.replaceAll(x,"")
    })
    //반환
    return text
}
//텍스트 타이틀 변환
function titletext(text) {
    let replacable = ["\n"]
    replacable.forEach(function(x) {
        text = text.replaceAll(x," ")
    })
    //반환
    return text
}

//카드 비용 맞춰보기
function card_matchCost(target, cost) {
    switch (cost) {
        case "all"://전체: 무조건 통과
            return true
            break
        case "0"://비용 = 0
        case "1"://비용 = 1
        case "2"://비용 = 2
        case "3"://비용 = 3
        case "4"://비용 = 4
        case "5"://비용 = 5
        case "6"://비용 = 6
            if (target.cost === parseInt(cost)) return true
            break
        case "7"://비용 = 7 이상
            if (target.cost >= 7) return true
            break
        case "odd"://홀수
            if (target.cost % 2 === 1) return true
            break
        case "even"://짝수
            if (target.cost % 2 === 0) return true
            break
        default://오류 방지 - 통과
            return true
            break
    }

    //통과 못하면 제외
    return false
}

//카드 키워드 맞춰보기
function card_matchKeyword(target, keyword) {
    //필터가 비었으면 통과
    if (!keyword || keyword === "") return true
    //'&'로 키워드 쪼개기
    let keywordArr = []
    keyword.split("&").forEach(word => {
        keywordArr.push(word.trim())
    })
    //키워드 확인
    let searchedWord = []
    let list = ["name","text","minionType","cardType","spellSchool"]
    keywordArr.forEach(w => {
        for (let i = 0;i<list.length;i++) {
            if (target[list[i]] !== undefined) {
                if (target.keywords[list[i]].indexOf(w) >= 0) {
                    searchedWord.push(w)
                    break
                }
            }
        }
    })
    //쪼개진 키워드가 모두 검색되면 true
    if (searchedWord.length === keywordArr.length) {
        return true
    //그렇지 않으면 false
    } else {
        return false
    }
}

//카드 필터 구성
function card_cardSetFilter(cmd) {
    //초기 작업: 검색치 초기화 (카드 정보)
    if (cmd === "cardInfoInit") {
        //검색 초기치 설정, 필터 활성화
        if (!process.search) process.search = {};
        process.search.class = (process.deck.class) ? process.deck.class : "all"//전체 직업
        process.search.cost = "all"//비용
        process.search.rarity = "all"//등급
        process.search.set = (session.metadata.sets[0].slug) ? session.metadata.sets[0].slug : "all"//세트(만에 하나 오류가 나면 모든 세트)
        process.search.format = (session.metadata.sets[0].slug) ? session.metadata.sets[0].format : "야생"//포맷 - 최신 세트 포맷 적용, 없으면 야생
        process.search.keyword = ""//키워드
    //초기 작업: 검색치 초기화 (덱 빌딩)
    } else if (cmd === "deckBuildingInit") {
        //검색 초기치 설정, 필터 활성화
        if (!process.search) process.search = {};
        process.search.class = (process.deck.class) ? process.deck.class : "NEUTRAL"//직업(만에 하나 오류가 나면 중립 직업)
        process.search.cost = "all"//비용
        process.search.rarity = "all"//등급
        process.search.set = "all"//세트
        process.search.format = process.deck.format//포맷
        process.search.keyword = ""//키워드
    }

    //직업
    function filter_class(text) {
        //초기"글자" 설정
        if (text === "init") {
            //모든 직업 : 해당 키워드 출력
            if (process.search.class === "all" || process.search.class === "ALL") {
                $("#search_class").innerHTML = "모든 직업"
            } else {
                //검색 직업을 알 수 없으면 "전사"로 지정
                if (session.classInfo[process.search.class] === undefined) {
                    process.search.class === "WARRIOR"
                }
                //검색 직업명 출력
                $("#search_class").innerHTML = session.classInfo[process.search.class].name
            }
        //버튼 클릭
        } else {
            //카드 정보
            if (process.state === "cardinfo") {
                //직업을 분석하여 버튼 추가 준비
                let htmlText = ''+
                '<button id="popup_class_all" class="popup_button full" data-class="all">모든 직업</button>' +
                '$classBtns' +
                '<button id="popup_class_NEUTRAL" class="popup_button full" data-class="NEUTRAL">중립</button>'
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
                swal({
                    title: '카드 직업 검색',
                    html:htmlText,
                    onOpen:function() {
                        //현재 직업 검색필터 보여주기
                        $("#popup_class_" + process.search.class).classList.add("selected");
                        //검색 결과가 없는 필터 흐릿하게 만들기
                        let searchArr = process.search.allClassResult;
                        session.metadata.classes.forEach(x => {
                            if (x.slug !== "ALL" && $("#popup_class_" + x.slug) !== undefined) {
                                let haveCard = 0;
                                for (let i =0;i < searchArr.length;i++) {
                                    if (session.db[session.dbIndex[searchArr[i].toString()]].class.slug === x.slug) {
                                        haveCard = 1;
                                        break;
                                    }
                                }
                                if (haveCard === 0) $("#popup_class_" + x.slug).classList.add("noCard");
                            }
                        })

                        //버튼 상호작용
                        $$(".popup_button").forEach(x => {
                            x.onclick = function() {
                                //직업 필터 변경
                                let classtext = x.dataset.class
                                process.search.class = classtext
                                //키워드 변경
                                let krtext = ""
                                if (classtext === "all") {
                                    krtext = "모든 직업"
                                } else {
                                    krtext = session.classInfo[classtext].name
                                }
                                $("#search_class").innerHTML = krtext
                                //창 닫기
                                swal.close()
                                //검색 개시
                                card_search()
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
                $("#search_class").innerHTML = session.classInfo[process.search.class].name
                //재검색
                card_search()
            }

        }
    }
        //직업 필터 작동
        filter_class("init");
        //직업 필터 상호작용
        $("#search_class").onclick = function() {
            filter_class();
        }

    //비용
    function filter_cost(text) {
        //초기"글자" 설정
        if (text === "init") {
            //"전체" 키워드
            let text = "비용 : 전체";
            $("#search_cost").innerHTML = text;
            $("#mobilefilter_cost").innerHTML = text;
        } else {
            //팝업창 열기
            swal({
                title: '카드 비용 검색',
                html:
                  '<button id="popup_cost_all" class="popup_button full" data-cost="전체">전체</button>' +
                  '<button id="popup_cost_0" class="popup_button" data-cost="0"><img src="./images/cost_blue.png">0</button>' +
                  '<button id="popup_cost_1" class="popup_button" data-cost="1"><img src="./images/cost_blue.png">1</button>' +
                  '<button id="popup_cost_2" class="popup_button" data-cost="2"><img src="./images/cost_blue.png">2</button>' +
                  '<button id="popup_cost_3" class="popup_button" data-cost="3"><img src="./images/cost_blue.png">3</button>' +
                  '<button id="popup_cost_4" class="popup_button" data-cost="4"><img src="./images/cost_blue.png">4</button>' +
                  '<button id="popup_cost_5" class="popup_button" data-cost="5"><img src="./images/cost_blue.png">5</button>' +
                  '<button id="popup_cost_6" class="popup_button" data-cost="6"><img src="./images/cost_blue.png">6</button>' +
                  '<button id="popup_cost_7" class="popup_button" data-cost="7"><img src="./images/cost_blue.png">7+</button>' +
                  '<button id="popup_cost_odd" class="popup_button" data-cost="홀수">홀수</button>' +
                  '<button id="popup_cost_even" class="popup_button" data-cost="짝수">짝수</button>',
                onOpen:function() {
                    //현재 비용 검색필터 보여주기
                    $("#popup_cost_" + process.search.cost).classList.add("selected");
                    //버튼 상호작용
                    $$(".popup_button").forEach(function(x) {
                        x.onclick = function() {
                            //비용 필터 변경
                            process.search.cost = x.id.replace("popup_cost_","");
                            //키워드 변경
                            let text = "비용 : " + x.dataset.cost;
                            $("#search_cost").innerHTML = text;
                            $("#mobilefilter_cost").innerHTML = text;
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
        filter_cost("init");
        //직업 필터 상호작용
        $("#search_cost").onclick = filter_cost;
        $("#mobilefilter_cost").onclick = filter_cost;

    //등급
    function filter_rarity(text) {
        //초기"글자" 설정
        if (text === "init") {
            //"전체" 키워드
            let text = "등급 : 전체";
            $("#search_rarity").innerHTML = text;
            $("#mobilefilter_rarity").innerHTML = text;
        } else {
            //등급을 분석하여 버튼 추가 준비
            let htmlText = '<button id="popup_rarity_all" class="popup_button full" data-rarity="전체">전체</button>' +
                '$rarityBtns'
            let btnText = ""
            let rarityArr = []
            session.metadata.rarities.forEach(r => {
                rarityArr.push({slug:r.slug.toUpperCase(), name:r.name, id:r.id})
            })
            rarityArr.sort((a,b) => {
                let order = [a.id,b.id]
                order.sort()
                if (a.id === order[0]) {
                    return -1
                } else {
                    return 1
                }
            })
            rarityArr.forEach((r, i) => {
                let btn = document.createElement("button")
                    btn.id = "popup_rarity_" + r.slug
                    btn.classList.add("popup_button","full")
                    btn.dataset.rarity = r.name
                    btn.innerHTML = r.name + " 카드"
                btnText += btn.outerHTML
            })
            htmlText = htmlText.replace("$rarityBtns",btnText)
            //팝업창 열기
            swal({
                title: '카드 등급 검색',
                html:htmlText,
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
    function filter_cardSet(text) {
        //초기"글자" 설정
        if (text === "init") {
            //"전체" 키워드
            let formattext = "";
            switch (process.deck.format) {
                case "정규":
                    formattext = "세트 : 전체"
                    break
                case "야생":
                    formattext = "세트／포맷"
                    break
                case "클래식":
                    formattext = "클래식"
                    break
                case "검색":
                    formattext = "세트／포맷"
                    break
            }
            $("#search_cardSet").innerHTML = formattext
            $("#mobilefilter_cardSet").innerHTML = formattext
        } else {
            //정규전: button형, 야생전: select형
            switch (process.deck.format) {
                case "정규":
                    //세트 버튼 구성
                    let text = ""
                    //"전체" 세트 추가
                    let btn1 = document.createElement("button")
                        btn1.id = "popup_cardSet_all"
                        btn1.classList.add("popup_button","small")
                        btn1.dataset.set = "전체"
                        btn1.innerHTML = "전체"
                    text += btn1.outerHTML
                    //개별 세트 추가
                    let setarr = session.metadata.sets
                    setarr.forEach(set => {
                        if (set.format === "정규") {
                            let btn2 = document.createElement("button")
                                btn2.id = "popup_cardSet_" + set.slug
                                btn2.classList.add("popup_button","small")
                                btn2.dataset.set = set.name
                                btn2.innerHTML = set.name
                            text += btn2.outerHTML
                        }
                    })
                    //팝업창 열기
                    swal({
                        title: '카드 세트 검색',
                        html:text,
                        onOpen:function() {
                            //현재 세트 검색필터 보여주기
                            $("#popup_cardSet_" + process.search.set).classList.add("selected");
                            //버튼 상호작용
                            $$(".popup_button").forEach(x => {
                                x.onclick = function() {
                                    //세트 필터 변경
                                    process.search.set = x.id.replace("popup_cardSet_","");
                                    //키워드 변경
                                    let text = x.dataset.set;
                                    $("#search_cardSet").innerHTML = text;
                                    $("#mobilefilter_cardSet").innerHTML = text;
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
                            let select_standard = $("#popup_select_standard")
                            let select_wild = $("#popup_select_wild")
                            //정규 세트
                                //"타이틀" 추가
                                select_standard.options[0] = new Option("개별 세트(정규)")
                                select_standard.options[0].disabled = true
                                //개별 세트
                                let setarr = session.metadata.sets
                                setarr.forEach(set => {
                                    if (set.format === "정규") {
                                        select_standard.options[select_standard.options.length] = new Option(set.name,set.slug)
                                        //현재 검색필터 세트이면 강조
                                        if (set.slug === process.search.set) {
                                            select_standard.options[select_standard.options.length-1].selected = true
                                        }
                                    }
                                })
                            //야생 세트
                                //"타이틀" 추가
                                select_wild.options[0] = new Option("개별 세트(야생)")
                                select_wild.options[0].disabled = true
                                //개별 세트
                                let setarr2 = session.metadata.sets
                                setarr2.forEach(set => {
                                    if (set.format === "야생") {
                                        select_wild.options[select_wild.options.length] = new Option(set.name,set.slug)
                                        //현재 검색필터 세트이면 강조
                                        if (set.slug === process.search.set) {
                                            select_wild.options[select_wild.options.length-1].selected = true
                                        }
                                    }
                                })
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
                                $("#search_cardSet").innerHTML = text;
                                $("#mobilefilter_cardSet").innerHTML = text;
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
                                $("#search_cardSet").innerHTML = text;
                                $("#mobilefilter_cardSet").innerHTML = text;
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
                                $("#search_cardSet").innerHTML = text;
                                $("#mobilefilter_cardSet").innerHTML = text;
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
                                $("#search_cardSet").innerHTML = text;
                                $("#mobilefilter_cardSet").innerHTML = text;
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
                case "클래식":
                    //클래식은 단일 세트/포맷
                    nativeToast({
                        message: '클래식 모드는 단일 세트(오리지널 세트)로 구성되어 있습니다.',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    });

                    break
                case "검색":
                    //팝업창 열기
                    swal({
                        title: '세트／포맷 검색',
                        html:
                          '<button id="popup_standrad" class="popup_button" data-rarity="정규">정규 전체</button>' +
                          '<button id="popup_wild" class="popup_button" data-rarity="야생">야생 전체</button>'+
                          '<select id="popup_select_standard" class="popup_select swal2-select" style="display: block;"></select>'+
                          '<select id="popup_select_wild" class="popup_select swal2-select" style="display: block;"></select>'+
                          '<button id="popup_classic" class="popup_button full" data-rarity="클래식">클래식</button>',
                        onOpen:function() {
                            //선택창 구성
                            let select_standard = $("#popup_select_standard")
                            let select_wild = $("#popup_select_wild")
                            //정규 세트
                                //"타이틀" 추가
                                select_standard.options[0] = new Option("개별 세트(정규)")
                                select_standard.options[0].disabled = true
                                //개별 세트
                                let setarr = session.metadata.sets
                                setarr.forEach(set => {
                                    if (set.format === "정규") {
                                        select_standard.options[select_standard.options.length] = new Option(set.name,set.slug)
                                        //현재 검색필터 세트이면 강조
                                        if (set.slug === process.search.set) {
                                            select_standard.options[select_standard.options.length-1].selected = true
                                        }
                                    }
                                })
                            //야생 세트
                                //"타이틀" 추가
                                select_wild.options[0] = new Option("개별 세트(야생)")
                                select_wild.options[0].disabled = true
                                //개별 세트
                                let setarr2 = session.metadata.sets
                                setarr2.forEach(set => {
                                    if (set.format === "야생") {
                                        select_wild.options[select_wild.options.length] = new Option(set.name,set.slug)
                                        //현재 검색필터 세트이면 강조
                                        if (set.slug === process.search.set) {
                                            select_wild.options[select_wild.options.length-1].selected = true
                                        }
                                    }
                                })
                            //버튼 상호작용
                            if (process.search.format === "정규" && process.search.set === "all") {
                                $("#popup_standrad").classList.add("selected")
                            } else if (process.search.format === "야생" && process.search.set === "all") {
                                $("#popup_wild").classList.add("selected")
                            } else if (process.search.format === "클래식" && process.search.set === "all") {
                                $("#popup_classic").classList.add("selected")
                            }
                            $("#popup_standrad").onclick = function() {
                                //세트, 포맷 필터 변경
                                process.search.format = "정규";
                                process.search.set = "all";
                                //키워드 변경
                                let text = "정규 전체";
                                $("#search_cardSet").innerHTML = text;
                                $("#mobilefilter_cardSet").innerHTML = text;
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
                                $("#search_cardSet").innerHTML = text;
                                $("#mobilefilter_cardSet").innerHTML = text;
                                //창 닫기
                                swal.close();
                                //검색 개시
                                card_search();
                            }
                            $("#popup_classic").onclick = function() {
                                //세트, 포맷 필터 변경
                                process.search.format = "클래식";
                                process.search.set = "all";
                                //키워드 변경
                                let text = "클래식";
                                $("#search_cardSet").innerHTML = text;
                                $("#mobilefilter_cardSet").innerHTML = text;
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
                                $("#search_cardSet").innerHTML = text;
                                $("#mobilefilter_cardSet").innerHTML = text;
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
                                $("#search_cardSet").innerHTML = text;
                                $("#mobilefilter_cardSet").innerHTML = text;
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
        filter_cardSet("init");
        //직업 필터 상호작용
        $("#search_cardSet").onclick = filter_cardSet;
        $("#mobilefilter_cardSet").onclick = filter_cardSet;

    //검색어
    function filter_keyword(text) {
        //초기"글자" 설정
        if (text === "init") {
            //키워드 초기화
            process.search.keyword = ""
            //형광색 초기화
            $("#search_keyword").classList.remove("activate")
            $("#mobilefilter_keyword").classList.remove("activate")
            //"기본" 키워드
            let text = "검색어"
            $("#keyword_text").innerHTML = text
            $("#keyword_text2").innerHTML = text
        } else {
            //팝업창 열기
            swal({
                title: '검색어 설정',
                input: 'text',
                html: '이름, 종류, 텍스트, 하수인종족, 주문계열 검색가능<br><b>※ \'&\' 연산자를 지원합니다(예시 : 주문&신성)</b>',
                inputPlaceholder: '검색어를 입력하세요',
                showCancelButton:true,
                confirmButtonText: '적용',
                cancelButtonText: '취소',
                cancelButtonColor: '#d33'
            }).then(function(result) {
                if (result) {
                    //검색 필터 변경
                    process.search.keyword = result
                    //형광색 표시
                    $("#search_keyword").classList.add("activate")
                    $("#mobilefilter_keyword").classList.add("activate")
                    //키워드 변경
                    let text = result
                    $("#keyword_text").innerHTML = text
                    $("#keyword_text2").innerHTML = text
                    //검색 개시
                    card_search("keyword")
                }
            })
        }
    }
        //직업 필터 작동
        filter_keyword("init")
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
        process.search.cost = "all"//비용
        process.search.rarity = "all"//등급
        process.search.set = "all"//세트
        process.search.format = process.deck.format//포맷
        process.search.keyword = ""//키워드
        card_cardSetFilter()//필터 다시 활성화

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

//필터에 따라 카드 검색
function card_getSearchResult(className) {
    //검색 키워드가 있다면 검색용으로 쓸 수 있도록 처리해주기
    let keyword = "";
    if (process.search.keyword) keyword = searchable(process.search.keyword);
    //정해둔 직업으로 카드 검색
    let arr = []
    session.db.forEach(function(card) {
        if (card.collectible === 1 && (!card.removed || card.removed !== true) &&//수집가능한 카드만 검색 & 금지가 아닌 카드만 가능
            //직업
            (className === "all" ||//"모든 직업"이면 다 출력
            (card.multiClass.length === 0 &&//다중직업 없으면
                card.class.slug === className//카드 직업이 검색명 포함해야
            ) ||
            (card.multiClass.length > 0 &&//다중직업 있으면
                card.multiClass.indexOf(className) >= 0//다중 직업이 검색명 포함해야
            )) &&
            //포맷
            (card.cardSet.slug !== "ETC" &&
                //클래식 - 클래식 포맷만 검색
                (process.search.format === "클래식" &&
                    card.cardSet.format === "클래식") ||
                //그외
                (process.search.format !== "클래식" &&
                    (card.cardSet.format === "정규" ||//정규 - 정규
                    card.cardSet.format === process.search.format))) &&//야생 - 정규 + 야생
            //직업 외 조건
            (card.cardType.slug !== "HERO" || card.rarity.slug !== "FREE") &&//기본 영웅 제외
            (card.cardType.slug !== "HERO" || card.cardSet.slug !== "ETC") &&//스킨 영웅 제외 : "알 수 없는 세트(17) 소속 카드"
            (process.search.cost === "all" || card_matchCost(card, process.search.cost) === true) &&//비용
            (process.search.rarity === "all" || card.rarity.slug === process.search.rarity) &&//등급
            (process.search.set === "all" || card.cardSet.slug === process.search.set) &&
        card_matchKeyword(card, keyword) === true) {
            arr.push(card.id)
        }
    })

    //검색된 결과 수량 출력
    console.log(arr.length.toString() + "장 검색됨")
    return arr
}

//카드 검색
async function card_search(action) {
    //로딩 이미지 출력
    $("#collection_list_loading").style.display = "block";
    $("#collection_illust_loading").style.display = "block";

    setTimeout(function() {
        //0) 로딩 이미지 닫기
        $("#collection_list_loading").style.display = "none";
        $("#collection_illust_loading").style.display = "none";
    },10);

    //검색 결과물 준비
    let arrResult = [];
    //키워드 검색 - 각 직업별로 검색
    if (action === "keyword") {
        //검색 직업으로 카드 검색
        arrResult = card_getSearchResult(process.search.class);
        //검색 결과 있으면
        if (arrResult.length > 0) {
            //출력
            card_showResult(arrResult);
            return//종료
        }
        //(없으면) 검색 직업 임시저장
        let firstClass = process.search.class
        //최초 검색 임시저장(딥 카피)
        let firstResuht = deepCopy(arrResult)
        //직업 목록 불러오기 (cardinfo or deckbuilding)
        let classArr = []
        //"카드 정보 보기"라면
        if (process.state === "cardinfo") {
            //(현 직업 빼고) 전 직업 집어넣기
            session.metadata.classes.forEach(x => {
                if (x.slug !== "ALL") {
                    if (x.name !== process.search.class) classArr.push(x.slug)
                }
            })
        //"덱 짜기"라면
        } else if (process.state === "deckbuilding") {
            //검색 직업이 중립
            if (process.search.class === "NEUTRAL") classArr.push(process.deck.class)
            else classArr.push("NEUTRAL")
        }
        for (let i = 0;i < classArr.length;i++) {
            //검색 직업 변경 후 검색
            process.search.class = classArr[i]
            //결과가 나오면
                arrResult = card_getSearchResult(process.search.class)
                if (arrResult.length > 0) {
                    //상단 직업 버튼 변경
                    $("#search_class").innerHTML = session.classInfo[process.search.class].name
                    //직업 변경 팝업
                    nativeToast({
                        message: '키워드 검색 결과에 따른<br>직업 필터링 변경<br>(' + session.classInfo[firstClass].name + ' -> ' + session.classInfo[process.search.class].name + ')',
                        position: 'center',
                        timeout: 2000,
                        type: 'success',
                        closeOnClick: 'true'
                    })
                    //출력
                    card_showResult(arrResult)
                    return//중단
                }
        }
        //(모든 결과가 없으면) 검색 직업 복원
        process.search.class = firstClass
        //최초 결과로 복원
        arrResult = firstResuht
        //출력
        card_showResult(arrResult)
    //그 외 - 현재 직업으로만 검색
    } else {
        arrResult = card_getSearchResult(process.search.class)
        //출력
        card_showResult(arrResult)
    }
}

//카드 출력
function card_showResult(arr) {
    //카드 목록 저장
    process.search.result = arr
        //전체 직업 카드 목록 저장(필터링용)
        process.search.allClassResult = card_getSearchResult("all")

    //카드 정보 카드 일러스트에 노드 불러오기
    if (process.state === "cardinfo" && session.setting.cardinfo_form === "illust") {
        cluster_update("collection_illust",false)
        $("#collection_illust_result").scrollTop = 0
    //카드 리스트에 노드 불러오기
    } else {
        cluster_update("collection_list",false)
        $("#collection_list_result").scrollTop = 0
    }

}
