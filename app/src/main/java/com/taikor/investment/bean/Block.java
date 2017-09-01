package com.taikor.investment.bean;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

/**
 * 主题
 * Created by Any on 2017/8/14.
 */

public class Block implements Serializable{

    /**
     * blockIndexID : sample string 1
     * ID : sample string 2
     * Name : sample string 3
     * CompanyCount : 4
     * AvgPrice : 5.1
     * PriceChange : 6.1
     * ChangePercent : 7.1
     * Open : 8.1
     * Settlement : 9.1
     * High : 10.1
     * Low : 11.1
     * Volumn : 12.1
     * Amount : 13.1
     * FSName : sample string 14
     * FSsymbol : sample string 15
     * FSchangepercent : 16.1
     * FStrade : 17.1
     * FSpricechange : 18.1
     * StockSymbols : ["sample string 1","sample string 2"]
     * FetchTime : 2017-08-14T09:57:24.231277+08:00
     * IndexVal : 20.1
     * TickTime : 2017-08-14T09:57:24.231277+08:00
     * Amplitude : 22.1
     * VolumeRatio : 23.1
     * TransferRate : 24.1
     * Volume : 25.1
     * Speed : 26.1
     * HistoryPrices : {"sample string 1":2.1,"sample string 3":4.1}
     */

    private String blockIndexID;
    private String ID;
    private String Name;
    private int CompanyCount;
    private double AvgPrice;
    private double PriceChange;
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
    private double IndexVal;
    private String TickTime;
    private double Amplitude;
    private double VolumeRatio;
    private double TransferRate;
    private double Volume;
    private double Speed;
    private HistoryPricesBean HistoryPrices;
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

    public double getAvgPrice() {
        return AvgPrice;
    }

    public void setAvgPrice(double AvgPrice) {
        this.AvgPrice = AvgPrice;
    }

    public double getPriceChange() {
        return PriceChange;
    }

    public void setPriceChange(double PriceChange) {
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

    public double getIndexVal() {
        return IndexVal;
    }

    public void setIndexVal(double IndexVal) {
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

    public HistoryPricesBean getHistoryPrices() {
        return HistoryPrices;
    }

    public void setHistoryPrices(HistoryPricesBean HistoryPrices) {
        this.HistoryPrices = HistoryPrices;
    }

    public List<String> getStockSymbols() {
        return StockSymbols;
    }

    public void setStockSymbols(List<String> StockSymbols) {
        this.StockSymbols = StockSymbols;
    }

    public static class HistoryPricesBean {
        @SerializedName("sample string 1")
        private double _$SampleString1182; // FIXME check this code
        @SerializedName("sample string 3")
        private double _$SampleString3260; // FIXME check this code

        public double get_$SampleString1182() {
            return _$SampleString1182;
        }

        public void set_$SampleString1182(double _$SampleString1182) {
            this._$SampleString1182 = _$SampleString1182;
        }

        public double get_$SampleString3260() {
            return _$SampleString3260;
        }

        public void set_$SampleString3260(double _$SampleString3260) {
            this._$SampleString3260 = _$SampleString3260;
        }
    }
}
