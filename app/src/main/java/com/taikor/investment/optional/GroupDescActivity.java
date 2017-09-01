package com.taikor.investment.optional;

import android.content.Intent;
import android.text.TextUtils;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.taikor.investment.R;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.event.BooleanEvent;
import com.taikor.investment.view.PullScrollView;

import org.greenrobot.eventbus.EventBus;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 组合详情
 * Created by Any on 2017/5/4.
 */
public class GroupDescActivity extends BaseActivity {

    @BindView(R.id.web_scroll)
    PullScrollView groupScroll;
    @BindView(R.id.web)
    WebView wvGroupDesc;

    private String itemId;

    @Override
    public int getLayoutResource() {
        return R.layout.include_web_desc;
    }

    @Override
    public void initView() {
        Intent intent = getIntent();
        itemId = intent.getStringExtra("itemId");

        WebSettings settings = wvGroupDesc.getSettings();
        settings.setJavaScriptEnabled(true);//设置能够解析JavaScript
        settings.setDomStorageEnabled(true);//适应html5页面
        wvGroupDesc.setWebViewClient(new WebViewClient());

        //设置头部加载颜色
        groupScroll.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        groupScroll.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        groupScroll.setRefreshListener(new PullScrollView.RefreshListener() {
            @Override
            public void onRefresh() {
                if (TextUtils.isEmpty(itemId)) {
                    return;
                }
                wvGroupDesc.loadUrl("file:///android_asset/secondaryPage_ProductDetails.html?itemId=" + itemId);
                groupScroll.setRefreshCompleted();
            }
        });

        groupScroll.refreshWithPull();
    }

    //处理返回键
    @Override
    public void onBackPressed() {
        showPage();
    }

    @OnClick(R.id.bt_back)
    public void onClick() {
        //发送消息，组合列表重新请求数据
        showPage();
    }

    private void showPage() {
        //发送消息，组合列表重新请求数据
        EventBus.getDefault().post(new BooleanEvent(true, "group"));
        GroupDescActivity.this.finish();
    }

}
