package com.taikor.investment.bean;

/**
 * Created by Any on 2017/9/20.
 */

public class Fund {
    private String FundID;
    private String FundName;
    private double UnitNet;
    private int Scale;
    private double ProfitRate;

    public String getFundID() {
        return FundID;
    }

    public void setFundID(String fundID) {
        FundID = fundID;
    }

    public String getFundName() {
        return FundName;
    }

    public void setFundName(String fundName) {
        FundName = fundName;
    }

    public double getUnitNet() {
        return UnitNet;
    }

    public void setUnitNet(double unitNet) {
        UnitNet = unitNet;
    }

    public int getScale() {
        return Scale;
    }

    public void setScale(int scale) {
        Scale = scale;
    }

    public double getProfitRate() {
        return ProfitRate;
    }

    public void setProfitRate(double profitRate) {
        ProfitRate = profitRate;
    }
}
