package com.taikor.investment.find;

import android.content.Intent;
import android.text.TextUtils;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.taikor.investment.R;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.view.PullScrollView;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 加载h5的通用详情
 * Created by Any on 2017/5/4.
 */
public class GeneralDescActivity extends BaseActivity {

    @BindView(R.id.web_scroll)
    PullScrollView fundScroll;
    @BindView(R.id.web)
    WebView wvFundDesc;

    private String itemId, fromPage;

    @Override
    public int getLayoutResource() {
        return R.layout.include_web_desc;
    }

    @Override
    public void initView() {
        Intent intent = getIntent();
        itemId = intent.getStringExtra("itemId");
        fromPage = intent.getStringExtra("fromPage");
    }

    @Override
    public void initData() {
        WebSettings settings = wvFundDesc.getSettings();
        settings.setJavaScriptEnabled(true);//设置能够解析JavaScript
        settings.setDomStorageEnabled(true);//适应html5页面
        wvFundDesc.setWebViewClient(new WebViewClient());

        //设置头部加载颜色
        fundScroll.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        fundScroll.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        fundScroll.setRefreshListener(new PullScrollView.RefreshListener() {
            @Override
            public void onRefresh() {
                if (TextUtils.isEmpty(itemId)) {
                    return;
                }
                switch (fromPage) {
                    case "event"://事件详情
                        wvFundDesc.loadUrl("file:///android_asset/opportunityPage2o1_EventDetails.html?itemId=" + itemId);
                        break;
                    case "theme"://主题详情
                        wvFundDesc.loadUrl("file:///android_asset/opportunityPage3o1_TopicDetails.html?itemId=" + itemId);
                        break;
                    case "stock"://股票详情
                        wvFundDesc.loadUrl("file:///android_asset/stock.html?stockId=" + itemId);
                        break;
                    case "fund"://基金详情
                        wvFundDesc.loadUrl("file:///android_asset/informationPage01_FundDetails.html?itemId=" + itemId);
                        break;
                    case "morning"://早推送详情
                        wvFundDesc.loadUrl("file:///android_asset/earlyPush.html?pointTime=" + itemId);
                        break;
                    case "noon"://午间推送
                        wvFundDesc.loadUrl("file:///android_asset/noonPush.html?pointTime=" + itemId);
                        break;
                    case "afternoon"://收盘总结
                        wvFundDesc.loadUrl("file:///android_asset/afternoonPush.html?pointTime=" + itemId);
                        break;
                    case "night"://晚间推送
                        wvFundDesc.loadUrl("file:///android_asset/latePush.html?pointTime=" + itemId);
                        break;
                    case "topic"://专题推送
                        wvFundDesc.loadUrl("file:///android_asset/special.html?topicID="+itemId);
                }
                fundScroll.setRefreshCompleted();
            }
        });

        fundScroll.refreshWithPull();
    }

    //处理返回键
    @Override
    public void onBackPressed() {
        finish();
    }

    @OnClick(R.id.bt_back)
    public void onClick() {
        if (wvFundDesc.canGoBack()) {
            wvFundDesc.goBack();
        } else {
            finish();
        }
    }
}
