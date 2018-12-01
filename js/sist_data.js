
//===========================================================
//※ 변수 설정
//===========================================================
let process = {};//임시 정보
let session = {
    db:undefined,//카드 DB (비용, 이름에 따라 정렬)
    index:{},//dbfid로 카드 DB 검색하기 위해 사용
    masterNode:undefined,//마스터 노드
    masterInfo:undefined,//마스터 인포
    masterSlot:undefined,//마스터 슬롯
    fragment:undefined,//프래그먼트
    offline:undefined//오프라인 모드 유무
};
//const TILEURL = "https://art.hearthstonejson.com/v1/tiles/";//HearthstoneJSON에서 이미지 가져오기
//const IMAGEURL = "https://art.hearthstonejson.com/v1/256x/";//HearthstoneJSON에서 이미지 가져오기
//const RENDERURL = "https://art.hearthstonejson.com/v1/render/latest/koKR/256x/";
const TILEURL = "./images/tiles/";
const PORTRAITURL = "./images/portraits/";
const HEROURL = "./images/heroes/";
//클러스터
let clusterize = {};
//꾹 눌려 카드정보 열람 auto
let autoInfo;
const AUTOINFOTIME = 500;//누르는 시간: 0.5초
//이벤트 관리
let eventObj = {
    "collection_list_content":{},
    "collection_list":{},
    "deck_list_content":{},
    "deck_list":{}
};

//===========================================================
//※ 상수 설정
//===========================================================
const DATA = {
    CLASS:{
        ID:{
            "WARRIOR":"HERO_01",
            "SHAMAN":"HERO_02",
            "ROGUE":"HERO_03",
            "PALADIN":"HERO_04",
            "HUNTER":"HERO_05",
            "DRUID":"HERO_06",
            "WARLOCK":"HERO_07",
            "MAGE":"HERO_08",
            "PRIEST":"HERO_09"
        },
        DBFID:{
            "WARRIOR":7,
            "SHAMAN":1066,
            "ROGUE":930,
            "PALADIN":671,
            "HUNTER":31,
            "DRUID":274,
            "WARLOCK":893,
            "MAGE":637,
            "PRIEST":813
        },
        KR:{
            "NEUTRAL":"중립",
            "WARRIOR":"전사",
            "SHAMAN":"주술사",
            "ROGUE":"도적",
            "PALADIN":"성기사",
            "HUNTER":"사냥꾼",
            "DRUID":"드루이드",
            "WARLOCK":"흑마법사",
            "MAGE":"마법사",
            "PRIEST":"사제"
        }
    },
    RARITY:{
        EN:{
            "기본":"FREE",
            "일반":"COMMON",
            "희귀":"RARE",
            "특급":"EPIC",
            "전설":"LEGENDARY"
        },
        KR:{
            "FREE":"기본",
            "COMMON":"일반",
            "RARE":"희귀",
            "EPIC":"특급",
            "LEGENDARY":"전설"
        },
        DUST:{
            "FREE":0,
            "COMMON":40,
            "RARE":100,
            "EPIC":400,
            "LEGENDARY":1600
        },
        COLOR:{
            "FREE":"#C0C0C0",
            "COMMON":"#FFFFFF",
            "RARE":"#44A5FF",
            "EPIC":"#BC81EA",
            "LEGENDARY":"#F07000"
        }
    },
    TYPE:{
        KR:{
            "SPELL":"주문",
            "MINION":"하수인",
            "WEAPON":"무기",
            "HERO":"영웅"
        }
    },
    RACE:{
        KR:{
            "ELEMENTAL":"정령",
            "MECHANICAL":"기계",
            "MECH":"기계",//향후 키워드 변경 대비
            "DEMON":"악마",
            "MURLOC":"멀록",
            "DRAGON":"용족",
            "BEAST":"야수",
            "PIRATE":"해적",
            "TOTEM":"토템",
            "ALL":"모두"
        }
    },
    DECKCODE_VERSION:1,
    FORMAT:{
        CODE:{
            "야생":1,
            "정규":2
        },
        DECODE:{
            "1":"야생",
            "2":"정규"
        },
        EN:{
            "야생":"wild",
            "정규":"standard"
        }
    },
    DECK_SLOT_LIMIT:5,
    DECK_LIMIT:30,
    //여기서부터 향후 업데이트 시 변경
    YEAR:"까마귀의 해",
    SET:{
        KR:{
            "CORE":"기본카드",
            "EXPERT1":"오리지널",
            "HOF":"명예의 전당",
            //2014↓
            "NAXX":"낙스라마스의 저주",
            "GVG":"고블린 대 노움",
            //2015↓
            "BRM":"검은바위 산",
            "TGT":"대 마상시합",
            "LOE":"탐험가 연맹",
            //2016↓
            "OG":"고대신의 속삭임",
            "KARA":"한여름 밤의 카라잔",
            "GANGS":"비열한 거리의 가젯잔",
            //2017↓
            "UNGORO":"운고로를 향한 여정",
            "ICECROWN":"얼어붙은 왕좌의 기사들",
            "LOOTAPALOOZA":"코볼트와 지하 미궁",
            //2018↓
            "GILNEAS":"마녀숲",
            "BOOMSDAY":"박사 붐의 폭심만만 프로젝트",
            "TROLL":"라스타칸의 대난투"
        },
        FORMAT:{
            "CORE":"정규",
            "EXPERT1":"정규",
            "HOF":"야생",
            //2014↓
            "NAXX":"야생",
            "GVG":"야생",
            //2015↓
            "BRM":"야생",
            "TGT":"야생",
            "LOE":"야생",
            //2016↓
            "OG":"야생",
            "KARA":"야생",
            "GANGS":"야생",
            //2017↓
            "UNGORO":"정규",
            "ICECROWN":"정규",
            "LOOTAPALOOZA":"정규",
            //2018↓
            "GILNEAS":"정규",
            "BOOMSDAY":"정규",
            "TROLL":"정규"
        },
        YEAR:{//연도가 있는 건 optgroup으로 따로 묶음
            //2014↓
            "NAXX":"2014",
            "GVG":"2014",
            //2015↓
            "BRM":"2015",
            "TGT":"2015",
            "LOE":"2015",
            //2016↓
            "OG":"2016",
            "KARA":"2016",
            "GANGS":"2016",
            //2017↓
            "UNGORO":"2017",
            "ICECROWN":"2017",
            "LOOTAPALOOZA":"2017",
            //2018↓
            "GILNEAS":"2018",
            "BOOMSDAY":"2018",
            "TROLL":"2018"
        }
        /*
        신규 확장팩을 적용하려면 다음 오브젝트를 추가하세요.
        NEW:{
            "name":"박사 붐의 폭심만만 프로젝트",
            "id":"BOOMSDAY",
            "year":"2018",
            "duedate":"2018-08-08"
        }
        */

    },


};
