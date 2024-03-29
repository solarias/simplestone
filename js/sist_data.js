
//===========================================================
//※ 변수 설정
//===========================================================
let process = {};//임시 정보
let session = {
    serverVersion:undefined,//서버 버전 (업데이트 확인용)
    metadata:undefined,//메타데이터('직업', '종족', '세트', '등급', '종류' 정보)
    db:undefined,//카드 DB (비용, 이름에 따라 정렬)
    dbIndex:{},//카드 탐색용 오브젝트(By ID) - 가장 빠른 방법
    classInfo:{},//직업 탐색용 오브젝트(By slug)
    masterNode:undefined,//마스터 노드
    masterInfo:undefined,//마스터 인포
    masterSlot:undefined,//마스터 슬롯
    masterMetaSlot:undefined,//마스터 메타슬롯
    fragment:undefined,//프래그먼트
    urlParams:[],//URL 패러미터 정보
    offline:false,//오프라인 모드 유무(디폴트 : 사용안함)
    chart:{
        init:false,//차트 초기화여부
        show:false,//차트 출력여부(디폴트 : 출력안함)
        mana:undefined,//차트 - 마나커브
        mana_monitor:undefined,//차트 - 마나커브
        type:undefined,//차트 - 타입
        type_monitor:undefined//차트 - 타입
    },
    setting:undefined//심플스톤 각종 설정
};
let isError = {}//에러 발생 시 1회에 한해 출력
//const TILEURL = "https://art.hearthstonejson.com/v1/tiles/";//HearthstoneJSON에서 이미지 가져오기
//const IMAGEURL = "https://art.hearthstonejson.com/v1/256x/";//HearthstoneJSON에서 이미지 가져오기
//const RENDERURL = "https://art.hearthstonejson.com/v1/render/latest/koKR/256x/";
const DATAURL = "https://solarias.github.io/simplestone_database/json/"
const TILEURL = "https://solarias.github.io/simplestone_database/tile/tile_"
//const TILEURL = "./tile/tile_"//localhost에서 테스트 시 활용
const PORTRAITURL = "./images/portraits/"
    /*const TILEURL_REPLACE = "./images/tiles_replace/"
    const PORTRAITURL_REPLACE = "./images/portraits_replace/"*/
const HEROURL = "https://solarias.github.io/simplestone_database/tile/tile_"
    //const HEROURL = "./images/heroes/" - 기존 로컬 링크
const METADECKAPI = {
    "solarias.github.io":"https://solarias.github.io/simplestone_metadeck/",
    //"localhost":"./localtest/",
    "localhost":"https://solarias.github.io/simplestone_metadeck/"
}
const DECKMAX = 1000//덱 최대 보유량
const METADECKMAX = 100;//메타덱 출력 최대 순위
    //메타덱 API는 hsreplay에서 데이터를 수집하려 파일별로 나눠 보관함
    //metadeck_archetype.json : 덱 아키타입
    //metadeck_hot_standard.json : 인기있는 덱 - 정규
    //metadeck_hot_wild.json : 인기있는 덱 - 야생
    //metadeck_winrate_standard.json : 승률높은 덱 - 정규
    //metadeck_winrate_wild.json : 승률높은 덱 - 야생
    //metadeck_update.json : 메타덱 업데이트 기록
const REFRESH_HOUR = 1;//1시간마다 메타덱 갱신 가능(서버에서)
//클러스터
let clusterize = {};
//클릭, 터치 이벤트 관련
let autoInfo;//꾹 눌려 카드정보 열람 auto
let cardReady = 0;//이 값이 1인 상태에서만 카드 추가 가능
const AUTOINFOTIME = 500;//카드 정보를 보기 위해 누르는 시간: 0.5초
//이벤트 관리
let eventObj = {
    "collection_list_result_content":{},
    "collection_list_result":{},
    "collection_illust_result_content":{},
    "collection_illust":{},
    "deck_list_content":{},
    "deck_list":{}
};
//모바일 종료 관련
let autoPopstate;//뒤로 가기 방지 히스토리 자동생성용
let blockBack = 0;//1일 경우 뒤로 히스토리 뒤로 가기 감지

