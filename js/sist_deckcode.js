
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
    input.cards.forEach(function(card) {
        let arr = [];
        arr[0] = card[0].toString();
        arr[1] = card[1];
        output.cards.push(arr);
    })
    output.cards.sort(function(a, b) {
        return (parseInt(session.index[a[0]]) < parseInt(session.index[b[0]])) ? -1 : 1;
    });
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
        if (DATA.SET.FORMAT[session.db[session.index[output.cards[i][0]]].set] === "야생") {
            output.format = "야생";
            break;
        }
    }
    //output.format = DATA.FORMAT.DECODE[input.format.toString()];
    //출력
    return output;
}

//인코드
function deckcode_encode() {
    let output = {};
    //포맷
    output.format = DATA.FORMAT.CODE[process.deck.format];
    //직업
    output.heroes = [DATA.CLASS.DBFID[process.deck.class]];
    //카드
    output.cards = [];
    process.deck.cards.forEach(function(card) {
        let arr = [];
        arr[0] = parseInt(card[0]);
        arr[1] = card[1];
        output.cards.push(arr);
    })

    //출력
    let deckcode = deckstrings.encode(output);
    return deckcode;
}

//덱설명 출력
function deckcode_text() {
    //(확장팩이 아니라면)덱코드 획득
    let deckcode;
    if (!process.deck.newset) deckcode = deckcode_encode();
        else deckcode = false;

    //텍스트 작성
    let outputtext = "";
    //덱 이름
    outputtext += "###" + process.deck.name + "\n";
    //직업
    outputtext += "#직업 : " + DATA.CLASS.KR[process.deck.class] + "\n";
    //포맷
    outputtext += "#대전방식 : " + process.deck.format + "\n";
    //연도
    outputtext += "#" + DATA.YEAR + "\n";
    //가루
    outputtext += "#가루 : " + thousand(process.deck.dust) + "\n";
    outputtext += "#\n";
    //카드
    process.deck.cards.forEach(function(card) {
        let info = session.db[session.index[card[0]]];
        outputtext += "# " + card[1].toString();
        outputtext += "x (" + info.cost.toString() + ") ";
        //이름, 확장팩 (신규 확장팩이면 앞에 "*" 표시)
        if (deckcode || info.set !== DATA.SET.NEW.id) {
            outputtext += info.name;
            outputtext += "    [" + DATA.SET.KR[info.set] + "]" + "\n";
        } else {
            outputtext += "*" + info.name;
            outputtext += "    [" + DATA.SET.NEW.name + "]" + "\n";
        }
    });
    outputtext += "#\n";
    //덱코드 & 설명
    if (deckcode) {
        outputtext += deckcode + "\n";
        outputtext += "#\n";
        outputtext += "# 이 덱을 사용하려면 클립보드에 복사한 후 하스스톤에서 새로운 덱을 만드세요." + "\n";
    } else {
        outputtext += "#'" + DATA.SET.NEW.name + "' 미리 덱 짜보기\n";
    }
    //기타
    outputtext += "#Created at SimpleStone(https://solarias.github.io/simplestone)";

    //출력
    return outputtext;
}
