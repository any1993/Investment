package com.taikor.investment.event;

/**
 * group:自定义发送给groupFragment重新请求数据
 * 
 * 广播监听发送，all（所有设计网络请求的模块）
 * Created by Any on 2017/6/7.
 */

public class BooleanEvent {
    
    private boolean flag;
    private String type;

    /**
     * @param flag true，请求数据
     * @param type 对应的页面请求数据，防止其他页面响应
     */
    public BooleanEvent(boolean flag, String type) {
        this.flag = flag;
        this.type=type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(boolean flag) {
        this.flag = flag;
    }
    
}
