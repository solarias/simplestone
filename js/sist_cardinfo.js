
//===============================================================
//※ 카드정보 출력 관련 함수
//===============================================================

//마스터 노드 생성
function cardinfo_generateMaster() {
    let elm_wrapper = document.createElement("div.cardinfo.wrapper");
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
    let scaleH = (h / 400).toString();
    let scaleW = (w / 250).toString();
    if (w >= 250) {
        if (h >= 520) {
            node.classList.remove("simple");
            node.style.transform = "";
        } else if (h >= 400) {
            node.classList.add("simple");
            node.style.transform = "";
        } else {
            node.classList.add("simple");
            node.style.transform = "scale(" + scaleH + ")";
        }
    } else {
        if (h / w > 520 / 250) {
            node.classList.remove("simple");
            node.style.transform = "scale(" + scaleW + ")";
        } else if (h / w > 400 / 250) {
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
    let site = $("#" + id);
    //상단 출력
    $(".top",site).classList.add("show");
    //이미지
    let image = "url(" + IMAGEURL + info.id + ".jpg)";
    $(".image",site).style.backgroundImage = image;
    //마나
    $(".mana",site).innerHTML = info.cost.toString();
    //타입
    $(".type",site).innerHTML = DATA.TYPE_KR[info.type];
    //이름
    $(".name",site).innerHTML = info.name;
    //등급
    Object.keys(DATA.RARITY_KR).forEach(function(x) {
        $(".rarity",site).classList.remove("rarity_" + x);
    })
    $(".rarity",site).classList.add("rarity_" + info.rarity);
    $(".rarity",site).innerHTML = DATA.RARITY_KR[info.rarity];
    //텍스트
    if (info.text && info.text.length > 0)
        $(".text",site).innerHTML = "<p>" + readable(info.text) + "</p>";
    else
        $(".text",site).innerHTML = "";
    //하단부
    let statpoint = [0,0,0];//각각 공격력, 종족, 체력/방어도 유무
    $(".bottom",site).style.display = "block";
        //공격력
        if (info.attack !== undefined) {
            $(".attack",site).style.display = "block";
            $(".attack",site).innerHTML = info.attack.toString();
            statpoint[0] += 1;
        } else {
            $(".attack",site).style.display = "none";
        }
        //종족
        if (info.race !== undefined) {
            $(".race",site).style.display = "block";
            $(".race",site).innerHTML = DATA.RACE_KR[info.race];
            statpoint[1] += 1;
        } else {
            $(".race",site).style.display = "none";
        }
        //체력/방어도
        if (info.durability !== undefined || info.armor !== undefined) {
            $(".health",site).style.display = "block";
            $(".health",site).classList.add("armor");
            let stat = info.durability || info.armor;
            $(".health",site).innerHTML = stat.toString();
            statpoint[2] += 1;
        } else if (info.health !== undefined) {
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
        }
    //세트
    $(".set",site).innerHTML = DATA.SET_KR[info.set];
    //플레이버 텍스트
    $(".flavor",site).innerHTML = "<p>" + readable(info.flavor) + "</p>";
}
