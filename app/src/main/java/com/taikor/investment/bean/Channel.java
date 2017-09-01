package com.taikor.investment.bean;

import java.io.Serializable;
import java.util.List;

/**
 * 频道
 * Created by Any on 2017/8/9.
 */

public class Channel implements Serializable {


    /**
     * Hash : 617734f09ee80014fdbd39008d7003e4
     * UpdateTimeStamp : 1481535263
     * UserID : common
     * Version : 1.1
     * Categorys : [{"Id":"Recommend","Name":"推荐","Rule":null,"Order":0,"Type":0,"Link":""},{"Id":"HotNews","Name":"热点","Rule":null,"Order":1,"Type":10,"Link":""},{"Id":"Topic","Name":"专题","Rule":null,"Order":2,"Type":9,"Link":""},{"Id":"PushHistory","Name":"推送","Rule":null,"Order":3,"Type":8,"Link":""},{"Id":"Read_PrivateEquity","Name":"基金","Rule":null,"Order":4,"Type":1,"Link":""},{"Id":"Read_ForeignExchange","Name":"外汇","Rule":null,"Order":5,"Type":1,"Link":""},{"Id":"Read_Futures","Name":"期货","Rule":null,"Order":6,"Type":1,"Link":""},{"Id":"Read_Securities","Name":"债券","Rule":null,"Order":7,"Type":1,"Link":""},{"Id":"Read_Stock","Name":"股票","Rule":null,"Order":8,"Type":1,"Link":""},{"Id":"Read_Realestate","Name":"地产","Rule":null,"Order":9,"Type":1,"Link":""},{"Id":"Read_Policy","Name":"政策","Rule":null,"Order":10,"Type":1,"Link":""},{"Id":"Read_Data","Name":"数据","Rule":null,"Order":11,"Type":1,"Link":""}]
     */

    private String Hash;
    private int UpdateTimeStamp;
    private String UserID;
    private String Version;
    private List<CategorysBean> Categorys;

    public String getHash() {
        return Hash;
    }

    public void setHash(String Hash) {
        this.Hash = Hash;
    }

    public int getUpdateTimeStamp() {
        return UpdateTimeStamp;
    }

    public void setUpdateTimeStamp(int UpdateTimeStamp) {
        this.UpdateTimeStamp = UpdateTimeStamp;
    }

    public String getUserID() {
        return UserID;
    }

    public void setUserID(String UserID) {
        this.UserID = UserID;
    }

    public String getVersion() {
        return Version;
    }

    public void setVersion(String Version) {
        this.Version = Version;
    }

    public List<CategorysBean> getCategorys() {
        return Categorys;
    }

    public void setCategorys(List<CategorysBean> Categorys) {
        this.Categorys = Categorys;
    }

    public static class CategorysBean implements Serializable{
        /**
         * Id : Recommend
         * Name : 推荐
         * Rule : null
         * Order : 0
         * Type : 0
         * Link :
         */

        private String Id;
        private String Name;
        private Object Rule;
        private int Order;
        private int Type;
        private String Link;

        public String getId() {
            return Id;
        }

        public void setId(String Id) {
            this.Id = Id;
        }

        public String getName() {
            return Name;
        }

        public void setName(String Name) {
            this.Name = Name;
        }

        public Object getRule() {
            return Rule;
        }

        public void setRule(Object Rule) {
            this.Rule = Rule;
        }

        public int getOrder() {
            return Order;
        }

        public void setOrder(int Order) {
            this.Order = Order;
        }

        public int getType() {
            return Type;
        }

        public void setType(int Type) {
            this.Type = Type;
        }

        public String getLink() {
            return Link;
        }

        public void setLink(String Link) {
            this.Link = Link;
        }
    }
}
