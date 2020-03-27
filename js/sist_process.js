
//===========================================================
//※ 함수 - 기타
//===========================================================
//마스터 카드 노드 생성
function card_generateMaster() {
    //요소 생성
    let elm_card = document.createElement("div.card.selectable")
        elm_card.classList.add("card_$id")//$id: 카드 구분기호
        elm_card.dataset.id = "$id"//$id
        elm_card.classList.add("background_tile")//tile 백그라운드(일러스트 활룡 시 background_illust로 전환)
        elm_card.classList.add("flash_hidden")//flash 대상은 이 클래스 제거
        elm_card.classList.add("unusable_hidden")//이용불가 대상은 이 클래스 제거
        //오프라인 모드가 아닐 경우에만 배경이미지 생성
        /*if (session.offline === false)*/
            //나머지: 타일 이미지 출력
            elm_card.style.backgroundImage = "url($url)"//$url: 카드 이미지 주소
    let elm_card_cost = document.createElement("div.card_cost")
        elm_card_cost.classList.add("rarity_$rarity")//$rarity: 카드 희귀도
        elm_card_cost.innerHTML = "$cost"//$cost: 카드 비용
    let elm_card_name = document.createElement("div.card_name")
        let elm_card_name_text = document.createElement("p")
            elm_card_name_text.innerHTML = "$name"//$name: 카드 이름
        elm_card_name.appendChild(elm_card_name_text)
    let elm_card_quantity = document.createElement("div.card_quantity")
        elm_card_quantity.innerHTML = "$quantity"//$quantity: 카드 수량
        elm_card_quantity.classList.add("quantity_hidden")//$hidden: 수량 표기여부
    //요소 합치기
    elm_card.appendChild(elm_card_cost)
    elm_card.appendChild(elm_card_name)
    elm_card.appendChild(elm_card_quantity)
    //출력
    return elm_card.outerHTML
}
//카드 개별 요소 생성
function card_generateFragment(info) {
    //마스터 노드 복사
    let fragment = session.masterNode
    //필요한 정보 설정(수량 제외)
    fragment = fragment.replaceAll("$id",info.id)//인덱스 설정
    if (info.tileId !== undefined) {
        //이미지 설정: 타일 이미지(미리 등록해둔 이미지 사용)
        fragment = fragment.replace("$url",TILEURL + info.id + ".jpg")
    } else if (info.cropImage !== undefined) {
        //이미지 설정: 타일 이미지(등록된 게 없어서 블리자드 이미지 사용)
        fragment = fragment.replace("$url",info.cropImage)
    } else if (info.image !== undefined) {
        //이미지 설정: 카드 일러스트 (카드가 없음)
        fragment = fragment.replace("$url",info.image)
        fragment = fragment.replace("background_tile","background_illust")
    }
    fragment = fragment.replace("$cost",info.cost)//비용 설정
    fragment = fragment.replace("$name",info.name)//이름 설정
    fragment = fragment.replace("$rarity",info.rarity.slug)//등급 설정
    //반환
    return fragment
}

//마스터 카드_일러스트 노드 생성
function cardIllust_generateMaster() {
    //요소 생성
    let elm_card = document.createElement("div.card_illust")
        elm_card.classList.add("cardllust_$id")//$id: 카드 구분기호
        elm_card.dataset.id = "$id"//$id
        elm_card.style.backgroundImage = "url($url), url('../images/loading_white.svg')"//$url: 카드 이미지 주소
    //출력
    return elm_card.outerHTML
}
//카드_일러스트 개별 요소 생성
function cardIllust_generateFragment(info) {
    //마스터 노드 복사
    let fragment = session.masterNodeIllust
    //아이디 설정
    fragment = fragment.replaceAll("$id",info.id.toString())
    //이미지 설정: 카드 일러스트
    fragment = fragment.replace("$url",info.image)
    //반환
    return fragment
}

//마스터 덱 슬롯 생성
function deckslot_generateMaster() {
    //요소 생성
    let elm_slot = document.createElement("div.slot_button")
    let elm_number = document.createElement("div.slot_button_number")
        elm_number.innerHTML = "$number"
    elm_slot.appendChild(elm_number)
    let elm_date = document.createElement("div.slot_button_date")
        elm_date.innerHTML = "$date"
    elm_slot.appendChild(elm_date)
    let elm_main = document.createElement("button.slot_button_main")
        elm_main.dataset.id = "$id"
        elm_main.style.backgroundImage = "url($url)"
    elm_slot.appendChild(elm_main)
        let elm_mainCover = document.createElement("div.slot_button_mainCover")
        elm_main.appendChild(elm_mainCover)
            let elm_name = document.createElement("div.slot_button_name")
                elm_name.innerHTML = "$name"
            elm_mainCover.appendChild(elm_name)
            let elm_format = document.createElement("div.slot_button_format")
                elm_format.classList.add("$formatcolor")
                elm_format.innerHTML = "$format"
            elm_mainCover.appendChild(elm_format)
            let elm_quantity = document.createElement("div.slot_button_quantity")
                elm_quantity.innerHTML = "$quantity"
            elm_mainCover.appendChild(elm_quantity)
    let elm_delete = document.createElement("button.slot_button_delete")
        elm_delete.dataset.id = "$id"
        elm_delete.dataset.number = "$number"
    elm_slot.appendChild(elm_delete)

    //텍스트로 반환
    return elm_slot.outerHTML
}
//덱 슬롯 개별 요소 생성
function deckslot_generateFragment(deck, number, key) {
    //마스터 슬롯 복사
    let fragment = session.masterSlot
    //필요한 정보 설정
    fragment = fragment.replaceAll("$url",HEROURL + deck.class + ".jpg")//직업 이미지
    fragment = fragment.replaceAll("$number",number.toString())//번호
    fragment = fragment.replaceAll("$date","편집: " + deck.date)//날짜
    fragment = fragment.replaceAll("$id",key)//이름
    fragment = fragment.replaceAll("$name",deck.name)//이름
    fragment = fragment.replaceAll("$quantity",deck.quantity.toString() + " / " + DATA.DECK_LIMIT.toString())//수량
    fragment = fragment.replaceAll("$formatcolor",DATA.FORMAT.EN[deck.format])//대전방식 색상
    fragment = fragment.replaceAll("$format",deck.format + "전")//대전방식

    //반환
    return fragment
}

