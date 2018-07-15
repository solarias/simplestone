
//===============================================================
//※ 덱코드 관련 함수
//===============================================================
//디코드
function deckcode_decode(deckcode) {
    //(검증된) 덱코드 해석
    let input = deckstrings.decode(deckcode);
    let output = {};
    //카드
    output.cards = [];
    let dbfidArr = [];
    let quantityArr = [];
    input.cards.forEach(function(arr) {
        dbfidArr.push(arr[0].toString());
        quantityArr.push(arr[1]);
    })
    for (let i = 0;i < session.db.length;i++) {
        let card = session.db[i];
        let cardobj = {};
        let index = dbfidArr.indexOf(card.dbfid);
        if (index >= 0) {
            cardobj.ssi = card.ssi;
            cardobj.quantity = quantityArr[index];
                output.cards.push(cardobj);
            //검색된 요소 제거
            dbfidArr.splice(index,1);
            quantityArr.splice(index,1);
            //다 끝났으면 종료
            if (dbfidArr.length <= 0 && quantityArr.length <= 0) {
                break;
            }
        }
    }
    //직업
    for (let i = 0;i < session.db.length;i++) {
        if (session.db[i].dbfid === input.heroes[0].toString()) {
            output.class = session.db[i].cardClass;
            break;
        }
    }
    //포맷(향후 덱 포맷 검증 별도로 함)
    output.format = "정규";
    for (let i = 0;i < output.cards.length;i++) {
        if (DATA.SET_FORMAT[session.db[parseInt(output.cards[i].ssi)].set] === "야생") {
            output.format = "야생";
            break;
        }
    }
    //output.format = DATA.FORMAT_DECODE[input.format.toString()];
    //출력
    return output;
}

//인코드
function deckcode_encode() {
    let output = {};
    //포맷
    output.format = DATA.FORMAT_CODE[process.deck.format];
    //직업
    output.heroes = [DATA.CLASS_DBFID[process.deck.class]];
    //카드
    output.cards = [];
    process.deck.cards.forEach(function(x) {
        let cardarr = [];
        cardarr[0] = parseInt(session.db[x.ssi].dbfid);
        cardarr[1] = x.quantity;
        output.cards.push(cardarr);
    })

    //출력
    let deckcode = deckstrings.encode(output);
    return deckcode;
}

//덱설명 출력
function deckcode_text() {
    //덱코드 획득
    let deckcode = deckcode_encode();

    //텍스트 작성
    let outputtext = "";
    //덱 이름
    outputtext += "###" + process.deck.name + "\n";
    //직업
    outputtext += "#직업 : " + DATA.CLASS_KR[process.deck.class] + "\n";
    //포맷
    outputtext += "#대전방식 : " + process.deck.format + "\n";
    //연도
    outputtext += "#" + DATA.YEAR + "\n";
    //가루
    outputtext += "#가루 : " + thousand(process.deck.dust) + "\n";
    outputtext += "#\n";
    //카드
    process.deck.cards.forEach(function(card) {
        let info = session.db[parseInt(card.ssi)];
        outputtext += "# " + card.quantity.toString() + "x (" + info.cost.toString() + ") " + info.name + "\n";
    });
    outputtext += "#\n";
    //덱코드
    outputtext += deckcode + "\n";
    outputtext += "#\n";
    //설명
    outputtext += "# 이 덱을 사용하려면 클립보드에 복사한 후 하스스톤에서 새로운 덱을 만드세요." + "\n";
    outputtext += "#Created at SimpleStone(https://solarias.github.io/hearthstone/sist.html)";

    //출력
    return outputtext;
}
