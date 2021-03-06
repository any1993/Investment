package com.taikor.investment.optional;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.view.View;
import android.widget.TextView;

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
import com.taikor.investment.adapter.ThemeAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.Block;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.lang.reflect.Type;
import java.util.List;

import butterknife.BindView;

/**
 * 主题
 * Created by Any on 2017/8/2.
 */

public class ThemeFragment extends BaseFragment {

    @BindView(R.id.empty_view)
    TextView emptyView;
    @BindView(R.id.rlv_general)
    LRecyclerView rlvTheme;

    private String token;
    private ThemeAdapter themeAdapter;
    private FragmentActivity activity;
    private LRecyclerViewAdapter mAdapter;
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_theme;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        themeAdapter = new ThemeAdapter(activity);
        mAdapter = new LRecyclerViewAdapter(themeAdapter);
        rlvTheme.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(activity)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvTheme.addItemDecoration(divider);
        //设置线性布局
        rlvTheme.setLayoutManager(new LinearLayoutManager(activity));
        //设置刷新的样式
        rlvTheme.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvTheme.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        rlvTheme.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //下拉刷新监听
        rlvTheme.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                themeAdapter.clear();
                getData();
                mAdapter.notifyDataSetChanged();
            }
        });
        rlvTheme.setLoadMoreEnabled(false);
        rlvTheme.refresh();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        OkGo.getInstance().cancelTag(this);
    }

    private void getData() {
        Type type = new TypeToken<List<Block>>() {
        }.getType();

        OkGo.<List<Block>>get(Constant.USER_THEME)
                .tag(ThemeFragment.this)
                .headers("Authorization", token)
                .params("userID", Constant.USER_ID)
                .execute(new JsonCallBack<List<Block>>(type) {
                    @Override
                    public void onSuccess(Response<List<Block>> response) {

                        if (response.body() == null) return;
                        rlvTheme.refreshComplete(REQUEST_COUNT);
                        List<Block> themeList = response.body();

                        if (themeList.size() == 0) {
                            emptyView.setVisibility(View.VISIBLE);
                            return;
                        }
                        themeAdapter.addAll(themeList);
                    }
                });
    }

}
