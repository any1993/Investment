package com.taikor.investment.adapter;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.app.FragmentTransaction;

import java.util.List;

/**
 * 产品列表适配器
 * Created by Any on 2017/4/5.
 */

public class FundListAdapter extends FragmentPagerAdapter {

    private List<Fragment> fragments;
    private String[] titles;

    public FundListAdapter(FragmentManager fm, List<Fragment> fragments, String[] titles) {
        super(fm);
        this.fragments = fragments;
        this.titles = titles;
    }

    @Override
    public Fragment getItem(int position) {
        return fragments.get(position);
    }

    @Override
    public int getCount() {
        return fragments == null ? 0 : fragments.size();
    }

    @Override
    public CharSequence getPageTitle(int position) {
        return titles != null ? titles[position] : super.getPageTitle(position);
    }

    //刷新fragment
    public void setFragments(FragmentManager fm, List<Fragment> fragments, String[] titles) {
        this.titles = titles;
        if (this.fragments != null) {
            FragmentTransaction ft = fm.beginTransaction();
            for (Fragment f : this.fragments) {
                ft.remove(f);
            }
            ft.commitAllowingStateLoss();
            ft = null;
            fm.executePendingTransactions();
        }
        this.fragments = fragments;
        notifyDataSetChanged();
    }


}