//===========================================================
//※ 상수 설정
//===========================================================
const DATA = {
    CLASS:{
        ID:{//직업명 루프가 필요하면 해당 오브젝트 사용
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
            "NEUTRAL":"중립",
            "ALL":"모든 직업",
        },
        CLASSIC:[//클래식 직업군(루프전용)
            "WARRIOR","SHAMAN","ROGUE",
            "PALADIN","HUNTER","DRUID",
            "WARLOCK","MAGE","PRIEST"
        ],
        CARDCLASS:[//카드 관련 직업명(루프전용)
            "WARRIOR","SHAMAN","ROGUE",
            "PALADIN","HUNTER","DRUID",
            "WARLOCK","MAGE","PRIEST",
            "NEUTRAL"],
        METADECKCLASS:[//메타덱 관련 직업명(루프 전용)
            "WARRIOR","SHAMAN","ROGUE",
            "PALADIN","HUNTER","DRUID",
            "WARLOCK","MAGE","PRIEST",
            "ALL"],
        COLOR:{
            "WARRIOR":"red",
            "SHAMAN":"blue",
            "ROGUE":"navy",
            "PALADIN":"orage",
            "HUNTER":"gold",
            "DRUID":"brown",
            "WARLOCK":"purple",
            "MAGE":"azure",
            "PRIEST":"white"
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
        },
        COLOR_DECKIMAGE:{//덱이미지 출력 전용 컬러
            "FREE":"#B0B0B0",
            "COMMON":"#FFFFFF",
            "RARE":"#7AC3FF",
            "EPIC":"#D06AE2",
            "LEGENDARY":"#EF892F"
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
            "wild":1,//에러 방지
            "정규":2,
            "standard":2,//에러 방지
            "클래식":3,
            "classic":3//에러 방지
        },
        DECODE:{
            "1":"야생",
            "2":"정규",
            "3":"클래식",
        },
        EN:{
            "야생":"wild",
            "정규":"standard",
            "클래식":"classic"
        },
        KR:{
            "wild":"야생",
            "standard":"정규",
            "classic":"클래식"
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
        "NAXX":{KR:"낙스라마스의 저주",FORMAT:"야생",YEAR:2014},
        "GVG":{KR:"고블린 대 노움",FORMAT:"야생",YEAR:2014},
        //2015↓
        "BRM":{KR:"검은바위 산",FORMAT:"야생",YEAR:2015},
        "TGT":{KR:"대 마상시합",FORMAT:"야생",YEAR:2015},
        "LOE":{KR:"탐험가 연맹",FORMAT:"야생",YEAR:2015},
        //2016↓
        "OG":{KR:"고대신의 속삭임",FORMAT:"야생",YEAR:2016},
        "KARA":{KR:"한여름 밤의 카라잔",FORMAT:"야생",YEAR:2016},
        "GANGS":{KR:"비열한 거리의 가젯잔",FORMAT:"야생",YEAR:2016},
        //2017↓
        "UNGORO":{KR:"운고로를 향한 여정",FORMAT:"야생",YEAR:2017},
        "ICECROWN":{KR:"얼어붙은 왕좌의 기사들",FORMAT:"야생",YEAR:2017},
        "LOOTAPALOOZA":{KR:"코볼트와 지하 미궁",FORMAT:"야생",YEAR:2017},
        //2018↓
        "GILNEAS":{KR:"마녀숲",FORMAT:"정규",YEAR:2018},
        "BOOMSDAY":{KR:"박사 붐의 폭심만만 프로젝트",FORMAT:"정규",YEAR:2018},
        "TROLL":{KR:"라스타칸의 대난투",FORMAT:"정규",YEAR:2018},
        //2019↓
        "DALARAN":{KR:"어둠의 반격",FORMAT:"정규",YEAR:2019},
        "ULDUM":{KR:"울둠의 구원자",FORMAT:"정규",YEAR:2019},
        "WILD_EVENT":{KR:"야생 이벤트(2019)",FORMAT:"야생",YEAR:2019, EVENT:true},//이벤트
        "DRAGONS":{KR:"용의 강림",FORMAT:"정규",YEAR:2019},
        "YEAR_OF_THE_DRAGON":{KR:"갈라크론드의 부활",FORMAT:"정규",YEAR:2019},//최신팩
    },
    SET_LATEST:"YEAR_OF_THE_DRAGON"//최신 확장팩 명(영문)을 여기에 기재
};