//마스터 메타 덱 슬롯 생성
function metadeckslot_generateMaster() {
    //요소 생성
    let elm_metadeckslot = document.createElement("div.metadeckslot_button")
        let elm_number = document.createElement("div.metadeckslot_button_number")
            elm_number.innerHTML = "$number"
            elm_metadeckslot.appendChild(elm_number)
    let elm_main = document.createElement("button.metadeckslot_button_main")
        elm_main.dataset.deckcode = "$deckcode"
        elm_main.dataset.name = "$name"
        elm_main.dataset.format = "$format"
        elm_main.dataset.number = "$number"
        elm_main.style.backgroundImage = "url($url)"
    elm_metadeckslot.appendChild(elm_main)
        let elm_mainCover = document.createElement("div.metadeckslot_button_mainCover")
        elm_main.appendChild(elm_mainCover)
            let elm_name = document.createElement("div.metadeckslot_button_name")
                elm_name.innerHTML = "$name"
                elm_name.classList.add("$colorClass")
            elm_mainCover.appendChild(elm_name)
            let elm_class = document.createElement("div.metadeckslot_button_class")
                elm_class.innerHTML = "$class"
            elm_mainCover.appendChild(elm_class)
            let elm_dust_icon = document.createElement("img.metadeckslot_button_dust_icon")
                elm_dust_icon.src = "./images/icon_dust_black.png"
            elm_mainCover.appendChild(elm_dust_icon)
            let elm_dust = document.createElement("div.metadeckslot_button_dust")
                elm_dust.innerHTML = "$dust"
            elm_mainCover.appendChild(elm_dust)
            let elm_totalgame = document.createElement("div.metadeckslot_button_totalgame")
                elm_totalgame.innerHTML = "$totalgame"
            elm_mainCover.appendChild(elm_totalgame)
            let elm_winrate = document.createElement("div.metadeckslot_button_winrate")
                elm_winrate.innerHTML = "$winrate"
            elm_mainCover.appendChild(elm_winrate)

    //텍스트로 반환
    return elm_metadeckslot.outerHTML
}
//메타 덱 슬롯 개별 요소 생성
function metadeckslot_generateFragment(deck, number, key) {
    //마스터 슬롯 복사
    let fragment = session.masterMetaSlot
    //필요한 정보 설정
    fragment = fragment.replaceAll("$url",HEROURL + deck.class + ".jpg")//직업 이미지
    fragment = fragment.replaceAll("$number","#" + number.toString())//순번
    fragment = fragment.replaceAll("$deckcode",deck.deckcode)//이름
    fragment = fragment.replaceAll("$name",deck.archetype_name)//덱 이름
    fragment = fragment.replaceAll("$format",deck.format)//덱 포맷
    fragment = fragment.replaceAll("$colorClass",deck.class)//덱 이름
    fragment = fragment.replaceAll("$class",session.classInfo[deck.class].name)//덱 이름
    fragment = fragment.replaceAll("$dust",thousand(deck.dust))//덱 이름
    fragment = fragment.replaceAll("$winrate","승률 " + (Math.round(deck.win_rate * 10) / 10).toString() + "%")//덱 이름
    fragment = fragment.replaceAll("$totalgame",thousand(deck.total_games) + "판")//수량

    //반환
    return fragment
}

//카드 수량 찾기(by index)
function card_getQuantity(id) {
    //덱에 카드 정보가 없으면 0 출력
    if (!process.deck || !process.deck.cards) return 0
    else {
        //카드 정보를 찾으면 quantity 출력
        for (let i = 0;i < process.deck.cards.length;i++) {
            if (parseInt(process.deck.cards[i][0]) === id)
                return process.deck.cards[i][1]
        }
        //못찾았으면 0 출력
        return 0
    }
}

//카드 추가 & 제거 & 적용
function card_move(cmd, log) {
    //커맨드 쪼개기
    let cmdarr = cmd.split(" ")
    let movement = cmdarr[0]
    let deckarr = []
    //명령 구분
    switch (movement) {
        //카드 추가
        case "add":
            //움직인 카드 수 기억
            let movednum = 0
            //카드 분류
            for (let i = 1;i < cmdarr.length;i++) {
                deckarr.push(parseInt(cmdarr[i]))
            }
            //카드 추가
            deckarr.forEach(id => {
                let card = session.db[session.dbIndex[id.toString()]]
                let quantity = card_getQuantity(id)
                //덱이 30장 미만이고, 카드 없거나 카드가 1장일 때 전설이 아니면 카드 추가
                if (process.deck.quantity < DATA.DECK_LIMIT &&
                    (quantity <= 0 || (quantity === 1 && card.rarity.slug !== "LEGENDARY"))) {
                    //로그 기록
                    if (log === true) log_record(cmd)
                    //수량이 0이면
                    if (quantity === 0) {
                        //카드정보 추가
                        let arr = [id, 1]//[0] : 구분기호, [1] : quantity
                        process.deck.cards.push(arr)
                        //카드정보 정렬
                        process.deck.cards.sort(function(a,b) {
                            let aIndex = session.dbIndex[a[0].toString()]
                            let bIndex = session.dbIndex[b[0].toString()]
                            return (aIndex < bIndex) ? -1 : 1
                        })
                    //수량이 1이면 카드정보 찾아서 수량 추가
                    } else {
                        //1) 카드정보 변경
                        for (let i = 0;i < process.deck.cards.length;i++) {
                            let card = process.deck.cards[i]
                            if (parseInt(card[0]) === id) {
                                card[1] += 1
                                break
                            }
                        }
                    }
                    movednum += 1
                }
            })
            //카드 목록에 따라 노드 불러오기
            if (movednum > 0) {
                cluster_update("deck",deckarr)
                setChart("update")
            }

            break
        //카드 제거
        case "remove":
            console.log(cmd)
            //로그 기록(제거는 예외사항 없으니 바로 실시)
            if (log === true) log_record(cmd)
            //카드 분류
            for (let i = 1;i < cmdarr.length;i++) {
                deckarr.push(parseInt(cmdarr[i]))
            }
            //카드 제거
            deckarr.forEach(function(id) {
                let quantity = card_getQuantity(id)
                for (let i = 0;i < process.deck.cards.length;i++) {
                    let card = process.deck.cards[i]
                    if (parseInt(card[0]) === id) {
                        //수량이 2 이상이면 수량 감소
                        if (card[1] >= 2) {
                            //수량 감소
                            card[1] -= 1
                        //아니라면 카드 정보 제거
                        } else {
                            process.deck.cards.splice(i,1)
                        }

                        break
                    }
                }
            })
            //카드 목록에 따라 노드 불러오기
            cluster_update("deck",deckarr)
            setChart("update")

            break
        //카드 적용 : 우선 남겨둠
        /*case "set":
            //로그 기록
            if (log === true) log_record(cmd)
            //카드 분류
            for (let i = 1;i < cmdarr.length;i++) {
                if (i % 2 === 0) {
                    let obj = {
                        deckarr:parseInt(cmdarr[i])
                    }
                    deckobj.push(obj)
                } else if (i % 2 === 1) {
                    deckarr[Math.ceil((i + 1) % 2)].quantity = parseInt(cmdarr[i])
                }
                deckarr.push(cmdarr[i])
            }
            //기존 카드목록 기억, 비우기
            let lastdeck = deepCopy(process.deck.cards.length)
            process.deck.cards = []
            //카드 적용
            deckarr.forEach(function(x) {
                process.deck.cards.push(x)
            })
            //카드 목록에 따라 노드 불러오기
            cluster_update("deck",deckarr)

            break*/
        //공통
        default:
            break
    }

    //덱 임시저장 - 덱 편집창을 벗어날 때 저장하는 걸로 대신함
    //deck_save()
}

