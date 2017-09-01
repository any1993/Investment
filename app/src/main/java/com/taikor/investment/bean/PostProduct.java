package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 上传的产品
 * Created by Any on 2017/4/6.
 */

public class PostProduct implements Serializable {
    /**
     * "ProductID": "sample string 1",
     * "ProductName": "sample string 2",
     * "PurchaseAmount": 1.0,
     * "PurchaseDate": 1,
     * "PurchasePoint": 1,
     * "ChargeType": 1,
     * "TransactionRate": "sample string 3",
     * "Dividend": 1,
     * "NetWorth": 1.0,
     * "TradingShare": 1.0,
     * "Proportion": 1.0
     */
    private String ProductID;
    private String ProductName;
    private double PurchaseAmount;
    private long PurchaseDate;
    private int PurchasePoint;
    private int ChargeType;
    private String TransactionRate;
    private int Dividend;
    private double NetWorth;
    private double TradingShare;
    private double Proportion;

    public String getProductID() {
        return ProductID;
    }

    public void setProductID(String productID) {
        ProductID = productID;
    }

    public String getProductName() {
        return ProductName;
    }

    public void setProductName(String productName) {
        ProductName = productName;
    }

    public double getPurchaseAmount() {
        return PurchaseAmount;
    }

    public void setPurchaseAmount(double purchaseAmount) {
        PurchaseAmount = purchaseAmount;
    }

    public long getPurchaseDate() {
        return PurchaseDate;
    }

    public void setPurchaseDate(long purchaseDate) {
        PurchaseDate = purchaseDate;
    }

    public int getPurchasePoint() {
        return PurchasePoint;
    }

    public void setPurchasePoint(int purchasePoint) {
        PurchasePoint = purchasePoint;
    }

    public int getChargeType() {
        return ChargeType;
    }

    public void setChargeType(int chargeType) {
        ChargeType = chargeType;
    }

    public String getTransactionRate() {
        return TransactionRate;
    }

    public void setTransactionRate(String transactionRate) {
        TransactionRate = transactionRate;
    }

    public int getDividend() {
        return Dividend;
    }

    public void setDividend(int dividend) {
        Dividend = dividend;
    }

    public double getNetWorth() {
        return NetWorth;
    }

    public void setNetWorth(double netWorth) {
        NetWorth = netWorth;
    }

    public double getTradingShare() {
        return TradingShare;
    }

    public void setTradingShare(double tradingShare) {
        TradingShare = tradingShare;
    }

    public double getProportion() {
        return Proportion;
    }

    public void setProportion(double proportion) {
        Proportion = proportion;
    }
    
}