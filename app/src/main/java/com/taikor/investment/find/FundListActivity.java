package com.taikor.investment.find;

import android.content.Intent;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.adapter.NewsAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.utils.CommonUtils;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 基金产品库
 * Created by Any on 2017/8/16.
 */

public class FundListActivity extends BaseActivity {

    @BindView(R.id.tv_top_bar_left)
    TextView tvTopBarLeft;
    @BindView(R.id.tv_top_bar_middle)
    TextView tvTopBarMiddle;
    @BindView(R.id.tv_top_bar_right)
    TextView tvSearch;
    @BindView(R.id.tab_layout)
    TabLayout tabProduct;
    @BindView(R.id.view_pager)
    ViewPager vpProduct;

    private NewsAdapter adapter;
    private List<String> titleList=new ArrayList<>();
    private ArrayList<Fragment> fragmentList = new ArrayList<>();

    @Override
    public int getLayoutResource() {
        return R.layout.include_tab_pager;
    }

    @Override
    protected void initView() {
        tvTopBarLeft.setBackgroundResource(R.drawable.backup);
        tvTopBarMiddle.setText("基金产品库");
        tvTopBarMiddle.setCompoundDrawables(null, null, null, null);
        tvSearch.setVisibility(View.VISIBLE);
    }

    @Override
    public void initData() {
        titleList.add("固定收益类");
        titleList.add("净值波动型");
        //初始化两种不同的fragment
        fragmentList.add(new FixedIncomeFragment());
        fragmentList.add(new NetVolatilityFragment());

        if (adapter == null) { //创建fragment
            adapter = new NewsAdapter(this.getSupportFragmentManager(), fragmentList, titleList);
        } else {//刷新fragment
            adapter.setFragments(this.getSupportFragmentManager(), fragmentList, titleList);
        }

        vpProduct.setAdapter(adapter);
        tabProduct.setupWithViewPager(vpProduct);
        CommonUtils.dynamicSetTabLayoutMode(tabProduct);
    }

    @OnClick({R.id.tv_top_bar_left, R.id.tv_top_bar_right})
    public void click(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left:
                finish();
                break;
            case R.id.tv_top_bar_right:
                Intent searchIntent=new Intent(FundListActivity.this, SearchActivity.class);
                startActivity(searchIntent);
        }
    }
}
