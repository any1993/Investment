package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 热门事件
 * Created by Any on 2017/7/28.
 */

public class HotEvent implements Serializable {


    /**
     * EventID : 8a83e648890011e7a9100242ac11000d
     * EventType : BL_JYCY
     * RsingRate : 0.0
     * StockID : sh601099
     * StockName : 太平洋
     * StockChange : 4.12
     * Title : 法尔胜2017年半年报点评:保理业务增厚业绩,资产结构持续优化【太平洋非银*魏涛团队】
     * FirstAppear : 1503598800
     * LastAppear : 1503598800
     */

    private String EventID;
    private String EventType;
    private double RsingRate;
    private String StockID;
    private String StockName;
    private double StockChange;
    private String Title;
    private int FirstAppear;
    private int LastAppear;

    public String getEventID() {
        return EventID;
    }

    public void setEventID(String EventID) {
        this.EventID = EventID;
    }

    public String getEventType() {
        return EventType;
    }

    public void setEventType(String EventType) {
        this.EventType = EventType;
    }

    public double getRsingRate() {
        return RsingRate;
    }

    public void setRsingRate(double RsingRate) {
        this.RsingRate = RsingRate;
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

    public String getTitle() {
        return Title;
    }

    public void setTitle(String Title) {
        this.Title = Title;
    }

    public int getFirstAppear() {
        return FirstAppear;
    }

    public void setFirstAppear(int FirstAppear) {
        this.FirstAppear = FirstAppear;
    }

    public int getLastAppear() {
        return LastAppear;
    }

    public void setLastAppear(int LastAppear) {
        this.LastAppear = LastAppear;
    }
}
