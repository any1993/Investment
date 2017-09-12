package com.taikor.investment.bean;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Any on 2017/9/5.
 */

public class HotNews implements Serializable{


    /**
     * TotalCount : 1
     * ItemList : [{"ItemID":"sample string 1","CleanTitle":"sample string 2","Url":"sample string 3","HTMLText":"sample string 4","Summary":"sample string 5","IsCollected":6,"BlockList":{"sample string 1":"sample string 2","sample string 3":"sample string 4"},"StockList":{"sample string 1":"sample string 2","sample string 3":"sample string 4"}},{"ItemID":"sample string 1","CleanTitle":"sample string 2","Url":"sample string 3","HTMLText":"sample string 4","Summary":"sample string 5","IsCollected":6,"BlockList":{"sample string 1":"sample string 2","sample string 3":"sample string 4"},"StockList":{"sample string 1":"sample string 2","sample string 3":"sample string 4"}}]
     */

    private int TotalCount;
    private List<ItemListBean> ItemList;

    public int getTotalCount() {
        return TotalCount;
    }

    public void setTotalCount(int TotalCount) {
        this.TotalCount = TotalCount;
    }

    public List<ItemListBean> getItemList() {
        return ItemList;
    }

    public void setItemList(List<ItemListBean> ItemList) {
        this.ItemList = ItemList;
    }

    public static class ItemListBean implements Serializable{
        /**
         * ItemID : sample string 1
         * CleanTitle : sample string 2
         * Url : sample string 3
         * HTMLText : sample string 4
         * Summary : sample string 5
         * IsCollected : 6
         * BlockList : {"sample string 1":"sample string 2","sample string 3":"sample string 4"}
         * StockList : {"sample string 1":"sample string 2","sample string 3":"sample string 4"}
         */

        private String ItemID;
        private String CleanTitle;
        private String Url;
        private String HTMLText;
        private String Summary;
        private int IsCollected;
        private BlockListBean BlockList;
        private StockListBean StockList;

        public String getItemID() {
            return ItemID;
        }

        public void setItemID(String ItemID) {
            this.ItemID = ItemID;
        }

        public String getCleanTitle() {
            return CleanTitle;
        }

        public void setCleanTitle(String CleanTitle) {
            this.CleanTitle = CleanTitle;
        }

        public String getUrl() {
            return Url;
        }

        public void setUrl(String Url) {
            this.Url = Url;
        }

        public String getHTMLText() {
            return HTMLText;
        }

        public void setHTMLText(String HTMLText) {
            this.HTMLText = HTMLText;
        }

        public String getSummary() {
            return Summary;
        }

        public void setSummary(String Summary) {
            this.Summary = Summary;
        }

        public int getIsCollected() {
            return IsCollected;
        }

        public void setIsCollected(int IsCollected) {
            this.IsCollected = IsCollected;
        }

        public BlockListBean getBlockList() {
            return BlockList;
        }

        public void setBlockList(BlockListBean BlockList) {
            this.BlockList = BlockList;
        }

        public StockListBean getStockList() {
            return StockList;
        }

        public void setStockList(StockListBean StockList) {
            this.StockList = StockList;
        }

        public static class BlockListBean {
            @SerializedName("sample string 1")
            private String _$SampleString138; // FIXME check this code
            @SerializedName("sample string 3")
            private String _$SampleString3257; // FIXME check this code

            public String get_$SampleString138() {
                return _$SampleString138;
            }

            public void set_$SampleString138(String _$SampleString138) {
                this._$SampleString138 = _$SampleString138;
            }

            public String get_$SampleString3257() {
                return _$SampleString3257;
            }

            public void set_$SampleString3257(String _$SampleString3257) {
                this._$SampleString3257 = _$SampleString3257;
            }
        }

        public static class StockListBean {
            @SerializedName("sample string 1")
            private String _$SampleString1259; // FIXME check this code
            @SerializedName("sample string 3")
            private String _$SampleString3105; // FIXME check this code

            public String get_$SampleString1259() {
                return _$SampleString1259;
            }

            public void set_$SampleString1259(String _$SampleString1259) {
                this._$SampleString1259 = _$SampleString1259;
            }

            public String get_$SampleString3105() {
                return _$SampleString3105;
            }

            public void set_$SampleString3105(String _$SampleString3105) {
                this._$SampleString3105 = _$SampleString3105;
            }
        }
    }
}
