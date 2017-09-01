package com.taikor.investment.news;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.view.View;
import android.widget.TextView;

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
 * 热点
 * Created by Any on 2017/8/11.
 */

public class SpotFragment extends BaseFragment {

    @BindView(R.id.empty_view)
    TextView emptyView;
    @BindView(R.id.rlv_general)
    LRecyclerView rlvSpot;

    private String token;
    private FragmentActivity activity;
    private GeneralAdapter generalAdapter;
    private LRecyclerViewAdapter mAdapter;
    private static final int TOTAL_COUNT = 1000;//服务器端一共多少条数据
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据
    private static int mCurrentCount = 0;//已经获取到多少条数据了

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_spot;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        //推荐新闻
        generalAdapter = new GeneralAdapter(activity);
        mAdapter = new LRecyclerViewAdapter(generalAdapter);
        rlvSpot.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(activity)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvSpot.addItemDecoration(divider);
        //设置线性布局
        rlvSpot.setLayoutManager(new LinearLayoutManager(activity));
        //设置刷新的样式
        rlvSpot.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvSpot.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        //加载更多的样式
        rlvSpot.setLoadingMoreProgressStyle(ProgressStyle.BallSpinFadeLoader);

        //下拉刷新监听
        rlvSpot.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                generalAdapter.clear();
                mAdapter.notifyDataSetChanged();
                mCurrentCount = 0;
                getNewsData();
            }
        });

        //加载更多监听
        rlvSpot.setOnLoadMoreListener(new OnLoadMoreListener() {
            @Override
            public void onLoadMore() {
                if (mCurrentCount < TOTAL_COUNT) {
                    getNewsData();
                } else {
                    rlvSpot.setNoMore(true);
                }
            }
        });

        rlvSpot.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载颜色
        rlvSpot.setFooterViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载文字提示
        rlvSpot.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");

        rlvSpot.refresh();
    }

    //获取新闻数据
    private void getNewsData() {
        Type type = new TypeToken<List<General>>() {
        }.getType();

        OkGo.<List<General>>get(Constant.GENERAL_HEAD)
                .tag(activity)
                .headers("Authorization", token)
                .params("userID", Constant.USER_ID)
                .params("count", REQUEST_COUNT)
                .params("category", "HotNews")
                .params("dateTime", System.currentTimeMillis())
                .params("authorName", "")
                .params("version", "2.0")
                .execute(new JsonCallBack<List<General>>(type) {
                    @Override
                    public void onSuccess(Response<List<General>> response) {
                        if (response.body() == null) return;
                        rlvSpot.refreshComplete(REQUEST_COUNT);
                        List<General> generalList = response.body();
                        if (generalList.size() == 0) {
                            emptyView.setVisibility(View.VISIBLE);
                            return;
                        }
                        mCurrentCount += generalList.size();
                        generalAdapter.addAll(generalList);
                    }
                });
    }
}
