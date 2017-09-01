package com.taikor.investment.news;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.github.jdsjlzx.ItemDecoration.DividerDecoration;
import com.github.jdsjlzx.interfaces.OnItemClickListener;
import com.github.jdsjlzx.interfaces.OnLoadMoreListener;
import com.github.jdsjlzx.interfaces.OnRefreshListener;
import com.github.jdsjlzx.recyclerview.LRecyclerView;
import com.github.jdsjlzx.recyclerview.LRecyclerViewAdapter;
import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.adapter.GeneralAdapter;
import com.taikor.investment.adapter.MorningAdapter;
import com.taikor.investment.adapter.StockIndexAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.General;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.GlideUtils;
import com.taikor.investment.utils.SharedPreferenceUtils;
import com.taikor.investment.utils.ToastUtils;
import com.youth.banner.Banner;
import com.youth.banner.BannerConfig;
import com.youth.banner.listener.OnBannerListener;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;

/**
 * 资讯——推荐
 * Created by Any on 2017/8/9.
 */

public class RecommendFragment extends BaseFragment implements OnBannerListener, View.OnClickListener {

    @BindView(R.id.tv_head_title)
    TextView tvHeadTitle;
    @BindView(R.id.tv_head_desc)
    TextView tvHeadDesc;
    @BindView(R.id.rlv_morning)
    RecyclerView rlvMorning;
    @BindView(R.id.ll_night)
    LinearLayout llNight;
    @BindView(R.id.banner_news)
    Banner bannerNews;
    @BindView(R.id.image1)
    ImageView image1;
    @BindView(R.id.image2)
    ImageView image2;
    @BindView(R.id.image3)
    ImageView image3;
    @BindView(R.id.rlv_stock_index)
    RecyclerView rlvStockIndex;
    @BindView(R.id.rlv_recommend)
    LRecyclerView rlvRecommend;

    private int type;
    private String token;
    private FragmentActivity activity;
    private MorningAdapter morningAdapter;
    private GeneralAdapter generalAdapter;
    private StockIndexAdapter stockIndexAdapter;
    private LRecyclerViewAdapter mAdapter;
    private static final int TOTAL_COUNT = 1000;//服务器端一共多少条数据
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据
    private static int mCurrentCount = 0;//已经获取到多少条数据了
    private ImageView[] images = new ImageView[3];
    private List<General> pushList = new ArrayList<>();
    private List<String> urlList = new ArrayList<>(), titleList = new ArrayList<>();

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_recommend;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        bannerNews.setImageLoader(new GlideUtils());
        bannerNews.setOnBannerListener(this);

        //早推送
        morningAdapter = new MorningAdapter(activity);
        rlvMorning.setAdapter(morningAdapter);
        rlvMorning.setLayoutManager(new LinearLayoutManager(activity));
        rlvMorning.addItemDecoration(new DividerItemDecoration(activity, DividerItemDecoration.VERTICAL));

        tvHeadDesc.setOnClickListener(this);
        //股票指数
        stockIndexAdapter = new StockIndexAdapter(activity);
        rlvStockIndex.setAdapter(stockIndexAdapter);
        rlvStockIndex.setLayoutManager(new GridLayoutManager(activity, 3));
        rlvStockIndex.addItemDecoration(new DividerItemDecoration(activity, DividerItemDecoration.HORIZONTAL));

        //推荐新闻
        generalAdapter = new GeneralAdapter(activity);
        mAdapter = new LRecyclerViewAdapter(generalAdapter);
        rlvRecommend.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(activity)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvRecommend.addItemDecoration(divider);
        //设置线性布局
        rlvRecommend.setLayoutManager(new LinearLayoutManager(activity));
        //设置刷新的样式
        rlvRecommend.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvRecommend.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        //加载更多的样式
        rlvRecommend.setLoadingMoreProgressStyle(ProgressStyle.BallSpinFadeLoader);

