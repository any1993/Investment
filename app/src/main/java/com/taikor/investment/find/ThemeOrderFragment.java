package com.taikor.investment.find;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import com.github.jdsjlzx.ItemDecoration.DividerDecoration;
import com.github.jdsjlzx.interfaces.OnRefreshListener;
import com.github.jdsjlzx.recyclerview.LRecyclerView;
import com.github.jdsjlzx.recyclerview.LRecyclerViewAdapter;
import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.google.gson.reflect.TypeToken;
import com.lcodecore.tkrefreshlayout.RefreshListenerAdapter;
import com.lcodecore.tkrefreshlayout.TwinklingRefreshLayout;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.adapter.OrderThemeAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.Order;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.lang.reflect.Type;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 品类板块
 * Created by Any on 2017/8/17.
 */

public class ThemeOrderFragment extends BaseFragment {

    @BindView(R.id.rlv_general)
    LRecyclerView rlvGeneral;

    private int sortType = 0;
    private String token;
    private FragmentActivity activity;
    private OrderThemeAdapter orderAdapter;
    private LRecyclerViewAdapter mAdapter;
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_order_theme;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {

        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        orderAdapter = new OrderThemeAdapter(activity);
        mAdapter = new LRecyclerViewAdapter(orderAdapter);
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
                orderAdapter.clear();
                mAdapter.notifyDataSetChanged();
                getData();
            }
        });

        rlvGeneral.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载颜色
        rlvGeneral.setFooterViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载文字提示
        rlvGeneral.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");

        rlvGeneral.refresh();
    }

    private void getData() {
        Type type = new TypeToken<List<Order>>() {
        }.getType();

        OkGo.<List<Order>>get(Constant.ORDER_BLOCK)
                .tag(ThemeOrderFragment.this)
                .headers("Authorization", token)
                .params("count", REQUEST_COUNT)
                .params("sortType", sortType)
                .execute(new JsonCallBack<List<Order>>(type) {
                    @Override
                    public void onSuccess(Response<List<Order>> response) {
                        List<Order> generalList = response.body();
                        if (generalList != null && generalList.size() > 0) {
                            orderAdapter.setDataList(generalList);
                        }
                        rlvGeneral.refreshComplete(REQUEST_COUNT);
                    }
                });
    }

    @OnClick({R.id.rb_theme_buy, R.id.rb_theme_sell})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.rb_theme_buy:
                sortType = 0;
                rlvGeneral.refresh();
                break;
            case R.id.rb_theme_sell:
                sortType = 1;
                rlvGeneral.refresh();
                break;
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        OkGo.getInstance().cancelTag(this);
    }
}
