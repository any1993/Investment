package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 个股排行
 * Created by Any on 2017/8/17.
 */

public class StockOrder implements Serializable {

    /**
     * Stock : {"Symbol":"sz300059","Code":"300059","Name":"东方财富","Trade":14.06,"Pricechange":-0.06,"Changepercent":-0.42,"Buy":0,"Sell":0,"Settlement":14.12,"Open":13.99,"High":14.47,"Low":13.92,"Close":0,"TransferRate":7.17,"VolumeRatio":1.17,"PERatio":115.92,"PBRatio":4.59,"Amplitude":3.9,"Volume":2285940,"Amount":323953.1216,"MarketValue":444.75,"FloathingStock":31.88,"SumMarketValue":0,"Speed":0,"Ticktime":"2017-08-17T15:00:00+08:00","BlockID":null,"RelatedBlock":null}
     * SellCount : 1
     * BuyCount : 0
     * Relativity : 0.0
     * PullTime : 0001-01-01T00:00:00
     */

    private Stock Stock;
    private int SellCount;
    private int BuyCount;
    private double Relativity;
    private String PullTime;

    public Stock getStock() {
        return Stock;
    }

    public void setStock(Stock Stock) {
        this.Stock = Stock;
    }

    public int getSellCount() {
        return SellCount;
    }

    public void setSellCount(int SellCount) {
        this.SellCount = SellCount;
    }

    public int getBuyCount() {
        return BuyCount;
    }

    public void setBuyCount(int BuyCount) {
        this.BuyCount = BuyCount;
    }

    public double getRelativity() {
        return Relativity;
    }

    public void setRelativity(double Relativity) {
        this.Relativity = Relativity;
    }

    public String getPullTime() {
        return PullTime;
    }

    public void setPullTime(String PullTime) {
        this.PullTime = PullTime;
    }


}