//카드 최종 정보 생성
function card_addFragment(pos, id, quantity, show1, flasharr) {
    let card = session.db[session.dbIndex[id.toString()]]
    //요소 불러오기
    let fragment = session.fragment[session.dbIndex[id.toString()]]

    //플래시 정보 입력
    if (flasharr !== false && flasharr.indexOf(id) >= 0) {
        fragment = fragment.replace(" flash_hidden","")
    }
    //수량 정보 입력
    let numtext = ""
        //수량이 1 이상
        if (quantity >= 1) {
            //전설이면 "별" 표기
            if (card.rarity.slug === "LEGENDARY") {
                numtext = "★"
                fragment = fragment.replace(" quantity_hidden","")
            //전설이 아니면 수량 표기
            } else if (show1 === true || (show1 === false && quantity >= 2)) {
                numtext = quantity.toString()
                fragment = fragment.replace(" quantity_hidden","")
            }
        }//카드 수령이 0이면: 숨기기
    fragment = fragment.replace("$quantity",numtext)
    //샤용불가 정보 입력
    //샤용불가 정보 입력
    if (pos === "deck") {
        //사용불가 카드
        if (card.removed === true) {
            fragment = fragment.replace(" unusable_hidden","")
            process.deck.unusable += 1
        //정규 덱에서 야생카드
        } else if (process.deck.format === "정규") {
            if (card.cardSet.format === "야생") {
                fragment = fragment.replace(" unusable_hidden","")
                process.deck.unusable += 1
            }
        }
    }

    //요소 출력
    return fragment
}
//클러스터 업데이트
function cluster_update(position, latest, updateCollection) {
    let arr = []
    let nodearr = []
    switch (position) {
        case "collection_list":
            arr = process.search.result
            //클러스터 입력정보 준비
            arr.forEach(function(x) {
                nodearr.push(card_addFragment("collection_list",x,card_getQuantity(x),true,latest))
            })
            //클러스터 업데이트
            clusterize.collection_list.update(nodearr)

            break
        case "collection_illust":
        //클러스터 입력정보 준비
            let pWidth = $("#collection_illust_result_content").offsetWidth
            arr = process.search.result
            let rowText = ""
            let rowStart = "<div class='collection_illust_row'>",
                rowEnd = "</div>"
            //348 미만 : 3줄(116px 미만)
            //540 미만 : 3줄(116px)
            rowText += rowStart
            arr.forEach((x, i) => {
                rowText += session.illustFragment[session.dbIndex[x.toString()]]
                if (i === arr.length - 1) {
                    rowText += rowEnd
                    nodearr.push(rowText)

                //340 미만 : 2줄(가로 170 미만, 자동 조정)
                //340 ~ 510 : 2줄(가로 170)
                } else if (pWidth < 510 + 5) {
                    if ((i+1) % 2 === 0) {
                        rowText += rowEnd
                        nodearr.push(rowText)
                        if (i < arr.length - 1) rowText = rowStart
                    }
                //510 ~ 680 : 3줄(가로 170)
                } else if (pWidth < 680 + 6) {
                    if ((i+1) % 3 === 0) {
                        rowText += rowEnd
                        nodearr.push(rowText)
                        if (i < arr.length - 1) rowText = rowStart
                    }
                //680 ~ 850 : 4줄(가로 170)
                } else if (pWidth < 850 + 6) {
                    if ((i+1) % 4 === 0) {
                        rowText += rowEnd
                        nodearr.push(rowText)
                        if (i < arr.length - 1) rowText = rowStart
                    }
                //850 이상 : 5줄(가로 170)
                } else if (pWidth >= 850 + 6) {
                    if ((i+1) % 5 === 0) {
                        rowText += rowEnd
                        nodearr.push(rowText)
                        if (i < arr.length - 1) rowText = rowStart
                    }
                }
            })

            //클러스터 업데이트
            clusterize.collection_illust.update(nodearr)

            //화면 크기 조절 시 - (일러스트 모드면) 재구성
            window.addEventListener("resize", e => {
                if (process !== undefined &&
                process.state === "cardinfo" &&
                session.setting.cardinfo_form === "illust") {
                    cluster_update("collection_illust",false)
                }
            })

            break
        case "deck":
            arr = process.deck.cards
            //사용불가 카드 수 계산 준비
            process.deck.unusable = 0
            //클러스터 입력정보 준비
            arr.forEach(function(x) {
                nodearr.push(card_addFragment("deck",parseInt(x[0]),x[1],false,latest))
            })
            //클러스터 업데이트
            clusterize.deck.update(nodearr)

            //덱 상태 최신화
            deck_refresh()

            //카드목록 (해당되면) 클러스터 업데이트
            if (updateCollection  !== false) {
                cluster_update("collection_list", latest)
            }

            break
    }
}

