package com.taikor.investment.optional;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.adapter.NewsAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.event.BooleanEvent;
import com.taikor.investment.find.SearchActivity;
import com.taikor.investment.user.UserActivity;
import com.taikor.investment.utils.CommonUtils;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 自选
 * Created by Any on 2017/7/27.
 */

public class OptionalFragment extends BaseFragment {

    @BindView(R.id.tv_top_bar_left)
    TextView tvTopBarLeft;
    @BindView(R.id.tv_top_bar_middle)
    TextView tvTopBarMiddle;
    @BindView(R.id.tv_top_bar_right)
    TextView tvSearch;
    @BindView(R.id.tv_top_bar_right2)
    TextView tvAdd;
    @BindView(R.id.tab_layout)
    TabLayout tabOptional;
    @BindView(R.id.view_pager)
    ViewPager vpOptional;

    private NewsAdapter adapter;
    private FragmentActivity activity;
    private List<String> titleList=new ArrayList<>();
    private ArrayList<Fragment> fragmentList = new ArrayList<>();

    @Override
    public int getLayoutResource() {
        return R.layout.include_tab_pager;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        tvTopBarLeft.setVisibility(View.GONE);
        tvTopBarMiddle.setText("自选股");
        tvTopBarMiddle.setCompoundDrawables(null,null,null,null);
        tvSearch.setVisibility(View.VISIBLE);
        tvAdd.setVisibility(View.VISIBLE);
    }

    @Override
    public void initData() {
        titleList.add("个股");
        titleList.add("基金");
        titleList.add("主题");
        titleList.add("组合");
        //初始化不同的fragment
        fragmentList.add(new StockFragment());
        fragmentList.add(new FundFragment());
        fragmentList.add(new ThemeFragment());
        fragmentList.add(new GroupFragment());

        if (adapter == null) { //创建fragment
            adapter = new NewsAdapter(activity.getSupportFragmentManager(), fragmentList, titleList);
        } else {//刷新fragment
            adapter.setFragments(activity.getSupportFragmentManager(), fragmentList, titleList);
        }

        vpOptional.setAdapter(adapter);
        tabOptional.setupWithViewPager(vpOptional);
        CommonUtils.dynamicSetTabLayoutMode(tabOptional);
    }

    @OnClick({R.id.tv_top_bar_left, R.id.tv_top_bar_right, R.id.tv_top_bar_right2})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left:
                Intent userIntent = new Intent(activity, UserActivity.class);
                startActivity(userIntent);
                break;
            case R.id.tv_top_bar_right://搜索
                Intent searchIntent=new Intent(activity,SearchActivity.class);
                startActivity(searchIntent);
                break;
            case R.id.tv_top_bar_right2://创建组合
                Intent groupIntent=new Intent(activity,CreateGroupActivity.class);
                startActivity(groupIntent);
                break;
            default:
        }
    }

    //切换到组合列表页
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void process(BooleanEvent event) {
        String type = event.getType();
        if (event.isFlag()) {
            if (type.equals("group"))
                vpOptional.setCurrentItem(3);
        }
    }

    //注册事件总线
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EventBus.getDefault().register(this);
    }

    //解除事件总线
    @Override
    public void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
    }
}
