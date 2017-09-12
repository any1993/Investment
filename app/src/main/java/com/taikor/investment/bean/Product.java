package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 请求的产品
 * Created by Any on 2017/4/6.
 */

public class Product implements Serializable {
    /**
     * ProductID : cp001
     * ProductName : 产品001
     * UnitNet : 1.1
     * ProfitRate : 10.0
     * AccumulatedProfitRate : 20.2
     * AnnualizedProfitRate : 120.22
     * Scale : 2.3
     */

    private String ProductID;
    private String ProductName;
    private double UnitNet;
    private double ProfitRate;
    private double AccumulatedProfitRate;
    private double AnnualizedProfitRate;
    private double Scale;

    public Product(String productID, String productName, double annualizedProfitRate,double unitNet) {
        ProductID = productID;
        ProductName = productName;
        UnitNet = unitNet;
        AnnualizedProfitRate = annualizedProfitRate;
    }

    public String getProductID() {
        return ProductID;
    }

    public void setProductID(String ProductID) {
        this.ProductID = ProductID;
    }

    public String getProductName() {
        return ProductName;
    }

    public void setProductName(String ProductName) {
        this.ProductName = ProductName;
    }

    public double getUnitNet() {
        return UnitNet;
    }

    public void setUnitNet(double UnitNet) {
        this.UnitNet = UnitNet;
    }

    public double getProfitRate() {
        return ProfitRate;
    }

    public void setProfitRate(double ProfitRate) {
        this.ProfitRate = ProfitRate;
    }

    public double getAccumulatedProfitRate() {
        return AccumulatedProfitRate;
    }

    public void setAccumulatedProfitRate(double AccumulatedProfitRate) {
        this.AccumulatedProfitRate = AccumulatedProfitRate;
    }

    public double getAnnualizedProfitRate() {
        return AnnualizedProfitRate;
    }

    public void setAnnualizedProfitRate(double AnnualizedProfitRate) {
        this.AnnualizedProfitRate = AnnualizedProfitRate;
    }

    public double getScale() {
        return Scale;
    }

    public void setScale(double Scale) {
        this.Scale = Scale;
    }

}