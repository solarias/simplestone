
//===========================================================
//※ 변수 설정
//===========================================================
let process = {};//임시 정보
let session = {
    dbVersion:undefined,//카드 DB 버전 (업데이트 확인용)
    db:undefined,//카드 DB (비용, 이름에 따라 정렬)
    index:{},//dbfid로 카드 DB 검색하기 위해 사용
    masterNode:undefined,//마스터 노드
    masterInfo:undefined,//마스터 인포
    masterSlot:undefined,//마스터 슬롯
    masterMetaSlot:undefined,//마스터 메타슬롯
    fragment:undefined,//프래그먼트
    urlParams:[],//URL 패러미터 정보
    offline:false//오프라인 모드 유무(디폴트 : 사용안함)
};
//const TILEURL = "https://art.hearthstonejson.com/v1/tiles/";//HearthstoneJSON에서 이미지 가져오기
//const IMAGEURL = "https://art.hearthstonejson.com/v1/256x/";//HearthstoneJSON에서 이미지 가져오기
//const RENDERURL = "https://art.hearthstonejson.com/v1/render/latest/koKR/256x/";
const TILEURL = "./images/tiles/";
const PORTRAITURL = "./images/portraits/";
const HEROURL = "./images/heroes/";
const METADECKURL = {
    standard:"https://hsreplay.net/analytics/query/list_decks_by_win_rate/?GameType=RANKED_STANDARD&RankRange=LEGEND_THROUGH_TWENTY&TimeRange=LAST_30_DAYS",
    wild:"https://hsreplay.net/analytics/query/list_decks_by_win_rate/?GameType=RANKED_WILD&RankRange=LEGEND_THROUGH_TWENTY&TimeRange=LAST_30_DAYS"
};
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
            "WARRIOR":"전사",
            "SHAMAN":"주술사",
            "ROGUE":"도적",
            "PALADIN":"성기사",
            "HUNTER":"사냥꾼",
            "DRUID":"드루이드",
            "WARLOCK":"흑마법사",
            "MAGE":"마법사",
            "PRIEST":"사제",
            "NEUTRAL":"중립"
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
    YEAR:"용의 해",
    SET:{
        "CORE":{KR:"기본카드",FORMAT:"정규"},
        "EXPERT1":{KR:"오리지널",FORMAT:"정규"},
        "HOF":{KR:"명예의 전당",FORMAT:"야생"},
        //2014↓, 연도가 있는 건 optgroup으로 따로 묶음
        "NAXX":{KR:"낙스라마스의 저주",FORMAT:"야생",YEAR:"2014"},
        "GVG":{KR:"고블린 대 노움",FORMAT:"야생",YEAR:"2014"},
        //2015↓
        "BRM":{KR:"검은바위 산",FORMAT:"야생",YEAR:"2015"},
        "TGT":{KR:"대 마상시합",FORMAT:"야생",YEAR:"2015"},
        "LOE":{KR:"탐험가 연맹",FORMAT:"야생",YEAR:"2015"},
        //2016↓
        "OG":{KR:"고대신의 속삭임",FORMAT:"야생",YEAR:"2016"},
        "KARA":{KR:"한여름 밤의 카라잔",FORMAT:"야생",YEAR:"2016"},
        "GANGS":{KR:"비열한 거리의 가젯잔",FORMAT:"야생",YEAR:"2016"},
        //2017↓
        "UNGORO":{KR:"운고로를 향한 여정",FORMAT:"야생",YEAR:"2017"},
        "ICECROWN":{KR:"얼어붙은 왕좌의 기사들",FORMAT:"야생",YEAR:"2017"},
        "LOOTAPALOOZA":{KR:"코볼트와 지하 미궁",FORMAT:"야생",YEAR:"2017"},
        //2018↓
        "GILNEAS":{KR:"마녀숲",FORMAT:"정규",YEAR:"2018"},
        "BOOMSDAY":{KR:"박사 붐의 폭심만만 프로젝트",FORMAT:"정규",YEAR:"2018"},
        "TROLL":{KR:"라스타칸의 대난투",FORMAT:"정규",YEAR:"2018"},
        //2019↓
        "DALARAN":{KR:"어둠의 반격",FORMAT:"정규",YEAR:"2019"}//최신팩
    },
    SET_LATEST:"DALARAN"//최신 확장팩 명(영문)을 여기에 기재
};
