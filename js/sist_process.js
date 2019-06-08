
//===========================================================
//※ 함수 - 기타
//===========================================================
//마스터 카드 노드 생성
function card_generateMaster() {
    //요소 생성
    let elm_card = document.createElement("div.card.selectable");
        elm_card.classList.add("card_$dbfid");//$dbfid: 카드 구분기호
        elm_card.dataset.dbfid = "$dbfid";//$dbfid
        elm_card.classList.add("flash_hidden");//flash 대상은 이 클래스 제거
        elm_card.classList.add("unusable_hidden");//이용불가 대상은 이 클래스 제거
        //오프라인 모드가 아닐 경우에만 배경이미지 생성
        if (session.offline === false)
            //나머지: 타일 이미지 출력
            elm_card.style.backgroundImage = "url($url)";//$url: 카드 이미지 주소
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
//카드 개별 요소 생성
function card_generateFragment(info) {
    //마스터 노드 복사
    let fragment = session.masterNode;
    //필요한 정보 설정(수량 제외)
    fragment = fragment.replaceAll("$dbfid",info.dbfid);//인덱스 설정
    fragment = fragment.replace("$url",TILEURL + info.id + ".jpg");//이미지 설정: 타일 이미지
    fragment = fragment.replace("$cost",info.cost);//비용 설정
    fragment = fragment.replace("$name",info.name);//이름 설정
    fragment = fragment.replace("$rarity",info.rarity);//등급 설정
    //반환
    return fragment;
}

//마스터 덱 슬롯 생성
function deckslot_generateMaster() {
    //요소 생성
    let elm_slot = document.createElement("div.slot_button");
    let elm_number = document.createElement("div.slot_button_number");
        elm_number.innerHTML = "$number";
    elm_slot.appendChild(elm_number);
    let elm_date = document.createElement("div.slot_button_date");
        elm_date.innerHTML = "$date";
    elm_slot.appendChild(elm_date);
    let elm_main = document.createElement("button.slot_button_main");
        elm_main.dataset.id = "$id";
        elm_main.style.backgroundImage = "url($url)";
    elm_slot.appendChild(elm_main);
        let elm_mainCover = document.createElement("div.slot_button_mainCover");
        elm_main.appendChild(elm_mainCover);
            let elm_name = document.createElement("div.slot_button_name");
                elm_name.innerHTML = "$name";
            elm_mainCover.appendChild(elm_name);
            let elm_format = document.createElement("div.slot_button_format");
                elm_format.classList.add("$formatcolor");
                elm_format.innerHTML = "$format"
            elm_mainCover.appendChild(elm_format);
            let elm_quantity = document.createElement("div.slot_button_quantity");
                elm_quantity.innerHTML = "$quantity";
            elm_mainCover.appendChild(elm_quantity);
    let elm_delete = document.createElement("button.slot_button_delete");
        elm_delete.dataset.id = "$id";
        elm_delete.dataset.number = "$number";
    elm_slot.appendChild(elm_delete);

    //텍스트로 반환
    return elm_slot.outerHTML;
}
//덱 슬롯 개별 요소 생성
function deckslot_generateFragment(deck, number, key) {
    //마스터 슬롯 복사
    let fragment = session.masterSlot;
    //필요한 정보 설정
    fragment = fragment.replaceAll("$url",HEROURL + DATA.CLASS.ID[deck.class] + ".jpg");//직업 이미지
    fragment = fragment.replaceAll("$number",number.toString());//번호
    fragment = fragment.replaceAll("$date","편집: " + deck.date);//날짜
    fragment = fragment.replaceAll("$id",key);//이름
    fragment = fragment.replaceAll("$name",deck.name);//이름
    fragment = fragment.replaceAll("$quantity",deck.quantity.toString() + " / " + DATA.DECK_LIMIT.toString());//수량
    fragment = fragment.replaceAll("$formatcolor",DATA.FORMAT.EN[deck.format]);//대전방식 색상
    fragment = fragment.replaceAll("$format",deck.format + "전");//대전방식

    //반환
    return fragment;
}

//마스터 메타 덱 슬롯 생성
function metadeckslot_generateMaster() {
    //요소 생성
    let elm_metadeckslot = document.createElement("div.metadeckslot_button");
        let elm_number = document.createElement("div.metadeckslot_button_number");
            elm_number.innerHTML = "$number";
            elm_metadeckslot.appendChild(elm_number);
    let elm_main = document.createElement("button.metadeckslot_button_main");
        elm_main.dataset.deckcode = "$deckcode";
        elm_main.dataset.name = "$name";
        elm_main.dataset.format = "$format";
        elm_main.dataset.number = "$number";
        elm_main.style.backgroundImage = "url($url)";
    elm_metadeckslot.appendChild(elm_main);
        let elm_mainCover = document.createElement("div.metadeckslot_button_mainCover");
        elm_main.appendChild(elm_mainCover);
            let elm_name = document.createElement("div.metadeckslot_button_name");
                elm_name.innerHTML = "$name";
                elm_name.classList.add("$colorClass");
            elm_mainCover.appendChild(elm_name);
            let elm_class = document.createElement("div.metadeckslot_button_class");
                elm_class.innerHTML = "$class";
            elm_mainCover.appendChild(elm_class);
            let elm_dust_icon = document.createElement("img.metadeckslot_button_dust_icon");
                elm_dust_icon.src = "./images/icon_dust_black.png";
            elm_mainCover.appendChild(elm_dust_icon);
            let elm_dust = document.createElement("div.metadeckslot_button_dust");
                elm_dust.innerHTML = "$dust"
            elm_mainCover.appendChild(elm_dust);
            let elm_totalgame = document.createElement("div.metadeckslot_button_totalgame");
                elm_totalgame.innerHTML = "$totalgame";
            elm_mainCover.appendChild(elm_totalgame);
            let elm_winrate = document.createElement("div.metadeckslot_button_winrate");
                elm_winrate.innerHTML = "$winrate";
            elm_mainCover.appendChild(elm_winrate);

    //텍스트로 반환
    return elm_metadeckslot.outerHTML;
}
//메타 덱 슬롯 개별 요소 생성
function metadeckslot_generateFragment(deck, number, key) {
    //마스터 슬롯 복사
    let fragment = session.masterMetaSlot;
    //필요한 정보 설정
    fragment = fragment.replaceAll("$url",HEROURL + DATA.CLASS.ID[deck.class] + ".jpg");//직업 이미지
    fragment = fragment.replaceAll("$number","#" + number.toString());//순번
    fragment = fragment.replaceAll("$deckcode",deck.deckcode);//이름
    fragment = fragment.replaceAll("$name",deck.archetype_name);//덱 이름
    fragment = fragment.replaceAll("$format",deck.format);//덱 포맷
    fragment = fragment.replaceAll("$colorClass",deck.class);//덱 이름
    fragment = fragment.replaceAll("$class",DATA.CLASS.KR[deck.class]);//덱 이름
    fragment = fragment.replaceAll("$dust",thousand(deck.dust));//덱 이름
    fragment = fragment.replaceAll("$winrate","승률 " + (Math.round(deck.win_rate * 10) / 10).toString() + "%");//덱 이름
    fragment = fragment.replaceAll("$totalgame",thousand(deck.total_games) + "판");//수량

    //반환
    return fragment;
}


//카드 수량 찾기(by index)
function card_getQuantity(dbfid) {
    //덱에 카드 정보가 없으면 0 출력
    if (!process.deck || !process.deck.cards) return 0;
    else {
        //카드 정보를 찾으면 quantity 출력
        for (let i = 0;i < process.deck.cards.length;i++) {
            if (process.deck.cards[i][0] === dbfid)
                return process.deck.cards[i][1];
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
            deckarr.forEach(function(dbfid) {
                let quantity = card_getQuantity(dbfid);
                //덱이 30장 미만이고, 카드 없거나 카드가 1장일 때 전설이 아니면 카드 추가
                if (process.deck.quantity < DATA.DECK_LIMIT &&
                    (quantity <= 0 || (quantity === 1 && session.db[session.index[dbfid]].rarity !== "LEGENDARY"))) {
                    //로그 기록
                    if (log === true) log_record(cmd);
                    //수량이 0이면
                    if (quantity === 0) {
                        //카드정보 추가
                        let arr = [dbfid, 1];//[0] : 구분기호, [1] : quantity
                        process.deck.cards.push(arr);
                        //카드정보 정렬
                        process.deck.cards.sort(function(a,b) {
                            return (parseInt(session.index[a[0]]) < parseInt(session.index[b[0]])) ? -1 : 1;
                        })
                    //수량이 1이면 카드정보 찾아서 수량 추가
                    } else {
                        //1) 카드정보 변경
                        for (let i = 0;i < process.deck.cards.length;i++) {
                            let card = process.deck.cards[i];
                            if (card[0] === dbfid) {
                                card[1] += 1;
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
            deckarr.forEach(function(dbfid) {
                let quantity = card_getQuantity(dbfid);
                for (let i = 0;i < process.deck.cards.length;i++) {
                    let card = process.deck.cards[i];
                    if (card[0] === dbfid) {
                        //수량이 2 이상이면 수량 감소
                        if (card[1] >= 2) {
                            //수량 감소
                            card[1] -= 1;
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
        //카드 적용 : 우선 남겨둠
        /*case "set":
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

            break;*/
        //공통
        default:
            break;
    }

    //덱 임시저장
    deck_save();
}

//카드 최종 정보 생성
function card_addFragment(pos, dbfid, quantity, show1, flasharr) {
    //요소 불러오기
    let fragment = session.fragment[session.index[dbfid]];

    //플래시 정보 입력
    if (flasharr !== false && flasharr.indexOf(dbfid) >= 0) {
        fragment = fragment.replace(" flash_hidden","");
    }
    //수량 정보 입력
    let numtext = "";
        //수량이 1 이상
        if (quantity >= 1) {
            //전설이면 "별" 표기
            if (session.db[session.index[dbfid]].rarity === "LEGENDARY") {
                numtext = "★";
                fragment = fragment.replace(" quantity_hidden","");
            //전설이 아니면 수량 표기
            } else if (show1 === true || (show1 === false && quantity >= 2)) {
                numtext = quantity.toString();
                fragment = fragment.replace(" quantity_hidden","");
            }
        }//카드 수령이 0이면: 숨기기
    fragment = fragment.replace("$quantity",numtext);
    //샤용불가 정보 입력
    if (pos === "deck") {
        if (process.deck.format === "정규") {
            if (DATA.SET[session.db[session.index[dbfid]].set].FORMAT === "야생") {
                fragment = fragment.replace(" unusable_hidden","");
                process.deck.unusable += 1;
            }
        }
    }

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
                nodearr.push(card_addFragment("collection",x,card_getQuantity(x),true,latest));
            })
            //클러스터 업데이트
            clusterize.collection.update(nodearr);

            break;
        case "deck":
            arr = process.deck.cards;
            //사용불가 카드 수 계산 준비
            process.deck.unusable = 0;
            //클러스터 입력정보 준비
            arr.forEach(function(x) {
                nodearr.push(card_addFragment("deck",x[0],x[1],false,latest));
            })
            //클러스터 업데이트
            clusterize.deck.update(nodearr);

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
        //영웅 이미지 출력(오프라인 모드가 아니라면)
        if (session.offline === false)
            $("#deck_hero").style.backgroundImage = "url(" + HEROURL + DATA.CLASS.ID[process.deck.class] + ".jpg)";
        //덱 이름 출력
        if (process.deck.name) {
            $("#deck_name").innerHTML = process.deck.name
        } else {
            let deckname = "나만의 " + DATA.CLASS.KR[process.deck.class] + " 덱";
            process.deck.name = deckname;
            $("#deck_name").innerHTML = deckname;
        }
        //덱 출력
        cluster_update("deck", false, false);
    }
    //정규/야생 출력
    $("#deck_format").className = DATA.FORMAT.EN[process.deck.format];
    $("#deck_format").innerHTML = process.deck.format + "전";

    //덱 가루, 수량 확인
    let quantity = 0;
    let dust = 0;
    process.deck.cards.forEach(function(x) {
        quantity += x[1];
        dust += DATA.RARITY.DUST[session.db[session.index[x[0]]].rarity] * x[1];
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

//===========================================================
//※ 함수 - 덱 슬롯, 저장 관련
//===========================================================
//덱 슬롯 리프레시
function deckslot_refresh() {
    let slotarr = []
    localforage.getItem("sist_decks")
    .then(function(decks) {
        //저장된 덱이 있으면 불러오기
        if (decks) {
            let keys = Object.keys(decks);
            keys.sort(function(a,b) {
                return parseInt(a.replace("deck","")) - parseInt(b.replace("deck",""));
            })
            keys.forEach(function(key, index) {
                slotarr.push(deckslot_generateFragment(decks[key], index+1, key));
            })
        }
        //불러온 덱 목록 관리

        //클러스터 업데이트
        clusterize.slot.update(slotarr);
    })
}
//덱 임시저장
function deck_save() {
    //정식 저장: 해당되면 실시
    if (process.deck.favorite) {
        //불러오기
        localforage.getItem("sist_decks")
        .then(function(decks) {
            if (!decks) decks = {};

            //기존 덱 없으면 하나 만들기
            if (Object.keys(decks).indexOf(process.deck.favorite) < 0) {
                decks[process.deck.favorite] = {};
                decks[process.deck.favorite].initdate = thisdate();
            }
            //저장된 덱 슬롯 있으면 거기에 넣기
            let tempdate = decks[process.deck.favorite].initdate;
            decks[process.deck.favorite] = deepCopy(process.deck);
            decks[process.deck.favorite].initdate = tempdate;
            decks[process.deck.favorite].date = thisdate();//함수는 subtool.js 참고

            //저장소로 넘기기
            localforage.setItem("sist_decks",decks);
        })
        .catch(function(e) {
            console.log("기존 덱 정보 불러오기에 실패하였습니다.");
        })
    }

    //임시 저장: 반드시 실시
    let tempdeck = {};
    tempdeck = deepCopy(process.deck);
    //날짜
    tempdeck.date = thisdate();//함수는 subtool.js 참고
    //저장 및 문구 출력
    localforage.setItem("sist_tempdeck",tempdeck)
    .then(function(e) {
        console.log("saved(temp)");
    })
    .catch(function(e) {
        console.log("덱 임시저장에 실패하였습니다.");
    });
}
//덱 즐겨찾기 설정/해제
function deck_favorite(cmd, target) {
    //Promise
    return new Promise(function(resolve) {
        switch (cmd) {
            case "on":
                //덱카운트 불러오기
                localforage.getItem("sist_deckcount")
                .then(function(num) {
                    //덱카운트 없으면 "1" 만들기, 이후 적용
                    if (!num) {
                        let deckcount = 1;
                        localforage.setItem("sist_deckcount",deckcount)
                        .then(function(e) {
                            //덱 번호 적용
                            process.deck.favorite = "deck" + deckcount.toString();
                            console.log("a:" + process.deck.favorite);
                            //덱 저장
                            deck_save();
                            resolve();
                        })
                    //있으면 덱카운트 +1, 이후 적용
                    } else {
                        num += 1;
                        localforage.setItem("sist_deckcount",num)
                        .then(function(e) {
                            //덱 번호 적용
                            process.deck.favorite = "deck" + num.toString();
                            console.log("a:" + process.deck.favorite);
                            //덱 저장
                            deck_save();
                            resolve();
                        })
                    }
                })
                .catch(function(e) {
                    console.log("덱 즐겨찾기 설정에 실패하였습니다.");
                    resolve();
                })

                break;
            case "off":
                //즐겨찾기 해제 대상 선정
                let favorite = (target !== undefined) ? target : process.deck.favorite;
                //해당 번호가 있는지 확인
                localforage.getItem("sist_decks")
                .then(function(decks) {
                    //저장된 덱 목록 있으면 지우기
                    if (decks && Object.keys(decks).indexOf(favorite) >= 0) {
                        delete decks[favorite];
                        //덱 목록 적용
                        localforage.setItem("sist_decks",decks)
                        .then(function() {
                            //process.deck.favorite 있으면 지우기
                            if (process.deck.favorite) {
                                delete process.deck.favorite;
                                deck_save();
                            }
                            resolve();
                        })
                    } else {
                        //process.deck.favorite 있으면 지우기
                        if (process.deck.favorite) {
                            delete process.deck.favorite;
                            deck_save();
                        }
                        resolve();
                    }
                })
                .catch(function(e) {
                    resolve();
                })

                break;
        }
    })
}
//덱 불러오기
function deck_load() {

}

//===========================================================
//※ 실행
//===========================================================
document.addEventListener("DOMContentLoaded", function(e) {
    //로컬저장소 드라이버 설정
    localforage.config({
        name:"simplestone"
    })
    //서비스 워커 실행
    if ('serviceWorker' in navigator) {
        let newWorker;
        navigator.serviceWorker.register('./service-worker.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    switch (newWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                $("#frame_updatepopup").classList.add("show");
                                $("#updatepopup_refresh").addEventListener('click', function(){
                                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                                });
                                $("#updatepopup_cancel").addEventListener('click', function(){
                                    $("#frame_updatepopup").classList.remove("show");
                                });
                            }
                            
                            break;
                    }
                });
            });
        });

        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }
    //기본 화면 상호작용
        //인포 버튼
        $("#header_info").onclick = function() {
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

        //카드 클러스터 생성해두기
        clusterize.collection = new Clusterize({
            tag: 'div',
            scrollId: 'collection_list',
            contentId: 'collection_list_content',
            rows_in_block:14,
            no_data_text: '해당 직업 검색결과 없음',
            no_data_class: 'clusterize-no-data'
        });
        //덱 클러스터 생성해두기
        clusterize.deck = new Clusterize({
            tag: 'div',
            scrollId: 'deck_list',
            contentId: 'deck_list_content',
            rows_in_block:14,
            no_data_text: ''
        });
        //덱슬롯 클러스터 생성해두기
        clusterize.slot = new Clusterize({
            tag: 'div',
            scrollId: 'decklist_slot',
            contentId: 'decklist_slot_content',
            rows_in_block:14,
            no_data_text: '즐겨찾기 덱 없음'
        });
        //메타 덱 클러스터 생성해두기
        clusterize.metadeck = new Clusterize({
            tag: 'div',
            scrollId: 'metadeck_slot',
            contentId: 'metadeck_slot_content',
            rows_in_block:14,
            no_data_text: '검색 메타 덱 없음'
        });

        //종료 경고 메시지
        window.onbeforeunload = function() {
           return "사이트에서 나가시겠습니까?";
        };

    //공지사항, DB 버전 내려받기
    fetch("./notice.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(notice) {
        //URL 분석
        let url = new URL(window.location.href).searchParams;
        for (let key of url.keys()) {
            session.urlParams[key] = url.get(key);
        }
        //URL 패러미터에 '덱코드'가 있으면 공지사항 생략
        if (Object.keys(session.urlParams).length > 0 && session.urlParams.deckcode !== undefined) {
            window_shift("update", notice);
        //없으면 업데이트로 곧장 이동
        } else {
            window_shift("notice", notice);
        }
    })

});
//오류 취급 (출처 : http://stackoverflow.com/questions/951791/javascript-global-error-handling)
//localhost에서는 오류 창 띄우지 않기
if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    window.onerror = function(msg, url, line, col, error) {
        if (url && url.indexOf("/") >= 0 ) url = url.split("/")[url.split("/").length - 1];
        var site = !url ? '' : '* URL : ' + url + '\n';
        var extra = !col ? '' : ', Column : ' + col;
        extra += !error ? '' : '\n * 에러 : ' + error;
        var notice = " * 내용 : " + msg + "\n" + site + " * Line : " + line + extra;
        if (swal) {
            swal({
                title:"오류 발생",
                type:"error",
                html:"아래의 내용을 제보해주시면 감사하겠습니다.<br>" +
                "(<a href='https://blog.naver.com/ansewo/221319675157' target='_blank'>클릭하면 블로그로 이동합니다</a>)<br/>" +
                notice.replaceAll("\n","<br>")
            });
        } else alert("아래의 내용을 제보해주시면 감사하겠습니다.(https://blog.naver.com/ansewo/221319675157)\n" + notice);
        var suppressErrorAlert = true;
        return suppressErrorAlert;
    };
}
