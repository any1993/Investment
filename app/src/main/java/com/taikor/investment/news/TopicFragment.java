package com.taikor.investment.news;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.view.View;

import com.github.jdsjlzx.ItemDecoration.DividerDecoration;
import com.github.jdsjlzx.interfaces.OnRefreshListener;
import com.github.jdsjlzx.recyclerview.LRecyclerView;
import com.github.jdsjlzx.recyclerview.LRecyclerViewAdapter;
import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.adapter.TopicAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.General;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.lang.reflect.Type;
import java.util.List;

import butterknife.BindView;

/**
 * 资讯——专题
 * Created by Any on 2017/8/9.
 */

public class TopicFragment extends BaseFragment {

    @BindView(R.id.rlv_general)
    LRecyclerView rlvTopic;

    private String token;
    private FragmentActivity activity;
    private TopicAdapter topicAdapter;
    private LRecyclerViewAdapter mAdapter;

    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据

    @Override
    public int getLayoutResource() {
        return R.layout.include_recycler;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        topicAdapter = new TopicAdapter(activity);
        mAdapter = new LRecyclerViewAdapter(topicAdapter);
        rlvTopic.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(activity)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvTopic.addItemDecoration(divider);
        //设置线性布局
        rlvTopic.setLayoutManager(new LinearLayoutManager(activity));
        //设置刷新的样式
        rlvTopic.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvTopic.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        //加载更多的样式
        rlvTopic.setLoadingMoreProgressStyle(ProgressStyle.BallSpinFadeLoader);

        //下拉刷新监听
        rlvTopic.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                topicAdapter.clear();
                mAdapter.notifyDataSetChanged();
                getNewsData();
            }
        });

        rlvTopic.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载颜色
        rlvTopic.setFooterViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载文字提示
        rlvTopic.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");

        rlvTopic.refresh();
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
                .params("category", "Topic")
                .params("dateTime", System.currentTimeMillis() / 1000)
                .params("authorName", "")
                .params("version", "2.0")
                .execute(new JsonCallBack<List<General>>(type) {
                    @Override
                    public void onSuccess(Response<List<General>> response) {
                        List<General> generalList = response.body();
                        if (generalList != null && generalList.size() > 0) {
                            topicAdapter.addAll(generalList);
                            rlvTopic.refreshComplete(REQUEST_COUNT);
                        }
                    }

                    @Override
                    public void onCacheSuccess(Response<List<General>> response) {
                        onSuccess(response);
                    }
                });
    }
}
