package com.taikor.investment.find;

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
 * 看涨观点榜
 * Created by Any on 2017/8/17.
 */

public class UpAdviceActivity extends BaseActivity {

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
        tvTopBarMiddle.setText("看涨观点榜");
    }

    @Override
    public void initData() {
        titleList.add("品类板块");
        titleList.add("主题板块");
        titleList.add("个股板块");
         //初始化两种不同的fragment
        fragmentList.add(new CategoryPlateFragment());
        fragmentList.add(new ThemePlateFragment());
        fragmentList.add(new StockPlateFragment());

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
    public void click(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left:
                finish();
                break;
        }
    }

}
