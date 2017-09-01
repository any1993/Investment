package com.taikor.investment.news;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.widget.TextView;

import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.R;
import com.taikor.investment.adapter.NewsAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.Channel;
import com.taikor.investment.find.SearchActivity;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 资讯
 * Created by Any on 2017/7/27.
 */

public class NewsFragment extends BaseFragment {

    @BindView(R.id.tv_top_bar_left)
    TextView tvTopBarLeft;
    @BindView(R.id.tv_top_bar_middle)
    TextView tvTopBarMiddle;
    @BindView(R.id.tv_top_bar_right)
    TextView tvSearch;
    @BindView(R.id.tab_news)
    TabLayout tabNews;
    @BindView(R.id.vp_news)
    ViewPager vpNews;

    private String token;
    private FragmentActivity activity;
    private NewsAdapter newsAdapter;

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_news;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        tvTopBarLeft.setVisibility(View.GONE);
        tvTopBarMiddle.setText("资讯");
        tvTopBarMiddle.setCompoundDrawables(null, null, null, null);
        tvSearch.setVisibility(View.VISIBLE);
    }

    @Override
    public void initData() {
        getChannelData();
    }

    @OnClick(R.id.tv_top_bar_right)
    public void click() {
        Intent searchIntent = new Intent(activity, SearchActivity.class);
        startActivity(searchIntent);
    }

    //获取频道信息
    public void getChannelData() {
        OkGo.<Channel>get(Constant.CHANNEL)
                .tag(activity)
                .headers("Authorization", token)
                .params("userID", Constant.USER_ID)
                .params("hash", "")
                .params("version", "1.1")
                .execute(new JsonCallBack<Channel>(Channel.class) {
                    @Override
                    public void onSuccess(Response<Channel> response) {
                        if (response == null) return;
                        Channel channel = response.body();
                        setAdapter(channel.getCategorys());
                    }
                });

    }

    //设置适配器
    private void setAdapter(List<Channel.CategorysBean> categoryList) {
        if(categoryList.size()==0) return;
        List<String> channelList = new ArrayList<>();
        List<Fragment> fragmentList = new ArrayList<>();
        channelList.add("推荐");
        channelList.add("热点");
        channelList.add("专题");
        channelList.add("推送");
        fragmentList.add(new RecommendFragment());
        fragmentList.add(new SpotFragment());
        fragmentList.add(new TopicFragment());
        fragmentList.add(new PushFragment());
        for (int i = 4; i < categoryList.size(); i++) {
            channelList.add(categoryList.get(i).getName());
            fragmentList.add(createFragment(categoryList.get(i).getOrder()));
        }

        if (newsAdapter == null) { //创建fragment
            newsAdapter = new NewsAdapter(activity.getSupportFragmentManager(), fragmentList, channelList);
        } else {//刷新fragment
            newsAdapter.setFragments(getChildFragmentManager(), fragmentList, channelList);
        }

        vpNews.setAdapter(newsAdapter);
        tabNews.setupWithViewPager(vpNews);
        CommonUtils.dynamicSetTabLayoutMode(tabNews);
    }

    //创建Fragment
    private Fragment createFragment(int order) {
        GeneralFragment fragment = new GeneralFragment();
        Bundle bundle = new Bundle();
        bundle.putInt("order", order);
        fragment.setArguments(bundle);
        return fragment;
    }

}
