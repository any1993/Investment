package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 行情指数
 * Created by Any on 2017/7/28.
 */

public class MainAdvice implements Serializable{

    /**
     * BlockView : {"ViewID":"8b5a72da1a1fb7eeb7bbbd7603a20e25","HeadImg":"http://u.thsi.cn/fileupload/data/Flashcms/2015/183501062_27ebc5be58984b238344b3ed1ebc26f4.jpg","AuthorName":"赢在龙头","Type":0,"FanCount":null,"Accuray":null,"Title":"如何应对周二反弹","ItemName":"上证指数","ItemTrade":3286.06,"ItemChange":-0.03}
     * TopicView : {"ViewID":"dc4fea6bd822861e292d61ef36846b8c","HeadImg":"http://itg1.jrjimg.cn/201705/26/itougu/itougu_14957927362261.jpg","AuthorName":"Z点操盘","Type":0,"FanCount":null,"Accuray":null,"Title":"传粤港澳迎来重大政策礼包 接棒雄安带动A股崛起？","ItemName":"石墨烯","ItemTrade":7.48,"ItemChange":11.7311413771063}
     * StockView : {"ViewID":"11f5f827a32a107cbed87dbb8597404e","HeadImg":"http://itg1.jrjimg.cn/201705/26/itougu/itougu_14957927362261.jpg","AuthorName":"Z点操盘","Type":0,"FanCount":null,"Accuray":null,"Title":"\u201c大明星\u201d万科A连续涨停！地产股投资盛宴到来？","ItemName":"中国宝安","ItemTrade":8.44,"ItemChange":-0.71}
     */

    private BlockViewBean BlockView;
    private TopicViewBean TopicView;
    private StockViewBean StockView;

    public BlockViewBean getBlockView() {
        return BlockView;
    }

    public void setBlockView(BlockViewBean BlockView) {
        this.BlockView = BlockView;
    }

    public TopicViewBean getTopicView() {
        return TopicView;
    }

    public void setTopicView(TopicViewBean TopicView) {
        this.TopicView = TopicView;
    }

    public StockViewBean getStockView() {
        return StockView;
    }

    public void setStockView(StockViewBean StockView) {
        this.StockView = StockView;
    }

    public static class BlockViewBean implements Serializable{
        /**
         * ViewID : 8b5a72da1a1fb7eeb7bbbd7603a20e25
         * HeadImg : http://u.thsi.cn/fileupload/data/Flashcms/2015/183501062_27ebc5be58984b238344b3ed1ebc26f4.jpg
         * AuthorName : 赢在龙头
         * Type : 0
         * FanCount : null
         * Accuray : null
         * Title : 如何应对周二反弹
         * ItemName : 上证指数
         * ItemTrade : 3286.06
         * ItemChange : -0.03
         */

        private String ViewID;
        private String HeadImg;
        private String AuthorName;
        private int Type;
        private Object FanCount;
        private Object Accuray;
        private String Title;
        private String ItemName;
        private double ItemTrade;
        private double ItemChange;

        public String getViewID() {
            return ViewID;
        }

        public void setViewID(String ViewID) {
            this.ViewID = ViewID;
        }

        public String getHeadImg() {
            return HeadImg;
        }

        public void setHeadImg(String HeadImg) {
            this.HeadImg = HeadImg;
        }

        public String getAuthorName() {
            return AuthorName;
        }

        public void setAuthorName(String AuthorName) {
            this.AuthorName = AuthorName;
        }

        public int getType() {
            return Type;
        }

        public void setType(int Type) {
            this.Type = Type;
        }

        public Object getFanCount() {
            return FanCount;
        }

        public void setFanCount(Object FanCount) {
            this.FanCount = FanCount;
        }

        public Object getAccuray() {
            return Accuray;
        }

        public void setAccuray(Object Accuray) {
            this.Accuray = Accuray;
        }

        public String getTitle() {
            return Title;
        }

        public void setTitle(String Title) {
            this.Title = Title;
        }

        public String getItemName() {
            return ItemName;
        }

        public void setItemName(String ItemName) {
            this.ItemName = ItemName;
        }

        public double getItemTrade() {
            return ItemTrade;
        }

        public void setItemTrade(double ItemTrade) {
            this.ItemTrade = ItemTrade;
        }

        public double getItemChange() {
            return ItemChange;
        }

        public void setItemChange(double ItemChange) {
            this.ItemChange = ItemChange;
        }
    }

