package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 组合
 * Created by Any on 2017/3/31.
 */

public class Group implements Serializable{
    /**
     * PortfolioID : g01
     * PortfolioName : 测试组合
     * CreateTime : 1483200000000
     * NetWorth : 0.0
     * AnnualizedProfit : 0.0
     * MonthlyProfit : 0.0
     * Company : 上海态格信息技术有限公司
     * CompanyID : null
     * Manager : 测试客户01
     * ManagerID : 20000
     * ManagerImg : null
     * Follow : 0
     */

    private String PortfolioID;
    private String PortfolioName;
    private long CreateTime;
    private double NetWorth;
    private double AnnualizedProfit;
    private double MonthlyProfit;
    private String Company;
    private String CompanyID;
    private String Manager;
    private String ManagerID;
    private String ManagerImg;
    private int Follow;

    public String getPortfolioID() {
        return PortfolioID;
    }

    public void setPortfolioID(String PortfolioID) {
        this.PortfolioID = PortfolioID;
    }

    public String getPortfolioName() {
        return PortfolioName;
    }

    public void setPortfolioName(String PortfolioName) {
        this.PortfolioName = PortfolioName;
    }

    public long getCreateTime() {
        return CreateTime;
    }

    public void setCreateTime(long CreateTime) {
        this.CreateTime = CreateTime;
    }

    public double getNetWorth() {
        return NetWorth;
    }

    public void setNetWorth(double NetWorth) {
        this.NetWorth = NetWorth;
    }

    public double getAnnualizedProfit() {
        return AnnualizedProfit;
    }

    public void setAnnualizedProfit(double AnnualizedProfit) {
        this.AnnualizedProfit = AnnualizedProfit;
    }

    public double getMonthlyProfit() {
        return MonthlyProfit;
    }

    public void setMonthlyProfit(double MonthlyProfit) {
        this.MonthlyProfit = MonthlyProfit;
    }

    public String getCompany() {
        return Company;
    }

    public void setCompany(String Company) {
        this.Company = Company;
    }

    public String getCompanyID() {
        return CompanyID;
    }

    public void setCompanyID(String CompanyID) {
        this.CompanyID = CompanyID;
    }

    public String getManager() {
        return Manager;
    }

    public void setManager(String Manager) {
        this.Manager = Manager;
    }

    public String getManagerID() {
        return ManagerID;
    }

    public void setManagerID(String ManagerID) {
        this.ManagerID = ManagerID;
    }

    public String getManagerImg() {
        return ManagerImg;
    }

    public void setManagerImg(String ManagerImg) {
        this.ManagerImg = ManagerImg;
    }

    public int getFollow() {
        return Follow;
    }

    public void setFollow(int Follow) {
        this.Follow = Follow;
    }
}
