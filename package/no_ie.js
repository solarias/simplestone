(function() {
    var agent = navigator.userAgent.toLowerCase();
    if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
        var _message = "※ 인터넷 익스플로러에서는 해당 사이트를 이용할 수 없습니다." +
        "\n크롬, 파이어폭스 등 다른 브라우저를 이용해주세요.";
        alert(_message);
    }
})();
