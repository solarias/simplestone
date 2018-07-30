
//===============================================================
//※ 카드정보 출력 관련 함수
//===============================================================

//마스터 노드 생성
function cardinfo_generateMaster() {
    let elm_wrapper = document.createElement("div.cardinfo.wrapper");
        let elm_notice = document.createElement("div.cardinfo.notice");
            elm_notice.classList.add("show");
            elm_notice.innerHTML = "<p>여기에<br>카드 정보가<br>표시됩니다.</p>";
        let elm_illust = document.createElement("div.cardinfo.illust");
            let elm_illustImage = document.createElement("div.cardinfo.illustImage");
        let elm_cardcase = document.createElement("div.cardinfo.cardcase");
            let elm_top = document.createElement("div.cardinfo.top");
                let elm_image = document.createElement("div.cardinfo.image");
                let elm_mana = document.createElement("div.cardinfo.mana");
                let elm_type = document.createElement("div.cardinfo.type");
            let elm_name = document.createElement("div.cardinfo.name");
            let elm_rarity = document.createElement("div.cardinfo.rarity");
            let elm_text = document.createElement("div.cardinfo.text");
            let elm_bottom = document.createElement("div.cardinfo.bottom");
                let elm_attack = document.createElement("div.cardinfo.attack");
                let elm_race = document.createElement("div.cardinfo.race");
                let elm_health = document.createElement("div.cardinfo.health");
        let elm_set = document.createElement("div.cardinfo.set");
        let elm_flavor = document.createElement("div.cardinfo.flavor");

    elm_wrapper.appendChild(elm_notice);
    elm_wrapper.appendChild(elm_illust);
        elm_illust.appendChild(elm_illustImage);
    elm_wrapper.appendChild(elm_cardcase);
        elm_cardcase.appendChild(elm_top);
            elm_top.appendChild(elm_image);
            elm_top.appendChild(elm_mana);
            elm_top.appendChild(elm_type);
        elm_cardcase.appendChild(elm_name);
        elm_cardcase.appendChild(elm_rarity);
        elm_cardcase.appendChild(elm_text);
        elm_cardcase.appendChild(elm_bottom);
            elm_bottom.appendChild(elm_attack);
            elm_bottom.appendChild(elm_race);
            elm_bottom.appendChild(elm_health);
    elm_wrapper.appendChild(elm_set);
    elm_wrapper.appendChild(elm_flavor);

    return elm_wrapper;
}
//노드 설치
function cardinfo_setup(id, showflavor) {
    let site = $("#" + id);
    //설치되어있는지 확인
    if ($(".cardinfo.wrapper",site)) {
        //기존 설치본 지우기
        let elm = $(".cardinfo.wrapper",site);
        elm.parentNode.removeChild(elm);
        //재설치
        site.appendChild(session.masterInfo.cloneNode(true));
        //사이즈 조절
        cardinfo_setScale($(".cardinfo.wrapper",site));
    } else {
        //설치
        site.appendChild(session.masterInfo.cloneNode(true));
        //사이즈 조절
        cardinfo_setScale($(".cardinfo.wrapper",site));
        //화면 크기 변경 시 사이즈 재조절
        window.addEventListener("resize",function(e) {
            cardinfo_setScale($(".cardinfo.wrapper",site), showflavor);
        });
    }
    if (showflavor === false)
        $(".cardinfo.wrapper",site).classList.add("simple");
}
//정보창 크기값 계산
function cardinfo_setScale(node, showflavor) {
    let parent = node.parentNode;
    let w = parent.offsetWidth, h = parent.offsetHeight;
    let scaleH = (h / 460).toString();
    let scaleW = (w / 260).toString();
    if (w >= 260) {
        if (h >= 565) {
            node.classList.remove("simple");
            node.style.transform = "";
        } else if (h >= 460) {
            node.classList.add("simple");
            node.style.transform = "";
        } else {
            node.classList.add("simple");
            node.style.transform = "scale(" + scaleH + ")";
        }
    } else {
        if (h / w > 565 / 260) {
            node.classList.remove("simple");
            node.style.transform = "scale(" + scaleW + ")";
        } else if (h / w > 460 / 260) {
            node.classList.add("simple");
            node.style.transform = "scale(" + scaleW + ")";
        } else {
            node.classList.add("simple");
            node.style.transform = "scale(" + scaleH + ")";
        }
    }
    if (showflavor === false) node.classList.add("simple");
}
//정보 출력
function cardinfo_show(id, info) {
    process.showImageDbfid = info.dbfid;
    let site = $("#" + id);
    //안내 문구 닫기, 카드 및 세트 출력
    $(".notice",site).classList.remove("show");
    $(".cardcase",site).classList.add("show");
    $(".set",site).classList.add("show");
    //상단 출력
    $(".top",site).classList.add("show");
    //이미지(오프라인 모드가 아니라면)
    if (session.offline === false)   {
        let image;
        //확장팩이 아니면 이미지 출력
        if (!process.deck.newset || info.set !== DATA.SET.NEW.id) {
            $(".illust",site).classList.remove("show");
            $(".cardcase",site).classList.add("show");
                image = "url(" + IMAGEURL + info.id + ".jpg)";
                $(".image",site).style.backgroundImage = image;
                $(".top",site).classList.remove("offline");
        //확장팩인데 이미지가 없다면
        } else if (!info.url) {
            $(".illust",site).classList.remove("show");
            $(".cardcase",site).classList.add("show");
                image = "url(" + IMAGEURL + info.id + ".jpg)";
                $(".image",site).style.backgroundImage = image;
                $(".top",site).classList.add("offline");
                $(".image",site).innerHTML = "이미지 없음";
        //확장팩이면 이미지"만" 출력
        } else {
            //이미지 로딩 체크, 성공 시 출력, 실패 시 텍스트만 출력
            let img = document.createElement('img');
            img.onload = function() {
                if (info.dbfid === process.showImageDbfid) {
                    $(".illust",site).classList.add("show");
                    $(".cardcase",site).classList.remove("show");
                        image = "url(" + info.url + ")";
                        $(".illustImage",site).style.backgroundImage = image;
                }
            };
            img.onerror = function() {
                $(".illust",site).classList.remove("show");
                $(".cardcase",site).classList.add("show");
                    $(".top",site).classList.add("offline");
                    $(".image",site).innerHTML = "이미지 로딩 실패";
            };
            img.src = info.url;
            //이미지 불러오는 동안 임시 정보 출력
            if (img.complete === false) {
                $(".illust",site).classList.remove("show");
                $(".cardcase",site).classList.add("show");
                    $(".top",site).classList.remove("offline");
                    $(".image",site).innerHTML = "";
            }
        }
    } else {
        $(".illust",site).classList.remove("show");
        $(".cardcase",site).classList.add("show");
            $(".top",site).classList.add("offline");
            $(".image",site).innerHTML = "오프라인 모드";
    }
    //마나
    $(".mana",site).innerHTML = info.cost.toString();
    //타입
    $(".type",site).innerHTML = DATA.TYPE.KR[info.type];
    //이름
    $(".name",site).innerHTML = info.name;
    //등급
    Object.keys(DATA.RARITY.KR).forEach(function(x) {
        $(".rarity",site).classList.remove("rarity_" + x);
    })
    $(".rarity",site).classList.add("rarity_" + info.rarity);
    $(".rarity",site).innerHTML = DATA.RARITY.KR[info.rarity];
    //텍스트
    if (info.text && info.text !== "" && info.text.length > 0)
        $(".text",site).innerHTML = "<p>" + readable(info.text) + "</p>";
    else
        $(".text",site).innerHTML = "";
    //하단부
    let statpoint = [0,0,0];//각각 공격력, 종족, 체력/방어도 유무
        //공격력
        if (info.attack !== undefined && info.attack !== "") {
            $(".attack",site).style.display = "block";
            $(".attack",site).innerHTML = info.attack.toString();
            statpoint[0] += 1;
        } else {
            $(".attack",site).style.display = "none";
        }
        //종족
        if (info.race !== undefined && info.race !== "") {
            $(".race",site).style.display = "block";
            $(".race",site).innerHTML = DATA.RACE.KR[info.race];
            statpoint[1] += 1;
        } else {
            $(".race",site).style.display = "none";
        }
        //체력/방어도
        if ((info.durability !== undefined && info.durability !== "") ||
            (info.armor !== undefined && info.armor !== "")) {
            $(".health",site).style.display = "block";
            $(".health",site).classList.add("armor");
            let stat = info.durability || info.armor;
            $(".health",site).innerHTML = stat.toString();
            statpoint[2] += 1;
        } else if (info.health !== undefined && info.health !== "") {
            $(".health",site).style.display = "block";
            $(".health",site).classList.remove("armor");
            $(".health",site).innerHTML = info.health.toString();
            statpoint[2] += 1;
        } else {
            $(".health",site).style.display = "none";
        }
        //하단부를 하나도 출력하지 않았다면 하단부 가리기
        if (statpoint[0] + statpoint[1] + statpoint[2] <= 0) {
            $(".bottom",site).style.display = "none";
            //텍스트 칸 늘리기
            $(".text",site).classList.add("large");
        } else {
            $(".bottom",site).style.display = "block";
            //텍스트 칸 줄리기
            $(".text",site).classList.remove("large");
        }
    //세트
        //확장팩
    if (process.deck.newset && info.set === DATA.SET.NEW.id) {
        $(".set",site).innerHTML = DATA.SET.NEW.name;
        //일반
    } else {
        $(".set",site).innerHTML = DATA.SET.KR[info.set];
    }
    //플레이버 텍스트
    if (info.flavor && info.flavor !== "" && info.flavor.length > 0)
        $(".flavor",site).innerHTML = "<p>" + readable(info.flavor) + "</p>";
}
