package com.taikor.investment.event;

/**
 * user:设置,退出登录,发送给userFragment，显示登录页面
 * 
 * customer:持仓设置,保存，发送给customerFragment重新请求数据
 * group:灵活型，保本型，自定义，持仓设置保存，发送给groupFragment重新请求数据
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
