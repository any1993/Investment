package com.taikor.investment.news;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.view.View;

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
import com.taikor.investment.R;
import com.taikor.investment.adapter.GeneralAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.General;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;
import com.taikor.investment.utils.ToastUtils;

import java.lang.reflect.Type;
import java.util.List;

import butterknife.BindView;

/**
 * 通用的新闻资讯页面
 * Created by Any on 2017/8/9.
 */

public class GeneralFragment extends BaseFragment {

    @BindView(R.id.rlv_general)
    LRecyclerView rlvGeneral;

    private int order;
    private String token;
    private FragmentActivity activity;
    private GeneralAdapter generalAdapter;
    private LRecyclerViewAdapter mAdapter;
    private static final int TOTAL_COUNT = 1000;//服务器端一共多少条数据
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据
    private static int mCurrentCount = 0;//已经获取到多少条数据了

    private String[] categorys = {"Read_PrivateEquity", "Read_ForeignExchange",
            "Read_Futures", "Read_Securities", "Read_Stock", "Read_Realestate", "Read_Policy", "Read_Data"};

    @Override
    public int getLayoutResource() {
        return R.layout.include_recycler;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        order = getArguments().getInt("order");
        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        //推荐新闻
        generalAdapter = new GeneralAdapter(activity);
        mAdapter = new LRecyclerViewAdapter(generalAdapter);
        rlvGeneral.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(activity)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvGeneral.addItemDecoration(divider);
        //设置线性布局
        rlvGeneral.setLayoutManager(new LinearLayoutManager(activity));
        //设置刷新的样式
        rlvGeneral.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvGeneral.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        //加载更多的样式
        rlvGeneral.setLoadingMoreProgressStyle(ProgressStyle.BallSpinFadeLoader);

        //下拉刷新监听
        rlvGeneral.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                generalAdapter.clear();
                mAdapter.notifyDataSetChanged();
                mCurrentCount = 0;
                getNewsData();
            }
        });

        //加载更多监听
        rlvGeneral.setOnLoadMoreListener(new OnLoadMoreListener() {
            @Override
            public void onLoadMore() {
                if (mCurrentCount < TOTAL_COUNT) {
                    getNewsData();
                } else {
                    rlvGeneral.setNoMore(true);
                }
            }
        });

        rlvGeneral.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载颜色
        rlvGeneral.setFooterViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载文字提示
        rlvGeneral.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");

        rlvGeneral.refresh();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        OkGo.getInstance().cancelTag(this);
    }

    //获取新闻数据
    private void getNewsData() {

        Type type = new TypeToken<List<General>>() {
        }.getType();

        String category = categorys[order - 4];

        OkGo.<List<General>>get(Constant.GENERAL_HEAD)
                .tag(this)
                .headers("Authorization", token)
                .params("userID", Constant.USER_ID)
                .params("count", REQUEST_COUNT)
                .params("category", category)
                .params("dateTime", System.currentTimeMillis())
                .params("authorName", "")
                .params("version", "2.0")
                .execute(new JsonCallBack<List<General>>(type) {
                    @Override
                    public void onSuccess(Response<List<General>> response) {
                        List<General> generalList = response.body();
                        if(generalList!=null&&generalList.size()>0){
                            generalAdapter.addAll(generalList);
                            mCurrentCount += generalList.size();
                            rlvGeneral.refreshComplete(REQUEST_COUNT);
                        }
                    }
                });
    }

}
