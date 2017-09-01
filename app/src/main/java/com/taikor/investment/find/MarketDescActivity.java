package com.taikor.investment.find;

import android.content.Intent;
import android.text.TextUtils;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.R;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.MarketAdviceDesc;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;
import com.taikor.investment.view.PullScrollView;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 市场观点详情
 * Created by Any on 2017/8/17.
 */

public class MarketDescActivity extends BaseActivity {

    @BindView(R.id.tv_top_bar_left)
    TextView tvTopBarLeft;
    @BindView(R.id.tv_top_bar_middle)
    TextView tvTopBarMiddle;
    @BindView(R.id.tv_market_title)
    TextView tvMarketTitle;
    @BindView(R.id.tv_market_date)
    TextView tvMarketDate;
    @BindView(R.id.wv_market)
    WebView wvMarket;
    @BindView(R.id.market_scroll)
    PullScrollView marketScroll;

    private String itemId, token;
    private int type;

    @Override
    public int getLayoutResource() {
        return R.layout.activity_market_advice_desc;
    }

    @Override
    protected void initView() {
        Intent intent = getIntent();
        itemId = intent.getStringExtra("itemId");
        type = intent.getIntExtra("type", 0);
        token = SharedPreferenceUtils.getString(this, "token", "");

        //初始化界面
        tvTopBarLeft.setBackgroundResource(R.drawable.backup);
        tvTopBarMiddle.setCompoundDrawables(null, null, null, null);
        tvTopBarMiddle.setText("文章详情");

        WebSettings settings = wvMarket.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);  //将图片缩放至屏幕宽度
        wvMarket.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return true;
            }
        });

        //设置头部加载颜色
        marketScroll.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        marketScroll.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        marketScroll.setRefreshListener(new PullScrollView.RefreshListener() {
            @Override
            public void onRefresh() {
                if (TextUtils.isEmpty(itemId)) {
                    return;
                }
                getData();
                marketScroll.setRefreshCompleted();
            }
        });

        marketScroll.refreshWithPull();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        OkGo.getInstance().cancelTag(this);
    }

    @OnClick({R.id.tv_top_bar_left})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left:
                finish();
                break;
            default:
        }
    }

    public void getData() {

        OkGo.<MarketAdviceDesc>get(Constant.MARKET_DESC)
                .tag(MarketDescActivity.this)
                .headers("Authorization", token)
                .params("itemID", itemId)
                .params("type", type)
                .execute(new JsonCallBack<MarketAdviceDesc>(MarketAdviceDesc.class) {
                    @Override
                    public void onSuccess(Response<MarketAdviceDesc> response) {
                        if (response == null) return;
                        MarketAdviceDesc marketDesc = response.body();
                        if (marketDesc == null) return;
                        showData(marketDesc);
                    }
                });

    }

    private void showData(MarketAdviceDesc body) {
        tvMarketTitle.setText(body.getTitle());
        //2017-05-23T09:37:40+08:00"
        String pubDate = body.getPubDate();
        String substring = pubDate.substring(0, 19);
        String t = substring.replace("T", " ");

        tvMarketDate.setText(t);
        String htmlText = body.getHtmlText();
        if (htmlText.contains("src=\"/p")) {
            //处理带图片的内容
            htmlText = htmlText.replace("src=\"/p", "src=\"http://car.zhuji.net/p");
        }

        wvMarket.loadDataWithBaseURL(null, CommonUtils.getNewContent(htmlText), "text/html", "utf-8", null);
    }
}
