package com.taikor.investment.news;

import android.content.Intent;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.R;
import com.taikor.investment.adapter.NewsAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.General;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;
import com.taikor.investment.view.PullScrollView;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 轮播图详情
 * Created by Any on 2017/4/5.
 */
public class NewsDescActivity extends BaseActivity {

    @BindView(R.id.web_scroll)
    PullScrollView bannerScroll;
    @BindView(R.id.web)
    WebView wvBannerDesc;

    private String itemId;
    private int newsType;

    @Override
    public int getLayoutResource() {
        return R.layout.include_web_desc;
    }

    @Override
    public void initView() {
        Intent intent = getIntent();
        itemId = intent.getStringExtra("itemId");
        newsType=intent.getIntExtra("newsType",0);
    }

    @Override
    public void initData() {
        WebSettings settings = wvBannerDesc.getSettings();
        settings.setJavaScriptEnabled(true);//设置能够解析JavaScript
        settings.setDomStorageEnabled(true);//适应html5页面
        wvBannerDesc.setWebViewClient(new WebViewClient());

        //设置头部加载颜色
        bannerScroll.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        bannerScroll.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        bannerScroll.setRefreshListener(new PullScrollView.RefreshListener() {
            @Override
            public void onRefresh() {
                if (TextUtils.isEmpty(itemId)) {
                    return;
                }
                wvBannerDesc.loadUrl("file:///android_asset/newsInfo.html?itemid=" + itemId+"&newsType="+newsType);
                bannerScroll.setRefreshCompleted();
            }
        });

        bannerScroll.refreshWithPull();
    }

    //处理返回键
    @Override
    public void onBackPressed() {
        finish();
    }

    @OnClick(R.id.bt_back)
    public void onClick() {
        if (wvBannerDesc.canGoBack()) {
            wvBannerDesc.goBack();
        } else {
            finish();
        }
    }
}
