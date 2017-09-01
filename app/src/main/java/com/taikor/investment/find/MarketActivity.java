package com.taikor.investment.find;

import android.content.Intent;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.TextView;

import com.github.jdsjlzx.ItemDecoration.DividerDecoration;
import com.github.jdsjlzx.interfaces.OnItemClickListener;
import com.github.jdsjlzx.recyclerview.LRecyclerView;
import com.github.jdsjlzx.recyclerview.LRecyclerViewAdapter;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.R;
import com.taikor.investment.adapter.EmptyAdviceAdapter;
import com.taikor.investment.adapter.HotEventAdapter;
import com.taikor.investment.adapter.MarketEmptyAdapter;
import com.taikor.investment.adapter.MarketMoreAdapter;
import com.taikor.investment.adapter.MoreAdviceAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.MarketAdvice;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 市场观点
 * Created by Any on 2017/8/2.
 */

public class MarketActivity extends BaseActivity {

    @BindView(R.id.tv_top_bar_left)
    TextView tvTopBarLeft;
    @BindView(R.id.tv_top_bar_middle)
    TextView tvTopBarMiddle;
    @BindView(R.id.rlv_market_more)
    RecyclerView rlvMarketMore;
    @BindView(R.id.rlv_market_empty)
    RecyclerView rlvMarketEmpty;
    @BindView(R.id.rlv_empty)
    RecyclerView rlvEmpty;
    @BindView(R.id.rlv_more)
    RecyclerView rlvMore;

    private String token;
    private MarketMoreAdapter marketMoreAdapter;
    private MarketEmptyAdapter marketEmptyAdapter;
    private MoreAdviceAdapter moreAdviceAdapter;
    private EmptyAdviceAdapter emptyAdviceAdapter;
    private List<MarketAdvice> vMoreList = new ArrayList<>();

    @Override
    public int getLayoutResource() {
        return R.layout.activity_market_advice;
    }

    @Override
    protected void initView() {
        token = SharedPreferenceUtils.getString(this, "token", "");
        tvTopBarLeft.setBackgroundResource(R.drawable.backup);
        tvTopBarMiddle.setText("市场观点");
        tvTopBarMiddle.setCompoundDrawables(null, null, null, null);

        //大v看多
        marketMoreAdapter = new MarketMoreAdapter(this);
        rlvMarketMore.setAdapter(marketMoreAdapter);
        rlvMarketMore.setLayoutManager(new LinearLayoutManager(this));

        //大v看空
        marketEmptyAdapter = new MarketEmptyAdapter(this);
        rlvMarketEmpty.setAdapter(marketEmptyAdapter);
        rlvMarketEmpty.setLayoutManager(new LinearLayoutManager(this));

        //看多
        moreAdviceAdapter = new MoreAdviceAdapter(this);
        rlvMore.setAdapter(moreAdviceAdapter);
        rlvMore.setLayoutManager(new LinearLayoutManager(this));
        rlvMore.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));

        //看空
        emptyAdviceAdapter = new EmptyAdviceAdapter(this);
        rlvEmpty.setAdapter(emptyAdviceAdapter);
        rlvEmpty.setLayoutManager(new LinearLayoutManager(this));
        rlvEmpty.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));
    }

    @Override
    public void initData() {
        getMarketMore();
        getMore();
        getEmpty();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        OkGo.getInstance().cancelTag(this);
    }

    private void getEmpty() {
        Type type = new TypeToken<List<MarketAdvice>>() {
        }.getType();
        OkGo.<List<MarketAdvice>>get(Constant.MARKET)
                .tag(this)
                .headers("Authorization", token)
                .params("personId", "")
                .params("count", 3)
                .params("dateTime", System.currentTimeMillis())
                .params("getDetail", false)
                .params("isExpert", false)
                .params("sentiment", 3)
                .execute(new JsonCallBack<List<MarketAdvice>>(type) {
                    @Override
                    public void onSuccess(Response<List<MarketAdvice>> response) {
                        if (response == null) return;
                        List<MarketAdvice> emptyList = response.body();
                        if (emptyList.size() == 0) return;
                        emptyAdviceAdapter.addAll(emptyList);
                    }
                });
    }

    private void getMore() {
        Type type = new TypeToken<List<MarketAdvice>>() {
        }.getType();
        OkGo.<List<MarketAdvice>>get(Constant.MARKET)
                .tag(this)
                .headers("Authorization", token)
                .params("personId", "")
                .params("count", 3)
                .params("dateTime", System.currentTimeMillis())
                .params("getDetail", false)
                .params("isExpert", false)
                .params("sentiment", 1)
                .execute(new JsonCallBack<List<MarketAdvice>>(type) {
                    @Override
                    public void onSuccess(Response<List<MarketAdvice>> response) {
                        if (response == null) return;
                        List<MarketAdvice> moreList = response.body();
                        if (moreList.size() == 0) return;
                        moreAdviceAdapter.addAll(moreList);
                    }
                });
    }

    private void getMarketEmpty() {
        Type type = new TypeToken<List<MarketAdvice>>() {
        }.getType();
        OkGo.<List<MarketAdvice>>get(Constant.MARKET)
                .tag(this)
                .headers("Authorization", token)
                .params("personId", "")
                .params("count", 3)
                .params("dateTime", System.currentTimeMillis())
                .params("getDetail", false)
                .params("isExpert", true)
                .params("sentiment", 3)
                .execute(new JsonCallBack<List<MarketAdvice>>(type) {
                    @Override
                    public void onSuccess(Response<List<MarketAdvice>> response) {
                        if (response == null) return;
                        List<MarketAdvice> vEmptyList = response.body();
                        if (vEmptyList.size() == 0) return;
                        marketMoreAdapter.addAll(vMoreList);
                        marketEmptyAdapter.addAll(vEmptyList);

                    }
                });
    }

    private void getMarketMore() {
        Type type = new TypeToken<List<MarketAdvice>>() {
        }.getType();
        OkGo.<List<MarketAdvice>>get(Constant.MARKET)
                .tag(this)
                .headers("Authorization", token)
                .params("personId", "")
                .params("count", 3)
                .params("dateTime", System.currentTimeMillis())
                .params("getDetail", false)
                .params("isExpert", true)
                .params("sentiment", 1)
                .execute(new JsonCallBack<List<MarketAdvice>>(type) {
                    @Override
                    public void onSuccess(Response<List<MarketAdvice>> response) {
                        if (response == null) return;
                        vMoreList = response.body();
                        if (vMoreList.size() == 0) return;

                        getMarketEmpty();
                    }
                });
    }

    @OnClick({R.id.tv_top_bar_left, R.id.bt_show_more})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left:
                finish();
                break;
            case R.id.bt_show_more:
                Intent intent = new Intent(MarketActivity.this, UpAdviceActivity.class);
                startActivity(intent);
                break;
        }
    }

}
