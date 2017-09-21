package com.taikor.investment.bean;

import java.io.Serializable;
import java.util.List;

/**
 * 主题排行
 * Created by Any on 2017/8/17.
 */

public class Order implements Serializable {

    /**
     * Block : {"blockIndexID":"2650c13c40831b82d1e20be5ce5c404b","ID":"BL_SYGN","Name":"手游概念","CompanyCount":30,"AvgPrice":"NaN","PriceChange":"NaN","ChangePercent":7.755618890322891,"Open":0,"Settlement":0,"High":0,"Low":0,"Volumn":0,"Amount":0,"FSName":"世纪华通","FSsymbol":"sz002602","FSchangepercent":0,"FStrade":0,"FSpricechange":0,"StockSymbols":["sz002602","sz002174","sz300031","sz002555","sz300052","sz002148","sz002425","sz002624","sh600652","sz300315","sz002699","sz300076","sh600633","sz002486","sz002681","sz002292","sz300494","sz300113","sz300043","sz002511","sz000810","sh600730","sz002590","sz002273","sz002643","sz002234","sz002431","sz300081","sz300296","sz002074"],"FetchTime":"2017-07-28T09:22:42.874","IndexVal":"NaN","TickTime":"2017-07-28T09:15:02.025","Amplitude":0,"VolumeRatio":0,"TransferRate":0,"Volume":0,"Speed":0}
     * SellCount : 6
     * BuyCount : 19
     * Relativity : 0.0
     * CountStock : 0
     * EmotionScore : 0.0
     */

    private Block Block;
    private int SellCount;
    private int BuyCount;
    private double Relativity;
    private int CountStock;
    private double EmotionScore;

    public Block getBlock() {
        return Block;
    }

    public void setBlock(Block Block) {
        this.Block = Block;
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

    public int getCountStock() {
        return CountStock;
    }

    public void setCountStock(int CountStock) {
        this.CountStock = CountStock;
    }

    public double getEmotionScore() {
        return EmotionScore;
    }

    public void setEmotionScore(double EmotionScore) {
        this.EmotionScore = EmotionScore;
    }
}
