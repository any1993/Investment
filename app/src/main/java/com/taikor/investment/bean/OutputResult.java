package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 上传返回的结果
 * Created by Any on 2017/5/22.
 */

public class OutputResult implements Serializable {
    /**
     * "isSuccess": true,
     * "Code": 2,
     * "Message": "sample string 3",
     * "Data": {},
     * "Date": "2017-05-22T09:59:44.1898637+08:00"
     */
    private boolean isSuccess;
    private int Code;
    private String Message;
    private Data Data;
    private String Date;

    public boolean isSuccess() {
        return isSuccess;
    }

    public void setSuccess(boolean success) {
        isSuccess = success;
    }

    public int getCode() {
        return Code;
    }

    public void setCode(int code) {
        Code = code;
    }

    public String getMessage() {
        return Message;
    }

    public void setMessage(String message) {
        Message = message;
    }

    public String getDate() {
        return Date;
    }

    public void setDate(String date) {
        Date = date;
    }

    public Data getData() {
        return Data;
    }

    public void setData(Data data) {
        Data = data;
    }

    public static class Data implements Serializable{
        private String groupId;
        private String userId;

        public String getGroupId() {
            return groupId;
        }

        public void setGroupId(String groupId) {
            this.groupId = groupId;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }

}
