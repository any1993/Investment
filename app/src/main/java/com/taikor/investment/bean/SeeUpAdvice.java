package com.taikor.investment.bean;

import java.io.Serializable;
import java.util.List;

/**
 * 看涨观点
 * Created by Any on 2017/8/17.
 */

public class SeeUpAdvice implements Serializable{

    /**
     * PointID : 654d509266a2d6805f6591b53106faf6
     * StockID : sh603883
     * StockName : 老百姓
     * PointType : 0
     * PointScale : 1.0
     * ViewPoints : [{"PointType":"看涨","PersonCount":5,"Summury":"为解决这一难题，龙里农商行整合资源，联姻上下游企业，为企业当\u201c红娘\u201d，促进双方合作，让农业真正形成一条产业链","Persons":[]}]
     */

    private String PointID;
    private String StockID;
    private String StockName;
    private int PointType;
    private double PointScale;
    private List<ViewPoint> ViewPoints;

    public String getPointID() {
        return PointID;
    }

    public void setPointID(String PointID) {
        this.PointID = PointID;
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

    public int getPointType() {
        return PointType;
    }

    public void setPointType(int PointType) {
        this.PointType = PointType;
    }

    public double getPointScale() {
        return PointScale;
    }

    public void setPointScale(double PointScale) {
        this.PointScale = PointScale;
    }

    public List<ViewPoint> getViewPoints() {
        return ViewPoints;
    }

    public void setViewPoints(List<ViewPoint> ViewPoints) {
        this.ViewPoints = ViewPoints;
    }

    public static class ViewPoint implements Serializable{
        /**
         * PointType : 看涨
         * PersonCount : 5
         * Summury : 为解决这一难题，龙里农商行整合资源，联姻上下游企业，为企业当“红娘”，促进双方合作，让农业真正形成一条产业链
         * Persons : []
         */

        private String PointType;
        private int PersonCount;
        private String Summury;
        private List<?> Persons;

        public String getPointType() {
            return PointType;
        }

        public void setPointType(String PointType) {
            this.PointType = PointType;
        }

        public int getPersonCount() {
            return PersonCount;
        }

        public void setPersonCount(int PersonCount) {
            this.PersonCount = PersonCount;
        }

        public String getSummury() {
            return Summury;
        }

        public void setSummury(String Summury) {
            this.Summury = Summury;
        }

        public List<?> getPersons() {
            return Persons;
        }

        public void setPersons(List<?> Persons) {
            this.Persons = Persons;
        }
    }
}
