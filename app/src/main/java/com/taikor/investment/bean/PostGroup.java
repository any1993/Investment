package com.taikor.investment.bean;

import java.io.Serializable;
import java.util.List;

/**
 * 上传的组合
 * Created by Any on 2017/3/31.
 */

public class PostGroup implements Serializable {
    /**
     * {
     * "PortfolioName": "sample string 1",
     * "UserID": "sample string 2",
     * "Type": 3,
     * "ExpectedProfit": 1.0,
     * "InvestmentAmount": 1.0,
     * "MaxVolatility": 1.0,
     * "ProductType": 4,
     * "Description": "sample string 5",
     * "Benchmark": 6,
     * "Share": true,
     * "Products": [
     * {
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
     * },
     * {
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
     * }
     * ]
     * }
     */

    private String PortfolioName;
    private String UserID;
    private int Type;
    private double ExpectedProfit;
    private double InvestmentAmount;
    private double MaxVolatility;
    private int ProductType;
    private String Description;
    private int Benchmark;
    private boolean Share;
    private List<PostProduct> Products;

    public String getPortfolioName() {
        return PortfolioName;
    }

    public void setPortfolioName(String portfolioName) {
        PortfolioName = portfolioName;
    }

    public String getUserID() {
        return UserID;
    }

    public void setUserID(String userID) {
        UserID = userID;
    }

    public int getType() {
        return Type;
    }

    public void setType(int type) {
        Type = type;
    }

    public double getExpectedProfit() {
        return ExpectedProfit;
    }

    public void setExpectedProfit(double expectedProfit) {
        ExpectedProfit = expectedProfit;
    }

    public double getInvestmentAmount() {
        return InvestmentAmount;
    }

    public void setInvestmentAmount(double investmentAmount) {
        InvestmentAmount = investmentAmount;
    }

    public double getMaxVolatility() {
        return MaxVolatility;
    }

    public void setMaxVolatility(double maxVolatility) {
        MaxVolatility = maxVolatility;
    }

    public int getProductType() {
        return ProductType;
    }

    public void setProductType(int productType) {
        ProductType = productType;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public int getBenchmark() {
        return Benchmark;
    }

    public void setBenchmark(int benchmark) {
        Benchmark = benchmark;
    }

    public boolean isShare() {
        return Share;
    }

    public void setShare(boolean share) {
        Share = share;
    }

    public List<PostProduct> getProducts() {
        return Products;
    }

    public void setProducts(List<PostProduct> products) {
        Products = products;
    }
}
