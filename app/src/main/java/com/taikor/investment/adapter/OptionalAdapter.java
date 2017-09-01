package com.taikor.investment.adapter;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import java.util.List;

/**
 * 自选
 * Created by Any on 2017/8/2.
 */

public class OptionalAdapter extends FragmentPagerAdapter {

    private List<Fragment> fragments;
    private String[] titles;

    public OptionalAdapter(FragmentManager fm, List<Fragment> fragments, String[] titles) {
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
}
