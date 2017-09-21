package com.taikor.investment.find;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.content.ContextCompat;
import android.support.v4.view.ViewPager;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.TextUtils;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IAxisValueFormatter;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.cache.CacheMode;
import com.lzy.okgo.callback.StringCallback;
import com.lzy.okgo.model.Response;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.adapter.AdviceAdapter;
import com.taikor.investment.adapter.HotEventAdapter;
import com.taikor.investment.adapter.HotThemeAdapter;
import com.taikor.investment.adapter.IndexAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.Asset;
import com.taikor.investment.bean.Emotion;
import com.taikor.investment.bean.General;
import com.taikor.investment.bean.HotEvent;
import com.taikor.investment.bean.HotTheme;
import com.taikor.investment.bean.MainAdvice;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.news.NewsDescActivity;
import com.taikor.investment.user.UserActivity;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.GlideUtils;
import com.taikor.investment.utils.SharedPreferenceUtils;
import com.youth.banner.Banner;
import com.youth.banner.BannerConfig;
import com.youth.banner.listener.OnBannerListener;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 发现
 * Created by Any on 2017/7/27.
 */

public class FindFragment extends BaseFragment implements OnBannerListener {

    @BindView(R.id.tv_top_bar_middle)
    TextView tvTopBarMiddle;
    @BindView(R.id.banner)
    Banner banner;
    @BindView(R.id.rlv_hot_event)
    RecyclerView rlvHotEvent;
    @BindView(R.id.rlv_hot_theme)
    RecyclerView rlvHotTheme;
    @BindView(R.id.rlv_advice)
    RecyclerView rlvAdvice;
    @BindView(R.id.vp_index)
    ViewPager vpIndex;
    @BindView(R.id.dot1)
    ImageView imageView1;
    @BindView(R.id.dot2)
    ImageView imageView2;
    @BindView(R.id.dot3)
    ImageView imageView3;

    private String token;
    private ImageView[] dots = new ImageView[3];
    private boolean isEvent = false, isTheme = false, isAdvice = false;
    private FragmentActivity activity;
    private IndexAdapter indexAdapter;
    private HotEventAdapter hotEventAdapter;
    private HotThemeAdapter hotThemeAdapter;
    private AdviceAdapter adviceAdapter;
    private List<General> generalList = new ArrayList<>();
    private List<String> urlList = new ArrayList<>(), titleList = new ArrayList<>();

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_find;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        //设置标题栏
        tvTopBarMiddle.setText(getString(R.string.search_hint));
        tvTopBarMiddle.setBackgroundResource(R.drawable.bg_search);
        tvTopBarMiddle.setTextColor(ContextCompat.getColor(activity, R.color.text_color_9));
        tvTopBarMiddle.setTextSize(12);
        tvTopBarMiddle.setGravity(Gravity.CENTER_VERTICAL);

        //设置图片加载器
        banner.setImageLoader(new GlideUtils());
        banner.setOnBannerListener(this);

        //热门事件
        hotEventAdapter = new HotEventAdapter(activity);
        rlvHotEvent.setAdapter(hotEventAdapter);
        rlvHotEvent.setLayoutManager(new LinearLayoutManager(activity));
        rlvHotEvent.addItemDecoration(new DividerItemDecoration(activity, DividerItemDecoration.HORIZONTAL));

        //热门主题
        hotThemeAdapter = new HotThemeAdapter(activity);
        rlvHotTheme.setAdapter(hotThemeAdapter);
        rlvHotTheme.setLayoutManager(new LinearLayoutManager(activity));
        rlvHotTheme.addItemDecoration(new DividerItemDecoration(activity, DividerItemDecoration.HORIZONTAL));

        //大V投资观点
        adviceAdapter = new AdviceAdapter(activity);
        rlvAdvice.setAdapter(adviceAdapter);
        rlvAdvice.setLayoutManager(new LinearLayoutManager(activity));
        rlvAdvice.addItemDecoration(new DividerItemDecoration(activity, DividerItemDecoration.HORIZONTAL));

        //图表轮播
        List<Fragment> fragmentList = new ArrayList<>();
        fragmentList.add(new IndexShangFragment());
        fragmentList.add(new IndexShenFragment());
        fragmentList.add(new IndexChuangFragment());

        if (indexAdapter == null) {
            indexAdapter = new IndexAdapter(activity.getSupportFragmentManager(), fragmentList);
        } else {
            indexAdapter.setFragments(activity.getSupportFragmentManager(), fragmentList);
        }

