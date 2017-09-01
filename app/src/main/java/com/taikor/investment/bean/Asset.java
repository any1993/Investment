package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 主力资金流
 * Created by Any on 2017/8/16.
 */

public class Asset implements Serializable{


    /**
     * MainForce : -90711.04
     * SuperLarge : -38759.09
     * Large : -51951.95
     * Middle : -13320.37
     * Small : 42237.64
     * CountTime : 1502678100
     */

    private double MainForce;
    private double SuperLarge;
    private double Large;
    private double Middle;
    private double Small;
    private int CountTime;

    public double getMainForce() {
        return MainForce;
    }

    public void setMainForce(double MainForce) {
        this.MainForce = MainForce;
    }

    public double getSuperLarge() {
        return SuperLarge;
    }

    public void setSuperLarge(double SuperLarge) {
        this.SuperLarge = SuperLarge;
    }

    public double getLarge() {
        return Large;
    }

    public void setLarge(double Large) {
        this.Large = Large;
    }

    public double getMiddle() {
        return Middle;
    }

    public void setMiddle(double Middle) {
        this.Middle = Middle;
    }

    public double getSmall() {
        return Small;
    }

    public void setSmall(double Small) {
        this.Small = Small;
    }

    public int getCountTime() {
        return CountTime;
    }

    public void setCountTime(int CountTime) {
        this.CountTime = CountTime;
    }
}
