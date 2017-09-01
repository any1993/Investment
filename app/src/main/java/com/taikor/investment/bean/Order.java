package com.taikor.investment.bean;

import java.io.Serializable;
import java.util.List;

/**
 * 下单排行
 * Created by Any on 2017/8/17.
 */

public class Order implements Serializable{

    /**
     * Block : {"blockIndexID":"2650c13c40831b82d1e20be5ce5c404b","ID":"BL_SYGN","Name":"手游概念","CompanyCount":30,"AvgPrice":"NaN","PriceChange":"NaN","ChangePercent":7.755618890322891,"Open":0,"Settlement":0,"High":0,"Low":0,"Volumn":0,"Amount":0,"FSName":"世纪华通","FSsymbol":"sz002602","FSchangepercent":0,"FStrade":0,"FSpricechange":0,"StockSymbols":["sz002602","sz002174","sz300031","sz002555","sz300052","sz002148","sz002425","sz002624","sh600652","sz300315","sz002699","sz300076","sh600633","sz002486","sz002681","sz002292","sz300494","sz300113","sz300043","sz002511","sz000810","sh600730","sz002590","sz002273","sz002643","sz002234","sz002431","sz300081","sz300296","sz002074"],"FetchTime":"2017-07-28T09:22:42.874","IndexVal":"NaN","TickTime":"2017-07-28T09:15:02.025","Amplitude":0,"VolumeRatio":0,"TransferRate":0,"Volume":0,"Speed":0}
     * SellCount : 6
     * BuyCount : 19
     * Relativity : 0.0
     * CountStock : 0
     * EmotionScore : 0.0
     */

    private BlockBean Block;
    private int SellCount;
    private int BuyCount;
    private double Relativity;
    private int CountStock;
    private double EmotionScore;

    public BlockBean getBlock() {
        return Block;
    }

