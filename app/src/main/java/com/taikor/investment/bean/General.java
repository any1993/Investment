package com.taikor.investment.bean;

import java.io.Serializable;
import java.util.List;

/**
 * 资讯,通用
 * Created by Any on 2017/8/9.
 */

public class General implements Serializable {


    /**
     * Id : 7fde21aaa5c2030ed99040504046b463
     * Type : 1
     * Title : 韩国昔日手机巨头兵败
     * Url : http://tech.sina.com.cn/csj/2017-08-09/doc-ifyitamv7655752.shtml
     * MediaName : 新浪科技
     * HTMLText : null
     * Tag : 专利:1,华为:1
     * PubDate : 2017-08-09 10:14:18
     * PushDate : 1502275233
     * Summary : ["在小米发展过程中，从不太重视研发再到发力专利布局，甚至是专利收购等，小米的知识产权策略变得更加务实和贴近实际","而诺基亚将其品牌授权给其他厂商继续生产制造销售手机，不论手机最终销售如何，诺基亚的品牌许可授权收益已经落袋为安"]
     * Category : 基金
     * PartId : Read_PrivateEquity
     * ImageUrl : b/695b0537153fad126dd237f63e28b7fa_big.jpg
     * ReleatedNews : null
     * TopicInfos : null
     * RelatedStocks : null
     * Struct : {"StructId":"BL_PGGN","Category":"主题市场","Subject":"苹果概念","Keypoint":"手机出货量也一度受到影响","MarketImpact":"利好"}
     * Hotness : 4870.690435443541
     * Sentiment : 0.0
     * ReportType : null
     * AgencyID : null
     * AgencyName : null
     */


    private String Id;
    private int Type;
    private String Title;
    private String Url;
    private String MediaName;
    private String HTMLText;
    private String Tag;
    private String PubDate;
    private int PushDate;
    private String Category;
    private String PartId;
    private String ImageUrl;
    private Object ReleatedNews;
    private Object TopicInfos;
    private Object RelatedStocks;
    private StructBean Struct;
    private double Hotness;
    private double Sentiment;
    private Object ReportType;
    private Object AgencyID;
    private Object AgencyName;
    private List<String> Summary;

    public String getId() {
        return Id;
    }

    public void setId(String Id) {
        this.Id = Id;
    }

    public int getType() {
        return Type;
    }

    public void setType(int Type) {
        this.Type = Type;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String Title) {
        this.Title = Title;
    }

    public String getUrl() {
        return Url;
    }

    public void setUrl(String Url) {
        this.Url = Url;
    }

    public String getMediaName() {
        return MediaName;
    }

    public void setMediaName(String MediaName) {
        this.MediaName = MediaName;
    }

    public String getHTMLText() {
        return HTMLText;
    }

    public void setHTMLText(String HTMLText) {
        this.HTMLText = HTMLText;
    }

    public String getTag() {
        return Tag;
    }

    public void setTag(String Tag) {
        this.Tag = Tag;
    }

    public String getPubDate() {
        return PubDate;
    }

    public void setPubDate(String PubDate) {
        this.PubDate = PubDate;
    }

    public int getPushDate() {
        return PushDate;
    }

    public void setPushDate(int PushDate) {
        this.PushDate = PushDate;
    }

    public String getCategory() {
        return Category;
    }

    public void setCategory(String Category) {
        this.Category = Category;
    }

    public String getPartId() {
        return PartId;
    }

    public void setPartId(String PartId) {
        this.PartId = PartId;
    }

    public String getImageUrl() {
        return ImageUrl;
    }

    public void setImageUrl(String ImageUrl) {
        this.ImageUrl = ImageUrl;
    }

    public Object getReleatedNews() {
        return ReleatedNews;
    }

    public void setReleatedNews(Object ReleatedNews) {
        this.ReleatedNews = ReleatedNews;
    }

    public Object getTopicInfos() {
        return TopicInfos;
    }

    public void setTopicInfos(Object TopicInfos) {
        this.TopicInfos = TopicInfos;
    }

    public Object getRelatedStocks() {
        return RelatedStocks;
    }

    public void setRelatedStocks(Object RelatedStocks) {
        this.RelatedStocks = RelatedStocks;
    }

    public StructBean getStruct() {
        return Struct;
    }

    public void setStruct(StructBean Struct) {
        this.Struct = Struct;
    }

    public double getHotness() {
        return Hotness;
    }

    public void setHotness(double Hotness) {
        this.Hotness = Hotness;
    }

    public double getSentiment() {
        return Sentiment;
    }

    public void setSentiment(double Sentiment) {
        this.Sentiment = Sentiment;
    }

    public Object getReportType() {
        return ReportType;
    }

    public void setReportType(Object ReportType) {
        this.ReportType = ReportType;
    }

    public Object getAgencyID() {
        return AgencyID;
    }

    public void setAgencyID(Object AgencyID) {
        this.AgencyID = AgencyID;
    }

    public Object getAgencyName() {
        return AgencyName;
    }

    public void setAgencyName(Object AgencyName) {
        this.AgencyName = AgencyName;
    }

    public List<String> getSummary() {
        return Summary;
    }

    public void setSummary(List<String> Summary) {
        this.Summary = Summary;
    }

    public static class StructBean implements Serializable{
        /**
         * StructId : BL_PGGN
         * Category : 主题市场
         * Subject : 苹果概念
         * Keypoint : 手机出货量也一度受到影响
         * MarketImpact : 利好
         */

        private String StructId;
        private String Category;
        private String Subject;
        private String Keypoint;
        private String MarketImpact;

        public String getStructId() {
            return StructId;
        }

        public void setStructId(String StructId) {
            this.StructId = StructId;
        }

        public String getCategory() {
            return Category;
        }

        public void setCategory(String Category) {
            this.Category = Category;
        }

        public String getSubject() {
            return Subject;
        }

        public void setSubject(String Subject) {
            this.Subject = Subject;
        }

        public String getKeypoint() {
            return Keypoint;
        }

        public void setKeypoint(String Keypoint) {
            this.Keypoint = Keypoint;
        }

        public String getMarketImpact() {
            return MarketImpact;
        }

        public void setMarketImpact(String MarketImpact) {
            this.MarketImpact = MarketImpact;
        }
    }
}
