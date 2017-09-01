package com.taikor.investment.bean;

import java.io.Serializable;
import java.util.Set;

/**
 * 情绪指数
 * Created by Any on 2017/8/15.
 */

public class Emotion implements Serializable{


    /**
     * EmotionId : 3d374a6d3063c499bf32d5f4c085fafd
     * StructId : sh000001
     * Type : 3
     * CreatTime : 2017-07-27T15:00:04.2430262+08:00
     * Emotion : 64.17647058823529
     * Difference : 0
     * Intensity : 92
     */

    private String EmotionId;
    private String StructId;
    private int Type;
    private String CreatTime;
    private double Emotion;
    private int Difference;
    private int Intensity;

    public String getEmotionId() {
        return EmotionId;
    }

    public void setEmotionId(String EmotionId) {
        this.EmotionId = EmotionId;
    }

    public String getStructId() {
        return StructId;
    }

    public void setStructId(String StructId) {
        this.StructId = StructId;
    }

    public int getType() {
        return Type;
    }

    public void setType(int Type) {
        this.Type = Type;
    }

    public String getCreatTime() {
        return CreatTime;
    }

    public void setCreatTime(String CreatTime) {
        this.CreatTime = CreatTime;
    }

    public double getEmotion() {
        return Emotion;
    }

    public void setEmotion(double Emotion) {
        this.Emotion = Emotion;
    }

    public int getDifference() {
        return Difference;
    }

    public void setDifference(int Difference) {
        this.Difference = Difference;
    }

    public int getIntensity() {
        return Intensity;
    }

    public void setIntensity(int Intensity) {
        this.Intensity = Intensity;
    }
}