        //下拉刷新监听
        rlvRecommend.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                generalAdapter.clear();
                mAdapter.notifyDataSetChanged();
                mCurrentCount = 0;
                getNewsData();
            }
        });

        //加载更多监听
        rlvRecommend.setOnLoadMoreListener(new OnLoadMoreListener() {
            @Override
            public void onLoadMore() {
                if (mCurrentCount < TOTAL_COUNT) {
                    getNewsData();
                } else {
                    rlvRecommend.setNoMore(true);
                }
            }
        });

        rlvRecommend.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载颜色
        rlvRecommend.setFooterViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载文字提示
        rlvRecommend.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");

        rlvRecommend.refresh();
    }

    @Override
    public void initData() {
        //获取数据
        getHeadData();
        getIndexData();
    }

    //获取头部数据
    private void getHeadData() {

        Type type = new TypeToken<List<General>>() {
        }.getType();

        OkGo.<List<General>>get(Constant.HEAD)
                .tag(activity)
                .headers("Authorization", token)
                .params("userID", Constant.USER_ID)
                .execute(new JsonCallBack<List<General>>(type) {
                    @Override
                    public void onSuccess(Response<List<General>> response) {
                        if (response == null) return;
                        pushList = response.body();
                        stockIndexAdapter.setData(pushList);
                        if (pushList == null) return;
                        setHeadData(pushList);
                    }
                });
    }

    //根据时间显示不同的头部信息
    private void setHeadData(List<General> generalList) {

        type = generalList.get(0).getType();
        String pubDate = generalList.get(0).getPubDate();
//        String s="2017-08-10 11:39:58";
        String[] split = pubDate.split(" ");
        String[] need = split[0].split("-");
        String year = need[0].substring(2, 4);
        String month = need[1];
        String day = need[2];

        if (type == 2) {
            tvHeadTitle.setText("【" + year + "." + month + "." + day + " 早盘推送" + "】");
            morningAdapter.setDataList(generalList);
            rlvMorning.setVisibility(View.VISIBLE);
            llNight.setVisibility(View.GONE);
            rlvStockIndex.setVisibility(View.VISIBLE);
        } else if (type == 3) {
            tvHeadTitle.setText("【" + year + "." + month + "." + day + " 午间推送" + "】");
            tvHeadDesc.setText("【午间盘面总结】" + generalList.get(0).getTitle());
            tvHeadDesc.setVisibility(View.VISIBLE);
            rlvStockIndex.setVisibility(View.VISIBLE);
        } else if (type == 4) {
            tvHeadTitle.setText("【" + year + "." + month + "." + day + " 收盘总结" + "】");
            tvHeadDesc.setText("【收盘盘面总结】" + generalList.get(0).getTitle());
            tvHeadDesc.setVisibility(View.VISIBLE);
            rlvStockIndex.setVisibility(View.VISIBLE);
        } else if (type == 5) {
            tvHeadTitle.setText("【" + year + "." + month + "." + day + " 晚间新闻" + "】");
            llNight.setVisibility(View.VISIBLE);
            rlvStockIndex.setVisibility(View.GONE);
            setBanner(generalList);
        }

    }

    //设置轮播图，标题，指示器
    private void setBanner(final List<General> generalList) {
        //初始化
        for (int i = 0; i < generalList.size(); i++) {
            String imageUrl = generalList.get(0).getImageUrl();
            urlList.add(Constant.URL_HEAD + imageUrl);
            titleList.add(generalList.get(i).getTitle());
            if (i == 0) {
                Glide.with(activity).load(Constant.URL_HEAD + imageUrl).into(image1);
                images[i] = image1;
            }
            if (i == 1) {
                Glide.with(activity).load(Constant.URL_HEAD + imageUrl).into(image2);
                images[i] = image2;
            }
            if (i == 2) {
                Glide.with(activity).load(Constant.URL_HEAD + imageUrl).into(image3);
                images[i] = image3;
            }

        }
        bannerNews.setBannerStyle(BannerConfig.NOT_INDICATOR);
        bannerNews.setBannerTitles(titleList).setImages(urlList).start();
        bannerNews.setOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {
                //控制图片的变化
                for (int i = 0; i < images.length; i++) {
                    images[i].setAlpha(0.5f);
                }
                int j = position % generalList.size();
                images[j].setAlpha(1f);
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });

    }

    //获取股票指数
    private void getIndexData() {
        Type type = new TypeToken<List<Stock>>() {
        }.getType();

        OkGo.<List<Stock>>get(Constant.STOCK)
                .tag(activity)
                .headers("Authorization", token)
                .params("stockIds", "sh000001,sz399001,sz399006")
                .params("sortType", 0)
                .params("count", 3)

                .execute(new JsonCallBack<List<Stock>>(type) {
                    @Override
                    public void onSuccess(Response<List<Stock>> response) {
                        if (response == null) return;
                        List<Stock> indexList = response.body();
                        stockIndexAdapter.addAll(indexList);
                    }
                });
    }

    //获取新闻数据
    private void getNewsData() {
        Type type = new TypeToken<List<General>>() {
        }.getType();

        OkGo.<List<General>>get(Constant.GENERAL_HEAD)
                .tag(RecommendFragment.this)
                .headers("Authorization", token)
                .params("userID", Constant.USER_ID)
                .params("count", REQUEST_COUNT)
                .params("category", "Recommend")
                .params("dateTime", System.currentTimeMillis())
                .params("authorName", "")
                .params("version", "2.0")
                .execute(new JsonCallBack<List<General>>(type) {
                    @Override
                    public void onSuccess(Response<List<General>> response) {
                        if (response == null) return;
                        List<General> generalList = response.body();
                        generalAdapter.addAll(generalList);
                        mCurrentCount += generalList.size();
                        rlvRecommend.refreshComplete(REQUEST_COUNT);
                    }
                });
    }

    //晚点新闻轮播
    @Override
    public void OnBannerClick(int position) {
        Intent intent = new Intent(activity, GeneralDescActivity.class);
        intent.putExtra("itemId", String.valueOf(pushList.get(position).getPushDate()));
        intent.putExtra("fromPage", "night");
        startActivity(intent);
    }

    //午间推送，收盘总结
    @Override
    public void onClick(View view) {
        Intent intent = new Intent(activity, GeneralDescActivity.class);
        intent.putExtra("itemId", String.valueOf(pushList.get(0).getPushDate()));
        if (type == 3) {
            intent.putExtra("fromPage", "noon");
        } else if (type == 4) {
            intent.putExtra("fromPage", "afternoon");
        }
        startActivity(intent);
    }

    //取消请求
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        OkGo.getInstance().cancelTag(this);
    }
}
