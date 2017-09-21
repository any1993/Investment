package com.taikor.investment.utils;

/**
 * URl常量
 * Created by Any on 2017/8/1.
 */

public class Constant {


    public static final String ID = "saner20160620171903";//用于获取token
    public static final String appSecret = "7425812abd295629bf5db238a615a11fcb99774657b0a61cb055f156a74a0e77cd18a09bbe79839ffcffdcad6b860d2b8fca5eadd122216973368be0ea974edc0c6f83b720a9ff5a04136043e91680976ba702095001a19a4f8b491a1e929156790eddda515c681d28ed42635b78e83806b2f1d03ccbc026007b0fc711c33b35";

    public static final String LOCAL="http://192.168.2.59/";//本地测试
    public static final String URL_HEAD = "http://www.taikorcdn.com/reader/";//图片前缀
    public static final String URL_HEAD2 = "http://www.taikorcdn.com/";//专题图片前缀
    public static final String USER_ID = "br_1091827413";//测试用户

    //智能投顾
    public static final String PRODUCT = "https://api.palaspom.com/Investment/Products";//产品列表
    public static final String GROUP = "https://api.palaspom.com/Investment/Portfolios";//组合列表
    public static final String NEW_GROUP = "https://api.palaspom.com/Investment/NewPortfolio";//新建组合 POST


    public static final String BASE_URL = "https://api.palaspom.com/";

    public static final String CONFIRM = BASE_URL + "Oauth2/Authorize";//获取验证信息

    public static final String GENERAL_HEAD = BASE_URL + "Reader/Articles";//轮播图

    public static final String BANNER_DESC = BASE_URL + "Reader/ArticleDetail";//轮播图详情

    public static final String STOCK_PRICE = BASE_URL + "Reader/StockHistory";//大盘价格

    public static final String OPEN_DAY = BASE_URL + "Reader/GetStockOpendays";//交易日

    public static final String ASSET = BASE_URL + "Reader/CapitalFlow/sh000001";//主力资金流,上证指数
    public static final String ASSET_SHEN = BASE_URL + "Reader/CapitalFlow/sz399001";//主力资金流,深证成指
    public static final String ASSET_CHUANG = BASE_URL + "Reader/CapitalFlow/sz399006";//主力资金流,创业扳指

    public static final String STOCK_SHANG = BASE_URL + "Reader/EmotionIndexs/sh000001";//上证指数
    public static final String STOCK_SHEN = BASE_URL + "Reader/EmotionIndexs/sz399001";//深证成指
    public static final String STOCK_CHUANG = BASE_URL + "Reader/EmotionIndexs/sz399006";//创业扳指

    public static final String MARKET = BASE_URL + "Reader/PersonPoints";//市场观点

    public static final String MARKET_DESC = BASE_URL + "Reader/ItemDetailInfo";//市场观点详情

    public static final String UP_ADVICE = BASE_URL + "Reader/ViewPoints";//看涨观点榜

    public static final String ORDER_BLOCK=BASE_URL+"Reader/TradeBlocks" ;//下单排行，主题

    public static final String ORDER_STOCK=BASE_URL+"Reader/TradeStocks" ;//下单排行，个股

    public static final String PUSH_NEWS=BASE_URL+"Reader/HistoryRecommend" ;//推送资讯

    public static final String CHANNEL = BASE_URL + "Reader/Categorys";//频道

    public static final String HEAD = BASE_URL + "Reader/HeadArticles";//早中晚推送

    public static final String STOCK = BASE_URL + "Reader/Stocks";//三个股票指数

    public static final String USER_STOCK = BASE_URL + "Reader/GetUserStocks";//个股

    public static final String USER_THEME = BASE_URL + "Reader/GetUserBlocks";//主题

    public static final String HOT_EVENT = BASE_URL + "Investment/EventList";//热门事件

    public static final String HOT_THEME = BASE_URL + "Investment/TopicList";//热门主题

    public static final String MAIN_ADVICE = BASE_URL + "Investment/MainViewPoints";//大v投资观点

    public static final String THEME_PRICE=BASE_URL+"Reader/BlockHistory";//主题价格曲线

    public static final String HOT_INDEX=BASE_URL+"Reader/Topic";//热度指数

    public static final String SEARCH_NEWS=BASE_URL+"Isignal/FilterHotNews"; //搜索新闻
    public static final String SEARCH_THEME=BASE_URL+"Isignal/FilterHotTopics"; //搜索主题
    public static final String SEARCH_STOCK=BASE_URL+"Isignal/FilterHotStocks"; //搜索个股
//    public static final String SEARCH_STOCK=BASE_URL+"Reader/StockReportInfos"; //搜索个股
    public static final String SEARCH_NEWS_HOT=BASE_URL+"Isignal/GetNewsHotValue"; //新闻热度

    public static final String OPTIONAL_FUND=BASE_URL+"Investment/GetUserFunds";
}