        vpIndex.setAdapter(indexAdapter);
        //设置点的状态
        imageView1.setSelected(true);
        dots[0] = imageView1;
        dots[1] = imageView2;
        dots[2] = imageView3;
        vpIndex.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {
                //控制点的变化
                int j = position % 3;
                for (ImageView view : dots) {
                    view.setSelected(false);
                }
                dots[j].setSelected(true);
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });
    }

    @Override
    public void initData() {
        getBannerUrl();
        getHotEvent();
        getHotTheme();
        getMainAdvice();
    }

    //获取轮播图数据
    private void getBannerUrl() {
        Type type = new TypeToken<List<General>>() {
        }.getType();

        OkGo.<List<General>>get(Constant.GENERAL_HEAD)
                .tag(activity)
                .headers("Authorization", token)
                .cacheKey("banner")
                .params("userID", Constant.USER_ID)
                .params("count", "5")
                .params("category", "top")
                .execute(new JsonCallBack<List<General>>(type) {
                    @Override
                    public void onSuccess(Response<List<General>> response) {
                        generalList = response.body();
                        for (General general : generalList) {
                            urlList.add(Constant.URL_HEAD + general.getImageUrl());
                            titleList.add(general.getTitle());
                        }
                        if (banner == null) return;
                        banner.setIndicatorGravity(BannerConfig.RIGHT);
                        banner.setBannerStyle(BannerConfig.CIRCLE_INDICATOR_TITLE_INSIDE);
                        banner.setImages(urlList).setBannerTitles(titleList).start();
                    }

                    @Override
                    public void onCacheSuccess(Response<List<General>> response) {
                        onSuccess(response);
                    }
                });
    }

    //获取热门事件
    public void getHotEvent() {
        Type type = new TypeToken<List<HotEvent>>() {
        }.getType();

        OkGo.<List<HotEvent>>get(Constant.HOT_EVENT)
                .tag(FindFragment.this)
                .headers("Authorization", token)
                .cacheKey("hot_event")
                .params("count", 3)
                .execute(new JsonCallBack<List<HotEvent>>(type) {
                    @Override
                    public void onSuccess(Response<List<HotEvent>> response) {
                        List<HotEvent> hotEventList = response.body();
                        if (hotEventList != null && hotEventList.size() > 0) {
                            hotEventAdapter.clear();
                            hotEventAdapter.addAll(hotEventList);
                        }
                    }

                    @Override
                    public void onCacheSuccess(Response<List<HotEvent>> response) {
                        if (!isEvent) {
                            onSuccess(response);
                            isEvent = true;
                        }
                    }
                });
    }

    //获取热门主题数据
    private void getHotTheme() {

        Type type = new TypeToken<List<HotTheme>>() {
        }.getType();

        OkGo.<List<HotTheme>>get(Constant.HOT_THEME)
                .tag(FindFragment.this)
                .headers("Authorization", token)
                .cacheKey("hot_theme")
                .params("count", 3)
                .execute(new JsonCallBack<List<HotTheme>>(type) {
                    @Override
                    public void onSuccess(Response<List<HotTheme>> response) {
                        List<HotTheme> hotThemeList = response.body();
                        if (hotThemeList!=null&&hotThemeList.size() > 0) {
                            hotThemeAdapter.clear();
                            hotThemeAdapter.addAll(hotThemeList);
                        }
                    }

                    @Override
                    public void onCacheSuccess(Response<List<HotTheme>> response) {
                        if (!isTheme) {
                            onSuccess(response);
                            isTheme = true;
                        }
                    }
                });
    }

    //获取大v投资观点数据
    private void getMainAdvice() {

        OkGo.<MainAdvice>get(Constant.MAIN_ADVICE)
                .tag(activity)
                .headers("Authorization", token)
                .cacheKey("hot_advice")
                .params("count", 3)
                .execute(new JsonCallBack<MainAdvice>(MainAdvice.class) {
                    @Override
                    public void onSuccess(Response<MainAdvice> response) {
                        MainAdvice body = response.body();
                        if (body == null) return;
                        List<MainAdvice> adviceList = new ArrayList<>();
                        adviceList.add(body);
                        adviceList.add(body);
                        adviceList.add(body);
                        adviceAdapter.clear();
                        adviceAdapter.addAll(adviceList);
                    }

                    @Override
                    public void onCacheSuccess(Response<MainAdvice> response) {
                        if (!isAdvice) {
                            onSuccess(response);
                            isAdvice = true;
                        }
                    }
                });
    }

    //点击轮播图
    @Override
    public void OnBannerClick(int position) {
        Intent bannerIntent = new Intent(activity, NewsDescActivity.class);
        bannerIntent.putExtra("itemId", generalList.get(position).getId());
        bannerIntent.putExtra("newsType", generalList.get(position).getType());
        startActivity(bannerIntent);
    }

    @OnClick({R.id.tv_top_bar_left, R.id.tv_top_bar_middle,
            R.id.rb_market_advice, R.id.rb_single_order, R.id.rb_up_down, R.id.rb_fund_product
            , R.id.bt_hot_event, R.id.bt_hot_theme, R.id.bt_investment_advice})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left://返回
                Intent userIntent = new Intent(activity, UserActivity.class);
                startActivity(userIntent);
                break;
            case R.id.tv_top_bar_middle://搜索
                Intent searchIntent = new Intent(activity, SearchActivity.class);
                startActivity(searchIntent);
                break;
            case R.id.rb_market_advice://市场观点
                Intent marketIntent = new Intent(activity, MarketActivity.class);
                startActivity(marketIntent);
                break;
            case R.id.rb_single_order://下单排行
                Intent orderIntent = new Intent(activity, SingleOrderActivity.class);
                startActivity(orderIntent);
                break;
            case R.id.rb_up_down://涨停复盘
                Intent upDownIntent = new Intent(activity, UpDownActivity.class);
                startActivity(upDownIntent);
                break;
            case R.id.rb_fund_product://基金产品库
                Intent productIntent = new Intent(activity, FundListActivity.class);
                startActivity(productIntent);
                break;
            case R.id.bt_hot_event://热门事件
                Intent eventIntent = new Intent(activity, HotEventActivity.class);
                startActivity(eventIntent);
                break;
            case R.id.bt_hot_theme://热门主题
                Intent themeIntent = new Intent(activity, HotThemeActivity.class);
                startActivity(themeIntent);
                break;
            case R.id.bt_investment_advice://大V投资观点
                Intent adviceIntent = new Intent(activity, MarketActivity.class);
                startActivity(adviceIntent);
                break;
            default:
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        OkGo.getInstance().cancelTag(FindFragment.this);
    }
}
