package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 下单排行
 * Created by Any on 2017/8/17.
 */

public class OrderStock implements Serializable{

    /**
     * Stock : {"Symbol":"sz300059","Code":"300059","Name":"东方财富","Trade":14.06,"Pricechange":-0.06,"Changepercent":-0.42,"Buy":0,"Sell":0,"Settlement":14.12,"Open":13.99,"High":14.47,"Low":13.92,"Close":0,"TransferRate":7.17,"VolumeRatio":1.17,"PERatio":115.92,"PBRatio":4.59,"Amplitude":3.9,"Volume":2285940,"Amount":323953.1216,"MarketValue":444.75,"FloathingStock":31.88,"SumMarketValue":0,"Speed":0,"Ticktime":"2017-08-17T15:00:00+08:00","BlockID":null,"RelatedBlock":null}
     * SellCount : 1
     * BuyCount : 0
     * Relativity : 0.0
     * PullTime : 0001-01-01T00:00:00
     */

    private StockBean Stock;
    private int SellCount;
    private int BuyCount;
    private double Relativity;
    private String PullTime;

    public StockBean getStock() {
        return Stock;
    }

    public void setStock(StockBean Stock) {
        this.Stock = Stock;
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

    public String getPullTime() {
        return PullTime;
    }

    public void setPullTime(String PullTime) {
        this.PullTime = PullTime;
    }

    public static class StockBean implements Serializable{
        /**
         * Symbol : sz300059
         * Code : 300059
         * Name : 东方财富
         * Trade : 14.06
         * Pricechange : -0.06
         * Changepercent : -0.42
         * Buy : 0.0
         * Sell : 0.0
         * Settlement : 14.12
         * Open : 13.99
         * High : 14.47
         * Low : 13.92
         * Close : 0.0
         * TransferRate : 7.17
         * VolumeRatio : 1.17
         * PERatio : 115.92
         * PBRatio : 4.59
         * Amplitude : 3.9
         * Volume : 2285940.0
         * Amount : 323953.1216
         * MarketValue : 444.75
         * FloathingStock : 31.88
         * SumMarketValue : 0.0
         * Speed : 0.0
         * Ticktime : 2017-08-17T15:00:00+08:00
         * BlockID : null
         * RelatedBlock : null
         */

        private String Symbol;
        private String Code;
        private String Name;
        private double Trade;
        private double Pricechange;
        private double Changepercent;
        private double Buy;
        private double Sell;
        private double Settlement;
        private double Open;
        private double High;
        private double Low;
        private double Close;
        private double TransferRate;
        private double VolumeRatio;
        private double PERatio;
        private double PBRatio;
        private double Amplitude;
        private double Volume;
        private double Amount;
        private double MarketValue;
        private double FloathingStock;
        private double SumMarketValue;
        private double Speed;
        private String Ticktime;
        private Object BlockID;
        private Object RelatedBlock;

        public String getSymbol() {
            return Symbol;
        }

        public void setSymbol(String Symbol) {
            this.Symbol = Symbol;
        }

        public String getCode() {
            return Code;
        }

        public void setCode(String Code) {
            this.Code = Code;
        }

        public String getName() {
            return Name;
        }

        public void setName(String Name) {
            this.Name = Name;
        }

        public double getTrade() {
            return Trade;
        }

        public void setTrade(double Trade) {
            this.Trade = Trade;
        }

        public double getPricechange() {
            return Pricechange;
        }

        public void setPricechange(double Pricechange) {
            this.Pricechange = Pricechange;
        }

        public double getChangepercent() {
            return Changepercent;
        }

        public void setChangepercent(double Changepercent) {
            this.Changepercent = Changepercent;
        }

        public double getBuy() {
            return Buy;
        }

        public void setBuy(double Buy) {
            this.Buy = Buy;
        }

        public double getSell() {
            return Sell;
        }

        public void setSell(double Sell) {
            this.Sell = Sell;
        }

        public double getSettlement() {
            return Settlement;
        }

        public void setSettlement(double Settlement) {
            this.Settlement = Settlement;
        }

        public double getOpen() {
            return Open;
        }

        public void setOpen(double Open) {
            this.Open = Open;
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

        public double getClose() {
            return Close;
        }

        public void setClose(double Close) {
            this.Close = Close;
        }

        public double getTransferRate() {
            return TransferRate;
        }

        public void setTransferRate(double TransferRate) {
            this.TransferRate = TransferRate;
        }

        public double getVolumeRatio() {
            return VolumeRatio;
        }

        public void setVolumeRatio(double VolumeRatio) {
            this.VolumeRatio = VolumeRatio;
        }

        public double getPERatio() {
            return PERatio;
        }

        public void setPERatio(double PERatio) {
            this.PERatio = PERatio;
        }

        public double getPBRatio() {
            return PBRatio;
        }

        public void setPBRatio(double PBRatio) {
            this.PBRatio = PBRatio;
        }

        public double getAmplitude() {
            return Amplitude;
        }

        public void setAmplitude(double Amplitude) {
            this.Amplitude = Amplitude;
        }

        public double getVolume() {
            return Volume;
        }

        public void setVolume(double Volume) {
            this.Volume = Volume;
        }

        public double getAmount() {
            return Amount;
        }

        public void setAmount(double Amount) {
            this.Amount = Amount;
        }

        public double getMarketValue() {
            return MarketValue;
        }

        public void setMarketValue(double MarketValue) {
            this.MarketValue = MarketValue;
        }

        public double getFloathingStock() {
            return FloathingStock;
        }

        public void setFloathingStock(double FloathingStock) {
            this.FloathingStock = FloathingStock;
        }

        public double getSumMarketValue() {
            return SumMarketValue;
        }

        public void setSumMarketValue(double SumMarketValue) {
            this.SumMarketValue = SumMarketValue;
        }

        public double getSpeed() {
            return Speed;
        }

        public void setSpeed(double Speed) {
            this.Speed = Speed;
        }

        public String getTicktime() {
            return Ticktime;
        }

        public void setTicktime(String Ticktime) {
            this.Ticktime = Ticktime;
        }

        public Object getBlockID() {
            return BlockID;
        }

        public void setBlockID(Object BlockID) {
            this.BlockID = BlockID;
        }

        public Object getRelatedBlock() {
            return RelatedBlock;
        }

        public void setRelatedBlock(Object RelatedBlock) {
            this.RelatedBlock = RelatedBlock;
        }
    }
}