//로그 생성
function log_record(cmd) {
    //로그 공간 생성 및 입력, 표시
    if (!process.log) process.log = []//로그 공간 생성
    process.log.push(cmd)//로그 입력
    $("#undo_num").innerHTML = thousand(process.log.length)//로그 횟수 표기
    //취소버튼 활성화
    $("#deckbuilding_undo").onclick = log_undo
    $("#deckbuilding_undo").classList.remove("disabled")
    //복구 로그 비우기
    process.redo = []
    $("#redo_num").innerHTML = thousand(process.redo.length)
    //복구버튼 비활성화
    $("#deckbuilding_redo").onclick = ""
    $("#deckbuilding_redo").classList.add("disabled")
}
//실행 취소
function log_undo() {
    //마지막 로그 분석
    let log = process.log[process.log.length-1]
        process.log.pop()//마지막 로그 지우기
        $("#undo_num").innerHTML = thousand(process.log.length)//로그 횟수 표기
    let movement = log.split(" ")[0]
    switch (movement) {
        case "add":
            log = log.replace("add","remove")
            break
        case "remove":
            log = log.replace("remove","add")
            break
        case "set":
            break
    }
    //취소 실행
    card_move(log,false)
    //복구 로그에 취소사항 기록
    if (!process.redo) process.redo = []
    process.redo.push(log)
    $("#redo_num").innerHTML = thousand(process.redo.length)
    //이제 로그가 없으면 취소버튼 비활성화
    if (process.log.length <= 0) {
        $("#deckbuilding_undo").onclick = ""
        $("#deckbuilding_undo").classList.add("disabled")
    }
    //복구 버튼 활성화
    $("#deckbuilding_redo").onclick = log_redo
    $("#deckbuilding_redo").classList.remove("disabled")
}
//취소 복구
function log_redo() {
    //마지막 복구로그 분석
    let redo = process.redo[process.redo.length-1]
        process.redo.pop()//마지막 로그 지우기
        $("#redo_num").innerHTML = thousand(process.redo.length)//로그 횟수 표기
    let movement = redo.split(" ")[0]
    switch (movement) {
        case "add":
            redo = redo.replace("add","remove")
            break
        case "remove":
            redo = redo.replace("remove","add")
            break
        case "set":
            break
    }
    //복구 실행
    card_move(redo,false)
    //취소 로그에 복구사항 기록
    process.log.push(redo)
    $("#undo_num").innerHTML = thousand(process.log.length)
    //이제 로그가 없으면 취소버튼 비활성화
    if (process.redo.length <= 0) {
        $("#deckbuilding_redo").onclick = ""
        $("#deckbuilding_redo").classList.add("disabled")
    }
    //복구 버튼 활성화
    $("#deckbuilding_undo").onclick = log_undo
    $("#deckbuilding_undo").classList.remove("disabled")
}

//덱 리프레시
function deck_refresh(cmd) {
    //최초 시동
    if (cmd === "init") {
        //덱에 예전 카드 있으면 비우기
        clusterize.deck.clear()
        //덱 공간 추가
        if (!process.deck) process.deck = {}
        //덱 카드 공간 추가
        if (!process.deck.cards) {
            process.deck.cards = []
            process.deck.quantity = 0
            process.deck.dust = 0
        }
        //영웅 이미지 출력
        /*if (session.offline === false)*/
            $("#deck_hero").style.backgroundImage = "url(" + HEROURL + process.deck.class + ".jpg)"
        //덱 이름 출력
        if (process.deck.name) {
            $("#deck_name").innerHTML = process.deck.name
        } else {
            let deckname = "나만의 " + session.classInfo[process.deck.class].name + " 덱"
            process.deck.name = deckname
            $("#deck_name").innerHTML = deckname
        }
        //덱 출력
        cluster_update("deck", false, false)
    }
    //정규/야생 출력
    $("#deck_format").className = DATA.FORMAT.EN[process.deck.format]
    $("#deck_format").innerHTML = process.deck.format + "전"

    //덱 가루, 수량 확인
    let quantity = 0
    let dust = 0
    process.deck.cards.forEach(function(arr) {
        quantity += arr[1]
        dust += session.db[session.dbIndex[arr[0].toString()]].rarity.dust * arr[1]
    })
        //덱 수량 저장, 출력
        process.deck.quantity = quantity
        $("#deck_bottom").innerHTML = "카드 " + quantity + " / 30"
        //덱 가루 저장, 출력
        process.deck.dust = dust
        $("#dust_quantity").innerHTML = thousand(dust)
    //덱이 완성되었으면 배경 변경
    if (process.deck.quantity >= DATA.DECK_LIMIT) {
        $("#deck_list_cover_overlay").classList.add("complete")
    } else {
        $("#deck_list_cover_overlay").classList.remove("complete")
    }
}

