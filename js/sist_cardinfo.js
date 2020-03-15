
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
                let elm_cost = document.createElement("div.cardinfo.cost");
                let elm_type = document.createElement("div.cardinfo.type");
            let elm_name = document.createElement("div.cardinfo.name");
            let elm_rarity = document.createElement("div.cardinfo.rarity");
            let elm_text = document.createElement("div.cardinfo.text");
            let elm_bottom = document.createElement("div.cardinfo.bottom");
                let elm_attack = document.createElement("div.cardinfo.attack");
                let elm_minionType = document.createElement("div.cardinfo.minionType");
                let elm_health = document.createElement("div.cardinfo.health");
        let elm_cardSet = document.createElement("div.cardinfo.cardSet");
        let elm_flavorText = document.createElement("div.cardinfo.flavorText");

    elm_wrapper.appendChild(elm_notice);
    elm_wrapper.appendChild(elm_illust);
        elm_illust.appendChild(elm_illustImage);
    elm_wrapper.appendChild(elm_cardcase);
        elm_cardcase.appendChild(elm_top);
            elm_top.appendChild(elm_image);
            elm_top.appendChild(elm_cost);
            elm_top.appendChild(elm_type);
        elm_cardcase.appendChild(elm_name);
        elm_cardcase.appendChild(elm_rarity);
        elm_cardcase.appendChild(elm_text);
        elm_cardcase.appendChild(elm_bottom);
            elm_bottom.appendChild(elm_attack);
            elm_bottom.appendChild(elm_minionType);
            elm_bottom.appendChild(elm_health);
    elm_wrapper.appendChild(elm_cardSet);
    elm_wrapper.appendChild(elm_flavorText);

    return elm_wrapper;
}
//노드 설치
function cardinfo_cardSetup(id, showflavor, allowDuplicate) {
    let site = $("#" + id);
    //설치되어 있고, 중복 설치를 허용하지 않으면
    if ($(".cardinfo.wrapper",site) &&
        (allowDuplicate === undefined || allowDuplicate === false)) {
        //기존 설치본 지우기
        let elm = $(".cardinfo.wrapper",site);
        elm.parentNode.removeChild(elm);
        //재설치
        site.appendChild(session.masterInfo.cloneNode(true));
        //사이즈 조절
        cardinfo_cardSetScale($(".cardinfo.wrapper",site), showflavor);
    //설치되어 있지 않음
    } else {
        //설치
        site.appendChild(session.masterInfo.cloneNode(true));
        //마지막으로 추가된 카드의 사이즈 조절
        cardinfo_cardSetScale($$(".cardinfo.wrapper",site)[$$(".cardinfo.wrapper",site).length-1], showflavor);
        //화면 크기 변경 시 마지막으로 추가된 카드의 사이즈 재조절 - 하지 않음
        /*window.addEventListener("resize",function(e) {
            cardinfo_cardSetScale($$(".cardinfo.wrapper",site)[$$(".cardinfo.wrapper",site).length-1], showflavor);
        });*/
    }
    if (showflavor === false)
        $$(".cardinfo.wrapper",site)[$$(".cardinfo.wrapper",site).length-1].classList.add("simple");
}
//정보창 크기값 계산
function cardinfo_cardSetScale(node, showflavor) {
    let parent = node.parentNode
    let w = parent.offsetWidth, h = parent.offsetHeight
    let scaleH = (h / 460).toString()
    let scaleW = (w / 260).toString()
    if (w >= 260) {
        if (h >= 565) {
            //node.classList.remove("simple")
            node.style.transform = ""
        } else if (h >= 460) {
            //node.classList.add("simple")
            node.style.transform = ""
        } else {
            //node.classList.add("simple")
            node.style.transform = "scale(" + scaleH + ")"
        }
    } else {
        if (h / w > 565 / 260) {
            //node.classList.remove("simple")
            node.style.transform = "scale(" + scaleW + ")"
        } else if (h / w > 460 / 260) {
            //node.classList.add("simple")
            node.style.transform = "scale(" + scaleW + ")"
        } else {
            //node.classList.add("simple")
            node.style.transform = "scale(" + scaleH + ")"
        }
    }
    if (showflavor === false) {
        node.classList.add("simple")
    } else if (showflavor === "simplest") {
        node.classList.add("simplest")
    }
}
//정보 출력
function cardinfo_show(id, order, info) {
    process.showImageId = info.id
    let site = $("#" + id)
    //안내 문구 닫기, 카드 및 세트 출력
    $$(".notice",site)[order].classList.remove("show")
    $$(".cardSet",site)[order].classList.add("show")
    //카드 세부정보 출력여부 결정(1 : 출력)
    //$(".cardcase",site).classList.add("show")
    let setDesc = 0
    //카드 일러스트 출력 여부
        //데이터 절약 - 일러스트 없이 세부 정보 표기
    if (session.offline === true)   {
        $$(".illust",site)[order].classList.remove("show")
        $$(".cardcase",site)[order].classList.add("show")
            $$(".top",site)[order].classList.add("offline")
            $$(".image",site)[order].innerHTML = "오프라인 모드"
            setDesc = 1
            /*
            image = "url(" + TILEURL + info.id + ".jpg)"
            $(".image",site).style.backgroundImage = image
            */
    //일반 - 세부 정보 대신 일러스트 표시
    } else {
        $$(".illustImage",site)[order].style.backgroundImage = ""
        let image = new Image()
        //일러스트 불러온 후 세부 정보를 숨기고 일러스트 표시
        image.onload = () => {
            $$(".illustImage",site)[order].style.backgroundImage = "url(" + image.src + ")"
        }
        //일러스트를 불러올 수 없으면 세부 정보만 표시
        image.onerror = () => {
            $$(".illust",site)[order].classList.remove("show");
            $$(".cardcase",site)[order].classList.add("show");
                $$(".top",site)[order].classList.add("offline");
                $$(".image",site)[order].innerHTML = "이미지 로딩 실패";
                setDesc = 1
                /*
                image = "url(" + tileImage + info.id + ".jpg)"
                $(".image",site).style.backgroundImage = image
                */
        }
        image.src = info.image
        $$(".illust",site)[order].classList.add("show")
        $$(".cardcase",site)[order].classList.remove("show")
    }
    if (setDesc >= 1) {
        //카드 세부정보 - 상단 출력
        $$(".top",site)[order].classList.add("show");
        //카드 세부정보 - 비용
        $$(".cost",site)[order].innerHTML = info.cost.toString();
        //카드 세부정보 - 타입
        $$(".type",site)[order].innerHTML = info.cardType.name;
        //카드 세부정보 - 이름
        $$(".name",site)[order].innerHTML = info.name;
        //카드 세부정보 - 등급
        session.metadata.rarities.forEach(function(rarityInfo) {
            $$(".rarity",site)[order].classList.remove("rarity_" + rarityInfo.slug);
        })
        $$(".rarity",site)[order].classList.add("rarity_" + info.rarity.slug);
        $$(".rarity",site)[order].innerHTML = info.rarity.name;
        //카드 세부정보 - 텍스트
        if (info.text && info.text !== "" && info.text.length > 0)
            $$(".text",site)[order].innerHTML = "<p>" + readable(info.text) + "</p>";
        else
            $$(".text",site)[order].innerHTML = "";
        //카드 세부정보 - 하단부 표시 여부
        let statpoint = {
            attack:0,//공격력 존재 여부
            minionType:0,//종족 존재 여부
            health:0//체력/방어도 존재 여부
        }
        //공격력
        if (info.attack !== undefined && info.attack !== "") {
            $$(".attack",site)[order].style.display = "block";
            $$(".attack",site)[order].innerHTML = info.attack.toString();
            statpoint.attack += 1
        } else {
            $$(".attack",site)[order].style.display = "none";
        }
        //종족
        if (info.minionType !== undefined) {
            $$(".minionType",site)[order].style.display = "block";
            $$(".minionType",site)[order].innerHTML = info.minionType.name;
            statpoint.minionType += 1
        } else {
            $$(".minionType",site)[order].style.display = "none";
        }
        //체력/방어도
        if ((info.durability !== undefined && info.durability !== "") ||
            (info.armor !== undefined && info.armor !== "")) {
            $$(".health",site)[order].style.display = "block";
            $$(".health",site)[order].classList.add("armor");
            let stat = 0
            if (info.durability !== undefined) {
                stat = info.durability
            } else if (info.armor !== undefined) {
                stat = info.armor
            } else {
                stat = 0
            }
            $$(".health",site)[order].innerHTML = stat.toString();
            statpoint.health += 1;
        } else if (info.health !== undefined && info.health !== "") {
            $$(".health",site)[order].style.display = "block";
            $$(".health",site)[order].classList.remove("armor");
            $$(".health",site)[order].innerHTML = info.health.toString();
            statpoint.health += 1;
        } else {
            $$(".health",site)[order].style.display = "none";
        }
        //하단부를 하나도 출력하지 않았다면 하단부 가리기
        if (statpoint.attack + statpoint.minionType + statpoint.health <= 0) {
            $$(".bottom",site)[order].style.display = "none";
            //텍스트 칸 늘리기
            $$(".text",site)[order].classList.add("large");
        } else {
            $$(".bottom",site)[order].style.display = "block";
            //텍스트 칸 줄리기
            $$(".text",site)[order].classList.remove("large");
        }
    }
    //세트
    $$(".cardSet",site)[order].innerHTML = info.cardSet.name;
    //플레이버 텍스트
    if (info.flavorText && info.flavorText !== "" && info.flavorText.length > 0) {
        $$(".flavorText",site)[order].innerHTML = "<p>" + readable(info.flavorText) + "</p>";
    } else {
        $$(".flavorText",site)[order].innerHTML = ""
    }
}
