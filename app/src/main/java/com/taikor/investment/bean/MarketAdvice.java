package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 市场观点
 * Created by Any on 2017/8/16.
 */

public class MarketAdvice implements Serializable{

    /**
     * PointId : 8b5a72da1a1fb7eeb7bbbd7603a20e25
     * Title : 如何应对周二反弹
     * PersonId : a356cd94af3238f6b9ad6d597c3d50d1
     * PersonName : 赢在龙头
     * ImageUrl : http://u.thsi.cn/fileupload/data/Flashcms/2015/183501062_27ebc5be58984b238344b3ed1ebc26f4.jpg
     * Content : 本周一市场迎来“开门黑”，股指再度失守短期所有均线支撑。日线分时观察，在早盘小幅冲高回落后，便一路下杀，指数相继翻绿。最终收出一根带有较长上影的实体阴线。 但是当面对今日这根K线，可以说并不用再“懵圈...
     * l_PubDate : 1495503460000
     * PubDate : 2017-05-23T09:37:40+08:00
     */

    private String PointId;
    private String Title;
    private String PersonId;
    private String PersonName;
    private String ImageUrl;
    private String Content;
    private long l_PubDate;
    private String PubDate;

    public String getPointId() {
        return PointId;
    }

    public void setPointId(String PointId) {
        this.PointId = PointId;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String Title) {
        this.Title = Title;
    }

    public String getPersonId() {
        return PersonId;
    }

    public void setPersonId(String PersonId) {
        this.PersonId = PersonId;
    }

    public String getPersonName() {
        return PersonName;
    }

    public void setPersonName(String PersonName) {
        this.PersonName = PersonName;
    }

    public String getImageUrl() {
        return ImageUrl;
    }

    public void setImageUrl(String ImageUrl) {
        this.ImageUrl = ImageUrl;
    }

    public String getContent() {
        return Content;
    }

    public void setContent(String Content) {
        this.Content = Content;
    }

    public long getL_PubDate() {
        return l_PubDate;
    }

    public void setL_PubDate(long l_PubDate) {
        this.l_PubDate = l_PubDate;
    }

    public String getPubDate() {
        return PubDate;
    }

    public void setPubDate(String PubDate) {
        this.PubDate = PubDate;
    }
}
