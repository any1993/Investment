package com.taikor.investment.find;

import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;

import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.taikor.investment.R;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.view.PullScrollView;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 涨停复盘
 * Created by Any on 2017/8/2.
 */

public class UpDownActivity extends BaseActivity {

    @BindView(R.id.bt_back)
    Button btBack;
    @BindView(R.id.web)
    WebView web;
    @BindView(R.id.web_scroll)
    PullScrollView webScroll;

    @Override
    public int getLayoutResource() {
        return R.layout.include_web_desc;
    }

    @Override
    protected void initView() {
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);//设置能够解析JavaScript
        settings.setDomStorageEnabled(true);//适应html5页面
        web.setWebViewClient(new WebViewClient());

        //设置头部加载颜色
        webScroll.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        webScroll.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        webScroll.setRefreshListener(new PullScrollView.RefreshListener() {
            @Override
            public void onRefresh() {
                web.loadUrl("file:///android_asset/chanceSecondary03_resumption.html");
                webScroll.setRefreshCompleted();
            }
        });
        webScroll.refreshWithPull();
    }

    @OnClick({R.id.bt_back})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.bt_back:
                if (web.canGoBack()) {
                    web.goBack();
                } else {
                    finish();
                }
                break;
        }
    }

    //处理返回键
    @Override
    public void onBackPressed() {
        finish();
    }
}