    public void setBlock(BlockBean Block) {
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

    public static class BlockBean implements Serializable{
        /**
         * blockIndexID : 2650c13c40831b82d1e20be5ce5c404b
         * ID : BL_SYGN
         * Name : 手游概念
         * CompanyCount : 30
         * AvgPrice : NaN
         * PriceChange : NaN
         * ChangePercent : 7.755618890322891
         * Open : 0.0
         * Settlement : 0.0
         * High : 0.0
         * Low : 0.0
         * Volumn : 0.0
         * Amount : 0.0
         * FSName : 世纪华通
         * FSsymbol : sz002602
         * FSchangepercent : 0.0
         * FStrade : 0.0
         * FSpricechange : 0.0
         * StockSymbols : ["sz002602","sz002174","sz300031","sz002555","sz300052","sz002148","sz002425","sz002624","sh600652","sz300315","sz002699","sz300076","sh600633","sz002486","sz002681","sz002292","sz300494","sz300113","sz300043","sz002511","sz000810","sh600730","sz002590","sz002273","sz002643","sz002234","sz002431","sz300081","sz300296","sz002074"]
         * FetchTime : 2017-07-28T09:22:42.874
         * IndexVal : NaN
         * TickTime : 2017-07-28T09:15:02.025
         * Amplitude : 0.0
         * VolumeRatio : 0.0
         * TransferRate : 0.0
         * Volume : 0.0
         * Speed : 0.0
         */

        private String blockIndexID;
        private String ID;
        private String Name;
        private int CompanyCount;
        private String AvgPrice;
        private String PriceChange;
        private double ChangePercent;
        private double Open;
        private double Settlement;
        private double High;
        private double Low;
        private double Volumn;
        private double Amount;
        private String FSName;
        private String FSsymbol;
        private double FSchangepercent;
        private double FStrade;
        private double FSpricechange;
        private String FetchTime;
        private String IndexVal;
        private String TickTime;
        private double Amplitude;
        private double VolumeRatio;
        private double TransferRate;
        private double Volume;
        private double Speed;
        private List<String> StockSymbols;

        public String getBlockIndexID() {
            return blockIndexID;
        }

        public void setBlockIndexID(String blockIndexID) {
            this.blockIndexID = blockIndexID;
        }

        public String getID() {
            return ID;
        }

        public void setID(String ID) {
            this.ID = ID;
        }

        public String getName() {
            return Name;
        }

        public void setName(String Name) {
            this.Name = Name;
        }

        public int getCompanyCount() {
            return CompanyCount;
        }

        public void setCompanyCount(int CompanyCount) {
            this.CompanyCount = CompanyCount;
        }

        public String getAvgPrice() {
            return AvgPrice;
        }

        public void setAvgPrice(String AvgPrice) {
            this.AvgPrice = AvgPrice;
        }

        public String getPriceChange() {
            return PriceChange;
        }

        public void setPriceChange(String PriceChange) {
            this.PriceChange = PriceChange;
        }

        public double getChangePercent() {
            return ChangePercent;
        }

        public void setChangePercent(double ChangePercent) {
            this.ChangePercent = ChangePercent;
        }

        public double getOpen() {
            return Open;
        }

        public void setOpen(double Open) {
            this.Open = Open;
        }

        public double getSettlement() {
            return Settlement;
        }

        public void setSettlement(double Settlement) {
            this.Settlement = Settlement;
        }

        public double getHigh() {
            return High;
        }

        public void setHigh(double High) {
            this.High = High;
        }

        public double getLow() {
            return Low;
        }

        public void setLow(double Low) {
            this.Low = Low;
        }

        public double getVolumn() {
            return Volumn;
        }

        public void setVolumn(double Volumn) {
            this.Volumn = Volumn;
        }

        public double getAmount() {
            return Amount;
        }

        public void setAmount(double Amount) {
            this.Amount = Amount;
        }

        public String getFSName() {
            return FSName;
        }

        public void setFSName(String FSName) {
            this.FSName = FSName;
        }

        public String getFSsymbol() {
            return FSsymbol;
        }

        public void setFSsymbol(String FSsymbol) {
            this.FSsymbol = FSsymbol;
        }

        public double getFSchangepercent() {
            return FSchangepercent;
        }

        public void setFSchangepercent(double FSchangepercent) {
            this.FSchangepercent = FSchangepercent;
        }

        public double getFStrade() {
            return FStrade;
        }

        public void setFStrade(double FStrade) {
            this.FStrade = FStrade;
        }

        public double getFSpricechange() {
            return FSpricechange;
        }

        public void setFSpricechange(double FSpricechange) {
            this.FSpricechange = FSpricechange;
        }

        public String getFetchTime() {
            return FetchTime;
        }

        public void setFetchTime(String FetchTime) {
            this.FetchTime = FetchTime;
        }

        public String getIndexVal() {
            return IndexVal;
        }

        public void setIndexVal(String IndexVal) {
            this.IndexVal = IndexVal;
        }

        public String getTickTime() {
            return TickTime;
        }

        public void setTickTime(String TickTime) {
            this.TickTime = TickTime;
        }

        public double getAmplitude() {
            return Amplitude;
        }

        public void setAmplitude(double Amplitude) {
            this.Amplitude = Amplitude;
        }

        public double getVolumeRatio() {
            return VolumeRatio;
        }

        public void setVolumeRatio(double VolumeRatio) {
            this.VolumeRatio = VolumeRatio;
        }

        public double getTransferRate() {
            return TransferRate;
        }

        public void setTransferRate(double TransferRate) {
            this.TransferRate = TransferRate;
        }

        public double getVolume() {
            return Volume;
        }

        public void setVolume(double Volume) {
            this.Volume = Volume;
        }

        public double getSpeed() {
            return Speed;
        }

        public void setSpeed(double Speed) {
            this.Speed = Speed;
        }

        public List<String> getStockSymbols() {
            return StockSymbols;
        }

        public void setStockSymbols(List<String> StockSymbols) {
            this.StockSymbols = StockSymbols;
        }
    }
}
