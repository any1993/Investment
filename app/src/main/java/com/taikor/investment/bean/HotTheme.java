package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 热门主题
 * Created by Any on 2017/7/28.
 */

public class HotTheme implements Serializable{

    /**
     * TopicID : BL_ZZGN
     * TopicName : 重组概念
     * TopicTrade : 511.244441909558
     * TopicChange : -0.488755558090442
     * ArticleID : 4e0c7d4c7665f109c8e7be60fe3325de
     * ArticleTitle : 预警！四部委关注“非理性对外投资” 这三类投资可能受到严格审查！
     * StockID : sz002558
     * StockName : 巨人网络
     * StockChange : 0.24
     */

    private String TopicID;
    private String TopicName;
    private double TopicTrade;
    private double TopicChange;
    private String ArticleID;
    private String ArticleTitle;
    private String StockID;
    private String StockName;
    private double StockChange;

    public String getTopicID() {
        return TopicID;
    }

    public void setTopicID(String TopicID) {
        this.TopicID = TopicID;
    }

    public String getTopicName() {
        return TopicName;
    }

    public void setTopicName(String TopicName) {
        this.TopicName = TopicName;
    }

    public double getTopicTrade() {
        return TopicTrade;
    }

    public void setTopicTrade(double TopicTrade) {
        this.TopicTrade = TopicTrade;
    }

    public double getTopicChange() {
        return TopicChange;
    }

    public void setTopicChange(double TopicChange) {
        this.TopicChange = TopicChange;
    }

    public String getArticleID() {
        return ArticleID;
    }

    public void setArticleID(String ArticleID) {
        this.ArticleID = ArticleID;
    }

    public String getArticleTitle() {
        return ArticleTitle;
    }

    public void setArticleTitle(String ArticleTitle) {
        this.ArticleTitle = ArticleTitle;
    }

    public String getStockID() {
        return StockID;
    }

    public void setStockID(String StockID) {
        this.StockID = StockID;
    }

    public String getStockName() {
        return StockName;
    }

    public void setStockName(String StockName) {
        this.StockName = StockName;
    }

    public double getStockChange() {
        return StockChange;
    }

    public void setStockChange(double StockChange) {
        this.StockChange = StockChange;
    }
}
