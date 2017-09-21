package com.taikor.investment.bean;

/**
 * Created by Any on 2017/9/13.
 */

public class SearchStock {

    /**
     * StockID : sample string 1
     * StockName : sample string 2
     * RelatedTopicID : sample string 3
     * RelatedTopicName : sample string 4
     * LastAdjustTime : 2017-09-13T15:31:36.4384502+08:00
     * AdjustReportCount : 6
     * AdjustPercent : 7.1
     */

    private String StockID;
    private String StockName;
    private String RelatedTopicID;
    private String RelatedTopicName;
    private String LastAdjustTime;
    private int AdjustReportCount;
    private double AdjustPercent;

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

    public String getRelatedTopicID() {
        return RelatedTopicID;
    }

    public void setRelatedTopicID(String RelatedTopicID) {
        this.RelatedTopicID = RelatedTopicID;
    }

    public String getRelatedTopicName() {
        return RelatedTopicName;
    }

    public void setRelatedTopicName(String RelatedTopicName) {
        this.RelatedTopicName = RelatedTopicName;
    }

    public String getLastAdjustTime() {
        return LastAdjustTime;
    }

    public void setLastAdjustTime(String LastAdjustTime) {
        this.LastAdjustTime = LastAdjustTime;
    }

    public int getAdjustReportCount() {
        return AdjustReportCount;
    }

    public void setAdjustReportCount(int AdjustReportCount) {
        this.AdjustReportCount = AdjustReportCount;
    }

    public double getAdjustPercent() {
        return AdjustPercent;
    }

    public void setAdjustPercent(double AdjustPercent) {
        this.AdjustPercent = AdjustPercent;
    }
}
