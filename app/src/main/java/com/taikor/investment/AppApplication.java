package com.taikor.investment;

import android.app.Application;
import android.content.Context;
import android.text.TextUtils;

import com.lzy.okgo.OkGo;
import com.lzy.okgo.cache.CacheEntity;
import com.lzy.okgo.cache.CacheMode;
import com.lzy.okgo.model.HttpHeaders;
import com.lzy.okgo.model.Response;
import com.taikor.investment.bean.ConfirmData;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;

/**
 * application
 * Created by Any on 2017/8/8.
 */

public class AppApplication extends Application {

    private boolean isAccessTokenSet = false;
    private long tokenExpiresTime = 0;
    public static String authorized = "";
    private static AppApplication myApplication;
    private static Context context;
    private HashMap<String, Object> mMap;

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;
        context=getApplicationContext();
        requestToken();
    }

    public static Context getContext(){
        return context;
    }

    public static Context getAppContext() {
        return myApplication;
    }

    public static AppApplication getInstance() {
        if(myApplication==null){
            myApplication=new AppApplication();
        }
        return myApplication;
    }


    //判断是否需要重新请求token
    private boolean isAuthorized() {
        if (isAccessTokenSet && ((tokenExpiresTime - new Date().getTime()) > 10 * 60 * 1000)) {
            return true;
        } else {
            return false;
        }
    }

    //获取token
    private void requestToken() {
        if (!isAuthorized()) {//是否已经认证

            OkGo.<ConfirmData>get(Constant.CONFIRM)
                    .tag(myApplication)
                    .params("userId", Constant.ID)
                    .params("appSecert", Constant.appSecret)
                    .execute(new JsonCallBack<ConfirmData>(ConfirmData.class) {
                        @Override
                        public void onSuccess(Response<ConfirmData> response) {
                            if (response == null) return;
                            ConfirmData result = response.body();
                            //初始化
                            initData(result);

                        }
                    });
        }
    }

    private void initData(ConfirmData result) {

        if (!result.isIsError() && !result.isIsHttpError() && !TextUtils.isEmpty(result.getAccessToken()) && !TextUtils.isEmpty(result.getTokenType())) {

            isAccessTokenSet = true;
            tokenExpiresTime = new Date().getTime() + result.getExpiresIn() * 1000;
            authorized = result.getTokenType() + " " + result.getAccessToken();

            SharedPreferenceUtils.saveString(context,"token",authorized);

            HttpHeaders headers = new HttpHeaders();
            headers.put("Authorize",authorized);

            OkHttpClient.Builder builder = new OkHttpClient.Builder()
                    .writeTimeout(10000L, TimeUnit.MILLISECONDS)
                    .connectTimeout(10000L, TimeUnit.MILLISECONDS)
                    .readTimeout(10000L, TimeUnit.MILLISECONDS);

            OkGo.getInstance().init(myApplication)
                    .setOkHttpClient(builder.build())
                    .setCacheMode(CacheMode.FIRST_CACHE_THEN_REQUEST)
                    .setCacheTime(CacheEntity.CACHE_NEVER_EXPIRE)
                    .setRetryCount(3)
                    .addCommonHeaders(headers);

        }
    }

    //把obj对象放置暂存区
    public Object put(String key, Object obj) {
        if (mMap == null) {
            mMap = new HashMap<>();
        }
        return mMap.put(key, obj);
    }

    //从暂存区读取对象
    public Object get(String key) {
        if (mMap != null) {
            return mMap.remove(key);
        }
        return null;
    }

}