    public static class TopicViewBean implements Serializable{
        /**
         * ViewID : dc4fea6bd822861e292d61ef36846b8c
         * HeadImg : http://itg1.jrjimg.cn/201705/26/itougu/itougu_14957927362261.jpg
         * AuthorName : Z点操盘
         * Type : 0
         * FanCount : null
         * Accuray : null
         * Title : 传粤港澳迎来重大政策礼包 接棒雄安带动A股崛起？
         * ItemName : 石墨烯
         * ItemTrade : 7.48
         * ItemChange : 11.7311413771063
         */

        private String ViewID;
        private String HeadImg;
        private String AuthorName;
        private int Type;
        private Object FanCount;
        private Object Accuray;
        private String Title;
        private String ItemName;
        private double ItemTrade;
        private double ItemChange;

        public String getViewID() {
            return ViewID;
        }

        public void setViewID(String ViewID) {
            this.ViewID = ViewID;
        }

        public String getHeadImg() {
            return HeadImg;
        }

        public void setHeadImg(String HeadImg) {
            this.HeadImg = HeadImg;
        }

        public String getAuthorName() {
            return AuthorName;
        }

        public void setAuthorName(String AuthorName) {
            this.AuthorName = AuthorName;
        }

        public int getType() {
            return Type;
        }

        public void setType(int Type) {
            this.Type = Type;
        }

        public Object getFanCount() {
            return FanCount;
        }

        public void setFanCount(Object FanCount) {
            this.FanCount = FanCount;
        }

        public Object getAccuray() {
            return Accuray;
        }

        public void setAccuray(Object Accuray) {
            this.Accuray = Accuray;
        }

        public String getTitle() {
            return Title;
        }

        public void setTitle(String Title) {
            this.Title = Title;
        }

        public String getItemName() {
            return ItemName;
        }

        public void setItemName(String ItemName) {
            this.ItemName = ItemName;
        }

        public double getItemTrade() {
            return ItemTrade;
        }

        public void setItemTrade(double ItemTrade) {
            this.ItemTrade = ItemTrade;
        }

        public double getItemChange() {
            return ItemChange;
        }

        public void setItemChange(double ItemChange) {
            this.ItemChange = ItemChange;
        }
    }

    public static class StockViewBean implements Serializable{
        /**
         * ViewID : 11f5f827a32a107cbed87dbb8597404e
         * HeadImg : http://itg1.jrjimg.cn/201705/26/itougu/itougu_14957927362261.jpg
         * AuthorName : Z点操盘
         * Type : 0
         * FanCount : null
         * Accuray : null
         * Title : “大明星”万科A连续涨停！地产股投资盛宴到来？
         * ItemName : 中国宝安
         * ItemTrade : 8.44
         * ItemChange : -0.71
         */

        private String ViewID;
        private String HeadImg;
        private String AuthorName;
        private int Type;
        private Object FanCount;
        private Object Accuray;
        private String Title;
        private String ItemName;
        private double ItemTrade;
        private double ItemChange;

        public String getViewID() {
            return ViewID;
        }

        public void setViewID(String ViewID) {
            this.ViewID = ViewID;
        }

        public String getHeadImg() {
            return HeadImg;
        }

        public void setHeadImg(String HeadImg) {
            this.HeadImg = HeadImg;
        }

        public String getAuthorName() {
            return AuthorName;
        }

        public void setAuthorName(String AuthorName) {
            this.AuthorName = AuthorName;
        }

        public int getType() {
            return Type;
        }

        public void setType(int Type) {
            this.Type = Type;
        }

        public Object getFanCount() {
            return FanCount;
        }

        public void setFanCount(Object FanCount) {
            this.FanCount = FanCount;
        }

        public Object getAccuray() {
            return Accuray;
        }

        public void setAccuray(Object Accuray) {
            this.Accuray = Accuray;
        }

        public String getTitle() {
            return Title;
        }

        public void setTitle(String Title) {
            this.Title = Title;
        }

        public String getItemName() {
            return ItemName;
        }

        public void setItemName(String ItemName) {
            this.ItemName = ItemName;
        }

        public double getItemTrade() {
            return ItemTrade;
        }

        public void setItemTrade(double ItemTrade) {
            this.ItemTrade = ItemTrade;
        }

        public double getItemChange() {
            return ItemChange;
        }

        public void setItemChange(double ItemChange) {
            this.ItemChange = ItemChange;
        }
    }
}
