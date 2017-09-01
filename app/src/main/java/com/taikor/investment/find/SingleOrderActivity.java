package com.taikor.investment.find;

import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
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
import com.taikor.investment.R;
import com.taikor.investment.adapter.HotEventAdapter;
import com.taikor.investment.adapter.NewsAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.HotEvent;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.ToastUtils;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 下单排行
 * Created by Any on 2017/8/2.
 */

public class SingleOrderActivity extends BaseActivity {
    @BindView(R.id.tv_top_bar_left)
    TextView tvTopBarLeft;
    @BindView(R.id.tv_top_bar_middle)
    TextView tvTopBarMiddle;
    @BindView(R.id.tab_layout)
    TabLayout tabAdvice;
    @BindView(R.id.view_pager)
    ViewPager vpAdvice;

    private NewsAdapter adapter;
    private List<String> titleList = new ArrayList<>();
    private ArrayList<Fragment> fragmentList = new ArrayList<>();

    @Override
    public int getLayoutResource() {
        return R.layout.include_tab_pager;
    }

    @Override
    protected void initView() {
        //初始化界面
        tvTopBarLeft.setBackgroundResource(R.drawable.backup);
        tvTopBarMiddle.setCompoundDrawables(null, null, null, null);
        tvTopBarMiddle.setText("下单排行");
    }

    @Override
    public void initData() {
        titleList.add("主题");
        titleList.add("个股");
        //初始化两种不同的fragment
        fragmentList.add(new ThemeOrderFragment());
        fragmentList.add(new StockOrderFragment());

        if (adapter == null) { //创建fragment
            adapter = new NewsAdapter(this.getSupportFragmentManager(), fragmentList, titleList);
        } else {//刷新fragment
            adapter.setFragments(this.getSupportFragmentManager(), fragmentList, titleList);
        }

        vpAdvice.setAdapter(adapter);
        tabAdvice.setupWithViewPager(vpAdvice);
        CommonUtils.dynamicSetTabLayoutMode(tabAdvice);
    }

    @OnClick({R.id.tv_top_bar_left})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left:
                finish();
                break;
        }
    }
}