//차트 그리기, 반영
function setChart(cmd) {
    switch (cmd) {
        case "init":
            if (session.chart.init === false) {
                session.chart.init = true
                //차트 출력 준비 - 비용
                let chartCostOption = {
                    type: 'bar',
                    data: {
                        labels: ['0','1','2','3','4','5','6','7+'],
                        datasets: [{
                            data: [0,0,0,0,0,0,0,0],
                            backgroundColor: '#5e9dff'
                        }]
                    },
                    options: {
                        maintainAspectRatio:false,
                        layout: {
                            padding: {
                                top: 18,
                                bottom: -7,
                                left: -10,
                            }
                        },
                        events:[],
                        legend: {display: false},
                        animation: {
                            duration: 1,
                            onComplete: function() {
                                var chartInstance = this.chart,
                                ctx = chartInstance.ctx

                                ctx.font = "bold 15px " + Chart.defaults.global.defaultFontFamily
                                ctx.textAlign = 'center'
                                ctx.textBaseline = 'bottom'

                                this.data.datasets.forEach(function(dataset, i) {
                                    var meta = chartInstance.controller.getDatasetMeta(i)
                                    meta.data.forEach(function(bar, index) {
                                        var data = dataset.data[index]
                                        ctx.fillStyle = "white"
                                        ctx.fillText(data, bar._model.x, bar._model.y - 1)
                                    })
                                })
                          }
                        },
                        scales: {
                            xAxes: [{
                                barPercentage: 1,
                                categoryPercentage:0.9,
                                ticks: {
                                    padding:-6,
                                    lineHeight:1,
                                    fontStyle: "bold",
                                    fontSize: 15,
                                    fontColor:"white"
                                },
                                gridLines: {
                                    display: false,
                                    color: "white"
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    display: false,
                                    beginAtZero: true
                                },
                                gridLines: {
                                  display: false
                                }
                            }]
                        }
                    }
                }
                let context_cost = $("#deckchart_cost").getContext('2d')
                let context_cost_monitor = $("#deckchartmonitor_cost").getContext('2d')
                session.chart.cost = new Chart(context_cost,chartCostOption)
                session.chart.cost_monitor = new Chart(context_cost_monitor,chartCostOption)

                //차트 출력 준비 - 타입
                let chartTypeOption = {
                    type: 'bar',
                    data: {
                        labels: ['하수','주문','무기','기타'],
                        datasets: [{
                            data: [0,0,0,0],
                            backgroundColor: 'orange'
                        }]
                    },
                    options: {
                        maintainAspectRatio:false,
                        layout: {
                            padding: {
                                top: 18,
                                bottom: -7,
                                left: -10,
                            }
                        },
                        events:[],
                        legend: {display: false},
                        animation: {
                            duration: 1,
                            onComplete: function() {
                                var chartInstance = this.chart, ctx = chartInstance.ctx

                                ctx.font = "bold 15px " + Chart.defaults.global.defaultFontFamily
                                ctx.textAlign = 'center'
                                ctx.textBaseline = 'bottom'

                                this.data.datasets.forEach(function(dataset, i) {
                                    var meta = chartInstance.controller.getDatasetMeta(i)
                                    meta.data.forEach(function(bar, index) {
                                        var data = dataset.data[index]
                                        ctx.fillStyle = "white"
                                        ctx.fillText(data, bar._model.x, bar._model.y - 1)
                                    })
                                })
                          }
                        },
                        scales: {
                            xAxes: [{
                                barPercentage: 1,
                                categoryPercentage:0.9,
                                ticks: {
                                    padding:-5,
                                    lineHeight:1.25,
                                    fontStyle: "bold",
                                    fontSize: 12,
                                    fontColor:"white"
                                },
                                gridLines: {
                                    display: false,
                                    color: "white"
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    display: false,
                                    beginAtZero: true
                                },
                                gridLines: {
                                  display: false
                                }
                            }]
                        }
                    }
                }
                let context_type = $("#deckchart_type").getContext('2d')
                let context_type_monitor = $("#deckchartmonitor_type").getContext('2d')
                session.chart.type = new Chart(context_type,chartTypeOption)
                session.chart.type_monitor = new Chart(context_type_monitor,chartTypeOption)
            }
            //차트 출력 여부 로벌에서 확인
            localforage.getItem("sist_chart")
            .then(function(showChart) {
                if (!showChart) {
                    //저장된 게 없음 - 디폴트값 이용
                } else {
                    //불러오기
                    session.chart.show = showChart
                }

                //차트 출력 여부 결정
                if (session.chart.show === true) {
                    setChart("on")
                } else {
                    setChart("off")
                }
                //차트 업데이트
                setChart("update")
            }).catch(function(e) {
                //불러올 수 없음 - 오류 출력 후 디폴트값 이용
                if (!isError.chartLoad) {
                    isError.chartLoad = 1
                    nativeToast({
                        message: '차트 출력여부 값을 로컬에서 불러올 수 없습니다.<br>(' + e + ')',
                        position: 'center',
                        timeout: 3000,
                        type: 'error',
                        closeOnClick: 'true'
                    })
                }

                //차트 출력 여부 결정
                if (session.chart.show === true) {
                    setChart("on")
                } else {
                    setChart("off")
                }
                //차트 업데이트
                setChart("update")
            })

            break
        case "on":
            //차트
            $("#main_deckchart").classList.add("show")
            //메인스크린
            $("#main_collection_list").classList.add("below_chart")
                $("#main_collection_list").classList.remove("below_footer","below_none")
            $("#main_deck").classList.add("below_chart")
                $("#main_deck").classList.remove("below_footer","below_none")
            $("#main_deckconfig").classList.add("below_chart")
                $("#main_deckconfig").classList.remove("below_footer","below_none")
            //버튼
            $("#deckbuilding_chart").classList.add("off")
                $("#deckbuilding_chart").classList.remove("on")
            $("#deckconfig_chart").classList.add("off")
                $("#deckconfig_chart").classList.remove("on")

            break
        case "off":
            //차트
            $("#main_deckchart").classList.remove("show")
            //메인스크린
            $("#main_collection_list").classList.add("below_footer")
                $("#main_collection_list").classList.remove("below_chart","below_none")
            $("#main_deck").classList.add("below_footer")
                $("#main_deck").classList.remove("below_chart","below_none")
            $("#main_deckconfig").classList.add("below_footer")
                $("#main_deckconfig").classList.remove("below_chart","below_none")
            //버튼
            $("#deckbuilding_chart").classList.add("on")
                $("#deckbuilding_chart").classList.remove("off")
            $("#deckconfig_chart").classList.add("on")
                $("#deckconfig_chart").classList.remove("off")

            break
        case "toggle":
            if (session.chart.show === true) {
                session.chart.show = false
                setChart("off")
            } else {
                session.chart.show = true
                setChart("on")
            }
            //차트 출력여부 저장
            localforage.setItem("sist_chart",session.chart.show)
            .then(function() {
                //do nothing
            }).catch(function(e) {
                if (!isError.chartSave) {
                    isError.chartSave = 1
                    nativeToast({
                        message: '차트 출력여부 값을 저장할 수 없습니다.<br>(' + e + ')',
                        position: 'center',
                        timeout: 3000,
                        type: 'error',
                        closeOnClick: 'true'
                    })
                }
            })

            break
        case "update":
            //데이터 수집 준비
            let chartdate = {
                cost:[0,0,0,0,0,0,0,0],
                type:[0,0,0,0]
            }
            //덱 조사
            if (process.deck.cards !== undefined) {
                process.deck.cards.forEach(function(card) {
                    let info = session.db[session.dbIndex[card[0].toString()]]
                    chartdate.cost[Math.min(info.cost,7)] += card[1]
                    switch (info.cardType.slug) {
                        case "MINION":
                            chartdate.type[0] += card[1]
                            break
                        case "SPELL":
                            chartdate.type[1] += card[1]
                            break
                        case "WEAPON":
                            chartdate.type[2] += card[1]
                            break
                        default:
                            chartdate.type[3] += card[1]
                            break
                    }
                })
            }
            //차트에 반영
                //하단부
                session.chart.cost.data.datasets[0].data = chartdate.cost
                session.chart.type.data.datasets[0].data = chartdate.type
                session.chart.cost.update()
                session.chart.type.update()
                //모니터
                session.chart.cost_monitor.data.datasets[0].data = chartdate.cost
                session.chart.type_monitor.data.datasets[0].data = chartdate.type
                session.chart.cost_monitor.update()
                session.chart.type_monitor.update()
            break
        default:
            break
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
        try {
            //저장된 덱이 있으면 불러오기
            if (decks) {
                let keys = Object.keys(decks)
                keys.sort(function(a,b) {
                    return parseInt(a.replace("deck","")) - parseInt(b.replace("deck",""))
                })
                keys.forEach(function(key, index) {
                    slotarr.push(deckslot_generateFragment(decks[key], index+1, key))
                })
            }

            //클러스터 업데이트
            clusterize.slot.update(slotarr)
        } catch(e) {
            nativeToast({
                message: '덱 목록을 불러오는데 문제가 발생하였습니다.<br>(' + e + ')',
                position: 'center',
                timeout: 2000,
                type: 'error',
                closeOnClick: 'true'
            })

            //클러스터 업데이트
            clusterize.slot.update(slotarr)
        }
    }).catch(e => {
        nativeToast({
            message: '등록된 덱을 불러오지 못했습니다.<br>(' + e + ')',
            position: 'center',
            timeout: 2000,
            type: 'error',
            closeOnClick: 'true'
        })
    })
}
//덱 임시저장
async function deck_save(cmd) {
    return new Promise(resolve => {
        //임시 저장: 반드시 실시
        let tempdeck = {}
        tempdeck = deepCopy(process.deck)
        //날짜
        tempdeck.date = thisdate()//함수는 subtool.js 참고
        //저장 및 문구 출력
        localforage.setItem("sist_tempdeck",tempdeck)
        .then(async function(e) {
            console.log("saved(temp)")
            //정식 저장: 해당되면 실시
            if (process.deck.favorite) {
                //불러오기
                localforage.getItem("sist_decks")
                .then(async function(decks) {
                    if (!decks) decks = {}

                    //기존 덱 없으면 하나 만들기
                    if (Object.keys(decks).indexOf(process.deck.favorite) < 0) {
                        decks[process.deck.favorite] = {}
                        decks[process.deck.favorite].initdate = thisdate()
                    }
                    //저장된 덱 슬롯 있으면 거기에 넣기
                    let tempdate = decks[process.deck.favorite].initdate
                    decks[process.deck.favorite] = deepCopy(process.deck)
                    decks[process.deck.favorite].initdate = tempdate
                    decks[process.deck.favorite].date = thisdate()//함수는 subtool.js 참고

                    //저장소로 넘기기
                    try {
                        await localforage.setItem("sist_decks",decks)
                        console.log("saved(favorite)")
                        //저장 성공 아이콘 출력
                        $("#header_save").classList.remove("saved")
                        $("#header_save").offsetWidth = $("#header_save").offsetWidth
                        $("#header_save").classList.add("saved")
                        resolve()
                    } catch(e) {
                        nativeToast({
                            message: '등록된 덱 저장에 실패하였습니다.<br>(' + e + ')',
                            position: 'center',
                            timeout: 2000,
                            type: 'error',
                            closeOnClick: 'true'
                        })
                        //저장 실패 아이콘 출력
                        $("#header_save").classList.remove("error")
                        $("#header_save").offsetWidth = $("#header_save").offsetWidth
                        $("#header_save").classList.add("error")
                        resolve()
                    }
                })
                .catch(async function(e) {
                    nativeToast({
                        message: '기존에 등록된 덱을 불러오는 데 실패하였습니다.<br>(' + e + ')',
                        position: 'center',
                        timeout: 2000,
                        type: 'error',
                        closeOnClick: 'true'
                    })
                    //저장 실패 아이콘 출력
                    $("#header_save").classList.remove("error")
                    $("#header_save").offsetWidth = $("#header_save").offsetWidth
                    $("#header_save").classList.add("error")
                    resolve()
                })
            } else {
                //해당하는 거 없으면 그냥 나가기
                resolve()
            }
        })
        .catch(function(e) {
            nativeToast({
                message: '덱 임시저장에 실패하였습니다.<br>(' + e + ')',
                position: 'center',
                timeout: 2000,
                type: 'error',
                closeOnClick: 'true'
            })
            resolve()
        })
    })
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
                        let deckcount = 1
                        localforage.setItem("sist_deckcount",deckcount)
                        .then(function(e) {
                            //덱 번호 적용
                            process.deck.favorite = "deck" + deckcount.toString()
                            //덱 저장 : 외부에서 처리
                            resolve()
                        })
                    //있으면 덱카운트 +1, 이후 적용
                    } else {
                        num += 1
                        localforage.setItem("sist_deckcount",num)
                        .then(function(e) {
                            //덱 번호 적용
                            process.deck.favorite = "deck" + num.toString()
                            //덱 저장 : 외부에서 처리
                            resolve()
                        })
                    }
                })
                .catch(function(e) {
                    console.log("덱 즐겨찾기 설정에 실패하였습니다.")
                    resolve()
                })

                break
            case "off":
                //즐겨찾기 해제 대상 선정
                let favorite = (target !== undefined) ? target : process.deck.favorite
                //해당 번호가 있는지 확인
                localforage.getItem("sist_decks")
                .then(function(decks) {
                    //저장된 덱 목록 있으면 지우기
                    if (decks && Object.keys(decks).indexOf(favorite) >= 0) {
                        delete decks[favorite]
                        //덱 목록 적용
                        localforage.setItem("sist_decks",decks)
                        .then(function() {
                            //process.deck.favorite 있으면 지우기
                            if (process.deck.favorite) {
                                delete process.deck.favorite
                                //덱 저장 : 외부에서 처리
                                resolve()
                            } else {
                                resolve()
                            }
                        })
                    } else {
                        //process.deck.favorite 있으면 지우기
                        if (process.deck.favorite) {
                            delete process.deck.favorite
                            //덱 저장 : 외부에서 처리
                            resolve()
                        } else {
                            resolve()
                        }
                    }
                })
                .catch(function(e) {
                    resolve()
                })

                break
        }
    })
}
//덱 불러오기
function deck_load() {

}

//===========================================================
//※ 실행
//===========================================================
document.addEventListener("DOMContentLoaded", async function(e) {
    //로컬저장소 드라이버 설정
    localforage.config({
        name:"simplestone"
    })
    //서비스 워커 실행
    if ('serviceWorker' in navigator) {
        let newWorker
        navigator.serviceWorker.register('./service-worker.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing
                newWorker.addEventListener('statechange', () => {
                    switch (newWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                $("#frame_updatepopup").classList.add("show")
                                $("#updatepopup_refresh").addEventListener('click', function(){
                                    newWorker.postMessage({ type: 'SKIP_WAITING' })
                                })
                                $("#updatepopup_cancel").addEventListener('click', function(){
                                    $("#frame_updatepopup").classList.remove("show")
                                })
                            }

                            break
                    }
                })
            })
        })

        let refreshing
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (refreshing) return
            window.location.reload()
            refreshing = true
        })
    }
    //심플스톤 세팅 불러오기
    try {
        let local_setting = await localforage.getItem("sist_setting")
        //있을 시 적용
        if (local_setting !== null) {
            //temp_metadata에 메타데이터 할당
            session.setting = local_setting
        //없을 시
        } else {
            //비어있는 세팅 생성
            session.setting = {}
        }
    //실패 시
    } catch(e) {
        //오류 출력
        nativeToast({
            message: '심플스톤 세팅 저장값을 불러올 수 없습니다.<br>(' + e + ')',
            position: 'center',
            timeout: 3000,
            type: 'error',
            closeOnClick: 'true'
        })
        //(불러올 수 없으니) 비어있는 세팅 생성
        session.setting = {}
    }
    //클러스터 생성
        //카드 리스트 클러스터 생성해두기
        clusterize.collection_list = new Clusterize({
            tag: 'div',
            scrollId: 'collection_list_result',
            contentId: 'collection_list_result_content',
            rows_in_block:14,
            no_data_text: '해당 직업 검색결과 없음',
            no_data_class: 'clusterize-no-data'
        })
        //카드 일러스트 클러스트 생성해두기
        clusterize.collection_illust = new Clusterize({
            tag: 'div',
            scrollId: 'collection_illust_result',
            contentId: 'collection_illust_result_content',
            rows_in_block:8,
            no_data_text: '해당 직업 검색결과 없음',
            no_data_class: 'clusterize-no-data'
        })
        //덱 클러스터 생성해두기
        clusterize.deck = new Clusterize({
            tag: 'div',
            scrollId: 'deck_list',
            contentId: 'deck_list_content',
            rows_in_block:14,
            no_data_text: ''
        })
        //덱슬롯 클러스터 생성해두기
        clusterize.slot = new Clusterize({
            tag: 'div',
            scrollId: 'decklist_slot',
            contentId: 'decklist_slot_content',
            rows_in_block:14,
            no_data_text: '즐겨찾기 덱 없음'
        })
        //메타 덱 클러스터 생성해두기
        clusterize.metadeck = new Clusterize({
            tag: 'div',
            scrollId: 'metadeck_slot',
            contentId: 'metadeck_slot_content',
            rows_in_block:14,
            no_data_text: '검색된 메타 덱 없음'
        })
        //영구 저장소 적용
        try {
            if (navigator.storage && navigator.storage.persist) {
                //영구저장소 설정 함수
                let setPersist = async () => {
                    let persistent = await navigator.storage.persist()
                    if (persistent) {
                        nativeToast({
                            message: '심플스톤의 덱이 브라우저에서 임의로 지워지지 않도록 설정되었습니다.<br>'+
                            '(이제 심플스톤 저장소를 지우려면 브라우저 설정에서 직접 삭제해야 합니다)',
                            position: 'center',
                            timeout: 3000,
                            type: 'success',
                            closeOnClick: 'true'
                        })
                    } else {
                        //아이폰이면 메시지 출력하지 않음 (IOS는 데이터를 임의로 지우지 않는다고 함)
                        if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
                            //Do nothing
                        //아이폰이 아니라면 경고 메시지 출력
                        } else {
                            nativeToast({
                                message: '심플스톤의 덱이 지워지지 않도록 설정하는 데 실패하였습니다.<br>'+
                                '(아이폰 사파리 브라우저가 아니면 브라우저 저장소 용량이 부족하면 덱이 삭제될 수 있으니 주의해주세요.)',
                                position: 'center',
                                timeout: 3000,
                                type: 'error',
                                closeOnClick: 'true'
                            })
                        }
                    }
                }
                //영구저장소 점검기능 여부
                if (navigator.storage.persisted) {
                    let isPersist = await navigator.storage.persisted()
                    //영구저장소가 적용되지 않았다면 적용
                    if (!isPersist) {
                        setPersist()
                    }
                //점검할 줄 모르면 강제로 적용
                } else {
                    setPersist()
                }
            }
        } catch(e) {
            nativeToast({
                message: '오류 - 심플스톤 저장소 영구 설정에 실패하였습니다.<br>(' + e + ')',
                position: 'center',
                timeout: 3000,
                type: 'error',
                closeOnClick: 'true'
            })
        }

        //종료 경고 메시지
        window.onunload = window.onbeforeunload = function(e) {
            e.preventDefault()// Cancel the event
            e.returnValue = ''// Chrome requires returnValue to be set
        }
        //안드로이드는 뒤로 두번 눌려야 나가지도록
        let isMobile = mobilecheck()
        if (isMobile === true) {
            blockBack = 1
            window.history.pushState({ noBackExitsApp: true }, 'ABC')
        }

    //URL 분석
    let url = new URL(window.location.href).searchParams
    for (let key of url.keys()) {
        session.urlParams[key] = url.get(key)
    }
    //URL 패러미터에 '덱코드'가 있으면
    if (Object.keys(session.urlParams).length > 0 && session.urlParams.deckcode !== undefined) {
        //DB 버전만 확인
        try {
            let response = await fetch("https://solarias.github.io/simplestone_database/json/sist_data_version.json")
            session.serverVersion = await response.json()
        } catch(e) {
            //아무것도 하지 않음 (session.serverVersion = undefined)
        }
        //화면 이동 - 업데이트
        window_shift("update")
    //URL 패러미터 없으면
    } else {
        //동시 실행 - 공지사항, DB 공지, DB 버전
        await Promise.all([
            (async () => {//공지사항
                return new Promise(async (resolve) => {
                    try {
                        let response = await fetch("./notice.json")
                        let noticeJson = await response.json()
                        let notice = noticeJson.content
                        let noticeFrag = document.createDocumentFragment()
                        for (let i = 0;i < Math.min(30,notice.length);i++) {//공지는 최대 30개만
                            let each = notice[i]
                            //날짜
                            let date = document.createElement("p[date]")
                                date.innerHTML = each.date
                            noticeFrag.appendChild(date)
                            //내용
                            if (typeof each.content === "string") {
                                let content = document.createElement("p.last[content]")
                                    content.innerHTML = "- " + each.content
                                noticeFrag.appendChild(content)
                            } else {
                                each.content.forEach(function(p, index) {
                                    let paragraph = document.createElement("p[content]")
                                    if (index == each.content.length - 1)
                                        paragraph.classList.add("last")
                                    paragraph.innerHTML = "- " + p
                                    noticeFrag.appendChild(paragraph)
                                })
                            }
                        }
                        $("#notice_content").appendChild(noticeFrag)
                    } catch(e) {
                        let noticeFrag = document.createDocumentFragment()
                        let errorNotice = document.createElement("p[content]")
                            errorNotice.innerHTML = "오류 : 공지사항을 불러올 수 없습니다."
                        noticeFrag.appendChild(errorNotice)
                        $("#notice_content").appendChild(noticeFrag)
                    }
                    resolve()
                })
            })(),
            (async () => {//DB 업데이트 현황
                return new Promise(async (resolve) => {
                    try {
                        let dbNoticeResponse = await fetch("https://solarias.github.io/simplestone_database/json/sist_data_notice.json")
                        let dbNotice = await dbNoticeResponse.json()
                        let dbNoticeFrag = document.createDocumentFragment()
                        for (let i = 0;i < Math.min(30,dbNotice.length);i++) {//공지는 최대 30개만
                            let each = dbNotice[i]
                            //전장 관련 공지는 (일단은) 표시하지 않음
                            let checkParagraph = 0, checkBattlegrounds = 0
                            each.content.forEach((p, index) => {
                                checkParagraph += 1
                                if (p.indexOf("전장") >= 0) {
                                    checkBattlegrounds += 1
                                }
                            })
                            if (checkBattlegrounds > 0 && checkParagraph === checkBattlegrounds) {
                                continue
                            }
                            //날짜 표시
                            let date = document.createElement("p[date]")
                                date.innerHTML = each.date
                            dbNoticeFrag.appendChild(date)
                            //내용 표시
                            each.content.forEach((p, index) => {
                                if (p.indexOf("전장") < 0) {
                                    let paragraph = document.createElement("p[content]")
                                    paragraph.innerHTML = "- " + p
                                    dbNoticeFrag.appendChild(paragraph)
                                }
                            })
                        }
                        $("#notice_content_db").appendChild(dbNoticeFrag)
                    } catch(e) {
                        let dbNoticeFrag = document.createDocumentFragment()
                        let errorNotice = document.createElement("p[content]")
                            errorNotice.innerHTML = "오류 : DB 업데이트 공지사항을 불러올 수 없습니다."
                        dbNoticeFrag.appendChild(errorNotice)
                        $("#notice_content_db").appendChild(dbNoticeFrag)
                    }
                    resolve()
                })
            })(),
            (async () => {//DB 버전
                return new Promise(async (resolve) => {
                    try {
                        let response = await fetch("https://solarias.github.io/simplestone_database/json/sist_data_version.json")
                        session.serverVersion = await response.json()
                    } catch(e) {
                        //아무것도 하지 않음 (session.serverVersion = undefined)
                    }
                    resolve()
                })
            })()
        ])
        //화면 이동 - 공지사항
        window_shift("notice")
    }
})
//오류 취급 (출처 : http://stackoverflow.com/questions/951791/javascript-global-error-handling)
//localhost에서는 오류 창 띄우지 않기
if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    window.onerror = function(msg, url, line, col, error) {
        if (url && url.indexOf("/") >= 0 ) url = url.split("/")[url.split("/").length - 1]
        var site = !url ? '' : '* URL : ' + url + '\n'
        var extra = !col ? '' : ', Column : ' + col
        extra += !error ? '' : '\n * 에러 : ' + error
        var notice = " * 내용 : " + msg + "\n" + site + " * Line : " + line + extra
        if (swal) {
            swal({
                title:"오류 발생",
                type:"error",
                html:"아래의 내용을 제보해주시면 감사하겠습니다.<br>" +
                "(<a href='https://blog.naver.com/ansewo/221319675157' target='_blank'>클릭하면 블로그로 이동합니다</a>)<br/>" +
                notice.replaceAll("\n","<br>")
            })
        } else alert("아래의 내용을 제보해주시면 감사하겠습니다.(https://blog.naver.com/ansewo/221319675157)\n" + notice)
        var suppressErrorAlert = true
        return suppressErrorAlert
    }
}
